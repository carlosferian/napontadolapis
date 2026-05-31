/**
 * config/tax.ts
 * Tabela Progressiva do IRPF — vigente 2024/2025
 * Fonte: Receita Federal (https://www.gov.br/receitafederal/pt-br)
 * Atualizada pela MP 1.206/2024 e convertida pela Lei 14.848/2024
 *
 * Cada faixa acumula sobre a anterior — quem ganha R$5k NÃO paga 27,5% sobre tudo,
 * apenas sobre a parte que excede R$4.664,68.
 */

export interface IRBracket {
  /** Limite superior da faixa (Infinity = sem limite) */
  limit:     number
  /** Alíquota da faixa (0 a 1) */
  rate:      number
  /**
   * Parcela a deduzir — atalho algébrico que permite calcular
   * IR = gross × rate - deduction em vez de somar faixa a faixa.
   */
  deduction: number
}

/** Tabela IRPF 2024/2025 — valores mensais em R$ */
export const IR_TABLE: IRBracket[] = [
  { limit: 2_259.20, rate: 0,      deduction: 0       },
  { limit: 2_826.65, rate: 0.075,  deduction: 169.44  },
  { limit: 3_751.05, rate: 0.15,   deduction: 381.44  },
  { limit: 4_664.68, rate: 0.225,  deduction: 662.77  },
  { limit: Infinity, rate: 0.275,  deduction: 896.00  },
]

// ── Funções de cálculo ────────────────────────────────────────────────────

export interface IRBracketDetail {
  from:          number  // início da faixa (R$)
  to:            number  // fim da faixa (R$) — pode ser Infinity
  rate:          number  // alíquota da faixa
  incomeInRange: number  // quanto da renda cai nesta faixa
  taxInRange:    number  // imposto desta faixa
}

export interface IRResult {
  gross:         number              // renda bruta informada
  irDue:         number              // imposto total a pagar
  net:           number              // renda líquida (gross - irDue)
  effectiveRate: number              // alíquota efetiva (irDue / gross)
  marginalRate:  number              // alíquota da faixa mais alta atingida
  brackets:      IRBracketDetail[]   // detalhamento por faixa (apenas faixas com renda)
}

/**
 * Calcula o IR progressivo mensal sobre uma renda BRUTA.
 * Decompõe cada faixa para fins pedagógicos.
 */
export function calculateIR(gross: number): IRResult {
  if (gross <= 0) {
    return { gross: 0, irDue: 0, net: 0, effectiveRate: 0, marginalRate: 0, brackets: [] }
  }

  const details: IRBracketDetail[] = []
  let totalTax   = 0
  let prev       = 0
  let marginal   = 0

  for (const bracket of IR_TABLE) {
    const to            = bracket.limit
    const rangeMax      = Math.min(gross, to)
    const incomeInRange = Math.max(0, rangeMax - prev)

    if (incomeInRange > 0) {
      const taxInRange = incomeInRange * bracket.rate
      totalTax        += taxInRange
      marginal         = bracket.rate

      details.push({
        from:          prev,
        to:            to === Infinity ? gross : to,
        rate:          bracket.rate,
        incomeInRange: Number(incomeInRange.toFixed(2)),
        taxInRange:    Number(taxInRange.toFixed(2)),
      })
    }

    prev = to
    if (gross <= to) break
  }

  const irDue        = Number(totalTax.toFixed(2))
  const net          = Number(Math.max(0, gross - irDue).toFixed(2))
  const effectiveRate = gross > 0 ? Number((irDue / gross).toFixed(6)) : 0

  return { gross, irDue, net, effectiveRate, marginalRate: marginal, brackets: details }
}

/**
 * Dado um salário LÍQUIDO desejado, calcula o BRUTO necessário.
 * Resolve a equação: net = gross - IR(gross)  →  gross = ?
 *
 * Para cada faixa k: net_k = gross × (1 - rate_k) + deduction_k
 * → gross = (net - deduction_k) / (1 - rate_k)
 *
 * Determinamos a faixa correta calculando o net no limite de cada faixa.
 */
export function grossFromNet(desiredNet: number): number {
  if (desiredNet <= 0) return 0

  // Pré-calcula o net máximo de cada faixa (para determinar em qual faixa cai o desiredNet)
  let prev    = 0
  let prevNet = 0

  for (const bracket of IR_TABLE) {
    const bracketTop    = bracket.limit === Infinity ? Infinity : bracket.limit
    const netAtTop      = bracket.limit === Infinity
      ? Infinity
      : bracket.limit * (1 - bracket.rate) + bracket.deduction

    if (desiredNet <= netAtTop || bracket.limit === Infinity) {
      // O net desejado cai nesta faixa
      if (bracket.rate === 0) return desiredNet   // isento
      const gross = (desiredNet - bracket.deduction) / (1 - bracket.rate)
      return Number(Math.max(0, gross).toFixed(2))
    }

    prev    = bracketTop
    prevNet = netAtTop
  }

  // Fallback (não deve chegar aqui)
  return desiredNet
}
