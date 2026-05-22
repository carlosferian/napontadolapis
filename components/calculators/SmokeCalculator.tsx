'use client'

import React, { useState } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { ComparisonList } from '@/components/ui/ComparisonList'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { ShareCardBase } from '@/components/share/ShareCard'
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

export function SmokeCalculator() {
  const [cigarettesPerDay, setCigarettesPerDay] = useState(10)
  const [packPrice, setPackPrice] = useState(14)

  const PACK_SIZE = 20
  const dailyCost = (cigarettesPerDay / PACK_SIZE) * packPrice
  const monthlyCost = dailyCost * 30
  const annualCost = dailyCost * 365

  const cost10y = annualCost * 10
  const cost30y = annualCost * 30
  const invested10y = compoundMonthly(monthlyCost, 10, RATES.selic)
  const invested30y = compoundMonthly(monthlyCost, 30, RATES.selic)

  return (
    <div className="space-y-4">
      <CalculatorCard title="Custo do Fumo" subtitle="Sem moralismo. Só a conta.">
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
      </CalculatorCard>

      <div role="region" aria-live="polite" aria-label="Resultado do cálculo" className="space-y-4">
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

        <div className="bg-stone-50 rounded-2xl p-4">
          <p className="text-xs text-stone-400 mb-3 text-center">Compartilhe o resultado</p>
          <div className="overflow-x-auto">
            <ShareCardBase
              id="smoke-share-card"
              eyebrow="custo do cigarro"
              mainValue={formatBRL(monthlyCost) + '/mês'}
              mainLabel={`${cigarettesPerDay} cigarros/dia · maço a ${formatBRL(packPrice)}`}
              metrics={[
                { label: 'por ano', value: formatBRL(annualCost) },
                { label: 'em 10 anos', value: formatBRL(cost10y) },
                { label: 'investido 10a', value: formatBRL(invested10y) },
                { label: 'investido 30a', value: formatBRL(invested30y) },
              ]}
              footer="nem parece muito. mas a conta chega."
              bgColor="#1c1007"
              accentColor="#fb923c"
            />
          </div>
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
