'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { SavingsChart } from '@/components/ui/SavingsChart'
import { TravelShareCard } from '@/components/share/TravelShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { destinations, TRAVEL_CONFIG, type Destination, type TravelStyle } from '@/config/travel'
import { calculateTripCost } from '@/lib/calculations/travel'
import { calculateSavingsPlan } from '@/lib/calculations/savings'
import { formatBRL, formatPct } from '@/lib/formatters'

type StyleKey = TravelStyle | 'custom'

interface StyleOption {
  key: StyleKey
  label: string
  icon: string
}

const STYLE_OPTIONS: StyleOption[] = [
  { key: 'budget', label: 'Econômico', icon: '🎒' },
  { key: 'mid', label: 'Confortável', icon: '🏨' },
  { key: 'premium', label: 'Premium', icon: '💎' },
  { key: 'custom', label: 'Personalizado', icon: '✏️' },
]

const STYLE_BREAKDOWN: Record<TravelStyle, { icon: string; label: string; detail: string }[]> = {
  budget: [
    { icon: '🛏', label: 'Hospedagem', detail: 'hostel, airbnb, quarto compartilhado ou dorm' },
    { icon: '🍜', label: 'Alimentação', detail: 'comida de rua, mercado, restaurantes populares' },
    { icon: '🚌', label: 'Transporte', detail: 'metrô, ônibus, caminhada sempre que possível' },
    { icon: '🎭', label: 'Atividades', detail: 'parques, praias, atrações gratuitas, museus básicos' },
  ],
  mid: [
    { icon: '🏨', label: 'Hospedagem', detail: 'hotel 3★ ou apart bem localizado (quarto duplo)' },
    { icon: '🍽', label: 'Alimentação', detail: 'restaurantes variados, cafés, almoços executivos' },
    { icon: '🚕', label: 'Transporte', detail: 'metrô + Uber/taxi ocasional, day pass de transporte' },
    { icon: '🎫', label: 'Atividades', detail: 'museus, tours guiados, ingressos pagos, passeios de barco' },
  ],
  premium: [
    { icon: '🏰', label: 'Hospedagem', detail: 'hotel 4–5★, boutique hotel ou suite' },
    { icon: '🍷', label: 'Alimentação', detail: 'restaurantes sofisticados, experiências gastronômicas, room service' },
    { icon: '🚗', label: 'Transporte', detail: 'taxi, Uber Black, transfers privados, aluguel de carro' },
    { icon: '✨', label: 'Atividades', detail: 'experiências exclusivas, spas, shows, safáris, voos panorâmicos' },
  ],
}

function getSavingsComment(monthly: number): string {
  if (monthly < 500) return 'dá pra chegar lá. a conta mostra como.'
  if (monthly < 1500) return 'vai precisar de disciplina. mas é possível.'
  if (monthly < 3000) return 'um esforço e tanto. vale a pena planejar.'
  return 'meta ambiciosa. o planejamento começa aqui.'
}

function getSharePhrase(months: number): string {
  if (months <= 6) return 'em breve. a conta fechou.'
  if (months <= 12) return 'um ano de foco. vale a pena.'
  if (months <= 18) return 'minha próxima viagem tem data marcada.'
  if (months <= 24) return 'dois anos de plano. destino certo.'
  return 'o sonho tem prazo. isso já é progresso.'
}

interface TravelCalculatorProps {
  initialDestination?: Destination
}

export function TravelCalculator({ initialDestination }: TravelCalculatorProps) {
  const defaultDest = initialDestination ?? destinations[0]

  const [selectedId, setSelectedId] = useState(defaultDest.id)
  const [travelers, setTravelers] = useState(TRAVEL_CONFIG.defaultTravelers)
  const [days, setDays] = useState(defaultDest.typicalDays.recommended)
  const [styleKey, setStyleKey] = useState<StyleKey>(TRAVEL_CONFIG.defaultStyle)
  const [exchangeRate, setExchangeRate] = useState(TRAVEL_CONFIG.defaultUSDtoBRL)
  const [monthsToSave, setMonthsToSave] = useState(TRAVEL_CONFIG.defaultMonthsToSave)
  const [selicRate, setSelicRate] = useState(TRAVEL_CONFIG.selicAnnual * 100)
  const [showRateEditor, setShowRateEditor] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [extras, setExtras] = useState<{ id: number; label: string; amountBRL: number }[]>([])
  const [extraLabel, setExtraLabel] = useState('')
  const [extraAmount, setExtraAmount] = useState('')
  const [showExtras, setShowExtras] = useState(false)
  const [editingExtraId, setEditingExtraId] = useState<number | null>(null)
  const [editExtraLabel, setEditExtraLabel] = useState('')
  const [editExtraAmount, setEditExtraAmount] = useState('')

  // Custom style state — pre-populated when switching to custom
  const [customDailyBRL, setCustomDailyBRL] = useState(
    Math.round(defaultDest.dailyCostUSD['mid'] * TRAVEL_CONFIG.defaultUSDtoBRL)
  )
  const [customFlightTotalBRL, setCustomFlightTotalBRL] = useState(
    defaultDest.flightFromGRU.typical * TRAVEL_CONFIG.defaultTravelers
  )

  const destination = useMemo(
    () => destinations.find((d) => d.id === selectedId) ?? destinations[0],
    [selectedId]
  )

  function handleStyleChange(key: StyleKey) {
    if (key === 'custom' && styleKey !== 'custom') {
      // styleKey is narrowed to TravelStyle here — safe to index dailyCostUSD
      setCustomDailyBRL(Math.round(destination.dailyCostUSD[styleKey] * exchangeRate))
      setCustomFlightTotalBRL(Math.round(destination.flightFromGRU.typical * travelers))
    }
    setStyleKey(key)
  }

  const effectiveStyle: TravelStyle = styleKey === 'custom' ? 'mid' : styleKey

  const tripCost = useMemo(
    () =>
      calculateTripCost({
        destination,
        travelers,
        days,
        style: effectiveStyle,
        exchangeRate,
        ...(styleKey === 'custom'
          ? { isCustom: true, customDailyBRL, customFlightTotalBRL }
          : {}),
      }),
    [destination, travelers, days, effectiveStyle, exchangeRate, styleKey, customDailyBRL, customFlightTotalBRL]
  )

  const extrasTotalBRL = useMemo(
    () => extras.reduce((sum, e) => sum + e.amountBRL, 0),
    [extras]
  )

  const grandTotal = tripCost.grandTotalFintechWithMargin + extrasTotalBRL

  const savingsPlan = useMemo(
    () => calculateSavingsPlan(grandTotal, monthsToSave, selicRate / 100),
    [grandTotal, monthsToSave, selicRate]
  )

  const currentStyleOption = STYLE_OPTIONS.find((s) => s.key === styleKey)!

  function addExtra() {
    const label = extraLabel.trim()
    const amount = parseFloat(extraAmount.replace(',', '.'))
    if (!label || isNaN(amount) || amount <= 0) return
    setExtras((prev) => [...prev, { id: Date.now(), label, amountBRL: amount }])
    setExtraLabel('')
    setExtraAmount('')
  }

  function removeExtra(id: number) {
    setExtras((prev) => prev.filter((e) => e.id !== id))
  }

  function startEditExtra(e: { id: number; label: string; amountBRL: number }) {
    setEditingExtraId(e.id)
    setEditExtraLabel(e.label)
    setEditExtraAmount(String(e.amountBRL))
  }

  function saveEditExtra(id: number) {
    const label = editExtraLabel.trim()
    const amount = parseFloat(editExtraAmount.replace(',', '.'))
    if (!label || isNaN(amount) || amount <= 0) return
    setExtras((prev) => prev.map((e) => e.id === id ? { ...e, label, amountBRL: amount } : e))
    setEditingExtraId(null)
  }

  function handleClear() {
    const def = initialDestination ?? destinations[0]
    setSelectedId(def.id)
    setTravelers(TRAVEL_CONFIG.defaultTravelers)
    setDays(def.typicalDays.recommended)
    setStyleKey(TRAVEL_CONFIG.defaultStyle)
    setExchangeRate(TRAVEL_CONFIG.defaultUSDtoBRL)
    setMonthsToSave(TRAVEL_CONFIG.defaultMonthsToSave)
    setSelicRate(TRAVEL_CONFIG.selicAnnual * 100)
    setShowRateEditor(false)
    setShowBreakdown(false)
    setExtras([])
    setExtraLabel('')
    setExtraAmount('')
    setShowExtras(false)
    setCustomDailyBRL(Math.round(def.dailyCostUSD['mid'] * TRAVEL_CONFIG.defaultUSDtoBRL))
    setCustomFlightTotalBRL(def.flightFromGRU.typical * TRAVEL_CONFIG.defaultTravelers)
  }

  function exportTable() {
    const styleLabel = STYLE_OPTIONS.find((s) => s.key === styleKey)?.label ?? styleKey
    const lines = [
      `VIAGEM: ${destination.flag} ${destination.name}, ${destination.country}`,
      `Viajantes: ${travelers} pessoa${travelers !== 1 ? 's' : ''} | Dias: ${days} | Estilo: ${styleLabel}`,
      `Câmbio: R$ ${exchangeRate.toFixed(2)}/USD`,
      '',
      '─── CUSTO DA VIAGEM ───────────────────────',
      `Passagem aérea (${travelers}x, ida e volta)    ${formatBRL(tripCost.flightBRL)}`,
      `Hospedagem (${days}d, quarto compartilhado)  ${formatBRL(tripCost.accommodationUSD * exchangeRate)}`,
      `Alimentação + atividades (${days}d × ${travelers}p)  ${formatBRL(tripCost.variableUSD * exchangeRate)}`,
      ...(tripCost.visaCostBRL > 0 ? [`Visto (${travelers}x)                        ${formatBRL(tripCost.visaCostBRL)}`] : []),
      ...extras.map((e) => `${e.label.padEnd(36)} ${formatBRL(e.amountBRL)}`),
      '',
      ...(!tripCost.isDomestic ? [
        `IOF + spread (cartão tradicional)     +${formatBRL(tripCost.iofAndSpreadBRL)}`,
        `Taxa fintech (~1,5%)                  +${formatBRL(tripCost.fintechFeeBRL)}`,
        '',
        `TOTAL — cartão tradicional            ${formatBRL(tripCost.grandTotalCard)}`,
        `TOTAL — fintech (Wise/Nomad)          ${formatBRL(tripCost.grandTotalFintech)}`,
        `Economia com fintech                  ${formatBRL(tripCost.savingsWithFintech)}`,
        '',
      ] : []),
      `META (com margem de 15%)              ${formatBRL(grandTotal)}`,
      '',
      '─── PLANO DE POUPANÇA ─────────────────────',
      `Prazo desejado                        ${monthsToSave} meses`,
      `Poupar por mês (sem investir)         ${formatBRL(savingsPlan.monthlyWithoutInvestment)}`,
      `Poupar por mês (Selic ${selicRate.toFixed(2)}% a.a.)   ${formatBRL(savingsPlan.monthlyWithSelic)}`,
      `Economia total com Selic              ${formatBRL(savingsPlan.savingsWithInvestment)}`,
      '',
      `Calculado em apontadolapis.com.br | ${new Date().toLocaleDateString('pt-BR')}`,
    ]
    const text = lines.join('\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `viagem-${destination.id}-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const breakdownCategories = styleKey !== 'custom' ? STYLE_BREAKDOWN[styleKey] : null
  const dailyBRLReference = styleKey !== 'custom'
    ? destination.dailyCostUSD[styleKey] * exchangeRate
    : customDailyBRL

  return (
    <div className="space-y-4">
      {/* ── INPUTS ─────────────────────────────────────── */}
      <CalculatorCard title="Calculadora da Viagem dos Sonhos" subtitle="Sem ilusão, sem susto. Só o número real.">

        {/* Destination */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-600">Destino</label>
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value)
              const dest = destinations.find((d) => d.id === e.target.value)
              if (dest) setDays(dest.typicalDays.recommended)
            }}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.flag} {d.name}, {d.country}
              </option>
            ))}
          </select>
          {destination.highlight && (
            <p className="text-xs italic text-stone-400 pl-1">{destination.highlight}</p>
          )}
          {destination.visa.required && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700">
              ⚠ {destination.visa.notes ?? 'Visto necessário'} — custo: US$ {destination.visa.costUSD}/pessoa
            </div>
          )}
        </div>

        {/* Travelers + days */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SliderField
            id="travelers"
            label="Viajantes"
            value={travelers}
            min={1}
            max={8}
            step={1}
            onChange={setTravelers}
            formatValue={(v) => `${v} pessoa${v !== 1 ? 's' : ''}`}
          />
          <SliderField
            id="days"
            label="Dias de viagem"
            value={days}
            min={3}
            max={30}
            step={1}
            onChange={setDays}
            formatValue={(v) => `${v} dias`}
          />
        </div>

        {/* Travel style */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-stone-600">Estilo de viagem</label>

          {/* Top row: 3 preset styles */}
          <div className="grid grid-cols-3 gap-2">
            {STYLE_OPTIONS.filter((s) => s.key !== 'custom').map((s) => (
              <button
                key={s.key}
                onClick={() => handleStyleChange(s.key)}
                className={`py-3 px-2 rounded-xl text-sm font-semibold border transition-colors flex flex-col items-center gap-1 ${
                  styleKey === s.key
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'
                }`}
              >
                <span className="text-lg">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Personalizado button — full width */}
          <button
            onClick={() => handleStyleChange('custom')}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold border transition-colors flex items-center justify-center gap-2 ${
              styleKey === 'custom'
                ? 'bg-stone-800 text-white border-stone-800'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700'
            }`}
          >
            <span>✏️</span>
            <span>Personalizado — eu sei os valores exatos</span>
          </button>

          {/* Style detail: breakdown card for preset, custom inputs for custom */}
          {styleKey !== 'custom' && breakdownCategories ? (
            <div className="rounded-xl bg-stone-50 border border-stone-100 p-3 space-y-2">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">O que está incluído</p>
                <p className="text-[10px] text-stone-400">
                  ≈ {formatBRL(dailyBRLReference)}<span className="text-stone-300">/pessoa/dia</span>
                </p>
              </div>
              <div className="space-y-2">
                {breakdownCategories.map((cat) => (
                  <div key={cat.label} className="flex items-start gap-2.5">
                    <span className="text-sm w-5 shrink-0 mt-px">{cat.icon}</span>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-stone-600">{cat.label}</span>
                      <span className="text-xs text-stone-400"> · {cat.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-stone-400 italic pt-0.5">
                Hospedagem calculada por quarto, compartilhada entre os viajantes.
              </p>
            </div>
          ) : styleKey === 'custom' ? (
            <div className="rounded-xl bg-stone-50 border border-stone-100 p-4 space-y-4">
              <p className="text-xs text-stone-500 leading-relaxed">
                Informe seus próprios valores. Pesquise no Google Flights, Booking, Airbnb e some tudo aqui.
              </p>

              {/* Custom daily cost */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                  Custo diário por pessoa
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">R$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={1}
                    value={customDailyBRL}
                    onChange={(e) => setCustomDailyBRL(Number(e.target.value) || 0)}
                    className="w-full border border-stone-200 rounded-xl pl-9 pr-4 py-3 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-lg font-semibold tabular-nums"
                  />
                </div>
                <p className="text-[10px] text-stone-400">
                  Hospedagem + alimentação + transporte local + atividades. A hospedagem é dividida entre os viajantes.
                </p>
              </div>

              {/* Custom flight */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                  Passagem aérea — total ida e volta
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">R$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={customFlightTotalBRL}
                    onChange={(e) => setCustomFlightTotalBRL(Number(e.target.value) || 0)}
                    className="w-full border border-stone-200 rounded-xl pl-9 pr-4 py-3 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-lg font-semibold tabular-nums"
                  />
                </div>
                <p className="text-[10px] text-stone-400">
                  Total para {travelers} pessoa{travelers !== 1 ? 's' : ''}, ida e volta. Pesquise no Google Flights com datas flexíveis.
                </p>
              </div>

              {/* Custom summary hint */}
              <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                <p className="text-xs text-amber-700">
                  Custo total estimado (sem voo, sem margem):{' '}
                  <strong>
                    {formatBRL(customDailyBRL * 0.45 * days + customDailyBRL * 0.55 * days * travelers)}
                  </strong>{' '}
                  · {travelers}p × {days}d
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Extras */}
        <div className="rounded-xl border border-stone-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowExtras((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-stone-50 transition-colors"
          >
            <span className="text-sm font-medium text-stone-600">
              Despesas extras
              {extras.length > 0 && (
                <span className="ml-2 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  +{formatBRL(extrasTotalBRL)}
                </span>
              )}
            </span>
            <span className="text-stone-400 text-xs">{showExtras ? '▲' : '▼ adicionar'}</span>
          </button>

          {showExtras && (
            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-stone-100 bg-stone-50/50">
              <p className="text-xs text-stone-400 pt-1">
                Seguro viagem, city tax, passeios, ingressos, equipamentos — qualquer custo que não está no modelo base.
              </p>
              {extras.length > 0 && (
                <div className="space-y-1.5">
                  {extras.map((e) => (
                    <div key={e.id} className="bg-white rounded-lg border border-stone-100">
                      {editingExtraId === e.id ? (
                        <div className="flex items-center gap-2 px-3 py-2">
                          <input
                            type="text"
                            value={editExtraLabel}
                            onChange={(ev) => setEditExtraLabel(ev.target.value)}
                            onKeyDown={(ev) => ev.key === 'Enter' && saveEditExtra(e.id)}
                            className="flex-1 min-w-0 border border-stone-200 rounded-lg px-2 py-1 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                          <div className="relative shrink-0 w-24">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-400 text-xs">R$</span>
                            <input
                              type="number"
                              value={editExtraAmount}
                              onChange={(ev) => setEditExtraAmount(ev.target.value)}
                              onKeyDown={(ev) => ev.key === 'Enter' && saveEditExtra(e.id)}
                              className="w-full border border-stone-200 rounded-lg pl-7 pr-2 py-1 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 tabular-nums"
                            />
                          </div>
                          <button onClick={() => saveEditExtra(e.id)} className="text-xs text-amber-600 font-semibold hover:text-amber-700 shrink-0">Salvar</button>
                          <button onClick={() => setEditingExtraId(null)} className="text-xs text-stone-400 hover:text-stone-600 shrink-0">✕</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 px-3 py-2">
                          <span className="text-sm text-stone-700 flex-1 min-w-0 truncate">{e.label}</span>
                          <span className="text-sm font-semibold text-stone-800 tabular-nums shrink-0">{formatBRL(e.amountBRL)}</span>
                          <button
                            onClick={() => startEditExtra(e)}
                            className="text-stone-300 hover:text-amber-500 transition-colors ml-1 text-sm leading-none"
                            aria-label="Editar"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => removeExtra(e.id)}
                            className="text-stone-300 hover:text-red-400 transition-colors text-base leading-none"
                            aria-label="Remover"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={extraLabel}
                  onChange={(e) => setExtraLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addExtra()}
                  placeholder="Ex: Seguro viagem"
                  className="flex-1 min-w-0 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <div className="relative shrink-0 w-28">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">R$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={extraAmount}
                    onChange={(e) => setExtraAmount(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addExtra()}
                    placeholder="0"
                    className="w-full border border-stone-200 rounded-lg pl-7 pr-2 py-2 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 tabular-nums"
                  />
                </div>
                <button
                  onClick={addExtra}
                  className="shrink-0 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </CalculatorCard>

      {/* ── ACTIONS ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleClear}
          className="text-xs text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          ✕ Limpar dados
        </button>
        <button
          onClick={exportTable}
          className="text-xs text-stone-500 hover:text-stone-700 transition-colors flex items-center gap-1.5 border border-stone-200 hover:border-stone-400 rounded-lg px-3 py-1.5"
        >
          ↓ Exportar tabela
        </button>
      </div>

      {/* ── RESULTS ─────────────────────────────────────── */}
      <div role="region" aria-live="polite" aria-label="Resultado do cálculo" className="space-y-4">

        {/* Main trip cost summary card */}
        <div className="rounded-2xl border border-stone-100 overflow-hidden bg-white">
          <div className="px-5 pt-4 pb-3 border-b border-stone-50 flex items-center gap-2 flex-wrap">
            <span className="text-xl">{destination.flag}</span>
            <span className="text-sm font-semibold text-stone-700">{destination.name}</span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-400">
              {days}d · {travelers}p · {currentStyleOption.icon} {currentStyleOption.label}
            </span>
          </div>

          <div className="px-5 pt-5 pb-4">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Meta da viagem</p>
            <p className="text-4xl sm:text-5xl font-bold tabular-nums font-serif text-amber-500 leading-none">
              {formatBRL(grandTotal)}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              {tripCost.isDomestic
                ? 'em reais · inclui margem de segurança de 15%'
                : 'com fintech · inclui margem de segurança de 15%'}
              {extrasTotalBRL > 0 && ` · +${formatBRL(extrasTotalBRL)} extras`}
            </p>
          </div>

          {!tripCost.isDomestic ? (
            <div className="mx-5 mb-5 rounded-xl overflow-hidden border border-stone-100">
              <div className="grid grid-cols-2">
                <div className="p-3 sm:p-4 bg-emerald-50 border-r border-stone-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Wise / Nomad</p>
                  <p className="text-lg sm:text-xl font-bold tabular-nums text-emerald-700 leading-none">{formatBRL(tripCost.grandTotalFintech)}</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">sem IOF</p>
                </div>
                <div className="p-3 sm:p-4 bg-red-50/60">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-1">Cartão tradicional</p>
                  <p className="text-lg sm:text-xl font-bold tabular-nums text-red-500 leading-none">{formatBRL(tripCost.grandTotalCard)}</p>
                  <p className="text-[10px] text-red-400 mt-0.5">+{formatBRL(tripCost.savingsWithFintech)} com IOF</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 flex items-center justify-center gap-1.5">
                <span className="text-xs text-stone-500">economia usando fintech:</span>
                <span className="text-xs font-bold text-emerald-600">{formatBRL(tripCost.savingsWithFintech)} ({formatPct(tripCost.savingsPct)})</span>
              </div>
            </div>
          ) : (
            <div className="mx-5 mb-5 px-4 py-3 rounded-xl bg-stone-50 border border-stone-100">
              <p className="text-xs text-stone-500 leading-relaxed">
                Destino nacional — pagamentos em reais. IOF de câmbio e fintechs internacionais não se aplicam. Use o cartão que preferir.
              </p>
            </div>
          )}
        </div>

        {/* Breakdown collapsible */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <button
            onClick={() => setShowBreakdown((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-stone-50 transition-colors"
          >
            <span className="text-sm font-medium text-stone-600">Detalhamento dos custos</span>
            <span className="text-stone-400 text-sm">{showBreakdown ? '▲' : '▼'}</span>
          </button>
          {showBreakdown && (
            <div className="px-5 pb-4 space-y-2 border-t border-stone-50">
              <div className="flex items-center justify-between gap-3 text-sm pt-3">
                <span className="text-stone-500 min-w-0">✈ Voo ({travelers}x, ida e volta)</span>
                <span className="font-medium tabular-nums shrink-0">{formatBRL(tripCost.flightBRL)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-stone-500 min-w-0">🏨 Hospedagem ({days}d, quarto compartilhado)</span>
                <span className="font-medium tabular-nums shrink-0">{formatBRL(tripCost.accommodationUSD * exchangeRate)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-stone-500 min-w-0">🍽 Alimentação + atividades ({days}d × {travelers}p)</span>
                <span className="font-medium tabular-nums shrink-0">{formatBRL(tripCost.variableUSD * exchangeRate)}</span>
              </div>
              {tripCost.visaCostBRL > 0 && (
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-stone-500 min-w-0">📄 Visto ({travelers}x)</span>
                  <span className="font-medium tabular-nums shrink-0">{formatBRL(tripCost.visaCostBRL)}</span>
                </div>
              )}
              {extras.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-stone-500 min-w-0">+ {e.label}</span>
                  <span className="font-medium tabular-nums shrink-0">{formatBRL(e.amountBRL)}</span>
                </div>
              ))}
              {!tripCost.isDomestic && (
                <div className="border-t border-stone-100 pt-2 mt-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-red-400 min-w-0">+ IOF + spread bancário (cartão)</span>
                    <span className="text-red-500 font-medium tabular-nums shrink-0">+{formatBRL(tripCost.iofAndSpreadBRL)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-emerald-600 min-w-0">+ Taxa fintech (~1,5%)</span>
                    <span className="text-emerald-600 font-medium tabular-nums shrink-0">+{formatBRL(tripCost.fintechFeeBRL)}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between gap-3 text-sm border-t border-stone-100 pt-2 mt-1">
                <span className="text-stone-600 font-medium min-w-0">Meta (+15% margem{extrasTotalBRL > 0 ? ' + extras' : ''})</span>
                <span className="font-bold text-amber-500 tabular-nums shrink-0">{formatBRL(grandTotal)}</span>
              </div>
            </div>
          )}
        </div>

        <SectionDivider label="Plano de poupança" />

        <div className="bg-white rounded-2xl border border-stone-100 p-5">
          <SliderField
            id="months-save"
            label="Quando você quer viajar?"
            value={monthsToSave}
            min={6}
            max={36}
            step={1}
            onChange={setMonthsToSave}
            formatValue={(v) => `em ${v} meses`}
          />
        </div>

        <div className="rounded-2xl border border-stone-100 overflow-hidden bg-white">
          <div className="px-5 py-6 text-center border-b border-stone-50">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Poupar por mês</p>
            <p className={`text-5xl font-bold tabular-nums font-serif leading-none ${savingsPlan.monthlyWithSelic < 2000 ? 'text-emerald-600' : 'text-amber-500'}`}>
              {formatBRL(savingsPlan.monthlyWithSelic)}
            </p>
            <p className="text-xs text-stone-400 mt-2">investindo na Selic · {selicRate.toFixed(2)}% a.a.</p>
            <p className="text-sm font-hand text-stone-500 mt-3 italic">{getSavingsComment(savingsPlan.monthlyWithSelic)}</p>
          </div>
          <div className="divide-y divide-stone-50">
            <div className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-xs font-semibold text-stone-500">Sem investir</p>
                <p className="text-[10px] text-stone-400">poupança simples</p>
              </div>
              <p className="text-base font-bold tabular-nums text-stone-600">{formatBRL(savingsPlan.monthlyWithoutInvestment)}</p>
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-xs font-semibold text-stone-500">Na Selic</p>
                <p className="text-[10px] text-stone-400">juros compostos mensais</p>
              </div>
              <p className="text-base font-bold tabular-nums text-emerald-600">{formatBRL(savingsPlan.monthlyWithSelic)}</p>
            </div>
            <div className="flex items-center justify-between px-5 py-3 bg-amber-50/40">
              <div>
                <p className="text-xs font-semibold text-amber-700">Você economiza</p>
                <p className="text-[10px] text-amber-600">em aportes totais</p>
              </div>
              <p className="text-base font-bold tabular-nums text-amber-600">{formatBRL(savingsPlan.savingsWithInvestment)}</p>
            </div>
          </div>
        </div>

        <SavingsChart data={savingsPlan.monthlyBreakdown} target={grandTotal} />

        <div className="bg-white rounded-2xl border border-stone-100 p-5">
          <button
            onClick={() => setShowRateEditor((v) => !v)}
            className="text-sm text-stone-500 hover:text-stone-800 transition-colors w-full text-left flex justify-between items-center"
          >
            <span>⚙ Ajustar câmbio e taxas</span>
            <span>{showRateEditor ? '▲' : '▼'}</span>
          </button>
          {showRateEditor && (
            <div className="mt-4 space-y-4">
              <SliderField
                id="exchange-rate"
                label="Câmbio USD → BRL"
                value={exchangeRate}
                min={4}
                max={8}
                step={0.05}
                onChange={setExchangeRate}
                formatValue={(v) => `R$ ${v.toFixed(2)}`}
              />
              <SliderField
                id="selic-rate"
                label="Selic (% a.a.)"
                value={selicRate}
                min={5}
                max={20}
                step={0.25}
                onChange={setSelicRate}
                formatValue={(v) => `${v.toFixed(2)}%`}
              />
              <p className="text-xs text-stone-400">
                Atualizado em {TRAVEL_CONFIG.lastUpdated}. IOF: {(TRAVEL_CONFIG.iofCreditCard * 100).toFixed(2)}% (fixo por regulação).
              </p>
            </div>
          )}
        </div>

        <div className="bg-stone-50 rounded-2xl border border-stone-100 p-4 space-y-2">
          <p className="text-xs font-medium text-stone-500">Lembretes importantes</p>
          <ul className="space-y-1 text-xs text-stone-400">
            <li>• Câmbio e preços mudam — a margem de 15% já está incluída na meta.</li>
            <li>• Passagens variam bastante. Pesquise sempre no Google Flights.</li>
            <li>• IOF pode mudar por decreto. Verifique antes de viajar.</li>
            {destination.visa.required && (
              <li>• {destination.visa.notes}. Agende com antecedência.</li>
            )}
          </ul>
        </div>

        <div className="bg-stone-50 rounded-2xl p-4">
          <p className="text-xs text-stone-400 mb-3 text-center">Compartilhe o resultado</p>
          <ScaledPreview>
            <TravelShareCard
              destination={destination}
              travelers={travelers}
              days={days}
              style={effectiveStyle}
              totalBRL={grandTotal}
              monthlyBRL={savingsPlan.monthlyWithSelic}
              months={monthsToSave}
              savingsWise={tripCost.savingsWithFintech}
              sharePhrase={getSharePhrase(monthsToSave)}
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="travel-share-card" filename="viagem" />
          </div>
        </div>

        <p className="text-xs text-stone-400 text-center">
          Valores estimados. Câmbio: R$ {exchangeRate.toFixed(2)} — {TRAVEL_CONFIG.lastUpdated}.
        </p>
      </div>
    </div>
  )
}
