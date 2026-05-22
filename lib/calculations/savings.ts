export interface SavingsPlan {
  targetAmount: number
  months: number
  monthlyWithoutInvestment: number
  monthlyWithSelic: number
  totalWithoutInvestment: number
  totalWithSelic: number
  savingsWithInvestment: number
  monthlyBreakdown: Array<{ month: number; accumulated: number; withInterest: number }>
}

export function calculateSavingsPlan(
  targetBRL: number,
  months: number,
  selicAnnual: number
): SavingsPlan {
  const monthlyRate = selicAnnual / 12
  const monthlyWithoutInvestment = targetBRL / months

  // PMT for future value annuity: PMT = FV × r / ((1+r)^n - 1)
  const monthlyWithSelic =
    monthlyRate === 0
      ? targetBRL / months
      : (targetBRL * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)

  const totalWithoutInvestment = monthlyWithoutInvestment * months
  const totalWithSelic = monthlyWithSelic * months
  const savingsWithInvestment = totalWithoutInvestment - totalWithSelic

  const monthlyBreakdown = Array.from({ length: months }, (_, i) => {
    const month = i + 1
    const accumulated = monthlyWithoutInvestment * month
    const withInterest =
      monthlyRate === 0
        ? monthlyWithSelic * month
        : monthlyWithSelic * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate)
    return { month, accumulated, withInterest }
  })

  return {
    targetAmount: targetBRL,
    months,
    monthlyWithoutInvestment,
    monthlyWithSelic,
    totalWithoutInvestment,
    totalWithSelic,
    savingsWithInvestment,
    monthlyBreakdown,
  }
}
