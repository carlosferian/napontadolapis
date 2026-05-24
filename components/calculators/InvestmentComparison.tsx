'use client'

import React, { useState } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { ShareCardBase } from '@/components/share/ShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { compoundMonthly } from '@/lib/calculations/compound'
import { formatBRL } from '@/lib/formatters'
import { RATES } from '@/config/rates'

const INVESTMENTS = [
  { key: 'poupanca', label: 'Poupança', rate: RATES.poupanca, color: '#f59e0b', note: '7,5% a.a. (isenta de IR)' },
  { key: 'selic', label: 'Selic / CDB 100%', rate: RATES.selic, color: '#22c55e', note: `${(RATES.selic * 100).toFixed(2)}% a.a.` },
  { key: 'tesouro', label: 'Tesouro IPCA+', rate: RATES.tesouroDireto, color: '#3b82f6', note: `${(RATES.tesouroDireto * 100).toFixed(2)}% a.a.` },
]

// Apostadores recuperam em média 72% do que apostam — estimativa conservadora baseada em comportamento médio de mercado
const BETS_RETURN = 0.72

export function InvestmentComparison() {
  const [monthly, setMonthly] = useState(300)
  const [years, setYears] = useState(5)

  const totalContributed = monthly * years * 12

  const invested = INVESTMENTS.map((inv) => ({
    ...inv,
    total: compoundMonthly(monthly, years, inv.rate),
    gain: compoundMonthly(monthly, years, inv.rate) - totalContributed,
  }))

  const betsBack = totalContributed * BETS_RETURN
  const betsLoss = totalContributed - betsBack

  const bestGain = Math.max(...invested.map((i) => i.gain))
  const bestInvestment = invested.find((i) => i.gain === bestGain)!

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

        {/* Summary hero */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-5 border-r border-stone-100">
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Investindo na {bestInvestment.label}</p>
              <p className="text-3xl font-bold text-emerald-600 tabular-nums leading-none">
                +{formatBRL(bestGain)}
              </p>
              <p className="text-xs text-stone-400 mt-1">de rendimento em {years} {years === 1 ? 'ano' : 'anos'}</p>
            </div>
            <div className="p-5 bg-red-50/60">
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Nas apostas</p>
              <p className="text-3xl font-bold text-red-500 tabular-nums leading-none">
                −{formatBRL(betsLoss)}
              </p>
              <p className="text-xs text-stone-400 mt-1">queimado do seu bolso</p>
            </div>
          </div>
          <div className="px-5 py-3 bg-stone-50 border-t border-stone-100">
            <p className="text-xs text-stone-500 text-center">
              Total aportado: <span className="font-semibold text-stone-700">{formatBRL(totalContributed)}</span>
            </p>
          </div>
        </div>

        {/* Investments detail */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-5">
          <SectionDivider label="Rendimento por investimento" />

          {invested.map((inv) => {
            const barWidth = bestGain > 0 ? (inv.gain / bestGain) * 100 : 0
            return (
              <div key={inv.key} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{inv.label}</p>
                    <p className="text-xs text-stone-400">{inv.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600 tabular-nums leading-none">
                      +{formatBRL(inv.gain)}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      total: {formatBRL(inv.total)}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%`, backgroundColor: inv.color }}
                  />
                </div>
              </div>
            )
          })}

          <SectionDivider label="Apostas (para comparar)" />

          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-stone-800">Apostas</p>
                <p className="text-xs text-stone-400">retorno médio de 72% — você perde 28%</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-red-500 tabular-nums leading-none">
                  −{formatBRL(betsLoss)}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  devolveu apenas: {formatBRL(betsBack)}
                </p>
              </div>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-red-400 transition-all duration-500"
                style={{ width: `${bestGain > 0 ? Math.max((betsBack / (totalContributed + bestGain)) * 100, 4) : 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Share */}
        <div className="bg-stone-50 rounded-2xl p-4">
          <p className="text-xs text-stone-400 mb-3 text-center">Compartilhe o resultado</p>
          <ScaledPreview>
            <ShareCardBase
              id="invest-share-card"
              eyebrow="comparativo de investimentos"
              mainValue={`+${formatBRL(bestGain)}`}
              mainLabel={`rendimento em ${years} ${years === 1 ? 'ano' : 'anos'} na ${bestInvestment.label}`}
              metrics={[
                { label: 'total aportado', value: formatBRL(totalContributed) },
                { label: 'ganho na Selic', value: `+${formatBRL(invested[1].gain)}` },
                { label: 'ganho no Tesouro', value: `+${formatBRL(invested[2].gain)}` },
                { label: 'perdido nas apostas', value: `−${formatBRL(betsLoss)}` },
              ]}
              footer="o dinheiro trabalha — ou some."
              accentColor="#22c55e"
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="invest-share-card" filename="investimentos" />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 space-y-1">
          <p className="text-xs font-semibold text-amber-700">Atenção: valores brutos de IR</p>
          <p className="text-xs text-amber-600 leading-relaxed">
            Selic/CDB e Tesouro Direto têm Imposto de Renda retido na fonte (tabela regressiva: 22,5% até 6 meses,
            15% acima de 24 meses). Poupança é isenta. Os rendimentos acima são anteriores ao desconto do IR.
          </p>
        </div>

        <p className="text-xs text-stone-400 text-center">
          Taxas de referência — {RATES.lastUpdated}. Rentabilidade passada não garante resultados futuros.
          O retorno de 72% nas apostas é uma estimativa conservadora baseada em comportamento médio de mercado.
        </p>
      </div>
    </div>
  )
}
