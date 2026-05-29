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
import { CITIES_COST_DATABASE, CityCostData } from '@/config/cities-cost'
import { HelpCircle, ArrowRightLeft, TrendingDown, TrendingUp, Info, Home, Utensils, Compass, Scale } from 'lucide-react'

export function CostOfLivingCalculator() {
  // Input states
  const [originName, setOriginName] = useState<string>('São Paulo')
  const [destName, setDestName] = useState<string>('Salvador')
  const [currentCost, setCurrentCost] = useState<number>(4000)

  // Budget Weights (Moradia, Alimentação, Serviços - sum up to 100%)
  const [housingWeight, setHousingWeight] = useState<number>(40) // 40%
  const [foodWeight, setFoodWeight] = useState<number>(30) // 30%

  const servicesWeight = useMemo(() => {
    return Math.max(10, 100 - housingWeight - foodWeight)
  }, [housingWeight, foodWeight])

  // Get data for selected cities
  const originCity = useMemo(() => {
    return CITIES_COST_DATABASE.find(c => c.name === originName) || CITIES_COST_DATABASE[0]
  }, [originName])

  const destCity = useMemo(() => {
    return CITIES_COST_DATABASE.find(c => c.name === destName) || CITIES_COST_DATABASE[0]
  }, [destName])

  // Sort database alphabetically for easy dropdown selection
  const sortedCities = useMemo(() => {
    return [...CITIES_COST_DATABASE].sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  // Calculate results
  const results = useMemo(() => {
    if (currentCost <= 0) return null

    // Base costs in Origin
    const origHousing = currentCost * (housingWeight / 100)
    const origFood = currentCost * (foodWeight / 100)
    const origServices = currentCost * (servicesWeight / 100)

    // Equivalent costs in Destination based on relative indices
    const destHousing = origHousing * (destCity.housingIndex / originCity.housingIndex)
    const destFood = origFood * (destCity.foodIndex / originCity.foodIndex)
    const destServices = origServices * (destCity.servicesIndex / originCity.servicesIndex)

    const totalDestCost = destHousing + destFood + destServices
    const percentDiff = ((totalDestCost - currentCost) / currentCost) * 100
    const diffValue = Math.abs(totalDestCost - currentCost)
    
    // Category variations
    const housingVar = ((destCity.housingIndex - originCity.housingIndex) / originCity.housingIndex) * 100
    const foodVar = ((destCity.foodIndex - originCity.foodIndex) / originCity.foodIndex) * 100
    const servicesVar = ((destCity.servicesIndex - originCity.servicesIndex) / originCity.servicesIndex) * 100

    return {
      origHousing,
      origFood,
      origServices,
      destHousing: Number(destHousing.toFixed(2)),
      destFood: Number(destFood.toFixed(2)),
      destServices: Number(destServices.toFixed(2)),
      totalDestCost: Number(totalDestCost.toFixed(2)),
      percentDiff: Number(percentDiff.toFixed(1)),
      diffValue: Number(diffValue.toFixed(2)),
      isCheaper: totalDestCost < currentCost,
      housingVar: Number(housingVar.toFixed(1)),
      foodVar: Number(foodVar.toFixed(1)),
      servicesVar: Number(servicesVar.toFixed(1)),
    }
  }, [currentCost, originCity, destCity, housingWeight, foodWeight, servicesWeight])

  // Adjust housing weight slider (ensure sum of weights <= 90%)
  const handleHousingChange = (val: number) => {
    setHousingWeight(val)
    if (val + foodWeight > 90) {
      setFoodWeight(90 - val)
    }
  }

  // Adjust food weight slider (ensure sum of weights <= 90%)
  const handleFoodChange = (val: number) => {
    setFoodWeight(val)
    if (val + housingWeight > 90) {
      setHousingWeight(90 - val)
    }
  }

  // Swaps origin and destination cities
  const handleSwap = () => {
    const temp = originName
    setOriginName(destName)
    setDestName(temp)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      {/* ── COLUNA ESQUERDA: PARÂMETROS ────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        <CalculatorCard 
          title="Escolha as Cidades" 
          subtitle="Selecione as cidades e distribua suas despesas habituais para um cálculo personalizado."
        >
          {/* Seletor de Cidades com Swap */}
          <div className="space-y-4 relative">
            {/* Cidade de Origem */}
            <div className="space-y-1.5">
              <label htmlFor="origin-city" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                Cidade de Origem (De onde você está saindo)
              </label>
              <select
                id="origin-city"
                value={originName}
                onChange={(e) => setOriginName(e.target.value)}
                className="w-full border rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
              >
                {sortedCities.map((c) => (
                  <option key={`orig-${c.name}`} value={c.name}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button visual floating */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                type="button"
                onClick={handleSwap}
                className="w-8 h-8 rounded-full border flex items-center justify-center bg-white dark:bg-stone-900 shadow-md hover:scale-105 transition-transform cursor-pointer"
                style={{ borderColor: 'var(--c-line)', color: 'var(--c-muted)' }}
                aria-label="Inverter Cidades"
              >
                <ArrowRightLeft size={14} className="rotate-90" />
              </button>
            </div>

            {/* Cidade de Destino */}
            <div className="space-y-1.5">
              <label htmlFor="dest-city" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                Cidade de Destino (Para onde você vai)
              </label>
              <select
                id="dest-city"
                value={destName}
                onChange={(e) => setDestName(e.target.value)}
                className="w-full border rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
              >
                {sortedCities.map((c) => (
                  <option key={`dest-${c.name}`} value={c.name}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custo de Vida Atual */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label htmlFor="current-cost" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
                Seu Custo de Vida Mensal Atual
              </label>
              <div className="relative w-36">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="current-cost"
                  type="number"
                  value={currentCost === 0 ? '' : currentCost}
                  placeholder="0,00"
                  onChange={(e) => setCurrentCost(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full text-right border rounded-xl pr-3 pl-8 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
                />
              </div>
            </div>
          </div>
        </CalculatorCard>

        {/* Card 2: Distribuição de Despesas (Ajuste Fino) */}
        <CalculatorCard title="Distribuição do seu Orçamento" subtitle="Personalize os pesos das categorias para refletir seu padrão de consumo real.">
          
          {/* Slider Moradia */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span className="flex items-center gap-1"><Home size={12} /> Moradia / Aluguel</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">{housingWeight}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={housingWeight}
              onChange={(e) => handleHousingChange(Number(e.target.value))}
              aria-label="Moradia Peso"
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
          </div>

          {/* Slider Alimentação */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span className="flex items-center gap-1"><Utensils size={12} /> Alimentação</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">{foodWeight}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={foodWeight}
              onChange={(e) => handleFoodChange(Number(e.target.value))}
              aria-label="Alimentação Peso"
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
          </div>

          {/* Serviços e Lazer (Exibição residual estática) */}
          <div className="pt-2 border-t flex justify-between items-center text-xs font-semibold" style={{ borderColor: 'var(--c-line)', color: 'var(--c-muted)' }}>
            <span className="flex items-center gap-1"><Compass size={12} /> Serviços, Lazer e Transporte</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">{servicesWeight}%</span>
          </div>

        </CalculatorCard>

        {/* Nota explicativa de fonte */}
        <div className="rounded-2xl border p-4 flex gap-3 bg-stone-500/5 text-xs text-stone-500" style={{ borderColor: 'var(--c-line)' }}>
          <Info className="shrink-0 text-stone-500" size={18} style={{ color: 'var(--c-muted)' }} />
          <div className="space-y-1 leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            <p className="font-bold" style={{ color: 'var(--c-ink-2)' }}>Como funciona a comparação?</p>
            <p>
              Os índices são ponderados pelas cestas básicas do **DIEESE**, preços de aluguel por região do **FipeZap** e variações de serviços metropolitanos compilados. Como o Brasil não tem um banco único para 5 mil cidades, menores municípios do interior são agregados à média rural do seu respectivo estado para fins de representatividade estatística.
            </p>
          </div>
        </div>
      </div>

      {/* ── COLUNA DIREITA: RESULTADOS E COMPARAÇÕES ────────────── */}
      <div role="region" aria-live="polite" aria-label="Resultado do Comparativo" className="lg:col-span-7 space-y-4">
        
        {!results ? (
          <div className="rounded-3xl border border-stone-300 p-6 flex gap-3 text-stone-500 leading-relaxed text-sm">
            <HelpCircle className="shrink-0 text-stone-500" size={24} />
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Aguardando dados...</h3>
              <p className="text-xs mt-1">
                Digite o seu custo de vida atual para descobrir a diferença de custo e a economia projetada no destino.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Result Hero */}
            <ResultHero
              label={`Comparativo: ${originName} vs ${destName}`}
              value={results.percentDiff === 0 ? 'Custo Idêntico' : `${results.isCheaper ? '-' : '+'}${Math.abs(results.percentDiff).toString().replace('.', ',')}%`}
              comment={results.percentDiff === 0 
                ? `O custo médio de vida é estatisticamente idêntico entre as duas cidades.`
                : results.isCheaper 
                  ? `${destName} é mais barata! Você terá uma economia líquida estimada em ${formatBRL(results.diffValue)} por mês.`
                  : `${destName} é mais cara! Você precisará de mais ${formatBRL(results.diffValue)} mensais para manter seu padrão.`
              }
              colorClass={results.isCheaper ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-copper-600 dark:text-copper-400 font-bold'}
              infoTooltip="A porcentagem representa o diferencial médio acumulado de preços ponderados entre as duas cidades. Um valor negativo indica que a cidade destino oferece um custo de vida proporcionalmente inferior."
            />

            {/* Grid de Sub-métricas rápidas */}
            <MetricGrid
              metrics={[
                {
                  label: 'Orçamento Equivalente',
                  value: formatBRL(results.totalDestCost),
                  sublabel: `custo para o mesmo padrão em ${destName}`,
                  colorClass: results.isCheaper ? 'text-emerald-600' : 'text-copper-600',
                },
                {
                  label: 'Diferencial em Reais',
                  value: `${results.isCheaper ? '+' : '-'}${formatBRL(results.diffValue)}`,
                  sublabel: results.isCheaper ? 'saldo positivo mensal' : 'necessário a mais por mês',
                  colorClass: results.isCheaper ? 'text-emerald-600' : 'text-copper-600',
                },
                {
                  label: 'Índice de Custo Padrão',
                  value: `${((results.totalDestCost / currentCost) * 100).toFixed(0)}%`,
                  sublabel: `custo relativo (${originName} = 100%)`,
                  colorClass: 'text-stone-500',
                },
              ]}
            />

            {/* Comparativos de Custo por Categoria */}
            <div 
              className="rounded-2xl border p-5 space-y-4"
              style={{
                backgroundColor: 'var(--c-card-calm)',
                borderColor: 'var(--c-line)'
              }}
            >
              <div className="flex justify-between items-baseline" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 12 }}>
                <h3 className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Diferença por Categoria</h3>
                <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--c-muted)' }}>Variação de Preço</span>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: 'Moradia / Aluguel',
                    icon: Home,
                    originVal: results.origHousing,
                    destVal: results.destHousing,
                    variance: results.housingVar,
                    desc: 'Custo de aluguel, condomínio, IPTU e manutenção básica domiciliar.'
                  },
                  {
                    label: 'Alimentação',
                    icon: Utensils,
                    originVal: results.origFood,
                    destVal: results.destFood,
                    variance: results.foodVar,
                    desc: 'Preços de mantimentos de supermercado, feira livre e refeições fora de casa.'
                  },
                  {
                    label: 'Serviços, Transporte e Lazer',
                    icon: Compass,
                    originVal: results.origServices,
                    destVal: results.destServices,
                    variance: results.servicesVar,
                    desc: 'Custo de transporte público, gasolina, mensalidades de academia, internet e saídas de lazer.'
                  }
                ].map((cat, idx) => {
                  const isCheaper = cat.variance < 0
                  const isZero = cat.variance === 0
                  const Icon = cat.icon
                  
                  return (
                    <div key={idx} className="space-y-2 py-1.5 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="flex items-center gap-2" style={{ color: 'var(--c-ink)' }}>
                          <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--c-emerald-soft)', color: 'var(--c-emerald)' }}>
                            <Icon size={14} />
                          </div>
                          {cat.label}
                        </span>
                        
                        <div className="text-right">
                          <span className={`font-bold ${isZero ? 'text-stone-500' : isCheaper ? 'text-emerald-600 dark:text-emerald-400' : 'text-copper-600'}`}>
                            {isZero ? '0,0%' : `${isCheaper ? '' : '+'}${cat.variance.toString().replace('.', ',')}%`}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px]" style={{ color: 'var(--c-muted)' }}>
                        <span>De: {formatBRL(cat.originVal)} ({originName})</span>
                        <span>Para: {formatBRL(cat.destVal)} ({destName})</span>
                      </div>

                      {/* Visual progress bar comparison */}
                      <div className="h-1.5 rounded-full overflow-hidden flex" style={{ backgroundColor: 'var(--c-line)' }}>
                        {isCheaper ? (
                          <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (cat.destVal / cat.originVal) * 100)}%` }} />
                        ) : (
                          <div className="h-full bg-copper-500" style={{ width: '100%' }} />
                        )}
                      </div>
                      <p className="text-[9px] mt-1 italic" style={{ color: 'var(--c-muted-2)' }}>{cat.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Insight de Decisão Geográfica */}
            <div className="rounded-2xl border p-4 flex gap-3 bg-stone-500/5 text-xs text-stone-800 dark:text-stone-300 leading-relaxed" style={{ borderColor: 'var(--c-line)' }}>
              <Scale className="shrink-0 text-stone-500 animate-pulse-slow" size={20} style={{ color: 'var(--c-muted)' }} />
              <div>
                <p className="font-bold">Estratégia do Arbitragem de Custo de Vida 🌍</p>
                <p className="mt-1">
                  Trabalhar remotamente para uma empresa baseada em **{originName}** (recebendo salários maiores) enquanto reside em **{destName}** (com custo de vida {results.isCheaper ? 'inferior' : 'superior'}) é a maior alavanca de poupança financeira pessoal hoje no Brasil. Essa decisão permite acumular patrimônio **{results.isCheaper ? 'muito mais rápido' : 'com esforço muito maior'}**.
                </p>
              </div>
            </div>

            {/* Share wrapped card */}
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
              <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
                Compartilhe o Comparativo
              </p>
              <ScaledPreview>
                <ShareCardBase
                  id="cost-of-living-share"
                  eyebrow="Arbitragem Geográfica · Custo de Vida"
                  mainValue={results.percentDiff === 0 ? 'IDÊNTICO' : `${results.isCheaper ? '-' : '+'}${Math.abs(results.percentDiff).toString().replace('.', ',')}%`}
                  mainLabel={`diferencial de custo de vida entre Cidades`}
                  metrics={[
                    { label: `Custo em ${originName}`, value: formatBRL(currentCost) },
                    { label: `Custo em ${destName}`, value: formatBRL(results.totalDestCost) },
                    { label: 'Moradia e Aluguel', value: `${results.housingVar > 0 ? '+' : ''}${results.housingVar.toString().replace('.', ',')}%` },
                    { label: 'Saldo Mensal Médio', value: `${results.isCheaper ? '+' : '-'}${formatBRL(results.diffValue)}/mês` },
                  ]}
                  footer="Arbitragem geográfica sob a ponta do lápis."
                  accentColor={results.isCheaper ? '#10b981' : '#b4421b'}
                />
              </ScaledPreview>
              <div className="mt-3">
                <ShareButtons cardId="cost-of-living-share" filename="comparativo-custo-vida" />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
