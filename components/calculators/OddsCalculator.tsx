'use client'

import React, { useState } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { formatBRL, formatPct } from '@/lib/formatters'
import { calcHouseEdge, expectedValuePerBet, probProfit } from '@/lib/calculations/probability'
import { ChevronDown } from 'lucide-react'

const ODD_OPTIONS = [1.5, 1.7, 1.9, 2.0, 2.5, 3.0]
const N_VALUES = [10, 50, 100, 500, 1000]

function oddToHumanContext(odd: number): string {
  if (odd <= 1.5) return 'resultado muito esperado — tipo time favorito em casa'
  if (odd <= 1.7) return 'favorito claro — comum em jogos desequilibrados'
  if (odd <= 1.9) return 'leve favorito — a odd mais apostada no Brasil'
  if (odd <= 2.0) return 'equilíbrio teórico — tipo cara ou coroa'
  if (odd <= 2.5) return 'resultado menos esperado — risco maior, retorno maior'
  return 'zebra ou partida muito equilibrada — alto risco'
}

function getProfitComment(pct: number, odd: number): string {
  if (odd >= 2.0) return 'Numa odd igual ou maior que 2.0 em eventos equilibrados, o valor esperado é neutro ou positivo — mas na prática as bets não oferecem esse preço num mercado verdadeiramente 50/50.'
  if (pct < 5) return 'Após 1.000 apostas, a chance de estar no lucro é menor que 5%. A matemática não mente — quanto mais você aposta, mais certo é o prejuízo.'
  if (pct < 20) return 'Os números são implacáveis. Cada aposta é matematicamente desfavorável — o tempo é inimigo do apostador.'
  return 'A margem da casa é menor nessa odd, mas presente. No longo prazo, a perda é certa.'
}

export function OddsCalculator() {
  const [odd, setOdd] = useState(1.9)
  const [betAmount, setBetAmount] = useState(50)
  const [oddPanelOpen, setOddPanelOpen] = useState(false)

  const houseEdge = calcHouseEdge(odd)
  const ev = expectedValuePerBet(odd, betAmount)
  const profit1000 = probProfit(odd, 1000)
  const lossPerBet = Math.abs(Math.min(ev, 0))

  return (
    <div className="space-y-4">
      <CalculatorCard title="Probabilidades Reais" subtitle="A casa não é burra. Veja os números.">

        <SliderField
          id="bet-amount"
          label="Valor por aposta"
          value={betAmount}
          min={10}
          max={500}
          step={10}
          onChange={setBetAmount}
        />

        {/* Odd selector — hidden by default, revealed on hover/click */}
        <div
          className="rounded-xl border border-stone-100 overflow-hidden"
          onMouseEnter={() => setOddPanelOpen(true)}
          onMouseLeave={() => setOddPanelOpen(false)}
        >
          {/* Trigger text — always visible */}
          <button
            type="button"
            onClick={() => setOddPanelOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-stone-50 transition-colors group"
            aria-expanded={oddPanelOpen}
          >
            <span className="text-sm text-stone-500 leading-snug">
              Calculando para odd{' '}
              <strong className="text-stone-800 font-semibold">{odd.toFixed(1)}</strong>
              {' '}—{' '}
              <span className="text-stone-400">{oddToHumanContext(odd)}</span>
            </span>
            <ChevronDown
              size={14}
              className={`text-stone-400 flex-shrink-0 transition-transform duration-200 ${oddPanelOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Collapsible explanation + selector */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              oddPanelOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="px-4 pb-4 pt-1 space-y-4 border-t border-stone-100 bg-stone-50/60">

              {/* What is an odd */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">O que é uma odd?</p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  A odd é o multiplicador que a casa de apostas paga se você acertar.
                  Com odd <strong>{odd.toFixed(1)}</strong>, cada{' '}
                  <strong>{formatBRL(betAmount)}</strong> apostado vira{' '}
                  <strong>{formatBRL(betAmount * odd)}</strong> em caso de vitória
                  — mas a sua chance real de acertar é sempre menor do que{' '}
                  <strong>{formatPct((1 / odd) * 100)}</strong>.
                </p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  A casa define a odd embutindo uma margem: a soma das probabilidades implícitas
                  de todos os resultados de um mercado sempre ultrapassa 100%. Essa diferença é o lucro garantido da casa.{' '}
                  <a
                    href="https://pt.wikipedia.org/wiki/Valor_esperado"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-teal underline underline-offset-2 hover:text-brand-green transition-colors"
                  >
                    Entender Valor Esperado (Wikipedia)
                  </a>
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Ajustar a odd</p>
                <div className="grid grid-cols-3 gap-2">
                  {ODD_OPTIONS.map((o) => (
                    <button
                      key={o}
                      onClick={() => setOdd(o)}
                      className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                        odd === o
                          ? 'bg-brand-green text-white border-brand-green shadow-sm'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-brand-teal hover:text-brand-teal'
                      }`}
                    >
                      {o.toFixed(1)}
                    </button>
                  ))}
                </div>
                {/* Direction guide */}
                <div className="flex justify-between text-[10px] text-stone-400 pt-1 px-0.5">
                  <span>← favorito claro<br />menor retorno</span>
                  <span className="text-right">maior incerteza →<br />maior retorno</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </CalculatorCard>

      {/* Results */}
      <div role="region" aria-live="polite" aria-label="Resultado do cálculo" className="space-y-4">

        {/* Hero loss card */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5">
          <p className="text-xs text-stone-400 uppercase tracking-wide mb-2">O que acontece com cada aposta</p>
          {ev < 0 ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-500 tabular-nums">−{formatBRL(lossPerBet)}</span>
                <span className="text-sm text-stone-500">de perda esperada por aposta</span>
              </div>
              <p className="text-xs text-stone-400 mt-2">
                A casa retém{' '}
                <strong className="text-stone-500">{formatPct(houseEdge)}</strong> em média.
                Você recebe de volta{' '}
                <strong className="text-stone-500">{formatPct(100 - houseEdge)}</strong> do que aposta ao longo do tempo.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-500 tabular-nums">±{formatBRL(0)}</span>
                <span className="text-sm text-stone-500">valor esperado neutro nessa odd</span>
              </div>
              <p className="text-xs text-stone-400 mt-2">
                Odd ≥ 2.0 em evento 50/50 significa que a casa não está cobrando margem — situação
                teórica. Em mercados reais, essa odd não existe sem uma desvantagem embutida.
              </p>
            </>
          )}
        </div>

        <SectionDivider label="Chance de estar no lucro após N apostas" />

        <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-3">
          <p className="text-xs text-stone-400 mb-1">
            Quanto mais apostas, mais a matemática se impõe — a variância diminui e a perda esperada domina.
          </p>
          {N_VALUES.map((n) => {
            const pct = probProfit(odd, n)
            return (
              <div key={n} className="flex items-center justify-between gap-3">
                <span className="text-sm text-stone-500 w-36 flex-shrink-0">Após {n.toLocaleString('pt-BR')} apostas</span>
                <div className="flex-1 bg-stone-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(pct, 1)}%`,
                      backgroundColor: pct < 15 ? '#ef4444' : pct < 35 ? '#f59e0b' : '#22c55e',
                    }}
                  />
                </div>
                <span
                  className={`text-sm font-bold w-14 text-right tabular-nums ${
                    pct < 15 ? 'text-red-500' : pct < 35 ? 'text-amber-500' : 'text-emerald-600'
                  }`}
                >
                  {formatPct(pct)}
                </span>
              </div>
            )
          })}
        </div>

        <div className="bg-stone-800 rounded-2xl p-5 space-y-2">
          <p className="text-stone-300 text-sm leading-relaxed italic">
            {getProfitComment(profit1000, odd)}
          </p>
        </div>
      </div>
    </div>
  )
}
