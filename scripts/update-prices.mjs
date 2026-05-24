/**
 * Atualiza config/flight-prices.json buscando preços reais via Amadeus API.
 *
 * Uso local:
 *   AMADEUS_CLIENT_ID=xxx AMADEUS_CLIENT_SECRET=yyy node scripts/update-prices.mjs
 *
 * Variáveis de ambiente necessárias:
 *   AMADEUS_CLIENT_ID     — Client ID do app no Amadeus Self-Service
 *   AMADEUS_CLIENT_SECRET — Client Secret correspondente
 *
 * Para obter as credenciais:
 *   1. Acesse https://developers.amadeus.com/register
 *   2. Crie um app em "My Self-Service Workspace"
 *   3. Copie Client ID e Client Secret
 *   4. No GitHub: Settings → Secrets → Actions → adicione os dois secrets
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const PRICES_FILE = join(__dir, '../config/flight-prices.json')

// Ambiente: 'test' usa dados simulados (sem API key real), 'production' usa dados reais
const AMADEUS_ENV = process.env.AMADEUS_ENV ?? 'production'
const BASE_URL = AMADEUS_ENV === 'test'
  ? 'https://test.api.amadeus.com'
  : 'https://api.amadeus.com'

const CLIENT_ID = process.env.AMADEUS_CLIENT_ID
const CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ AMADEUS_CLIENT_ID e AMADEUS_CLIENT_SECRET são obrigatórios.')
  process.exit(1)
}

// Mapeamento destino → IATA code
const IATA = {
  'lisboa':              'LIS',
  'paris':               'CDG',
  'roma':                'FCO',
  'barcelona':           'BCN',
  'amsterdam':           'AMS',
  'londres':             'LHR',
  'praga':               'PRG',
  'miami':               'MIA',
  'nova-york':           'JFK',
  'orlando':             'MCO',
  'cancun':              'CUN',
  'buenos-aires':        'EZE',
  'santiago':            'SCL',
  'machu-picchu':        'LIM',  // Lima como gateway para Cusco
  'cartagena':           'CTG',
  'bali':                'DPS',
  'toquio':              'NRT',
  'dubai':               'DXB',
  'bangkok':             'BKK',
  'fernando-de-noronha': 'FEN',
  'gramado':             'POA',  // Porto Alegre + transfer
}

async function getToken() {
  const res = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Falha ao obter token Amadeus: ${err}`)
  }
  const data = await res.json()
  return data.access_token
}

// Retorna datas de partida para consulta: 60, 90 e 120 dias a partir de hoje
function getFutureDates() {
  const dates = []
  const today = new Date()
  for (const offset of [60, 90, 120]) {
    const d = new Date(today)
    d.setDate(d.getDate() + offset)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

async function fetchPricesForDestination(token, destinationIATA, dates) {
  const allPrices = []

  for (const date of dates) {
    try {
      const params = new URLSearchParams({
        originLocationCode: 'GRU',
        destinationLocationCode: destinationIATA,
        departureDate: date,
        adults: '1',
        nonStop: 'false',
        max: '5',
        currencyCode: 'BRL',
      })

      const res = await fetch(`${BASE_URL}/v2/shopping/flight-offers?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) continue

      const data = await res.json()
      if (!data.data || data.data.length === 0) continue

      const prices = data.data.map((o) => Math.round(parseFloat(o.price.grandTotal)))
      allPrices.push(...prices)

      // Pausa para não estourar rate limit
      await new Promise((r) => setTimeout(r, 300))
    } catch {
      // Continua para próxima data se uma falhar
    }
  }

  if (allPrices.length === 0) return null

  allPrices.sort((a, b) => a - b)
  const min = allPrices[0]
  const typical = allPrices[Math.floor(allPrices.length / 2)]

  return { min, typical }
}

async function main() {
  console.log(`🔑 Autenticando na Amadeus (${AMADEUS_ENV})...`)
  const token = await getToken()
  console.log('✅ Token obtido.\n')

  const current = JSON.parse(readFileSync(PRICES_FILE, 'utf-8'))
  const updated = { ...current.prices }
  const dates = getFutureDates()

  let successCount = 0
  let skipCount = 0

  for (const [id, iata] of Object.entries(IATA)) {
    process.stdout.write(`  ✈ ${id.padEnd(22)} (${iata}) → `)

    const prices = await fetchPricesForDestination(token, iata, dates)

    if (prices) {
      updated[id] = prices
      console.log(`R$ ${prices.min.toLocaleString('pt-BR')} – R$ ${prices.typical.toLocaleString('pt-BR')}`)
      successCount++
    } else {
      console.log(`sem dados (mantendo valores anteriores)`)
      skipCount++
    }
  }

  const today = new Date().toISOString().slice(0, 10)
  const result = {
    _meta: {
      lastUpdated: today,
      source: `amadeus-api-${AMADEUS_ENV}`,
      note: 'Atualizado automaticamente toda segunda-feira via GitHub Actions + Amadeus API',
    },
    prices: updated,
  }

  writeFileSync(PRICES_FILE, JSON.stringify(result, null, 2) + '\n')
  console.log(`\n✅ Preços atualizados: ${successCount} destinos. ${skipCount} sem dados (valores anteriores mantidos).`)
  console.log(`📄 Arquivo salvo: config/flight-prices.json`)
}

main().catch((err) => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
