export interface SavingsPlan {
  targetAmount:            number  // meta original (valores de hoje)
  inflationAdjustedTarget: number  // meta em termos nominais futuros (corrigida pelo IPCA)
  months:                  number
  monthlyWithoutInvestment:       number  // sem rendimento, para meta nominal
  monthlyWithSelic:               number  // com Selic, para meta nominal
  monthlyWithSelicAdjusted:       number  // com Selic, para meta corrigida pelo IPCA
  totalWithoutInvestment:         number
  totalWithSelic:                 number
  savingsWithInvestment:          number
  monthlyBreakdown: Array<{ month: number; accumulated: number; withInterest: number }>
}

export function calculateSavingsPlan(
  targetBRL: number,
  months: number,
  selicAnnual: number,
  inflationAnnual: number = 0.05  // IPCA — padrão 5%
): SavingsPlan {
  const monthlyRate = selicAnnual / 12

  // Meta nominal futura: o que custará em R$ nominais lá na frente
  const inflationAdjustedTarget = targetBRL * Math.pow(1 + inflationAnnual, months / 12)

  const pmt = (target: number) =>
    monthlyRate === 0 ? target / months
      : (target * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)

  const monthlyWithoutInvestment  = targetBRL / months
  const monthlyWithSelic          = pmt(targetBRL)               // atinge meta nominal original
  const monthlyWithSelicAdjusted  = pmt(inflationAdjustedTarget) // atinge meta corrigida

  const totalWithoutInvestment = monthlyWithoutInvestment * months
  const totalWithSelic         = monthlyWithSelic * months
  const savingsWithInvestment  = totalWithoutInvestment - totalWithSelic

  const monthlyBreakdown = Array.from({ length: months }, (_, i) => {
    const month = i + 1
    const accumulated  = monthlyWithoutInvestment * month
    const withInterest = monthlyRate === 0
      ? monthlyWithSelic * month
      : monthlyWithSelic * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate)
    return { month, accumulated, withInterest }
  })

  return {
    targetAmount: targetBRL,
    inflationAdjustedTarget,
    months,
    monthlyWithoutInvestment,
    monthlyWithSelic,
    monthlyWithSelicAdjusted,
    totalWithoutInvestment,
    totalWithSelic,
    savingsWithInvestment,
    monthlyBreakdown,
  }
}
