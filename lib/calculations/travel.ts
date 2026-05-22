import { Destination, TravelStyle, TRAVEL_CONFIG } from '@/config/travel'

export interface TripCostInputs {
  destination: Destination
  travelers: number
  days: number
  style: TravelStyle
  exchangeRate: number
}

export interface TripCost {
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
  const dailyCostUSD = dest.dailyCostUSD[style]
  const subtotalUSD = dailyCostUSD * days * travelers
  const flightBRL = dest.flightFromGRU.typical * travelers

  const iof = TRAVEL_CONFIG.iofCreditCard
  const spread = TRAVEL_CONFIG.bankSpreadEstimate
  const fintechFee = TRAVEL_CONFIG.fintechFeeEstimate

  const accommodationWithCard = subtotalUSD * exchangeRate * (1 + iof + spread)
  const accommodationWithFintech = subtotalUSD * exchangeRate * (1 + fintechFee)

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
    subtotalUSD,
    flightBRL,
    dailyCostUSD,
    iofAndSpreadBRL: accommodationWithCard - subtotalUSD * exchangeRate,
    fintechFeeBRL: accommodationWithFintech - subtotalUSD * exchangeRate,
    totalWithCard,
    totalWithFintech,
    savingsWithFintech,
    savingsPct: (savingsWithFintech / totalWithCard) * 100,
    visaCostBRL,
    grandTotalCard,
    grandTotalFintech,
    grandTotalFintechWithMargin,
  }
}
