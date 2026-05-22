// lib/calculations/compound.ts
export function compoundMonthly(monthly: number, years: number, annualRate: number): number {
  const r = annualRate / 12
  const n = years * 12
  if (r === 0) return monthly * n
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
}

export function totalSpent(monthly: number, months: number): number {
  return monthly * months
}
