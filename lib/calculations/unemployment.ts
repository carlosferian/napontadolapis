// lib/calculations/unemployment.ts

export const WAGE_2026_MINIMUM = 1621 // Salário Mínimo em 2026
export const UNEMPLOYMENT_2026_TETO = 2518.65 // Teto da parcela do Seguro-Desemprego em 2026

export interface UnemploymentParams {
  averageSalary: number
  requestNumber: 1 | 2 | 3 // 1ª, 2ª ou 3ª+ vez
  monthsWorked: number // Meses trabalhados nos últimos 36 meses
}

export interface UnemploymentResult {
  isEligible: boolean
  ineligibilityReason?: string
  installmentsCount: number
  installmentValue: number
  totalValue: number
  minMonthsRequired: number
}

/**
 * Calcula o Seguro-Desemprego de acordo com as regras de 2026 vigentes.
 */
export function calculateUnemployment(params: UnemploymentParams): UnemploymentResult {
  const { averageSalary, requestNumber, monthsWorked } = params

  let isEligible = true
  let ineligibilityReason = ''
  let minMonthsRequired = 12

  // 1. Verificar Elegibilidade por tempo trabalhado
  if (requestNumber === 1) {
    minMonthsRequired = 12
    if (monthsWorked < 12) {
      isEligible = false
      ineligibilityReason = `Para a primeira solicitação, a lei exige que você tenha trabalhado no mínimo 12 meses nos últimos 18 meses anteriores à data de demissão.`
    }
  } else if (requestNumber === 2) {
    minMonthsRequired = 9
    if (monthsWorked < 9) {
      isEligible = false
      ineligibilityReason = `Para a segunda solicitação, a lei exige que você tenha trabalhado no mínimo 9 meses nos últimos 12 meses anteriores à data de demissão.`
    }
  } else {
    minMonthsRequired = 6
    if (monthsWorked < 6) {
      isEligible = false
      ineligibilityReason = `Para a terceira solicitação em diante, a lei exige que você tenha trabalhado no mínimo 6 meses consecutivos anteriores à data de demissão.`
    }
  }

  // 2. Determinar Número de Parcelas se elegível
  let installmentsCount = 0
  if (isEligible) {
    if (requestNumber === 1) {
      if (monthsWorked >= 12 && monthsWorked <= 23) {
        installmentsCount = 4
      } else if (monthsWorked >= 24) {
        installmentsCount = 5
      }
    } else if (requestNumber === 2) {
      if (monthsWorked >= 9 && monthsWorked <= 11) {
        installmentsCount = 3
      } else if (monthsWorked >= 12 && monthsWorked <= 23) {
        installmentsCount = 4
      } else if (monthsWorked >= 24) {
        installmentsCount = 5
      }
    } else {
      // 3ª solicitação em diante
      if (monthsWorked >= 6 && monthsWorked <= 11) {
        installmentsCount = 3
      } else if (monthsWorked >= 12 && monthsWorked <= 23) {
        installmentsCount = 4
      } else if (monthsWorked >= 24) {
        installmentsCount = 5
      }
    }
  }

  // 3. Calcular Valor da Parcela com base na tabela de 2026
  let installmentValue = 0
  if (isEligible && averageSalary > 0) {
    // Tabela oficial de 2026:
    // Até R$ 2.222,17          -> Multiplica por 0,8
    // De R$ 2.222,18 a 3.703,99 -> O que exceder R$ 2.222,17 multiplica por 0,5 e soma R$ 1.777,74
    // Acima de R$ 3.703,99     -> Fixo de R$ 2.518,65 (teto)
    if (averageSalary <= 2222.17) {
      installmentValue = averageSalary * 0.8
    } else if (averageSalary <= 3703.99) {
      const excess = averageSalary - 2222.17
      installmentValue = 1777.74 + excess * 0.5
    } else {
      installmentValue = UNEMPLOYMENT_2026_TETO
    }

    // Garantia legal: o seguro não pode ser inferior ao salário mínimo de 2026
    if (installmentValue < WAGE_2026_MINIMUM) {
      installmentValue = WAGE_2026_MINIMUM
    }

    // E não pode ser superior ao teto
    if (installmentValue > UNEMPLOYMENT_2026_TETO) {
      installmentValue = UNEMPLOYMENT_2026_TETO
    }
  }

  const totalValue = installmentValue * installmentsCount

  return {
    isEligible,
    ineligibilityReason: isEligible ? undefined : ineligibilityReason,
    installmentsCount,
    installmentValue: isEligible ? Number(installmentValue.toFixed(2)) : 0,
    totalValue: isEligible ? Number(totalValue.toFixed(2)) : 0,
    minMonthsRequired,
  }
}
