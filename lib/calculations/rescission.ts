// lib/calculations/rescission.ts

export interface RescissionParams {
  grossSalary: number
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  reason: 'employer-no-cause' | 'employer-with-cause' | 'employee-resignation' | 'mutual-agreement'
  noticeType: 'worked' | 'paid' | 'excused' // trabalhado, indenizado, dispensado
  hasExpiredVacation: boolean // possui férias vencidas
  fgtsBalance: number // saldo para multa de 40%
}

export interface RescissionItem {
  label: string
  value: number
  type: 'earning' | 'deduction'
  description: string
}

export interface RescissionResult {
  earnings: RescissionItem[]
  deductions: RescissionItem[]
  totalEarnings: number
  totalDeductions: number
  netValue: number
  fgtsWithdrawable: number // valor sacável de FGTS (saldo + multa)
  fgtsFine: number // valor da multa de 40% ou 20%
  monthsWorked: number
  daysWorkedInLastMonth: number
}

// Auxiliar para calcular INSS progressivo simplificado (tabela de 2026 aproximada)
function calculateINSS(salary: number): number {
  if (salary <= 0) return 0
  let contribution = 0
  
  // Faixas 2026 (estimadas a partir do salário mínimo de R$ 1.621)
  const f1Limit = 1621.00
  const f2Limit = 2800.00
  const f3Limit = 4100.00
  const f4Limit = 8000.00 // Teto aproximado

  if (salary <= f1Limit) {
    contribution = salary * 0.075
  } else if (salary <= f2Limit) {
    contribution = (f1Limit * 0.075) + ((salary - f1Limit) * 0.09)
  } else if (salary <= f3Limit) {
    contribution = (f1Limit * 0.075) + ((f2Limit - f1Limit) * 0.09) + ((salary - f2Limit) * 0.12)
  } else {
    const baseSal = Math.min(salary, f4Limit)
    contribution = (f1Limit * 0.075) + ((f2Limit - f1Limit) * 0.09) + ((f3Limit - f2Limit) * 0.12) + ((baseSal - f3Limit) * 0.14)
  }
  return Number(contribution.toFixed(2))
}

// Auxiliar para calcular IRRF simplificado (tabela de 2026 aproximada)
function calculateIRRF(taxableIncome: number): number {
  if (taxableIncome <= 2259.20) return 0
  
  let tax = 0
  if (taxableIncome <= 2826.65) {
    tax = (taxableIncome * 0.075) - 169.44
  } else if (taxableIncome <= 3751.05) {
    tax = (taxableIncome * 0.15) - 381.44
  } else if (taxableIncome <= 4664.68) {
    tax = (taxableIncome * 0.225) - 662.77
  } else {
    tax = (taxableIncome * 0.275) - 896.00
  }
  
  return Math.max(0, Number(tax.toFixed(2)))
}

/**
 * Calcula a Rescisão Trabalhista CLT baseada nas regras vigentes.
 */
export function calculateRescission(params: RescissionParams): RescissionResult {
  const { grossSalary, startDate, endDate, reason, noticeType, hasExpiredVacation, fgtsBalance } = params

  const earnings: RescissionItem[] = []
  const deductions: RescissionItem[] = []

  const start = new Date(startDate)
  const end = new Date(endDate)

  // 1. Calcular tempo total trabalhado (meses e dias)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const monthsWorked = Math.floor(diffDays / 30.4)

  const dayOfDischarge = end.getDate()
  const daysWorkedInLastMonth = dayOfDischarge

  // 2. Proporção de 13º salário no ano da demissão
  // Um mês é considerado se trabalhado 15 dias ou mais
  const dischargeMonth = end.getMonth() + 1 // 1-12
  let proportional13thMonths = dischargeMonth
  if (dayOfDischarge < 15) {
    proportional13thMonths -= 1
  }
  // Se começou no mesmo ano, ajustar proporcionalidade
  if (start.getFullYear() === end.getFullYear()) {
    const startMonth = start.getMonth() + 1
    const startDay = start.getDate()
    let monthsToSubtract = startMonth - 1
    if (startDay >= 15) {
      monthsToSubtract += 1
    }
    proportional13thMonths = Math.max(0, proportional13thMonths - monthsToSubtract)
  }

  // 3. Férias Proporcionais
  // Conta de meses aquisitivos proporcionais (a cada 30 dias de contrato ou fração >= 15 dias no ciclo anual)
  const totalMonthsWorked = monthsWorked
  const proportionalVacationMonths = (totalMonthsWorked % 12) + (diffDays % 30 >= 15 ? 1 : 0)
  const adjustedVacationMonths = Math.min(12, Math.max(0, proportionalVacationMonths))

  // ────────────────── CÁLCULO DE PROVENTOS (EARNINGS) ──────────────────

  // A. Saldo de Salário
  const dailyRate = grossSalary / 30
  const salaryBalanceValue = Number((dailyRate * daysWorkedInLastMonth).toFixed(2))
  earnings.push({
    label: 'Saldo de Salário',
    value: salaryBalanceValue,
    type: 'earning',
    description: `Referente aos ${daysWorkedInLastMonth} dias trabalhados no mês do desligamento.`,
  })

  // B. Décimo Terceiro Salário Proporcional
  if (reason !== 'employer-with-cause') {
    const proportional13thValue = Number(((grossSalary / 12) * proportional13thMonths).toFixed(2))
    earnings.push({
      label: `13º Salário Proporcional (${proportional13thMonths}/12)`,
      value: proportional13thValue,
      type: 'earning',
      description: `Proporção correspondente aos meses trabalhados no ano corrente (mínimo de 15 dias por mês).`,
    })
  }

  // C. Férias Proporcionais + Terço Constitucional
  if (reason !== 'employer-with-cause') {
    const propVacationValue = (grossSalary / 12) * adjustedVacationMonths
    const propVacationThird = propVacationValue / 3
    const totalPropVacation = Number((propVacationValue + propVacationThird).toFixed(2))
    earnings.push({
      label: `Férias Proporcionais + 1/3 (${adjustedVacationMonths}/12)`,
      value: totalPropVacation,
      type: 'earning',
      description: `Férias proporcionais acumuladas no período aquisitivo atual acrescidas do terço constitucional.`,
    })
  }

  // D. Férias Vencidas + Terço Constitucional (se houver)
  if (hasExpiredVacation && reason !== 'employer-with-cause') {
    const expiredVacationValue = grossSalary
    const expiredVacationThird = expiredVacationValue / 3
    const totalExpiredVacation = Number((expiredVacationValue + expiredVacationThird).toFixed(2))
    earnings.push({
      label: 'Férias Vencidas + 1/3',
      value: totalExpiredVacation,
      type: 'earning',
      description: `Férias completas vencidas que não foram usufruídas durante o contrato, mais o terço legal.`,
    })
  }

  // E. Aviso Prévio Indenizado
  let noticeValue = 0
  if (reason === 'employer-no-cause' && noticeType === 'paid') {
    // Lei 12.506/2011: 30 dias + 3 dias por ano completo de serviço, limite de 90 dias
    const yearsWorked = Math.floor(monthsWorked / 12)
    const noticeDays = Math.min(90, 30 + yearsWorked * 3)
    noticeValue = Number((dailyRate * noticeDays).toFixed(2))
    earnings.push({
      label: `Aviso Prévio Indenizado (${noticeDays} dias)`,
      value: noticeValue,
      type: 'earning',
      description: `Aviso indenizado pelo empregador, incluindo acréscimo de 3 dias por ano completo trabalhado (Lei 12.506/11).`,
    })
  } else if (reason === 'mutual-agreement' && noticeType === 'paid') {
    // Acordo comum recebe metade do aviso prévio indenizado (50%)
    const yearsWorked = Math.floor(monthsWorked / 12)
    const noticeDays = Math.min(90, 30 + yearsWorked * 3)
    noticeValue = Number((dailyRate * noticeDays * 0.5).toFixed(2))
    earnings.push({
      label: `Aviso Prévio Indenizado (Acordo - 50% de ${noticeDays} dias)`,
      value: noticeValue,
      type: 'earning',
      description: `Por rescisão de comum acordo (Reforma Trabalhista), o aviso prévio indenizado é reduzido pela metade.`,
    })
  }

  // ────────────────── CÁLCULO DE DESCONTOS (DEDUCTIONS) ──────────────────

  // A. Desconto de Aviso Prévio se o empregado pediu demissão e não vai cumprir
  if (reason === 'employee-resignation' && noticeType === 'paid') {
    const noticeDiscount = Number(grossSalary.toFixed(2))
    deductions.push({
      label: 'Desconto de Aviso Prévio Não Cumprido',
      value: noticeDiscount,
      type: 'deduction',
      description: `Desconto de um salário integral devido à não prestação do aviso prévio no pedido de demissão.`,
    })
  }

  // B. INSS sobre Saldo de Salário e 13º Proporcional
  const inssOnSalary = calculateINSS(salaryBalanceValue)
  if (inssOnSalary > 0) {
    deductions.push({
      label: 'INSS sobre Saldo de Salário',
      value: inssOnSalary,
      type: 'deduction',
      description: `Contribuição previdenciária progressiva calculada sobre o saldo de salário recebido no mês.`,
    })
  }

  // INSS sobre o 13º (calculado separadamente)
  if (reason !== 'employer-with-cause') {
    const proportional13thValue = Number(((grossSalary / 12) * proportional13thMonths).toFixed(2))
    const inssOn13th = calculateINSS(proportional13thValue)
    if (inssOn13th > 0) {
      deductions.push({
        label: 'INSS sobre 13º Salário',
        value: inssOn13th,
        type: 'deduction',
        description: `Contribuição previdenciária progressiva retida sobre a parcela proporcional de 13º salário.`,
      })
    }
  }

  // C. IRRF sobre Saldo de Salário e 13º Proporcional
  // Base de cálculo = Valor bruto - INSS
  const irrfBaseSalary = salaryBalanceValue - inssOnSalary
  const irrfOnSalary = calculateIRRF(irrfBaseSalary)
  if (irrfOnSalary > 0) {
    deductions.push({
      label: 'IRRF sobre Saldo de Salário',
      value: irrfOnSalary,
      type: 'deduction',
      description: `Imposto de renda retido na fonte baseado nas alíquotas oficiais aplicadas sobre o saldo tributável.`,
    })
  }

  if (reason !== 'employer-with-cause') {
    const proportional13thValue = Number(((grossSalary / 12) * proportional13thMonths).toFixed(2))
    const inssOn13th = calculateINSS(proportional13thValue)
    const irrfBase13th = proportional13thValue - inssOn13th
    const irrfOn13th = calculateIRRF(irrfBase13th)
    if (irrfOn13th > 0) {
      deductions.push({
        label: 'IRRF sobre 13º Salário',
        value: irrfOn13th,
        type: 'deduction',
        description: `Imposto de renda retido na fonte incidente sobre o valor proporcional tributável do 13º salário.`,
      })
    }
  }

  // ────────────────── CONSOLIDANDO OS TOTAIS ──────────────────

  const totalEarnings = Number(earnings.reduce((sum, item) => sum + item.value, 0).toFixed(2))
  const totalDeductions = Number(deductions.reduce((sum, item) => sum + item.value, 0).toFixed(2))
  const netValue = Number(Math.max(0, totalEarnings - totalDeductions).toFixed(2))

  // ────────────────── CÁLCULO DE MULTA E SAQUE FGTS ──────────────────
  let fgtsFine = 0
  let fgtsWithdrawable = 0

  if (reason === 'employer-no-cause') {
    fgtsFine = Number((fgtsBalance * 0.40).toFixed(2))
    fgtsWithdrawable = Number((fgtsBalance + fgtsFine).toFixed(2))
  } else if (reason === 'mutual-agreement') {
    fgtsFine = Number((fgtsBalance * 0.20).toFixed(2))
    // No comum acordo, saca-se até 80% do saldo acumulado + a multa de 20%
    fgtsWithdrawable = Number(((fgtsBalance * 0.80) + fgtsFine).toFixed(2))
  }

  return {
    earnings,
    deductions,
    totalEarnings,
    totalDeductions,
    netValue,
    fgtsWithdrawable,
    fgtsFine,
    monthsWorked,
    daysWorkedInLastMonth,
  }
}
