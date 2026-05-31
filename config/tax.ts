/**
 * config/tax.ts
 * Tabela Progressiva do IRPF — vigente a partir de 01/01/2026
 * Lei nº 15.270/2025 (Lei dos 5 Mil) — Receita Federal
 * https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026
 *
 * COMO FUNCIONA:
 * 1. Calcula-se o IR pela tabela progressiva clássica (faixas com alíquotas crescentes)
 * 2. Aplica-se o "redutor especial" da Lei 15.270/2025:
 *    · Até R$ 5.000: redutor = IR inteiro → IR final = R$ 0 (isenção total)
 *    · R$ 5.000,01 a R$ 7.350: redutor = R$ 978,62 − (0,133145 × renda) → isenção parcial decrescente
 *    · Acima de R$ 7.350: sem redutor → tabela progressiva integral
 *
 * ATENÇÃO — DESCONTINUIDADE LEGAL:
 * Quem ganha R$ 5.000 paga IR = R$ 0.
 * Quem ganha R$ 5.001 paga IR ≈ R$ 153 (a redução parcial não cobre tudo na faixa logo acima).
 * Essa "cliff" é um efeito conhecido da lei; o intervalo de R$ 5.000–R$ 7.350 amortece
 * mas não elimina o salto.
 */

export interface IRBracket {
  limit:     number   // Limite superior da faixa (Infinity = sem limite)
  rate:      number   // Alíquota (0 a 1)
  deduction: number   // Parcela a deduzir — atalho: IR = gross × rate − deduction
}

/** Tabela progressiva 2026 — valores mensais em R$ */
export const IR_TABLE: IRBracket[] = [
  { limit: 2_428.80, rate: 0,      deduction: 0       },
  { limit: 2_826.65, rate: 0.075,  deduction: 182.16  },
  { limit: 3_751.05, rate: 0.15,   deduction: 394.16  },
  { limit: 4_664.68, rate: 0.225,  deduction: 675.49  },
  { limit: Infinity, rate: 0.275,  deduction: 908.73  },
]

/** Parâmetros do redutor especial (Lei 15.270/2025) */
export const LEI_5MIL = {
  fullExemptionLimit:    5_000,    // até aqui: IR zerado integralmente
  transitionLimit:       7_350,    // até aqui: redutor parcial decrescente
  reductorConstant:      978.62,   // coeficiente A da fórmula: A − B × renda
  reductorSlope:         0.133145, // coeficiente B da fórmula
}

// ── Interfaces ────────────────────────────────────────────────────────────

export interface IRBracketDetail {
  from:          number
  to:            number  // Infinity = sem limite superior
  rate:          number
  incomeInRange: number  // parcela da renda nesta faixa
  taxInRange:    number  // IR bruto desta faixa (antes do redutor)
}

export interface IRResult {
  gross:              number
  progressiveIR:      number  // IR pela tabela pura, sem redutor
  redutor:            number  // redutor aplicado (Lei 15.270/2025)
  irDue:              number  // IR final = max(0, progressiveIR − redutor)
  net:                number  // renda líquida (gross − irDue)
  effectiveRate:      number  // irDue / gross
  marginalRate:       number  // alíquota da faixa mais alta atingida
  inFullExemption:    boolean // gross ≤ 5.000 (lei dos 5 mil)
  inTransitionZone:   boolean // 5.000 < gross ≤ 7.350
  brackets:           IRBracketDetail[]
}

// ── Funções ───────────────────────────────────────────────────────────────

/** Calcula o IR progressivo ANTES do redutor (tabela pura). */
function calcProgressiveIR(gross: number): { ir: number; marginal: number; brackets: IRBracketDetail[] } {
  const brackets: IRBracketDetail[] = []
  let totalIR  = 0
  let marginal = 0
  let prev     = 0

  for (const bracket of IR_TABLE) {
    const cap           = Math.min(gross, bracket.limit)
    const incomeInRange = Math.max(0, cap - prev)

    if (incomeInRange > 0) {
      const taxInRange = incomeInRange * bracket.rate
      totalIR         += taxInRange
      marginal         = bracket.rate
      brackets.push({
        from:          prev,
        to:            bracket.limit === Infinity ? gross : bracket.limit,
        rate:          bracket.rate,
        incomeInRange: Number(incomeInRange.toFixed(2)),
        taxInRange:    Number(taxInRange.toFixed(2)),
      })
    }

    prev = bracket.limit
    if (gross <= bracket.limit) break
  }

  return { ir: Number(totalIR.toFixed(2)), marginal, brackets }
}

/**
 * Calcula o IR final com todas as regras de 2026, incluindo a Lei 15.270/2025.
 */
export function calculateIR(gross: number): IRResult {
  if (gross <= 0) {
    return {
      gross: 0, progressiveIR: 0, redutor: 0, irDue: 0,
      net: 0, effectiveRate: 0, marginalRate: 0,
      inFullExemption: true, inTransitionZone: false, brackets: [],
    }
  }

  const { ir: progressiveIR, marginal, brackets } = calcProgressiveIR(gross)

  // Redutor da Lei 15.270/2025
  let redutor = 0
  const inFullExemption  = gross <= LEI_5MIL.fullExemptionLimit
  const inTransitionZone = !inFullExemption && gross <= LEI_5MIL.transitionLimit

  if (inFullExemption) {
    redutor = progressiveIR  // zeragem total
  } else if (inTransitionZone) {
    redutor = Math.max(0, LEI_5MIL.reductorConstant - LEI_5MIL.reductorSlope * gross)
  }
  // else: sem redutor

  const irDue        = Number(Math.max(0, progressiveIR - redutor).toFixed(2))
  const net          = Number(Math.max(0, gross - irDue).toFixed(2))
  const effectiveRate = gross > 0 ? Number((irDue / gross).toFixed(6)) : 0

  return {
    gross, progressiveIR, redutor, irDue, net,
    effectiveRate, marginalRate: marginal,
    inFullExemption, inTransitionZone, brackets,
  }
}

/**
 * Dado um salário LÍQUIDO desejado, calcula o BRUTO necessário.
 *
 * Zonas (2026 com Lei 15.270/2025):
 *
 * Zona 1 (gross ≤ 5.000 → net = gross):
 *   gross = net  (IR = 0, isento)
 *
 * Zona 2 (5.000 < gross ≤ 7.350 → transição):
 *   IR_final = gross × 0.408145 − 1.887,35
 *   net = gross × 0.591855 + 1.887,35
 *   → gross = (net − 1.887,35) / 0.591855
 *   Válido para net ∈ [~4.847, ~6.237]
 *
 * Zona 3 (gross > 7.350 → tabela cheia):
 *   Resolve net = gross − IR_progressive(gross) por faixa.
 *
 * NOTA SOBRE A DESCONTINUIDADE:
 * Não existe gross que produza net em (4.847, 5.000) com as regras atuais.
 * Para net nessa faixa, retornamos gross = net (mantendo o usuário na zona isenta).
 */
export function grossFromNet(desiredNet: number): number {
  if (desiredNet <= 0) return 0

  // Zona 1 — isento (inclui a faixa da "descontinuidade": net ≤ 5.000)
  if (desiredNet <= LEI_5MIL.fullExemptionLimit) return desiredNet

  // Zona 2 — transição: net ∈ [~4.847, ~6.237]
  // Limite superior da zona 2 (net quando gross = 7.350)
  const netAtTransitionTop = 7_350 * 0.591855 + 1_887.35  // ≈ 6.237,48
  if (desiredNet <= netAtTransitionTop) {
    const gross = (desiredNet - 1_887.35) / 0.591855
    if (gross >= LEI_5MIL.fullExemptionLimit && gross <= LEI_5MIL.transitionLimit) {
      return Number(gross.toFixed(2))
    }
  }

  // Zona 3 — tabela progressiva cheia (gross > 7.350)
  // Para cada faixa k: net_k = gross × (1 − rate_k) + deduction_k
  // → gross = (net − deduction_k) / (1 − rate_k)
  let prev    = 0
  let prevNet = 7_350 - calculateIR(7_350).irDue  // ≈ 6.237,48

  for (const bracket of IR_TABLE) {
    if (bracket.rate === 0) { prev = bracket.limit; continue }
    const netAtTop = bracket.limit === Infinity
      ? Infinity
      : bracket.limit * (1 - bracket.rate) + bracket.deduction

    if (desiredNet <= netAtTop || bracket.limit === Infinity) {
      const gross = (desiredNet - bracket.deduction) / (1 - bracket.rate)
      // Confirmar que está na zona 3 (gross > 7.350)
      if (gross > LEI_5MIL.transitionLimit) return Number(Math.max(0, gross).toFixed(2))
    }

    prev    = bracket.limit
    prevNet = netAtTop
  }

  return desiredNet  // fallback
}
