import { Destination, TravelStyle, TRAVEL_CONFIG } from '@/config/travel'

export interface TripCostInputs {
  destination: Destination
  travelers: number
  days: number
  style: TravelStyle
  exchangeRate: number
  // Custom style overrides (bypass preset daily cost and flight)
  isCustom?: boolean
  customDailyBRL?: number      // daily cost per person in BRL (direct, no exchange rate)
  customFlightTotalBRL?: number // total round-trip flight for all travelers in BRL
}

export interface TripCost {
  isDomestic: boolean
  subtotalUSD: number
  accommodationUSD: number
  variableUSD: number
  flightBRL: number
  dailyCostUSD: number
  iofAndSpreadBRL: number
  fintechFeeBRL: number
  totalWithCard: number
  totalWithFintech: number
  savingsWithFintech: number
  savingsPct: number
  visaCostBRL: number
  grandTotalCard: number
  grandTotalFintech: number
  grandTotalFintechWithMargin: number
}

const CUSTOM_ACCOMMODATION_PCT = 0.45

export function calculateTripCost(inputs: TripCostInputs): TripCost {
  const { destination: dest, travelers, days, style, exchangeRate, isCustom, customDailyBRL, customFlightTotalBRL } = inputs
  const isDomestic = dest.region === 'brasil'

  let accommodationUSD: number
  let variableUSD: number
  let subtotalUSD: number
  let dailyCostUSD: number
  let flightBRL: number

  if (isCustom && customDailyBRL !== undefined) {
    // Custom mode: user-specified BRL amounts, back-convert to USD for display
    const accommodationBRL = customDailyBRL * CUSTOM_ACCOMMODATION_PCT * days
    const variableBRL = customDailyBRL * (1 - CUSTOM_ACCOMMODATION_PCT) * days * travelers
    accommodationUSD = accommodationBRL / exchangeRate
    variableUSD = variableBRL / exchangeRate
    subtotalUSD = accommodationUSD + variableUSD
    dailyCostUSD = customDailyBRL / exchangeRate
    flightBRL = customFlightTotalBRL ?? dest.flightFromGRU.typical * travelers
  } else {
    // Preset mode: destination daily costs in USD
    const dailyCost = dest.dailyCostUSD[style]
    const accommodationPct = TRAVEL_CONFIG.accommodationPct[style]
    accommodationUSD = dailyCost * accommodationPct * days
    variableUSD = dailyCost * (1 - accommodationPct) * days * travelers
    subtotalUSD = accommodationUSD + variableUSD
    dailyCostUSD = dailyCost
    flightBRL = dest.flightFromGRU.typical * travelers
  }

  const iof = TRAVEL_CONFIG.iofCreditCard
  const spread = TRAVEL_CONFIG.bankSpreadEstimate
  const fintechFee = TRAVEL_CONFIG.fintechFeeEstimate

  // Domestic trips: everything in BRL, no IOF or fintech fee applies
  const baseCostBRL = subtotalUSD * exchangeRate
  const accommodationWithCard = isDomestic ? baseCostBRL : baseCostBRL * (1 + iof + spread)
  const accommodationWithFintech = isDomestic ? baseCostBRL : baseCostBRL * (1 + fintechFee)

  const totalWithCard = accommodationWithCard + flightBRL
  const totalWithFintech = accommodationWithFintech + flightBRL
  const savingsWithFintech = totalWithCard - totalWithFintech

  const visaCostBRL = dest.visa.required
    ? (dest.visa.costUSD ?? 0) * exchangeRate * travelers
    : 0

  const grandTotalCard = totalWithCard + visaCostBRL
  const grandTotalFintech = totalWithFintech + visaCostBRL
  const grandTotalFintechWithMargin = grandTotalFintech * (1 + TRAVEL_CONFIG.safetyMargin)

  return {
    isDomestic,
    subtotalUSD,
    accommodationUSD,
    variableUSD,
    flightBRL,
    dailyCostUSD,
    iofAndSpreadBRL: isDomestic ? 0 : accommodationWithCard - baseCostBRL,
    fintechFeeBRL: isDomestic ? 0 : accommodationWithFintech - baseCostBRL,
    totalWithCard,
    totalWithFintech,
    savingsWithFintech,
    savingsPct: totalWithCard > 0 ? (savingsWithFintech / totalWithCard) * 100 : 0,
    visaCostBRL,
    grandTotalCard,
    grandTotalFintech,
    grandTotalFintechWithMargin,
  }
}
