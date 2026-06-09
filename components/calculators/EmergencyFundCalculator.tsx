'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareCardBase } from '@/components/share/ShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { formatBRL } from '@/lib/formatters'
import { calculateSavingsPlan } from '@/lib/calculations/savings'
import { RATES } from '@/config/rates'
import { ShieldCheck, Zap, Clock, TrendingUp, AlertTriangle } from 'lucide-react'

const COVERAGE_OPTIONS = [
  { months: 3,  label: '3 meses',  desc: 'Mínimo recomendado — CLT estável' },
  { months: 6,  label: '6 meses',  desc: 'Ideal para a maioria das pessoas' },
  { months: 12, label: '12 meses', desc: 'Autônomo / renda variável' },
]

const WHERE_TO_KEEP = [
  {
    name: 'Tesouro Selic',
    liquidity: 'D+1',
    risk: 'Soberano',
    yield: `${(RATES.selic * 100).toFixed(1)}% a.a.`,
    note: 'Melhor custo-benefício. Resgata em 1 dia útil.',
    color: '#10b981',
    recommended: true,
  },
  {
    name: 'CDB 100% CDI com liquidez diária',
    liquidity: 'D+0',
    risk: 'Garantia FGC até R$250k',
    yield: `${(RATES.cdi * 100).toFixed(1)}% a.a.`,
    note: 'Disponível imediatamente. Prefira bancos digitais.',
    color: '#3b82f6',
    recommended: false,
  },
  {
    name: 'Poupança',
    liquidity: 'D+0',
    risk: 'Garantia FGC',
    yield: `${(RATES.poupanca * 100).toFixed(1)}% a.a.`,
    note: 'Rende menos que a inflação. Evite — existe opção melhor.',
    color: '#f59e0b',
    recommended: false,
  },
]

export function EmergencyFundCalculator() {
  const [expenses, setExpenses]       = useState(4000)
  const [coverage, setCoverage]       = useState(6)
  const [alreadyHave, setAlreadyHave] = useState(0)
  const [monthlySavings, setMonthlySavings] = useState(500)

  const target   = expenses * coverage
  const missing  = Math.max(0, target - alreadyHave)
  const progress = target > 0 ? Math.min(1, alreadyHave / target) : 0

  const plan = useMemo(() => {
    if (missing <= 0 || monthlySavings <= 0) return null
    return calculateSavingsPlan(missing, 120, RATES.selic, 0.05)
  }, [missing, monthlySavings])

  const monthsToGoal = useMemo(() => {
    if (missing <= 0) return 0
    if (monthlySavings <= 0) return Infinity
    const r = RATES.selic / 12
    // Resolve: monthlySavings * ((1+r)^n - 1) / r = missing
    // n = log(missing * r / monthlySavings + 1) / log(1 + r)
    if (r === 0) return Math.ceil(missing / monthlySavings)
    const n = Math.log(missing * r / monthlySavings + 1) / Math.log(1 + r)
    return Math.ceil(n)
  }, [missing, monthlySavings])

  const formatMonths = (m: number) => {
    if (!isFinite(m)) return '∞'
    const y = Math.floor(m / 12)
    const mo = m % 12
    if (y === 0) return `${mo} ${mo === 1 ? 'mês' : 'meses'}`
    if (mo === 0) return `${y} ${y === 1 ? 'ano' : 'anos'}`
    return `${y}a ${mo}m`
  }

  const isComplete = alreadyHave >= target && target > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">

      {/* ── COLUNA ESQUERDA ───────────────────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        <CalculatorCard
          title="Sua reserva de emergência"
          subtitle="Quanto guardar, onde guardar e em quanto tempo."
        >
          <SliderField
            id="expenses"
            label="Gastos mensais"
            value={expenses}
            min={500}
            max={20000}
            step={100}
            onChange={setExpenses}
          />

          {/* Toggle de cobertura */}
          <div className="space-y-2">
            <p className="text-base font-semibold" style={{ color: 'var(--c-muted)' }}>Meses de cobertura</p>
            <div className="grid grid-cols-3 gap-2">
              {COVERAGE_OPTIONS.map(o => (
                <button
                  key={o.months}
                  type="button"
                  onClick={() => setCoverage(o.months)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center space-y-0.5 ${coverage === o.months ? 'bg-stone-900 border-stone-950 text-white dark:bg-stone-100 dark:border-stone-50 dark:text-stone-900' : 'bg-transparent text-stone-500'}`}
                  style={{ borderColor: coverage === o.months ? undefined : 'var(--c-line)' }}
                >
                  <div>{o.label}</div>
                  <div className="text-[9px] font-normal opacity-70">{o.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <SliderField
            id="already-have"
            label="Já tenho guardado"
            value={alreadyHave}
            min={0}
            max={target > 0 ? target : 50000}
            step={100}
            onChange={setAlreadyHave}
          />

          <SliderField
            id="monthly-savings"
            label="Consigo guardar por mês"
            value={monthlySavings}
            min={50}
            max={10000}
            step={50}
            onChange={setMonthlySavings}
          />
        </CalculatorCard>
      </div>

      {/* ── COLUNA DIREITA ────────────────────────────────────────── */}
      <div role="region" aria-live="polite" className="space-y-4 lg:col-span-7">

        {/* Hero */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--c-card-calm)', border: '1px solid var(--c-line)' }}>
          <div className="grid grid-cols-2">
            <div className="p-5 border-r" style={{ borderColor: 'var(--c-line)' }}>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--c-muted)' }}>Meta da reserva</p>
              <p className="text-3xl font-bold tabular-nums leading-none break-all" style={{ color: 'var(--c-ink)' }}>
                {formatBRL(target)}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--c-muted)' }}>{coverage} meses de gastos</p>
            </div>
            <div className="p-5" style={{ backgroundColor: isComplete ? 'rgba(16,185,129,0.06)' : undefined }}>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--c-muted)' }}>
                {isComplete ? 'Reserva completa' : 'Falta ainda'}
              </p>
              <p className={`text-3xl font-bold tabular-nums leading-none break-all ${isComplete ? 'text-emerald-600' : 'text-red-500'}`}>
                {isComplete ? '✓ Meta atingida!' : formatBRL(missing)}
              </p>
              {!isComplete && (
                <p className="text-xs mt-1" style={{ color: 'var(--c-muted)' }}>
                  {(progress * 100).toFixed(0)}% concluído
                </p>
              )}
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="px-5 pt-3 pb-4 border-t space-y-1.5" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted)' }}>
              <span>{formatBRL(alreadyHave)} guardado</span>
              <span>meta: {formatBRL(target)}</span>
            </div>
            <div className="w-full rounded-full h-3" style={{ backgroundColor: 'var(--c-surface)' }}>
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, progress * 100)}%`,
                  backgroundColor: isComplete ? '#10b981' : progress > 0.6 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>
        </div>

        {/* Prazo */}
        {!isComplete && (
          <div className="rounded-2xl p-5 space-y-3" style={{ backgroundColor: 'var(--c-card-calm)', border: '1px solid var(--c-line)' }}>
            <SectionDivider label="Quanto tempo para completar" />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 text-center space-y-1" style={{ background: 'var(--c-surface)' }}>
                <div className="flex justify-center mb-1"><Clock size={14} style={{ color: 'var(--c-muted)' }} /></div>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>Sem rendimento</p>
                <p className="text-xl font-black tabular-nums" style={{ color: 'var(--c-ink)' }}>
                  {formatMonths(monthlySavings > 0 ? Math.ceil(missing / monthlySavings) : Infinity)}
                </p>
              </div>
              <div className="rounded-xl p-4 text-center space-y-1" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <div className="flex justify-center mb-1"><TrendingUp size={14} className="text-emerald-500" /></div>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--c-emerald)' }}>Com Selic ({(RATES.selic * 100).toFixed(1)}% a.a.)</p>
                <p className="text-xl font-black tabular-nums text-emerald-600">
                  {formatMonths(monthsToGoal)}
                </p>
              </div>
            </div>
            {isFinite(monthsToGoal) && monthsToGoal < Math.ceil(missing / monthlySavings) && (
              <p className="text-xs text-center" style={{ color: 'var(--c-muted)' }}>
                Investindo na Selic você chega{' '}
                <strong style={{ color: 'var(--c-emerald)' }}>
                  {Math.ceil(missing / monthlySavings) - monthsToGoal} {Math.ceil(missing / monthlySavings) - monthsToGoal === 1 ? 'mês' : 'meses'} antes
                </strong>
                {' '}do que sem rendimento.
              </p>
            )}
          </div>
        )}

        {/* Onde guardar */}
        <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: 'var(--c-card-calm)', border: '1px solid var(--c-line)' }}>
          <SectionDivider label="Onde manter a reserva" />
          {WHERE_TO_KEEP.map(w => (
            <div key={w.name} className="rounded-xl p-4 space-y-2" style={{ background: 'var(--c-surface)', border: `1px solid ${w.recommended ? 'rgba(16,185,129,0.2)' : 'var(--c-line)'}` }}>
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  {w.recommended && <ShieldCheck size={14} className="text-emerald-500 shrink-0" />}
                  <p className="text-sm font-bold" style={{ color: 'var(--c-ink)' }}>{w.name}</p>
                  {w.recommended && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--c-emerald)' }}>RECOMENDADO</span>
                  )}
                </div>
                <span className="text-sm font-black tabular-nums shrink-0" style={{ color: w.color }}>{w.yield}</span>
              </div>
              <div className="flex gap-3 text-[10px]" style={{ color: 'var(--c-muted)' }}>
                <span><strong>Liquidez:</strong> {w.liquidity}</span>
                <span><strong>Risco:</strong> {w.risk}</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>{w.note}</p>
            </div>
          ))}
        </div>

        {/* Aviso sobre não investir a reserva */}
        <div className="rounded-2xl border p-4 flex gap-3" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed space-y-1" style={{ color: 'var(--c-muted)' }}>
            <p className="font-semibold" style={{ color: 'var(--c-ink-2)' }}>Reserva não é investimento</p>
            <p>
              A reserva de emergência precisa ter <strong>liquidez imediata</strong>. Não aplique em renda variável, fundos com carência ou imóveis.
              O objetivo é estar disponível no dia que você precisar — não render o máximo.
            </p>
          </div>
        </div>

        {/* Share */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--c-surface)' }}>
          <p className="text-xs mb-3 text-center" style={{ color: 'var(--c-muted)' }}>Compartilhe sua meta</p>
          <ScaledPreview>
            <ShareCardBase
              id="emergency-share-card"
              eyebrow="reserva de emergência"
              mainValue={formatBRL(target)}
              mainLabel={`meta para ${coverage} meses de proteção`}
              metrics={[
                { label: 'gastos mensais', value: formatBRL(expenses) },
                { label: 'já guardado', value: formatBRL(alreadyHave) },
                { label: 'falta', value: formatBRL(missing) },
                { label: 'prazo estimado (Selic)', value: isComplete ? 'Completo! ✓' : formatMonths(monthsToGoal) },
              ]}
              footer="segurança financeira começa pela reserva."
              accentColor="#10b981"
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="emergency-share-card" filename="reserva-de-emergencia" />
          </div>
        </div>
      </div>
    </div>
  )
}
