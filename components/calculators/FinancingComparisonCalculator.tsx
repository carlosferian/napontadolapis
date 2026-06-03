'use client'

import React, { useState, useMemo } from 'react'
import { formatBRL, formatPct, formatBRLInput, parseBRLInput } from '@/lib/formatters'
import { calcSAC, calcPrice, calcEmprestimo, calcConsorcio } from '@/lib/calculations/financing'
import { RATES } from '@/config/rates'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'
import { Check, X, Clock, TrendingDown, TrendingUp, AlertTriangle, Info } from 'lucide-react'

// ── Defaults ────────────────────────────────────────────────────────────

const DEFAULTS = {
  bemValue:             500_000,
  entradaPct:           20,
  prazoMeses:           180,
  sacRateAa:            10.5,    // Caixa / BB referência imobiliário
  priceRateAa:          14.0,    // CDC veículo
  emprestimoRateAa:     28.0,    // Empréstimo pessoal
  adminFeePct:          18,      // Taxa admin consórcio
  consorcioAdjustAa:    6.0,     // INCC médio
  contemplationMonth:   72,      // contemplado no meio do prazo (180/2.5)
}

// ── Helpers ──────────────────────────────────────────────────────────────

function SliderInput({ label, value, unit, min, max, step, onChange, tip }: {
  label: string; value: number; unit: string; min: number; max: number; step: number
  onChange: (v: number) => void; tip?: string
}) {
  const [focused, setFocused]   = useState(false)
  const [rawInput, setRawInput] = useState('')

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true)
    setRawInput(String(value))
    e.target.select()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setRawInput(raw)
    const parsed = parseFloat(raw.replace(',', '.').replace(/[^\d.]/g, ''))
    if (!isNaN(parsed)) onChange(Math.max(min, Math.min(max, parsed)))
  }

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center gap-2">
        <span className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>{label}</span>
        <input
          type="text" inputMode="decimal"
          value={focused ? rawInput : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ${unit}`}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={() => setFocused(false)}
          className="text-sm font-bold tabular-nums text-right bg-transparent border-b focus:outline-none transition-colors"
          style={{ color: 'var(--c-ink)', borderColor: focused ? 'var(--c-emerald)' : 'transparent', maxWidth: '8rem' }}
        />
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        style={{ backgroundColor: 'var(--c-line)' }} />
      {tip && <p className="text-[9px]" style={{ color: 'var(--c-muted-2)' }}>{tip}</p>}
    </div>
  )
}

// ── Cores por modalidade ──────────────────────────────────────────────────
const MOD_COLORS: Record<string, string> = {
  'SAC':        '#10b981',
  'Price':      '#3b82f6',
  'Empréstimo': '#f59e0b',
  'Consórcio':  '#ef4444',
}

// ── Componente principal ─────────────────────────────────────────────────

export function FinancingComparisonCalculator() {
  // Inputs globais
  const [bemValue,     setBemValue]     = useState(DEFAULTS.bemValue)
  const [entradaPct,   setEntradaPct]   = useState(DEFAULTS.entradaPct)
  const [prazoMeses,   setPrazoMeses]   = useState(DEFAULTS.prazoMeses)

  // Taxas por modalidade
  const [sacRate,        setSacRate]        = useState(DEFAULTS.sacRateAa)
  const [priceRate,      setPriceRate]      = useState(DEFAULTS.priceRateAa)
  const [emprestimoRate, setEmprestimoRate] = useState(DEFAULTS.emprestimoRateAa)
  const [adminFee,       setAdminFee]       = useState(DEFAULTS.adminFeePct)
  const [consAdjust,     setConsAdjust]     = useState(DEFAULTS.consorcioAdjustAa)
  const [contemplacao,   setContemplacao]   = useState(DEFAULTS.contemplationMonth)

  // Antecipação (para mostrar a vantagem de amortizar)
  const [quitMonth, setQuitMonth] = useState(36)

  const entrada  = bemValue * entradaPct / 100
  const financed = bemValue - entrada

  // Resultados
  const sac   = useMemo(() => calcSAC(financed, prazoMeses, sacRate),           [financed, prazoMeses, sacRate])
  const price = useMemo(() => calcPrice(financed, prazoMeses, priceRate),       [financed, prazoMeses, priceRate])
  const emp   = useMemo(() => calcEmprestimo(financed, prazoMeses, emprestimoRate), [financed, prazoMeses, emprestimoRate])
  const cons  = useMemo(() => calcConsorcio({
    creditValue: financed, months: prazoMeses,
    adminFeePct: adminFee, annualAdjustPct: consAdjust,
    contemplationMonth: Math.min(contemplacao, prazoMeses),
  }), [financed, prazoMeses, adminFee, consAdjust, contemplacao])

  // Dados para o gráfico de custo total
  const totalCostData = useMemo(() => [
    { name: 'SAC',        total: sac.totalPaid,   above: sac.totalAbove,   color: MOD_COLORS['SAC']        },
    { name: 'Price',      total: price.totalPaid, above: price.totalAbove, color: MOD_COLORS['Price']      },
    { name: 'Empréstimo', total: emp.totalPaid,   above: emp.totalAbove,   color: MOD_COLORS['Empréstimo'] },
    { name: 'Consórcio',  total: cons.totalPaid,  above: cons.totalAbove,  color: MOD_COLORS['Consórcio']  },
  ], [sac, price, emp, cons])

  // Evolução das parcelas (sample: cada 12 meses)
  const paymentEvolution = useMemo(() => {
    const yearPoints = []
    for (let m = 1; m <= prazoMeses; m += 12) {
      yearPoints.push({
        label:        `Ano ${Math.ceil(m / 12)}`,
        SAC:          sac.timeline[m - 1]?.payment ?? 0,
        Price:        price.timeline[m - 1]?.payment ?? 0,
        Empréstimo:   emp.timeline[m - 1]?.payment ?? 0,
        Consórcio:    cons.timeline[m - 1]?.payment ?? 0,
      })
    }
    return yearPoints
  }, [sac, price, emp, cons, prazoMeses])

  // Ganho de antecipação
  const quitSaving = useMemo(() => ({
    SAC:        Math.max(0, sac.timeline.slice(quitMonth - 1).reduce((s, p) => s + p.payment, 0) - (sac.timeline[quitMonth - 1]?.balance ?? 0)),
    Price:      Math.max(0, price.timeline.slice(quitMonth - 1).reduce((s, p) => s + p.payment, 0) - (price.timeline[quitMonth - 1]?.balance ?? 0)),
    Empréstimo: Math.max(0, emp.timeline.slice(quitMonth - 1).reduce((s, p) => s + p.payment, 0) - (emp.timeline[quitMonth - 1]?.balance ?? 0)),
    Consórcio:  0,  // sem desconto por design
  }), [sac, price, emp, cons, quitMonth])

  // Winner (menor custo total)
  const minTotal = Math.min(sac.totalPaid, price.totalPaid, emp.totalPaid, cons.totalPaid)

  return (
    <div className="space-y-8">

      {/* ── INPUTS ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Dados do bem */}
        <div className="rounded-2xl border p-5 space-y-4" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
          <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: 'var(--c-ink)' }}>Dados do Bem</h3>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>Valor do bem</span>
              <div className="relative w-44">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input type="text" inputMode="numeric"
                  value={bemValue === 0 ? '' : formatBRLInput(bemValue)}
                  onChange={e => setBemValue(Math.min(10_000_000, Math.round(parseBRLInput(e.target.value))))}
                  className="w-full text-right border rounded-xl pr-3 pl-8 py-1.5 text-sm font-bold tabular-nums bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  style={{ color: 'var(--c-ink)', borderColor: 'var(--c-line)' }} />
              </div>
            </div>
            <input type="range" min={50_000} max={2_000_000} step={10_000} value={Math.min(2_000_000, bemValue)}
              onChange={e => setBemValue(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }} />
          </div>

          <SliderInput label="Entrada" value={entradaPct} unit="%" min={0} max={50} step={5} onChange={setEntradaPct}
            tip={`Entrada: ${formatBRL(entrada)} · Financiado: ${formatBRL(financed)}`} />

          <SliderInput label="Prazo" value={prazoMeses} unit="meses" min={12} max={360} step={12} onChange={v => {
            setPrazoMeses(v)
            setContemplacao(Math.min(contemplacao, v))
            setQuitMonth(Math.min(quitMonth, v))
          }} tip={`${(prazoMeses / 12).toFixed(0)} anos`} />
        </div>

        {/* Taxas */}
        <div className="rounded-2xl border p-5 space-y-4" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
          <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: 'var(--c-ink)' }}>Taxas por Modalidade</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ background: MOD_COLORS['SAC'] }} />
              <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: MOD_COLORS['SAC'] }}>SAC Imobiliário</span>
            </div>
            <SliderInput label="Taxa a.a." value={sacRate} unit="% a.a." min={4} max={20} step={0.5} onChange={setSacRate} tip="Referência Caixa/FGTS ~8-10%; mercado ~11-13%" />

            <div className="flex items-center gap-2 mt-3 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ background: MOD_COLORS['Price'] }} />
              <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: MOD_COLORS['Price'] }}>Price (CDC Veículo / Bens)</span>
            </div>
            <SliderInput label="Taxa a.a." value={priceRate} unit="% a.a." min={6} max={40} step={0.5} onChange={setPriceRate} tip="CDC veículo ~14-18% a.a.; bem de consumo ~18-24%" />

            <div className="flex items-center gap-2 mt-3 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ background: MOD_COLORS['Empréstimo'] }} />
              <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: MOD_COLORS['Empréstimo'] }}>Empréstimo Pessoal</span>
            </div>
            <SliderInput label="Taxa a.a." value={emprestimoRate} unit="% a.a." min={12} max={80} step={1} onChange={setEmprestimoRate} tip="Empréstimo pessoal ~24-36% a.a.; consignado ~10-14%" />

            <div className="flex items-center gap-2 mt-3 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ background: MOD_COLORS['Consórcio'] }} />
              <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: MOD_COLORS['Consórcio'] }}>Consórcio</span>
            </div>
            <SliderInput label="Taxa de administração" value={adminFee} unit="% sobre carta" min={10} max={30} step={0.5} onChange={setAdminFee} tip="Mercado: 15-25% diluídos no prazo" />
            <SliderInput label="Reajuste anual (INCC/INPC)" value={consAdjust} unit="% a.a." min={1} max={15} step={0.5} onChange={setConsAdjust} tip="INCC médio histórico ~6-8% a.a. para imóveis" />
            <SliderInput label="Mês esperado da contemplação" value={contemplacao} unit="º mês" min={1} max={prazoMeses} step={6} onChange={setContemplacao} tip="Sorteio: imprevisível. Lances podem antecipar — mas a média de lance explode para 60-70%" />
          </div>
        </div>
      </div>

      {/* ── TABELA COMPARATIVA PRINCIPAL ──────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>Tabela Comparativa</h2>
        <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
          Bem: {formatBRL(bemValue)} · Financiado: {formatBRL(financed)} · Prazo: {prazoMeses} meses ({(prazoMeses/12).toFixed(0)} anos)
        </p>
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--c-line)' }}>
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--c-surface)', borderBottom: '2px solid var(--c-line)' }}>
                <th className="p-3 text-left font-extrabold uppercase tracking-wider text-[10px]" style={{ color: 'var(--c-muted)', minWidth: 180 }}>Critério</th>
                {[
                  { key: 'SAC',        label: 'SAC',              sub: 'Imobiliário' },
                  { key: 'Price',      label: 'Price',            sub: 'CDC / Veículo' },
                  { key: 'Empréstimo', label: 'Empréstimo',       sub: 'Pessoal' },
                  { key: 'Consórcio',  label: 'Consórcio',        sub: 'Imob./Veículo' },
                ].map(m => (
                  <th key={m.key} className="p-3 text-center" style={{ minWidth: 130, borderLeft: '1px solid var(--c-line)' }}>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: MOD_COLORS[m.key] }}>{m.label}</span>
                      <span className="text-[9px]" style={{ color: 'var(--c-muted)' }}>{m.sub}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                // Parcelas
                {
                  label: 'Parcela inicial',
                  sac:   formatBRL(sac.firstPayment),
                  price: formatBRL(price.firstPayment),
                  emp:   formatBRL(emp.firstPayment),
                  cons:  formatBRL(cons.firstPayment),
                },
                {
                  label: 'Parcela final',
                  sac:   formatBRL(sac.lastPayment),
                  price: formatBRL(price.lastPayment),
                  emp:   formatBRL(emp.lastPayment),
                  cons:  formatBRL(cons.lastPayment),
                  note: { cons: 'Parcelas sobem todo ano pelo INCC', sac: 'Parcela cai com o tempo ✓' },
                },
                // Custo total
                {
                  label:    'Total pago',
                  sac:      formatBRL(sac.totalPaid),
                  price:    formatBRL(price.totalPaid),
                  emp:      formatBRL(emp.totalPaid),
                  cons:     formatBRL(cons.totalPaid),
                  highlight: true,
                },
                {
                  label:    'Custo acima do valor',
                  sac:      `${formatBRL(sac.totalAbove)} (${sac.totalAbovePct.toFixed(1)}%)`,
                  price:    `${formatBRL(price.totalAbove)} (${price.totalAbovePct.toFixed(1)}%)`,
                  emp:      `${formatBRL(emp.totalAbove)} (${emp.totalAbovePct.toFixed(1)}%)`,
                  cons:     `${formatBRL(cons.totalAbove)} (${cons.totalAbovePct.toFixed(1)}%)`,
                  isAbove:  true,
                },
                // Disponibilidade do bem
                {
                  label: 'Bem disponível',
                  sac:   'Imediatamente',
                  price: 'Imediatamente',
                  emp:   'Imediatamente',
                  cons:  `Sorteio — ~${Math.round(contemplacao)} meses`,
                  isAsset: true,
                },
                {
                  label: 'Preço do bem travado?',
                  sac:   'Sim (na contratação)',
                  price: 'Sim (na contratação)',
                  emp:   'Sim (na contratação)',
                  cons:  'Não — sobe com INCC todo ano',
                  isBad: ['cons'],
                },
                // Antecipação
                {
                  label: 'Desconto ao antecipar?',
                  sac:   'Sim — elimina juros futuros ✓',
                  price: 'Sim — elimina juros futuros ✓',
                  emp:   'Sim — elimina juros futuros ✓',
                  cons:  'Não — taxa admin cobrada integralmente',
                  isBad: ['cons'],
                },
                // Regime de juros/taxa
                {
                  label: 'Base de cobrança',
                  sac:   'Juros sobre saldo devedor',
                  price: 'Juros sobre saldo devedor',
                  emp:   'Juros sobre saldo devedor',
                  cons:  'Taxa admin sobre valor TOTAL da carta',
                  note:  { cons: 'Não é "sem juros" — é uma taxa diferente, muitas vezes mais cara' },
                },
                // Punição por cancelamento
                {
                  label: 'Cancelamento / inadimplência',
                  sac:   'Execução da hipoteca',
                  price: 'Retomada do bem',
                  emp:   'Negativação / execução',
                  cons:  'Restituição apenas no sorteio da cota cancelada (anos)',
                  isBad: ['cons'],
                },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--c-line)', background: i % 2 === 0 ? 'transparent' : 'var(--c-surface)/30' }}>
                  <td className="p-3 font-semibold" style={{ color: 'var(--c-ink)' }}>
                    {row.label}
                  </td>
                  {(['sac', 'price', 'emp', 'cons'] as const).map(key => {
                    const modKey = { sac: 'SAC', price: 'Price', emp: 'Empréstimo', cons: 'Consórcio' }[key]
                    const val    = row[key] as string
                    const isBad  = Array.isArray(row.isBad) && row.isBad.includes(key)
                    const isBest = row.highlight && [sac.totalPaid, price.totalPaid, emp.totalPaid, cons.totalPaid][['sac','price','emp','cons'].indexOf(key)] === minTotal
                    const isAsset = row.isAsset
                    const note  = (row as any).note?.[key]
                    return (
                      <td key={key} className="p-3 text-center" style={{
                        borderLeft: '1px solid var(--c-line)',
                        color: isBad ? '#dc2626' : isBest ? 'var(--c-emerald)' : 'var(--c-ink)',
                        fontWeight: isBest ? 800 : 400,
                        background: isBad ? 'rgba(220,38,38,0.03)' : isBest ? 'rgba(16,185,129,0.05)' : undefined,
                      }}>
                        {isAsset && key !== 'cons' && <span className="inline-flex items-center gap-1 text-emerald-600"><Check size={10} />{val}</span>}
                        {isAsset && key === 'cons' && <span className="inline-flex items-center gap-1" style={{ color: '#dc2626' }}><Clock size={10} />{val}</span>}
                        {!isAsset && val}
                        {isBest && !isBad && <span className="ml-1 text-[9px] font-extrabold text-emerald-600">★</span>}
                        {note && <div className="text-[9px] mt-0.5" style={{ color: '#d97706' }}>{note}</div>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── GRÁFICOS ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Custo total */}
        <div className="rounded-2xl border p-5 space-y-3" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
          <div>
            <p className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Custo Total por Modalidade</p>
            <p className="text-xs" style={{ color: 'var(--c-muted)' }}>Valor financiado + todos os custos</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={totalCostData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#78716c' }} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#78716c' }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} width={46} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v, name) => [formatBRL(Number(v)), name === 'above' ? 'Custo acima do bem' : 'Capital']}
                contentStyle={{ background: 'var(--c-card-calm)', borderColor: 'var(--c-line)', borderRadius: 10, fontSize: 11 }} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}
                label={{ position: 'top', fontSize: 9, fill: '#78716c', formatter: (v: unknown) => `R$${(Number(v)/1000).toFixed(0)}k` }}>
                {totalCostData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Evolução das parcelas */}
        <div className="rounded-2xl border p-5 space-y-3" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
          <div>
            <p className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Evolução da Parcela Mensal</p>
            <p className="text-xs" style={{ color: 'var(--c-muted)' }}>SAC cai · Price e Empréstimo fixos · Consórcio sobe</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={paymentEvolution} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#78716c' }} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#78716c' }} tickFormatter={v => `R$${(v/1000).toFixed(1)}k`} width={46} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v, name) => [formatBRL(Number(v)), name]}
                contentStyle={{ background: 'var(--c-card-calm)', borderColor: 'var(--c-line)', borderRadius: 10, fontSize: 11 }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              {(['SAC','Price','Empréstimo','Consórcio'] as const).map(m => (
                <Line key={m} type="monotone" dataKey={m} stroke={MOD_COLORS[m]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── ANTECIPAÇÃO ────────────────────────────────────────────────── */}
      <div className="rounded-2xl border p-5 space-y-4" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
        <div>
          <p className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>
            Vantagem da Antecipação — O Grande Segredo do SAC
          </p>
          <p className="text-xs" style={{ color: 'var(--c-muted)' }}>
            Quanto você economizaria em juros quitando o saldo restante no mês selecionado
          </p>
        </div>

        <SliderInput label="Quitar no mês" value={quitMonth} unit="º mês" min={6} max={prazoMeses - 1} step={6} onChange={setQuitMonth}
          tip={`Equivalente a ${(quitMonth / 12).toFixed(1)} anos após o início`} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: 'SAC',        label: 'SAC',        saving: quitSaving.SAC,        balance: sac.timeline[quitMonth - 1]?.balance ?? 0 },
            { key: 'Price',      label: 'Price',      saving: quitSaving.Price,      balance: price.timeline[quitMonth - 1]?.balance ?? 0 },
            { key: 'Empréstimo', label: 'Empréstimo', saving: quitSaving.Empréstimo, balance: emp.timeline[quitMonth - 1]?.balance ?? 0 },
            { key: 'Consórcio',  label: 'Consórcio',  saving: 0,                     balance: 0 },
          ].map(m => (
            <div key={m.key} className="rounded-xl border p-3 space-y-1.5" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: MOD_COLORS[m.key] }} />
                <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: MOD_COLORS[m.key] }}>{m.label}</span>
              </div>
              {m.key !== 'Consórcio' ? (
                <>
                  <div>
                    <div className="text-[9px]" style={{ color: 'var(--c-muted)' }}>Saldo a quitar</div>
                    <div className="text-sm font-black tabular-nums" style={{ color: 'var(--c-ink)' }}>{formatBRL(m.balance)}</div>
                  </div>
                  <div>
                    <div className="text-[9px]" style={{ color: 'var(--c-muted)' }}>Juros economizados</div>
                    <div className="text-base font-black tabular-nums" style={{ color: 'var(--c-emerald)' }}>+ {formatBRL(m.saving)}</div>
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex items-center gap-1 text-red-600">
                    <X size={12} />
                    <span className="text-[10px] font-bold">Sem desconto</span>
                  </div>
                  <p className="text-[9px] mt-1 leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                    A taxa de administração é cobrada integralmente independente da antecipação.
                    O valor pago antecipadamente fica sem rendimento para você.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <p style={{ color: 'var(--c-ink)' }}>
            <strong style={{ color: 'var(--c-emerald)' }}>💡 Por que o SAC favorece tanto a antecipação?</strong>{' '}
            No SAC, cada parcela antecipada elimina os juros daquele mês — e como os juros incidem sobre o saldo devedor,
            cada real amortizado reduz permanentemente os juros futuros.
            No Price, o efeito existe mas é menor porque a estrutura distribui juros uniformemente.
            No Consórcio, a taxa de administração é calculada sobre o total da carta desde o início — antecipar não traz nenhum desconto.
          </p>
        </div>
      </div>

      {/* ── CONSÓRCIO: ANÁLISE DETALHADA ──────────────────────────────── */}
      <div className="rounded-2xl border p-5 space-y-4" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Consórcio — O que os vendedores não contam</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>Análise dos custos e riscos reais baseada na Lei nº 11.795/2008</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: <TrendingUp size={14} />, color: '#ef4444',
              title: 'Reajuste infinito',
              body: `Com ${consAdjust}% de INCC/ano, sua parcela do ano ${Math.floor(prazoMeses/12)} será ${formatBRL(cons.lastPayment)}/mês — ${((cons.lastPayment / cons.firstPayment - 1) * 100).toFixed(0)}% maior que a inicial (${formatBRL(cons.firstPayment)}).`,
            },
            {
              icon: <Clock size={14} />, color: '#d97706',
              title: 'Espera pelo bem',
              body: `Você pagará ${formatBRL(cons.paidBeforeAsset)} SEM ter o bem, até a contemplação esperada no ${contemplacao}º mês. O SAC te entrega o imóvel no 1º mês.`,
            },
            {
              icon: <TrendingDown size={14} />, color: '#ef4444',
              title: 'Carta já corrigida',
              body: `Quando você for contemplado no mês ${contemplacao}, a carta valerá ${formatBRL(cons.creditAtContemplation)} — enquanto o imóvel pode ter subido mais ou menos que o INCC.`,
            },
          ].map((c, i) => (
            <div key={i} className="rounded-xl border p-3 space-y-1.5" style={{ borderColor: `${c.color}30`, background: `${c.color}05` }}>
              <div className="flex items-center gap-1.5" style={{ color: c.color }}>{c.icon}<span className="text-[10px] font-extrabold uppercase tracking-wider">{c.title}</span></div>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>{c.body}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] leading-relaxed border-t pt-3" style={{ borderColor: 'var(--c-line)', color: 'var(--c-muted-2)' }}>
          <strong>Quando o consórcio pode fazer sentido:</strong> exclusivamente para quem tem total ausência de disciplina financeira e
          incapacidade de poupar — o consórcio age como uma "poupança forçada" muito cara, mas pelo menos resulta em um bem.
          Para qualquer pessoa com disciplina mínima, investir o valor das parcelas em renda fixa (Selic/CDB) e comprar à vista é
          matematicamente superior em praticamente 100% dos cenários. Fontes: Banco Central do Brasil; Lei nº 11.795/2008; Procon-SP.
        </p>
      </div>

    </div>
  )
}
