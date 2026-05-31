'use client'

import React, { useState, useMemo } from 'react'
import { formatBRL }          from '@/lib/formatters'
import { formatBRLInput, parseBRLInput } from '@/lib/formatters'
import { calcSAC, calcConsorcio }        from '@/lib/calculations/financing'
import { ShareButtons }       from '@/components/ui/ShareButtons'
import { ShareCardBase }      from '@/components/share/ShareCard'
import { ScaledPreview }      from '@/components/ui/ScaledPreview'
import { Trophy, Medal, Clock, TrendingDown, TrendingUp, Zap, Shield } from 'lucide-react'

// ── Defaults inteligentes ─────────────────────────────────────────────────
const D = {
  bemValue:       300_000,
  entradaPct:     20,
  prazoMeses:     180,   // 15 anos
  sacRateAa:      11.0,  // taxa imobiliária típica 2026
  adminFeePct:    18,    // taxa admin consórcio
  inccAa:         6.0,   // INCC médio
  contemplacao:   72,    // sorteio esperado: mês 72 (mediana de grupos de 15 anos)
}

// ── Componente de input duplo (slider + texto sincronizados) ──────────────

interface DualInputProps {
  label:     string
  value:     number
  unit:      string
  prefix?:   string
  min:       number
  max:       number
  step:      number
  onChange:  (v: number) => void
  tip?:      string
  isBRL?:    boolean
  decimals?: number
}

function DualInput({ label, value, unit, prefix, min, max, step, onChange, tip, isBRL, decimals = 0 }: DualInputProps) {
  const displayVal = isBRL
    ? (value === 0 ? '' : formatBRLInput(value))
    : (value === 0 ? '' : (decimals > 0 ? value.toFixed(decimals).replace('.', ',') : value.toLocaleString('pt-BR')))

  const parse = (raw: string) => {
    const v = isBRL ? parseBRLInput(raw) : parseFloat(raw.replace(',', '.')) || 0
    return Math.min(max, Math.max(min, v))
  }

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center gap-2">
        <label className="text-xs font-semibold flex-shrink-0" style={{ color: 'var(--c-muted)' }}>{label}</label>
        <div className="flex items-center gap-1 w-36">
          {prefix && <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--c-muted)' }}>{prefix}</span>}
          <input
            type="text" inputMode="decimal"
            value={displayVal}
            onChange={e => onChange(parse(e.target.value))}
            className="w-full text-right border rounded-lg px-2 py-1 text-sm font-bold tabular-nums bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald-500"
            style={{ color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
            placeholder="0"
          />
          {unit && <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: 'var(--c-muted)' }}>{unit}</span>}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        style={{ backgroundColor: 'var(--c-line)' }} />
      {tip && <p className="text-[9px]" style={{ color: 'var(--c-muted-2)' }}>{tip}</p>}
    </div>
  )
}

// ── Lógica de julgamento ──────────────────────────────────────────────────

type Verdict = 'fin' | 'cons' | 'empate'

function judge(finVal: number, consVal: number, lowerIsBetter = true): Verdict {
  const diff = Math.abs(finVal - consVal) / Math.max(finVal, consVal)
  if (diff < 0.03) return 'empate'
  if (lowerIsBetter) return finVal < consVal ? 'fin' : 'cons'
  return finVal > consVal ? 'fin' : 'cons'
}

// ── Componente principal ──────────────────────────────────────────────────

export function QuickConsorcioCalculator() {
  const [bemValue,    setBemValue]    = useState(D.bemValue)
  const [entradaPct,  setEntradaPct]  = useState(D.entradaPct)
  const [prazoMeses,  setPrazoMeses]  = useState(D.prazoMeses)
  const [sacRate,     setSacRate]     = useState(D.sacRateAa)
  const [adminFee,    setAdminFee]    = useState(D.adminFeePct)
  const [inccRate,    setInccRate]    = useState(D.inccAa)
  const [contemplacao, setContemplacao] = useState(D.contemplacao)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const entrada  = bemValue * entradaPct / 100
  const financed = bemValue - entrada

  // Cálculos
  const fin  = useMemo(() => calcSAC(financed, prazoMeses, sacRate), [financed, prazoMeses, sacRate])
  const cons = useMemo(() => calcConsorcio({
    creditValue: financed, months: prazoMeses,
    adminFeePct: adminFee, annualAdjustPct: inccRate,
    contemplationMonth: Math.min(contemplacao, prazoMeses),
  }), [financed, prazoMeses, adminFee, inccRate, contemplacao])

  // Placar (3 critérios)
  const c1 = judge(fin.totalPaid, cons.totalPaid, true)          // custo total
  const c2 = judge(1, contemplacao, true)                         // financiamento sempre = 1 mês
  const c3 = judge(fin.firstPayment - fin.lastPayment, cons.lastPayment - cons.firstPayment, true) // parcela melhora ou piora

  const finScore  = [c1, c2, c3].filter(v => v === 'fin').length
  const consScore = [c1, c2, c3].filter(v => v === 'cons').length
  const winner: Verdict = finScore > consScore ? 'fin' : consScore > finScore ? 'cons' : 'empate'

  const finLabel  = `SAC ${sacRate.toFixed(1).replace('.', ',')}% a.a.`
  const consLabel = `Consórcio ${adminFee}% adm.`

  const diff = Math.abs(fin.totalPaid - cons.totalPaid)

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── INPUTS ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border p-5 space-y-4" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
        <h3 className="text-sm font-black" style={{ color: 'var(--c-ink)' }}>Qual é o bem que você quer comprar?</h3>

        <DualInput label="Valor do bem" value={bemValue} isBRL prefix="R$" unit=""
          min={30_000} max={2_000_000} step={10_000} onChange={setBemValue} />
        <DualInput label="Entrada" value={entradaPct} unit="%" min={0} max={60} step={5} onChange={setEntradaPct}
          tip={`Entrada: ${formatBRL(entrada)} · Financiado: ${formatBRL(financed)}`} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider block mb-1.5" style={{ color: '#3b82f6' }}>Financiamento SAC</label>
            <DualInput label="Taxa de juros" value={sacRate} unit="% a.a." min={4} max={25} step={0.5} onChange={setSacRate} decimals={1} />
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider block mb-1.5" style={{ color: '#ef4444' }}>Consórcio</label>
            <DualInput label="Taxa de administração" value={adminFee} unit="% total" min={8} max={30} step={0.5} onChange={setAdminFee} decimals={1} />
          </div>
        </div>

        <DualInput label="Prazo" value={prazoMeses} unit="meses" min={24} max={360} step={12} onChange={v => { setPrazoMeses(v); setContemplacao(Math.min(contemplacao, v)) }}
          tip={`${(prazoMeses/12).toFixed(0)} anos`} />

        {/* Avançado toggle */}
        <button onClick={() => setShowAdvanced(v => !v)}
          className="text-[10px] font-bold cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: 'var(--c-muted)' }}>
          {showAdvanced ? '▲ Ocultar' : '▼ Ajustes avançados (INCC e contemplação)'}
        </button>
        {showAdvanced && (
          <div className="space-y-3 border-t pt-3" style={{ borderColor: 'var(--c-line)' }}>
            <DualInput label="Reajuste anual consórcio (INCC)" value={inccRate} unit="% a.a." min={0} max={15} step={0.5} onChange={setInccRate} decimals={1} />
            <DualInput label="Mês esperado de contemplação" value={contemplacao} unit="º mês" min={1} max={prazoMeses} step={6} onChange={setContemplacao}
              tip="Sorteio imprevisível — quanto mais tarde, pior para o consórcio" />
          </div>
        )}
      </div>

      {/* ── DUELO ────────────────────────────────────────────────────── */}
      <div className="space-y-3">

        {/* Header do duelo */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: 'var(--c-line)' }} />
          <span className="text-[10px] font-extrabold uppercase tracking-[4px]" style={{ color: 'var(--c-muted)' }}>
            A briga pelos seus R${(bemValue/1000).toFixed(0)}k
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--c-line)' }} />
        </div>

        {/* Cards lado a lado */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-stretch">

          {/* Financiamento */}
          <div
            className="rounded-2xl border p-4 space-y-3 transition-all"
            style={{
              borderColor: winner === 'fin' ? '#3b82f6' : 'var(--c-line)',
              background:  winner === 'fin' ? 'rgba(59,130,246,0.04)' : 'var(--c-card-calm)',
              boxShadow:   winner === 'fin' ? '0 0 0 2px rgba(59,130,246,0.2)' : 'none',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: '#3b82f6' }}>Financiamento</div>
                <div className="text-xs font-bold" style={{ color: 'var(--c-muted)' }}>{finLabel}</div>
              </div>
              {winner === 'fin' && <Trophy size={20} style={{ color: '#3b82f6' }} />}
              {winner === 'cons' && <Medal size={16} style={{ color: 'var(--c-muted)' }} />}
            </div>

            <div className="space-y-2 text-xs">
              <Stat label="Total pago" value={formatBRL(fin.totalPaid)} win={c1 === 'fin'} />
              <Stat label="Bem disponível" value="Mês 1" win={c2 === 'fin'} />
              <Stat label="1ª parcela" value={formatBRL(fin.firstPayment)} />
              <Stat label="Última parcela" value={formatBRL(fin.lastPayment)} win={c3 === 'fin'} suffix="↓ caiu" />
            </div>

            <div className="text-center rounded-lg py-1.5" style={{ background: c1 === 'fin' ? 'rgba(59,130,246,0.08)' : 'transparent' }}>
              <span className="text-2xl font-black tabular-nums" style={{ color: '#3b82f6' }}>{finScore}</span>
            </div>
          </div>

          {/* VS separador */}
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="w-px flex-1" style={{ background: 'var(--c-line)' }} />
            <span className="text-[10px] font-black rounded-full w-8 h-8 flex items-center justify-center"
              style={{ background: 'var(--c-surface)', border: '1px solid var(--c-line)', color: 'var(--c-muted)' }}>
              VS
            </span>
            <div className="w-px flex-1" style={{ background: 'var(--c-line)' }} />
          </div>

          {/* Consórcio */}
          <div
            className="rounded-2xl border p-4 space-y-3 transition-all"
            style={{
              borderColor: winner === 'cons' ? '#ef4444' : 'var(--c-line)',
              background:  winner === 'cons' ? 'rgba(239,68,68,0.04)' : 'var(--c-card-calm)',
              boxShadow:   winner === 'cons' ? '0 0 0 2px rgba(239,68,68,0.2)' : 'none',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: '#ef4444' }}>Consórcio</div>
                <div className="text-xs font-bold" style={{ color: 'var(--c-muted)' }}>{consLabel}</div>
              </div>
              {winner === 'cons' && <Trophy size={20} style={{ color: '#ef4444' }} />}
              {winner === 'fin'  && <Medal size={16} style={{ color: 'var(--c-muted)' }} />}
            </div>

            <div className="space-y-2 text-xs">
              <Stat label="Total pago" value={formatBRL(cons.totalPaid)} win={c1 === 'cons'} />
              <Stat label="Bem disponível" value={`Mês ~${contemplacao}`} win={c2 === 'cons'} suffix={`± ${(contemplacao/12).toFixed(0)}a`} />
              <Stat label="1ª parcela" value={formatBRL(cons.firstPayment)} />
              <Stat label="Última parcela" value={formatBRL(cons.lastPayment)} win={c3 === 'cons'} suffix="↑ subiu" />
            </div>

            <div className="text-center rounded-lg py-1.5" style={{ background: c1 === 'cons' ? 'rgba(239,68,68,0.08)' : 'transparent' }}>
              <span className="text-2xl font-black tabular-nums" style={{ color: '#ef4444' }}>{consScore}</span>
            </div>
          </div>
        </div>

        {/* Critérios explicados */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <Zap size={12}/>, label: 'Custo total', fin: c1 === 'fin', cons: c1 === 'cons', emp: c1 === 'empate', note: 'Quem cobra menos no total' },
            { icon: <Clock size={12}/>, label: 'Ter o bem', fin: c2 === 'fin', cons: c2 === 'cons', emp: c2 === 'empate', note: 'Quem entrega mais rápido' },
            { icon: <TrendingDown size={12}/>, label: 'Parcelas', fin: c3 === 'fin', cons: c3 === 'cons', emp: c3 === 'empate', note: 'Quem melhora com o tempo' },
          ].map((row, i) => (
            <div key={i} className="rounded-xl border p-2.5 text-center space-y-1.5" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}>
              <div className="flex items-center justify-center gap-1" style={{ color: 'var(--c-muted)' }}>{row.icon}<span className="text-[9px] font-extrabold uppercase tracking-wider">{row.label}</span></div>
              <div className="text-[10px] font-bold" style={{
                color: row.fin ? '#3b82f6' : row.cons ? '#ef4444' : 'var(--c-muted)',
              }}>
                {row.fin ? '🏆 Financiamento' : row.cons ? '🏆 Consórcio' : '🤝 Empate'}
              </div>
              <div className="text-[9px]" style={{ color: 'var(--c-muted-2)' }}>{row.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VEREDITO ─────────────────────────────────────────────────── */}
      <div
        className="rounded-3xl border-2 p-6 text-center space-y-3"
        style={{
          borderColor: winner === 'empate' ? 'var(--c-line)' : winner === 'fin' ? '#3b82f6' : '#ef4444',
          background:  winner === 'empate' ? 'var(--c-surface)' : winner === 'fin' ? 'rgba(59,130,246,0.05)' : 'rgba(239,68,68,0.05)',
        }}
      >
        {winner !== 'empate' ? (
          <>
            <div className="text-[10px] font-extrabold uppercase tracking-[4px]" style={{ color: 'var(--c-muted)' }}>
              Veredito matemático {finScore} × {consScore}
            </div>
            <div className="text-2xl sm:text-3xl font-black" style={{ color: winner === 'fin' ? '#3b82f6' : '#ef4444' }}>
              {winner === 'fin' ? '🏆 Financiamento SAC' : '🏆 Consórcio'}
            </div>
            <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
              {winner === 'fin'
                ? <>O financiamento SAC sai <strong style={{ color: '#3b82f6' }}>{formatBRL(diff)} mais barato</strong> e entrega o bem no <strong>1º mês</strong>. Com o mesmo valor das parcelas iniciais, você amortiza e quita antes.</>
                : <>O consórcio sai <strong style={{ color: '#ef4444' }}>{formatBRL(diff)} mais barato</strong> no total — mas você espera em média <strong>{(contemplacao/12).toFixed(0)} anos</strong> para ter o bem. Só compensa se você não tem pressa.</>
              }
            </p>
          </>
        ) : (
          <>
            <div className="text-2xl font-black" style={{ color: 'var(--c-ink)' }}>🤝 Empate técnico</div>
            <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
              Os custos totais são próximos, mas o financiamento entrega o bem imediatamente. Ajuste as taxas para desempatar.
            </p>
          </>
        )}

        {/* Regra de ouro */}
        <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--c-muted)' }}>
          <strong style={{ color: 'var(--c-ink)' }}>💡 Regra de ouro:</strong>{' '}
          Se você precisa do bem logo → Financiamento. Se pode esperar E as taxas de admin forem baixas → Consórcio pode valer.
          Se tem disciplina para poupar → Invista o dinheiro e compre à vista. Isso ganha dos dois.
        </div>
      </div>

      {/* Share */}
      <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
        <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Compartilhe o veredito</p>
        <ScaledPreview>
          <ShareCardBase
            id="consorcio-quick-card"
            eyebrow={`Financiamento ${sacRate.toFixed(1)}% a.a. vs Consórcio ${adminFee}% adm.`}
            mainValue={winner === 'empate' ? '🤝 EMPATE' : winner === 'fin' ? '🏆 SAC VENCE' : '🏆 CONSÓRCIO VENCE'}
            mainLabel={`Bem de ${formatBRL(bemValue)} · ${(prazoMeses/12).toFixed(0)} anos`}
            metrics={[
              { label: 'Total SAC',       value: formatBRL(fin.totalPaid) },
              { label: 'Total Consórcio', value: formatBRL(cons.totalPaid) },
              { label: 'Diferença',       value: formatBRL(diff) },
              { label: 'Bem disponível',  value: winner === 'fin' ? 'Mês 1 (SAC)' : `Mês ${contemplacao} (Cons.)` },
            ]}
            footer="a matemática não mente. a ponta do lápis."
            accentColor={winner === 'fin' ? '#3b82f6' : winner === 'cons' ? '#ef4444' : '#6b7280'}
          />
        </ScaledPreview>
        <div className="mt-3">
          <ShareButtons cardId="consorcio-quick-card" filename="consorcio-vs-financiamento" />
        </div>
      </div>
    </div>
  )
}

// ── Sub-componentes ────────────────────────────────────────────────────────

function Stat({ label, value, win, suffix }: { label: string; value: string; win?: boolean; suffix?: string }) {
  return (
    <div className="flex justify-between items-baseline gap-1">
      <span style={{ color: 'var(--c-muted)' }}>{label}</span>
      <span className="font-extrabold tabular-nums text-right" style={{ color: win ? 'var(--c-emerald)' : 'var(--c-ink)' }}>
        {value}{suffix && <span className="text-[9px] ml-1 font-semibold" style={{ color: win ? 'var(--c-emerald)' : 'var(--c-muted)' }}>{suffix}</span>}
        {win && <span className="ml-1 text-[9px]">✓</span>}
      </span>
    </div>
  )
}
