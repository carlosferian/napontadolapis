// lib/calculations/probability.ts
export function calcHouseEdge(odd: number): number {
  const impliedProb = 1 / odd
  const houseEdge = (2 * impliedProb - 1) * 100
  return Math.abs(houseEdge)
}

export function expectedValuePerBet(odd: number, betAmount: number): number {
  const impliedProb = 1 / odd
  return impliedProb * (odd - 1) * betAmount - (1 - impliedProb) * betAmount
}

function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp(-x * x / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))))
  return x > 0 ? 1 - p : p
}

export function probProfit(odd: number, N: number): number {
  const p = 1 / odd
  const gain = odd - 1
  const loss = 1
  const mean = p * gain - (1 - p) * loss
  const variance = p * Math.pow(gain, 2) + (1 - p) * Math.pow(loss, 2) - Math.pow(mean, 2)
  const totalMean = N * mean
  const totalStd = Math.sqrt(N * variance)
  if (totalStd === 0) return mean > 0 ? 100 : 0
  return normalCDF(totalMean / totalStd) * 100
}
