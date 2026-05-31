# Uber vs. Carro Próprio — Design Spec

**Data:** 2026-05-30  
**Status:** Aprovado para implementação  
**Rota:** `/trabalho/uber-vs-carro`

---

## Contexto e Objetivo

Calculadora que compara o custo real de ter um carro próprio vs. usar Uber + transporte público. Serve dois perfis: quem está avaliando **comprar** um carro e quem já tem e avalia se vale **manter**. O veredito inclui custo mensal, ponto de equilíbrio em km/mês e projeção de 5 anos com custo de oportunidade do capital.

---

## Arquitetura de Arquivos

```
app/trabalho/uber-vs-carro/page.tsx          ← metadata + header + componente
config/uber-car.ts                            ← defaults por segmento, preços referência
lib/calculations/uber-car.ts                 ← funções puras de cálculo
components/calculators/UberCarCalculator.tsx  ← componente principal
```

**Integrações:**
- `components/Nav.tsx` — adicionar em `workItems`: `{ href: '/trabalho/uber-vs-carro', label: 'Uber vs. Carro Próprio', desc: 'Descubra se comprar um carro realmente compensa.' }`
- `app/sitemap.ts` — nova entrada com `priority: 0.9, changeFrequency: 'monthly'`

---

## `config/uber-car.ts` — Defaults por Segmento

```typescript
export type CarSegment = 'popular' | 'medio' | 'suv' | 'premium'
export type CitySize   = 'interior' | 'capital_pequena' | 'capital_grande'
export type FuelType   = 'gasolina' | 'etanol' | 'eletrico'

export const SEGMENT_THRESHOLDS = {
  popular:  { min: 0,       max: 80_000 },
  medio:    { min: 80_000,  max: 130_000 },
  suv:      { min: 130_000, max: 250_000 },
  premium:  { min: 250_000, max: Infinity },
}

export const SEGMENT_DEFAULTS: Record<CarSegment, {
  depreciationPct: number   // % a.a.
  insuranceAnnual: Record<CitySize, number>
  maintenancePerKm: number  // R$/km
  fuelEfficiency: number    // km/l
}> = {
  popular: {
    depreciationPct: 18,
    insuranceAnnual: { interior: 1_400, capital_pequena: 1_800, capital_grande: 2_400 },
    maintenancePerKm: 0.10,
    fuelEfficiency: 12,
  },
  medio: {
    depreciationPct: 15,
    insuranceAnnual: { interior: 2_000, capital_pequena: 2_800, capital_grande: 3_600 },
    maintenancePerKm: 0.12,
    fuelEfficiency: 11,
  },
  suv: {
    depreciationPct: 20,
    insuranceAnnual: { interior: 3_200, capital_pequena: 4_500, capital_grande: 5_800 },
    maintenancePerKm: 0.18,
    fuelEfficiency: 9,
  },
  premium: {
    depreciationPct: 12,
    insuranceAnnual: { interior: 5_000, capital_pequena: 7_000, capital_grande: 9_500 },
    maintenancePerKm: 0.25,
    fuelEfficiency: 10,
  },
}

export const FUEL_PRICES: Record<FuelType, number> = {
  gasolina: 6.20,   // R$/l — média nacional mai/2026
  etanol:   4.80,
  eletrico: 0.10,   // R$/km equivalente (custo de recarga)
}

export const UBER_DEFAULTS = {
  pricePerKm:  2.00,   // R$/km — UberX média nacional
  baseFare:    3.00,   // R$ por corrida
  tpTicketSP:  4.40,   // R$ — tarifa SP
  tpTicketDefault: 4.00,
}

export const FIXED_DEFAULTS = {
  ipvaPct:          4.0,    // % a.a.
  licensingAnnual:  180,    // R$/ano
  washingMonthly:   100,    // R$/mês
  tollPerKm:        0.02,   // R$/km (estimativa)
  workDaysPerMonth: 22,
}
```

---

## `lib/calculations/uber-car.ts` — Modelo de Cálculo

### Interfaces

```typescript
export interface CarParams {
  carValue:          number   // valor do carro (R$)
  segment:           CarSegment
  citySize:          CitySize
  fuelType:          FuelType
  kmPerMonth:        number
  // Overrides (modo avançado — usa defaults se não fornecidos)
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
  distanceKm:        number   // km ida (um sentido)
  workDaysPerMonth:  number
  commuteMode:       'tp_only' | 'uber_only' | 'mixed_tp_go_uber_back' | 'mixed_uber_go_tp_back'
  tpTicketPrice:     number
  uberPricePerKm:    number
  uberBaseFare:      number
}

export interface ExtraTripsParams {
  tripsPerMonth:     number
  avgDistanceKm:     number
  uberPricePerKm:    number
  uberBaseFare:      number
}

export interface UberCarResult {
  // Mensal
  carMonthly: {
    depreciation:    number
    ipva:            number
    insurance:       number
    fuel:            number
    maintenance:     number
    parking:         number
    washing:         number
    licensing:       number
    toll:            number
    opportunity:     number   // custo de oportunidade (Selic)
    financing:       number   // juros mensais do financiamento (0 se à vista)
    total:           number
  }
  uberTpMonthly: {
    commuteTP:       number
    commuteUber:     number
    extraUber:       number
    total:           number
  }
  monthlyDiff:       number   // carTotal - uberTpTotal (positivo = carro mais caro)
  winner:            'car' | 'uber_tp' | 'tie'

  // Break-even
  breakEvenKm:       number   // km/mês onde custos se igualam (ou Infinity se nunca)
  userKm:            number   // km atual do usuário
  breakEvenChart:    { km: number; carCost: number; uberCost: number }[]

  // 5 anos
  fiveYear: {
    totalCar:        number   // soma de todos os custos em 5 anos
    totalUberTP:     number   // Uber+TP em 5 anos (corrigido IPCA)
    residualValue:   number   // valor do carro após 5 anos
    netCarCost:      number   // totalCar - residualValue
    selicGain:       number   // quanto renderia na Selic
    selicGainTotal:  number   // carValue investido cresceria para X → ganho = X - carValue
  }
}
```

### Função principal

```typescript
export function calculateUberVsCar(
  car: CarParams,
  commute: CommuteParams,
  extra: ExtraTripsParams,
  selicAnnual: number,   // de RATES.selic
  inflationAnnual: number // IPCA — default 0.05
): UberCarResult
```

**Cálculo dos custos mensais do carro:**

```typescript
// Resolve overrides ou usa defaults do segmento
const deprPct  = car.depreciationPct  ?? SEGMENT_DEFAULTS[segment].depreciationPct
const insurance = car.insuranceAnnual ?? SEGMENT_DEFAULTS[segment].insuranceAnnual[city]
const fuelEff  = car.fuelEfficiency   ?? SEGMENT_DEFAULTS[segment].fuelEfficiency
const maintKm  = car.maintenancePerKm ?? SEGMENT_DEFAULTS[segment].maintenancePerKm
const ipva     = car.ipvaPct          ?? FIXED_DEFAULTS.ipvaPct
const parking  = car.parkingMonthly   ?? 0
const washing  = car.washingMonthly   ?? FIXED_DEFAULTS.washingMonthly
const toll     = car.tollPerKm        ?? FIXED_DEFAULTS.tollPerKm

const fuelPrice = fuelType === 'eletrico'
  ? FUEL_PRICES.eletrico * fuelEff   // custo por km × km consumidos
  : FUEL_PRICES[fuelType]

const depreciation = carValue * deprPct / 100 / 12
const ipvaMonthly  = carValue * ipva    / 100 / 12
const insuranceMo  = insurance / 12
const fuelMonthly  = fuelType === 'eletrico'
  ? kmPerMonth * FUEL_PRICES.eletrico
  : (kmPerMonth / fuelEff) * fuelPrice
const maintMonthly = kmPerMonth * maintKm
const tollMonthly  = kmPerMonth * toll
const licensingMo  = FIXED_DEFAULTS.licensingAnnual / 12
const opportunity  = carValue * selicAnnual / 12

// Financiamento: juros puros = parcela × n - valorFinanciado, amortizado mensalmente
// Usamos Price: parcela = financedAmt × (r × (1+r)^n) / ((1+r)^n - 1)
// Custo real dos juros/mês = parcela - (financedAmt / financingMonths) em aproximação
let financing = 0
if (car.financed && car.financedAmount && car.financingRateAm && car.financingMonths) {
  const r = car.financingRateAm / 100
  const n = car.financingMonths
  const installment = car.financedAmount * (r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1)
  const amortization = car.financedAmount / n
  financing = installment - amortization  // juros puros mensais (aproximação linear)
}
```

**Cálculo dos custos Uber+TP:**

```typescript
// Commute
const tripsPerDay = 2  // ida + volta
const uberTripsCommute = (() => {
  switch (commuteMode) {
    case 'tp_only':                return 0
    case 'uber_only':              return workDays * 2
    case 'mixed_tp_go_uber_back':  return workDays * 1   // só volta de Uber
    case 'mixed_uber_go_tp_back':  return workDays * 1   // só ida de Uber
  }
})()
const tpTripsCommute = workDays * 2 - uberTripsCommute

const commuteTP   = tpTripsCommute * tpTicket
const commuteUber = uberTripsCommute * (distanceKm * uberPricePerKm + uberBaseFare)

// Outras viagens
const extraUber = extra.tripsPerMonth * (extra.avgDistanceKm * extra.uberPricePerKm + extra.uberBaseFare)
```

**Ponto de equilíbrio:**

O carro tem custos fixos altos + variável baixo por km.
O Uber tem custo zero fixo + alto variável por km.

```typescript
// Custo carro em função de km:
// carCost(km) = fixedCar + variableCarPerKm × km
const fixedCar      = depreciation + ipvaMonthly + insuranceMo + parking + washing + licensingMo + opportunity + financing
const variableCarPKm = (fuelPrice_per_km + maintKm + toll)

// Custo Uber em função de km:
// Para simplificar, computamos o custo de Uber para os mesmos km que o carro percorreria
// Baseado em km médio por corrida e preço/km
const effectiveUberPerKm = uberPricePerKm + (uberBaseFare / extra.avgDistanceKm)
// uberCost(km) = effectiveUberPerKm × km + tpFixedCost (commute TP não muda com km extra)

// fuelPrice_per_km (usado em variableCarPKm, break-even e projeção 5 anos):
const fuelPricePerKm = fuelType === 'eletrico'
  ? FUEL_PRICES.eletrico                        // R$/km direto
  : FUEL_PRICES[fuelType] / fuelEff             // R$/l ÷ km/l

const tpFixed = commuteTP  // o TP do commute é fixo independente de km extra

// Break-even: fixedCar + variableCarPKm × km = effectiveUberPerKm × km + tpFixed
// km_eq = (fixedCar - tpFixed) / (effectiveUberPerKm - variableCarPKm)
const breakEvenKm = effectiveUberPerKm > variableCarPKm
  ? (fixedCar - tpFixed) / (effectiveUberPerKm - variableCarPKm)
  : Infinity  // Carro sempre mais caro (custos fixos muito altos)
```

**Projeção 5 anos:**

```typescript
let totalCar5y = 0
let totalUberTP5y = 0
let currentValue = carValue

for (let year = 1; year <= 5; year++) {
  const annualDepreciation = currentValue * deprPct / 100
  currentValue -= annualDepreciation  // valor cai ano a ano
  
  const yearCarCost =
    annualDepreciation +
    currentValue * ipva / 100 +                    // IPVA sobre valor atual
    insurance +                                     // seguro relativamente estável
    FIXED_DEFAULTS.licensingAnnual +
    (parking + washing) * 12 +
    kmPerMonth * 12 * (fuelPrice_per_km + maintKm + toll) +
    currentValue * selicAnnual +                   // oportunidade sobre valor atual
    financing * 12

  totalCar5y += yearCarCost

  // Uber+TP cresce com IPCA
  const yearInflation = Math.pow(1 + inflationAnnual, year - 1)
  totalUberTP5y += (commuteTP + commuteUber + extraUber) * 12 * yearInflation
}

const residualValue = currentValue  // após 5 anos
const netCarCost5y  = totalCar5y - residualValue

// Custo de oportunidade: quanto R$ do carro cresceria na Selic em 5 anos
const selicGainTotal = carValue * (Math.pow(1 + selicAnnual, 5) - 1)
```

---

## Layout UI — `UberCarCalculator.tsx`

### Estrutura geral
```
grid grid-cols-1 lg:grid-cols-12
  coluna esquerda: lg:col-span-5  (inputs)
  coluna direita:  lg:col-span-7  (resultados)
```

### Coluna de Inputs

**Toggle de contexto** (topo, fora do CalculatorCard):
```
[ 🚗 Estou avaliando COMPRAR ]  [ 🔑 Já TENHO um carro ]
```

**CalculatorCard "Sobre o Carro":**
1. Valor do carro — input BRL + slider R$30k–R$400k, step R$5k
2. Chip auto-detectado de segmento (Popular/Médio/SUV/Premium) sem input manual
3. Cidade — toggle `Interior` | `Capital pequena` | `Capital grande`
4. Combustível — tabs `⛽ Gasolina` | `🌿 Etanol` | `🔌 Elétrico`

**`▼ Personalizar custos do carro`** (acordeão, fechado por padrão):
- Depreciação % a.a. (slider 5–30%)
- IPVA % a.a. (slider 2–5%)
- Seguro anual R$ (slider)
- Consumo km/l (slider 6–20)
- Manutenção R$/km (slider 0.05–0.40)
- Estacionamento R$/mês (slider 0–1.000)
- Lavagem/misc R$/mês (slider 0–300)
- Financiamento: toggle "Financiado?" → se sim: valor financiado + taxa a.m. + prazo

**CalculatorCard "Seus Deslocamentos":**

*Commute diário:*
- Distância casa-trabalho (slider 1–60km, um sentido)
- Dias trabalhados/mês (slider 10–25, default 22)
- Modo: `🚌 Só TP` | `🚗 Só Uber` | `↔️ TP na ida / Uber na volta` | `↔️ Uber na ida / TP na volta`
- Preço da passagem TP (visível se modo inclui TP, default R$4,40)

*Outras viagens (Uber):*
- Viagens extras/mês (slider 0–30)
- Distância média (slider 2–30km)
- Preço/km Uber (input, default R$2,00)

### Coluna de Resultados

**ResultHero** — título dinâmico:
- Se carro mais caro: `"O carro custa R$ X/mês a mais"` — cor vermelha
- Se Uber mais caro: `"O carro é R$ X/mês mais barato"` — cor verde
- Comment: breakdown dos 3 maiores custos do carro (ex: "Depreciação R$X · Seguro R$Y · Combustível R$Z")

**Breakdown barras** (inline):
Lista dos custos mensais do carro com barra de proporção — mostra visualmente qual custo domina.

**SectionDivider "Ponto de Equilíbrio":**

Card com:
- Número grande: `X.XXX km/mês`
- Sub-label: "Abaixo disso Uber+TP vence · Acima disso o carro compensa"
- Indicador de posição do usuário (à esquerda/direita do break-even)
- Gráfico de linhas Recharts: eixo X = km/mês (0–5.000), duas linhas (carro âmbar / Uber verde), linha vertical pontilhada no break-even

**SectionDivider "Projeção de 5 Anos":**

MetricGrid 3 cards:
- Total gasto no carro (5 anos)
- Total gasto no Uber+TP (5 anos, corrigido IPCA)
- Custo de oportunidade (quanto renderia na Selic)

Insight card: `"💡 Se você investisse os R$ X do carro na Selic, em 5 anos teria R$ Y a mais."`

ShareCard + ShareButtons padrão.

---

## Considerações Adicionais

1. **Custo de oportunidade** — sempre exibido mesmo quando o usuário não o solicita. É o maior "fator esquecido".

2. **Modo Comprar vs. Manter** — a depreciação no 1º ano é historicamente mais alta (10–15% só na saída da concessionária). No modo "avaliar comprar", aplicar fator extra de 8% na depreciação do 1º ano (sobre o default do segmento).

3. **Carro elétrico** — `fuelType === 'eletrico'`: fuelEfficiency não se aplica; custo de "abastecimento" = km × R$0.10/km (custo médio de recarga). Manutenção por km cai 40% (sem troca de óleo, freios regenerativos). Depreciação permanece 20% — elétricos depreciam mais no Brasil por infraestrutura.

4. **IPVA por estado** — o input de IPVA tem default 4% mas mostra tooltip: "Varia por estado: SP 4%, RJ 4%, MG 4%, PR 3.5%, RS 3%..."

5. **Sem multas, tempo no trânsito nem valor do tempo** — esses fatores são reconhecidamente importantes mas subjetivos/difíceis de quantificar sem dados pessoais confiáveis. O componente pode mencionar uma nota textual: "Não consideramos multas (média R$147/evento, 41M infrações/ano no Brasil) nem o valor do seu tempo no trânsito."
