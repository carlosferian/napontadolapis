'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { ResultHero }     from '@/components/ui/ResultHero'
import { MetricGrid }     from '@/components/ui/MetricGrid'
import { ComparisonList } from '@/components/ui/ComparisonList'
import { ShareButtons }   from '@/components/ui/ShareButtons'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { SourcesFooter }  from '@/components/ui/SourcesFooter'
import { ShareCardBase }  from '@/components/share/ShareCard'
import { ScaledPreview }  from '@/components/ui/ScaledPreview'
import { compoundMonthly } from '@/lib/calculations/compound'
import { calcHouseEdge, expectedValuePerBet, probProfit } from '@/lib/calculations/probability'
import { formatBRL, formatPct } from '@/lib/formatters'
import { RATES } from '@/config/rates'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ShoppingCart, Tv, Fuel, BookOpen, HeartHandshake, Phone, Lock } from 'lucide-react'

type Chapter = 0 | 1 | 2 | 3 | 4

// Barras de dopamina dos 15 giros (alturas em %, cores)
// Giros 1,2,5 = picos verdes; 3-4 = queda âmbar; 6-15 = drenagem vermelha
const DOPAMINE_BARS = [
  { h: 58,  color: '#22c55e' }, // Giro 1 — win 2x
  { h: 46,  color: '#22c55e' }, // Giro 2 — win 1.8x
  { h: 22,  color: '#f59e0b' }, // Giro 3 — lose
  { h: 18,  color: '#f59e0b' }, // Giro 4 — lose
  { h: 100, color: '#ef4444' }, // Giro 5 — BIG WIN 4x (pico)
  { h: 16,  color: '#f59e0b' }, // Giro 6 — lose
  { h: 14,  color: '#f59e0b' }, // Giro 7 — lose
  { h: 12,  color: '#6b7280' }, // Giro 8 — lose
  { h: 24,  color: '#f59e0b' }, // Giro 9 — small win
  { h: 10,  color: '#6b7280' }, // Giro 10 — lose
  { h: 8,   color: '#6b7280' }, // Giro 11 — lose
  { h: 7,   color: '#dc2626' }, // Giro 12 — lose
  { h: 5,   color: '#dc2626' }, // Giro 13 — lose
  { h: 4,   color: '#dc2626' }, // Giro 14 — lose
  { h: 2,   color: '#111827' }, // Giro 15 — falência
] as const

const COMPARISONS = [
  { icon: ShoppingCart, label: 'Carrinhos de supermercado', value: 250, unit: 'compras', explanation: 'Carrinho básico de R$ 250.' },
  { icon: Tv,           label: 'Meses de streaming premium', value: 60,  unit: 'meses',   explanation: 'Plano familiar de streaming a R$ 60/mês.' },
  { icon: Fuel,         label: 'Tanques de combustível (50L)', value: 280, unit: 'tanques', explanation: 'Gasolina a R$ 5,60/L.' },
  { icon: BookOpen,     label: 'Livros físicos novos', value: 50, unit: 'livros', explanation: 'Preço médio de capa R$ 50.' },
]

const N_BETS = [10, 100, 500, 1000] as const

export function BetsNarrative() {
  const [chapter, setChapter] = useState<Chapter>(0)

  // Cap. 2 — Calculadora de odds
  const [odd, setOdd]                   = useState(1.9)
  const [betAmountOdds, setBetAmountOdds] = useState(50)
  const [simHistory, setSimHistory]     = useState<number[]>([])
  const [simPeak, setSimPeak]           = useState(1000)
  const [simFinal, setSimFinal]         = useState(1000)
  const [simRunning, setSimRunning]     = useState(false)

  // Cap. 3 — Calculadora de perda
  const [monthly, setMonthly] = useState(300)
  const [months, setMonths]   = useState(12)

  // Derivados Cap. 2
  const houseEdge  = calcHouseEdge(odd)
  const ev         = expectedValuePerBet(odd, betAmountOdds)
  const lossPerBet = Math.abs(Math.min(ev, 0))

  // Derivados Cap. 3
  const totalSpent    = monthly * months
  const projection5y  = monthly * 60
  const invested5y    = compoundMonthly(monthly, 5, RATES.selic)
  const difference    = invested5y - projection5y

  // Simulação de 100 rodadas (Cap. 2)
  const runSimulation = useCallback(() => {
    setSimRunning(true)
    let bal = 1000
    let peak = 1000
    const history: number[] = [1000]
    for (let i = 0; i < 100; i++) {
      if (bal < betAmountOdds) break
      if (Math.random() < 0.5) { bal += betAmountOdds * (odd - 1) }
      else                      { bal -= betAmountOdds }
      if (bal > peak) peak = bal
      history.push(Math.round(bal))
    }
    setSimPeak(peak)
    setSimFinal(bal)
    setSimHistory(history)
    setSimRunning(false)
  }, [odd, betAmountOdds])

  const simChartData = useMemo(
    () => simHistory.map((v, i) => ({ r: `R${i}`, Saldo: v })),
    [simHistory]
  )

  // Navegação de capítulos
  const CHAPTER_META = [
    { icon: '🧠', color: '#ef4444', label: 'Psicologia'  },
    { icon: '📐', color: '#6366f1', label: 'Matemática'  },
    { icon: '💸', color: '#f59e0b', label: 'Custo Real'  },
    { icon: '🇧🇷', color: '#10b981', label: 'Brasil'     },
    { icon: '🚪', color: '#059669', label: 'Saída'       },
  ]

  return (
    <div className="rounded-[32px] overflow-hidden border" style={{ borderColor: 'var(--c-line)' }}>

      {/* Header da fase 3 */}
      <div className="flex items-center justify-between px-6 py-4" style={{ background: '#111827' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
          <div>
            <div className="text-[11px] font-extrabold text-white uppercase tracking-[2px]">FASE 3 — A NARRATIVA</div>
            <div className="text-[9px] text-stone-600">5 capítulos · Educativo · Compartilhável</div>
          </div>
        </div>
        {/* Barra de progresso */}
        <div className="flex gap-1.5">
          {CHAPTER_META.map((m, i) => (
            <div
              key={i}
              className="h-1 w-7 rounded-full transition-all duration-500"
              style={{ background: i <= chapter ? m.color : 'rgba(255,255,255,0.1)' }}
            />
          ))}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '56px 1fr' }}>

        {/* Sidebar de capítulos */}
        <div className="flex flex-col items-center py-5 gap-1" style={{ background: '#111827' }}>
          {CHAPTER_META.map((m, i) => (
            <button
              key={i}
              onClick={() => setChapter(i as Chapter)}
              title={m.label}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm cursor-pointer transition-all"
              style={i === chapter
                ? { background: `${m.color}22`, borderColor: m.color, transform: 'scale(1.15)', color: m.color }
                : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: '#4b5563' }
              }
            >
              {m.icon}
            </button>
          ))}
        </div>

        {/* Conteúdo dos capítulos */}
        <div style={{ background: '#f8f7f5', minHeight: 480 }}>

          {/* ── CAPÍTULO 0: PSICOLOGIA ── */}
          {chapter === 0 && (
            <div className="p-6 space-y-5">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[3px]" style={{ color: '#ef4444' }}>Capítulo 1 · Psicologia</span>
                <h2 className="text-2xl font-black text-stone-900 mt-1 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Seu cérebro foi<br/>manipulado por design.
                </h2>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                Aquelas vitórias nos primeiros giros? Não foram sorte. É um algoritmo de{' '}
                <strong className="text-stone-700">reforço intermitente</strong> — a mesma mecânica que cria
                dependência de redes sociais, descrita por B.F. Skinner em 1950.
                Vitórias aleatórias e imprevisíveis criam vínculos mais fortes do que recompensas garantidas.
              </p>

              {/* Gráfico de dopamina */}
              <div className="rounded-xl border p-4" style={{ background: 'white', borderColor: '#e5e7eb' }}>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400 mb-3">
                  Seu nível de dopamina durante os 15 giros:
                </div>
                <div className="flex items-end gap-1 h-14">
                  {DOPAMINE_BARS.map((b, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height:     `${b.h}%`,
                        background: b.color,
                        opacity:    0.85,
                      }}
                      title={`Giro ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[8px] text-stone-400 mt-1.5">
                  <span>← Giro 1</span>
                  <span className="text-red-500 font-bold">Pico: Giro 5 (BIG WIN 4×)</span>
                  <span>Giro 15 →</span>
                </div>
              </div>

              <div className="rounded-xl border p-4 text-xs" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                <p className="font-bold text-red-700 mb-1">🧪 Reforço Intermitente (Skinner, 1950)</p>
                <p className="text-red-600 leading-relaxed">
                  Pombos em experimentos recebiam comida de forma aleatória. Isso os fez bater no botão
                  obsessivamente — muito mais do que quando a comida vinha garantida. As bets replicam
                  esse experimento em 150 milhões de brasileiros.
                </p>
              </div>

              <ChapterNav chapter={chapter} total={5} onNext={() => setChapter(1)} />
            </div>
          )}

          {/* ── CAPÍTULO 1: MATEMÁTICA ── */}
          {chapter === 1 && (
            <div id="matematica" className="p-6 space-y-5">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[3px]" style={{ color: '#6366f1' }}>Capítulo 2 · Matemática</span>
                <h2 className="text-2xl font-black text-stone-900 mt-1 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  A casa nunca<br/>joga para perder.
                </h2>
              </div>

              {/* Calculadora de odds compacta */}
              <div className="rounded-xl border p-4 space-y-3" style={{ background: 'white', borderColor: '#e5e7eb' }}>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400">Calculadora de Odds</div>

                {/* Odd selector */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-500 font-semibold">Odd selecionada</span>
                    <span className="font-extrabold text-stone-800">{odd.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {[1.5, 1.7, 1.9, 2.0, 2.5, 3.0].map(o => (
                      <button
                        key={o}
                        onClick={() => setOdd(o)}
                        className="px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all"
                        style={odd === o
                          ? { background: '#6366f1', color: 'white', borderColor: 'transparent' }
                          : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }
                        }
                      >
                        {o.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Valor por aposta */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-500 font-semibold">Valor por aposta</span>
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-bold">R$</span>
                    <input
                      type="number" min={10} max={500}
                      value={betAmountOdds}
                      onChange={e => setBetAmountOdds(Math.max(10, Number(e.target.value) || 10))}
                      className="w-full border rounded-lg pl-7 pr-2.5 py-1 text-sm font-bold text-right tabular-nums"
                      style={{ borderColor: '#e5e7eb', color: '#111827' }}
                    />
                  </div>
                </div>

                {/* Resultado */}
                <div className="rounded-lg p-3" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                  <div className="text-[10px] text-stone-500 mb-0.5">Perda esperada por aposta</div>
                  <div className="text-2xl font-black text-red-500 tabular-nums">−{formatBRL(lossPerBet)}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    A casa retém <strong className="text-stone-600">{formatPct(houseEdge)}</strong> de cada real apostado.
                  </div>
                </div>

                {/* Barras de probabilidade */}
                <div className="space-y-2 pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
                  <div className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400">Chance de lucro após N apostas</div>
                  {N_BETS.map(n => {
                    const pct = probProfit(odd, n)
                    const col = pct < 15 ? '#ef4444' : pct < 35 ? '#f59e0b' : '#22c55e'
                    return (
                      <div key={n} className="flex items-center gap-2">
                        <span className="text-[9px] text-stone-400 w-24 flex-shrink-0">{n.toLocaleString('pt-BR')} apostas</span>
                        <div className="flex-1 bg-stone-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${Math.max(pct, 0.5)}%`, background: col }} />
                        </div>
                        <span className="text-[9px] font-bold w-10 text-right" style={{ color: col }}>{formatPct(pct)}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Simulação de 100 rodadas */}
                <div className="pt-2 border-t space-y-2" style={{ borderColor: '#f3f4f6' }}>
                  <button
                    onClick={runSimulation}
                    disabled={simRunning}
                    className="w-full py-2.5 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                    style={{ background: '#dc2626', color: 'white' }}
                  >
                    {simRunning ? 'Simulando...' : '🎰 Simular 100 Rodadas (R$ 1.000 virtual)'}
                  </button>
                  {simHistory.length > 0 && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { label: 'Pico',   val: formatBRL(simPeak),  col: '#16a34a' },
                          { label: 'Final',  val: formatBRL(simFinal), col: simFinal < 1000 ? '#ef4444' : '#16a34a' },
                          { label: 'Result', val: simFinal < 1000 ? `-${formatPct(((1000-simFinal)/1000)*100)}` : `+${formatPct(((simFinal-1000)/1000)*100)}`, col: simFinal < 1000 ? '#ef4444' : '#16a34a' },
                        ].map(m => (
                          <div key={m.label} className="rounded-lg p-2 text-center" style={{ border: '1px solid #e5e7eb' }}>
                            <div className="text-[9px] text-stone-400 uppercase tracking-wider">{m.label}</div>
                            <div className="text-sm font-bold mt-0.5" style={{ color: m.col }}>{m.val}</div>
                          </div>
                        ))}
                      </div>
                      <div className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={simChartData} margin={{ top: 4, right: 4, left: -30, bottom: 4 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="r" hide />
                            <YAxis tick={{ fontSize: 8, fill: '#9ca3af' }} tickLine={false} />
                            <Tooltip content={({ active, payload }) => {
                              if (!active || !payload?.length) return null
                              return <div className="bg-stone-800 text-white rounded px-2 py-1 text-[10px] font-semibold">{formatBRL(Number(payload[0].value))}</div>
                            }} />
                            <Line type="monotone" dataKey="Saldo" stroke={simFinal < 1000 ? '#ef4444' : '#10b981'} strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <ChapterNav chapter={chapter} total={5} onPrev={() => setChapter(0)} onNext={() => setChapter(2)} />
            </div>
          )}

          {/* ── CAPÍTULO 2: CUSTO REAL ── */}
          {chapter === 2 && (
            <div className="p-6 space-y-5">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[3px]" style={{ color: '#f59e0b' }}>Capítulo 3 · Custo Real</span>
                <h2 className="text-2xl font-black text-stone-900 mt-1 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Quanto você<br/>realmente perdeu?
                </h2>
              </div>

              {/* Inputs */}
              <div className="rounded-xl border p-4 space-y-4" style={{ background: 'white', borderColor: '#e5e7eb' }}>
                {/* Monthly */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-stone-500">Apostado por mês</label>
                    <div className="relative w-36">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-stone-400">R$</span>
                      <input
                        type="text" inputMode="numeric"
                        value={monthly === 0 ? '' : monthly.toLocaleString('pt-BR')}
                        onChange={e => { const v = parseInt(e.target.value.replace(/\D/g,''),10); setMonthly(isNaN(v) ? 0 : Math.min(50000, v)) }}
                        className="w-full border rounded-xl pr-3 pl-8 py-1.5 text-sm font-extrabold text-right tabular-nums"
                        style={{ borderColor: '#e5e7eb', color: '#111827' }}
                      />
                    </div>
                  </div>
                  <input type="range" min={50} max={5000} step={50} value={Math.min(5000, monthly)} onChange={e => setMonthly(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer" style={{ accentColor: '#f59e0b', backgroundColor: '#e5e7eb' } as React.CSSProperties} />
                </div>
                {/* Months */}
                <div className="space-y-2 pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-stone-500">Meses apostando</label>
                    <div className="relative w-24">
                      <input
                        type="text" inputMode="numeric"
                        value={months === 0 ? '' : months.toLocaleString('pt-BR')}
                        onChange={e => { const v = parseInt(e.target.value.replace(/\D/g,''),10); setMonths(isNaN(v) ? 0 : Math.min(360, v)) }}
                        className="w-full border rounded-xl px-3 py-1.5 text-sm font-extrabold text-right tabular-nums"
                        style={{ borderColor: '#e5e7eb', color: '#111827' }}
                      />
                    </div>
                  </div>
                  <input type="range" min={1} max={60} step={1} value={Math.min(60, months)} onChange={e => setMonths(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer" style={{ accentColor: '#f59e0b', backgroundColor: '#e5e7eb' } as React.CSSProperties} />
                </div>
              </div>

              <ResultHero
                label="O que saiu do seu bolso"
                value={formatBRL(totalSpent)}
                comment={`${months} meses de apostas.`}
                colorClass="text-red-500"
              />

              <SectionDivider label="Projeção em 5 anos" />

              <MetricGrid metrics={[
                { label: 'No ritmo atual',       value: formatBRL(projection5y), sublabel: '5 anos apostando',          colorClass: 'text-red-500 animate-pulse' },
                { label: 'Se investido na Selic', value: formatBRL(invested5y),  sublabel: `${(RATES.selic*100).toFixed(2)}% a.a.`, colorClass: 'text-emerald-600' },
                { label: 'Diferença perdida',     value: formatBRL(difference),  sublabel: 'juros compostos perdidos',  colorClass: 'text-amber-500 font-extrabold' },
              ]} />

              <SectionDivider label={`Com ${formatBRL(monthly)}/mês você pagaria`} />
              <ComparisonList monthlyAmount={monthly} comparisons={COMPARISONS} />

              {/* Share card */}
              <div className="rounded-2xl p-4 border" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
                <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider text-stone-400">Compartilhe o resultado</p>
                <ScaledPreview>
                  <ShareCardBase
                    id="bets-share-card"
                    eyebrow="meus gastos com apostas"
                    mainValue={formatBRL(monthly) + '/mês'}
                    mainLabel="valor apostado mensalmente"
                    metrics={[
                      { label: 'já perdi',    value: formatBRL(totalSpent)   },
                      { label: 'em 5 anos',   value: formatBRL(projection5y) },
                      { label: 'se investido', value: formatBRL(invested5y)  },
                      { label: 'diferença',   value: '+' + formatBRL(difference) },
                    ]}
                    footer="a conta chegou faz tempo."
                    accentColor="#ef4444"
                  />
                </ScaledPreview>
                <div className="mt-3"><ShareButtons cardId="bets-share-card" filename="apostas" /></div>
              </div>

              <ChapterNav chapter={chapter} total={5} onPrev={() => setChapter(1)} onNext={() => setChapter(3)} />
            </div>
          )}

          {/* ── CAPÍTULO 3: BRASIL ── */}
          {chapter === 3 && (
            <div className="p-6 space-y-5">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[3px]" style={{ color: '#10b981' }}>Capítulo 4 · Impacto Nacional</span>
                <h2 className="text-2xl font-black text-stone-900 mt-1 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  O Brasil sangra<br/>R$ 130 bilhões.
                </h2>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                Em 2024, os brasileiros transferiram R$ 130 bilhões para plataformas de apostas.
                É mais do que o orçamento anual de saúde de vários estados somados.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: '85–92%', label: 'perdem a longo prazo',           bg: '#fef2f2', bc: '#fecaca', vc: '#dc2626', lc: '#ef4444' },
                  { val: '5 mi',   label: 'Bolsa Família apostaram em 2024', bg: '#fef2f2', bc: '#fecaca', vc: '#dc2626', lc: '#ef4444' },
                  { val: '63%',    label: 'tiveram renda comprometida',      bg: '#fff7ed', bc: '#fed7aa', vc: '#d97706', lc: '#f59e0b' },
                  { val: '+150%',  label: 'diagnósticos de ludomania (3a)',   bg: '#fff7ed', bc: '#fed7aa', vc: '#d97706', lc: '#f59e0b' },
                ].map(s => (
                  <div key={s.val} className="rounded-xl p-3 text-center border" style={{ background: s.bg, borderColor: s.bc }}>
                    <div className="text-xl font-black" style={{ color: s.vc }}>{s.val}</div>
                    <div className="text-[9px] font-bold mt-0.5" style={{ color: s.lc }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {[
                  {
                    src: '🏛️ Banco Central do Brasil (09/2024)',
                    text: 'R$ 20,8 bilhões em Pix para casas de apostas em um único mês. Beneficiários do Bolsa Família transferiram R$ 3 bilhões — média de R$ 100 por pessoa.',
                  },
                  {
                    src: '📊 Sociedade Brasileira de Varejo (2024)',
                    text: '63% dos apostadores tiveram sua renda principal comprometida. 23% reduziram vestuário e 19% sacrificaram saúde e medicamentos.',
                  },
                  {
                    src: '🧠 Instituto de Psiquiatria da USP',
                    text: 'Diagnósticos de ludomania cresceram mais de 150% nos últimos 3 anos devido à facilidade do acesso móvel e à sensação de ganho fácil.',
                  },
                ].map(d => (
                  <div key={d.src} className="rounded-xl border p-3 text-xs" style={{ background: 'white', borderColor: '#e5e7eb' }}>
                    <div className="font-bold text-stone-600 mb-1">{d.src}</div>
                    <div className="text-stone-500 leading-relaxed">{d.text}</div>
                  </div>
                ))}
              </div>

              <ChapterNav chapter={chapter} total={5} onPrev={() => setChapter(2)} onNext={() => setChapter(4)} />
            </div>
          )}

          {/* ── CAPÍTULO 4: SAÍDA ── */}
          {chapter === 4 && (
            <div className="p-6 space-y-5">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[3px]" style={{ color: '#059669' }}>Capítulo 5 · Saída</span>
                <h2 className="text-2xl font-black text-stone-900 mt-1 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Você pode<br/>parar agora.
                </h2>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                O transtorno por jogo (ludopatia) é uma condição médica tratável.
                Apoio gratuito, confidencial e imediato:
              </p>

              <div className="space-y-2">
                {[
                  { icon: <HeartHandshake size={14}/>, title: 'Jogadores Anônimos Brasil', sub: 'ja.org.br · Reuniões diárias gratuitas — online e presencial', href: 'https://ja.org.br' },
                  { icon: <Phone size={14}/>, title: 'CVV — Centro de Valorização da Vida', sub: 'Disque 188 · 24h, gratuito e sob sigilo', href: 'https://cvv.org.br' },
                  { icon: <HeartHandshake size={14}/>, title: 'CAPS AD — SUS', sub: 'Disque 136 para localizar o CAPS mais próximo gratuitamente', href: 'https://www.gov.br/saude' },
                  { icon: <Lock size={14}/>, title: 'Autoexclusão de CPF', sub: 'Solicite o bloqueio permanente do seu CPF em todas as plataformas', href: 'https://www.gov.br/fazenda/pt-br/assuntos/noticias/2024/marco/bets' },
                ].map(r => (
                  <a
                    key={r.title}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center justify-between rounded-xl border p-3 hover:border-stone-300 transition-colors group"
                    style={{ background: 'white', borderColor: '#e5e7eb', textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-stone-400 group-hover:text-stone-600 transition-colors">{r.icon}</div>
                      <div>
                        <div className="text-xs font-bold text-stone-700">{r.title}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">{r.sub}</div>
                      </div>
                    </div>
                    <span className="text-stone-300 group-hover:text-stone-500 transition-colors ml-2">→</span>
                  </a>
                ))}
              </div>

              <SourcesFooter sources={[
                { label: 'Banco Central do Brasil — Apostas Esportivas e impacto no orçamento das famílias', url: 'https://www.bcb.gov.br/estabilidadefinanceira/apostasesportivas' },
                { label: 'Sociedade Brasileira de Varejo — Pesquisa de impacto das bets no consumo (2024)',  url: 'https://sbvc.com.br' },
                { label: 'Instituto de Psiquiatria da USP — Ludomania no Brasil',                            url: 'https://www.ipq.hc.fm.usp.br' },
                { label: 'BCB — Taxa Selic vigente',                                                         url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
              ]} />

              <ChapterNav chapter={chapter} total={5} onPrev={() => setChapter(3)} />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Sub-componente de navegação de capítulos ──────────────────────────────
function ChapterNav({ chapter, total, onPrev, onNext }: {
  chapter: number
  total: number
  onPrev?: () => void
  onNext?: () => void
}) {
  return (
    <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
      {onPrev
        ? <button onClick={onPrev} className="text-xs font-bold text-stone-400 hover:text-stone-600 cursor-pointer px-3 py-2 rounded-lg border border-stone-200 hover:border-stone-300 transition-all">← Anterior</button>
        : <div />
      }
      <span className="text-[9px] text-stone-300 uppercase tracking-wider">{chapter + 1} de {total}</span>
      {onNext
        ? <button onClick={onNext} className="text-xs font-bold cursor-pointer px-3 py-2 rounded-lg transition-all" style={{ background: '#111827', color: 'white' }}>Próximo →</button>
        : <span className="text-[9px] text-emerald-600 font-bold">✓ Jornada completa</span>
      }
    </div>
  )
}
