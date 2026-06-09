'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareCardBase } from '@/components/share/ShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { formatBRL } from '@/lib/formatters'
import { calculateIR, grossFromNet, LEI_5MIL } from '@/config/tax'
import { AlertTriangle, Info, TrendingDown, Sparkles } from 'lucide-react'

type Mode = 'bruto' | 'liquido'

const formatPct = (r: number) => `${(r * 100).toFixed(1)}%`

export function IRPFCalculator() {
  const [mode, setMode] = useState<Mode>('bruto')
  const [gross, setGross] = useState(5000)
  const [net, setNet] = useState(5000)

  const resultFromGross = useMemo(() => calculateIR(gross), [gross])
  const resultFromNet   = useMemo(() => {
    const g = grossFromNet(net)
    return calculateIR(g)
  }, [net])

  const result = mode === 'bruto' ? resultFromGross : resultFromNet
  const displayGross = mode === 'bruto' ? gross : resultFromNet.gross

  const bracketColors = ['#94a3b8', '#f59e0b', '#f97316', '#ef4444', '#b91c1c']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">

      {/* ── COLUNA ESQUERDA ───────────────────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">

        {/* Toggle modo */}
        <div className="rounded-2xl border p-1.5 flex gap-1" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          {([
            { key: 'bruto',   label: 'Sei o salário bruto' },
            { key: 'liquido', label: 'Quero receber líquido' },
          ] as const).map(m => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${mode === m.key ? 'bg-white dark:bg-stone-800 shadow-sm border' : 'text-stone-500'}`}
              style={{ borderColor: mode === m.key ? 'var(--c-line)' : 'transparent' }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <CalculatorCard
          title="Imposto de Renda 2026"
          subtitle="Tabela progressiva com Lei dos 5 Mil (Lei 15.270/2025)."
        >
          {mode === 'bruto' ? (
            <SliderField
              id="gross-salary"
              label="Salário bruto mensal"
              value={gross}
              min={0}
              max={30000}
              step={100}
              onChange={setGross}
            />
          ) : (
            <SliderField
              id="net-salary"
              label="Salário líquido desejado"
              value={net}
              min={0}
              max={25000}
              step={100}
              onChange={setNet}
            />
          )}

          {/* Resumo inline */}
          <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--c-surface)' }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--c-muted)' }}>Salário bruto</span>
              <span className="font-bold tabular-nums" style={{ color: 'var(--c-ink)' }}>{formatBRL(displayGross)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--c-muted)' }}>IR devido</span>
              <span className="font-bold tabular-nums text-red-500">−{formatBRL(result.irDue)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-base" style={{ borderColor: 'var(--c-line)' }}>
              <span className="font-semibold" style={{ color: 'var(--c-muted)' }}>Salário líquido</span>
              <span className="font-black tabular-nums" style={{ color: 'var(--c-emerald)' }}>{formatBRL(result.net)}</span>
            </div>
          </div>

          {/* Alerta Lei dos 5 Mil */}
          {result.inFullExemption && (
            <div className="rounded-xl px-4 py-3 flex gap-2 items-start" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Sparkles size={14} className="text-emerald-500 mt-0.5 shrink-0" />
              <p className="text-xs leading-relaxed" style={{ color: 'var(--c-emerald)' }}>
                <strong>Isento pela Lei dos 5 Mil.</strong> Salários até R$5.000 têm IR zerado integralmente em 2026.
              </p>
            </div>
          )}
          {result.inTransitionZone && (
            <div className="rounded-xl px-4 py-3 flex gap-2 items-start" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Info size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs leading-relaxed" style={{ color: 'var(--c-amber, #d97706)' }}>
                <strong>Zona de transição (R$5k–R$7,35k).</strong> O redutor parcial da Lei 15.270/2025 reduz o IR progressivamente até ser eliminado em R$7.350.
              </p>
            </div>
          )}
        </CalculatorCard>

        {/* Nota descontinuidade */}
        <div className="rounded-2xl border p-4 flex gap-3" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            <p className="font-semibold" style={{ color: 'var(--c-ink-2)' }}>Descontinuidade da lei</p>
            <p>
              Quem ganha <strong>R$5.000</strong> paga IR = R$0. Quem ganha <strong>R$5.001</strong> paga ~R$153.
              Esse "cliff" é um efeito da lei — a zona de transição (R$5k–R$7,35k) suaviza mas não elimina o salto.
            </p>
          </div>
        </div>
      </div>

      {/* ── COLUNA DIREITA ────────────────────────────────────────── */}
      <div role="region" aria-live="polite" className="space-y-4 lg:col-span-7">

        {/* Hero */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--c-card-calm)', border: '1px solid var(--c-line)' }}>
          <div className="grid grid-cols-2">
            <div className="p-5 border-r" style={{ borderColor: 'var(--c-line)' }}>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--c-muted)' }}>IR devido</p>
              <p className="text-3xl font-bold text-red-500 tabular-nums leading-none break-all">
                {formatBRL(result.irDue)}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--c-muted)' }}>por mês</p>
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--c-muted)' }}>Alíquota efetiva</p>
              <p className="text-3xl font-bold tabular-nums leading-none" style={{ color: result.irDue > 0 ? '#ef4444' : 'var(--c-emerald)' }}>
                {formatPct(result.effectiveRate)}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--c-muted)' }}>
                marginal: {formatPct(result.marginalRate)}
              </p>
            </div>
          </div>
          <div className="px-5 py-3 border-t grid grid-cols-3 gap-2 text-center" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
            <div>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>Bruto</p>
              <p className="text-sm font-bold tabular-nums" style={{ color: 'var(--c-ink)' }}>{formatBRL(displayGross)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>IR</p>
              <p className="text-sm font-bold tabular-nums text-red-500">−{formatBRL(result.irDue)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>Líquido</p>
              <p className="text-sm font-bold tabular-nums" style={{ color: 'var(--c-emerald)' }}>{formatBRL(result.net)}</p>
            </div>
          </div>
        </div>

        {/* Detalhamento por faixas */}
        {result.brackets.length > 0 && (
          <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: 'var(--c-card-calm)', border: '1px solid var(--c-line)' }}>
            <SectionDivider label="Detalhamento por faixas" />
            {result.brackets.map((b, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs gap-2">
                  <span style={{ color: 'var(--c-muted)' }}>
                    {b.rate === 0 ? 'Isento' : `${(b.rate * 100).toFixed(1)}%`}
                    {' '}· {formatBRL(b.from)} – {b.to === Infinity ? '∞' : formatBRL(b.to)}
                  </span>
                  <span className="font-semibold tabular-nums shrink-0" style={{ color: b.taxInRange > 0 ? '#ef4444' : 'var(--c-muted)' }}>
                    {b.taxInRange > 0 ? `−${formatBRL(b.taxInRange)}` : 'R$ 0'}
                  </span>
                </div>
                <div className="w-full rounded-full h-1.5" style={{ backgroundColor: 'var(--c-surface)' }}>
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${displayGross > 0 ? Math.min(100, (b.incomeInRange / displayGross) * 100) : 0}%`,
                      backgroundColor: bracketColors[i] ?? '#6b7280',
                    }}
                  />
                </div>
              </div>
            ))}

            {result.redutor > 0 && (
              <div className="rounded-xl px-3 py-2 text-xs flex justify-between items-center" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <span style={{ color: 'var(--c-emerald)' }}>Redutor Lei 15.270/2025</span>
                <span className="font-bold tabular-nums" style={{ color: 'var(--c-emerald)' }}>−{formatBRL(result.redutor)}</span>
              </div>
            )}
          </div>
        )}

        {/* Projeção anual */}
        <div className="rounded-2xl p-5 space-y-3" style={{ backgroundColor: 'var(--c-card-calm)', border: '1px solid var(--c-line)' }}>
          <SectionDivider label="Projeção anual (13 competências)" />
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Bruto anual',   value: formatBRL(displayGross * 13),    color: 'var(--c-ink)' },
              { label: 'IR anual',      value: formatBRL(result.irDue * 13),    color: '#ef4444'       },
              { label: 'Líquido anual', value: formatBRL(result.net * 13),      color: 'var(--c-emerald)' },
            ].map(m => (
              <div key={m.label} className="rounded-xl p-3 text-center space-y-1" style={{ background: 'var(--c-surface)' }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>{m.label}</p>
                <p className="text-sm font-black tabular-nums break-all" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-center" style={{ color: 'var(--c-muted)' }}>
            Considera 12 meses + 13º salário integral · IRPF mensal × 13
          </p>
        </div>

        {/* Share */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--c-surface)' }}>
          <p className="text-xs mb-3 text-center" style={{ color: 'var(--c-muted)' }}>Compartilhe o resultado</p>
          <ScaledPreview>
            <ShareCardBase
              id="irpf-share-card"
              eyebrow="imposto de renda 2026"
              mainValue={formatBRL(result.irDue)}
              mainLabel="IR mensal devido"
              metrics={[
                { label: 'salário bruto', value: formatBRL(displayGross) },
                { label: 'salário líquido', value: formatBRL(result.net) },
                { label: 'alíquota efetiva', value: formatPct(result.effectiveRate) },
                { label: 'IR anual estimado', value: formatBRL(result.irDue * 13) },
              ]}
              footer="tabela progressiva com Lei dos 5 Mil — 2026."
              accentColor="#ef4444"
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="irpf-share-card" filename="irpf-2026" />
          </div>
        </div>

        <p className="text-xs text-stone-400 text-center">
          Tabela progressiva IRPF 2026 com Lei nº 15.270/2025 (Lei dos 5 Mil). Apenas IRRF — não inclui INSS, contribuições previdenciárias ou deduções de dependentes.
        </p>
      </div>
    </div>
  )
}
