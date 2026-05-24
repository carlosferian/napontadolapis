'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { SavingsChart } from '@/components/ui/SavingsChart'
import { TravelShareCard } from '@/components/share/TravelShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { destinations, TRAVEL_CONFIG, type Destination, type TravelStyle } from '@/config/travel'
import { calculateTripCost } from '@/lib/calculations/travel'
import { calculateSavingsPlan } from '@/lib/calculations/savings'
import { formatBRL, formatPct } from '@/lib/formatters'

const STYLE_OPTIONS: { key: TravelStyle; label: string; description: string; icon: string }[] = [
  { key: 'budget', label: 'Econômico', description: 'hostel, airbnb, comida local, transporte público', icon: '🎒' },
  { key: 'mid', label: 'Confortável', description: 'hotel 3★, restaurantes, alguns táxis', icon: '🏨' },
  { key: 'premium', label: 'Premium', description: 'hotel 4–5★, experiências, conforto', icon: '💎' },
]

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
  const [style, setStyle] = useState<TravelStyle>(TRAVEL_CONFIG.defaultStyle)
  const [exchangeRate, setExchangeRate] = useState(TRAVEL_CONFIG.defaultUSDtoBRL)
  const [monthsToSave, setMonthsToSave] = useState(TRAVEL_CONFIG.defaultMonthsToSave)
  const [selicRate, setSelicRate] = useState(TRAVEL_CONFIG.selicAnnual * 100)
  const [showRateEditor, setShowRateEditor] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const destination = useMemo(
    () => destinations.find((d) => d.id === selectedId) ?? destinations[0],
    [selectedId]
  )

  const tripCost = useMemo(
    () => calculateTripCost({ destination, travelers, days, style, exchangeRate }),
    [destination, travelers, days, style, exchangeRate]
  )

  const savingsPlan = useMemo(
    () => calculateSavingsPlan(tripCost.grandTotalFintechWithMargin, monthsToSave, selicRate / 100),
    [tripCost.grandTotalFintechWithMargin, monthsToSave, selicRate]
  )

  const currentStyle = STYLE_OPTIONS.find((s) => s.key === style)!

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

        {/* Travelers + days — stacked on mobile, side by side on sm+ */}
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
          <div className="grid grid-cols-3 gap-2">
            {STYLE_OPTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setStyle(s.key)}
                className={`py-3 px-2 rounded-xl text-sm font-semibold border transition-colors flex flex-col items-center gap-1 ${
                  style === s.key
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'
                }`}
              >
                <span className="text-lg">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-stone-400 italic">{currentStyle.description}</p>
        </div>
      </CalculatorCard>

      {/* ── RESULTS ─────────────────────────────────────── */}
      <div role="region" aria-live="polite" aria-label="Resultado do cálculo" className="space-y-4">

        {/* Main trip cost summary card */}
        <div className="rounded-2xl border border-stone-100 overflow-hidden bg-white">
          {/* Trip tag */}
          <div className="px-5 pt-4 pb-3 border-b border-stone-50 flex items-center gap-2 flex-wrap">
            <span className="text-xl">{destination.flag}</span>
            <span className="text-sm font-semibold text-stone-700">{destination.name}</span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-400">{days}d · {travelers}p · {currentStyle.icon} {currentStyle.label}</span>
          </div>

          {/* Goal number */}
          <div className="px-5 pt-5 pb-4">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Meta da viagem</p>
            <p className="text-4xl sm:text-5xl font-bold tabular-nums font-serif text-amber-500 leading-none">
              {formatBRL(tripCost.grandTotalFintechWithMargin)}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              {tripCost.isDomestic
                ? 'em reais · inclui margem de segurança de 15%'
                : 'com fintech · inclui margem de segurança de 15%'}
            </p>
          </div>

          {/* Payment comparison — international only */}
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
                <span className="text-stone-500 min-w-0">🏨 Hospedagem + refeições ({days}d × {travelers}p)</span>
                <span className="font-medium tabular-nums shrink-0">{formatBRL(tripCost.subtotalUSD * exchangeRate)}</span>
              </div>
              {tripCost.visaCostBRL > 0 && (
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-stone-500 min-w-0">📄 Visto ({travelers}x)</span>
                  <span className="font-medium tabular-nums shrink-0">{formatBRL(tripCost.visaCostBRL)}</span>
                </div>
              )}
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
                <span className="text-stone-600 font-medium min-w-0">Meta (+15% margem)</span>
                <span className="font-bold text-amber-500 tabular-nums shrink-0">{formatBRL(tripCost.grandTotalFintechWithMargin)}</span>
              </div>
            </div>
          )}
        </div>

        <SectionDivider label="Plano de poupança" />

        {/* Months slider */}
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

        {/* Savings summary card — replaces ResultHero + MetricGrid */}
        <div className="rounded-2xl border border-stone-100 overflow-hidden bg-white">
          {/* Hero */}
          <div className="px-5 py-6 text-center border-b border-stone-50">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Poupar por mês</p>
            <p className={`text-5xl font-bold tabular-nums font-serif leading-none ${savingsPlan.monthlyWithSelic < 2000 ? 'text-emerald-600' : 'text-amber-500'}`}>
              {formatBRL(savingsPlan.monthlyWithSelic)}
            </p>
            <p className="text-xs text-stone-400 mt-2">investindo na Selic · {selicRate.toFixed(2)}% a.a.</p>
            <p className="text-sm font-hand text-stone-500 mt-3 italic">{getSavingsComment(savingsPlan.monthlyWithSelic)}</p>
          </div>

          {/* Comparison rows */}
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

        {/* Evolution chart */}
        <SavingsChart
          data={savingsPlan.monthlyBreakdown}
          target={tripCost.grandTotalFintechWithMargin}
        />

        {/* Rate editor */}
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

        {/* Reminders */}
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

        {/* Share card */}
        <div className="bg-stone-50 rounded-2xl p-4">
          <p className="text-xs text-stone-400 mb-3 text-center">Compartilhe o resultado</p>
          <ScaledPreview>
            <TravelShareCard
              destination={destination}
              travelers={travelers}
              days={days}
              style={style}
              totalBRL={tripCost.grandTotalFintechWithMargin}
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
