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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { HelpCircle, Sparkles, AlertTriangle, ShieldCheck, Flame, RefreshCw } from 'lucide-react'

// Funções auxiliares para formatação de BRL em inputs de texto
const getBRLDisplayValue = (num: number, isTarget: boolean, computedVal: number) => {
  const currentVal = isTarget ? computedVal : num
  if (currentVal === 0) return ''
  return Math.round(currentVal).toLocaleString('pt-BR')
}

const parseBRLInputValue = (value: string): number => {
  const cleanValue = value.replace(/\D/g, '')
  if (cleanValue === '') return 0
  return parseInt(cleanValue, 10)
}

export function IncomeCalculator() {
  // Input states
  const [C, setC] = useState<number>(1000000) // Capital Inicial
  const [R, setR] = useState<number>(6000) // Retirada Mensal
  const [I, setI] = useState<number>(9.5) // Juros Anual % a.a.
  const [T, setT] = useState<number>(25) // Duração em anos

  // History of edited inputs (determines which field is computed)
  // The calculated target is the field that is NOT in this array of the last 3 edited fields.
  const [history, setHistory] = useState<('C' | 'R' | 'I' | 'T')[]>(['C', 'R', 'I'])

  const target = useMemo(() => {
    const allFields: ('C' | 'R' | 'I' | 'T')[] = ['C', 'R', 'I', 'T']
    return (allFields.find(f => !history.includes(f)) || 'T') as 'C' | 'R' | 'I' | 'T'
  }, [history])

  // Call the robust income solver
  const results = useMemo(() => {
    return calculateIncome({ C, R, I, T }, target)
  }, [C, R, I, T, target])

  // Update states whenever results yields a new calculated value to avoid jumps when target shifts
  const computedC = results.C
  const computedR = results.R
  const computedI = results.I
  const computedT = results.T

  // Helper to handle user input and maintain the editing history
  const updateField = (field: 'C' | 'R' | 'I' | 'T', val: number) => {
    if (field === 'C') setC(val)
    if (field === 'R') setR(val)
    if (field === 'I') setI(val)
    if (field === 'T') setT(val)

    setHistory(prev => {
      const filtered = prev.filter(f => f !== field)
      const newHistory = [...filtered, field]
      if (newHistory.length > 3) {
        newHistory.shift()
      }
      return newHistory
    })
  }

  // Prepares the field to be edited if it was currently calculated
  const prepareForEdit = (field: 'C' | 'R' | 'I' | 'T') => {
    if (target === field) {
      // Force local state to have the latest calculated value before making it an input
      const currentVal = results[field]
      updateField(field, currentVal)
    }
  }

  const handleInputChange = (field: 'C' | 'R' | 'I' | 'T', val: number) => {
    prepareForEdit(field)
    updateField(field, val)
  }

  const handleBRLInputChange = (field: 'C' | 'R', rawValue: string) => {
    const numericValue = parseBRLInputValue(rawValue)
    handleInputChange(field, numericValue)
  }

  // Reset values
  const handleReset = () => {
    setC(0)
    setR(0)
    setI(0)
    setT(0)
    setHistory(['C', 'R', 'I']) // resets target to T
  }

  // Formatting strings for ResultHero based on calculated target
  const displayValues = useMemo(() => {
    const passiveMonthlyRate = results.monthlyRate
    const initialYield = results.C * (passiveMonthlyRate / 100)

    let heroValue = ''
    let heroLabel = ''
    let heroComment = `Seus rendimentos geram R$ ${initialYield.toFixed(2).replace('.', ',')} mensais no início.`

    if (target === 'C') {
      heroValue = formatBRL(results.C)
      heroLabel = 'Capital Acumulado Necessário'
    } else if (target === 'R') {
      heroValue = formatBRL(results.R)
      heroLabel = 'Aposentadoria / Retirada Possível'
    } else if (target === 'I') {
      heroValue = `${results.I.toFixed(2).replace('.', ',')}% a.a.`
      heroLabel = 'Taxa de Juros Necessária'
    } else if (target === 'T') {
      heroValue = results.isPerpetual ? 'Perpétuo (Nunca acaba)' : `${results.T.toFixed(1).replace('.', ',')} anos`
      heroLabel = 'Tempo de Duração do Patrimônio'
      if (results.isPerpetual) {
        heroComment = 'Parabéns! Suas retiradas são totalmente cobertas pelos juros do capital.'
      }
    }

    return {
      value: heroValue,
      label: heroLabel,
      comment: heroComment,
    }
  }, [results, target])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      {/* ── COLUNA ESQUERDA: INPUTS E SLIDERS ────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        <CalculatorCard 
          title="Planejador Viver de Renda" 
          subtitle="Modifique qualquer valor. O sistema ajusta automaticamente o campo em aberto e previne conflitos matemáticos."
        >
          
          {/* 1. Capital Acumulado (C) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="capital-input" className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--c-muted)' }}>
                Capital Acumulado
                {target === 'C' && <span className="text-[10px] bg-[var(--c-emerald-soft)] text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">⚡ Auto</span>}
              </label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="capital-input"
                  type="text"
                  inputMode="numeric"
                  value={getBRLDisplayValue(C, target === 'C', results.C)}
                  placeholder="0"
                  onChange={(e) => handleBRLInputChange('C', e.target.value)}
                  onFocus={() => prepareForEdit('C')}
                  className={`w-full text-right border rounded-xl pr-3.5 pl-9 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums transition-colors duration-200 ${target === 'C' ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-transparent'}`}
                  style={{
                    color: target === 'C' ? 'var(--c-emerald)' : 'var(--c-ink)',
                    borderColor: target === 'C' ? 'var(--c-emerald-soft)' : 'var(--c-line)'
                  }}
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={5000000}
              step={10000}
              value={target === 'C' ? Math.min(5000000, results.C) : Math.min(5000000, C)}
              onChange={(e) => handleInputChange('C', Number(e.target.value))}
              aria-label="Capital Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 0</span>
              <span>R$ 5 milhões+</span>
            </div>
          </div>

          {/* 2. Retirada Mensal (R) */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label htmlFor="withdrawal-input" className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--c-muted)' }}>
                Retirada Mensal Desejada
                {target === 'R' && <span className="text-[10px] bg-[var(--c-emerald-soft)] text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">⚡ Auto</span>}
              </label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="withdrawal-input"
                  type="text"
                  inputMode="numeric"
                  value={getBRLDisplayValue(R, target === 'R', results.R)}
                  placeholder="0"
                  onChange={(e) => handleBRLInputChange('R', e.target.value)}
                  onFocus={() => prepareForEdit('R')}
                  className={`w-full text-right border rounded-xl pr-3.5 pl-9 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums transition-colors duration-200 ${target === 'R' ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-transparent'}`}
                  style={{
                    color: target === 'R' ? 'var(--c-emerald)' : 'var(--c-ink)',
                    borderColor: target === 'R' ? 'var(--c-emerald-soft)' : 'var(--c-line)'
                  }}
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={30000}
              step={100}
              value={target === 'R' ? Math.min(30000, results.R) : Math.min(30000, R)}
              onChange={(e) => handleInputChange('R', Number(e.target.value))}
              aria-label="Retirada Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 0</span>
              <span>R$ 30 mil+</span>
            </div>
          </div>

          {/* 3. Taxa de Juros Anual (I) */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label htmlFor="interest-input" className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--c-muted)' }}>
                Rentabilidade Anual (% a.a.)
                {target === 'I' && <span className="text-[10px] bg-[var(--c-emerald-soft)] text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">⚡ Auto</span>}
              </label>
              <div className="relative w-32">
                <input
                  id="interest-input"
                  type="number"
                  step="0.1"
                  value={target === 'I' ? (results.I === 0 ? '' : results.I.toFixed(2)) : (I === 0 ? '' : I)}
                  placeholder="0,00"
                  onChange={(e) => handleInputChange('I', Math.max(0, Number(e.target.value) || 0))}
                  onFocus={() => prepareForEdit('I')}
                  className={`w-full text-right border rounded-xl pr-7 pl-3 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums transition-colors duration-200 ${target === 'I' ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-transparent'}`}
                  style={{
                    color: target === 'I' ? 'var(--c-emerald)' : 'var(--c-ink)',
                    borderColor: target === 'I' ? 'var(--c-emerald-soft)' : 'var(--c-line)'
                  }}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>%</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={0.1}
              value={target === 'I' ? Math.min(25, results.I) : Math.min(25, I)}
              onChange={(e) => handleInputChange('I', Number(e.target.value))}
              aria-label="Rentabilidade Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>0% a.a.</span>
              <span>25% a.a.</span>
            </div>
          </div>

          {/* 4. Duração em Anos (T) */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label htmlFor="duration-input" className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--c-muted)' }}>
                Tempo de Retirada (Anos)
                {target === 'T' && <span className="text-[10px] bg-[var(--c-emerald-soft)] text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">⚡ Auto</span>}
              </label>
              <div className="relative w-28">
                <input
                  id="duration-input"
                  type="text"
                  inputMode="numeric"
                  value={target === 'T' ? (results.isPerpetual ? 'Perpétuo' : (results.T === 0 ? '' : Math.round(results.T).toString())) : (T === 0 ? '' : Math.round(T).toString())}
                  placeholder="0"
                  disabled={target === 'T' && results.isPerpetual}
                  onChange={(e) => handleInputChange('T', Math.max(0, Number(e.target.value) || 0))}
                  onFocus={() => prepareForEdit('T')}
                  className={`w-full text-right border rounded-xl pr-3.5 pl-3 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums transition-colors duration-200 ${target === 'T' ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-transparent'} disabled:opacity-100`}
                  style={{
                    color: target === 'T' ? 'var(--c-emerald)' : 'var(--c-ink)',
                    borderColor: target === 'T' ? 'var(--c-emerald-soft)' : 'var(--c-line)',
                    opacity: 1,
                    WebkitTextFillColor: target === 'T' ? 'var(--c-emerald)' : 'var(--c-ink)'
                  }}
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={target === 'T' ? Math.min(40, results.T) : Math.min(40, T)}
              disabled={target === 'T' && results.isPerpetual}
              onChange={(e) => handleInputChange('T', Number(e.target.value))}
              aria-label="Tempo Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-40"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>0 anos</span>
              <span>40 anos+</span>
            </div>
          </div>
        </CalculatorCard>

        {/* Action Button: Clear data */}
        <div className="flex justify-between items-center text-xs">
          <button
            onClick={handleReset}
            className="text-stone-500 dark:text-stone-400 font-bold hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
          >
            ✕ Limpar tudo
          </button>
          <span style={{ color: 'var(--c-muted)' }}>
            Variável calculada atual: <strong className="text-[var(--c-emerald)] dark:text-emerald-400">{target === 'C' ? 'Capital' : target === 'R' ? 'Retirada' : target === 'I' ? 'Rentabilidade' : 'Duração'}</strong>
          </span>
        </div>
      </div>

      {/* ── COLUNA DIREITA: RESULTADOS E GRÁFICOS ────────────────── */}
      <div role="region" aria-live="polite" aria-label="Resultados da Renda Passiva" className="lg:col-span-7 space-y-4">
        
        {/* Result Hero */}
        <ResultHero
          label={displayValues.label}
          value={displayValues.value}
          comment={displayValues.comment}
          colorClass="text-emerald-600 dark:text-emerald-400"
        />

        {/* Insight card */}
        {results.isPerpetual ? (
          <div className="rounded-2xl border p-4 flex gap-3 bg-emerald-500/5 border-emerald-500/10 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            <ShieldCheck className="shrink-0 text-emerald-600 dark:text-emerald-400 animate-bounce" size={20} />
            <div>
              <p className="font-extrabold text-emerald-950 dark:text-emerald-100 text-sm mb-1">Independência Financeira Perpétua Atingida! 🎓</p>
              <p>
                Os juros mensais gerados pelo seu patrimônio cobrem com folga sua retirada de **{formatBRL(results.R)}**. Isso significa que o capital principal nunca acabará, e seus investimentos continuarão crescendo de forma estável. Você atingiu a perpetuidade e pode viver de renda para sempre!
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border p-4 flex gap-3 bg-amber-500/5 border-amber-500/10 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
            <Flame className="shrink-0 text-amber-600 dark:text-amber-400" size={20} />
            <div>
              <p className="font-extrabold text-amber-950 dark:text-amber-100 text-sm mb-1">Consumo de Capital Ativo</p>
              <p>
                Sua retirada de **{formatBRL(results.R)}** é superior aos rendimentos gerados. O capital principal está sendo gradualmente consumido para suprir as retiradas. Sob estas taxas e período, seu patrimônio durará exatamente **{results.T.toFixed(1).replace('.', ',')} anos** antes de zerar por completo.
              </p>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <MetricGrid
          metrics={[
            {
              label: 'Rentabilidade Mensal',
              value: `${results.monthlyRate.toString().replace('.', ',')}%`,
              sublabel: 'equivalente à anual',
              colorClass: 'text-stone-900 dark:text-stone-100',
            },
            {
              label: 'Total de Retiradas',
              value: formatBRL(results.totalWithdrawn),
              sublabel: 'soma sacada no período',
              colorClass: 'text-emerald-600 dark:text-emerald-400',
            },
            {
              label: 'Juros Gerados',
              value: formatBRL(results.totalInterestEarned),
              sublabel: 'dinheiro gerado passivamente',
              colorClass: 'text-amber-700 dark:text-amber-400',
            },
          ]}
        />

        {/* Year-by-Year Evolution Chart */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{
            backgroundColor: 'var(--c-card-calm)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Curva de Desgaste do Patrimônio</p>
              <p className="text-xs" style={{ color: 'var(--c-muted)' }}>Projeção da evolução do seu capital ano a ano</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full" style={{ backgroundColor: results.isPerpetual ? 'var(--c-emerald-soft)' : 'var(--c-copper-soft)', color: results.isPerpetual ? 'var(--c-emerald)' : 'var(--c-copper)' }}>
              {results.isPerpetual ? 'Perpétuo' : 'Finito'}
            </span>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={results.timeline} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={results.isPerpetual ? '#10b981' : '#b4421b'} stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={results.isPerpetual ? '#10b981' : '#b4421b'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" opacity={0.6} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 10, fill: '#78716c' }}
                tickFormatter={(v) => `Ano ${v}`}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#78716c' }}
                tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                width={38}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(v) => [formatBRL(Number(v)), 'Saldo Acumulado']}
                labelFormatter={(label) => `Período: Ano ${label}`}
                contentStyle={{
                  backgroundColor: 'var(--c-card-calm)',
                  color: 'var(--c-ink)',
                  borderColor: 'var(--c-line)',
                  borderRadius: 12,
                  fontSize: 12
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={results.isPerpetual ? '#10b981' : '#b4421b'}
                fillOpacity={1}
                fill="url(#colorBalance)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 text-center italic">
            *A projeção assume reinvestimentos e taxa líquida constante sem considerar perdas inflacionárias adicionais.
          </p>
        </div>

        {/* Share Section Wrapped */}
        <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
            Compartilhe seu Planejamento de Renda
          </p>
          <ScaledPreview>
            <ShareCardBase
              id="income-share-card"
              eyebrow="Viver de Renda · Planejador"
              mainValue={results.isPerpetual ? 'PERPÉTUO' : `${results.T.toFixed(1).replace('.', ',')} ANOS`}
              mainLabel="duração estimada da minha aposentadoria planejada"
              metrics={[
                { label: 'Capital Acumulado', value: formatBRL(results.C) },
                { label: 'Retirada Mensal', value: formatBRL(results.R) },
                { label: 'Taxa Anual', value: `${results.I.toFixed(2).replace('.', ',')}% a.a.` },
                { label: 'Rendimento Inicial', value: `${formatBRL(results.C * (results.monthlyRate / 100))}/mês` },
              ]}
              footer="Independência financeira sob a ponta do lápis."
              accentColor={results.isPerpetual ? '#10b981' : '#b4421b'}
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="income-share-card" filename="viver-de-renda-planejador" />
          </div>
        </div>

      </div>
    </div>
  )
}
