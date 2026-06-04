'use client'

import React, { useState, useMemo } from 'react'
import { calculateIncome } from '@/lib/calculations/income'
import { formatBRL } from '@/lib/formatters'
import { RATES } from '@/config/rates'
import { TrendingDown, AlertTriangle, CheckCircle, RefreshCw, Calendar } from 'lucide-react'

// ── Premissas fixas — o usuário não precisa pensar nisso ──────────────────
const FIXED_INFLATION = 5            // IPCA % a.a.
const FIXED_RATE      = RATES.selic * 100  // Selic nominal % a.a.

// ── Helpers ───────────────────────────────────────────────────────────────

function DurationBadge({ years, isPerpetual }: { years: number; isPerpetual: boolean }) {
  if (isPerpetual) return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--c-emerald)' }}>
      <CheckCircle size={14} /> Perpétuo — nunca acaba
    </span>
  )
  if (years >= 30) return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold" style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--c-emerald)' }}>
      <CheckCircle size={14} /> {years.toFixed(1).replace('.', ',')} anos — excelente cobertura
    </span>
  )
  if (years >= 20) return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold" style={{ background: 'rgba(245,158,11,0.1)', color: '#d97706' }}>
      <TrendingDown size={14} /> {years.toFixed(1).replace('.', ',')} anos — cobertura moderada
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold" style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}>
      <AlertTriangle size={14} /> {years.toFixed(1).replace('.', ',')} anos — atenção ao prazo
    </span>
  )
}

function DurationBar({ years, isPerpetual, maxYears = 40 }: { years: number; isPerpetual: boolean; maxYears?: number }) {
  const pct = isPerpetual ? 100 : Math.min(100, (years / maxYears) * 100)
  const color = isPerpetual || years >= 30 ? '#10b981' : years >= 20 ? '#f59e0b' : '#ef4444'
  return (
    <div className="space-y-1.5">
      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--c-line)' }}>
        <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex justify-between text-[9px] font-semibold" style={{ color: 'var(--c-muted)' }}>
        <span>0 anos</span>
        <span>10 anos</span>
        <span>20 anos</span>
        <span>30 anos</span>
        <span>Perpétuo</span>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────

export function SimpleIncomeCalculator() {
  const [mode, setMode] = useState<'fromCapital' | 'fromWithdrawal'>('fromCapital')

  // Mode A: tenho capital, quanto posso retirar?
  const [capital,     setCapital]     = useState(1_000_000)
  const [exploration, setExploration] = useState(0)  // 0 = usar o perpétuo como padrão
  const [explorationSet, setExplorationSet] = useState(false)

  // Mode B: quero X/mês, quanto preciso acumular?
  const [withdrawal,      setWithdrawal]      = useState(5_000)
  const [exploredCapital, setExploredCapital] = useState(0)
  const [exploredCapSet,  setExploredCapSet]  = useState(false)


  // ── Cálculos ────────────────────────────────────────────────────────────

  // Resultado base para o capital informado (qualquer retirada pequena → longa duração)
  const baseA = useMemo(() => calculateIncome(
    { C: capital, R: Math.max(1, capital * 0.001), I: FIXED_RATE, inflation: FIXED_INFLATION, T: 1 },
    'T'
  ), [capital])
  const maxPerpetual = baseA.maxWithdrawalRealPerpetual

  // Quando não definiu exploration, usa a retirada perpétua como padrão
  const explorationValue = explorationSet ? exploration : Math.round(maxPerpetual)

  const resultA = useMemo(() => calculateIncome(
    { C: capital, R: Math.max(1, explorationValue), I: FIXED_RATE, inflation: FIXED_INFLATION, T: 40 },
    'T'
  ), [capital, explorationValue])

  // Resultado base para retirada desejada
  const resultB_perpetual = useMemo(() => calculateIncome(
    { C: 0, R: Math.max(1, withdrawal), I: FIXED_RATE, inflation: FIXED_INFLATION, T: 40 },
    'C'
  ), [withdrawal])
  const capitalForPerpetual = resultB_perpetual.maxWithdrawalRealPerpetual > 0
    ? Math.round(withdrawal / (resultB_perpetual.monthlyRate / 100))
    : resultB_perpetual.C

  const exploredCapValue = exploredCapSet ? exploredCapital : Math.round(capitalForPerpetual * 0.7)

  const resultB_explored = useMemo(() => calculateIncome(
    { C: Math.max(1, exploredCapValue), R: Math.max(1, withdrawal), I: FIXED_RATE, inflation: FIXED_INFLATION, T: 40 },
    'T'
  ), [exploredCapValue, withdrawal])

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Toggle de modo */}
      <div className="rounded-2xl border p-1.5 flex gap-1.5" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}>
        <button
          onClick={() => setMode('fromCapital')}
          className="flex-1 py-3.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer text-center"
          style={mode === 'fromCapital'
            ? { background: 'var(--c-card-calm)', boxShadow: 'var(--c-shadow-card)', color: 'var(--c-ink)', border: '1px solid var(--c-line)' }
            : { color: 'var(--c-muted)', border: '1px solid transparent' }
          }
        >
          💰 Tenho capital investido
        </button>
        <button
          onClick={() => setMode('fromWithdrawal')}
          className="flex-1 py-3.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer text-center"
          style={mode === 'fromWithdrawal'
            ? { background: 'var(--c-card-calm)', boxShadow: 'var(--c-shadow-card)', color: 'var(--c-ink)', border: '1px solid var(--c-line)' }
            : { color: 'var(--c-muted)', border: '1px solid transparent' }
          }
        >
          💸 Quero uma renda mensal
        </button>
      </div>

      {/* ── MODO A: Tenho capital ────────────────────────────────────────── */}
      {mode === 'fromCapital' && (
        <div className="space-y-6">

          {/* Contexto "hoje" */}
          <div className="rounded-xl px-4 py-2.5 text-xs" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', color: 'var(--c-ink)' }}>
            Você se <strong>aposenta hoje</strong> e começa a retirar imediatamente do seu patrimônio atual.
          </div>

          {/* Input do capital */}
          <div className="space-y-3">
            <label className="block text-sm font-bold" style={{ color: 'var(--c-muted)' }}>
              Quanto você tem investido hoje?
            </label>
            <div className="space-y-1">
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-extrabold" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={capital || ''}
                  min={0}
                  max={100_000_000}
                  onChange={e => setCapital(Math.min(100_000_000, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full border-2 rounded-2xl py-4 pr-5 pl-14 text-2xl font-black tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent"
                  style={{ color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
                  placeholder="0"
                />
              </div>
              {capital > 0 && (
                <p className="text-xs text-right pr-1" style={{ color: 'var(--c-muted)' }}>
                  = {formatBRL(capital)}
                </p>
              )}
            </div>
            <input type="range" min={10_000} max={10_000_000} step={10_000}
              value={Math.min(10_000_000, capital)}
              onChange={e => setCapital(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }} />
            <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 10k</span><span>R$ 500k</span><span>R$ 1M</span><span>R$ 5M</span><span>R$ 10M</span>
            </div>
          </div>

          {/* Resposta principal: retirada perpétua */}
          <div className="rounded-3xl border-2 p-8 text-center space-y-3" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.03)' }}>
            <p className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              Retirada mensal sustentável para sempre
            </p>
            <div className="text-5xl sm:text-6xl font-black tabular-nums" style={{ color: 'var(--c-emerald)' }}>
              {formatBRL(maxPerpetual)}
            </div>
            <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
              /mês · em poder de compra de hoje · <strong>o capital nunca diminui</strong>
            </p>
          </div>

          {/* Exploração: e se quiser retirar mais? */}
          <div className="rounded-2xl border p-6 space-y-5" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
            <p className="text-sm font-bold" style={{ color: 'var(--c-ink)' }}>
              E se você quiser retirar um valor diferente?
            </p>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>Retirada mensal explorada</span>
                <span className="text-xl font-black tabular-nums" style={{ color: explorationValue > maxPerpetual ? '#ef4444' : 'var(--c-emerald)' }}>
                  {formatBRL(explorationValue)}/mês
                </span>
              </div>
              <input
                type="range"
                min={Math.round(maxPerpetual * 0.2)}
                max={Math.round(maxPerpetual * 3.5)}
                step={100}
                value={explorationValue}
                onChange={e => { setExploration(Number(e.target.value)); setExplorationSet(true) }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ backgroundColor: 'var(--c-line)', accentColor: explorationValue > maxPerpetual ? '#ef4444' : '#10b981' } as React.CSSProperties}
              />
              <div className="flex justify-between text-[9px]" style={{ color: 'var(--c-muted)' }}>
                <span>{formatBRL(Math.round(maxPerpetual * 0.2))}</span>
                <span className="font-bold" style={{ color: 'var(--c-emerald)' }}>← Perpétuo: {formatBRL(maxPerpetual)}</span>
                <span>{formatBRL(Math.round(maxPerpetual * 3.5))}</span>
              </div>
            </div>

            {/* Resultado da exploração */}
            <div className="space-y-3">
              <DurationBadge years={resultA.T} isPerpetual={resultA.isPerpetual} />
              <DurationBar years={resultA.T} isPerpetual={resultA.isPerpetual} />
              {!resultA.isPerpetual && (
                <p className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                  Retirando {formatBRL(explorationValue)}/mês, você gasta{' '}
                  <strong style={{ color: 'var(--c-ink)' }}>{formatBRL(explorationValue - maxPerpetual)}/mês</strong>{' '}
                  a mais do que os juros geram. Após {resultA.T.toFixed(1)} anos o capital se esgota.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODO B: Quero uma renda mensal ──────────────────────────────── */}
      {mode === 'fromWithdrawal' && (
        <div className="space-y-6">

          {/* Contexto "hoje" */}
          <div className="rounded-xl px-4 py-2.5 text-xs" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', color: 'var(--c-ink)' }}>
            Você se <strong>aposenta hoje</strong> e começa a retirar imediatamente. O capital necessário já precisa estar acumulado.
          </div>

          {/* Input da retirada */}
          <div className="space-y-3">
            <label className="block text-sm font-bold" style={{ color: 'var(--c-muted)' }}>
              Quanto você quer retirar por mês?
            </label>
            <div className="space-y-1">
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-extrabold" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={withdrawal || ''}
                  min={0}
                  max={1_000_000}
                  onChange={e => setWithdrawal(Math.min(1_000_000, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full border-2 rounded-2xl py-4 pr-5 pl-14 text-2xl font-black tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent"
                  style={{ color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
                  placeholder="0"
                />
              </div>
              {withdrawal > 0 && (
                <p className="text-xs text-right pr-1" style={{ color: 'var(--c-muted)' }}>
                  = {formatBRL(withdrawal)}
                </p>
              )}
            </div>
            <input type="range" min={500} max={100_000} step={500}
              value={Math.min(100_000, withdrawal)}
              onChange={e => setWithdrawal(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }} />
            <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 500</span><span>R$ 5k</span><span>R$ 10k</span><span>R$ 50k</span><span>R$ 100k</span>
            </div>
          </div>

          {/* Resposta principal: capital necessário */}
          <div className="rounded-3xl border-2 p-8 text-center space-y-3" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.03)' }}>
            <p className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              Capital necessário para receber isso para sempre
            </p>
            <div className="text-5xl sm:text-6xl font-black tabular-nums" style={{ color: 'var(--c-emerald)' }}>
              {formatBRL(capitalForPerpetual)}
            </div>
            <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
              investidos gerando renda perpétua · <strong>o capital nunca diminui</strong>
            </p>
          </div>

          {/* Exploração: e se eu tiver menos capital? */}
          <div className="rounded-2xl border p-6 space-y-5" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
            <p className="text-sm font-bold" style={{ color: 'var(--c-ink)' }}>
              Se você tiver menos capital, por quanto tempo dura?
            </p>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>Capital disponível</span>
                <span className="text-xl font-black tabular-nums" style={{ color: exploredCapValue < capitalForPerpetual ? '#f59e0b' : 'var(--c-emerald)' }}>
                  {formatBRL(exploredCapValue)}
                </span>
              </div>
              <input
                type="range"
                min={Math.round(capitalForPerpetual * 0.1)}
                max={Math.round(capitalForPerpetual * 1.3)}
                step={10_000}
                value={exploredCapValue}
                onChange={e => { setExploredCapital(Number(e.target.value)); setExploredCapSet(true) }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ backgroundColor: 'var(--c-line)', accentColor: exploredCapValue >= capitalForPerpetual ? '#10b981' : '#f59e0b' } as React.CSSProperties}
              />
              <div className="flex justify-between text-[9px]" style={{ color: 'var(--c-muted)' }}>
                <span>{formatBRL(Math.round(capitalForPerpetual * 0.1))}</span>
                <span className="font-bold" style={{ color: 'var(--c-emerald)' }}>Perpétuo: {formatBRL(capitalForPerpetual)} →</span>
                <span>{formatBRL(Math.round(capitalForPerpetual * 1.3))}</span>
              </div>
            </div>

            {/* Resultado */}
            <div className="space-y-3">
              <DurationBadge years={resultB_explored.T} isPerpetual={resultB_explored.isPerpetual} />
              <DurationBar years={resultB_explored.T} isPerpetual={resultB_explored.isPerpetual} />
              {!resultB_explored.isPerpetual && (
                <p className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                  Com {formatBRL(exploredCapValue)}, retirando {formatBRL(withdrawal)}/mês, o capital dura{' '}
                  <strong style={{ color: 'var(--c-ink)' }}>{resultB_explored.T.toFixed(1)} anos</strong>.
                  Faltam {formatBRL(capitalForPerpetual - exploredCapValue)} para atingir a perpetuidade.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card de contexto: "aposentar hoje" + taxa viva */}
      <div className="rounded-2xl border divide-y" style={{ borderColor: 'var(--c-line)' }}>

        {/* Linha 1 — contexto "hoje" */}
        <div className="flex items-start gap-3 px-4 py-3">
          <Calendar size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--c-muted)' }} />
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--c-ink)' }}>
              Este cálculo parte do princípio que você se aposenta hoje
            </p>
            <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              O patrimônio informado é o que você já tem investido agora, e a retirada começa imediatamente.
              Para planejar uma aposentadoria futura (com acúmulo de capital ao longo dos anos),
              use a aba <strong>Planejador Completo</strong>.
            </p>
          </div>
        </div>

        {/* Linha 2 — taxa Selic live */}
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--c-emerald)' }} />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
                Taxa Selic · Banco Central do Brasil
              </p>
              <p className="text-[9px]" style={{ color: 'var(--c-muted-2)' }}>
                Atualizada em {RATES.lastUpdated} via API BCB · Taxa real = Selic − 5% IPCA
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-black tabular-nums" style={{ color: 'var(--c-emerald)' }}>
              {(RATES.selic * 100).toFixed(2)}% a.a.
            </div>
            <div className="text-[9px] font-bold" style={{ color: 'var(--c-muted)' }}>
              real: {(((1 + RATES.selic) / 1.05 - 1) * 100).toFixed(2)}% a.a.
            </div>
          </div>
        </div>

        {/* Linha 3 — como atualizar */}
        <div className="flex items-center gap-2 px-4 py-2.5">
          <RefreshCw size={12} style={{ color: 'var(--c-muted-2)' }} />
          <p className="text-[9px]" style={{ color: 'var(--c-muted-2)' }}>
            Atualização automática diária via GitHub Actions (BCB SGS 432).
            Para forçar agora: <code className="font-mono font-bold">npm run update-rates</code> ou acione em{' '}
            <a href="https://github.com/carlosferian/napontadolapis/actions" target="_blank" rel="noopener noreferrer"
              className="underline hover:opacity-80">GitHub → Actions → Run workflow</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
