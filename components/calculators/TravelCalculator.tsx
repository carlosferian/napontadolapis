'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { SavingsChart } from '@/components/ui/SavingsChart'
import { TravelShareCard } from '@/components/share/TravelShareCard'
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

  return (
    <div className="space-y-4">
      <CalculatorCard title="Calculadora da Viagem dos Sonhos" subtitle="Sem ilusão, sem susto. Só o número real.">
        {/* Destination select */}
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
        <div className="grid grid-cols-2 gap-4">
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
            label="Dias"
            value={days}
            min={3}
            max={30}
            step={1}
            onChange={setDays}
            formatValue={(v) => `${v} dias`}
          />
        </div>

        {/* Travel style */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-600">Estilo de viagem</label>
          <div className="grid grid-cols-3 gap-2">
            {STYLE_OPTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setStyle(s.key)}
                className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-colors text-left ${
                  style === s.key
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'
                }`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-stone-400 italic pl-1">
            {STYLE_OPTIONS.find((s) => s.key === style)?.description}
          </p>
        </div>
      </CalculatorCard>

      <div role="region" aria-live="polite" aria-label="Resultado do cálculo" className="space-y-4">
        <ResultHero
          label="Custo total estimado"
          value={formatBRL(tripCost.grandTotalCard)}
          comment="pagando no cartão tradicional"
          colorClass="text-red-500"
        />

        <MetricGrid
          metrics={[
            {
              label: 'Com fintech (Wise)',
              value: formatBRL(tripCost.grandTotalFintech),
              sublabel: 'sem IOF',
              colorClass: 'text-emerald-600',
            },
            {
              label: 'Com cartão',
              value: formatBRL(tripCost.grandTotalCard),
              sublabel: 'IOF + spread',
              colorClass: 'text-red-500',
            },
            {
              label: 'Economia',
              value: formatBRL(tripCost.savingsWithFintech),
              sublabel: `${formatPct(tripCost.savingsPct)} a menos`,
              colorClass: 'text-amber-500',
            },
          ]}
        />

        {/* Breakdown */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-2">
          <p className="text-sm font-medium text-stone-600 mb-3">Detalhamento</p>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Voo ({travelers}x, round trip)</span>
            <span className="font-medium tabular-nums">{formatBRL(tripCost.flightBRL)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Diárias + comida + transporte ({days}d × {travelers}p)</span>
            <span className="font-medium tabular-nums">{formatBRL(tripCost.subtotalUSD * exchangeRate)}</span>
          </div>
          {tripCost.visaCostBRL > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Visto ({travelers}x)</span>
              <span className="font-medium tabular-nums">{formatBRL(tripCost.visaCostBRL)}</span>
            </div>
          )}
          <div className="border-t border-stone-100 pt-2 mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-red-400">+ IOF + spread bancário</span>
              <span className="text-red-500 font-medium tabular-nums">+{formatBRL(tripCost.iofAndSpreadBRL)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-emerald-600">+ Taxa fintech (~1,5%)</span>
              <span className="text-emerald-600 font-medium tabular-nums">+{formatBRL(tripCost.fintechFeeBRL)}</span>
            </div>
          </div>
          <div className="border-t border-stone-100 pt-2 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-600 font-medium">Meta com margem de segurança (+15%)</span>
              <span className="font-bold text-amber-500 tabular-nums">{formatBRL(tripCost.grandTotalFintechWithMargin)}</span>
            </div>
          </div>
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

        <ResultHero
          label="Poupar por mês (investindo na Selic)"
          value={formatBRL(savingsPlan.monthlyWithSelic)}
          comment={getSavingsComment(savingsPlan.monthlyWithSelic)}
          colorClass={savingsPlan.monthlyWithSelic < 2000 ? 'text-emerald-600' : 'text-amber-500'}
        />

        <MetricGrid
          metrics={[
            {
              label: 'Sem investir',
              value: formatBRL(savingsPlan.monthlyWithoutInvestment),
              sublabel: 'poupança simples',
              colorClass: 'text-stone-600',
            },
            {
              label: 'Na Selic',
              value: formatBRL(savingsPlan.monthlyWithSelic),
              sublabel: `${selicRate.toFixed(2)}% a.a.`,
              colorClass: 'text-emerald-600',
            },
            {
              label: 'Economia total',
              value: formatBRL(savingsPlan.savingsWithInvestment),
              sublabel: 'com juros compostos',
              colorClass: 'text-amber-500',
            },
          ]}
        />

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

        {/* Warnings */}
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
          <div className="overflow-x-auto">
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
          </div>
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
