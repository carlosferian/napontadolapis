// lib/calculations/amortization.ts

export interface AmortizationInput {
  financedAmount: number       // Valor financiado (ex: 300000)
  annualInterestRate: number   // Taxa de juros anual (ex: 10.5)
  totalMonths: number          // Prazo total em meses (ex: 360)
  extraMonthlyAmount: number   // Aporte extra mensal (ex: 500)
  extraType: 'prazo' | 'parcela' // Se amortiza para reduzir prazo ou parcela
}

export interface MonthDetail {
  month: number
  installment: number   // Parcela paga no mês (sem o extra)
  interest: number      // Juros pagos no mês
  amortization: number  // Amortização normal
  extraPaid: number     // Aporte extra efetivamente pago
  totalPaid: number     // Parcela + extra efetivo
  outstandingBalance: number // Saldo devedor restante
}

export interface AmortizationSummary {
  system: 'sac' | 'price'
  totalPaid: number
  totalInterest: number
  totalExtra: number
  monthsRequired: number
  interestSaved: number
  monthsSaved: number
  timeline: MonthDetail[]
}

export interface AmortizationComparison {
  sacOriginal: AmortizationSummary
  sacWithExtra: AmortizationSummary
  priceOriginal: AmortizationSummary
  priceWithExtra: AmortizationSummary
}

/**
 * Converte taxa anual nominal para mensal
 */
export function getMonthlyRate(annualRate: number): number {
  // Financiamentos imobiliários no Brasil costumam usar taxa nominal dividida por 12
  return annualRate / 12 / 100
}

/**
 * Calcula a simulação de financiamento (SAC ou Price)
 */
export function simulateAmortization(
  system: 'sac' | 'price',
  input: AmortizationInput,
  useExtra: boolean
): AmortizationSummary {
  const { financedAmount, annualInterestRate, totalMonths, extraMonthlyAmount, extraType } = input
  
  const monthlyRate = getMonthlyRate(annualInterestRate)
  const timeline: MonthDetail[] = []
  
  let outstandingBalance = financedAmount
  let totalPaid = 0
  let totalInterest = 0
  let totalExtra = 0
  let month = 0

  // 1. Caso sem juros (evita divisão por zero)
  if (monthlyRate === 0) {
    const fixedAmortization = financedAmount / totalMonths
    for (let m = 1; m <= totalMonths; m++) {
      if (outstandingBalance <= 0) break
      let amort = Math.min(fixedAmortization, outstandingBalance)
      let extra = useExtra ? Math.min(extraMonthlyAmount, outstandingBalance - amort) : 0
      
      outstandingBalance -= (amort + extra)
      timeline.push({
        month: m,
        installment: amort,
        interest: 0,
        amortization: amort,
        extraPaid: extra,
        totalPaid: amort + extra,
        outstandingBalance: Math.max(0, outstandingBalance)
      })
    }
    return {
      system,
      totalPaid: financedAmount,
      totalInterest: 0,
      totalExtra: useExtra ? financedAmount - (financedAmount / totalMonths) * timeline.length : 0, // aproximado
      monthsRequired: timeline.length,
      interestSaved: 0,
      monthsSaved: totalMonths - timeline.length,
      timeline
    }
  }

  // 2. Simulação com juros
  // Para Tabela Price, calcula a parcela base original
  const priceBaseInstallment = financedAmount * (
    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  )

  while (outstandingBalance > 0.01 && month < totalMonths * 2) { // Trava de segurança contra loops infinitos
    month++
    
    // Juros do mês sobre o saldo anterior
    const interest = outstandingBalance * monthlyRate
    let amortization = 0
    let installment = 0
    let extraPaid = 0

    if (system === 'sac') {
      // SAC: Amortização constante
      let baseAmortization = financedAmount / totalMonths
      
      if (useExtra && extraType === 'parcela') {
        // Se reduz valor da parcela, a amortização é recalculada sobre o saldo restante e meses restantes
        const remainingMonths = Math.max(1, totalMonths - month + 1)
        baseAmortization = outstandingBalance / remainingMonths
      }
      
      amortization = Math.min(baseAmortization, outstandingBalance)
      installment = amortization + interest
    } else {
      // Price: Parcela constante (PMT)
      let currentBaseInstallment = priceBaseInstallment
      
      if (useExtra && extraType === 'parcela') {
        // Se reduz valor da parcela, recalculamos a PMT para o saldo devedor atual e meses restantes
        const remainingMonths = Math.max(1, totalMonths - month + 1)
        currentBaseInstallment = outstandingBalance * (
          (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
          (Math.pow(1 + monthlyRate, remainingMonths) - 1)
        )
      }
      
      installment = Math.min(currentBaseInstallment, outstandingBalance + interest)
      amortization = Math.max(0, installment - interest)
    }

    // Calcula o aporte extra
    if (useExtra && extraMonthlyAmount > 0) {
      // O extra não pode superar o saldo restante pós-amortização normal do mês
      const maxPossibleExtra = Math.max(0, outstandingBalance - amortization)
      extraPaid = Math.min(extraMonthlyAmount, maxPossibleExtra)
    }

    outstandingBalance = outstandingBalance - amortization - extraPaid
    
    // Segurança contra arredondamentos negativos
    if (outstandingBalance < 0.05) {
      outstandingBalance = 0
    }

    const totalPaidThisMonth = installment + extraPaid
    totalPaid += installment
    totalInterest += interest
    totalExtra += extraPaid

    timeline.push({
      month,
      installment: Number(installment.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      amortization: Number(amortization.toFixed(2)),
      extraPaid: Number(extraPaid.toFixed(2)),
      totalPaid: Number(totalPaidThisMonth.toFixed(2)),
      outstandingBalance: Number(outstandingBalance.toFixed(2))
    })

    if (outstandingBalance === 0) break
  }

  return {
    system,
    totalPaid: Number((totalPaid + totalExtra).toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalExtra: Number(totalExtra.toFixed(2)),
    monthsRequired: timeline.length,
    interestSaved: 0, // calculado no agregador comparativo
    monthsSaved: totalMonths - timeline.length,
    timeline
  }
}

/**
 * Roda o comparativo completo (SAC e Price, com e sem extra)
 */
export function calculateAmortizationComparison(input: AmortizationInput): AmortizationComparison {
  const sacOriginal = simulateAmortization('sac', input, false)
  const sacWithExtra = simulateAmortization('sac', input, true)
  const priceOriginal = simulateAmortization('price', input, false)
  const priceWithExtra = simulateAmortization('price', input, true)

  // Calcula economias
  sacWithExtra.interestSaved = Number(Math.max(0, sacOriginal.totalInterest - sacWithExtra.totalInterest).toFixed(2))
  sacWithExtra.monthsSaved = sacOriginal.monthsRequired - sacWithExtra.monthsRequired

  priceWithExtra.interestSaved = Number(Math.max(0, priceOriginal.totalInterest - priceWithExtra.totalInterest).toFixed(2))
  priceWithExtra.monthsSaved = priceOriginal.monthsRequired - priceWithExtra.monthsRequired

  return {
    sacOriginal,
    sacWithExtra,
    priceOriginal,
    priceWithExtra
  }
}
