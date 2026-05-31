// config/uber-car.ts

export type CarSegment = 'popular' | 'medio' | 'suv' | 'premium'
export type CitySize   = 'interior' | 'capital_pequena' | 'capital_grande'
export type FuelType   = 'gasolina' | 'etanol' | 'eletrico'
export type CommuteMode =
  | 'tp_only'
  | 'uber_only'
  | 'mixed_tp_go_uber_back'
  | 'mixed_uber_go_tp_back'

export const SEGMENT_THRESHOLDS: Record<CarSegment, { min: number; max: number }> = {
  popular:  { min: 0,       max: 80_000 },
  medio:    { min: 80_000,  max: 130_000 },
  suv:      { min: 130_000, max: 250_000 },
  premium:  { min: 250_000, max: Infinity },
}

export function getSegment(carValue: number): CarSegment {
  for (const [seg, range] of Object.entries(SEGMENT_THRESHOLDS) as [CarSegment, { min: number; max: number }][]) {
    if (carValue >= range.min && carValue < range.max) return seg
  }
  return 'premium'
}

export const SEGMENT_LABELS: Record<CarSegment, string> = {
  popular: 'Popular',
  medio:   'Médio',
  suv:     'SUV / Premium',
  premium: 'Luxo',
}

export const SEGMENT_DEFAULTS: Record<CarSegment, {
  depreciationPct:  number
  insuranceAnnual:  Record<CitySize, number>
  maintenancePerKm: number
  fuelEfficiency:   number
}> = {
  popular: {
    depreciationPct:  18,
    insuranceAnnual:  { interior: 1_400, capital_pequena: 1_800, capital_grande: 2_400 },
    maintenancePerKm: 0.10,
    fuelEfficiency:   12,
  },
  medio: {
    depreciationPct:  15,
    insuranceAnnual:  { interior: 2_000, capital_pequena: 2_800, capital_grande: 3_600 },
    maintenancePerKm: 0.12,
    fuelEfficiency:   11,
  },
  suv: {
    depreciationPct:  20,
    insuranceAnnual:  { interior: 3_200, capital_pequena: 4_500, capital_grande: 5_800 },
    maintenancePerKm: 0.18,
    fuelEfficiency:   9,
  },
  premium: {
    depreciationPct:  12,
    insuranceAnnual:  { interior: 5_000, capital_pequena: 7_000, capital_grande: 9_500 },
    maintenancePerKm: 0.25,
    fuelEfficiency:   10,
  },
}

export const FUEL_PRICES: Record<FuelType, number> = {
  gasolina: 6.20,
  etanol:   4.80,
  eletrico: 0.10,
}

export const UBER_DEFAULTS = {
  pricePerKm:       2.00,
  baseFare:         3.00,
  tpTicketDefault:  4.40,
}

export const FIXED_CAR_DEFAULTS = {
  ipvaPct:          4.0,
  licensingAnnual:  180,
  washingMonthly:   100,
  tollPerKm:        0.02,
  workDaysPerMonth: 22,
}

export const FIRST_YEAR_DEPRECIATION_EXTRA = 8
