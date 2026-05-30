'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareCardBase } from '@/components/share/ShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { formatBRL } from '@/lib/formatters'
import { REALIDADE_STATES, PROFESSIONS, MINIMUM_WAGE, StateData } from '@/config/realidade'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import { HelpCircle, ChevronRight, AlertCircle, Sparkles } from 'lucide-react'

// Algoritmo de Interpolação Linear de Percentil
function calculatePercentile(salary: number, values: number[]): number {
  const percentiles = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 99.9]
  
  if (salary <= 0) return 0
  
  // Se for menor que a menor faixa (P10)
  if (salary < values[0]) {
    const p = (salary / values[0]) * percentiles[0]
    return Math.max(0.1, p)
  }
  
  // Se for maior que a maior faixa (P99.9)
  if (salary >= values[values.length - 1]) {
    const highestVal = values[values.length - 1]
    const diff = salary - highestVal
    // Suavização logarítmica/exponencial para salários gigantescos, tendendo a 99.99%
    const bonus = 0.09 * (1 - Math.exp(-diff / 150000))
    return 99.9 + bonus
  }
  
  // Encontrar o intervalo correspondente e interpolar
  for (let i = 0; i < values.length - 1; i++) {
    if (salary >= values[i] && salary <= values[i + 1]) {
      const vStart = values[i]
      const vEnd = values[i + 1]
      const pStart = percentiles[i]
      const pEnd = percentiles[i + 1]
      
      const ratio = (salary - vStart) / (vEnd - vStart)
      return pStart + ratio * (pEnd - pStart)
    }
  }
  
  return 50
}

export function BrazilianRealidadeCalculator() {
  const [salary, setSalary] = useState<number>(3000)
  const [stateCode, setStateCode] = useState<string>('SP')

  // Encontra os dados do estado selecionado
  const selectedState = useMemo(() => {
    return REALIDADE_STATES.find(s => s.code === stateCode) || REALIDADE_STATES[0]
  }, [stateCode])

  const nationalState = useMemo(() => {
    return REALIDADE_STATES.find(s => s.code === 'BR') || REALIDADE_STATES[0]
  }, [])

  // Cálculos de Percentil
  const statePercentile = useMemo(() => {
    return calculatePercentile(salary, selectedState.percentileValues)
  }, [salary, selectedState])

  const nationalPercentile = useMemo(() => {
    return calculatePercentile(salary, nationalState.percentileValues)
  }, [salary, nationalState])

  // Comparações de Custo
  const salaryInMinimumWages = useMemo(() => {
    return salary / MINIMUM_WAGE
  }, [salary])

  const salaryInCestasBasicas = useMemo(() => {
    return salary / selectedState.cestaBasica
  }, [salary, selectedState])

  // Comparações de Profissões
  const professionComparisons = useMemo(() => {
    return PROFESSIONS.map(p => {
      const ratio = salary / p.salary
      const percentDiff = ((salary - p.salary) / p.salary) * 100
      return {
        ...p,
        ratio,
        percentDiff,
      }
    })
  }, [salary])

  // Dados para o Gráfico de Curva de Renda (Nacional)
  const chartData = useMemo(() => {
    const percentiles = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 99.9]
    return percentiles.map((p, idx) => ({
      percentile: p,
      label: `Top ${Math.round(100 - p)}%`,
      'Renda Mensal': selectedState.percentileValues[idx],
    }))
  }, [selectedState])

  // Interpolação para encontrar as coordenadas do ponto do usuário no gráfico
  const userChartPoint = useMemo(() => {
    return {
      percentile: Number(statePercentile.toFixed(1)),
      'Renda Mensal': salary,
    }
  }, [statePercentile, salary])

  // Frase de efeito (viral / reflexiva) baseada no percentil
  const realityComment = useMemo(() => {
    if (salary <= 0) return 'Digite um salário para ver seu impacto na pirâmide brasileira.'
    if (nationalPercentile < 40) {
      return `Você está entre a base mais vulnerável da economia brasileira. Sobreviver com esse valor exige um malabarismo diário.`
    }
    if (nationalPercentile < 70) {
      return `Você ganha mais do que a metade mais pobre do país, mas ainda sente a forte pressão dos custos cotidianos brasileiros.`
    }
    if (nationalPercentile < 90) {
      return `Seu salário é superior a ~80% do país. Isso mostra o abismo: uma renda de classe média média te coloca no topo da pirâmide nacional.`
    }
    if (nationalPercentile < 98) {
      return `Você faz parte dos 10% mais ricos do Brasil. Embora na sua bolha pareça classe média, você goza de um privilégio estatístico imenso.`
    }
    return `Você faz parte da elite econômica brasileira (Top ${Math.max(0.1, 100 - nationalPercentile).toFixed(1)}%). O abismo social entre você e a base é gigantesco.`
  }, [nationalPercentile, salary])

  // Formatação em string dos percentis para os cards
  const nationalDisplay = useMemo(() => {
    return nationalPercentile.toFixed(1).replace('.', ',')
  }, [nationalPercentile])

  const stateDisplay = useMemo(() => {
    return statePercentile.toFixed(1).replace('.', ',')
  }, [statePercentile])

  // Estilo premium do card se for Top 1%
  const isTopTier = nationalPercentile >= 99

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      {/* ── COLUNA ESQUERDA: INPUTS ────────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        <CalculatorCard 
          title="Seu Salário vs. Realidade Brasileira" 
          subtitle="Situe sua renda real diante da pirâmide da desigualdade social e econômica brasileira."
        >
          {/* Selecionar Estado */}
          <div className="space-y-2">
            <label htmlFor="state-select" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
              Seu Estado de residência/trabalho
            </label>
            <select
              id="state-select"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full border rounded-xl px-3 py-2.5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              style={{
                backgroundColor: 'var(--c-bg)',
                color: 'var(--c-ink)',
                borderColor: 'var(--c-line)'
              }}
            >
              <optgroup label="Nacional" style={{ fontWeight: 'bold' }}>
                {REALIDADE_STATES.filter(s => s.group === 'nacional').map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </optgroup>

              <optgroup label="Estados (Médias Gerais)" style={{ fontWeight: 'bold' }}>
                {REALIDADE_STATES.filter(s => s.group === 'estado').map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </optgroup>

              <optgroup label="Polos Econômicos Regionais" style={{ fontWeight: 'bold' }}>
                {REALIDADE_STATES.filter(s => s.group === 'polo').map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Valor Salarial Líquido */}
          <div className="space-y-2.5 pt-2">
            <div className="flex justify-between items-center">
              <label htmlFor="user-salary" className="text-base font-semibold" style={{ color: 'var(--c-muted)' }}>
                Seu Salário Mensal Líquido
              </label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="user-salary"
                  type="number"
                  inputMode="decimal"
                  step="10"
                  min={0}
                  max={500000}
                  value={salary === 0 ? '' : salary}
                  placeholder="0,00"
                  onChange={(e) => setSalary(Math.max(0, Number(e.target.value) || 0))}
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
              max={25000}
              step={100}
              value={salary > 25000 ? 25000 : salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              aria-label="Salário Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 0</span>
              <span>R$ 25 mil+</span>
            </div>
          </div>
        </CalculatorCard>

        {/* Alerta de desigualdade / Nota explicativa */}
        <div className="rounded-2xl border p-4 flex gap-3 bg-stone-500/5" style={{ borderColor: 'var(--c-line)' }}>
          <AlertCircle className="shrink-0 text-stone-500" size={18} style={{ color: 'var(--c-muted)' }} />
          <div className="space-y-1 text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            <p className="font-semibold" style={{ color: 'var(--c-ink-2)' }}>Sobre a base utilizada:</p>
            <p>
              Os cálculos consideram o rendimento mensal individual e são baseados nos microdados da **PNAD Contínua (IBGE)** e cesta básica do **DIEESE**. Os valores referem-se à renda líquida aproximada de impostos e encargos.
            </p>
          </div>
        </div>
      </div>

      {/* ── COLUNA DIREITA: RESULTADOS ──────────────────────────── */}
      <div role="region" aria-live="polite" aria-label="Resultado da Realidade Brasileira" className="lg:col-span-7 space-y-4">
        
        {/* Resultado Hero */}
        <div className={isTopTier ? 'relative rounded-[40px] border-2 border-amber-500/30 overflow-hidden transition-all duration-300' : ''}>
          {isTopTier && (
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/20 to-transparent p-4 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sparkles size={14} className="animate-spin" /> Elite Econômica
            </div>
          )}
          <ResultHero
            label="Seu Salário vs. Brasil"
            value={salary > 0 ? `Mais rico que ${nationalDisplay}%` : 'R$ 0,00'}
            comment={realityComment}
            colorClass={isTopTier ? 'text-amber-500 dark:text-amber-400 font-extrabold' : 'text-teal-600 dark:text-teal-400'}
            infoTooltip="A porcentagem indica o percentil exato em que seu salário se enquadra na população economicamente ativa ocupada. Um percentil de 90% significa que você ganha mais que 90% dos brasileiros."
          />
        </div>

        {/* Sub-métricas rápidas */}
        <MetricGrid
          metrics={[
            {
              label: selectedState.group === 'polo' ? `No polo: ${selectedState.capital}` : `No estado: ${selectedState.code}`,
              value: salary > 0 ? `Supera ${stateDisplay}%` : '0,0%',
              sublabel: 'da população local',
            },
            {
              label: 'Em salários mínimos',
              value: salary > 0 ? `${salaryInMinimumWages.toFixed(1).replace('.', ',')}x` : '0,0x',
              sublabel: `Mínimo de R$ ${MINIMUM_WAGE}`,
              colorClass: 'text-teal-600 dark:text-teal-400',
            },
            {
              label: 'Poder de Cesta Básica',
              value: salary > 0 ? `${salaryInCestasBasicas.toFixed(1).replace('.', ',')}x` : '0,0x',
              sublabel: selectedState.group === 'polo' 
                ? `Cesta em ${selectedState.capital}: R$ ${selectedState.cestaBasica}`
                : `Cesta em ${selectedState.capital || 'Capitais'}: R$ ${selectedState.cestaBasica}`,
              colorClass: 'text-amber-500 dark:text-amber-400',
            },
          ]}
        />

        {/* Curva de Concentração Recharts */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{
            backgroundColor: 'var(--c-card-calm)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Curva de Distribuição de Renda</p>
              <p className="text-xs" style={{ color: 'var(--c-muted)' }}>Onde você está na pirâmide de renda de {selectedState.name}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 12, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isTopTier ? '#f59e0b' : '#0a8a7e'} stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={isTopTier ? '#f59e0b' : '#0a8a7e'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" opacity={0.6} />
              <XAxis
                dataKey="percentile"
                tick={{ fontSize: 10, fill: '#78716c' }}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#78716c' }}
                tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value) => [formatBRL(Number(value)), 'Corte de Renda']}
                labelFormatter={(label) => `Percentil: ${label}% da População`}
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
                dataKey="Renda Mensal"
                stroke={isTopTier ? '#f59e0b' : '#0a8a7e'}
                fillOpacity={1}
                fill="url(#colorIncome)"
                strokeWidth={2}
              />
              
              {/* O ponto exato do usuário */}
              {salary > 0 && (
                <ReferenceDot
                  x={userChartPoint.percentile}
                  y={userChartPoint['Renda Mensal']}
                  r={6}
                  fill={isTopTier ? '#f59e0b' : '#00C4BE'}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-stone-400 text-center italic">
            O eixo horizontal representa a porcentagem da população mais pobre que você supera. O eixo vertical indica a renda correspondente.
          </p>
        </div>

        {/* Section: Comparações de Profissões */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{
            backgroundColor: 'var(--c-card-calm)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex justify-between items-baseline" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 12 }}>
            <h3 className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Comparações Profissionais</h3>
            <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--c-muted)' }}>Média vs Seu Salário</span>
          </div>

          <div className="divide-y text-sm" style={{ borderColor: 'var(--c-line)' }}>
            {professionComparisons.map((p) => {
              const matches = salary >= p.salary
              const ratioText = matches 
                ? `(+${p.percentDiff.toFixed(0)}%)`
                : `(${p.percentDiff.toFixed(0)}%)`

              return (
                <div key={p.name} className="flex items-center justify-between py-3 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{p.emoji}</span>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--c-ink)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--c-muted)' }}>Média: {formatBRL(p.salary)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold tabular-nums ${matches ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-500'}`}>
                      {matches ? '+' : ''}{p.ratio.toFixed(1).replace('.', ',')}x
                    </p>
                    <p className={`text-[10px] font-bold ${matches ? 'text-emerald-500' : 'text-red-500'}`}>
                      {ratioText}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section: Compartilhar o Wrapped da desigualdade */}
        <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
            Compartilhe a sua posição
          </p>
          <ScaledPreview>
            <ShareCardBase
              id="realidade-share-card"
              eyebrow="Realidade Brasileira · Minha Posição"
              mainValue={salary > 0 ? `TOP ${(100 - nationalPercentile).toFixed(1).replace('.', ',')}%` : 'PIRÂMIDE'}
              mainLabel={`ganho mais que ${nationalDisplay}% dos brasileiros`}
              metrics={[
                { label: 'Meu Salário Líquido', value: formatBRL(salary) },
                { label: selectedState.group === 'polo' ? `No polo de ${selectedState.capital}` : `No estado de ${selectedState.code}`, value: `Mais rico que ${stateDisplay}%` },
                { label: 'Salários Mínimos', value: `${salaryInMinimumWages.toFixed(1).replace('.', ',')} mínimos` },
                { label: 'Cestas Básicas', value: `${salaryInCestasBasicas.toFixed(1).replace('.', ',')} unidades` },
              ]}
              footer="a pirâmide da desigualdade social sob a ponta do lápis."
              accentColor={isTopTier ? '#f59e0b' : '#0a8a7e'}
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="realidade-share-card" filename="realidade-brasileira" />
          </div>
        </div>

      </div>
    </div>
  )
}
