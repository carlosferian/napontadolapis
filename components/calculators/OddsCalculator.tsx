'use client'

import React, { useState } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { formatBRL, formatPct } from '@/lib/formatters'
import { calcHouseEdge, expectedValuePerBet, probProfit } from '@/lib/calculations/probability'

const ODD_OPTIONS = [1.7, 1.8, 1.9, 2.0, 2.5, 3.0]
const N_VALUES = [10, 50, 100, 500, 1000]

function getProfitComment(pct: number): string {
  if (pct < 5) return 'Após 1000 apostas, a chance de estar no lucro é menor que 5%. A persistência aqui não é uma virtude.'
  if (pct < 20) return 'Os números falam por si. Cada aposta é matematicamente desfavorável.'
  return 'Sua odd é generosa, mas a vantagem da casa ainda existe no longo prazo.'
}

export function OddsCalculator() {
  const [odd, setOdd] = useState(2.0)
  const [betAmount, setBetAmount] = useState(50)

  const houseEdge = calcHouseEdge(odd)
  const ev = expectedValuePerBet(odd, betAmount)
  const profit1000 = probProfit(odd, 1000)

  return (
    <div className="space-y-4">
      <CalculatorCard title="Probabilidades Reais" subtitle="A casa não é burra. Veja os números.">
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-600">Odd mais usada</label>
          <div className="grid grid-cols-3 gap-2">
            {ODD_OPTIONS.map((o) => (
              <button
                key={o}
                onClick={() => setOdd(o)}
                className={`py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  odd === o
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'
                }`}
              >
                {o.toFixed(1)}
              </button>
            ))}
          </div>
        </div>

        <SliderField
          id="bet-amount"
          label="Valor por aposta"
          value={betAmount}
          min={10}
          max={500}
          step={10}
          onChange={setBetAmount}
        />
      </CalculatorCard>

      <div role="region" aria-live="polite" aria-label="Resultado do cálculo" className="space-y-4">
        <MetricGrid
          metrics={[
            { label: 'Margem da casa', value: formatPct(houseEdge), sublabel: '% que a casa retém', colorClass: 'text-red-500' },
            { label: 'Perda esperada', value: formatBRL(Math.abs(ev)), sublabel: 'por aposta', colorClass: 'text-red-500' },
            { label: 'Retorno médio', value: formatPct(100 - houseEdge), sublabel: 'do que você aposta', colorClass: 'text-amber-500' },
          ]}
        />

        <SectionDivider label="Chance de estar no lucro" />

        <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-3">
          {N_VALUES.map((n) => {
            const pct = probProfit(odd, n)
            return (
              <div key={n} className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Após {n} apostas</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-stone-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-amber-400 transition-all"
                      style={{ width: `${Math.max(pct, 1)}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold w-14 text-right tabular-nums ${pct < 10 ? 'text-red-500' : pct < 30 ? 'text-amber-500' : 'text-emerald-600'}`}>
                    {formatPct(pct)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-stone-800 rounded-2xl p-5">
          <p className="text-stone-300 text-sm italic">{getProfitComment(profit1000)}</p>
        </div>
      </div>
    </div>
  )
}
