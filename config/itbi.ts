// config/itbi.ts

export interface ITBICity {
  code: string
  name: string
  standardRate: number // Ex: 3 para 3%
  sfhRate: number // Ex: 0.5 para 0.5% sobre a parte financiada
  state: string
}

export const ITBI_CITIES: ITBICity[] = [
  { code: 'SP', name: 'São Paulo', standardRate: 3.0, sfhRate: 0.5, state: 'SP' },
  { code: 'RJ', name: 'Rio de Janeiro', standardRate: 3.0, sfhRate: 0.5, state: 'RJ' },
  { code: 'BH', name: 'Belo Horizonte', standardRate: 3.0, sfhRate: 0.5, state: 'MG' },
  { code: 'CT', name: 'Curitiba', standardRate: 2.7, sfhRate: 0.5, state: 'PR' },
  { code: 'PA', name: 'Porto Alegre', standardRate: 3.0, sfhRate: 0.5, state: 'RS' },
  { code: 'FL', name: 'Florianópolis', standardRate: 2.0, sfhRate: 0.5, state: 'SC' },
  { code: 'BS', name: 'Brasília (DF)', standardRate: 3.0, sfhRate: 0.5, state: 'DF' },
  { code: 'SV', name: 'Salvador', standardRate: 3.0, sfhRate: 0.5, state: 'BA' },
  { code: 'RF', name: 'Recife', standardRate: 3.0, sfhRate: 0.5, state: 'PE' },
  { code: 'FT', name: 'Fortaleza', standardRate: 2.0, sfhRate: 0.5, state: 'CE' },
  { code: 'GY', name: 'Goiânia', standardRate: 2.0, sfhRate: 0.5, state: 'GO' },
  { code: 'MN', name: 'Manaus', standardRate: 2.0, sfhRate: 0.5, state: 'AM' },
  { code: 'BL', name: 'Belém', standardRate: 2.0, sfhRate: 0.5, state: 'PA' },
]

export interface ITBICalculationInput {
  propertyValue: number
  paymentMethod: 'vista' | 'financiado'
  downPayment: number // Apenas se financiado
  cityCode: string // 'custom' para personalizado
  customStandardRate: number // Se cityCode === 'custom'
  isFirstProperty: boolean // Lei 6.015/73 - 50% de desconto no registro/escritura (se financiado SFH)
}

export interface ITBICalculationResult {
  propertyValue: number
  financedAmount: number
  ownFundsAmount: number
  
  // ITBI
  itbiRateStandard: number
  itbiRateSfh: number
  itbiTaxOnOwnFunds: number
  itbiTaxOnFinanced: number
  itbiTotal: number
  
  // Cartório
  escrituraCost: number // R$ 0 se financiado (o contrato tem força de escritura)
  registroCost: number
  cartorioTotal: number
  
  // Custos bancários (emissão do contrato se financiado)
  bankFee: number
  
  // Total Geral
  grandTotal: number
  totalPercentOfProperty: number
  
  // Economias obtidas
  escrituraSaved: boolean
  firstPropertyDiscountSaved: number
}

export function calculateITBIAndFees(input: ITBICalculationInput): ITBICalculationResult {
  const { propertyValue, paymentMethod, downPayment, cityCode, customStandardRate, isFirstProperty } = input
  
  const selectedCity = ITBI_CITIES.find(c => c.code === cityCode)
  const standardRate = selectedCity ? selectedCity.standardRate : customStandardRate
  const sfhRate = selectedCity ? selectedCity.sfhRate : 0.5
  
  let financedAmount = 0
  let ownFundsAmount = propertyValue
  
  if (paymentMethod === 'financiado') {
    financedAmount = Math.max(0, propertyValue - downPayment)
    ownFundsAmount = Math.min(propertyValue, downPayment)
  }
  
  // 1. Cálculo do ITBI
  let itbiTaxOnOwnFunds = ownFundsAmount * (standardRate / 100)
  let itbiTaxOnFinanced = 0
  
  if (paymentMethod === 'financiado' && financedAmount > 0) {
    // Alíquota reduzida incide sobre a parte financiada
    itbiTaxOnFinanced = financedAmount * (sfhRate / 100)
  }
  
  const itbiTotal = itbiTaxOnOwnFunds + itbiTaxOnFinanced
  
  // 2. Custos de Cartório (Escritura e Registro) - Estimativas médias de mercado
  // Se for financiado, o contrato de financiamento substitui a escritura de compra e venda (Lei 4.380/64). Escritura = 0!
  let escrituraCost = 0
  if (paymentMethod === 'vista') {
    // Média de 1% do valor do imóvel para a escritura de compra e venda
    escrituraCost = propertyValue * 0.01
    // Ajustes de limites médios nacionais
    escrituraCost = Math.max(1200, Math.min(9500, escrituraCost))
  }
  
  // Registro de Imóvel: Média de 0.5% do valor do imóvel
  let registroCost = propertyValue * 0.005
  registroCost = Math.max(800, Math.min(6000, registroCost))
  
  // 3. Desconto da Lei de Registros Públicos (Art. 290 da Lei 6.015/73)
  // 50% de desconto no registro e escritura para o primeiro imóvel financiado pelo SFH
  let firstPropertyDiscountSaved = 0
  if (isFirstProperty && paymentMethod === 'financiado') {
    const originalRegistro = registroCost
    registroCost = registroCost * 0.5
    firstPropertyDiscountSaved = originalRegistro - registroCost
  }
  
  const cartorioTotal = escrituraCost + registroCost
  
  // 4. Custos bancários de avaliação/emissão de contrato (se financiado)
  const bankFee = paymentMethod === 'financiado' ? 3200 : 0
  
  const grandTotal = itbiTotal + cartorioTotal + bankFee
  const totalPercentOfProperty = (grandTotal / propertyValue) * 100
  
  return {
    propertyValue,
    financedAmount,
    ownFundsAmount,
    itbiRateStandard: standardRate,
    itbiRateSfh: sfhRate,
    itbiTaxOnOwnFunds,
    itbiTaxOnFinanced,
    itbiTotal,
    escrituraCost,
    registroCost,
    cartorioTotal,
    bankFee,
    grandTotal,
    totalPercentOfProperty,
    escrituraSaved: paymentMethod === 'financiado',
    firstPropertyDiscountSaved,
  }
}
