// lib/calculations/income.ts

export interface IncomeParams {
  C:         number  // Capital Inicial
  R:         number  // Retirada Mensal (em valores de HOJE — poder de compra constante)
  I:         number  // Rentabilidade Anual % a.a. (nominal, bruta de inflação)
  inflation: number  // Inflação Anual % a.a. (IPCA/meta)
  T:         number  // Tempo de Retirada em anos
}

export interface IncomeResult {
  C:         number
  R:         number
  I:         number
  inflation: number
  T:         number
  realI:     number  // taxa real a.a. = (1+I)/(1+inf) - 1
  isPerpetual:         boolean
  isPerpetualNominal:  boolean  // seria perpétuo se ignorasse inflação
  monthlyRate:         number   // taxa real mensal
  monthlyRateNominal:  number   // taxa nominal mensal (para referência)
  totalWithdrawn:      number
  totalInterestEarned: number
  nominalDuration:     number   // duração sem inflação (comparação)
  timeline: {
    year:           number
    balance:        number  // saldo real (poder de compra em valores de hoje)
    nominalBalance: number  // saldo nominal (o que aparece no extrato)
    interest:       number
    withdrawn:      number
  }[]
}

// ── Helpers ──────────────────────────────────────────────────────────────

function realAnnualRate(nominalPct: number, inflationPct: number): number {
  return ((1 + nominalPct / 100) / (1 + inflationPct / 100) - 1) * 100
}

function monthlyFromAnnual(annualPct: number): number {
  if (annualPct <= -100) return -1
  return Math.pow(1 + annualPct / 100, 1 / 12) - 1
}

// Bisection solver — encontra taxa anual necessária (real)
function solveInterestRate(C: number, R: number, n: number): number {
  if (C <= 0 || R <= 0 || n <= 0) return 0
  if (R * n <= C) return 0
  let low = 0.0, high = 5.0
  const f = (i: number) => {
    if (i === 0) return C - R * n
    const pow = Math.pow(1 + i, n)
    return C * i * pow - R * (pow - 1)
  }
  for (let k = 0; k < 100; k++) {
    const mid = (low + high) / 2
    const val = f(mid)
    if (Math.abs(val) < 1e-6) { low = mid; break }
    if (val > 0) high = mid; else low = mid
  }
  return Number(((Math.pow(1 + low, 12) - 1) * 100).toFixed(2))
}

// Duração sem inflação (para comparação — valor que a calculadora antiga mostrava)
function nominalOnlyDuration(C: number, R: number, nominalAnnual: number): number {
  const i = monthlyFromAnnual(nominalAnnual)
  if (i <= 0) return C / R / 12
  if (R <= C * i) return 100 // perpetual
  const x = R / (R - C * i)
  return Number((Math.log(x) / Math.log(1 + i) / 12).toFixed(1))
}

// ── Função principal ──────────────────────────────────────────────────────

export function calculateIncome(
  params: IncomeParams,
  target: 'C' | 'R' | 'I' | 'T'
): IncomeResult {
  let { C, R, I, T } = params
  const inflation = Math.max(0, params.inflation ?? 5)

  // Taxa real: é aqui que mora o problema que a calculadora antiga ignorava
  const realI    = realAnnualRate(I, inflation)
  let   i        = monthlyFromAnnual(realI)          // taxa real mensal
  const iNominal = monthlyFromAnnual(I)              // taxa nominal mensal (só para referência)
  let   n        = T * 12

  let isPerpetual = false

  // ── 1. Resolver a variável alvo usando taxa REAL ──────────────────────
  if (target === 'C') {
    if (n <= 0) {
      C = 0
    } else if (i <= 0) {
      C = R * n
    } else {
      C = (R / i) * (1 - 1 / Math.pow(1 + i, n))
    }
    C = Number(Math.max(0, C).toFixed(2))
  } else if (target === 'R') {
    if (n <= 0) {
      R = 0
    } else if (i <= 0) {
      R = C / n
    } else {
      R = (C * i) / (1 - Math.pow(1 + i, -n))
    }
    R = Number(Math.max(0, R).toFixed(2))
  } else if (target === 'T') {
    if (R <= 0) {
      T = 0; isPerpetual = true
    } else if (i <= 0) {
      T = C / R / 12
    } else if (R <= C * i) {
      T = 100; isPerpetual = true
    } else {
      const x = R / (R - C * i)
      T = Number((Math.log(x) / Math.log(1 + i) / 12).toFixed(1))
    }
  } else if (target === 'I') {
    // Resolver pela taxa real; depois inferir a nominal necessária
    const realRate = solveInterestRate(C, R, n)
    // nominal = (1 + real) × (1 + inflation) - 1
    I = Number((((1 + realRate / 100) * (1 + inflation / 100) - 1) * 100).toFixed(2))
    // Recalcular taxa real com o I agora conhecido
    const newRealI = realAnnualRate(I, inflation)
    i = monthlyFromAnnual(newRealI)
  }

  // ── 2. Condição de perpetuidade na taxa real ──────────────────────────
  if (R > 0 && i > 0 && R <= C * i) {
    isPerpetual = true
  }

  // O que a calculadora antiga diria (apenas para comparação)
  const isPerpetualNominal = iNominal > 0 && R > 0 && R <= C * iNominal
  const nominalDur         = nominalOnlyDuration(C, R, I)

  // ── 3. Evolução patrimonial — simulação mês a mês em termos REAIS ─────
  const timeline: IncomeResult['timeline'] = []
  const maxYears     = isPerpetual ? 40 : Math.ceil(T)
  let   balance      = C          // saldo em termos de poder de compra (reais)
  let   totalWithdrawn      = 0
  let   totalInterestEarned = 0

  timeline.push({
    year:           0,
    balance:        C,
    nominalBalance: C,   // no ano 0, nominal = real
    interest:       0,
    withdrawn:      0,
  })

  for (let year = 1; year <= maxYears; year++) {
    let yearInterest  = 0
    let yearWithdrawn = 0

    for (let m = 1; m <= 12; m++) {
      if (balance <= 0 && !isPerpetual) { balance = 0; break }
      const monthInterest  = balance * i
      yearInterest        += monthInterest
      const actualWithdraw = Math.min(balance + monthInterest, R)
      yearWithdrawn       += actualWithdraw
      balance              = balance + monthInterest - actualWithdraw
    }

    totalWithdrawn      += yearWithdrawn
    totalInterestEarned += yearInterest

    const realBal    = Math.max(0, balance)
    // Saldo nominal = saldo real × fator de inflação acumulada
    const infFactor  = Math.pow(1 + inflation / 100, year)
    const nominalBal = realBal * infFactor

    timeline.push({
      year,
      balance:        Number(realBal.toFixed(2)),
      nominalBalance: Number(nominalBal.toFixed(2)),
      interest:       Number(yearInterest.toFixed(2)),
      withdrawn:      Number(yearWithdrawn.toFixed(2)),
    })

    if (realBal <= 0 && !isPerpetual) break
  }

  return {
    C, R, I, inflation, T,
    realI:              Number(realI.toFixed(2)),
    isPerpetual,
    isPerpetualNominal,
    monthlyRate:        Number((i * 100).toFixed(4)),
    monthlyRateNominal: Number((iNominal * 100).toFixed(4)),
    totalWithdrawn:     Number(totalWithdrawn.toFixed(2)),
    totalInterestEarned: Number(totalInterestEarned.toFixed(2)),
    nominalDuration:    nominalDur,
    timeline,
  }
}
