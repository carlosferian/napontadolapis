// Assume apostas em eventos 50/50 (vitória/derrota) — o caso mais comum nas bets esportivas.
// A odd "justa" seria 2.0; qualquer odd < 2.0 embute margem da casa.

const TRUE_PROB = 0.5

export function calcHouseEdge(odd: number): number {
  // % que a casa retém em cada R$1 apostado num evento 50/50
  const fairOdd = 1 / TRUE_PROB // 2.0
  return Math.max(((fairOdd - odd) / fairOdd) * 100, 0)
}

export function expectedValuePerBet(odd: number, betAmount: number): number {
  // Valor esperado: lucro médio por aposta (negativo = perda esperada)
  return TRUE_PROB * (odd - 1) * betAmount - (1 - TRUE_PROB) * betAmount
}

function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp((-x * x) / 2)
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))))
  return x > 0 ? 1 - p : p
}

export function probProfit(odd: number, N: number): number {
  // Probabilidade de estar no lucro após N apostas independentes num evento 50/50
  const p = TRUE_PROB
  const gain = odd - 1
  const loss = 1
  const mean = p * gain - (1 - p) * loss
  const variance =
    p * Math.pow(gain, 2) + (1 - p) * Math.pow(loss, 2) - Math.pow(mean, 2)
  const totalMean = N * mean
  const totalStd = Math.sqrt(N * variance)
  if (totalStd === 0) return mean >= 0 ? 100 : 0
  return normalCDF(totalMean / totalStd) * 100
}
