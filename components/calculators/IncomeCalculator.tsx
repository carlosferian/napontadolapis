'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareCardBase } from '@/components/share/ShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { formatBRL, formatPct } from '@/lib/formatters'
import { calculateIncome } from '@/lib/calculations/income'
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { HelpCircle, Sparkles, AlertTriangle, ShieldCheck, Flame, RefreshCw, TrendingDown } from 'lucide-react'

const getBRLDisplayValue = (num: number, isTarget: boolean, computedVal: number) => {
  const v = isTarget ? computedVal : num
  return v === 0 ? '' : Math.round(v).toLocaleString('pt-BR')
}
const parseBRLInput = (v: string): number => {
  const c = v.replace(/\D/g, '')
  return c === '' ? 0 : parseInt(c, 10)
}

export function IncomeCalculator() {
  const [C, setC] = useState<number>(1_000_000)
  const [R, setR] = useState<number>(6_000)
  const [I, setI] = useState<number>(9.5)
  const [T, setT] = useState<number>(25)
  const [inflation, setInflation] = useState<number>(5)

  const [history, setHistory] = useState<('C' | 'R' | 'I' | 'T')[]>(['C', 'R', 'I'])

  const target = useMemo<'C' | 'R' | 'I' | 'T'>(() => {
    const all: ('C' | 'R' | 'I' | 'T')[] = ['C', 'R', 'I', 'T']
    return all.find(f => !history.includes(f)) ?? 'T'
  }, [history])

  const results = useMemo(
    () => calculateIncome({ C, R, I, inflation, T }, target),
    [C, R, I, inflation, T, target]
  )

  const updateField = (field: 'C' | 'R' | 'I' | 'T', val: number) => {
    if (field === 'C') setC(val)
    if (field === 'R') setR(val)
    if (field === 'I') setI(val)
    if (field === 'T') setT(val)
    setHistory(prev => {
      const f = [...prev.filter(x => x !== field), field]
      return f.length > 3 ? f.slice(-3) : f
    })
  }
  const prepareForEdit = (field: 'C' | 'R' | 'I' | 'T') => {
    if (target === field) updateField(field, results[field])
  }
  const handleInputChange = (field: 'C' | 'R' | 'I' | 'T', val: number) => {
    prepareForEdit(field); updateField(field, val)
  }
  const handleBRLChange = (field: 'C' | 'R', raw: string) => {
    handleInputChange(field, parseBRLInput(raw))
  }
  const handleReset = () => {
    setC(0); setR(0); setI(0); setT(0)
    setHistory(['C', 'R', 'I'])
  }

  // Gap entre projeção nominal (calculadora antiga) e real (correta)
  const nominalDur   = results.nominalDuration
  const realDur      = results.isPerpetual ? 100 : results.T
  const durationGap  = nominalDur > 0 ? Number(((nominalDur - realDur) / nominalDur * 100).toFixed(1)) : 0
  const bigGap       = durationGap > 25 // alerta se diferença > 25%

  // Texto do hero
  const displayValues = useMemo(() => {
    const initialYield = results.C * (results.monthlyRate / 100)
    let heroValue = '', heroLabel = '', heroComment = ''

    if (target === 'C') {
      heroValue  = formatBRL(results.C)
      heroLabel  = 'Capital necessário (corrigido pela inflação)'
      heroComment = `Com IPCA de ${inflation}% a.a., sua taxa real é ${results.realI.toFixed(2)}% a.a.`
    } else if (target === 'R') {
      heroValue  = formatBRL(results.R)
      heroLabel  = 'Retirada mensal possível (poder de compra constante)'
      heroComment = `Valor de hoje — o saque nominal crescerá ${inflation}%/ano para manter o padrão.`
    } else if (target === 'I') {
      heroValue  = `${results.I.toFixed(2).replace('.', ',')}% a.a.`
      heroLabel  = 'Rentabilidade nominal necessária'
      heroComment = `Com ${inflation}% de inflação, você precisa de ${results.realI.toFixed(2)}% de taxa real.`
    } else {
      heroValue  = results.isPerpetual ? 'Perpétuo (poder de compra preservado)' : `${results.T.toFixed(1).replace('.', ',')} anos`
      heroLabel  = 'Duração real do patrimônio'
      heroComment = results.isPerpetual
        ? 'A taxa real cobre as retiradas: seu poder de compra não se erode.'
        : `Corrigido pelo IPCA de ${inflation}% a.a. Sem correção seria ${nominalDur.toFixed(1)} anos.`
    }
    return { value: heroValue, label: heroLabel, comment: heroComment }
  }, [results, target, inflation, nominalDur])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">

      {/* ── COLUNA ESQUERDA ── */}
      <div className="lg:col-span-5 space-y-4">
        <CalculatorCard
          title="Planejador Viver de Renda"
          subtitle="Modifique qualquer valor. O sistema corrige pela inflação e ajusta o campo em aberto automaticamente."
        >
          {/* Capital */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--c-muted)' }}>
                Capital Acumulado
                {target === 'C' && <span className="text-[10px] bg-[var(--c-emerald-soft)] text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">⚡ Auto</span>}
              </label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input type="text" inputMode="numeric"
                  value={getBRLDisplayValue(C, target === 'C', results.C)} placeholder="0"
                  onChange={e => handleBRLChange('C', e.target.value)}
                  onFocus={() => prepareForEdit('C')}
                  className={`w-full text-right border rounded-xl pr-3.5 pl-9 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums ${target === 'C' ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-transparent'}`}
                  style={{ color: target === 'C' ? 'var(--c-emerald)' : 'var(--c-ink)', borderColor: target === 'C' ? 'var(--c-emerald-soft)' : 'var(--c-line)' }}
                />
              </div>
            </div>
            <input type="range" min={0} max={5_000_000} step={10_000}
              value={target === 'C' ? Math.min(5_000_000, results.C) : Math.min(5_000_000, C)}
              onChange={e => handleInputChange('C', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }} />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 0</span><span>R$ 5 mi+</span>
            </div>
          </div>

          {/* Retirada */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--c-muted)' }}>
                Retirada Mensal (hoje)
                {target === 'R' && <span className="text-[10px] bg-[var(--c-emerald-soft)] text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">⚡ Auto</span>}
              </label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input type="text" inputMode="numeric"
                  value={getBRLDisplayValue(R, target === 'R', results.R)} placeholder="0"
                  onChange={e => handleBRLChange('R', e.target.value)}
                  onFocus={() => prepareForEdit('R')}
                  className={`w-full text-right border rounded-xl pr-3.5 pl-9 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums ${target === 'R' ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-transparent'}`}
                  style={{ color: target === 'R' ? 'var(--c-emerald)' : 'var(--c-ink)', borderColor: target === 'R' ? 'var(--c-emerald-soft)' : 'var(--c-line)' }}
                />
              </div>
            </div>
            <input type="range" min={0} max={30_000} step={100}
              value={target === 'R' ? Math.min(30_000, results.R) : Math.min(30_000, R)}
              onChange={e => handleInputChange('R', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }} />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 0</span><span>R$ 30k+</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: 'var(--c-muted-2)' }}>
              Valor em reais de HOJE. O saque nominal crescerá com a inflação para preservar seu padrão de vida.
            </p>
          </div>

          {/* Rentabilidade nominal */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--c-muted)' }}>
                Rentabilidade Nominal (% a.a.)
                {target === 'I' && <span className="text-[10px] bg-[var(--c-emerald-soft)] text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">⚡ Auto</span>}
              </label>
              <div className="relative w-32">
                <input type="number" step="0.1"
                  value={target === 'I' ? (results.I === 0 ? '' : results.I.toFixed(2)) : (I === 0 ? '' : I)}
                  placeholder="0,00"
                  onChange={e => handleInputChange('I', Math.max(0, Number(e.target.value) || 0))}
                  onFocus={() => prepareForEdit('I')}
                  className={`w-full text-right border rounded-xl pr-7 pl-3 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums ${target === 'I' ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-transparent'}`}
                  style={{ color: target === 'I' ? 'var(--c-emerald)' : 'var(--c-ink)', borderColor: target === 'I' ? 'var(--c-emerald-soft)' : 'var(--c-line)' }}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>%</span>
              </div>
            </div>
            <input type="range" min={0} max={25} step={0.1}
              value={target === 'I' ? Math.min(25, results.I) : Math.min(25, I)}
              onChange={e => handleInputChange('I', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }} />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>0% a.a.</span><span>25% a.a.</span>
            </div>
          </div>

          {/* ── INFLAÇÃO — o campo novo e crítico ── */}
          <div className="space-y-2 pt-2 border-t-2 border-dashed" style={{ borderColor: 'var(--c-copper-soft)' }}>
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--c-copper)' }}>
                <TrendingDown size={14} />
                Inflação Anual (IPCA)
              </label>
              <div className="relative w-32">
                <input type="number" step="0.5" min={0} max={20}
                  value={inflation === 0 ? '' : inflation}
                  placeholder="0,00"
                  onChange={e => setInflation(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}
                  className="w-full text-right border rounded-xl pr-7 pl-3 py-2 text-base font-bold focus:outline-none focus:ring-2 tabular-nums bg-transparent"
                  style={{ color: 'var(--c-copper)', borderColor: 'var(--c-copper-soft)' }}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: 'var(--c-copper)' }}>%</span>
              </div>
            </div>
            <input type="range" min={0} max={15} step={0.5}
              value={inflation}
              onChange={e => setInflation(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{ backgroundColor: 'var(--c-line)', accentColor: 'var(--c-copper)' } as React.CSSProperties}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>0% (sem)</span><span>15% a.a.</span>
            </div>
            {/* Taxa real derivada */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'var(--c-copper-soft)' }}>
              <span className="text-[11px] font-bold" style={{ color: 'var(--c-copper)' }}>
                Taxa real = ({I.toFixed(1)}% − {inflation}% inflação)
              </span>
              <span className="text-sm font-black" style={{ color: results.realI >= 0 ? 'var(--c-emerald)' : '#dc2626' }}>
                {results.realI.toFixed(2)}% a.a.
              </span>
            </div>
          </div>

          {/* Duração */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--c-muted)' }}>
                Tempo de Retirada (Anos)
                {target === 'T' && <span className="text-[10px] bg-[var(--c-emerald-soft)] text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">⚡ Auto</span>}
              </label>
              <div className="relative w-28">
                <input type="text" inputMode="numeric"
                  value={target === 'T' ? (results.isPerpetual ? 'Perpétuo' : (results.T === 0 ? '' : Math.round(results.T).toString())) : (T === 0 ? '' : Math.round(T).toString())}
                  placeholder="0"
                  disabled={target === 'T' && results.isPerpetual}
                  onChange={e => handleInputChange('T', Math.max(0, Number(e.target.value) || 0))}
                  onFocus={() => prepareForEdit('T')}
                  className={`w-full text-right border rounded-xl pr-3.5 pl-3 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums ${target === 'T' ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-transparent'} disabled:opacity-100`}
                  style={{ color: target === 'T' ? 'var(--c-emerald)' : 'var(--c-ink)', borderColor: target === 'T' ? 'var(--c-emerald-soft)' : 'var(--c-line)', WebkitTextFillColor: target === 'T' ? 'var(--c-emerald)' : 'var(--c-ink)' }}
                />
              </div>
            </div>
            <input type="range" min={0} max={40} step={1}
              value={target === 'T' ? Math.min(40, results.T) : Math.min(40, T)}
              disabled={target === 'T' && results.isPerpetual}
              onChange={e => handleInputChange('T', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-40"
              style={{ backgroundColor: 'var(--c-line)' }} />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>0 anos</span><span>40 anos+</span>
            </div>
          </div>
        </CalculatorCard>

        <div className="flex justify-between items-center text-xs">
          <button onClick={handleReset} className="text-stone-500 dark:text-stone-400 font-bold hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer">
            ✕ Limpar tudo
          </button>
          <span style={{ color: 'var(--c-muted)' }}>
            Calculando: <strong className="text-[var(--c-emerald)] dark:text-emerald-400">
              {target === 'C' ? 'Capital' : target === 'R' ? 'Retirada' : target === 'I' ? 'Rentabilidade' : 'Duração'}
            </strong>
          </span>
        </div>
      </div>

      {/* ── COLUNA DIREITA ── */}
      <div role="region" aria-live="polite" className="lg:col-span-7 space-y-4">

        {/* Hero */}
        <ResultHero
          label={displayValues.label}
          value={displayValues.value}
          comment={displayValues.comment}
          colorClass="text-emerald-600 dark:text-emerald-400"
        />

        {/* ── Alerta de inflação — o card mais importante da calculadora ── */}
        {bigGap && target === 'T' && !results.isPerpetual && (
          <div className="rounded-2xl border-2 p-4 flex gap-3 text-xs leading-relaxed"
            style={{ background: 'rgba(220,38,38,0.04)', borderColor: 'rgba(220,38,38,0.25)', color: 'var(--c-ink)' }}>
            <AlertTriangle className="shrink-0 text-red-500" size={20} />
            <div>
              <p className="font-extrabold text-red-600 dark:text-red-400 text-sm mb-1">
                ⚠️ A inflação encurta sua renda em {durationGap.toFixed(0)}%
              </p>
              <p>
                Ignorando o IPCA de {inflation}%, sua renda duraria <strong>{nominalDur.toFixed(1)} anos</strong>.
                Corrigida pela inflação, dura apenas <strong className="text-red-600">{results.T.toFixed(1)} anos</strong> — {(nominalDur - results.T).toFixed(1)} anos a menos.
                Sem correção anual dos saques, seu poder de compra cai progressivamente até você estar "morrendo de fome" com o mesmo número na conta.
              </p>
            </div>
          </div>
        )}

        {/* Insight card perpetuidade */}
        {results.isPerpetual ? (
          <div className="rounded-2xl border p-4 flex gap-3 bg-emerald-500/5 border-emerald-500/10 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            <ShieldCheck className="shrink-0 text-emerald-600 dark:text-emerald-400" size={20} />
            <div>
              <p className="font-extrabold text-emerald-950 dark:text-emerald-100 text-sm mb-1">
                Independência Perpétua — poder de compra preservado 🎓
              </p>
              <p>
                Sua taxa real de <strong>{results.realI.toFixed(2)}% a.a.</strong> cobre as retiradas de {formatBRL(results.R)}/mês
                mesmo corrigindo {inflation}% de inflação ao ano. O capital principal nunca se esgota em termos reais.
              </p>
              {results.isPerpetualNominal === false && (
                <p className="mt-1.5 font-semibold text-amber-700 dark:text-amber-300">
                  ⚠️ Sem a correção pela inflação este cenário não seria perpétuo.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border p-4 flex gap-3 bg-amber-500/5 border-amber-500/10 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
            <Flame className="shrink-0 text-amber-600 dark:text-amber-400" size={20} />
            <div>
              <p className="font-extrabold text-amber-950 dark:text-amber-100 text-sm mb-1">
                Consumo de Capital — em valores de hoje
              </p>
              <p>
                Retirada de {formatBRL(results.R)}/mês (poder de compra constante) durante{' '}
                <strong>{results.T.toFixed(1)} anos</strong> considerando {inflation}% de inflação ao ano.
                {nominalDur > results.T && (
                  <span className="text-red-600 dark:text-red-400 font-bold">
                    {' '}Sem inflação a calculadora diria {nominalDur.toFixed(1)} anos — {(nominalDur - results.T).toFixed(1)} anos a mais, ilusoriamente.
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Metrics */}
        <MetricGrid metrics={[
          {
            label:      'Taxa Real (a.a.)',
            value:      `${results.realI.toFixed(2).replace('.', ',')}%`,
            sublabel:   `nominal ${results.I.toFixed(1)}% − ${inflation}% inflação`,
            colorClass: results.realI >= 4 ? 'text-emerald-600 dark:text-emerald-400' : results.realI >= 0 ? 'text-amber-600' : 'text-red-500',
          },
          {
            label:      'Total Sacado',
            value:      formatBRL(results.totalWithdrawn),
            sublabel:   'soma em valores de hoje',
            colorClass: 'text-emerald-600 dark:text-emerald-400',
          },
          {
            label:      'Juros Reais Gerados',
            value:      formatBRL(results.totalInterestEarned),
            sublabel:   'rendimento líquido de inflação',
            colorClass: 'text-amber-700 dark:text-amber-400',
          },
        ]} />

        {/* ── Gráfico com duas curvas ── */}
        <div className="rounded-2xl border p-5 space-y-4"
          style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <p className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>
                Evolução Patrimonial: Nominal vs. Real
              </p>
              <p className="text-xs" style={{ color: 'var(--c-muted)' }}>
                O que aparece no extrato vs. o que vale de verdade
              </p>
            </div>
            <div className="flex gap-3 text-[10px] font-bold flex-shrink-0 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-0.5 rounded bg-blue-500" style={{ borderTop: '2px dashed #3b82f6', background: 'none' }} />
                Saldo nominal
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-0.5 rounded bg-emerald-500" />
                Saldo real
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-0.5 rounded bg-amber-500" style={{ borderTop: '2px dashed #f59e0b', background: 'none' }} />
                Saque nominal
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={results.timeline} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" opacity={0.6} />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#78716c' }}
                tickFormatter={v => `Ano ${v}`} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#78716c' }}
                tickFormatter={v => `R$${(v/1000).toFixed(0)}k`}
                width={42} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(v, name) => [
                  formatBRL(Number(v)),
                  name === 'nominalBalance'    ? 'Saldo nominal (extrato)'
                  : name === 'nominalWithdrawal' ? 'Retirada mensal nominal'
                  : 'Saldo real (poder de compra)',
                ]}
                labelFormatter={label => `Período: Ano ${label}`}
                contentStyle={{
                  backgroundColor: 'var(--c-card-calm)',
                  color: 'var(--c-ink)',
                  borderColor: 'var(--c-line)',
                  borderRadius: 12, fontSize: 12,
                }}
              />
              {/* Linha nominal — o que a calculadora antiga mostrava */}
              <Line type="monotone" dataKey="nominalBalance"
                stroke="#3b82f6" strokeWidth={2} dot={false}
                strokeDasharray="5 3" />
              {/* Linha real — a verdade corrigida pela inflação */}
              <Line type="monotone" dataKey="balance"
                stroke="#10b981" strokeWidth={2.5} dot={false} />
              {/* Linha da retirada nominal — quanto o saque vai custar em cada ano para manter o poder de compra */}
              <Line type="monotone" dataKey="nominalWithdrawal"
                stroke="#f59e0b" strokeWidth={2} dot={false}
                strokeDasharray="3 2" />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed">
            <strong style={{ color: '#10b981' }}>Verde:</strong> saldo real — o que vale em poder de compra de hoje.{' '}
            <strong style={{ color: '#3b82f6' }}>Azul tracejado:</strong> saldo nominal — o que aparece no extrato.{' '}
            <strong style={{ color: '#f59e0b' }}>Âmbar tracejado:</strong> quanto você precisará sacar nominalmente a cada ano para manter os mesmos {formatBRL(results.R)}/mês em poder de compra (a linha sobe com a inflação).
          </p>
        </div>

        {/* Share */}
        <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
            Compartilhe o planejamento
          </p>
          <ScaledPreview>
            <ShareCardBase
              id="income-share-card"
              eyebrow="Viver de Renda · Corrigido pela Inflação"
              mainValue={results.isPerpetual ? 'PERPÉTUO' : `${results.T.toFixed(1).replace('.', ',')} ANOS`}
              mainLabel={`duração real com ${inflation}% IPCA ao ano`}
              metrics={[
                { label: 'Capital',           value: formatBRL(results.C) },
                { label: 'Retirada hoje',      value: formatBRL(results.R) + '/mês' },
                { label: 'Taxa real',          value: `${results.realI.toFixed(2).replace('.', ',')}% a.a.` },
                { label: 'Taxa nominal',       value: `${results.I.toFixed(2).replace('.', ',')}% a.a.` },
              ]}
              footer="Independência financeira sob a ponta do lápis."
              accentColor={results.isPerpetual ? '#10b981' : '#b4421b'}
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="income-share-card" filename="viver-de-renda" />
          </div>
        </div>

      </div>
    </div>
  )
}
