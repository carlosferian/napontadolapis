'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareCardBase } from '@/components/share/ShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { formatBRL } from '@/lib/formatters'
import { calculateUberVsCar } from '@/lib/calculations/uber-car'
import { getSegment, SEGMENT_LABELS, SEGMENT_DEFAULTS } from '@/config/uber-car'
import type { CitySize, FuelType, CommuteMode } from '@/config/uber-car'
import { RATES } from '@/config/rates'
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { TrendingDown, ChevronDown, ChevronUp } from 'lucide-react'

// ── SliderRow sub-component ────────────────────────────────────────────────

interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: (v: number) => string
  hint?: string
  accentColor?: string
}

function SliderRow({
  label, value, min, max, step, onChange, hint, accentColor = 'var(--c-emerald)',
}: Omit<SliderRowProps, 'format'> & { format?: (v: number) => string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center gap-2">
        <label className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>{label}</label>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min} max={max} step={step}
          onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v))) }}
          className="text-xs font-bold tabular-nums text-right bg-transparent border-b focus:outline-none"
          style={{ color: accentColor, borderColor: accentColor, maxWidth: '6rem' }}
        />
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
        style={{ backgroundColor: 'var(--c-line)', accentColor } as React.CSSProperties}
      />
      {hint && <p className="text-[10px]" style={{ color: 'var(--c-muted-2)' }}>{hint}</p>}
    </div>
  )
}

// ── Main calculator ────────────────────────────────────────────────────────

export function UberCarCalculator() {
  // Mode
  const [mode, setMode] = useState<'buying' | 'owning'>('buying')

  // Car basics
  const [carValueRaw, setCarValueRaw] = useState('90000')
  const carValue = Math.max(0, parseInt(carValueRaw.replace(/\D/g, '') || '0', 10))

  const [citySize, setCitySize] = useState<CitySize>('capital_grande')
  const [fuelType, setFuelType] = useState<FuelType>('gasolina')

  // Advanced toggles
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [customDepr, setCustomDepr] = useState<number | null>(null)
  const [customIpva, setCustomIpva] = useState<number | null>(null)
  const [customInsurance, setCustomInsurance] = useState<number | null>(null)
  const [customFuelEff, setCustomFuelEff] = useState<number | null>(null)
  const [customMaintKm, setCustomMaintKm] = useState<number | null>(null)
  const [parkingMonthly, setParkingMonthly] = useState(250)
  const [washingMonthly, setWashingMonthly] = useState(100)

  // Financing
  const [financed, setFinanced] = useState(false)
  const [financedAmount, setFinancedAmount] = useState(50_000)
  const [financingRateAm, setFinancingRateAm] = useState(1.49)
  const [financingMonths, setFinancingMonths] = useState(48)

  // Commute
  const [commuteDistKm, setCommuteDistKm] = useState(15)
  const [workDays, setWorkDays] = useState(22)
  const [commuteMode, setCommuteMode] = useState<CommuteMode>('mixed_tp_go_uber_back')
  const [tpTicket, setTpTicket] = useState(5.00)
  const [uberPricePerKm, setUberPricePerKm] = useState(2.40)
  const [uberBaseFare, setUberBaseFare] = useState(6.00)

  // Extra trips
  const [extraTrips, setExtraTrips] = useState(8)
  const [extraDistKm, setExtraDistKm] = useState(8)

  // Derived
  const segment = useMemo(() => getSegment(carValue), [carValue])
  const kmPerMonth = useMemo(
    () => commuteDistKm * 2 * workDays + extraTrips * extraDistKm,
    [commuteDistKm, workDays, extraTrips, extraDistKm]
  )

  const results = useMemo(() => calculateUberVsCar(
    {
      mode,
      carValue,
      segment,
      citySize,
      fuelType,
      kmPerMonth,
      depreciationPct:  customDepr     ?? undefined,
      insuranceAnnual:  customInsurance ?? undefined,
      fuelEfficiency:   customFuelEff   ?? undefined,
      maintenancePerKm: customMaintKm   ?? undefined,
      ipvaPct:          customIpva      ?? undefined,
      parkingMonthly,
      washingMonthly,
      financed,
      financedAmount,
      financingRateAm,
      financingMonths,
    },
    {
      distanceKm:       commuteDistKm,
      workDaysPerMonth: workDays,
      commuteMode,
      tpTicketPrice:    tpTicket,
      uberPricePerKm,
      uberBaseFare,
    },
    {
      tripsPerMonth:  extraTrips,
      avgDistanceKm:  extraDistKm,
      uberPricePerKm,
      uberBaseFare,
    },
    RATES.selic
  ), [
    mode, carValue, segment, citySize, fuelType, kmPerMonth,
    customDepr, customInsurance, customFuelEff, customMaintKm, customIpva,
    parkingMonthly, washingMonthly,
    financed, financedAmount, financingRateAm, financingMonths,
    commuteDistKm, workDays, commuteMode, tpTicket, uberPricePerKm, uberBaseFare,
    extraTrips, extraDistKm,
  ])

  const tpInvolved = commuteMode !== 'uber_only'

  // Cost breakdown sorted by magnitude
  const costItems = useMemo(() => {
    const c = results.carMonthly
    return [
      { label: 'Depreciação',      value: c.depreciation, amber: false },
      { label: 'Custo de oportunidade', value: c.opportunity, amber: true },
      { label: 'Seguro',           value: c.insurance,    amber: false },
      { label: 'IPVA',             value: c.ipva,         amber: false },
      { label: 'Combustível',      value: c.fuel,         amber: false },
      { label: 'Manutenção',       value: c.maintenance,  amber: false },
      { label: 'Estacionamento',   value: c.parking,      amber: false },
      { label: 'Lavagem',          value: c.washing,      amber: false },
      { label: 'Licenciamento',    value: c.licensing,    amber: false },
      { label: 'Pedágios',         value: c.toll,         amber: false },
      { label: 'Juros financ.',    value: c.financing,    amber: false },
    ]
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [results.carMonthly])

  const maxCostItem = costItems[0]?.value ?? 1

  // Hero text
  const diff = Math.abs(results.monthlyDiff)
  const heroValue = results.winner === 'tie'
    ? 'Empate'
    : formatBRL(diff) + '/mês'
  const heroLabel = results.winner === 'tie'
    ? 'Custo equivalente (diferença < R$50)'
    : results.winner === 'car'
    ? 'Carro mais barato por mês'
    : 'Uber + Transporte Público mais barato por mês'
  const heroColor = results.winner === 'tie'
    ? 'text-stone-500'
    : results.winner === 'car'
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-amber-600 dark:text-amber-400'

  const breakEvenFinite = isFinite(results.breakEvenKm)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">

      {/* ── COLUNA ESQUERDA ── */}
      <div className="lg:col-span-5 space-y-4">

        {/* Mode toggle */}
        <div className="flex rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--c-line-strong)' }}>
          {(['buying', 'owning'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-3 px-2 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              style={{
                backgroundColor: mode === m ? 'var(--c-emerald)' : 'transparent',
                color: mode === m ? '#fff' : 'var(--c-muted)',
              }}
            >
              {m === 'buying' ? 'Estou avaliando COMPRAR' : 'Já TENHO um carro'}
            </button>
          ))}
        </div>

        {/* Card 1: Sobre o Carro */}
        <CalculatorCard title="Sobre o Carro" subtitle="Configure o veículo que você está avaliando.">
          <div className="space-y-6">

            {/* Valor do carro */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>Valor do Carro</label>
                <div className="flex items-center gap-2">
                  {/* Segment chip */}
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--c-emerald-soft)', color: 'var(--c-emerald)' }}
                  >
                    {SEGMENT_LABELS[segment]}
                  </span>
                  <div className="relative w-40">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={carValue || ''}
                      min={30_000} max={400_000} step={5_000}
                      placeholder="90000"
                      onChange={e => setCarValueRaw(String(Math.max(30_000, Math.min(400_000, parseInt(e.target.value) || 30_000))))}
                      className="w-full text-right border rounded-xl pr-3.5 pl-9 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums bg-transparent"
                      style={{ color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
                    />
                  </div>
                </div>
              </div>
              <input type="range" min={30_000} max={400_000} step={5_000}
                value={Math.min(400_000, Math.max(30_000, carValue))}
                onChange={e => setCarValueRaw(e.target.value)}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                style={{ backgroundColor: 'var(--c-line)' }}
              />
              <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
                <span>R$ 30k</span><span>R$ 400k</span>
              </div>
            </div>

            {/* City size */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>Tamanho da cidade</label>
              <div className="grid grid-cols-3 gap-1.5">
                {([
                  ['interior',        'Interior'],
                  ['capital_pequena', 'Capital pequena'],
                  ['capital_grande',  'Capital grande'],
                ] as [CitySize, string][]).map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setCitySize(val)}
                    className="py-2 px-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer"
                    style={{
                      backgroundColor: citySize === val ? 'var(--c-emerald)' : 'transparent',
                      color:           citySize === val ? '#fff' : 'var(--c-muted)',
                      borderColor:     citySize === val ? 'var(--c-emerald)' : 'var(--c-line)',
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel type */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>Combustível</label>
              <div className="grid grid-cols-3 gap-1.5">
                {([
                  ['gasolina', 'Gasolina'],
                  ['etanol',   'Etanol'],
                  ['eletrico', 'Eletrico'],
                ] as [FuelType, string][]).map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setFuelType(val)}
                    className="py-2 px-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer"
                    style={{
                      backgroundColor: fuelType === val ? 'var(--c-emerald)' : 'transparent',
                      color:           fuelType === val ? '#fff' : 'var(--c-muted)',
                      borderColor:     fuelType === val ? 'var(--c-emerald)' : 'var(--c-line)',
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced accordion */}
            <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--c-line)' }}>
              <button
                onClick={() => setShowAdvanced(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold cursor-pointer"
                style={{ color: 'var(--c-muted)', backgroundColor: 'var(--c-surface)' }}
              >
                <span>Personalizar custos</span>
                {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showAdvanced && (
                <div className="px-4 pb-4 space-y-4 pt-2" style={{ backgroundColor: 'var(--c-card-calm)' }}>
                  <SliderRow
                    label="Depreciação anual (%)"
                    value={customDepr ?? SEGMENT_DEFAULTS[segment].depreciationPct}
                    min={5} max={40} step={0.5}
                    onChange={v => setCustomDepr(v)}
                    format={v => `${v.toFixed(1)}% a.a.`}
                  />
                  <SliderRow
                    label="IPVA anual (%)"
                    value={customIpva ?? 4}
                    min={1} max={6} step={0.1}
                    onChange={v => setCustomIpva(v)}
                    format={v => `${v.toFixed(1)}%`}
                  />
                  <SliderRow
                    label="Seguro anual (R$)"
                    value={customInsurance ?? SEGMENT_DEFAULTS[segment].insuranceAnnual[citySize]}
                    min={500} max={15_000} step={100}
                    onChange={v => setCustomInsurance(v)}
                    format={v => formatBRL(v)}
                  />
                  {fuelType !== 'eletrico' && (
                    <SliderRow
                      label="Consumo (km/l)"
                      value={customFuelEff ?? SEGMENT_DEFAULTS[segment].fuelEfficiency}
                      min={5} max={20} step={0.5}
                      onChange={v => setCustomFuelEff(v)}
                      format={v => `${v.toFixed(1)} km/l`}
                    />
                  )}
                  <SliderRow
                    label="Manutenção (R$/km)"
                    value={customMaintKm ?? SEGMENT_DEFAULTS[segment].maintenancePerKm}
                    min={0.05} max={0.50} step={0.01}
                    onChange={v => setCustomMaintKm(v)}
                    format={v => `R$ ${v.toFixed(2)}/km`}
                  />
                  <SliderRow
                    label="Estacionamento (R$/mês)"
                    value={parkingMonthly}
                    min={0} max={800} step={50}
                    onChange={setParkingMonthly}
                    format={v => formatBRL(v)}
                  />
                  <SliderRow
                    label="Lavagem (R$/mês)"
                    value={washingMonthly}
                    min={0} max={400} step={20}
                    onChange={setWashingMonthly}
                    format={v => formatBRL(v)}
                  />
                  {/* Reset customs */}
                  <button
                    onClick={() => {
                      setCustomDepr(null); setCustomIpva(null); setCustomInsurance(null)
                      setCustomFuelEff(null); setCustomMaintKm(null)
                    }}
                    className="text-[10px] font-bold cursor-pointer"
                    style={{ color: 'var(--c-muted)' }}
                  >
                    Restaurar padrões do segmento
                  </button>
                </div>
              )}
            </div>

            {/* Financing */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" checked={financed}
                  onChange={e => setFinanced(e.target.checked)}
                  className="w-4 h-4 rounded accent-emerald-500"
                />
                <span className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>Carro financiado</span>
              </label>
              {financed && (
                <div className="space-y-4 pl-2 border-l-2" style={{ borderColor: 'var(--c-emerald)' }}>
                  <SliderRow
                    label="Valor financiado (R$)"
                    value={financedAmount}
                    min={5_000} max={300_000} step={5_000}
                    onChange={setFinancedAmount}
                    format={v => formatBRL(v)}
                  />
                  <SliderRow
                    label="Taxa de juros (% a.m.)"
                    value={financingRateAm}
                    min={0.5} max={4} step={0.01}
                    onChange={setFinancingRateAm}
                    format={v => `${v.toFixed(2)}% a.m.`}
                  />
                  <SliderRow
                    label="Prazo (meses)"
                    value={financingMonths}
                    min={12} max={84} step={6}
                    onChange={setFinancingMonths}
                    format={v => `${v} meses`}
                  />
                </div>
              )}
            </div>
          </div>
        </CalculatorCard>

        {/* Card 2: Deslocamentos */}
        <CalculatorCard title="Seus Deslocamentos" subtitle="Como você usa o transporte no dia a dia.">
          <div className="space-y-6">

            <SliderRow
              label="Distância casa-trabalho (ida, km)"
              value={commuteDistKm}
              min={1} max={60} step={1}
              onChange={setCommuteDistKm}
              format={v => `${v} km`}
              hint="Apenas a distância de ida. O cálculo considera ida e volta."
            />

            <SliderRow
              label="Dias trabalhados / mes"
              value={workDays}
              min={10} max={25} step={1}
              onChange={setWorkDays}
              format={v => `${v} dias`}
            />

            {/* Commute mode */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>Modo de deslocamento</label>
              <div className="grid grid-cols-2 gap-1.5">
                {([
                  ['tp_only',               'Só Transporte Público (TP)'],
                  ['uber_only',             'Só Uber'],
                  ['mixed_tp_go_uber_back', 'Transp. Público na ida, Uber na volta'],
                  ['mixed_uber_go_tp_back', 'Uber na ida, Transp. Público na volta'],
                ] as [CommuteMode, string][]).map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setCommuteMode(val)}
                    className="py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-left"
                    style={{
                      backgroundColor: commuteMode === val ? 'var(--c-emerald)' : 'transparent',
                      color:           commuteMode === val ? '#fff' : 'var(--c-muted)',
                      borderColor:     commuteMode === val ? 'var(--c-emerald)' : 'var(--c-line)',
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {tpInvolved && (
              <SliderRow
                label="Tarifa do Transporte Público (TP) (R$)"
                value={tpTicket}
                min={1} max={12} step={0.10}
                onChange={setTpTicket}
                format={v => `R$ ${v.toFixed(2)}`}
              />
            )}

            <SliderRow
              label="Preço Uber por km (R$/km)"
              value={uberPricePerKm}
              min={0.80} max={4} step={0.10}
              onChange={setUberPricePerKm}
              format={v => `R$ ${v.toFixed(2)}/km`}
            />

            <SliderRow
              label="Tarifa base Uber (por corrida)"
              value={uberBaseFare}
              min={0} max={8} step={0.50}
              onChange={setUberBaseFare}
              format={v => `R$ ${v.toFixed(2)}`}
              hint="Valor fixo cobrado por corrida além do preço/km. UberX ~R$3,00"
            />

            {/* Extra trips */}
            <div className="pt-2 border-t space-y-4" style={{ borderColor: 'var(--c-line)' }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
                Viagens extras (lazer, compras etc.)
              </p>
              <SliderRow
                label="Viagens extras / mes"
                value={extraTrips}
                min={0} max={40} step={1}
                onChange={setExtraTrips}
                format={v => `${v} viagens`}
              />
              <SliderRow
                label="Distancia media das viagens extras (km)"
                value={extraDistKm}
                min={1} max={40} step={1}
                onChange={setExtraDistKm}
                format={v => `${v} km`}
              />
            </div>

            {/* Summary */}
            <div className="rounded-xl px-4 py-3 flex justify-between items-center" style={{ background: 'var(--c-emerald-soft)' }}>
              <span className="text-xs font-bold" style={{ color: 'var(--c-emerald)' }}>Km total estimado / mes</span>
              <span className="text-base font-black tabular-nums" style={{ color: 'var(--c-emerald)' }}>
                {kmPerMonth.toLocaleString('pt-BR')} km
              </span>
            </div>
          </div>
        </CalculatorCard>
      </div>

      {/* ── COLUNA DIREITA ── */}
      <div role="region" aria-live="polite" className="lg:col-span-7 space-y-4">

        {/* Hero */}
        <ResultHero
          label={heroLabel}
          value={heroValue}
          comment={
            results.winner === 'tie'
              ? 'As opções custam praticamente o mesmo.'
              : results.winner === 'car'
              ? `Carro total: ${formatBRL(results.carMonthly.total)}/mês vs. Uber + Transp. Público: ${formatBRL(results.uberTpMonthly.total)}/mês`
              : `Uber + Transp. Público total: ${formatBRL(results.uberTpMonthly.total)}/mês vs. Carro: ${formatBRL(results.carMonthly.total)}/mês`
          }
          colorClass={heroColor}
        />

        {/* Cost breakdown */}
        <div className="rounded-2xl border p-5 space-y-3"
          style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
          <p className="text-sm font-bold" style={{ color: 'var(--c-ink)' }}>
            Custo mensal do carro — detalhado
          </p>
          <div className="space-y-2">
            {costItems.map(item => (
              <div key={item.label} className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: item.amber ? 'var(--c-copper)' : 'var(--c-muted)' }}
                  >
                    {item.label}
                    {item.amber && <span className="ml-1 text-[9px] opacity-75">(oportunidade)</span>}
                  </span>
                  <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: item.amber ? 'var(--c-copper)' : 'var(--c-ink)' }}
                  >
                    {formatBRL(item.value)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--c-line)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.value / maxCostItem) * 100}%`,
                      backgroundColor: item.amber ? 'var(--c-copper)' : 'var(--c-emerald)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] leading-relaxed" style={{ color: 'var(--c-muted-2)' }}>
            O custo de oportunidade (em âmbar) é o rendimento que o capital investido no carro geraria na Selic ({(RATES.selic * 100).toFixed(1)}% a.a.). Não é dinheiro que sai do bolso — é dinheiro que deixa de entrar.
          </p>
        </div>

        <SectionDivider label="Ponto de Equilibrio" />

        {/* Break-even card */}
        <div className="rounded-2xl border p-5 space-y-4"
          style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
          <div className="text-center space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              Ponto de equilibrio
            </p>
            <p className="text-4xl font-black tabular-nums" style={{ color: 'var(--c-emerald)' }}>
              {breakEvenFinite
                ? `${Math.round(results.breakEvenKm).toLocaleString('pt-BR')} km/mês`
                : 'Uber sempre mais caro'}
            </p>
            <p className="text-xs" style={{ color: 'var(--c-muted)' }}>
              {breakEvenFinite
                ? `Abaixo desse volume, Uber + Transporte Público é mais barato. Você roda ${kmPerMonth.toLocaleString('pt-BR')} km/mês.`
                : 'Neste cenário, o carro é sempre mais econômico para qualquer volume de km.'}
            </p>
          </div>

          {/* Recharts Line Chart */}
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={results.breakEvenChart} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" opacity={0.6} />
              <XAxis dataKey="km" tick={{ fontSize: 10, fill: '#78716c' }}
                tickFormatter={v => `${v}km`} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#78716c' }}
                tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`}
                width={44} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(v, name) => [
                  formatBRL(Number(v)),
                  name === 'carCost' ? 'Carro' : 'Uber + Transp. Público',
                ]}
                labelFormatter={label => `${label} km/mês`}
                contentStyle={{
                  backgroundColor: 'var(--c-card-calm)',
                  color: 'var(--c-ink)',
                  borderColor: 'var(--c-line)',
                  borderRadius: 12, fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="carCost" name="carCost"
                stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="uberCost" name="uberCost"
                stroke="#10b981" strokeWidth={2.5} dot={false} />
              {/* User position */}
              <ReferenceLine x={kmPerMonth} stroke="#6366f1" strokeDasharray="4 3"
                label={{ value: 'Você', fontSize: 9, fill: '#6366f1', position: 'top' }} />
              {/* Break-even */}
              {breakEvenFinite && results.breakEvenKm <= 5000 && (
                <ReferenceLine x={Math.round(results.breakEvenKm)} stroke="#ef4444" strokeDasharray="4 3"
                  label={{ value: 'Equilibrio', fontSize: 9, fill: '#ef4444', position: 'insideTopLeft' }} />
              )}
            </LineChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex gap-4 justify-center text-[10px] font-bold flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 inline-block rounded" style={{ backgroundColor: '#f59e0b' }} />
              <span style={{ color: '#f59e0b' }}>Carro</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 inline-block rounded" style={{ backgroundColor: '#10b981' }} />
              <span style={{ color: '#10b981' }}>Uber + Transp. Público</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 inline-block rounded" style={{ backgroundColor: '#6366f1', borderTop: '2px dashed #6366f1', background: 'none' }} />
              <span style={{ color: '#6366f1' }}>Seu uso atual</span>
            </span>
            {breakEvenFinite && (
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 inline-block rounded" style={{ backgroundColor: '#ef4444', borderTop: '2px dashed #ef4444', background: 'none' }} />
                <span style={{ color: '#ef4444' }}>Ponto de equilibrio</span>
              </span>
            )}
          </div>
        </div>

        <SectionDivider label="Projecao de 5 Anos" />

        {/* 5-year metrics */}
        <MetricGrid metrics={[
          {
            label:      'Total — Carro (5 anos)',
            value:      formatBRL(results.fiveYear.netCarCost),
            sublabel:   'custo liquido (deduzido valor residual)',
            colorClass: 'text-amber-600 dark:text-amber-400',
          },
          {
            label:      'Total — Uber + Transp. Público (5 anos)',
            value:      formatBRL(results.fiveYear.totalUberTP),
            sublabel:   'corrigido pela inflacao anual',
            colorClass: 'text-emerald-600 dark:text-emerald-400',
          },
          {
            label:      'Custo de oportunidade (Selic)',
            value:      formatBRL(results.fiveYear.selicGainTotal),
            sublabel:   `rendimento potencial em 5 anos a ${(RATES.selic * 100).toFixed(1)}% a.a.`,
            colorClass: 'text-amber-700 dark:text-amber-400',
          },
        ]} />

        {/* Insight card */}
        <div className="rounded-2xl border p-4 flex gap-3"
          style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)' }}>
          <TrendingDown className="shrink-0 text-amber-500" size={20} />
          <div className="text-xs leading-relaxed" style={{ color: 'var(--c-ink)' }}>
            <p className="font-extrabold text-amber-700 dark:text-amber-300 text-sm mb-1">
              E se você investisse o valor do carro?
            </p>
            <p>
              Aplicando {formatBRL(carValue)} na Selic a {(RATES.selic * 100).toFixed(1)}% a.a., você acumularia{' '}
              <strong>{formatBRL(results.fiveYear.selicGainTotal)}</strong> em juros nos proximos 5 anos —
              suficiente para pagar {formatBRL(results.fiveYear.totalUberTP)} de Uber + Transporte Público
              {results.fiveYear.selicGainTotal > results.fiveYear.totalUberTP
                ? ' com sobra.'
                : ' parcialmente.'}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] leading-relaxed text-center" style={{ color: 'var(--c-muted-2)' }}>
          Cálculo não inclui multas de trânsito, gastos com viagens longas ou custos extras de Uber em horários de pico.
          Valores de referência — consulte cotações reais para decisões de compra.
        </p>

        {/* Share card */}
        <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
            Compartilhe o resultado
          </p>
          <ScaledPreview>
            <ShareCardBase
              id="uber-car-share-card"
              eyebrow="Uber vs. Carro Proprio"
              mainValue={
                results.winner === 'tie'
                  ? 'EMPATE'
                  : results.winner === 'car'
                  ? `CARRO -${formatBRL(diff)}`
                  : `UBER + TRANSP. PÚBLICO -${formatBRL(diff)}`
              }
              mainLabel={`por mês com ${kmPerMonth.toLocaleString('pt-BR')} km rodados`}
              metrics={[
                { label: 'Custo carro/mês',  value: formatBRL(results.carMonthly.total) },
                { label: 'Custo Uber + Transp. Público/mês', value: formatBRL(results.uberTpMonthly.total) },
                { label: 'Ponto de equilibrio', value: breakEvenFinite ? `${Math.round(results.breakEvenKm).toLocaleString('pt-BR')} km` : 'Uber sempre +' },
                { label: 'Oportunidade 5a', value: formatBRL(results.fiveYear.selicGainTotal) },
              ]}
              footer="Você sabe o custo real do seu carro?"
              accentColor={results.winner === 'car' ? '#10b981' : '#f59e0b'}
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
