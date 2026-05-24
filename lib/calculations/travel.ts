import { Destination, TravelStyle, TRAVEL_CONFIG } from '@/config/travel'

export interface TripCostInputs {
  destination: Destination
  travelers: number
  days: number
  style: TravelStyle
  exchangeRate: number
}

export interface TripCost {
  isDomestic: boolean
  subtotalUSD: number
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

export function calculateTripCost(inputs: TripCostInputs): TripCost {
  const { destination: dest, travelers, days, style, exchangeRate } = inputs
  const isDomestic = dest.region === 'brasil'

  const dailyCostUSD = dest.dailyCostUSD[style]
  const subtotalUSD = dailyCostUSD * days * travelers
  const flightBRL = dest.flightFromGRU.typical * travelers

  const iof = TRAVEL_CONFIG.iofCreditCard
  const spread = TRAVEL_CONFIG.bankSpreadEstimate
  const fintechFee = TRAVEL_CONFIG.fintechFeeEstimate

  // Domestic trips: everything in BRL, no IOF or fintech fee applies
  const baseCostBRL = subtotalUSD * exchangeRate
  const accommodationWithCard = isDomestic
    ? baseCostBRL
    : baseCostBRL * (1 + iof + spread)
  const accommodationWithFintech = isDomestic
    ? baseCostBRL
    : baseCostBRL * (1 + fintechFee)

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
