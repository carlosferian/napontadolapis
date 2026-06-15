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
import { calculateUnemployment, WAGE_2026_MINIMUM, UNEMPLOYMENT_2026_TETO } from '@/lib/calculations/unemployment'
import { AlertTriangle, ShieldCheck, Calendar, Clock, AlertCircle, TrendingDown, BookOpen, Smartphone } from 'lucide-react'

export function UnemploymentCalculator() {
  // Wizard States
  const [layoffReason, setLayoffReason] = useState<'no-cause' | 'with-cause' | 'resignation'>('no-cause')
  const [requestNumber, setRequestNumber] = useState<1 | 2 | 3>(1)
  const [monthsWorked, setMonthsWorked] = useState<number>(14)
  const [hasMEI, setHasMEI] = useState<boolean>(false)

  // Salary input style toggle
  const [isSalaryDetailed, setIsSalaryDetailed] = useState<boolean>(false)
  const [averageSalaryInput, setAverageSalaryInput] = useState<number>(2800)
  
  // Individual salary states (last 3 months)
  const [sal1, setSal1] = useState<number>(2800)
  const [sal2, setSal2] = useState<number>(2800)
  const [sal3, setSal3] = useState<number>(2800)

  // Survival Runway States
  const [monthlyCost, setMonthlyCost] = useState<number>(1800)
  const [savingsFGTS, setSavingsFGTS] = useState<number>(4000)

  // Dynamically compute average salary
  const computedAverageSalary = useMemo(() => {
    if (isSalaryDetailed) {
      return (sal1 + sal2 + sal3) / 3
    }
    return averageSalaryInput
  }, [isSalaryDetailed, averageSalaryInput, sal1, sal2, sal3])

  // Call official Seguro-Desemprego logic
  const calcResult = useMemo(() => {
    return calculateUnemployment({
      averageSalary: layoffReason === 'no-cause' ? computedAverageSalary : 0,
      requestNumber,
      monthsWorked,
    })
  }, [layoffReason, computedAverageSalary, requestNumber, monthsWorked])

  // Calculate Survival Runway (Pista Financeira)
  // E.g. Month-by-month projection of costs vs income (Seguro + Savings)
  const runwayResult = useMemo(() => {
    if (!calcResult.isEligible || monthlyCost <= 0) {
      // If not eligible, runway is purely based on savings
      const totalSavings = savingsFGTS
      const runwayMonths = totalSavings / monthlyCost
      return {
        runwayMonths: isFinite(runwayMonths) ? runwayMonths : 0,
        timeline: [],
        hasSeguroHelp: false,
        isTight: runwayMonths < 3,
      }
    }

    let remainingSavings = savingsFGTS
    let activeSeguroMonths = calcResult.installmentsCount
    let m = 0
    const timeline = []
    const maxMonths = 36 // protection limit

    while (remainingSavings >= 0 && m < maxMonths) {
      m++
      const seguroIncome = activeSeguroMonths > 0 ? calcResult.installmentValue : 0
      const netMonthlyCost = monthlyCost - seguroIncome
      
      let savingsUsed = 0
      let balanceChange = 0
      
      if (netMonthlyCost > 0) {
        // Seguro doesn't cover all basic costs, need savings
        savingsUsed = netMonthlyCost
        remainingSavings -= savingsUsed
        balanceChange = -netMonthlyCost
      } else {
        // Seguro covers all basic costs, surplus is saved!
        const surplus = Math.abs(netMonthlyCost)
        remainingSavings += surplus
        balanceChange = surplus
      }

      if (activeSeguroMonths > 0) {
        activeSeguroMonths--
      }

      // If savings went negative, this month they ran out
      const ranOutThisMonth = remainingSavings < 0
      const displaySavings = Math.max(0, remainingSavings + (ranOutThisMonth ? savingsUsed : 0))

      timeline.push({
        month: m,
        label: `Mês ${m}`,
        seguroIncome,
        savingsUsed: Math.max(0, savingsUsed),
        balance: displaySavings,
        balanceChange,
        hasSeguro: seguroIncome > 0,
        ranOut: ranOutThisMonth,
      })

      if (ranOutThisMonth) {
        break
      }
    }

    // Exact fractional runway calculation
    // Months of seguro + months of purely savings
    // We can estimate runway by finding the last month before running out, plus fraction of the last month
    let runwayMonths = 0
    if (timeline.length > 0) {
      const lastPoint = timeline[timeline.length - 1]
      if (lastPoint.ranOut) {
        // Fractional part of the last month: remaining savings before this month divided by net cost
        const prevSavings = m > 1 ? timeline[m - 2].balance : savingsFGTS
        const netCost = monthlyCost - (m <= calcResult.installmentsCount ? calcResult.installmentValue : 0)
        const fraction = netCost > 0 ? prevSavings / netCost : 0
        runwayMonths = (m - 1) + fraction
      } else {
        runwayMonths = m
      }
    }

    return {
      runwayMonths: Number(runwayMonths.toFixed(1)),
      timeline,
      hasSeguroHelp: true,
      isTight: runwayMonths < 4,
    }
  }, [calcResult, monthlyCost, savingsFGTS])

  // Custom text feedback for survival runway
  const runwayFeedback = useMemo(() => {
    const rm = runwayResult.runwayMonths
    if (rm <= 0) return 'Insira seus custos básicos para projetar sua pista.'
    if (rm < 3) {
      return `⚠️ Pista muito curta (${rm.toFixed(1).replace('.', ',')} meses). Sua reserva se esgotará rápido. Priorize recolocação urgente e corte custos supérfluos.`
    }
    if (rm < 6) {
      return `👍 Pista moderada (${rm.toFixed(1).replace('.', ',')} meses). Você tem um fôlego razoável para procurar um emprego de qualidade sem desespero.`
    }
    return `🛡️ Pista longa (${rm.toFixed(1).replace('.', ',')} meses). Excelente planejamento! Você está muito protegido e pode escolher seu próximo passo profissional com calma.`
  }, [runwayResult])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      {/* ── COLUNA ESQUERDA: INPUTS E PARÂMETROS ────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Card 1: Elegibilidade e Vínculo */}
        <CalculatorCard title="Simulador de Transição Trabalhista" subtitle="Responda os critérios para descobrir seu direito e calcular sua pista financeira.">
          
          {/* Motivo de Layoff */}
          <div className="space-y-2">
            <label htmlFor="layoff-reason" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
              Motivo do encerramento do contrato
            </label>
            <select
              id="layoff-reason"
              value={layoffReason}
              onChange={(e) => setLayoffReason(e.target.value as any)}
              className="w-full border rounded-xl px-3 py-2.5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              style={{
                backgroundColor: 'var(--c-bg)',
                color: 'var(--c-ink)',
                borderColor: 'var(--c-line)'
              }}
            >
              <option value="no-cause">Demissão Sem Justa Causa (Comum)</option>
              <option value="with-cause">Demissão Com Justa Causa</option>
              <option value="resignation">Pedido de Demissão pelo Empregado</option>
            </select>
          </div>

          {/* Quantas Solicitações */}
          <div className="space-y-2">
            <label className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
              Quantas vezes já solicitou o seguro na vida?
            </label>
            <div className="flex border rounded-lg p-0.5" style={{ backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-line)' }}>
              {([1, 2, 3] as const).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRequestNumber(num)}
                  className="flex-1 py-2 rounded-md text-xs font-bold transition-all cursor-pointer text-center"
                  style={requestNumber === num ? {
                    backgroundColor: 'var(--c-copper)',
                    color: '#ffffff',
                  } : {
                    color: 'var(--c-muted)',
                  }}
                >
                  {num === 1 ? '1ª vez' : num === 2 ? '2ª vez' : '3ª ou +'}
                </button>
              ))}
            </div>
          </div>

          {/* Meses Trabalhados */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span style={{ color: 'var(--c-muted)' }}>Meses trabalhados no último emprego:</span>
              <span className="font-bold text-base" style={{ color: 'var(--c-ink)' }}>{monthsWorked} {monthsWorked === 1 ? 'mês' : 'meses'}</span>
            </div>
            <input
              type="range"
              min={1}
              max={60}
              step={1}
              value={monthsWorked}
              onChange={(e) => setMonthsWorked(Number(e.target.value))}
              aria-label="Meses Trabalhados Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>1 mês</span>
              <span>60 meses (5 anos)</span>
            </div>
          </div>

          {/* Empresa / CNPJ Ativo Warning */}
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="space-y-0.5 pr-2">
              <span className="text-sm font-bold block" style={{ color: 'var(--c-ink)' }}>Você tem MEI ou CNPJ PJ ativo?</span>
              <span className="text-[11px] leading-tight block" style={{ color: 'var(--c-muted)' }}>
                Empresas ativas podem suspender seu seguro na Receita Federal.
              </span>
            </div>
            <input
              type="checkbox"
              checked={hasMEI}
              onChange={(e) => setHasMEI(e.target.checked)}
              className="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

        </CalculatorCard>

        {/* Card 2: Salários */}
        <CalculatorCard title="Configuração Salarial" subtitle="Insira o seu salário médio de carteira assinalada.">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Método de preenchimento</span>
            <button
              onClick={() => setIsSalaryDetailed(!isSalaryDetailed)}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
            >
              {isSalaryDetailed ? 'Digitar média direta' : 'Digitar os 3 salários individuais'}
            </button>
          </div>

          {isSalaryDetailed ? (
            <div className="space-y-3">
              {[
                { label: 'Salário (Último mês)', val: sal1, set: setSal1 },
                { label: 'Salário (2º último mês)', val: sal2, set: setSal2 },
                { label: 'Salário (3º último mês)', val: sal3, set: setSal3 },
              ].map((inp, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>{inp.label}</span>
                  <div className="relative w-36">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                    <input
                      type="number"
                      value={inp.val === 0 ? '' : inp.val}
                      placeholder="0,00"
                      onChange={(e) => inp.set(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full text-right border rounded-xl pr-3 pl-8 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t text-xs flex justify-between font-bold" style={{ borderColor: 'var(--c-line)', color: 'var(--c-muted)' }}>
                <span>Média Calculada:</span>
                <span style={{ color: 'var(--c-ink)' }}>{formatBRL(computedAverageSalary)}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>Salário médio de referência:</span>
                <div className="relative w-40">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                  <input
                    type="number"
                    value={averageSalaryInput === 0 ? '' : averageSalaryInput}
                    placeholder="0,00"
                    onChange={(e) => setAverageSalaryInput(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full text-right border rounded-xl pr-3.5 pl-9 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
                  />
                </div>
              </div>
              <p className="text-[11px] leading-tight" style={{ color: 'var(--c-muted)' }}>
                *A referência é a média aritmética simples dos salários recebidos nos últimos 3 meses antes da demissão.
              </p>
            </div>
          )}
        </CalculatorCard>

        {/* Card 3: Pista de Decolagem Sobrevivência */}
        <CalculatorCard title="Pista de Sobrevivência (Runway)" subtitle="Quantos meses você consegue sobreviver sem um novo emprego?">
          {/* Custo de Vida Básico */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="monthly-cost" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
                Custo básico mensal (R$)
              </label>
              <div className="relative w-36">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="monthly-cost"
                  type="number"
                  value={monthlyCost === 0 ? '' : monthlyCost}
                  placeholder="0,00"
                  onChange={(e) => setMonthlyCost(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full text-right border rounded-xl pr-3 pl-8 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
                />
              </div>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
              value={monthlyCost > 10000 ? 10000 : monthlyCost}
              onChange={(e) => setMonthlyCost(Number(e.target.value))}
              aria-label="Custo de Vida Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 500</span>
              <span>R$ 10 mil+</span>
            </div>
          </div>

          {/* Reserva FGTS */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label htmlFor="savings-fgts" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
                Reserva disponível + FGTS líquido (R$)
              </label>
              <div className="relative w-36">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="savings-fgts"
                  type="number"
                  value={savingsFGTS === 0 ? '' : savingsFGTS}
                  placeholder="0,00"
                  onChange={(e) => setSavingsFGTS(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full text-right border rounded-xl pr-3 pl-8 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={500}
              value={savingsFGTS > 50000 ? 50000 : savingsFGTS}
              onChange={(e) => setSavingsFGTS(Number(e.target.value))}
              aria-label="Reserva Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 0</span>
              <span>R$ 50 mil+</span>
            </div>
          </div>
        </CalculatorCard>

      </div>

      {/* ── COLUNA DIREITA: RESULTADOS E ANALÍTICO ───────────────── */}
      <div role="region" aria-live="polite" aria-label="Resultados da Transição" className="lg:col-span-7 space-y-4">
        
        {/* Caso especial: Demissão voluntária ou justa causa */}
        {layoffReason !== 'no-cause' ? (
          <div className="rounded-3xl border-2 border-red-500/20 p-6 space-y-4 bg-red-500/[0.02]">
            <div className="flex gap-3 text-red-700 dark:text-red-400">
              <AlertTriangle className="shrink-0" size={24} />
              <div>
                <h3 className="text-base font-bold">Sem direito legal ao Seguro-Desemprego</h3>
                <p className="text-xs mt-1 leading-relaxed">
                  Pela legislação trabalhista da CLT, demissões <strong>com justa causa</strong> ou <strong>pedidos de demissão</strong> voluntários <strong>não dão direito</strong> ao benefício. O seguro é reservado a trabalhadores desamparados por rescisão unilateral da empresa.
                </p>
              </div>
            </div>
            <div className="border-t pt-3 space-y-2 text-xs" style={{ borderColor: 'var(--c-line)' }}>
              <p className="font-semibold" style={{ color: 'var(--c-ink)' }}>Sua única proteção é sua própria reserva:</p>
              <p style={{ color: 'var(--c-muted)' }}>
                Sem a ajuda do governo, sua pista financeira é de <strong>{runwayResult.runwayMonths.toFixed(1).replace('.', ',')} meses</strong>, sustentada exclusivamente pelos seus R$ {savingsFGTS.toFixed(2).replace('.', ',')} de reserva.
              </p>
            </div>
          </div>
        ) : !calcResult.isEligible ? (
          /* Não elegível por falta de tempo */
          <div className="rounded-3xl border-2 border-amber-500/20 p-6 space-y-4 bg-amber-500/[0.02]">
            <div className="flex gap-3 text-amber-700 dark:text-amber-400">
              <AlertCircle className="shrink-0" size={24} />
              <div>
                <h3 className="text-base font-bold">Tempo mínimo exigido não atingido</h3>
                <p className="text-xs mt-1 leading-relaxed">
                  {calcResult.ineligibilityReason}
                </p>
              </div>
            </div>
            <div className="border-t pt-3 space-y-2 text-xs font-semibold" style={{ borderColor: 'var(--c-line)', color: 'var(--c-ink)' }}>
              <p>Trabalhou: {monthsWorked} {monthsWorked === 1 ? 'mês' : 'meses'} | Mínimo exigido: {calcResult.minMonthsRequired} meses na {requestNumber === 1 ? '1ª' : requestNumber === 2 ? '2ª' : '3ª+'} solicitação.</p>
              <p style={{ color: 'var(--c-muted)' }}>Sua pista financeira com reserva pessoal: {runwayResult.runwayMonths.toFixed(1).replace('.', ',')} meses.</p>
            </div>
          </div>
        ) : (
          /* Elegível e Tudo Certo! */
          <div className="space-y-4">
            {/* Seguro Result Hero */}
            <ResultHero
              label="Estimativa de Seguro-Desemprego"
              value={`${calcResult.installmentsCount} parcelas de ${formatBRL(calcResult.installmentValue)}`}
              comment={`Valor Total a Receber: ${formatBRL(calcResult.totalValue)}`}
              colorClass="text-copper-600 dark:text-copper-400"
              infoTooltip="Cálculo efetuado com base na tabela oficial reajustada do Ministério do Trabalho vigente a partir de 11 de janeiro de 2026. O valor mínimo é garantido a um salário mínimo (R$ 1.621,00) e o teto máximo é de R$ 2.518,65."
            />

            {/* MEI Alert Shield */}
            {hasMEI && (
              <div className="rounded-2xl border p-4 flex gap-3 bg-amber-500/5 border-amber-500/20">
                <AlertTriangle className="shrink-0 text-amber-600 dark:text-amber-400" size={20} />
                <div className="space-y-1 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                  <p className="font-bold">⚠️ Atenção: Risco Iminente de Bloqueio por MEI Ativo</p>
                  <p>
                    Ter um CNPJ MEI ativo, mesmo sem faturamento, é o <strong>motivo nº 1</strong> de suspensão de seguro pelo governo federal, pois presume-se renda própria. Para liberar o seguro, você precisará comprovar inatividade (DASN-SIMEI zerada) no recurso administrativo ou providenciar a baixa do MEI antes de iniciar o protocolo do seguro.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Metrics */}
            <MetricGrid
              metrics={[
                {
                  label: 'Sua Média Salarial',
                  value: formatBRL(computedAverageSalary),
                  sublabel: 'últimos 3 meses ocupado',
                  colorClass: 'text-stone-900 dark:text-stone-100',
                },
                {
                  label: 'Total em Benefício',
                  value: formatBRL(calcResult.totalValue),
                  sublabel: 'soma das parcelas liberadas',
                  colorClass: 'text-copper-600 dark:text-copper-400',
                },
                {
                  label: 'Mínimo Garantido (2026)',
                  value: formatBRL(WAGE_2026_MINIMUM),
                  sublabel: 'salário mínimo piso nacional',
                  colorClass: 'text-stone-500',
                },
              ]}
            />
          </div>
        )}

        {/* Section: Planejador Inovador de Pista de Sobrevivência (Runway) */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{
            backgroundColor: 'var(--c-card-calm)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex justify-between items-baseline" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 12 }}>
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Sua Pista de Sobrevivência Financeira</h3>
              <p className="text-xs" style={{ color: 'var(--c-muted)' }}>Tempo estimado para encontrar um novo emprego antes que os recursos acabem</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: runwayResult.isTight ? 'var(--c-copper-soft)' : 'var(--c-emerald-soft)', color: runwayResult.isTight ? 'var(--c-copper)' : 'var(--c-emerald)' }}>
              {runwayResult.runwayMonths.toFixed(1).replace('.', ',')} meses
            </span>
          </div>

          {/* O Feedback em barra horizontal inovador */}
          <div className="space-y-3">
            <div className="flex h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--c-line)' }}>
              {runwayResult.timeline.map((point) => {
                // Color representing the status of that month: green if covered by seguro, amber if eating savings, red if ran out
                let color = 'bg-stone-400'
                if (point.hasSeguro) {
                  color = point.balanceChange >= 0 ? 'bg-emerald-500' : 'bg-teal-500'
                } else {
                  color = 'bg-amber-500'
                }
                if (point.ranOut) {
                  color = 'bg-red-500'
                }
                return (
                  <div 
                    key={point.month} 
                    className={`h-full border-r ${color}`} 
                    style={{ flex: 1, borderColor: 'var(--c-card-calm)', borderWidth: 1 }}
                    title={`${point.label}: Seguro R$ ${point.seguroIncome.toFixed(2)} | Reserva R$ ${point.balance.toFixed(2)}`}
                  />
                )
              })}
            </div>
            
            {/* Legenda inovadora */}
            <div className="flex flex-wrap gap-4 text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Mês com Seguro (Sem gastar reserva)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span>Mês com Seguro + Reserva parcial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Reserva Pessoal Exclusiva</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Reserva Esgotada</span>
              </div>
            </div>

            {/* Mensagem reflexiva */}
            <div className="bg-stone-500/5 rounded-xl p-3.5 text-xs leading-relaxed flex gap-2.5" style={{ color: 'var(--c-ink-2)' }}>
              <TrendingDown className="shrink-0 text-stone-500" size={16} />
              <p>{runwayFeedback}</p>
            </div>
          </div>

          {/* Detalhes Mês a Mês */}
          {runwayResult.timeline.length > 0 && (
            <div className="max-h-52 overflow-y-auto overflow-x-auto rounded-xl border scrollbar-thin" style={{ borderColor: 'var(--c-line)', backgroundColor: 'var(--c-bg)' }}>
              <table className="w-full text-[11px] text-left border-collapse tabular-nums">
                <thead>
                  <tr style={{ backgroundColor: 'var(--c-surface)', borderBottom: '1px solid var(--c-line)' }}>
                    <th className="px-3 py-2 font-bold" style={{ color: 'var(--c-muted)' }}>Período</th>
                    <th className="px-3 py-2 font-bold" style={{ color: 'var(--c-muted)' }}>Entrada Seguro</th>
                    <th className="px-3 py-2 font-bold" style={{ color: 'var(--c-muted)' }}>Reserva Consumida</th>
                    <th className="px-3 py-2 font-bold text-right" style={{ color: 'var(--c-ink)' }}>Saldo Reserva Restante</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--c-line)' }}>
                  {runwayResult.timeline.map((p) => (
                    <tr key={p.month} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]" style={p.ranOut ? { backgroundColor: 'rgba(239, 68, 68, 0.05)' } : undefined}>
                      <td className="px-3 py-2 font-bold" style={{ color: p.ranOut ? 'var(--c-copper)' : 'var(--c-muted)' }}>
                        {p.label} {p.ranOut ? '🚨' : ''}
                      </td>
                      <td className="px-3 py-2 font-semibold text-emerald-600 dark:text-emerald-400">
                        {p.seguroIncome > 0 ? `+${formatBRL(p.seguroIncome)}` : 'R$ 0,00'}
                      </td>
                      <td className="px-3 py-2 text-red-600 dark:text-red-400">
                        {p.balanceChange < 0 ? `-${formatBRL(Math.abs(p.balanceChange))}` : 'R$ 0,00'}
                      </td>
                      <td className="px-3 py-2 text-right font-bold" style={{ color: p.ranOut ? 'var(--c-copper)' : 'var(--c-ink)' }}>
                        {formatBRL(p.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Guia de Direitos e Dicas Rápidas */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{
            backgroundColor: 'var(--c-card-calm)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex gap-2 items-center" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 10 }}>
            <BookOpen size={16} className="text-stone-500" />
            <h3 className="text-sm font-bold" style={{ color: 'var(--c-ink)' }}>Como dar entrada no seu direito:</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex gap-2 items-start">
                <Calendar size={14} className="shrink-0 text-copper-600 mt-0.5" />
                <p style={{ color: 'var(--c-ink-2)' }}>
                  <strong>Prazo legal:</strong> Dar entrada a partir do <strong>7º até o 120º dia corrido</strong> a contar da data de demissão para trabalhadores formais.
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex gap-2 items-start">
                <Smartphone size={14} className="shrink-0 text-copper-600 mt-0.5" />
                <p style={{ color: 'var(--c-ink-2)' }}>
                  <strong>Solicitação digital:</strong> Faça direto pelo aplicativo <strong>Carteira de Trabalho Digital</strong> ou no site oficial <em>gov.br</em> — sem taxas ou intermediários.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Section wrapped */}
        <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
            Compartilhe seu Planejamento de Pista
          </p>
          <ScaledPreview>
            <ShareCardBase
              id="unemployment-share-card"
              eyebrow="Seguro-Desemprego & Pista Financeira"
              mainValue={runwayResult.runwayMonths > 0 ? `${runwayResult.runwayMonths.toFixed(1).replace('.', ',')} meses` : 'Pista de Sobrevivência'}
              mainLabel="tamanho da minha pista (runway) financeira projetada"
              metrics={[
                { label: 'Valor Parcela', value: calcResult.isEligible ? formatBRL(calcResult.installmentValue) : 'R$ 0,00' },
                { label: 'Parcelas Totais', value: calcResult.isEligible ? `${calcResult.installmentsCount} parcelas` : 'Sem direito' },
                { label: 'Montante Seguro', value: calcResult.isEligible ? formatBRL(calcResult.totalValue) : 'R$ 0,00' },
                { label: 'Minhas Reservas + FGTS', value: formatBRL(savingsFGTS) },
              ]}
              footer="Planejamento pós-rescisão sob a ponta do lápis."
              accentColor="#b4421b" // Copper category transition
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="unemployment-share-card" filename="seguro-desemprego-pista" />
          </div>
        </div>

      </div>
    </div>
  )
}
