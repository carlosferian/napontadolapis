'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareCardBase } from '@/components/share/ShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { formatBRL } from '@/lib/formatters'
import { LOYALTY_PROGRAMS, calculateEmissionComparison, calculatePurchaseComparison, EmissionCalculationInput, PurchaseCalculationInput } from '@/config/miles'
import { Info, Sparkles, Plane, Coins, Award, Flame, AlertCircle } from 'lucide-react'

export function MilesCalculator() {
  const [activeTab, setActiveTab] = useState<'emission' | 'purchase'>('emission')
  
  // Aba 1: Estados de Emissão
  const [priceInCash, setPriceInCash] = useState<number>(1200)
  const [milesRequired, setMilesRequired] = useState<number>(40000)
  const [boardingTax, setBoardingTax] = useState<number>(150)
  const [emissionProgram, setEmissionProgram] = useState<string>('SMILES')
  const [customEmissionValue, setCustomEmissionValue] = useState<number>(20.00)

  // Aba 2: Estados de Compra
  const [costOfPromotion, setCostOfPromotion] = useState<number>(280)
  const [milesReceived, setMilesReceived] = useState<number>(10000)
  const [purchaseProgram, setPurchaseProgram] = useState<string>('LIVELO')
  const [customPurchaseValue, setCustomPurchaseValue] = useState<number>(35.00)

  // 1. Cálculos de Emissão
  const emissionInput = useMemo<EmissionCalculationInput>(() => ({
    priceInCash,
    milesRequired,
    boardingTax,
    programCode: emissionProgram,
    customMileValue: customEmissionValue
  }), [priceInCash, milesRequired, boardingTax, emissionProgram, customEmissionValue])

  const emissionResults = useMemo(() => {
    return calculateEmissionComparison(emissionInput)
  }, [emissionInput])

  // 2. Cálculos de Compra
  const purchaseInput = useMemo<PurchaseCalculationInput>(() => ({
    costOfPromotion,
    milesReceived,
    programCode: purchaseProgram,
    customMileValue: customPurchaseValue
  }), [costOfPromotion, milesReceived, purchaseProgram, customPurchaseValue])

  const purchaseResults = useMemo(() => {
    return calculatePurchaseComparison(purchaseInput)
  }, [purchaseInput])

  const selectedEmissionProgram = useMemo(() => {
    return LOYALTY_PROGRAMS.find(p => p.code === emissionProgram)
  }, [emissionProgram])

  const selectedPurchaseProgram = useMemo(() => {
    return LOYALTY_PROGRAMS.find(p => p.code === purchaseProgram)
  }, [purchaseProgram])

  return (
    <div className="space-y-6">
      
      {/* Alternador das Abas Principais */}
      <div className="rounded-2xl border p-1.5 flex gap-1 bg-stone-500/5 max-w-lg mx-auto" style={{ borderColor: 'var(--c-line)' }}>
        <button
          type="button"
          onClick={() => setActiveTab('emission')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${activeTab === 'emission' ? 'bg-white dark:bg-stone-800 shadow-sm border text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}
          style={{ borderColor: activeTab === 'emission' ? 'var(--c-line)' : 'transparent' }}
        >
          ✈️ Milhas vs. Dinheiro
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('purchase')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${activeTab === 'purchase' ? 'bg-white dark:bg-stone-800 shadow-sm border text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}
          style={{ borderColor: activeTab === 'purchase' ? 'var(--c-line)' : 'transparent' }}
        >
          🪙 Comprar Milhas (Promoção)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        {/* ── COLUNA ESQUERDA: PARÂMETROS ────────────────────────── */}
        <div className="lg:col-span-5 space-y-4">
          
          {activeTab === 'emission' ? (
            // FORMULÁRIO DE EMISSÃO
            <CalculatorCard 
              title="Dados da Passagem" 
              subtitle="Insira o valor em dinheiro e os parâmetros em milhas para comparar os custos de emissão."
            >
              {/* Preço em Dinheiro */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="price-cash" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                    Passagem em Dinheiro (Final c/ taxas)
                  </label>
                  <span className="text-sm font-bold text-stone-950 dark:text-white">
                    {formatBRL(priceInCash)}
                  </span>
                </div>
                <input
                  id="price-cash"
                  type="range"
                  min={100}
                  max={15000}
                  step={50}
                  value={priceInCash}
                  onChange={(e) => setPriceInCash(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  style={{ backgroundColor: 'var(--c-line)' }}
                />
                <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
                  <span>R$ 100</span>
                  <span>R$ 15 mil</span>
                </div>
              </div>

              {/* Milhas Necessárias */}
              <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--c-line)' }}>
                <div className="flex justify-between items-baseline">
                  <label htmlFor="miles-required" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                    Milhas Exigidas
                  </label>
                  <span className="text-sm font-bold text-[var(--c-emerald)] dark:text-emerald-400">
                    {(milesRequired).toLocaleString('pt-BR')} milhas
                  </span>
                </div>
                <input
                  id="miles-required"
                  type="range"
                  min={1000}
                  max={500000}
                  step={1000}
                  value={milesRequired}
                  onChange={(e) => setMilesRequired(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  style={{ backgroundColor: 'var(--c-line)' }}
                />
                <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
                  <span>1.000</span>
                  <span>500 mil</span>
                </div>
              </div>

              {/* Taxa de Embarque Milhas */}
              <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--c-line)' }}>
                <div className="flex justify-between items-baseline">
                  <label htmlFor="boarding-tax" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                    Taxa de Embarque em Milhas
                  </label>
                  <span className="text-sm font-bold text-stone-950 dark:text-white">
                    {formatBRL(boardingTax)}
                  </span>
                </div>
                <input
                  id="boarding-tax"
                  type="range"
                  min={30}
                  max={1500}
                  step={10}
                  value={boardingTax}
                  onChange={(e) => setBoardingTax(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  style={{ backgroundColor: 'var(--c-line)' }}
                />
                <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
                  <span>R$ 30</span>
                  <span>R$ 1.500</span>
                </div>
              </div>

              {/* Programa de Fidelidade */}
              <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--c-line)' }}>
                <label htmlFor="emission-program-select" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                  Programa de Fidelidade
                </label>
                <select
                  id="emission-program-select"
                  value={emissionProgram}
                  onChange={(e) => setEmissionProgram(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer animate-fadeIn"
                  style={{
                    backgroundColor: 'var(--c-bg)',
                    color: 'var(--c-ink)',
                    borderColor: 'var(--c-line)'
                  }}
                >
                  <optgroup label="Custo Médio de Mercado (1.000 Milhas)" style={{ fontWeight: 'bold' }}>
                    {LOYALTY_PROGRAMS.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name} — R$ {p.averageValuePerThousand.toFixed(2).replace('.', ',')} / mil
                      </option>
                    ))}
                  </optgroup>
                  <option value="custom">Outro / Valor Customizado</option>
                </select>
              </div>

              {/* Custo Customizado */}
              {emissionProgram === 'custom' && (
                <div className="space-y-2 pt-3 border-t animate-fadeIn" style={{ borderColor: 'var(--c-line)' }}>
                  <div className="flex justify-between items-baseline">
                    <label htmlFor="custom-emission-val" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                      Seu custo por 1.000 Milhas (CPP)
                    </label>
                    <span className="text-sm font-bold text-[var(--c-emerald)] dark:text-emerald-400">
                      {formatBRL(customEmissionValue)}
                    </span>
                  </div>
                  <input
                    id="custom-emission-val"
                    type="range"
                    min={5}
                    max={80}
                    step={0.5}
                    value={customEmissionValue}
                    onChange={(e) => setCustomEmissionValue(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    style={{ backgroundColor: 'var(--c-line)' }}
                  />
                  <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
                    <span>R$ 5 (Mínimo)</span>
                    <span>R$ 80 (Máximo)</span>
                  </div>
                </div>
              )}
            </CalculatorCard>
          ) : (
            // FORMULÁRIO DE COMPRA DE MILHAS
            <CalculatorCard 
              title="Dados da Promoção" 
              subtitle="Insira os custos cobrados e a quantidade de pontos que receberá para avaliar a promoção."
            >
              {/* Custo Promocional */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="cost-promo" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                    Valor Total da Compra (R$)
                  </label>
                  <span className="text-sm font-bold text-stone-950 dark:text-white">
                    {formatBRL(costOfPromotion)}
                  </span>
                </div>
                <input
                  id="cost-promo"
                  type="range"
                  min={10}
                  max={15000}
                  step={50}
                  value={costOfPromotion}
                  onChange={(e) => setCostOfPromotion(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  style={{ backgroundColor: 'var(--c-line)' }}
                />
                <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
                  <span>R$ 10</span>
                  <span>R$ 15 mil</span>
                </div>
              </div>

              {/* Quantidade Recebida */}
              <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--c-line)' }}>
                <div className="flex justify-between items-baseline">
                  <label htmlFor="miles-received-val" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                    Total de Milhas/Pontos Recebidos
                  </label>
                  <span className="text-sm font-bold text-[var(--c-emerald)] dark:text-emerald-400">
                    {(milesReceived).toLocaleString('pt-BR')} milhas
                  </span>
                </div>
                <input
                  id="miles-received-val"
                  type="range"
                  min={1000}
                  max={500000}
                  step={1000}
                  value={milesReceived}
                  onChange={(e) => setMilesReceived(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  style={{ backgroundColor: 'var(--c-line)' }}
                />
                <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
                  <span>1.000</span>
                  <span>500 mil</span>
                </div>
              </div>

              {/* Programa de Fidelidade Compra */}
              <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--c-line)' }}>
                <label htmlFor="purchase-program-select" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                  Programa da Promoção
                </label>
                <select
                  id="purchase-program-select"
                  value={purchaseProgram}
                  onChange={(e) => setPurchaseProgram(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer animate-fadeIn"
                  style={{
                    backgroundColor: 'var(--c-bg)',
                    color: 'var(--c-ink)',
                    borderColor: 'var(--c-line)'
                  }}
                >
                  <optgroup label="Valor de Venda Recomendado (1.000 Milhas)" style={{ fontWeight: 'bold' }}>
                    {LOYALTY_PROGRAMS.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name} — R$ {p.averageValuePerThousand.toFixed(2).replace('.', ',')} / mil
                      </option>
                    ))}
                  </optgroup>
                  <option value="custom">Outro / Valor Customizado</option>
                </select>
              </div>

              {/* Custo Customizado Compra */}
              {purchaseProgram === 'custom' && (
                <div className="space-y-2 pt-3 border-t animate-fadeIn" style={{ borderColor: 'var(--c-line)' }}>
                  <div className="flex justify-between items-baseline">
                    <label htmlFor="custom-purchase-val" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                      Valor de Mercado de 1.000 Milhas (CPP)
                    </label>
                    <span className="text-sm font-bold text-[var(--c-emerald)] dark:text-emerald-400">
                      {formatBRL(customPurchaseValue)}
                    </span>
                  </div>
                  <input
                    id="custom-purchase-val"
                    type="range"
                    min={5}
                    max={80}
                    step={0.5}
                    value={customPurchaseValue}
                    onChange={(e) => setCustomPurchaseValue(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    style={{ backgroundColor: 'var(--c-line)' }}
                  />
                  <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
                    <span>R$ 5 (Mínimo)</span>
                    <span>R$ 80 (Máximo)</span>
                  </div>
                </div>
              )}
            </CalculatorCard>
          )}

          {/* Nota técnica sobre Milhas */}
          <div className="rounded-2xl border p-4 flex gap-3 bg-stone-500/5" style={{ borderColor: 'var(--c-line)' }}>
            <Info className="shrink-0 text-stone-500" size={18} style={{ color: 'var(--c-muted)' }} />
            <div className="space-y-1 text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              <p className="font-semibold" style={{ color: 'var(--c-ink-2)' }}>O que é o CPP?</p>
              <p>
                CPP significa **Custo por Mil** (ou *Cost Per Point*). No mercado de fidelidade, a unidade padrão é o milhar (1.000 milhas/pontos). O CPP é a bússola para saber o custo ou benefício de cada transação imobiliária ou de voo.
              </p>
            </div>
          </div>
        </div>

        {/* ── COLUNA DIREITA: RESULTADOS ──────────────────────────── */}
        <div role="region" aria-live="polite" aria-label="Resultado das Milhas" className="lg:col-span-7 space-y-4">
          
          {activeTab === 'emission' ? (
            // EXIBIÇÃO DE RESULTADO DE EMISSÃO
            <>
              <ResultHero
                label="Economia ao Emitir com Milhas"
                value={emissionResults.shouldEmitWithMiles ? formatBRL(emissionResults.netSavings) : 'Compra em Dinheiro Recomendada'}
                comment={emissionResults.shouldEmitWithMiles 
                  ? `Emitir com milhas é a melhor escolha matemática! Você economizará cerca de ${emissionResults.percentSavings.toFixed(0)}% do valor cobrado em dinheiro.`
                  : `Emitir com milhas NESTE CENÁRIO é prejuízo! O custo das milhas utilizadas (${formatBRL(emissionResults.milesConvertedToCash)}) somado à taxa de embarque supera o preço em dinheiro. É melhor comprar em dinheiro.`
                }
                colorClass={emissionResults.shouldEmitWithMiles ? 'text-[var(--c-emerald)] dark:text-emerald-400 font-extrabold' : 'text-stone-500 font-bold'}
                infoTooltip="A economia líquida compara a emissão em milhas (valor de mercado estimado das milhas necessárias + taxa de embarque cobrada pelo programa) com o valor da passagem integral comprada em dinheiro."
              />

              <MetricGrid
                metrics={[
                  {
                    label: 'Custo Total em Milhas',
                    value: formatBRL(emissionResults.totalMilesEmissionCost),
                    sublabel: `milhas: ${formatBRL(emissionResults.milesConvertedToCash)} + taxa: ${formatBRL(boardingTax)}`,
                  },
                  {
                    label: 'CPP da Passagem',
                    value: `${formatBRL(emissionResults.cppOfEmission)} / mil`,
                    sublabel: `valor pago pelas suas milhas nesta emissão`,
                    colorClass: 'text-[var(--c-emerald)] dark:text-emerald-400 font-bold',
                  },
                  {
                    label: 'Custo do seu Milhar',
                    value: `${formatBRL(emissionResults.mileValueUsed)} / mil`,
                    sublabel: `referência para o programa ${emissionProgram === 'custom' ? 'Customizado' : selectedEmissionProgram?.name}`,
                    colorClass: 'text-[var(--c-muted)] dark:text-stone-400',
                  },
                ]}
              />

              {/* Bloco de Sacada do CPP de Emissão */}
              <div className="rounded-2xl border p-4 flex gap-3 bg-stone-500/5 text-xs text-stone-800 dark:text-stone-300 leading-relaxed" style={{ borderColor: 'var(--c-line)' }}>
                <Sparkles className="shrink-0 text-emerald-500" size={20} />
                <div>
                  <p className="font-bold">A Lógica do Milhar (CPP da Emissão) 💡</p>
                  <p className="mt-1" style={{ color: 'var(--c-muted)' }}>
                    Ao emitir essa passagem, o programa está "comprando" as suas milhas a um valor de **{formatBRL(emissionResults.cppOfEmission)}** por milhar. Como o valor de custo/mercado dessas milhas é de **{formatBRL(emissionResults.mileValueUsed)}**, você está gerando lucro na transação! Regra geral: **emita em milhas se o CPP da passagem for maior do que o seu custo de milhas.**
                  </p>
                </div>
              </div>
            </>
          ) : (
            // EXIBIÇÃO DE RESULTADO DE COMPRA
            <>
              <ResultHero
                label="Ganho Estimado na Compra"
                value={purchaseResults.isWorthBuying ? `R$ ${purchaseResults.netLossOrGain.toFixed(2).replace('.', ',')} por milhar` : 'Prejuízo / Promoção Desvantajosa'}
                comment={purchaseResults.isWorthBuying
                  ? `Comprar é altamente recomendado! Você está pagando ${formatBRL(purchaseResults.cppOfPurchase)} por milhar, o que é cerca de ${purchaseResults.percentDiff.toFixed(0)}% mais barato do que o valor real de mercado (${formatBRL(purchaseResults.marketValuePerThousand)}).`
                  : `NÃO COMPRE! Você está pagando ${formatBRL(purchaseResults.cppOfPurchase)} por 1.000 milhas nesta promoção. Porém, o milhar do programa ${purchaseProgram === 'custom' ? 'Customizado' : selectedPurchaseProgram?.name} vale em média apenas ${formatBRL(purchaseResults.marketValuePerThousand)} no mercado. Você sairá no prejuízo.`
                }
                colorClass={purchaseResults.isWorthBuying ? 'text-[var(--c-emerald)] dark:text-emerald-400 font-extrabold' : 'text-stone-500 font-bold'}
                infoTooltip="A avaliação calcula o CPP da promoção e compara diretamente com a média comercial praticada no mercado brasileiro para resgate em passagens aéreas."
              />

              <MetricGrid
                metrics={[
                  {
                    label: 'CPP da Promoção',
                    value: `${formatBRL(purchaseResults.cppOfPurchase)} / mil`,
                    sublabel: `custo real a cada 1.000 milhas compradas`,
                  },
                  {
                    label: 'Preço de Mercado',
                    value: `${formatBRL(purchaseResults.marketValuePerThousand)} / mil`,
                    sublabel: `média do milhar do programa ${purchaseProgram === 'custom' ? 'Customizado' : selectedPurchaseProgram?.name}`,
                    colorClass: 'text-[var(--c-emerald)] dark:text-emerald-400 font-bold',
                  },
                  {
                    label: 'Veredito Financeiro',
                    value: purchaseResults.isWorthBuying ? 'Lucrativo' : 'Armadilha',
                    sublabel: purchaseResults.isWorthBuying
                      ? `economia de ${formatBRL(purchaseResults.netLossOrGain * (milesReceived / 1000))} no lote total`
                      : `perda de ${formatBRL(Math.abs(purchaseResults.netLossOrGain) * (milesReceived / 1000))} no lote total`,
                    colorClass: purchaseResults.isWorthBuying ? 'text-[var(--c-emerald)] dark:text-emerald-400' : 'text-red-500',
                  },
                ]}
              />

              {/* Alerta de Desconto Fantasma */}
              <div className="rounded-2xl border p-4 flex gap-3 bg-stone-500/5 text-xs text-stone-800 dark:text-stone-300 leading-relaxed" style={{ borderColor: 'var(--c-line)' }}>
                <Flame className="shrink-0 text-amber-500 animate-pulse" size={20} />
                <div>
                  <p className="font-bold">Cuidado com o "Desconto Fantasma" 👻</p>
                  <p className="mt-1" style={{ color: 'var(--c-muted)' }}>
                    As companhias aéreas e bancos adoram anunciar *"Compre pontos com 70% de desconto!"*. No entanto, o preço base de tabela do milhar é inflado artificialmente para R$ 70,00. Mesmo com 70% de desconto, o milhar sai a R$ 21,00, o que muitas vezes é **mais caro** do que o valor real de mercado. **Confie sempre na matemática do CPP, não na porcentagem de desconto anunciada.**
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Section: Compartilhar o Wrapped de Milhas */}
          <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
            <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              Compartilhe a sua Análise Financeira
            </p>
            <ScaledPreview>
              <ShareCardBase
                id="miles-share-card"
                eyebrow={activeTab === 'emission' ? 'Milhas vs Dinheiro · O Ponta do Lápis' : 'Compra de Milhas · O Ponta do Lápis'}
                mainValue={activeTab === 'emission'
                  ? (emissionResults.shouldEmitWithMiles ? `MILHAS!` : `DINHEIRO!`)
                  : (purchaseResults.isWorthBuying ? `VALE COMPRAR!` : `NÃO COMPRE!`)
                }
                mainLabel={activeTab === 'emission'
                  ? (emissionResults.shouldEmitWithMiles 
                    ? `economia estimada de ${formatBRL(emissionResults.netSavings)} na passagem`
                    : `emissão em milhas dará prejuízo frente ao dinheiro`
                  )
                  : (purchaseResults.isWorthBuying
                    ? `CPP de ${formatBRL(purchaseResults.cppOfPurchase)} é menor que mercado (${formatBRL(purchaseResults.marketValuePerThousand)})`
                    : `CPP de ${formatBRL(purchaseResults.cppOfPurchase)} é mais caro que valor de mercado`
                  )
                }
                metrics={activeTab === 'emission' ? [
                  { label: 'Passagem em Dinheiro', value: formatBRL(priceInCash) },
                  { label: 'Milhas Necessárias', value: `${(milesRequired).toLocaleString('pt-BR')} milhas` },
                  { label: 'Custo Total em Milhas', value: formatBRL(emissionResults.totalMilesEmissionCost) },
                  { label: 'CPP da Passagem', value: `${formatBRL(emissionResults.cppOfEmission)} / mil` },
                ] : [
                  { label: 'Valor da Promoção', value: formatBRL(costOfPromotion) },
                  { label: 'Milhas Recebidas', value: `${(milesReceived).toLocaleString('pt-BR')} milhas` },
                  { label: 'CPP da Compra', value: `${formatBRL(purchaseResults.cppOfPurchase)} / mil` },
                  { label: 'Valor de Mercado', value: `${formatBRL(purchaseResults.marketValuePerThousand)} / mil` },
                ]}
                footer="toda a matemática de milhas e passagens sob a ponta do lápis."
                accentColor="#10b981"
              />
            </ScaledPreview>
            <div className="mt-3">
              <ShareButtons cardId="miles-share-card" filename="analise-conversao-milhas" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
