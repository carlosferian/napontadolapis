'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { formatBRL, formatBRLDecimal, formatPct } from '@/lib/formatters'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface EvolutionPoint {
  period: number
  label: string
  invested: number
  interest: number
  cumulativeInterest: number
  total: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

function CustomChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div 
      className="rounded-xl border shadow-lg p-3 text-sm space-y-1.5"
      style={{
        backgroundColor: 'var(--c-card-calm)',
        color: 'var(--c-ink)',
        borderColor: 'var(--c-line)'
      }}
    >
      <p className="font-bold" style={{ color: 'var(--c-muted)' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="tabular-nums font-semibold">
          {p.name}: <span>{formatBRL(p.value)}</span>
        </p>
      ))}
      <p 
        className="border-t pt-1.5 font-bold tabular-nums" 
        style={{ borderColor: 'var(--c-line)', color: 'var(--c-ink)' }}
      >
        Total: {formatBRL(payload[0].value + payload[1].value)}
      </p>
    </div>
  )
}

export function CompoundInterestCalculator() {
  // Input states
  const [initialInvestment, setInitialInvestment] = useState(10000)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [interestRate, setInterestRate] = useState(10.5)
  const [interestType, setInterestType] = useState<'annual' | 'monthly'>('annual')
  const [period, setPeriod] = useState(10)
  const [periodType, setPeriodType] = useState<'years' | 'months'>('years')

  // UI states
  const [tableType, setTableType] = useState<'yearly' | 'monthly'>('yearly')
  const [showTable, setShowTable] = useState(false)

  // Calculations
  const results = useMemo(() => {
    const totalMonths = periodType === 'years' ? period * 12 : period
    
    // Effective monthly interest rate
    let r = 0
    if (interestType === 'monthly') {
      r = interestRate / 100
    } else {
      // Annual compound rate conversion: (1 + i/100)^(1/12) - 1
      r = interestRate > 0 ? Math.pow(1 + interestRate / 100, 1 / 12) - 1 : 0
    }

    let balance = initialInvestment
    let totalInvested = initialInvestment
    let cumulativeInterest = 0
    
    const evolution: EvolutionPoint[] = []
    
    // Month 0 (Starting point)
    evolution.push({
      period: 0,
      label: 'Início',
      invested: initialInvestment,
      interest: 0,
      cumulativeInterest: 0,
      total: initialInvestment
    })

    for (let m = 1; m <= totalMonths; m++) {
      const interestForMonth = balance * r
      balance = balance + interestForMonth + monthlyContribution
      totalInvested += monthlyContribution
      cumulativeInterest += interestForMonth
      
      evolution.push({
        period: m,
        label: `Mês ${m}`,
        invested: totalInvested,
        interest: interestForMonth,
        cumulativeInterest: cumulativeInterest,
        total: balance
      })
    }

    // Yearly evolution (consolidate every 12 months)
    const yearlyEvolution: EvolutionPoint[] = []
    yearlyEvolution.push({
      period: 0,
      label: 'Início',
      invested: initialInvestment,
      interest: 0,
      cumulativeInterest: 0,
      total: initialInvestment
    })

    for (let i = 12; i <= totalMonths; i += 12) {
      const point = evolution[i]
      yearlyEvolution.push({
        period: i / 12,
        label: `Ano ${i / 12}`,
        invested: point.invested,
        interest: evolution.slice(i - 11, i + 1).reduce((sum, p) => sum + p.interest, 0),
        cumulativeInterest: point.cumulativeInterest,
        total: point.total
      })
    }

    // Handle partial final year if period type is monthly and not multiple of 12
    if (totalMonths % 12 !== 0) {
      const finalPoint = evolution[totalMonths]
      const years = Math.ceil(totalMonths / 12)
      const prevPivot = Math.floor(totalMonths / 12) * 12
      yearlyEvolution.push({
        period: years,
        label: `${years}º Ano (parcial)`,
        invested: finalPoint.invested,
        interest: evolution.slice(prevPivot + 1, totalMonths + 1).reduce((sum, p) => sum + p.interest, 0),
        cumulativeInterest: finalPoint.cumulativeInterest,
        total: finalPoint.total
      })
    }

    return {
      totalAccumulated: balance,
      totalInvested: totalInvested,
      totalInterest: cumulativeInterest,
      evolution,
      yearlyEvolution,
      totalMonths,
    }
  }, [initialInvestment, monthlyContribution, interestRate, interestType, period, periodType])

  const chartData = useMemo(() => {
    // If period is large, show yearly points to keep chart performant and crisp
    const rawData = results.totalMonths > 36 ? results.yearlyEvolution : results.evolution
    
    return rawData.map(p => ({
      label: p.label,
      'Valor Investido': p.invested,
      'Juros Acumulados': p.cumulativeInterest,
    }))
  }, [results])

  const multiplier = results.totalInvested > 0 
    ? (results.totalAccumulated / results.totalInvested).toFixed(1).replace('.', ',')
    : '1,0'

  function exportTable() {
    const rateLabel = interestType === 'annual' ? 'a.a.' : 'a.m.'
    const durationLabel = periodType === 'years' ? 'anos' : 'meses'
    const tableData = tableType === 'yearly' ? results.yearlyEvolution : results.evolution

    const lines = [
      '─── SIMULAÇÃO DE JUROS COMPOSTOS ──────────',
      `Investimento Inicial:        ${formatBRL(initialInvestment)}`,
      `Aporte Mensal:               ${formatBRL(monthlyContribution)}`,
      `Taxa de Juros:               ${interestRate}% ${rateLabel}`,
      `Período de Tempo:            ${period} ${durationLabel}`,
      '',
      '─── RESULTADO CONSOLIDADO ─────────────────',
      `Valor Total Acumulado:       ${formatBRL(results.totalAccumulated)}`,
      `Valor Total Investido:       ${formatBRL(results.totalInvested)}`,
      `Total Ganho em Juros:        ${formatBRL(results.totalInterest)}`,
      `Multiplicador de Capital:     ${multiplier}x o valor investido`,
      '',
      `─── EVOLUÇÃO (${tableType === 'yearly' ? 'ANUAL' : 'MENSAL'}) ──────────────────`,
      'Período | Valor Investido | Juros do Período | Juros Acumulados | Total',
      '--------|-----------------|------------------|------------------|------------─'
    ]

    tableData.forEach(p => {
      lines.push(
        `${p.label.padEnd(8)} | ` +
        `${formatBRLDecimal(p.invested).padEnd(15)} | ` +
        `${formatBRLDecimal(p.interest).padEnd(16)} | ` +
        `${formatBRLDecimal(p.cumulativeInterest).padEnd(16)} | ` +
        `${formatBRLDecimal(p.total)}`
      )
    })

    lines.push('', `Calculado em apontadolapis.com.br | ${new Date().toLocaleDateString('pt-BR')}`)

    const text = lines.join('\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `juros-compostos-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleReset() {
    setInitialInvestment(10000)
    setMonthlyContribution(500)
    setInterestRate(10.5)
    setInterestType('annual')
    setPeriod(10)
    setPeriodType('years')
    setShowTable(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      {/* ── INPUTS COLUMN ───────────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        <CalculatorCard title="Simulador de Juros Compostos" subtitle="Visualize o poder exponencial do tempo e do reinvestimento.">
          
          {/* 1. Valor Inicial */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label htmlFor="initial-investment" className="text-base font-semibold" style={{ color: 'var(--c-muted)' }}>
                Valor Inicial
              </label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="initial-investment"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={5000000}
                  value={initialInvestment || ''}
                  onChange={(e) => setInitialInvestment(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full text-right border rounded-xl pr-3.5 pl-9 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  style={{
                    backgroundColor: 'var(--c-bg)',
                    color: 'var(--c-ink)',
                    borderColor: 'var(--c-line)'
                  }}
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={250000}
              step={1000}
              value={initialInvestment > 250000 ? 250000 : initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              aria-label="Valor Inicial Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 0</span>
              <span>R$ 250 mil+</span>
            </div>
          </div>

          {/* 2. Aporte Mensal */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label htmlFor="monthly-contribution" className="text-base font-semibold" style={{ color: 'var(--c-muted)' }}>
                Aporte Mensal
              </label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="monthly-contribution"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={500000}
                  value={monthlyContribution || ''}
                  onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full text-right border rounded-xl pr-3.5 pl-9 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  style={{
                    backgroundColor: 'var(--c-bg)',
                    color: 'var(--c-ink)',
                    borderColor: 'var(--c-line)'
                  }}
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={15000}
              step={100}
              value={monthlyContribution > 15000 ? 15000 : monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              aria-label="Aporte Mensal Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 0</span>
              <span>R$ 15 mil+</span>
            </div>
          </div>

          {/* 3. Taxa de Juros */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label htmlFor="interest-rate" className="text-base font-semibold" style={{ color: 'var(--c-muted)' }}>
                Taxa de Juros
              </label>
              <div className="flex items-center gap-2">
                <div className="relative w-28">
                  <input
                    id="interest-rate"
                    type="number"
                    step={0.1}
                    min={0}
                    max={100}
                    value={interestRate || ''}
                    onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full text-right border rounded-xl pr-7 pl-2.5 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                    style={{
                      backgroundColor: 'var(--c-bg)',
                      color: 'var(--c-ink)',
                      borderColor: 'var(--c-line)'
                    }}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>%</span>
                </div>
                <div className="flex border rounded-lg p-0.5 shrink-0" style={{ backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-line)' }}>
                  <button
                    type="button"
                    onClick={() => setInterestType('monthly')}
                    className="px-2.5 py-1 rounded-md text-xs font-bold uppercase transition-colors cursor-pointer"
                    style={interestType === 'monthly' ? {
                      backgroundColor: 'var(--c-emerald)',
                      color: '#ffffff',
                    } : {
                      color: 'var(--c-muted)',
                    }}
                  >
                    Mensal
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterestType('annual')}
                    className="px-2.5 py-1 rounded-md text-xs font-bold uppercase transition-colors cursor-pointer"
                    style={interestType === 'annual' ? {
                      backgroundColor: 'var(--c-emerald)',
                      color: '#ffffff',
                    } : {
                      color: 'var(--c-muted)',
                    }}
                  >
                    Anual
                  </button>
                </div>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={interestType === 'annual' ? 30 : 5}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              aria-label="Taxa de Juros Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>0%</span>
              <span>{interestType === 'annual' ? '30%' : '5%'}</span>
            </div>
          </div>

          {/* 4. Período */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label htmlFor="period" className="text-base font-semibold" style={{ color: 'var(--c-muted)' }}>
                Período
              </label>
              <div className="flex items-center gap-2">
                <div className="relative w-24">
                  <input
                    id="period"
                    type="number"
                    min={1}
                    max={480}
                    value={period || ''}
                    onChange={(e) => setPeriod(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full text-right border rounded-xl px-2.5 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                    style={{
                      backgroundColor: 'var(--c-bg)',
                      color: 'var(--c-ink)',
                      borderColor: 'var(--c-line)'
                    }}
                  />
                </div>
                <div className="flex border rounded-lg p-0.5 shrink-0" style={{ backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-line)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (periodType === 'years') {
                        setPeriod(period * 12)
                      }
                      setPeriodType('months')
                    }}
                    className="px-2.5 py-1 rounded-md text-xs font-bold uppercase transition-colors cursor-pointer"
                    style={periodType === 'months' ? {
                      backgroundColor: 'var(--c-emerald)',
                      color: '#ffffff',
                    } : {
                      color: 'var(--c-muted)',
                    }}
                  >
                    Meses
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (periodType === 'months') {
                        setPeriod(Math.max(1, Math.round(period / 12)))
                      }
                      setPeriodType('years')
                    }}
                    className="px-2.5 py-1 rounded-md text-xs font-bold uppercase transition-colors cursor-pointer"
                    style={periodType === 'years' ? {
                      backgroundColor: 'var(--c-emerald)',
                      color: '#ffffff',
                    } : {
                      color: 'var(--c-muted)',
                    }}
                  >
                    Anos
                  </button>
                </div>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={periodType === 'years' ? 40 : 360}
              step={1}
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              aria-label="Período Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>1 {periodType === 'years' ? 'ano' : 'mês'}</span>
              <span>{periodType === 'years' ? '40 anos' : '360 meses'}</span>
            </div>
          </div>
        </CalculatorCard>

        {/* Clear buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            ✕ Limpar dados
          </button>
          <button
            onClick={exportTable}
            className="text-xs font-semibold transition-colors flex items-center gap-1.5 border rounded-lg px-3 py-1.5 cursor-pointer"
            style={{
              borderColor: 'var(--c-line)',
              color: 'var(--c-muted)',
            }}
          >
            ↓ Exportar simulação
          </button>
        </div>
      </div>

      {/* ── RESULTS COLUMN ──────────────────────────────── */}
      <div role="region" aria-live="polite" aria-label="Resultados da Simulação" className="lg:col-span-7 space-y-4">
        
        {/* Total accumulated card */}
        <ResultHero
          label="Valor Total Acumulado"
          value={formatBRL(results.totalAccumulated)}
          comment={`Seu dinheiro se multiplicou por ${multiplier}x no período.`}
          colorClass="text-emerald-600 dark:text-emerald-400"
        />

        {/* Grid sub-metrics */}
        <MetricGrid
          metrics={[
            {
              label: 'Total Investido',
              value: formatBRL(results.totalInvested),
              sublabel: 'soma dos seus aportes',
              colorClass: 'text-stone-900 dark:text-stone-100',
            },
            {
              label: 'Total em Juros',
              value: formatBRL(results.totalInterest),
              sublabel: 'rendimento acumulado',
              colorClass: 'text-emerald-600 dark:text-emerald-400',
            },
            {
              label: 'Percentual de Juros',
              value: results.totalAccumulated > 0 
                ? formatPct((results.totalInterest / results.totalAccumulated) * 100)
                : '0%',
              sublabel: 'participação no total',
              colorClass: 'text-amber-500 dark:text-amber-400',
            },
          ]}
        />

        {/* Interactive Growth Chart */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{
            backgroundColor: 'var(--c-card-calm)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex justify-between items-center">
            <p className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Curva de Evolução Patrimonial</p>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              {results.totalMonths > 36 ? 'Visualização Anual' : 'Visualização Mensal'}
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#78716c" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#78716c" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" opacity={0.6} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#78716c' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#78716c' }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                width={38}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>{value}</span>
                )}
              />
              {/* Invested Area */}
              <Area
                type="monotone"
                dataKey="Valor Investido"
                stackId="1"
                stroke="#78716c"
                fillOpacity={1}
                fill="url(#colorInvested)"
                strokeWidth={1.5}
              />
              {/* Interest Area */}
              <Area
                type="monotone"
                dataKey="Juros Acumulados"
                stackId="1"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorInterest)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          {results.totalInterest > results.totalInvested && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl px-4 py-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              💡 <strong>Efeito Bola de Neve!</strong> A partir deste período, os rendimentos em juros são maiores do que o capital total que você tirou do próprio bolso.
            </div>
          )}
        </div>

        {/* Mattress Comparison Card */}
        <div 
          className="rounded-2xl border p-5 space-y-2"
          style={{
            backgroundColor: 'var(--c-surface)',
            borderColor: 'var(--c-line)'
          }}
        >
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>A Diferença Crua</p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
            Se você guardasse o dinheiro no <strong style={{ color: 'var(--c-ink)' }}>"colchão"</strong> (sem render nada), você teria acumulado apenas <strong style={{ color: 'var(--c-ink)' }}>{formatBRL(results.totalInvested)}</strong>. 
            Graças aos juros compostos, você ganhou <span className="font-bold text-emerald-600 dark:text-emerald-400">+{formatBRL(results.totalInterest)}</span> a mais de rendimentos passivos.
          </p>
        </div>

        {/* Evolution Table Accordion */}
        <div 
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}
        >
          <button
            onClick={() => setShowTable((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Tabela de Evolução Temporal</span>
            <span className="text-sm font-bold" style={{ color: 'var(--c-muted)' }}>{showTable ? '▲' : '▼'}</span>
          </button>
          
          {showTable && (
            <div className="px-5 pb-5 pt-2 border-t space-y-4 bg-stone-50/30 dark:bg-stone-900/10" style={{ borderColor: 'var(--c-line)' }}>
              <div className="flex justify-between items-center gap-3">
                <span className="text-xs font-bold" style={{ color: 'var(--c-muted)' }}>Filtro de período da tabela:</span>
                <div className="flex border rounded-lg p-0.5" style={{ backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-line)' }}>
                  <button
                    type="button"
                    onClick={() => setTableType('yearly')}
                    className="px-3 py-1 rounded-md text-xs font-bold uppercase transition-colors cursor-pointer"
                    style={tableType === 'yearly' ? {
                      backgroundColor: 'var(--c-emerald)',
                      color: '#ffffff',
                    } : {
                      color: 'var(--c-muted)',
                    }}
                  >
                    Anual
                  </button>
                  <button
                    type="button"
                    onClick={() => setTableType('monthly')}
                    className="px-3 py-1 rounded-md text-xs font-bold uppercase transition-colors cursor-pointer"
                    style={tableType === 'monthly' ? {
                      backgroundColor: 'var(--c-emerald)',
                      color: '#ffffff',
                    } : {
                      color: 'var(--c-muted)',
                    }}
                  >
                    Mensal
                  </button>
                </div>
              </div>

              {/* Table wrapper with scroll */}
              <div 
                className="overflow-x-auto max-h-80 overflow-y-auto rounded-xl border scrollbar-thin"
                style={{
                  backgroundColor: 'var(--c-bg)',
                  borderColor: 'var(--c-line)'
                }}
              >
                <table className="w-full text-left border-collapse text-sm tabular-nums">
                  <thead>
                    <tr className="sticky top-0 shadow-sm" style={{ backgroundColor: 'var(--c-surface)', borderBottom: '1px solid var(--c-line)' }}>
                      <th className="px-4 py-3 font-bold" style={{ color: 'var(--c-muted)' }}>Tempo</th>
                      <th className="px-4 py-3 font-bold" style={{ color: 'var(--c-muted)' }}>Investido</th>
                      <th className="px-4 py-3 font-bold" style={{ color: 'var(--c-muted)' }}>Rendimento</th>
                      <th className="px-4 py-3 font-bold" style={{ color: 'var(--c-muted)' }}>Juros Acumulados</th>
                      <th className="px-4 py-3 font-bold" style={{ color: 'var(--c-ink)' }}>Total Acumulado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--c-line)' }}>
                    {(tableType === 'yearly' ? results.yearlyEvolution : results.evolution).map((p) => (
                      <tr key={p.label} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--c-muted)' }}>{p.label}</td>
                        <td className="px-4 py-2.5" style={{ color: 'var(--c-ink-2)' }}>{formatBRLDecimal(p.invested)}</td>
                        <td className="px-4 py-2.5 font-semibold text-emerald-600 dark:text-emerald-400">{p.interest > 0 ? `+${formatBRLDecimal(p.interest)}` : formatBRLDecimal(0)}</td>
                        <td className="px-4 py-2.5" style={{ color: 'var(--c-muted)' }}>{formatBRLDecimal(p.cumulativeInterest)}</td>
                        <td className="px-4 py-2.5 font-bold" style={{ color: 'var(--c-ink)' }}>{formatBRLDecimal(p.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
