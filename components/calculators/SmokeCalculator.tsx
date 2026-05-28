'use client'

import React, { useState } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { ComparisonList } from '@/components/ui/ComparisonList'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { ShareCardBase } from '@/components/share/ShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { compoundMonthly } from '@/lib/calculations/compound'
import { formatBRL } from '@/lib/formatters'
import { comments } from '@/lib/contextualComments'
import { RATES } from '@/config/rates'

const comparisons = [
  { icon: '🏥', label: 'Plano de saúde básico', value: 250, unit: 'meses' },
  { icon: '📱', label: 'Celular intermediário à vista (÷12)', value: 100, unit: 'meses' },
  { icon: '📚', label: 'Livros por mês', value: 45, unit: 'livros' },
  { icon: '✈️', label: 'Viagens domésticas/ano', value: 800 / 12, unit: 'meses' },
]

type ProductType = 'cigarro' | 'vape'

export function SmokeCalculator() {
  const [productType, setProductType] = useState<ProductType>('cigarro')
  const [cigarettesPerDay, setCigarettesPerDay] = useState(10)
  const [packPrice, setPackPrice] = useState(14)
  // Vape: custo do pod/refil e quantos dias ele dura
  const [podCost, setPodCost] = useState(60)
  const [podDays, setPodDays] = useState(4)

  const PACK_SIZE = 20
  const dailyCost = productType === 'cigarro'
    ? (cigarettesPerDay / PACK_SIZE) * packPrice
    : podCost / podDays
  const monthlyCost = dailyCost * 30
  const annualCost = monthlyCost * 12

  const cost10y = annualCost * 10
  const cost30y = annualCost * 30
  const invested10y = compoundMonthly(monthlyCost, 10, RATES.selic)
  const invested30y = compoundMonthly(monthlyCost, 30, RATES.selic)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      <div className="lg:col-span-5">
        <CalculatorCard title="Custo do Fumo" subtitle="Cigarro, vape ou pod — a conta não mente.">

          {/* Product type toggle */}
          <div className="grid grid-cols-2 gap-2">
            {(['cigarro', 'vape'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setProductType(type)}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  productType === type
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300'
                }`}
              >
                {type === 'cigarro' ? '🚬 Cigarro' : '💨 Vape / Pod'}
              </button>
            ))}
          </div>

          {productType === 'cigarro' ? (
            <>
              <SliderField
                id="cigarettes-day"
                label="Cigarros por dia"
                value={cigarettesPerDay}
                min={1}
                max={40}
                step={1}
                onChange={setCigarettesPerDay}
                formatValue={(v) => `${v} ${v === 1 ? 'cigarro' : 'cigarros'}`}
              />
              <SliderField
                id="pack-price"
                label="Preço do maço (20 unidades)"
                value={packPrice}
                min={8}
                max={45}
                step={1}
                onChange={setPackPrice}
              />
            </>
          ) : (
            <>
              <SliderField
                id="pod-cost"
                label="Custo do pod / refil / descartável"
                value={podCost}
                min={20}
                max={250}
                step={5}
                onChange={setPodCost}
              />
              <SliderField
                id="pod-days"
                label="Quantos dias cada pod dura"
                value={podDays}
                min={1}
                max={21}
                step={1}
                onChange={setPodDays}
                formatValue={(v) => `${v} ${v === 1 ? 'dia' : 'dias'}`}
              />
              <p className="text-[11px] text-stone-400 -mt-2">
                Pod descartável (Elf Bar, Vuse, etc.): R$60–150. Pod recarregável (Juul, Vaporesso): R$20–80. Líquido avulso: R$30–80/30ml.
              </p>
            </>
          )}
        </CalculatorCard>
      </div>

      <div role="region" aria-live="polite" aria-label="Resultado do cálculo" className="space-y-4 lg:col-span-7">
        <ResultHero
          label="Gasto mensal com cigarro"
          value={formatBRL(monthlyCost)}
          comment={comments.fumoMensal(monthlyCost)}
          colorClass="text-orange-500"
        />

        <MetricGrid
          metrics={[
            { label: 'Por dia', value: formatBRL(dailyCost), colorClass: 'text-stone-900' },
            { label: 'Por ano', value: formatBRL(annualCost), colorClass: 'text-orange-500' },
            { label: 'Em 10 anos', value: formatBRL(cost10y), colorClass: 'text-red-500' },
          ]}
        />

        <SectionDivider label="Se investido na Selic" />

        <MetricGrid
          metrics={[
            { label: 'Após 10 anos', value: formatBRL(invested10y), sublabel: 'investindo o mesmo valor', colorClass: 'text-emerald-600' },
            { label: 'Após 30 anos', value: formatBRL(invested30y), sublabel: 'juros compostos', colorClass: 'text-emerald-600' },
            { label: 'Diferença (30a)', value: formatBRL(invested30y - cost30y), sublabel: 'a favor do investimento', colorClass: 'text-amber-500' },
          ]}
        />

        <ComparisonList monthlyAmount={monthlyCost} comparisons={comparisons} title="Com esse valor mensal você pagaria" />

        <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--c-surface)' }}>
          <p className="text-xs mb-3 text-center" style={{ color: 'var(--c-muted)' }}>Compartilhe o resultado</p>
          <ScaledPreview>
            <ShareCardBase
              id="smoke-share-card"
              eyebrow={productType === 'cigarro' ? 'custo do cigarro' : 'custo do vape'}
              mainValue={formatBRL(monthlyCost) + '/mês'}
              mainLabel={productType === 'cigarro'
                ? `${cigarettesPerDay} cigarros/dia · maço a ${formatBRL(packPrice)}`
                : `pod de ${formatBRL(podCost)} a cada ${podDays} ${podDays === 1 ? 'dia' : 'dias'}`
              }
              metrics={[
                { label: 'por ano', value: formatBRL(annualCost) },
                { label: 'em 10 anos', value: formatBRL(cost10y) },
                { label: 'investido 10a', value: formatBRL(invested10y) },
                { label: 'investido 30a', value: formatBRL(invested30y) },
              ]}
              footer="nem parece muito. mas a conta chega."
              accentColor="#fb923c"
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="smoke-share-card" filename="fumo" />
          </div>
        </div>

        <p className="text-xs text-stone-400 text-center">
          Selic utilizada: {(RATES.selic * 100).toFixed(2)}% a.a. — {RATES.lastUpdated}. Valores são estimativas.
        </p>
      </div>
    </div>
  )
}
