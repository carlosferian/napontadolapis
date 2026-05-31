// lib/calculations/financing.ts
// Comparativo matemático: SAC · Price · Empréstimo Pessoal · Consórcio

export interface MonthlyPoint {
  month:     number
  payment:   number   // parcela total do mês
  principal: number   // amortização
  interest:  number   // juros (ou taxa admin para consórcio)
  balance:   number   // saldo devedor restante
}

export interface FinancingResult {
  modality:      string
  firstPayment:  number
  lastPayment:   number
  totalPaid:     number
  totalAbove:    number   // total pago − valor financiado
  totalAbovePct: number   // totalAbove / valorFinanciado × 100
  timeline:      MonthlyPoint[]
}

// ── Helpers ──────────────────────────────────────────────────────────────

/** Taxa mensal equivalente a partir da taxa anual (composta) */
function monthlyRate(annualPct: number): number {
  if (annualPct <= 0) return 0
  return Math.pow(1 + annualPct / 100, 1 / 12) - 1
}

// ── SAC — Sistema de Amortização Constante ────────────────────────────────
// Amortização constante: A = P/n
// Juros decrescem a cada mês sobre o saldo devedor
// Parcela inicial = A + P×r  |  Parcela final = A + (P/n)×r  ← muito menor
export function calcSAC(P: number, n: number, annualRatePct: number): FinancingResult {
  const r   = monthlyRate(annualRatePct)
  const A   = P / n
  const timeline: MonthlyPoint[] = []
  let   bal = P, total = 0

  for (let m = 1; m <= n; m++) {
    const interest = bal * r
    const payment  = A + interest
    bal           -= A
    total         += payment
    timeline.push({ month: m, payment, principal: A, interest, balance: Math.max(0, bal) })
  }

  return {
    modality:      'SAC',
    firstPayment:  timeline[0].payment,
    lastPayment:   timeline[n - 1].payment,
    totalPaid:     total,
    totalAbove:    total - P,
    totalAbovePct: ((total - P) / P) * 100,
    timeline,
  }
}

// ── Price (Sistema Francês / Tabela Price) ────────────────────────────────
// Parcela fixa: PMT = P × r × (1+r)^n / ((1+r)^n − 1)
// Juros são maiores no início; amortização cresce com o tempo
export function calcPrice(P: number, n: number, annualRatePct: number): FinancingResult {
  const r   = monthlyRate(annualRatePct)
  const PMT = r > 0
    ? P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    : P / n
  const timeline: MonthlyPoint[] = []
  let   bal = P, total = 0

  for (let m = 1; m <= n; m++) {
    const interest  = bal * r
    const principal = PMT - interest
    bal            -= principal
    total          += PMT
    timeline.push({ month: m, payment: PMT, principal: Math.max(0, principal), interest, balance: Math.max(0, bal) })
  }

  return {
    modality:      'Price',
    firstPayment:  PMT,
    lastPayment:   PMT,
    totalPaid:     total,
    totalAbove:    total - P,
    totalAbovePct: ((total - P) / P) * 100,
    timeline,
  }
}

// ── Empréstimo Pessoal / CDC ──────────────────────────────────────────────
// Usa a mesma fórmula Price mas com taxas muito mais altas
// Típico: 1,8%–3% a.m. (24%–36% a.a.) para empréstimo pessoal
//         0,9%–1,8% a.m. para CDC de veículo
export function calcEmprestimo(P: number, n: number, annualRatePct: number): FinancingResult {
  const base    = calcPrice(P, n, annualRatePct)
  return { ...base, modality: 'Empréstimo' }
}

// ── Consórcio ─────────────────────────────────────────────────────────────
// Não tem juros — tem taxa de administração sobre o valor total da carta
// O saldo devedor é reajustado anualmente (INCC para imóveis, INPC para veículos)
// → As parcelas SOBEM todo ano em vez de cair (como no SAC)
// → Se você antecipar o pagamento, NÃO há desconto nas parcelas futuras

export interface ConsorcioParams {
  creditValue:         number   // valor da carta de crédito
  months:              number   // prazo total do grupo
  adminFeePct:         number   // taxa de administração total % sobre carta (ex: 18)
  annualAdjustPct:     number   // reajuste anual % (INCC ≈ 6%, INPC ≈ 4%)
  contemplationMonth:  number   // mês em que o consorciado é sorteado (1 a months)
  reserveFundPct?:     number   // fundo de reserva % (opcional, default 2%)
  insurancePct?:       number   // seguro prestamista % mensal do crédito (default 0.03%)
}

export interface ConsorcioResult extends FinancingResult {
  modality:            'Consórcio'
  adminFeeTotal:       number   // taxa admin em R$
  adjustmentImpact:    number   // impacto do reajuste (total pago a mais por causa do INCC)
  monthsWaited:        number   // meses até ter o bem
  creditAtContemplation: number // valor da carta quando contemplado (já reajustado)
  // Para fins comparativos: quanto você pagou ANTES de ter o bem
  paidBeforeAsset:     number
}

export function calcConsorcio(params: ConsorcioParams): ConsorcioResult {
  const {
    creditValue: C,
    months: n,
    adminFeePct,
    annualAdjustPct,
    contemplationMonth,
    reserveFundPct    = 2,
    insurancePct      = 0.03,
  } = params

  const adjust        = annualAdjustPct / 100
  const adminTotal    = C * adminFeePct / 100
  const reserveTotal  = C * reserveFundPct / 100
  // Base sem reajuste: carta + admin + reserva, dividida pelo prazo
  const baseMonthly   = (C + adminTotal + reserveTotal) / n
  const insuranceMo   = C * insurancePct / 100

  const timeline: MonthlyPoint[] = []
  let total = 0, adjustImpact = 0
  let currentCredit = C  // carta corrigida pelo INCC ao longo do tempo

  for (let m = 1; m <= n; m++) {
    // Reajuste anual no início de cada novo ano (meses 13, 25, 37...)
    if (m > 1 && (m - 1) % 12 === 0) {
      currentCredit *= (1 + adjust)
    }
    // Parcela acompanha o reajuste proporcional da carta
    const factor    = currentCredit / C   // quanto a carta cresceu
    const principal = (C / n) * factor    // amortização reajustada
    const adminMo   = (adminTotal / n) * factor + insuranceMo
    const payment   = principal + adminMo

    adjustImpact += payment - baseMonthly - insuranceMo

    total += payment
    timeline.push({
      month:     m,
      payment,
      principal,
      interest:  adminMo,    // usamos "interest" slot para taxa admin + seguro
      balance:   Math.max(0, currentCredit - (C / n) * m * factor),
    })
  }

  const creditAtContemplation = C * Math.pow(1 + adjust, Math.floor((contemplationMonth - 1) / 12))
  const paidBeforeAsset       = timeline.slice(0, contemplationMonth).reduce((s, p) => s + p.payment, 0)

  return {
    modality:              'Consórcio',
    firstPayment:          timeline[0].payment,
    lastPayment:           timeline[n - 1].payment,
    totalPaid:             total,
    totalAbove:            total - C,
    totalAbovePct:         ((total - C) / C) * 100,
    adminFeeTotal:         adminTotal,
    adjustmentImpact:      Math.max(0, adjustImpact),
    monthsWaited:          contemplationMonth,
    creditAtContemplation,
    paidBeforeAsset,
    timeline,
  }
}

// ── Amortização antecipada — impacto por modalidade ───────────────────────
// Mostra quanto você economiza quitando N meses à frente

export function earlyPayoffSaving(
  result: FinancingResult,
  quitAtMonth: number
): { saved: number; remainingBalance: number } {
  if (result.modality === 'Consórcio') {
    // No consórcio NÃO há desconto na antecipação — você paga a taxa integral
    return { saved: 0, remainingBalance: 0 }
  }
  const point         = result.timeline[quitAtMonth - 1]
  const remainingPaid = result.timeline.slice(quitAtMonth).reduce((s, p) => s + p.payment, 0)
  const balance       = point.balance
  const saved         = remainingPaid - balance
  return { saved: Math.max(0, saved), remainingBalance: balance }
}
