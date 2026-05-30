// config/miles.ts

export interface LoyaltyProgram {
  code: string
  name: string
  averageValuePerThousand: number // Valor médio real de mercado de 1.000 milhas/pontos (CPP)
  description: string
}

export const LOYALTY_PROGRAMS: LoyaltyProgram[] = [
  { 
    code: 'LATAM', 
    name: 'LATAM Pass', 
    averageValuePerThousand: 22.50, 
    description: 'Programa da LATAM Airlines. Milhas valorizadas, média de R$ 21,00 a R$ 24,00 por milhar.' 
  },
  { 
    code: 'SMILES', 
    name: 'Smiles (GOL)', 
    averageValuePerThousand: 16.50, 
    description: 'Programa da GOL Linhas Aéreas. Alta liquidez, valor comercial em torno de R$ 15,50 a R$ 18,00 por milhar.' 
  },
  { 
    code: 'AZUL', 
    name: 'TudoAzul', 
    averageValuePerThousand: 18.00, 
    description: 'Programa da Azul Linhas Aéreas. Valor médio comercial de R$ 17,00 a R$ 20,00 por milhar.' 
  },
  { 
    code: 'LIVELO', 
    name: 'Livelo (Pontos de Banco)', 
    averageValuePerThousand: 35.00, 
    description: 'Pontos Livelo (Bradesco/Banco do Brasil). Custam em média R$ 35,00 por milhar (puros), mas ganham valor se transferidos com bônus de 100% (onde o milhar equivalente passa a valer R$ 17,50).' 
  },
  { 
    code: 'ESFERA', 
    name: 'Esfera (Santander)', 
    averageValuePerThousand: 35.00, 
    description: 'Pontos Esfera do Santander. Padrão semelhante à Livelo, valorização máxima em promoções de transferência bonificada.' 
  },
]

export interface EmissionCalculationInput {
  priceInCash: number // Preço da passagem pagando em dinheiro
  milesRequired: number // Quantidade total de milhas exigidas para a passagem
  boardingTax: number // Taxa de embarque cobrada na emissão em milhas (em R$)
  programCode: string // Smiles, Latam, Azul, etc.
  customMileValue: number // Se programCode === 'custom'
}

export interface EmissionCalculationResult {
  priceInCash: number
  milesRequired: number
  boardingTax: number
  mileValueUsed: number
  
  // Resultados milhas
  milesConvertedToCash: number // Custo das milhas em R$
  totalMilesEmissionCost: number // Custo das milhas + taxas de embarque em R$
  
  // Comparativos
  cppOfEmission: number // Custo por Mil Milhas real gerado na passagem
  netSavings: number // Economia em R$
  percentSavings: number // Economia em %
  shouldEmitWithMiles: boolean // Veredito
}

export interface PurchaseCalculationInput {
  costOfPromotion: number // Custo total cobrado na promoção
  milesReceived: number // Quantidade total de milhas recebidas
  programCode: string
  customMileValue: number
}

export interface PurchaseCalculationResult {
  costOfPromotion: number
  milesReceived: number
  cppOfPurchase: number // Custo por 1.000 milhas da compra
  marketValuePerThousand: number // Valor real de mercado
  netLossOrGain: number // Prejuízo ou lucro por milhar
  percentDiff: number // Diferença percentual
  isWorthBuying: boolean // Veredito
}

// 1. Calcula se vale a pena Emitir Passagem em Milhas vs Dinheiro
export function calculateEmissionComparison(input: EmissionCalculationInput): EmissionCalculationResult {
  const { priceInCash, milesRequired, boardingTax, programCode, customMileValue } = input
  
  const selectedProgram = LOYALTY_PROGRAMS.find(p => p.code === programCode)
  const mileValueUsed = selectedProgram ? selectedProgram.averageValuePerThousand : customMileValue
  
  // Conversão de milhas para reais: (Milhas / 1000) * valor do milhar
  const milesConvertedToCash = (milesRequired / 1000) * mileValueUsed
  const totalMilesEmissionCost = milesConvertedToCash + boardingTax
  
  // Economias
  const netSavings = priceInCash - totalMilesEmissionCost
  const percentSavings = (netSavings / priceInCash) * 100
  
  // CPP da Emissão (Custo por Mil Milhas que a passagem está pagando pelas suas milhas):
  // (Preço em Dinheiro - Taxa de Embarque) / (Milhas Requeridas / 1000)
  let cppOfEmission = 0
  if (milesRequired > 0) {
    cppOfEmission = (priceInCash - boardingTax) / (milesRequired / 1000)
  }
  
  // Vale a pena emitir com milhas se o custo total em milhas for menor do que em dinheiro,
  // ou seja, se o CPP da passagem (o valor que a passagem está "comprando" suas milhas) for maior que o valor real de mercado delas.
  const shouldEmitWithMiles = totalMilesEmissionCost < priceInCash
  
  return {
    priceInCash,
    milesRequired,
    boardingTax,
    mileValueUsed,
    milesConvertedToCash,
    totalMilesEmissionCost,
    cppOfEmission,
    netSavings,
    percentSavings,
    shouldEmitWithMiles,
  }
}

// 2. Calcula se vale a pena Comprar Milhas em Promoções
export function calculatePurchaseComparison(input: PurchaseCalculationInput): PurchaseCalculationResult {
  const { costOfPromotion, milesReceived, programCode, customMileValue } = input
  
  const selectedProgram = LOYALTY_PROGRAMS.find(p => p.code === programCode)
  const marketValuePerThousand = selectedProgram ? selectedProgram.averageValuePerThousand : customMileValue
  
  // Custo por Mil Milhas da compra (CPP da Compra):
  // (Custo total / Milhas recebidas) * 1000
  let cppOfPurchase = 0
  if (milesReceived > 0) {
    cppOfPurchase = (costOfPromotion / milesReceived) * 1000
  }
  
  // Diferença em R$
  const netLossOrGain = marketValuePerThousand - cppOfPurchase
  const percentDiff = (netLossOrGain / marketValuePerThousand) * 100
  
  // Vale a pena comprar se o custo por milhar (CPP da compra) for menor do que o valor de mercado real dele
  const isWorthBuying = cppOfPurchase < marketValuePerThousand
  
  return {
    costOfPromotion,
    milesReceived,
    cppOfPurchase,
    marketValuePerThousand,
    netLossOrGain,
    percentDiff,
    isWorthBuying,
  }
}
