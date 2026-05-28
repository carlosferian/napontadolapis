import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const MARKET_FILE = join(__dir, '../config/market.ts')
const RATES_FILE = join(__dir, '../config/rates.ts')

async function fetchSGS(seriesCode) {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${seriesCode}/dados/ultimos/1?formato=json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Erro ao buscar serie SGS ${seriesCode}`)
  }
  const data = await res.json()
  if (!data || data.length === 0) {
    throw new Error(`Dados vazios para serie SGS ${seriesCode}`)
  }
  return parseFloat(data[0].valor)
}

function calculateIOF(year) {
  if (year <= 2022) return 6.38
  if (year === 2023) return 5.38
  if (year === 2024) return 4.38
  if (year === 2025) return 3.38
  if (year === 2026) return 2.38
  if (year === 2027) return 1.38
  return 0.0
}

async function main() {
  console.log('📊 Buscando taxas oficiais do Banco Central do Brasil...')

  // 1. Meta Selic definida pelo Copom (SGS 432)
  let selicRateVal = 10.50
  try {
    selicRateVal = await fetchSGS(432)
    console.log(`✅ SELIC Copom obtida: ${selicRateVal.toFixed(2)}% a.a.`)
  } catch (err) {
    console.warn(`⚠️ Não foi possível obter Meta Selic da API: ${err.message}. Usando valor padrão.`)
  }

  // 2. Dólar americano - comercial - venda (SGS 1)
  let usdRateVal = 5.20
  try {
    usdRateVal = await fetchSGS(1)
    console.log(`✅ USD/BRL obtido: ${usdRateVal.toFixed(2)}`)
  } catch (err) {
    console.warn(`⚠️ Não foi possível obter USD/BRL da API: ${err.message}. Usando valor padrão.`)
  }

  // 3. IPCA acumulado nos últimos 12 meses (SGS 13522)
  let ipcaRateVal = 4.83
  try {
    ipcaRateVal = await fetchSGS(13522)
    console.log(`✅ IPCA 12M obtido: ${ipcaRateVal.toFixed(2)}%`)
  } catch (err) {
    console.warn(`⚠️ Não foi possível obter IPCA 12M da API: ${err.message}. Usando valor padrão.`)
  }

  // 4. Calcular IOF Câmbio (Cartão de Crédito) com base no ano atual
  const today = new Date()
  const currentYear = today.getFullYear()
  const iofRateVal = calculateIOF(currentYear)
  console.log(`✅ IOF Câmbio calculado para o ano ${currentYear}: ${iofRateVal.toFixed(2)}%`)

  const formattedSelic = `${selicRateVal.toFixed(2).replace('.', ',')}% a.a.`
  const formattedUsd = usdRateVal.toFixed(2).replace('.', ',')
  const formattedIof = `${iofRateVal.toFixed(2).replace('.', ',')}%`
  const formattedIpca = `${ipcaRateVal.toFixed(2).replace('.', ',')}%`
  const formattedDate = today.toISOString().slice(0, 10)

  // 5. Escrever config/market.ts
  const marketContent = `// config/market.ts
// GERADO AUTOMATICAMENTE VIA GITHUB ACTIONS — NÃO EDITE DIRETAMENTE
export const MARKET_DATA = {
  apostas: 'R$ 130bi',
  selic: '${formattedSelic}',
  usd: '${formattedUsd}',
  iof: '${formattedIof}',
  ipca: '${formattedIpca}',
  lastUpdated: '${formattedDate}',
}
`
  writeFileSync(MARKET_FILE, marketContent)
  console.log('💾 Arquivo config/market.ts salvo.')

  // 6. Calcular taxas em decimais para config/rates.ts
  const selicDecimal = selicRateVal / 100
  const cdiDecimal = selicDecimal - 0.001 // Benchmark CDI é ~0.10% abaixo da Selic
  
  // Poupança: se Selic > 8.5% -> 0.5% a.m. + TR (aproximado a 7.5% a.a.). Se menor, 70% da Selic.
  const poupancaDecimal = selicRateVal > 8.5 ? 0.075 : selicDecimal * 0.7
  
  // Tesouro Direto (estimativa conservadora de Ativo de Risco Selic + spread / Pré-fixado)
  const tesouroDecimal = selicDecimal + 0.015 // Selic + 1.50% de prêmio médio

  const ratesContent = `// config/rates.ts
// GERADO AUTOMATICAMENTE VIA GITHUB ACTIONS — NÃO EDITE DIRETAMENTE
export const RATES = {
  // Selic > 8,5%: poupança = 0,5%/mês + TR ≈ 7,5% a.a. (Resolução BCB 4.930/2021)
  poupanca: ${poupancaDecimal.toFixed(4)},
  cdi: ${cdiDecimal.toFixed(4)},
  selic: ${selicDecimal.toFixed(4)},
  tesouroDireto: ${tesouroDecimal.toFixed(4)},
  lastUpdated: '${formattedDate.slice(0, 7)}',
}
`
  writeFileSync(RATES_FILE, ratesContent)
  console.log('💾 Arquivo config/rates.ts salvo.')
  console.log('✨ Atualização concluída com sucesso!')
}

main().catch((err) => {
  console.error('❌ Erro na execução:', err.message)
  process.exit(1)
})
