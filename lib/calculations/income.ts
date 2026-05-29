// lib/calculations/income.ts

export interface IncomeParams {
  C: number // Capital Inicial
  R: number // Retirada Mensal
  I: number // Taxa de Juros Anual (% a.a.)
  T: number // Tempo de Retirada em anos
}

export interface IncomeResult {
  C: number
  R: number
  I: number
  T: number
  isPerpetual: boolean
  monthlyRate: number
  totalWithdrawn: number
  totalInterestEarned: number
  timeline: { year: number; balance: number; interest: number; withdrawn: number }[]
}

// Bisection solver para encontrar a taxa de juros necessária
function solveInterestRate(C: number, R: number, n: number): number {
  if (C <= 0 || R <= 0 || n <= 0) return 0
  if (R * n <= C) return 0

  let low = 0.0
  let high = 5.0 // 500% ao mês, limite astronômico
  
  const f = (i: number) => {
    if (i === 0) return C - R * n
    const pow = Math.pow(1 + i, n)
    return C * i * pow - R * (pow - 1)
  }
  
  for (let iter = 0; iter < 100; iter++) {
    const mid = (low + high) / 2
    const val = f(mid)
    if (Math.abs(val) < 1e-6) {
      low = mid
      break
    }
    if (val > 0) {
      high = mid
    } else {
      low = mid
    }
  }
  
  // Converter taxa mensal para anual: (1 + i)^12 - 1
  const annualRate = Math.pow(1 + low, 12) - 1
  return Number((annualRate * 100).toFixed(2))
}

/**
 * Lógica matemática da Calculadora de Renda Passiva / Viver de Renda.
 * Deduz dinamicamente a variável faltante (target) com base nas outras três.
 */
export function calculateIncome(params: IncomeParams, target: 'C' | 'R' | 'I' | 'T'): IncomeResult {
  let { C, R, I, T } = params
  
  // Converter taxa anual para taxa mensal equivalente: (1 + I/100)^(1/12) - 1
  let i = I > 0 ? Math.pow(1 + I / 100, 1 / 12) - 1 : 0
  let n = T * 12

  let isPerpetual = false

  // 1. Resolver a variável correspondente ao Target
  if (target === 'C') {
    if (n <= 0) {
      C = 0
    } else if (i === 0) {
      C = R * n
    } else {
      C = (R / i) * (1 - 1 / Math.pow(1 + i, n))
    }
    C = Number(Math.max(0, C).toFixed(2))
  } else if (target === 'R') {
    if (n <= 0) {
      R = 0
    } else if (i === 0) {
      R = C / n
    } else {
      R = (C * i) / (1 - Math.pow(1 + i, -n))
    }
    R = Number(Math.max(0, R).toFixed(2))
  } else if (target === 'T') {
    if (R <= 0) {
      T = 0
      isPerpetual = true
    } else if (i === 0) {
      T = C / R / 12
    } else if (R <= C * i) {
      T = 100 // Limite de projeção gráfica
      isPerpetual = true
    } else {
      const x = R / (R - C * i)
      const months = Math.log(x) / Math.log(1 + i)
      T = Number((months / 12).toFixed(1))
    }
  } else if (target === 'I') {
    I = solveInterestRate(C, R, n)
    i = I > 0 ? Math.pow(1 + I / 100, 1 / 12) - 1 : 0
  }

  // 2. Verificar se a retirada é perpétua sob as condições vigentes
  if (R <= C * i && R > 0 && i > 0) {
    isPerpetual = true
  }

  // 3. Gerar evolução patrimonial ano a ano para o gráfico
  const timeline: { year: number; balance: number; interest: number; withdrawn: number }[] = []
  const maxYears = isPerpetual ? 40 : Math.ceil(T)
  
  let balance = C
  let totalWithdrawn = 0
  let totalInterestEarned = 0

  // Ponto inicial (Ano 0)
  timeline.push({
    year: 0,
    balance: C,
    interest: 0,
    withdrawn: 0
  })

  for (let year = 1; year <= maxYears; year++) {
    let yearInterest = 0
    let yearWithdrawn = 0

    // Simular 12 meses para o ano correspondente
    for (let m = 1; m <= 12; m++) {
      if (balance <= 0 && !isPerpetual) {
        balance = 0
        break
      }
      
      const interestForMonth = balance * i
      yearInterest += interestForMonth
      
      // Retirada mensal limitada ao saldo disponível
      const actualWithdrawal = Math.min(balance + interestForMonth, R)
      yearWithdrawn += actualWithdrawal
      
      balance = balance + interestForMonth - actualWithdrawal
    }

    totalWithdrawn += yearWithdrawn
    totalInterestEarned += yearInterest

    timeline.push({
      year,
      balance: Number(Math.max(0, balance).toFixed(2)),
      interest: Number(yearInterest.toFixed(2)),
      withdrawn: Number(yearWithdrawn.toFixed(2))
    })

    if (balance <= 0 && !isPerpetual) {
      break
    }
  }

  return {
    C,
    R,
    I,
    T,
    isPerpetual,
    monthlyRate: Number((i * 100).toFixed(4)),
    totalWithdrawn: Number(totalWithdrawn.toFixed(2)),
    totalInterestEarned: Number(totalInterestEarned.toFixed(2)),
    timeline,
  }
}
