# Uber vs. Carro Próprio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a calculadora `/trabalho/uber-vs-carro` que compara o custo real de ter um carro próprio vs. Uber+TP, com breakdown mensal, ponto de equilíbrio em km/mês e projeção de 5 anos incluindo custo de oportunidade.

**Architecture:** Quatro arquivos novos (config, calculation, component, page) + dois arquivos existentes modificados (Nav, sitemap). A lógica de cálculo é puramente funcional em `lib/calculations/uber-car.ts`, consumida pelo componente React via `useMemo`. O componente segue o padrão de duas colunas do projeto.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Recharts (LineChart para break-even), Lucide React, `config/rates.ts` para Selic.

---

## File Map

| Arquivo | Ação | Responsabilidade |
|---------|------|-----------------|
| `config/uber-car.ts` | **Criar** | Tipos, defaults por segmento, preços referência |
| `lib/calculations/uber-car.ts` | **Criar** | Função pura `calculateUberVsCar()` |
| `components/calculators/UberCarCalculator.tsx` | **Criar** | Componente React com todos os inputs e resultados |
| `app/trabalho/uber-vs-carro/page.tsx` | **Criar** | Metadata Next.js + header editorial |
| `components/Nav.tsx` | **Modificar** | Adicionar link em `workItems` |
| `app/sitemap.ts` | **Modificar** | Adicionar rota `/trabalho/uber-vs-carro` |

---

## Task 1: `config/uber-car.ts`

**Files:**
- Create: `config/uber-car.ts`

- [ ] **1.1 — Criar o arquivo de configuração**

```typescript
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
  depreciationPct:  number               // % a.a.
  insuranceAnnual:  Record<CitySize, number>
  maintenancePerKm: number               // R$/km
  fuelEfficiency:   number               // km/l (gasolina/etanol)
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

// Preços de combustível — média nacional mai/2026
export const FUEL_PRICES: Record<FuelType, number> = {
  gasolina: 6.20,   // R$/l
  etanol:   4.80,   // R$/l
  eletrico: 0.10,   // R$/km (custo médio de recarga)
}

export const UBER_DEFAULTS = {
  pricePerKm:       2.00,   // R$/km — UberX média nacional
  baseFare:         3.00,   // R$ por corrida
  tpTicketDefault:  4.40,   // R$ — referência tarifa SP
}

export const FIXED_CAR_DEFAULTS = {
  ipvaPct:          4.0,    // % a.a. — padrão nacional
  licensingAnnual:  180,    // R$/ano — DUT + taxas
  washingMonthly:   100,    // R$/mês
  tollPerKm:        0.02,   // R$/km (estimativa conservadora)
  workDaysPerMonth: 22,
}

// Fator extra de depreciação no 1º ano para quem está avaliando COMPRAR
// (saída da concessionária + registro + emplacamento queimam ~8% adicionais)
export const FIRST_YEAR_DEPRECIATION_EXTRA = 8  // %
```

- [ ] **1.2 — Verificar TypeScript**

```powershell
cd "E:\cursos\napontadolapis"
npx tsc --noEmit 2>&1 | Select-String "error" | Select-Object -First 5
```

Esperado: sem erros.

- [ ] **1.3 — Commit**

```bash
git add config/uber-car.ts
git commit -m "feat(uber-vs-carro): add config with segment defaults and fuel prices"
```

---

## Task 2: `lib/calculations/uber-car.ts`

**Files:**
- Create: `lib/calculations/uber-car.ts`

- [ ] **2.1 — Criar o arquivo de cálculo completo**

```typescript
// lib/calculations/uber-car.ts

import {
  CarSegment, CitySize, FuelType, CommuteMode,
  SEGMENT_DEFAULTS, FUEL_PRICES, FIXED_CAR_DEFAULTS,
  FIRST_YEAR_DEPRECIATION_EXTRA,
} from '@/config/uber-car'

// ── Interfaces ────────────────────────────────────────────────────────────

export interface CarParams {
  mode:              'buying' | 'owning'  // comprar vs. já tem
  carValue:          number
  segment:           CarSegment
  citySize:          CitySize
  fuelType:          FuelType
  kmPerMonth:        number
  // Overrides (modo avançado — usa defaults se undefined)
  depreciationPct?:  number
  insuranceAnnual?:  number
  fuelEfficiency?:   number
  maintenancePerKm?: number
  ipvaPct?:          number
  parkingMonthly?:   number
  washingMonthly?:   number
  tollPerKm?:        number
  // Financiamento
  financed?:         boolean
  financedAmount?:   number
  financingRateAm?:  number   // % a.m.
  financingMonths?:  number
}

export interface CommuteParams {
  distanceKm:       number   // km (só ida)
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
  commuteTP:  number
  commuteUber: number
  extraUber:  number
  total:      number
}

export interface UberCarResult {
  carMonthly:    CarMonthlyCosts
  uberTpMonthly: UberTpMonthlyCosts
  monthlyDiff:   number             // carTotal - uberTpTotal (positivo = carro mais caro)
  winner:        'car' | 'uber_tp' | 'tie'
  breakEvenKm:   number             // Infinity se carro sempre mais caro
  userKm:        number
  breakEvenChart: { km: number; carCost: number; uberCost: number }[]
  fiveYear: {
    totalCar:      number
    totalUberTP:   number
    residualValue: number
    netCarCost:    number
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
  const seg      = car.segment
  const city     = car.citySize
  const ft       = car.fuelType
  const { carValue, kmPerMonth } = car

  // ── Resolve overrides ou defaults do segmento ──
  const deprPctBase = car.depreciationPct ?? SEGMENT_DEFAULTS[seg].depreciationPct
  // No modo "comprar", 1º ano tem ~8% extra de depreciação (saída da concessionária)
  const deprPct  = car.mode === 'buying'
    ? deprPctBase + FIRST_YEAR_DEPRECIATION_EXTRA
    : deprPctBase

  const insurance = car.insuranceAnnual   ?? SEGMENT_DEFAULTS[seg].insuranceAnnual[city]
  let   fuelEff   = car.fuelEfficiency    ?? SEGMENT_DEFAULTS[seg].fuelEfficiency
  let   maintKm   = car.maintenancePerKm  ?? SEGMENT_DEFAULTS[seg].maintenancePerKm
  const ipvaPct   = car.ipvaPct           ?? FIXED_CAR_DEFAULTS.ipvaPct
  const parking   = car.parkingMonthly    ?? 0
  const washing   = car.washingMonthly    ?? FIXED_CAR_DEFAULTS.washingMonthly
  const toll      = car.tollPerKm         ?? FIXED_CAR_DEFAULTS.tollPerKm

  // Ajustes para elétrico: manutenção cai 40%, fuelEfficiency não se aplica
  if (ft === 'eletrico') {
    maintKm = maintKm * 0.60
    fuelEff = 1  // irrelevante — custo de energia = km × R$0.10
  }

  // ── Custo de combustível por km ──
  const fuelPricePerKm = ft === 'eletrico'
    ? FUEL_PRICES.eletrico
    : FUEL_PRICES[ft] / fuelEff

  // ── Custos fixos mensais ──
  const depreciation = carValue * deprPct    / 100 / 12
  const ipvaMonthly  = carValue * ipvaPct    / 100 / 12
  const insuranceMo  = insurance / 12
  const licensingMo  = FIXED_CAR_DEFAULTS.licensingAnnual / 12
  const opportunity  = carValue * selicAnnual / 12

  // ── Custos variáveis mensais ──
  const fuelMonthly  = kmPerMonth * fuelPricePerKm
  const maintMonthly = kmPerMonth * maintKm
  const tollMonthly  = kmPerMonth * toll

  // ── Financiamento (juros puros) ──
  let financing = 0
  if (car.financed && car.financedAmount && car.financingRateAm && car.financingMonths) {
    const r = car.financingRateAm / 100
    const n = car.financingMonths
    const installment   = car.financedAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const amortization  = car.financedAmount / n
    financing           = Math.max(0, installment - amortization)
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

  // ── Custos Uber+TP ──
  const { distanceKm, workDaysPerMonth, commuteMode, tpTicketPrice } = commute
  const { uberPricePerKm, uberBaseFare } = commute

  const uberTripsCommute = (() => {
    switch (commuteMode) {
      case 'tp_only':                return 0
      case 'uber_only':              return workDaysPerMonth * 2
      case 'mixed_tp_go_uber_back':  return workDaysPerMonth      // só volta
      case 'mixed_uber_go_tp_back':  return workDaysPerMonth      // só ida
      default:                       return workDaysPerMonth
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
    : monthlyDiff > 0          ? 'uber_tp'
    : 'car'

  // ── Break-even ──
  // Car cost(km)   = fixedCar + variableCarPerKm × km
  // Uber cost(km)  = effectiveUberPerKm × km + tpFixed
  const fixedCar       = depreciation + ipvaMonthly + insuranceMo + parking + washing + licensingMo + opportunity + financing
  const varCarPerKm    = fuelPricePerKm + maintKm + toll
  const avgTripDist    = extra.avgDistanceKm > 0 ? extra.avgDistanceKm : 8
  const effectiveUPKm  = uberPricePerKm + (uberBaseFare / avgTripDist)
  const tpFixed        = commuteTP

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

  // ── Projeção 5 anos ──
  let totalCar5y   = 0
  let totalUberTP5y = 0
  let currentVal   = carValue
  const monthlyUberTP = uberTpTotal

  for (let year = 1; year <= 5; year++) {
    const annualDepr  = currentVal * deprPct / 100
    currentVal       -= annualDepr

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
    totalUberTP5y += monthlyUberTP * 12 * yearInfl
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
      totalCar:      Math.round(totalCar5y),
      totalUberTP:   Math.round(totalUberTP5y),
      residualValue: Math.round(residualValue),
      netCarCost:    Math.round(netCarCost),
      selicGainTotal: Math.round(selicGainTotal),
    },
  }
}
```

- [ ] **2.2 — Verificar TypeScript**

```powershell
npx tsc --noEmit 2>&1 | Select-String "error" | Select-Object -First 5
```

Esperado: sem erros.

- [ ] **2.3 — Commit**

```bash
git add lib/calculations/uber-car.ts
git commit -m "feat(uber-vs-carro): add calculateUberVsCar with TCO, break-even and 5-year projection"
```

---

## Task 3: `components/calculators/UberCarCalculator.tsx`

**Files:**
- Create: `components/calculators/UberCarCalculator.tsx`

- [ ] **3.1 — Criar o componente completo**

```tsx
'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { ResultHero }     from '@/components/ui/ResultHero'
import { MetricGrid }     from '@/components/ui/MetricGrid'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareButtons }   from '@/components/ui/ShareButtons'
import { ShareCardBase }  from '@/components/share/ShareCard'
import { ScaledPreview }  from '@/components/ui/ScaledPreview'
import { formatBRL }      from '@/lib/formatters'
import { RATES }          from '@/config/rates'
import {
  getSegment, SEGMENT_LABELS, SEGMENT_DEFAULTS, UBER_DEFAULTS,
  FIXED_CAR_DEFAULTS, FuelType, CitySize, CommuteMode,
} from '@/config/uber-car'
import { calculateUberVsCar, CarParams, CommuteParams, ExtraTripsParams } from '@/lib/calculations/uber-car'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { ChevronDown, ChevronUp, Car, TrendingDown, Info } from 'lucide-react'

// ── Helpers ──────────────────────────────────────────────────────────────

function parseBRL(v: string): number {
  const c = v.replace(/\D/g, '')
  return c === '' ? 0 : parseInt(c, 10)
}

// ── Componente ─────────────────────────────────────────────────────────── 

export function UberCarCalculator() {
  // Contexto
  const [mode, setMode] = useState<'buying' | 'owning'>('buying')

  // Carro — básico
  const [carValue,   setCarValue]   = useState(90_000)
  const [citySize,   setCitySize]   = useState<CitySize>('capital_grande')
  const [fuelType,   setFuelType]   = useState<FuelType>('gasolina')

  // Carro — avançado
  const [showAdvanced,     setShowAdvanced]     = useState(false)
  const [customDepr,       setCustomDepr]       = useState<number | null>(null)
  const [customIpva,       setCustomIpva]       = useState<number | null>(null)
  const [customInsurance,  setCustomInsurance]  = useState<number | null>(null)
  const [customFuelEff,    setCustomFuelEff]    = useState<number | null>(null)
  const [customMaintKm,    setCustomMaintKm]    = useState<number | null>(null)
  const [parkingMonthly,   setParkingMonthly]   = useState(0)
  const [washingMonthly,   setWashingMonthly]   = useState(100)

  // Financiamento
  const [financed,         setFinanced]         = useState(false)
  const [financedAmount,   setFinancedAmount]   = useState(50_000)
  const [financingRateAm,  setFinancingRateAm]  = useState(1.49)
  const [financingMonths,  setFinancingMonths]  = useState(48)

  // Commute
  const [commuteDistKm,    setCommuteDistKm]    = useState(15)
  const [workDays,         setWorkDays]         = useState(22)
  const [commuteMode,      setCommuteMode]      = useState<CommuteMode>('mixed_tp_go_uber_back')
  const [tpTicket,         setTpTicket]         = useState(UBER_DEFAULTS.tpTicketDefault)
  const [uberPricePerKm,   setUberPricePerKm]   = useState(UBER_DEFAULTS.pricePerKm)
  const [uberBaseFare,     setUberBaseFare]     = useState(UBER_DEFAULTS.baseFare)

  // Extra trips
  const [extraTrips,       setExtraTrips]       = useState(8)
  const [extraDistKm,      setExtraDistKm]      = useState(8)

  // Derived
  const segment  = useMemo(() => getSegment(carValue), [carValue])
  const segDef   = useMemo(() => SEGMENT_DEFAULTS[segment], [segment])

  const kmPerMonth = useMemo(
    () => commuteDistKm * 2 * workDays + extraTrips * extraDistKm,
    [commuteDistKm, workDays, extraTrips, extraDistKm]
  )

  const results = useMemo(() => {
    const carParams: CarParams = {
      mode, carValue, segment, citySize, fuelType, kmPerMonth,
      depreciationPct:  customDepr       ?? undefined,
      insuranceAnnual:  customInsurance  ?? undefined,
      fuelEfficiency:   customFuelEff    ?? undefined,
      maintenancePerKm: customMaintKm    ?? undefined,
      ipvaPct:          customIpva       ?? undefined,
      parkingMonthly, washingMonthly,
      financed, financedAmount, financingRateAm, financingMonths,
    }
    const commuteParams: CommuteParams = {
      distanceKm: commuteDistKm, workDaysPerMonth: workDays,
      commuteMode, tpTicketPrice: tpTicket,
      uberPricePerKm, uberBaseFare,
    }
    const extraParams: ExtraTripsParams = {
      tripsPerMonth: extraTrips, avgDistanceKm: extraDistKm,
      uberPricePerKm, uberBaseFare,
    }
    return calculateUberVsCar(carParams, commuteParams, extraParams, RATES.selic)
  }, [
    mode, carValue, segment, citySize, fuelType, kmPerMonth,
    customDepr, customInsurance, customFuelEff, customMaintKm, customIpva,
    parkingMonthly, washingMonthly,
    financed, financedAmount, financingRateAm, financingMonths,
    commuteDistKm, workDays, commuteMode, tpTicket, uberPricePerKm, uberBaseFare,
    extraTrips, extraDistKm,
  ])

  // Breakdown do custo do carro — top items ordenados por magnitude
  const costBreakdown = useMemo(() => {
    const cm = results.carMonthly
    return [
      { label: 'Depreciação',       val: cm.depreciation },
      { label: 'Custo de Oportunidade', val: cm.opportunity },
      { label: 'Seguro',            val: cm.insurance },
      { label: 'Combustível',       val: cm.fuel },
      { label: 'Manutenção',        val: cm.maintenance },
      { label: 'IPVA',              val: cm.ipva },
      { label: 'Financiamento',     val: cm.financing },
      { label: 'Estacionamento',    val: cm.parking },
      { label: 'Lavagem/misc',      val: cm.washing },
      { label: 'Licenciamento',     val: cm.licensing },
      { label: 'Pedágios',          val: cm.toll },
    ]
      .filter(i => i.val > 0)
      .sort((a, b) => b.val - a.val)
  }, [results.carMonthly])

  const heroColorClass = results.winner === 'car' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
  const showTpInput    = commuteMode !== 'uber_only'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">

      {/* ── COLUNA ESQUERDA ──────────────────────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">

        {/* Toggle Comprar vs. Manter */}
        <div className="rounded-2xl border p-1.5 flex gap-1" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}>
          {(['buying', 'owning'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              style={mode === m
                ? { background: 'var(--c-card-calm)', border: '1px solid var(--c-line)', color: 'var(--c-ink)', boxShadow: 'var(--c-shadow-card)' }
                : { color: 'var(--c-muted)', border: '1px solid transparent' }
              }
            >
              {m === 'buying' ? '🚗 Avalio COMPRAR um carro' : '🔑 Já TENHO um carro'}
            </button>
          ))}
        </div>

        {/* Card: Sobre o Carro */}
        <CalculatorCard title="Sobre o Carro" subtitle="Informe o valor e as condições de uso. O sistema preenche os demais custos automaticamente.">

          {/* Valor do carro */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>Valor do carro</label>
              <div className="flex items-center gap-2">
                <div
                  className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--c-emerald-soft)', color: 'var(--c-emerald)' }}
                >
                  {SEGMENT_LABELS[segment]}
                </div>
                <div className="relative w-40">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                  <input
                    type="text" inputMode="numeric"
                    value={carValue === 0 ? '' : carValue.toLocaleString('pt-BR')}
                    onChange={e => setCarValue(Math.min(2_000_000, parseBRL(e.target.value)))}
                    className="w-full text-right border rounded-xl pr-3 pl-8 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums bg-transparent"
                    style={{ color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
                  />
                </div>
              </div>
            </div>
            <input type="range" min={20_000} max={400_000} step={5_000}
              value={Math.min(400_000, carValue)}
              onChange={e => setCarValue(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 20k</span><span>R$ 400k</span>
            </div>
          </div>

          {/* Cidade */}
          <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <label className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>Porte da cidade</label>
            <div className="grid grid-cols-3 gap-1.5">
              {([['interior', 'Interior'], ['capital_pequena', 'Capital pequena'], ['capital_grande', 'Capital grande']] as [CitySize, string][]).map(([v, label]) => (
                <button key={v} onClick={() => setCitySize(v)}
                  className="py-2 rounded-lg text-xs font-bold border cursor-pointer transition-all"
                  style={citySize === v
                    ? { background: 'var(--c-emerald)', color: '#fff', borderColor: 'transparent' }
                    : { background: 'var(--c-surface)', color: 'var(--c-muted)', borderColor: 'var(--c-line)' }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Combustível */}
          <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <label className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>Combustível</label>
            <div className="grid grid-cols-3 gap-1.5">
              {([['gasolina', '⛽ Gasolina'], ['etanol', '🌿 Etanol'], ['eletrico', '🔌 Elétrico']] as [FuelType, string][]).map(([v, label]) => (
                <button key={v} onClick={() => setFuelType(v)}
                  className="py-2 rounded-lg text-xs font-bold border cursor-pointer transition-all"
                  style={fuelType === v
                    ? { background: 'var(--c-emerald)', color: '#fff', borderColor: 'transparent' }
                    : { background: 'var(--c-surface)', color: 'var(--c-muted)', borderColor: 'var(--c-line)' }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Personalizar custos — acordeão */}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <button
              onClick={() => setShowAdvanced(v => !v)}
              className="flex items-center gap-2 text-xs font-bold cursor-pointer hover:opacity-70 transition-opacity w-full text-left"
              style={{ color: 'var(--c-muted)' }}
            >
              {showAdvanced ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
              {showAdvanced ? 'Ocultar custos personalizados' : '▼ Personalizar custos do carro'}
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-3">

                {/* Depreciação */}
                <SliderRow
                  label="Depreciação"
                  value={customDepr ?? segDef.depreciationPct}
                  unit="% a.a."
                  min={3} max={35} step={0.5}
                  onChange={setCustomDepr}
                  tip={`Default do segmento: ${segDef.depreciationPct}%`}
                />

                {/* IPVA */}
                <SliderRow
                  label="IPVA"
                  value={customIpva ?? FIXED_CAR_DEFAULTS.ipvaPct}
                  unit="% a.a."
                  min={2} max={5} step={0.5}
                  onChange={setCustomIpva}
                  tip="SP: 4% | PR: 3.5% | RS: 3%"
                />

                {/* Seguro anual */}
                <SliderRow
                  label="Seguro anual"
                  value={customInsurance ?? segDef.insuranceAnnual[citySize]}
                  unit="R$/ano"
                  min={500} max={20_000} step={100}
                  onChange={setCustomInsurance}
                  tip={`Estimado para ${citySize} + segmento`}
                  isCurrency
                />

                {/* Consumo */}
                {fuelType !== 'eletrico' && (
                  <SliderRow
                    label="Consumo médio"
                    value={customFuelEff ?? segDef.fuelEfficiency}
                    unit="km/l"
                    min={5} max={25} step={0.5}
                    onChange={setCustomFuelEff}
                    tip={`Default: ${segDef.fuelEfficiency} km/l`}
                  />
                )}

                {/* Manutenção por km */}
                <SliderRow
                  label="Manutenção"
                  value={customMaintKm ?? segDef.maintenancePerKm}
                  unit="R$/km"
                  min={0.03} max={0.60} step={0.01}
                  onChange={setCustomMaintKm}
                  tip="Inclui óleo, pneus, pastilhas, revisões amortizados"
                />

                {/* Estacionamento */}
                <SliderRow
                  label="Estacionamento"
                  value={parkingMonthly}
                  unit="R$/mês"
                  min={0} max={1_500} step={50}
                  onChange={setParkingMonthly}
                  tip="Mensalista ou estimativa mensal de rotativo"
                  isCurrency
                />

                {/* Lavagem */}
                <SliderRow
                  label="Lavagem/misc"
                  value={washingMonthly}
                  unit="R$/mês"
                  min={0} max={400} step={20}
                  onChange={setWashingMonthly}
                  isCurrency
                />

                {/* Financiamento */}
                <div className="pt-2 border-t space-y-2" style={{ borderColor: 'var(--c-line)' }}>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold" style={{ color: 'var(--c-muted)' }}>
                    <input type="checkbox" checked={financed} onChange={e => setFinanced(e.target.checked)} className="rounded" />
                    Carro financiado
                  </label>
                  {financed && (
                    <div className="space-y-2 pl-4">
                      <SliderRow label="Valor financiado" value={financedAmount} unit="R$" min={5_000} max={300_000} step={5_000} onChange={setFinancedAmount} isCurrency />
                      <SliderRow label="Taxa de juros" value={financingRateAm} unit="% a.m." min={0.5} max={4} step={0.1} onChange={setFinancingRateAm} />
                      <SliderRow label="Prazo" value={financingMonths} unit="meses" min={12} max={84} step={6} onChange={setFinancingMonths} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CalculatorCard>

        {/* Card: Seus Deslocamentos */}
        <CalculatorCard title="Seus Deslocamentos" subtitle="Como você vai se locomover sem o carro? Separe o commute do trabalho das outras viagens.">

          {/* Distância commute */}
          <SliderRow
            label="Distância casa-trabalho (ida)"
            value={commuteDistKm}
            unit="km"
            min={1} max={60} step={1}
            onChange={setCommuteDistKm}
            tip="Só um sentido — o sistema calcula ida + volta"
          />

          {/* Dias trabalhados */}
          <SliderRow
            label="Dias trabalhados/mês"
            value={workDays}
            unit="dias"
            min={10} max={25} step={1}
            onChange={setWorkDays}
          />

          {/* Modo de commute */}
          <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <label className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>Modo de transporte no commute</label>
            <div className="grid grid-cols-2 gap-1.5">
              {([
                ['tp_only', '🚌 Só TP'],
                ['uber_only', '🚗 Só Uber'],
                ['mixed_tp_go_uber_back', '🚌→🚗 TP na ida'],
                ['mixed_uber_go_tp_back', '🚗→🚌 Uber na ida'],
              ] as [CommuteMode, string][]).map(([v, label]) => (
                <button key={v} onClick={() => setCommuteMode(v)}
                  className="py-2 rounded-lg text-xs font-bold border cursor-pointer transition-all text-center"
                  style={commuteMode === v
                    ? { background: 'var(--c-emerald)', color: '#fff', borderColor: 'transparent' }
                    : { background: 'var(--c-surface)', color: 'var(--c-muted)', borderColor: 'var(--c-line)' }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tarifa TP */}
          {showTpInput && (
            <SliderRow
              label="Tarifa do TP (ônibus/metrô)"
              value={tpTicket}
              unit="R$/viagem"
              min={2} max={10} step={0.10}
              onChange={setTpTicket}
              tip="Tarifa por passagem — cada viagem conta separadamente"
            />
          )}

          {/* Preço Uber por km */}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <SliderRow
              label="Preço Uber/km"
              value={uberPricePerKm}
              unit="R$/km"
              min={1.00} max={4.00} step={0.10}
              onChange={setUberPricePerKm}
              tip="UberX média nacional: R$2,00. Capitais: R$2,20–2,80"
            />
          </div>

          {/* Outras viagens */}
          <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Outras viagens de Uber/mês</p>
            <SliderRow label="Número de viagens" value={extraTrips} unit="viagens" min={0} max={40} step={1} onChange={setExtraTrips} />
            <SliderRow label="Distância média" value={extraDistKm} unit="km" min={1} max={40} step={1} onChange={setExtraDistKm} />
          </div>
        </CalculatorCard>
      </div>

      {/* ── COLUNA DIREITA ────────────────────────────────────────────── */}
      <div role="region" aria-live="polite" className="lg:col-span-7 space-y-4">

        {/* Hero */}
        <ResultHero
          label={results.winner === 'car'
            ? 'O carro é mais barato por mês'
            : results.winner === 'uber_tp'
            ? 'Uber+TP é mais barato por mês'
            : 'Custos praticamente empatados'}
          value={results.winner === 'tie' ? '~R$ 0' : formatBRL(Math.abs(results.monthlyDiff))}
          comment={(() => {
            const top3 = costBreakdown.slice(0, 3).map(i => `${i.label} ${formatBRL(i.val)}`).join(' · ')
            return `Custo carro: ${formatBRL(results.carMonthly.total)}/mês · Uber+TP: ${formatBRL(results.uberTpMonthly.total)}/mês. Maiores custos: ${top3}`
          })()}
          colorClass={heroColorClass}
        />

        {/* Breakdown barras */}
        <div className="rounded-2xl border p-4 space-y-2.5" style={{ background: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Composição do custo do carro</p>
          {costBreakdown.map(item => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--c-muted)' }}>{item.label}</span>
                <span className="font-bold tabular-nums" style={{ color: 'var(--c-ink)' }}>{formatBRL(item.val)}/mês</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'var(--c-line)' }}>
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (item.val / results.carMonthly.total) * 100).toFixed(1)}%`,
                    background: item.label === 'Custo de Oportunidade' ? 'var(--c-copper)' : 'var(--c-emerald)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          ))}
          <p className="text-[10px] leading-relaxed pt-1" style={{ color: 'var(--c-muted-2)' }}>
            O custo de oportunidade (âmbar) representa o rendimento que o capital do carro teria na Selic ({(RATES.selic * 100).toFixed(1)}% a.a.).
            Não é dinheiro que você "paga" — é dinheiro que você deixa de ganhar.
          </p>
        </div>

        {/* Ponto de equilíbrio */}
        <SectionDivider label="Ponto de Equilíbrio" />

        <div className="rounded-2xl border p-5 space-y-4" style={{ background: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <span className="text-3xl font-black tabular-nums" style={{ color: 'var(--c-ink)' }}>
                {results.breakEvenKm === Infinity
                  ? '∞'
                  : results.breakEvenKm.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-sm font-semibold ml-1" style={{ color: 'var(--c-muted)' }}>km/mês</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
              {results.breakEvenKm === Infinity
                ? 'O carro é sempre mais caro com este perfil de uso.'
                : results.userKm < results.breakEvenKm
                ? `Você usa ${results.userKm.toLocaleString('pt-BR')} km/mês — abaixo do break-even. Uber+TP vence.`
                : `Você usa ${results.userKm.toLocaleString('pt-BR')} km/mês — acima do break-even. O carro compensa.`}
            </p>
          </div>

          {results.breakEvenKm !== Infinity && (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={results.breakEvenChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" vertical={false} />
                <XAxis dataKey="km" tick={{ fontSize: 9, fill: '#78716c' }}
                  tickFormatter={v => `${(v/1000).toFixed(1)}k`} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#78716c' }}
                  tickFormatter={v => `R$${(v/1000).toFixed(0)}k`}
                  width={38} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v, name) => [formatBRL(Number(v)), name === 'carCost' ? 'Carro' : 'Uber+TP']}
                  labelFormatter={v => `${Number(v).toLocaleString('pt-BR')} km/mês`}
                  contentStyle={{ background: 'var(--c-card-calm)', borderColor: 'var(--c-line)', borderRadius: 10, fontSize: 11 }}
                />
                {results.userKm <= 5000 && (
                  <ReferenceLine x={results.userKm} stroke="var(--c-muted)" strokeDasharray="4 2"
                    label={{ value: 'você', position: 'top', fontSize: 9, fill: 'var(--c-muted)' }} />
                )}
                {results.breakEvenKm <= 5000 && (
                  <ReferenceLine x={Math.round(results.breakEvenKm)} stroke="var(--c-copper)"
                    strokeDasharray="4 2"
                    label={{ value: 'break-even', position: 'insideTopRight', fontSize: 9, fill: 'var(--c-copper)' }} />
                )}
                <Line type="monotone" dataKey="carCost"  stroke="#f59e0b" strokeWidth={2} dot={false} name="carCost" />
                <Line type="monotone" dataKey="uberCost" stroke="#10b981" strokeWidth={2} dot={false} name="uberCost" />
              </LineChart>
            </ResponsiveContainer>
          )}

          <div className="flex gap-4 text-[10px] font-bold" style={{ color: 'var(--c-muted)' }}>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 rounded" style={{ background: '#f59e0b' }} /> Carro</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 rounded" style={{ background: '#10b981' }} /> Uber+TP</span>
          </div>
        </div>

        {/* Projeção 5 anos */}
        <SectionDivider label="Projeção de 5 Anos" />

        <MetricGrid metrics={[
          {
            label:      'Gasto com carro (5a)',
            value:      formatBRL(results.fiveYear.netCarCost),
            sublabel:   `Total menos valor residual (${formatBRL(results.fiveYear.residualValue)})`,
            colorClass: 'text-red-500',
          },
          {
            label:      'Gasto com Uber+TP (5a)',
            value:      formatBRL(results.fiveYear.totalUberTP),
            sublabel:   'Corrigido pelo IPCA',
            colorClass: 'text-emerald-600 dark:text-emerald-400',
          },
          {
            label:      'Custo de oportunidade (5a)',
            value:      formatBRL(results.fiveYear.selicGainTotal),
            sublabel:   `Se o capital ficasse na Selic (${(RATES.selic * 100).toFixed(1)}% a.a.)`,
            colorClass: 'text-amber-600',
          },
        ]} />

        <div className="rounded-2xl border p-4 flex gap-3" style={{ background: 'var(--c-copper-soft)', borderColor: 'var(--c-copper-soft)' }}>
          <TrendingDown size={20} className="shrink-0 mt-0.5" style={{ color: 'var(--c-copper)' }} />
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--c-copper)' }}>
              💡 Se você investisse {formatBRL(carValue)} na Selic em vez de comprar o carro
            </p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              Em 5 anos teria <strong style={{ color: 'var(--c-copper)' }}>{formatBRL(results.fiveYear.selicGainTotal)}</strong> a mais no bolso —
              além de não ter pago os outros custos de manutenção e impostos.
              Este é o "custo invisível" que a maioria das pessoas ignora ao comprar um carro.
            </p>
          </div>
        </div>

        {/* Nota sobre fatores não incluídos */}
        <p className="text-[10px] leading-relaxed" style={{ color: 'var(--c-muted-2)' }}>
          Não consideramos multas de trânsito (média R$147/infração, 41 mi de multas/ano no Brasil)
          nem o valor do seu tempo no trânsito. Incluí-los tornaria o carro ainda mais caro em capitais com congestionamento crônico.
          Selic utilizada: {(RATES.selic * 100).toFixed(2)}% a.a. ({RATES.lastUpdated}).
        </p>

        {/* Share */}
        <div className="rounded-2xl p-4 border" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Compartilhe o resultado</p>
          <ScaledPreview>
            <ShareCardBase
              id="uber-car-share-card"
              eyebrow="Uber vs. Carro Próprio"
              mainValue={results.winner === 'car' ? 'CARRO VENCE' : results.winner === 'uber_tp' ? 'UBER+TP VENCE' : 'EMPATE'}
              mainLabel={`diferença mensal: ${formatBRL(Math.abs(results.monthlyDiff))}`}
              metrics={[
                { label: 'Carro/mês',     value: formatBRL(results.carMonthly.total) },
                { label: 'Uber+TP/mês',   value: formatBRL(results.uberTpMonthly.total) },
                { label: 'Break-even',    value: results.breakEvenKm === Infinity ? '∞' : `${results.breakEvenKm.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} km/mês` },
                { label: 'Oportunidade 5a', value: formatBRL(results.fiveYear.selicGainTotal) },
              ]}
              footer="o custo real do carro sob a ponta do lápis."
              accentColor={results.winner === 'car' ? '#10b981' : '#ef4444'}
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="uber-car-share-card" filename="uber-vs-carro" />
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Sub-componente: slider genérico ────────────────────────────────────

interface SliderRowProps {
  label:      string
  value:      number
  unit:       string
  min:        number
  max:        number
  step:       number
  onChange:   (v: number) => void
  tip?:       string
  isCurrency?: boolean
}

function SliderRow({ label, value, unit, min, max, step, onChange, tip, isCurrency }: SliderRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>{label}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--c-ink)' }}>
          {isCurrency ? `R$ ${value.toLocaleString('pt-BR')}` : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ${unit}`}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        style={{ backgroundColor: 'var(--c-line)' }}
      />
      {tip && <p className="text-[10px]" style={{ color: 'var(--c-muted-2)' }}>{tip}</p>}
    </div>
  )
}
```

- [ ] **3.2 — Verificar build**

```powershell
npm run build 2>&1 | Select-String "error TS" | Select-Object -First 10
```

Esperado: sem erros TypeScript.

- [ ] **3.3 — Commit**

```bash
git add components/calculators/UberCarCalculator.tsx
git commit -m "feat(uber-vs-carro): add UberCarCalculator component with breakdown, break-even chart and 5-year projection"
```

---

## Task 4: `app/trabalho/uber-vs-carro/page.tsx`

**Files:**
- Create: `app/trabalho/uber-vs-carro/page.tsx`

- [ ] **4.1 — Criar a página**

```tsx
import type { Metadata } from 'next'
import { UberCarCalculator } from '@/components/calculators/UberCarCalculator'
import { AppCTA }            from '@/components/AppCTA'
import { SourcesFooter }     from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Uber vs. Carro Próprio — Qual realmente compensa?',
  description: 'Compare o custo total real de ter um carro próprio com usar Uber e transporte público. Inclui depreciação, seguro, IPVA, custo de oportunidade e projeção de 5 anos.',
  openGraph: {
    title: 'Uber vs. Carro Próprio — A Ponta do Lápis',
    description: 'O carro parece barato — até você ver a conta completa.',
    url: 'https://apontadolapis.com.br/trabalho/uber-vs-carro',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/trabalho/uber-vs-carro' },
}

export default function UberVsCarroPage() {
  return (
    <div className="space-y-6">

      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          TRANSPORTE · CUSTO REAL
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          O carro parece barato.<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>Até você ver a conta completa.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 580 }}>
          A maioria das pessoas compara o Uber com o{' '}
          <strong style={{ color: 'var(--c-ink)' }}>combustível</strong> — e esquece depreciação,
          seguro, IPVA, manutenção e o custo de oportunidade do capital parado no veículo.
          Esta calculadora faz a conta completa.
        </p>
      </div>

      <UberCarCalculator />

      <SourcesFooter sources={[
        { label: 'FIPE — Tabela de Preços e Índice de Depreciação de Veículos Mai/2026', url: 'https://veiculos.fipe.org.br/' },
        { label: 'ANP — Preços dos Combustíveis no Brasil (Série Histórica)', url: 'https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/serie-historica-de-precos-de-combustiveis' },
        { label: 'BCB — Taxa Selic vigente', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
        { label: 'Susep — Referência para cálculo de seguros de automóveis no Brasil', url: 'https://www.gov.br/susep/pt-br' },
        { label: 'Kyla Scanlon — Financial model comparing ridesharing to car ownership', url: 'https://medium.com/data-science/ride-or-drive-a-financial-model-comparing-ridesharing-to-car-ownership-a0e53d660bb' },
      ]} />

      <AppCTA context="seu custo de transporte" />
    </div>
  )
}
```

- [ ] **4.2 — Verificar build completo**

```powershell
npm run build 2>&1 | Select-String "error|✓ Compiled" | Select-Object -First 5
```

Esperado: `✓ Compiled successfully`. A rota `/trabalho/uber-vs-carro` deve aparecer na lista de páginas geradas.

- [ ] **4.3 — Commit**

```bash
git add app/trabalho/uber-vs-carro/page.tsx
git commit -m "feat(uber-vs-carro): add page with metadata and editorial header"
```

---

## Task 5: Integrações — Nav e Sitemap

**Files:**
- Modify: `components/Nav.tsx`
- Modify: `app/sitemap.ts`

- [ ] **5.1 — Adicionar ao Nav**

Em `components/Nav.tsx`, no array `workItems`, adicionar o último item:

```typescript
const workItems = [
  { href: '/trabalho/realidade-brasileira', label: 'Realidade Brasileira', desc: 'Onde seu salário se situa na pirâmide real.' },
  { href: '/trabalho/seguro-desemprego',    label: 'Seguro-Desemprego 2026', desc: 'Calcule parcelas e sua pista financeira de transição.' },
  { href: '/trabalho/rescisao',             label: 'Rescisão CLT', desc: 'Simule seus proventos e descontos demissionais.' },
  { href: '/viagens/custo-de-vida',         label: 'Custo de Vida entre Cidades', desc: 'Compare orçamentos para mudança ou trabalho remoto.' },
  // ADICIONAR:
  { href: '/trabalho/uber-vs-carro',        label: 'Uber vs. Carro Próprio', desc: 'Descubra qual opção realmente sai mais barato no longo prazo.' },
]
```

- [ ] **5.2 — Adicionar ao Sitemap**

Em `app/sitemap.ts`, após a linha de `/apostas`:

```typescript
{ url: `${base}/trabalho/uber-vs-carro`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
```

- [ ] **5.3 — Build final**

```powershell
npm run build
```

Esperado: build limpo, rota `/trabalho/uber-vs-carro` na lista de páginas estáticas geradas.

- [ ] **5.4 — Commit e push**

```bash
git add components/Nav.tsx app/sitemap.ts
git commit -m "feat(uber-vs-carro): integrate into nav and sitemap

- workItems: Uber vs. Carro Próprio adicionado ao dropdown Trabalho
- sitemap: /trabalho/uber-vs-carro com priority 0.9

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin claude/friendly-hypatia-HwfUk
```

---

## Task 6: Verificação Visual

- [ ] **6.1 — Iniciar servidor de desenvolvimento**

```bash
npm run dev
```

Abrir `http://localhost:3000/trabalho/uber-vs-carro`.

- [ ] **6.2 — Checklist de verificação**

| Item | O que verificar |
|------|----------------|
| Toggle Comprar/Manter | Alterna entre os dois modos; no modo Comprar o custo mensal deve ser ~R$600 maior (extra depreciation) |
| Chip de segmento | Muda automaticamente com o valor: <80k = Popular, 80k-130k = Médio, 130k-250k = SUV |
| Accordeão custos avançados | Abre e fecha; valores pré-preenchidos com defaults do segmento |
| Modo combustível Elétrico | Manutenção cai ~40%; campo "consumo km/l" some; custo de combustível calculado por km |
| Modo commute "Só TP" | Campo de preço do Uber para commute não aparece |
| Resultado hero | Verde quando carro mais barato, vermelho quando Uber+TP mais barato |
| Breakdown barras | Soma das barras = custo total do carro; custo de oportunidade em âmbar |
| Gráfico break-even | Linha âmbar (carro) cruza linha verde (Uber+TP) no ponto correto; marcação "você" na posição atual |
| Gráfico não exibe quando break-even = Infinity | "O carro é sempre mais caro" sem gráfico |
| MetricGrid 5 anos | Três valores coerentes; custo oportunidade = carValue × ((1+Selic)^5 - 1) |
| Insight card | Mostra o valor correto de custo de oportunidade |
| ShareCard | Renderiza com veredito correto (CARRO VENCE / UBER+TP VENCE) |
| Nav dropdown Trabalho | "Uber vs. Carro Próprio" aparece como última opção |
| Mobile | Colunas empilhadas; sliders funcionam; accordeão fecha/abre |
