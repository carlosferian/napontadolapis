// lib/calculations/uber-car.ts

import {
  CarSegment, CitySize, FuelType, CommuteMode,
  SEGMENT_DEFAULTS, FUEL_PRICES, FIXED_CAR_DEFAULTS,
  FIRST_YEAR_DEPRECIATION_EXTRA,
} from '@/config/uber-car'

// ── Interfaces ────────────────────────────────────────────────────────────

export interface CarParams {
  mode:              'buying' | 'owning'
  carValue:          number
  segment:           CarSegment
  citySize:          CitySize
  fuelType:          FuelType
  kmPerMonth:        number
  depreciationPct?:  number
  insuranceAnnual?:  number
  fuelEfficiency?:   number
  maintenancePerKm?: number
  ipvaPct?:          number
  parkingMonthly?:   number
  washingMonthly?:   number
  tollPerKm?:        number
  financed?:         boolean
  financedAmount?:   number
  financingRateAm?:  number
  financingMonths?:  number
}

export interface CommuteParams {
  distanceKm:       number
  workDaysPerMonth: number
  commuteMode:      CommuteMode
  tpTicketPrice:    number
  uberPricePerKm:   number
  uberBaseFare:     number
}

export interface ExtraTripsParams {
  tripsPerMonth:  number
  avgDistanceKm:  number
  uberPricePerKm: number
  uberBaseFare:   number
}

export interface CarMonthlyCosts {
  depreciation: number
  ipva:         number
  insurance:    number
  fuel:         number
  maintenance:  number
  parking:      number
  washing:      number
  licensing:    number
  toll:         number
  opportunity:  number
  financing:    number
  total:        number
}

export interface UberTpMonthlyCosts {
  commuteTP:   number
  commuteUber: number
  extraUber:   number
  total:       number
}

export interface UberCarResult {
  carMonthly:    CarMonthlyCosts
  uberTpMonthly: UberTpMonthlyCosts
  monthlyDiff:   number
  winner:        'car' | 'uber_tp' | 'tie'
  breakEvenKm:   number
  userKm:        number
  breakEvenChart: { km: number; carCost: number; uberCost: number }[]
  fiveYear: {
    totalCar:       number
    totalUberTP:    number
    residualValue:  number
    netCarCost:     number
    selicGainTotal: number
  }
}

// ── Função principal ──────────────────────────────────────────────────────

export function calculateUberVsCar(
  car: CarParams,
  commute: CommuteParams,
  extra: ExtraTripsParams,
  selicAnnual: number,
  inflationAnnual: number = 0.05
): UberCarResult {
  const seg = car.segment
  const city = car.citySize
  const ft = car.fuelType
  const { carValue, kmPerMonth } = car

  // Resolve overrides or use segment defaults
  const deprPctBase = car.depreciationPct ?? SEGMENT_DEFAULTS[seg].depreciationPct
  const deprPct = car.mode === 'buying'
    ? deprPctBase + FIRST_YEAR_DEPRECIATION_EXTRA
    : deprPctBase

  const insurance = car.insuranceAnnual   ?? SEGMENT_DEFAULTS[seg].insuranceAnnual[city]
  let   fuelEff   = car.fuelEfficiency    ?? SEGMENT_DEFAULTS[seg].fuelEfficiency
  let   maintKm   = car.maintenancePerKm  ?? SEGMENT_DEFAULTS[seg].maintenancePerKm
  const ipvaPct   = car.ipvaPct           ?? FIXED_CAR_DEFAULTS.ipvaPct
  const parking   = car.parkingMonthly    ?? 0
  const washing   = car.washingMonthly    ?? FIXED_CAR_DEFAULTS.washingMonthly
  const toll      = car.tollPerKm         ?? FIXED_CAR_DEFAULTS.tollPerKm

  // Electric car adjustments
  if (ft === 'eletrico') {
    maintKm = maintKm * 0.60
    fuelEff = 1
  }

  // Fuel cost per km
  const fuelPricePerKm = ft === 'eletrico'
    ? FUEL_PRICES.eletrico
    : FUEL_PRICES[ft] / fuelEff

  // Monthly fixed costs
  const depreciation = carValue * deprPct    / 100 / 12
  const ipvaMonthly  = carValue * ipvaPct    / 100 / 12
  const insuranceMo  = insurance / 12
  const licensingMo  = FIXED_CAR_DEFAULTS.licensingAnnual / 12
  const opportunity  = carValue * selicAnnual / 12

  // Monthly variable costs
  const fuelMonthly  = kmPerMonth * fuelPricePerKm
  const maintMonthly = kmPerMonth * maintKm
  const tollMonthly  = kmPerMonth * toll

  // Financing — pure interest cost
  let financing = 0
  if (car.financed && car.financedAmount && car.financingRateAm && car.financingMonths) {
    const r = car.financingRateAm / 100
    const n = car.financingMonths
    const installment  = car.financedAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const amortization = car.financedAmount / n
    financing = Math.max(0, installment - amortization)
  }

  const carTotal =
    depreciation + ipvaMonthly + insuranceMo + fuelMonthly +
    maintMonthly + parking + washing + licensingMo + tollMonthly +
    opportunity + financing

  const carMonthly: CarMonthlyCosts = {
    depreciation, ipva: ipvaMonthly, insurance: insuranceMo,
    fuel: fuelMonthly, maintenance: maintMonthly, parking, washing,
    licensing: licensingMo, toll: tollMonthly, opportunity, financing,
    total: carTotal,
  }

  // Uber+TP costs
  const { distanceKm, workDaysPerMonth, commuteMode, tpTicketPrice } = commute
  const { uberPricePerKm, uberBaseFare } = commute

  const uberTripsCommute = (() => {
    switch (commuteMode) {
      case 'tp_only':               return 0
      case 'uber_only':             return workDaysPerMonth * 2
      case 'mixed_tp_go_uber_back': return workDaysPerMonth
      case 'mixed_uber_go_tp_back': return workDaysPerMonth
      default:                      return workDaysPerMonth
    }
  })()
  const tpTripsCommute = workDaysPerMonth * 2 - uberTripsCommute

  const commuteTP   = tpTripsCommute  * tpTicketPrice
  const commuteUber = uberTripsCommute * (distanceKm * uberPricePerKm + uberBaseFare)
  const extraUber   = extra.tripsPerMonth * (extra.avgDistanceKm * extra.uberPricePerKm + extra.uberBaseFare)
  const uberTpTotal = commuteTP + commuteUber + extraUber

  const uberTpMonthly: UberTpMonthlyCosts = { commuteTP, commuteUber, extraUber, total: uberTpTotal }

  const monthlyDiff = carTotal - uberTpTotal
  const winner: UberCarResult['winner'] =
    Math.abs(monthlyDiff) < 50 ? 'tie'
    : monthlyDiff > 0           ? 'uber_tp'
    : 'car'

  // Break-even
  const fixedCar      = depreciation + ipvaMonthly + insuranceMo + parking + washing + licensingMo + opportunity + financing
  const varCarPerKm   = fuelPricePerKm + maintKm + toll
  const avgTripDist   = extra.avgDistanceKm > 0 ? extra.avgDistanceKm : 8
  const effectiveUPKm = uberPricePerKm + (uberBaseFare / avgTripDist)
  const tpFixed       = commuteTP

  const breakEvenKm = effectiveUPKm > varCarPerKm
    ? Math.max(0, (fixedCar - tpFixed) / (effectiveUPKm - varCarPerKm))
    : Infinity

  const breakEvenChart = Array.from({ length: 21 }, (_, i) => {
    const km = i * 250
    return {
      km,
      carCost:  Math.round(fixedCar + varCarPerKm * km),
      uberCost: Math.round(effectiveUPKm * km + tpFixed),
    }
  })

  // 5-year projection
  let totalCar5y    = 0
  let totalUberTP5y = 0
  let currentVal    = carValue

  for (let year = 1; year <= 5; year++) {
    const annualDepr = currentVal * deprPct / 100
    currentVal      -= annualDepr

    const yearCar =
      annualDepr +
      currentVal * ipvaPct / 100 +
      insurance +
      FIXED_CAR_DEFAULTS.licensingAnnual +
      (parking + washing) * 12 +
      kmPerMonth * 12 * (fuelPricePerKm + maintKm + toll) +
      currentVal * selicAnnual +
      financing * 12

    totalCar5y += yearCar

    const yearInfl = Math.pow(1 + inflationAnnual, year - 1)
    totalUberTP5y += uberTpTotal * 12 * yearInfl
  }

  const residualValue  = Math.max(0, currentVal)
  const netCarCost     = totalCar5y - residualValue
  const selicGainTotal = carValue * (Math.pow(1 + selicAnnual, 5) - 1)

  return {
    carMonthly,
    uberTpMonthly,
    monthlyDiff,
    winner,
    breakEvenKm,
    userKm: kmPerMonth,
    breakEvenChart,
    fiveYear: {
      totalCar:       Math.round(totalCar5y),
      totalUberTP:    Math.round(totalUberTP5y),
      residualValue:  Math.round(residualValue),
      netCarCost:     Math.round(netCarCost),
      selicGainTotal: Math.round(selicGainTotal),
    },
  }
}
