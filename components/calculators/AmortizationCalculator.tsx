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
import { calculateAmortizationComparison, AmortizationInput, AmortizationSummary } from '@/lib/calculations/amortization'
import { HelpCircle, Info, Home, Calendar, ShieldAlert, Sparkles, TrendingDown, ArrowRight, Layers, Percent } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export function AmortizationCalculator() {
  // Input states
  const [financedAmount, setFinancedAmount] = useState<number>(300000)
  const [annualRate, setAnnualRate] = useState<number>(10.5)
  const [years, setYears] = useState<number>(30)
  const [extraMonthly, setExtraMonthly] = useState<number>(500)
  const [extraType, setExtraType] = useState<'prazo' | 'parcela'>('prazo')
  const [selectedSystem, setSelectedSystem] = useState<'sac' | 'price'>('sac')

  const totalMonths = useMemo(() => years * 12, [years])

  // Process amortization calculations
  const simulationInput = useMemo<AmortizationInput>(() => ({
    financedAmount,
    annualInterestRate: annualRate,
    totalMonths,
    extraMonthlyAmount: extraMonthly,
    extraType
  }), [financedAmount, annualRate, totalMonths, extraMonthly, extraType])

  const results = useMemo(() => {
    return calculateAmortizationComparison(simulationInput)
  }, [simulationInput])

  // Get values for current selected system (SAC or Price)
  const currentOriginal = useMemo<AmortizationSummary>(() => {
    return selectedSystem === 'sac' ? results.sacOriginal : results.priceOriginal
  }, [selectedSystem, results])

  const currentWithExtra = useMemo<AmortizationSummary>(() => {
    return selectedSystem === 'sac' ? results.sacWithExtra : results.priceWithExtra
  }, [selectedSystem, results])

  // Helper formatting for durations
  const formatMonthsToYears = (m: number) => {
    const y = Math.floor(m / 12)
    const rest = m % 12
    if (y === 0) return `${rest} ${rest === 1 ? 'mês' : 'meses'}`
    if (rest === 0) return `${y} ${y === 1 ? 'ano' : 'anos'}`
    return `${y} ${y === 1 ? 'ano' : 'anos'} e ${rest} ${rest === 1 ? 'mês' : 'meses'}`
  }

  // Prepares sampled data for Recharts to keep it very fast and readable (samples every year)
  const chartData = useMemo(() => {
    const origTimeline = currentOriginal.timeline
    const extraTimeline = currentWithExtra.timeline
    const maxLength = Math.max(origTimeline.length, extraTimeline.length)
    
    const data = []
    
    // Insere ponto inicial no Mês 0
    data.push({
      year: 0,
      month: 0,
      'Saldo Normal': financedAmount,
      'Saldo com Aporte': financedAmount,
    })

    // Amostra a cada 12 meses (anual) para manter o gráfico legível e rápido
    for (let m = 12; m <= maxLength; m += 12) {
      const origPoint = origTimeline.find(p => p.month === m) || origTimeline[origTimeline.length - 1]
      const extraPoint = extraTimeline.find(p => p.month === m) || extraTimeline[extraTimeline.length - 1]
      
      const origBalance = m <= origTimeline.length ? origPoint.outstandingBalance : 0
      const extraBalance = m <= extraTimeline.length ? extraPoint.outstandingBalance : 0

      data.push({
        year: Math.floor(m / 12),
        month: m,
        'Saldo Normal': origBalance,
        'Saldo com Aporte': extraBalance,
      })
    }

    // Ponto final garantido caso o financiamento acabe fora da janela anual
    const lastOrigMonth = origTimeline.length
    const lastExtraMonth = extraTimeline.length
    if (lastOrigMonth % 12 !== 0) {
      data.push({
        year: Number((lastOrigMonth / 12).toFixed(1)),
        month: lastOrigMonth,
        'Saldo Normal': 0,
        'Saldo com Aporte': lastExtraMonth >= lastOrigMonth ? extraTimeline[lastOrigMonth - 1]?.outstandingBalance || 0 : 0
      })
    }
    if (lastExtraMonth % 12 !== 0 && lastExtraMonth !== lastOrigMonth) {
      data.push({
        year: Number((lastExtraMonth / 12).toFixed(1)),
        month: lastExtraMonth,
        'Saldo Normal': 0,
        'Saldo com Aporte': 0
      })
    }

    // Ordena os pontos cronologicamente
    return data.sort((a, b) => a.month - b.month)
  }, [currentOriginal, currentWithExtra, financedAmount])

  // Custom tooltip component for Recharts
  const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 p-3 shadow-md text-xs space-y-1">
        <p className="font-bold text-stone-700 dark:text-stone-300">Ano {payload[0].payload.year} (Mês {payload[0].payload.month})</p>
        {payload.map((p: any) => (
          <p key={p.name} className="tabular-nums" style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{formatBRL(p.value)}</span>
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      {/* ── COLUNA ESQUERDA: PARÂMETROS ────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        
        <CalculatorCard 
          title="Parâmetros do Financiamento" 
          subtitle="Simule o valor contratado, a taxa e defina os aportes extras para projetar a economia."
        >
          {/* Valor Financiado */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label htmlFor="financed-amount" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                Valor Total Financiado
              </label>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {formatBRL(financedAmount)}
              </span>
            </div>
            <input
              id="financed-amount"
              type="range"
              min={50000}
              max={1500000}
              step={10000}
              value={financedAmount}
              onChange={(e) => setFinancedAmount(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
              <span>R$ 50 mil</span>
              <span>R$ 1.5 milhão</span>
            </div>
          </div>

          {/* Taxa de Juros Anual */}
          <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-baseline">
              <label htmlFor="annual-rate" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                Taxa de Juros Nominal
              </label>
              <span className="text-sm font-bold" style={{ color: 'var(--c-ink)' }}>
                {annualRate.toString().replace('.', ',')}% a.a. <span className="text-[10px] font-medium" style={{ color: 'var(--c-muted)' }}>({(annualRate / 12).toFixed(2).replace('.', ',')}% a.m.)</span>
              </span>
            </div>
            <input
              id="annual-rate"
              type="range"
              min={4}
              max={18}
              step={0.1}
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
              <span>4% ao ano (mínimo)</span>
              <span>18% ao ano (máximo)</span>
            </div>
          </div>

          {/* Prazo em Anos */}
          <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-baseline">
              <label htmlFor="years-term" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                Prazo Total do Contrato
              </label>
              <span className="text-sm font-bold" style={{ color: 'var(--c-ink)' }}>
                {years} {years === 1 ? 'ano' : 'anos'} <span className="text-[10px] font-medium" style={{ color: 'var(--c-muted)' }}>({totalMonths} meses)</span>
              </span>
            </div>
            <input
              id="years-term"
              type="range"
              min={5}
              max={35}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
              <span>5 anos</span>
              <span>35 anos (limite padrão)</span>
            </div>
          </div>
        </CalculatorCard>

        {/* Card de Amortização Extra (Aceleração) */}
        <CalculatorCard 
          title="Acelerar Quitação (Aporte Extra)" 
          subtitle="Adicione um valor mensal além da parcela para liquidar o saldo devedor mais rapidamente."
        >
          {/* Aporte Extra Mensal */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label htmlFor="extra-monthly" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                Aporte Extra Mensal Previsto
              </label>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {extraMonthly === 0 ? 'Nenhum' : formatBRL(extraMonthly)}
              </span>
            </div>
            <input
              id="extra-monthly"
              type="range"
              min={0}
              max={5000}
              step={50}
              value={extraMonthly}
              onChange={(e) => setExtraMonthly(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
              <span>Sem aporte extra</span>
              <span>R$ 5.000 / mês</span>
            </div>
          </div>

          {/* Estratégia de Amortização (Prazo vs Parcela) */}
          <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <span className="text-xs font-semibold block" style={{ color: 'var(--c-muted)' }}>
              Estratégia de Amortização Extra
            </span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setExtraType('prazo')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${extraType === 'prazo' ? 'bg-stone-900 border-stone-950 text-white dark:bg-stone-100 dark:border-stone-50 dark:text-stone-900' : 'bg-transparent text-stone-500'}`}
                style={{ borderColor: 'var(--c-line)' }}
              >
                ⚡ Reduzir o Prazo
              </button>
              <button
                type="button"
                onClick={() => setExtraType('parcela')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${extraType === 'parcela' ? 'bg-stone-900 border-stone-950 text-white dark:bg-stone-100 dark:border-stone-50 dark:text-stone-900' : 'bg-transparent text-stone-500'}`}
                style={{ borderColor: 'var(--c-line)' }}
              >
                📉 Reduzir Parcela
              </button>
            </div>
            <p className="text-[10px] italic leading-relaxed pt-1" style={{ color: 'var(--c-muted)' }}>
              {extraType === 'prazo' 
                ? 'Recomendado e mais viral! O valor da parcela mensal é mantido, mas o número de anos diminui drasticamente, economizando o máximo de juros acumulados.' 
                : 'O prazo em anos é mantido, mas o valor da parcela mensal cai a cada aporte. Excelente para reduzir o comprometimento da renda mensal.'}
            </p>
          </div>
        </CalculatorCard>

        {/* Info Box sobre os Sistemas SAC e Price */}
        <div className="rounded-2xl border p-4 flex gap-3 bg-stone-500/5 text-xs text-stone-500 leading-relaxed" style={{ borderColor: 'var(--c-line)' }}>
          <Info className="shrink-0 text-stone-500" size={18} style={{ color: 'var(--c-muted)' }} />
          <div className="space-y-1.5" style={{ color: 'var(--c-muted)' }}>
            <p className="font-bold" style={{ color: 'var(--c-ink-2)' }}>Diferença entre SAC e Tabela Price:</p>
            <p>
              Na **SAC (Sistema de Amortização Constante)**, a amortização é fixa e a parcela começa mais alta e diminui todo mês à medida que os juros caem. Representa 90% dos contratos habitacionais.
            </p>
            <p>
              Na **Tabela Price**, a parcela começa mais baixa e permanece fixa ao longo de todo o prazo. Porém, a amortização inicial é muito lenta, fazendo com que o saldo devedor demore muito mais para cair, resultando em mais juros pagos no final das contas.
            </p>
          </div>
        </div>

      </div>

      {/* ── COLUNA DIREITA: RESULTADOS E COMPARAÇÕES ────────────── */}
      <div role="region" aria-live="polite" aria-label="Resultado do Financiamento" className="lg:col-span-7 space-y-4">
        
        {/* Alternador do Sistema Principal (SAC vs Price) */}
        <div className="rounded-2xl border p-1.5 flex gap-1 bg-stone-500/5" style={{ borderColor: 'var(--c-line)' }}>
          <button
            type="button"
            onClick={() => setSelectedSystem('sac')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${selectedSystem === 'sac' ? 'bg-white dark:bg-stone-800 shadow-sm border text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}
            style={{ borderColor: selectedSystem === 'sac' ? 'var(--c-line)' : 'transparent' }}
          >
            📊 Sistema SAC <span className="text-[9px] px-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-md font-semibold">Mais Comum</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedSystem('price')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${selectedSystem === 'price' ? 'bg-white dark:bg-stone-800 shadow-sm border text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}
            style={{ borderColor: selectedSystem === 'price' ? 'var(--c-line)' : 'transparent' }}
          >
            📈 Tabela Price <span className="text-[9px] px-1 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-md font-semibold">Parcelas Fixas</span>
          </button>
        </div>

        {/* Result Hero (Projeção e Economia de Juros) */}
        <ResultHero
          label={`Economia com Aportes Extras (Sistema ${selectedSystem.toUpperCase()})`}
          value={extraMonthly === 0 ? 'Aporte Zerado' : formatBRL(currentWithExtra.interestSaved)}
          comment={extraMonthly === 0 
            ? 'Defina um aporte extra mensal na barra ao lado para calcular a economia de juros e meses.'
            : extraType === 'prazo'
              ? `Fazendo aportes extras de ${formatBRL(extraMonthly)}/mês, você quitará o financiamento em ${formatMonthsToYears(currentWithExtra.monthsRequired)} em vez de ${years} anos! Economia líquida de ${formatMonthsToYears(currentWithExtra.monthsSaved)} de parcelas.`
              : `Com o aporte extra, você manterá o prazo de ${years} anos, mas a parcela diminuirá progressivamente a cada mês, economizando ${formatBRL(currentWithExtra.interestSaved)} acumulados em juros totais.`
          }
          colorClass={extraMonthly === 0 ? 'text-stone-500 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-extrabold'}
          infoTooltip="A economia de juros representa a diferença líquida entre a somatória de todos os juros que você pagaria no contrato original vs. o contrato acelerado com as amortizações mensais extraordinárias."
        />

        {/* Grid de Sub-métricas rápidas */}
        <MetricGrid
          metrics={[
            {
              label: 'Tempo para Quitação',
              value: `${currentWithExtra.monthsRequired} meses`,
              sublabel: extraMonthly > 0 && extraType === 'prazo'
                ? `quitação em ${formatMonthsToYears(currentWithExtra.monthsRequired)}`
                : `prazo mantido em ${years} anos`,
              colorClass: extraMonthly > 0 && extraType === 'prazo' ? 'text-emerald-600' : 'text-stone-500',
            },
            {
              label: 'Total Pago (com Juros)',
              value: formatBRL(currentWithExtra.totalPaid),
              sublabel: `original: ${formatBRL(currentOriginal.totalPaid)}`,
              colorClass: 'text-stone-500',
            },
            {
              label: 'Parcela Inicial / Parcela Final',
              value: selectedSystem === 'sac'
                ? `${formatBRL(currentWithExtra.timeline[0]?.installment)} / ${formatBRL(currentWithExtra.timeline[currentWithExtra.timeline.length - 1]?.installment)}`
                : `${formatBRL(currentWithExtra.timeline[0]?.installment)} (fixa)`,
              sublabel: 'valores mensais sem o aporte extra',
              colorClass: 'text-stone-500',
            },
          ]}
        />

        {/* Gráfico Recharts de Evolução do Saldo Devedor */}
        <div 
          className="rounded-2xl border p-4 space-y-4"
          style={{
            backgroundColor: 'var(--c-card-calm)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex justify-between items-baseline" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 10 }}>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              Curva de Decaimento do Saldo Devedor
            </h3>
            <span className="text-[10px] italic" style={{ color: 'var(--c-muted-2)' }}>Visualização por Anos</span>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" opacity={0.6} />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 10, fill: 'var(--c-muted)' }} 
                tickFormatter={(v) => `Ano ${v}`}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: 'var(--c-muted)' }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend verticalAlign="top" height={36} formatter={(value) => <span className="text-xs font-medium" style={{ color: 'var(--c-ink-2)' }}>{value}</span>} />
              <Line 
                type="monotone" 
                dataKey="Saldo Normal" 
                stroke="#a8a29e" 
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="Saldo com Aporte" 
                stroke="#10b981" 
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Comparação Comparada SAC vs Price (Métrica Direta) */}
        <div className="rounded-2xl border p-5 space-y-4" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 12 }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              Comparativo Geral (Sob os mesmos parâmetros)
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10">
              <Sparkles size={12} /> SAC é mais barato!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bloco SAC */}
            <div className="p-3 rounded-xl border space-y-2 bg-stone-500/5" style={{ borderColor: 'var(--c-line)' }}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold" style={{ color: 'var(--c-ink)' }}>Sistema SAC</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold uppercase">Mais Eficiente</span>
              </div>
              <ul className="text-[11px] leading-relaxed space-y-1" style={{ color: 'var(--c-muted)' }}>
                <li>• **Total pago (com extra):** {formatBRL(results.sacWithExtra.totalPaid)}</li>
                <li>• **Juros totais pagos:** {formatBRL(results.sacWithExtra.totalInterest)}</li>
                <li>• **Diferença de economia:** O SAC economiza **{formatBRL(Math.max(0, results.priceWithExtra.totalPaid - results.sacWithExtra.totalPaid))}** líquidos em relação à Tabela Price neste cenário.</li>
              </ul>
            </div>

            {/* Bloco Price */}
            <div className="p-3 rounded-xl border space-y-2 bg-stone-500/5" style={{ borderColor: 'var(--c-line)' }}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold" style={{ color: 'var(--c-ink)' }}>Tabela Price</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold uppercase">Mais Suave Inicial</span>
              </div>
              <ul className="text-[11px] leading-relaxed space-y-1" style={{ color: 'var(--c-muted)' }}>
                <li>• **Total pago (com extra):** {formatBRL(results.priceWithExtra.totalPaid)}</li>
                <li>• **Juros totais pagos:** {formatBRL(results.priceWithExtra.totalInterest)}</li>
                <li>• **Vantagem original:** A parcela inicial começa menor, o que pode facilitar a aprovação do financiamento no banco devido ao limite de renda.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Insight de Quitação Rápida */}
        <div className="rounded-2xl border p-4 flex gap-3 bg-stone-500/5 text-xs text-stone-800 dark:text-stone-300 leading-relaxed" style={{ borderColor: 'var(--c-line)' }}>
          <TrendingDown className="shrink-0 text-emerald-500" size={20} />
          <div>
            <p className="font-bold">Estratégia Bola de Neve Inversa ☃️</p>
            <p className="mt-1" style={{ color: 'var(--c-muted)' }}>
              Quando você investe, os juros compostos trabalham a seu favor. Quando você financia, os juros trabalham contra você. Ao realizar **amortizações extras**, você inverte essa lógica: você liquida a cota principal da dívida, extinguindo os juros sobre aquela fração para sempre. É o método mais eficiente do mundo para cortar despesas financeiras obrigatórias.
            </p>
          </div>
        </div>

        {/* Card para Redes Sociais */}
        {extraMonthly > 0 && (
          <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
            <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              Compartilhe seu Planejamento de Quitação
            </p>
            <ScaledPreview>
              <ShareCardBase
                id="amortization-share"
                eyebrow={`Financiamento ${selectedSystem.toUpperCase()} Acelerado`}
                mainValue={formatMonthsToYears(currentWithExtra.monthsRequired)}
                mainLabel={`tempo para quitar um financiamento de ${years} anos`}
                metrics={[
                  { label: 'Valor Financiado', value: formatBRL(financedAmount) },
                  { label: 'Aporte Extra Mensal', value: formatBRL(extraMonthly) },
                  { label: 'Total de Juros Salvos', value: formatBRL(currentWithExtra.interestSaved) },
                  { label: 'Anos de Boleto Cortados', value: `${currentWithExtra.monthsSaved} meses` },
                ]}
                footer="Economize juros abusivos na ponta do lápis."
                accentColor="#10b981"
              />
            </ScaledPreview>
            <div className="mt-3">
              <ShareButtons cardId="amortization-share" filename="planejamento-quitacao-financiamento" />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
