// lib/calculations/compound.ts

/** Valor futuro de aportes mensais à taxa NOMINAL. */
export function compoundMonthly(monthly: number, years: number, annualRate: number): number {
  const r = annualRate / 12
  const n = years * 12
  if (r === 0) return monthly * n
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
}

/**
 * Valor futuro de aportes mensais à taxa REAL (poder de compra constante).
 * Usa Fisher: real = (1 + nominal) / (1 + inflation) - 1
 */
export function compoundMonthlyReal(
  monthly: number,
  years: number,
  annualNominalRate: number,
  annualInflationRate: number
): number {
  const real = (1 + annualNominalRate) / (1 + annualInflationRate) - 1
  return compoundMonthly(monthly, years, real)
}

/** Traz um valor futuro nominal de volta ao poder de compra de hoje. */
export function deflateToToday(futureValue: number, years: number, annualInflationRate: number): number {
  return futureValue / Math.pow(1 + annualInflationRate, years)
}

export function totalSpent(monthly: number, months: number): number {
  return monthly * months
}
