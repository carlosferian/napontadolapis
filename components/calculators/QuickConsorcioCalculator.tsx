'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { formatBRL }          from '@/lib/formatters'
import { formatBRLInput, parseBRLInput } from '@/lib/formatters'
import { calcSAC, calcConsorcio }        from '@/lib/calculations/financing'
import { ShareButtons }       from '@/components/ui/ShareButtons'
import { ShareCardBase }      from '@/components/share/ShareCard'
import { ScaledPreview }      from '@/components/ui/ScaledPreview'

// ── Defaults inteligentes por tipo de bem ───────────────────────────────────
const DEFAULTS = {
  imovel: {
    bemValue: 300_000,
    entradaPct: 20,
    prazoMeses: 180, // 15 anos
    sacRate: 10.5,   // taxa imobiliária SAC típica
    adminFee: 18.0,  // taxa de administração consórcio imobiliário
    inccRate: 6.0,   // INCC médio
    contemplacao: 72, // sorteio esperado: 6º ano
  },
  veiculo: {
    bemValue: 80_000,
    entradaPct: 20,
    prazoMeses: 60,  // 5 anos
    sacRate: 16.0,   // CDC/Financiamento veículo SAC/Price típico
    adminFee: 14.0,  // taxa adm típica consórcio automóvel
    inccRate: 4.0,   // IPCA médio de reajuste
    contemplacao: 24, // sorteio esperado: 2º ano
  }
}

export function QuickConsorcioCalculator() {
  const [bemType, setBemType] = useState<'imovel' | 'veiculo'>('imovel')
  
  // Estados principais
  const [bemValue, setBemValue] = useState(DEFAULTS.imovel.bemValue)
  const [entradaPct, setEntradaPct] = useState(DEFAULTS.imovel.entradaPct)
  const [prazoMeses, setPrazoMeses] = useState(DEFAULTS.imovel.prazoMeses)
  
  // Taxas e Ajustes (ocultas por padrão)
  const [sacRate, setSacRate] = useState(DEFAULTS.imovel.sacRate)
  const [adminFee, setAdminFee] = useState(DEFAULTS.imovel.adminFee)
  const [inccRate, setInccRate] = useState(DEFAULTS.imovel.inccRate)
  const [contemplacao, setContemplacao] = useState(DEFAULTS.imovel.contemplacao)
  
  const [showCustomRates, setShowCustomRates] = useState(false)
  const [showShare, setShowShare] = useState(false)

  // Mudar tipo de bem e resetar para defaults realistas
  const handleBemTypeChange = (type: 'imovel' | 'veiculo') => {
    setBemType(type)
    const d = DEFAULTS[type]
    setBemValue(d.bemValue)
    setEntradaPct(d.entradaPct)
    setPrazoMeses(d.prazoMeses)
    setSacRate(d.sacRate)
    setAdminFee(d.adminFee)
    setInccRate(d.inccRate)
    setContemplacao(d.contemplacao)
  }

  const entrada = bemValue * entradaPct / 100
  const financed = bemValue - entrada

  // Cálculos matemáticos
  const fin = useMemo(() => calcSAC(financed, prazoMeses, sacRate), [financed, prazoMeses, sacRate])
  const cons = useMemo(() => calcConsorcio({
    creditValue: financed,
    months: prazoMeses,
    adminFeePct: adminFee,
    annualAdjustPct: inccRate,
    contemplationMonth: Math.min(contemplacao, prazoMeses),
  }), [financed, prazoMeses, adminFee, inccRate, contemplacao])

  const diff = Math.abs(fin.totalPaid - cons.totalPaid)
  const isFinCheaper = fin.totalPaid < cons.totalPaid
  
  // Julgamento de vencedor matemático (Scorecard implícito)
  // Financiamento ganha na disponibilidade (Mês 1) e na amortização das parcelas que caem
  // Consórcio ganha apenas se o custo total for menor
  const finScore = 2 + (isFinCheaper ? 1 : 0)
  const consScore = 0 + (!isFinCheaper ? 1 : 0)
  const winner = finScore > consScore ? 'fin' : 'cons'

  return (
    <div className="space-y-6">

      {/* ── PAINEL DE ENTRADAS (SIMPLIFICADO) ── */}
      <div className="rounded-2xl border p-5 space-y-5" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
        <div className="space-y-1">
          <h3 className="text-sm font-bold" style={{ color: 'var(--c-ink)' }}>Qual bem você deseja comprar?</h3>
          <p className="text-[11px]" style={{ color: 'var(--c-muted)' }}>Selecionar o tipo preenche automaticamente as taxas reais de mercado.</p>
        </div>

        {/* Tipo de Bem Select Button Group */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'imovel', label: '🏡 Imóvel', desc: 'Casa, Apto ou Terreno' },
            { key: 'veiculo', label: '🚗 Veículo', desc: 'Carro, Moto ou Náutico' },
          ].map((opt) => {
            const isActive = bemType === opt.key
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleBemTypeChange(opt.key as 'imovel' | 'veiculo')}
                className="p-3 rounded-xl border text-left transition-all cursor-pointer"
                style={
                  isActive
                    ? { backgroundColor: 'var(--c-emerald)', borderColor: 'transparent' }
                    : { backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-line)' }
                }
              >
                <p className="text-sm font-bold" style={{ color: isActive ? '#ffffff' : 'var(--c-ink)' }}>{opt.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--c-muted)' }}>{opt.desc}</p>
              </button>
            )
          })}
        </div>

        {/* Valor do Bem simple input */}
        <div className="space-y-1.5">
          <label htmlFor="bem-value" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>Valor Estimado do Bem</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'var(--c-muted)' }}>R$</span>
            <input
              id="bem-value"
              type="text"
              inputMode="decimal"
              value={bemValue === 0 ? '' : formatBRLInput(bemValue)}
              onChange={e => setBemValue(parseBRLInput(e.target.value))}
              className="w-full border rounded-xl pl-9 pr-4 py-2.5 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent tabular-nums"
              style={{ color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
              placeholder="0,00"
            />
          </div>
        </div>

        {/* Prazo do Pagamento Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>Prazo de Pagamento</label>
          <div className="flex flex-wrap gap-2">
            {(bemType === 'imovel' ? [5, 10, 15, 20, 30] : [2, 3, 4, 5, 6]).map(years => {
              const isSelected = prazoMeses === years * 12
              return (
                <button
                  key={years}
                  type="button"
                  onClick={() => {
                    setPrazoMeses(years * 12)
                    setContemplacao(Math.min(contemplacao, years * 12))
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer"
                  style={isSelected 
                    ? { backgroundColor: 'var(--c-emerald)', color: '#ffffff', borderColor: 'transparent' }
                    : { backgroundColor: 'var(--c-surface)', color: 'var(--c-muted)', borderColor: 'var(--c-line)' }
                  }
                >
                  {years} anos
                </button>
              )
            })}
            <div className="flex items-center gap-1.5 border rounded-xl px-3 py-1.5 bg-transparent min-w-[110px]" style={{ borderColor: 'var(--c-line)' }}>
              <input
                type="number"
                min={1}
                max={40}
                value={prazoMeses ? Math.round(prazoMeses / 12) : ''}
                onChange={e => {
                  const yrs = parseInt(e.target.value) || 0
                  if (yrs > 0) {
                    setPrazoMeses(yrs * 12)
                    setContemplacao(Math.min(contemplacao, yrs * 12))
                  } else {
                    setPrazoMeses(0)
                  }
                }}
                className="w-10 text-center text-xs font-bold bg-transparent outline-none border-none focus:ring-0"
                placeholder="Outro"
              />
              <span className="text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>anos</span>
            </div>
          </div>
        </div>

        {/* Collapsible custom rates override */}
        <div className="border-t pt-3.5 mt-2" style={{ borderColor: 'var(--c-line)' }}>
          <button
            type="button"
            onClick={() => setShowCustomRates(v => !v)}
            className="text-xs font-bold cursor-pointer flex items-center gap-1 transition-opacity hover:opacity-75"
            style={{ color: 'var(--c-muted)' }}
          >
            <span>{showCustomRates ? '⚙️ Ocultar taxas e entrada' : '⚙️ Customizar taxas e entrada (opcional)'}</span>
          </button>
          
          {showCustomRates && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-dashed" style={{ borderColor: 'var(--c-line)' }}>
              {/* Entrada */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>Entrada (%)</label>
                <div className="flex items-center border rounded-xl px-3 py-1.5" style={{ borderColor: 'var(--c-line)' }}>
                  <input
                    type="number"
                    value={entradaPct}
                    onChange={e => setEntradaPct(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-full text-xs font-bold bg-transparent outline-none"
                  />
                  <span className="text-xs" style={{ color: 'var(--c-muted)' }}>%</span>
                </div>
                <p className="text-[9px]" style={{ color: 'var(--c-muted)' }}>
                  Valor: {formatBRL(entrada)}
                </p>
              </div>

              {/* Taxa Juros SAC */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>Juros do Financiamento</label>
                <div className="flex items-center border rounded-xl px-3 py-1.5" style={{ borderColor: 'var(--c-line)' }}>
                  <input
                    type="number"
                    step={0.1}
                    value={sacRate}
                    onChange={e => setSacRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-xs font-bold bg-transparent outline-none"
                  />
                  <span className="text-xs" style={{ color: 'var(--c-muted)' }}>% a.a.</span>
                </div>
              </div>

              {/* Taxa Adm Consórcio */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>Taxa de Adm. Consórcio</label>
                <div className="flex items-center border rounded-xl px-3 py-1.5" style={{ borderColor: 'var(--c-line)' }}>
                  <input
                    type="number"
                    step={0.1}
                    value={adminFee}
                    onChange={e => setAdminFee(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-xs font-bold bg-transparent outline-none"
                  />
                  <span className="text-xs" style={{ color: 'var(--c-muted)' }}>% total</span>
                </div>
              </div>

              {/* Reajuste INCC/IPCA */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>Reajuste Anual (INCC/IPCA)</label>
                <div className="flex items-center border rounded-xl px-3 py-1.5" style={{ borderColor: 'var(--c-line)' }}>
                  <input
                    type="number"
                    step={0.1}
                    value={inccRate}
                    onChange={e => setInccRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-xs font-bold bg-transparent outline-none"
                  />
                  <span className="text-xs" style={{ color: 'var(--c-muted)' }}>% a.a.</span>
                </div>
              </div>

              {/* Contemplação */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>Mês Estimado de Contemplação</label>
                <div className="flex items-center border rounded-xl px-3 py-1.5" style={{ borderColor: 'var(--c-line)' }}>
                  <input
                    type="number"
                    value={contemplacao}
                    onChange={e => setContemplacao(Math.min(prazoMeses, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full text-xs font-bold bg-transparent outline-none"
                  />
                  <span className="text-xs shrink-0" style={{ color: 'var(--c-muted)' }}>º mês (~{(contemplacao/12).toFixed(0)} anos)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── PAINEL DE RESULTADOS E VEREDITO (MUITO SIMPLIFICADO) ── */}
      <div className="space-y-4">
        
        {/* Divisor estético */}
        <div className="text-center py-1.5 flex items-center justify-center gap-2">
          <div className="h-px flex-1" style={{ background: 'var(--c-line)' }} />
          <span className="text-[10px] font-black uppercase tracking-[3px]" style={{ color: 'var(--c-muted)' }}>Veredito do Duelo</span>
          <div className="h-px flex-1" style={{ background: 'var(--c-line)' }} />
        </div>

        {/* Card do Vencedor */}
        <div
          className="rounded-3xl border-2 p-6 text-center space-y-5 shadow-sm"
          style={{
            borderColor: winner === 'fin' ? '#3b82f6' : '#ef4444',
            background:  winner === 'fin' ? 'rgba(59,130,246,0.03)' : 'rgba(239,68,68,0.03)',
          }}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--c-muted)' }}>
              A melhor escolha matemática
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif" style={{ color: winner === 'fin' ? '#3b82f6' : '#ef4444' }}>
              {winner === 'fin' ? '🏆 Financiamento SAC Vence!' : '🏆 Consórcio Vence!'}
            </h2>
          </div>

          {/* Gráfico de barras simples */}
          <div className="space-y-3.5 max-w-md mx-auto py-2">
            
            {/* Financiamento Bar */}
            <div className="space-y-1 text-left">
              <div className="flex justify-between text-xs font-bold">
                <span style={{ color: '#3b82f6' }}>Financiamento SAC (Imediato)</span>
                <span style={{ color: 'var(--c-ink)' }}>{formatBRL(fin.totalPaid)}</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden bg-black/[0.04] dark:bg-white/[0.04] flex">
                <div 
                  className="h-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.round((fin.totalPaid / Math.max(fin.totalPaid, cons.totalPaid)) * 100)}%`, 
                    backgroundColor: '#3b82f6' 
                  }} 
                />
              </div>
              <p className="text-[10px]" style={{ color: 'var(--c-muted)' }}>Você pega as chaves e tem o bem no <strong>1º mês</strong>.</p>
            </div>

            {/* Consórcio Bar */}
            <div className="space-y-1 text-left">
              <div className="flex justify-between text-xs font-bold">
                <span style={{ color: '#ef4444' }}>Consórcio (Espera por sorteio)</span>
                <span style={{ color: 'var(--c-ink)' }}>{formatBRL(cons.totalPaid)}</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden bg-black/[0.04] dark:bg-white/[0.04] flex">
                <div 
                  className="h-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.round((cons.totalPaid / Math.max(fin.totalPaid, cons.totalPaid)) * 100)}%`, 
                    backgroundColor: '#ef4444' 
                  }} 
                />
              </div>
              <p className="text-[10px]" style={{ color: 'var(--c-muted)' }}>Você espera em média <strong>{(contemplacao/12).toFixed(0)} anos</strong> para ser sorteado.</p>
            </div>
          </div>

          {/* Destaques do veredito */}
          <div className="text-left text-xs space-y-2.5 border-t pt-4 max-w-md mx-auto" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex gap-2 items-start">
              <span className="text-sm">💰</span>
              <div>
                <strong style={{ color: 'var(--c-ink)' }}>Diferença Financeira:</strong>{' '}
                <span>
                  O vencedor é <strong style={{ color: winner === 'fin' ? '#3b82f6' : '#ef4444' }}>{formatBRL(diff)} mais barato</strong> no custo total somado do prazo.
                </span>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <span className="text-sm">🔑</span>
              <div>
                <strong style={{ color: 'var(--c-ink)' }}>Tempo e Posse do Bem:</strong>{' '}
                <span>
                  {winner === 'fin' 
                    ? 'No Financiamento você já usufrui do imóvel desde o primeiro mês. No consórcio, você paga parcelas por anos sem ter o bem.' 
                    : 'Se você realmente não tem pressa nenhuma e pode esperar, o Consórcio economizará juros significativos.'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <span className="text-sm">📈</span>
              <div>
                <strong style={{ color: 'var(--c-ink)' }}>Evolução das Parcelas:</strong>{' '}
                <span>
                  No Financiamento SAC a primeira parcela é {formatBRL(fin.firstPayment)} e a última cai para {formatBRL(fin.lastPayment)}. 
                  No Consórcio, ela começa em {formatBRL(cons.firstPayment)} mas sobe por inflação até {formatBRL(cons.lastPayment)} no final.
                </span>
              </div>
            </div>
          </div>

          {/* Regra de ouro */}
          <div className="rounded-xl p-3.5 text-xs text-left leading-relaxed max-w-md mx-auto" style={{ backgroundColor: 'rgba(0,0,0,0.03)', color: 'var(--c-muted)' }}>
            <strong style={{ color: 'var(--c-ink)' }}>💡 Regra de ouro:</strong>{' '}
            Se você precisa do bem logo ou quer amortizar com o FGTS, vá de <strong style={{ color: '#3b82f6' }}>Financiamento</strong>. 
            Se pode esperar sem data marcada E as taxas administrativas do grupo forem baixas, o <strong style={{ color: '#ef4444' }}>Consórcio</strong> vale a pena.
          </div>

          {/* Botão de compartilhar */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowShare(!showShare)}
              className="px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--c-line)',
                color: 'var(--c-ink)',
                backgroundColor: 'var(--c-surface)'
              }}
            >
              {showShare ? '✕ Ocultar compartilhamento' : '🔗 Compartilhar veredito matemático'}
            </button>
          </div>
        </div>

        {/* Share area (visible only when clicked) */}
        {showShare && (
          <div className="rounded-2xl p-4 border space-y-4" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
            <ScaledPreview>
              <ShareCardBase
                id="consorcio-quick-card"
                eyebrow={`Financiamento ${sacRate.toFixed(1)}% a.a. vs Consórcio ${adminFee}% adm.`}
                mainValue={winner === 'fin' ? '🏆 SAC VENCE' : '🏆 CONSÓRCIO VENCE'}
                mainLabel={`Bem de ${formatBRL(bemValue)} · ${(prazoMeses/12).toFixed(0)} anos`}
                metrics={[
                  { label: 'Total SAC',       value: formatBRL(fin.totalPaid) },
                  { label: 'Total Consórcio', value: formatBRL(cons.totalPaid) },
                  { label: 'Diferença',       value: formatBRL(diff) },
                  { label: 'Bem disponível',  value: winner === 'fin' ? 'Mês 1 (SAC)' : `Mês ${contemplacao} (Cons.)` },
                ]}
                footer="a matemática não mente. a ponta do lápis."
                accentColor={winner === 'fin' ? '#3b82f6' : '#ef4444'}
              />
            </ScaledPreview>
            <div className="mt-3">
              <ShareButtons cardId="consorcio-quick-card" filename="consorcio-vs-financiamento" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
