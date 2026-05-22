'use client'

import React, { useState } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { ShareCardBase } from '@/components/share/ShareCard'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { compoundMonthly } from '@/lib/calculations/compound'
import { formatBRL } from '@/lib/formatters'
import { RATES } from '@/config/rates'

const INVESTMENTS = [
  { key: 'poupanca', label: 'Poupança', rate: RATES.poupanca, color: '#f59e0b', note: '6,5% a.a.' },
  { key: 'selic', label: 'Selic / CDB 100%', rate: RATES.selic, color: '#22c55e', note: `${(RATES.selic * 100).toFixed(2)}% a.a.` },
  { key: 'tesouro', label: 'Tesouro IPCA+', rate: RATES.tesouroDireto, color: '#3b82f6', note: `${(RATES.tesouroDireto * 100).toFixed(2)}% a.a.` },
]

const BETS_RETURN = 0.72 // 72% do aportado retorna em média

export function InvestmentComparison() {
  const [monthly, setMonthly] = useState(300)
  const [years, setYears] = useState(5)

  const invested = INVESTMENTS.map((inv) => ({
    ...inv,
    total: compoundMonthly(monthly, years, inv.rate),
  }))

  const betsTotal = monthly * years * 12 * BETS_RETURN
  const totalContributed = monthly * years * 12
  const best = Math.max(...invested.map((i) => i.total))

  return (
    <div className="space-y-4">
      <CalculatorCard title="E se eu tivesse investido?" subtitle="A pergunta que ninguém quer responder.">
        <SliderField
          id="monthly-invest"
          label="Valor mensal"
          value={monthly}
          min={50}
          max={5000}
          step={50}
          onChange={setMonthly}
        />
        <SliderField
          id="years-invest"
          label="Período"
          value={years}
          min={1}
          max={30}
          step={1}
          onChange={setYears}
          formatValue={(v) => `${v} ${v === 1 ? 'ano' : 'anos'}`}
        />
      </CalculatorCard>

      <div role="region" aria-live="polite" aria-label="Resultado do cálculo" className="space-y-4">
        <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4">
          <div className="flex justify-between text-sm text-stone-500">
            <span>Total aportado</span>
            <span className="font-semibold text-stone-900">{formatBRL(totalContributed)}</span>
          </div>

          <SectionDivider label="Resultado por investimento" />

          {invested.map((inv) => {
            const gain = inv.total - totalContributed
            const width = (inv.total / best) * 100
            return (
              <div key={inv.key} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-stone-700">{inv.label}</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-stone-900">{formatBRL(inv.total)}</span>
                    <span className="text-xs text-emerald-600 ml-2">+{formatBRL(gain)}</span>
                  </div>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{ width: `${width}%`, backgroundColor: inv.color }}
                  />
                </div>
                <p className="text-xs text-stone-400">{inv.note}</p>
              </div>
            )
          })}

          <SectionDivider label="Apostas (para comparar)" />

          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-stone-700">Apostas (retorno médio 72%)</span>
              <div className="text-right">
                <span className="text-lg font-bold text-red-500">{formatBRL(betsTotal)}</span>
                <span className="text-xs text-red-400 ml-2">-{formatBRL(totalContributed - betsTotal)}</span>
              </div>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-red-400 transition-all"
                style={{ width: `${(betsTotal / best) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-stone-50 rounded-2xl p-4">
          <p className="text-xs text-stone-400 mb-3 text-center">Compartilhe o resultado</p>
          <div className="overflow-x-auto">
            <ShareCardBase
              id="invest-share-card"
              eyebrow="comparativo de investimentos"
              mainValue={formatBRL(monthly) + '/mês'}
              mainLabel={`por ${years} ${years === 1 ? 'ano' : 'anos'}`}
              metrics={[
                { label: 'total aportado', value: formatBRL(totalContributed) },
                { label: 'na Selic', value: formatBRL(invested[1].total) },
                { label: 'Tesouro IPCA+', value: formatBRL(invested[2].total) },
                { label: 'apostas (72%)', value: formatBRL(betsTotal) },
              ]}
              footer="o dinheiro trabalha — ou some."
              bgColor="#052e16"
              accentColor="#4ade80"
            />
          </div>
          <div className="mt-3">
            <ShareButtons cardId="invest-share-card" filename="investimentos" />
          </div>
        </div>

        <p className="text-xs text-stone-400 text-center">
          Taxas de referência — {RATES.lastUpdated}. Rentabilidade passada não garante resultados futuros.
        </p>
      </div>
    </div>
  )
}
