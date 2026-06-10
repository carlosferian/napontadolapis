'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { formatBRL, formatPct } from '@/lib/formatters'
import { calcHouseEdge, expectedValuePerBet, probProfit } from '@/lib/calculations/probability'
import { ChevronDown } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const ODD_OPTIONS = [1.5, 1.7, 1.9, 2.0, 2.5, 3.0]
const N_VALUES = [10, 50, 100, 500, 1000]

function oddToHumanContext(odd: number): string {
  if (odd <= 1.5) return 'resultado muito esperado — ex: time favorito em casa'
  if (odd <= 1.7) return 'favorito claro — comum em jogos desequilibrados'
  if (odd <= 1.9) return 'leve favorito — a odd mais jogada no Brasil'
  if (odd <= 2.0) return 'equilíbrio teórico — comum no cara ou coroa'
  if (odd <= 2.5) return 'zebra ou risco moderado — retorno elevado'
  return 'zebra clara ou partida imprevisível — risco extremo'
}

function getProfitComment(pct: number, odd: number): string {
  if (odd >= 2.0) return 'Em odds iguais ou maiores que 2.0, o retorno teórico parece equilibrado, mas na prática as bets embutem taxas ocultas e ajustam as odds para baixo.'
  if (pct < 5) return 'Após 1.000 rodadas, a probabilidade de você ter lucro é menor que 5%. A matemática é infalível: quanto mais você joga, mais certo é o prejuízo.'
  if (pct < 20) return 'Os números não mentem. Cada rodada individual é desfavorável ao jogador — o tempo e a recorrência são os maiores aliados da casa.'
  return 'A margem retida é menor nesta odd, porém está presente. No longo prazo, a perda total é estatisticamente garantida.'
}

function getDramaticAnalogy(profit1000: number): { headline: string; body: string } {
  if (profit1000 < 1) {
    return {
      headline: 'Matematicamente inviável no longo prazo.',
      body: 'Menos de 1% de chance de sair vitorioso após 1.000 jogadas. Se 500 pessoas fizessem exatamente a mesma sequência nessa odd, provavelmente nenhuma terminaria com lucro. A plataforma não precisa trapacear nem alterar os jogos; a margem teórica embutida garante a transferência de renda.',
    }
  }
  if (profit1000 < 5) {
    const n = Math.max(1, Math.round(profit1000))
    return {
      headline: `Apenas ${n} em cada 100 saem no lucro.`,
      body: `Imagine 100 apostadores em uma sala simulando 1.000 rodadas. Apenas ${n} saem no positivo. Os outros ${100 - n} perdem tudo — e todos eles, em algum momento do jogo, estiveram ganhando e acharam que seriam a grande exceção à regra.`,
    }
  }
  if (profit1000 < 15) {
    const n = Math.max(1, Math.round(profit1000 / 10))
    return {
      headline: `Apenas ${n} em cada 10 saem vitoriosos.`,
      body: `Em cada 10 pessoas simulando 1.000 apostas, apenas ${n} termina no verde. O ganhador não venceu por técnica ou inteligência; teve pura sorte estatística em um jogo desfavorável. Na próxima série de rodadas, essa sorte tende a sumir.`,
    }
  }
  if (profit1000 < 35) {
    return {
      headline: 'Menos de 1 em cada 3 sai no positivo.',
      body: 'As odds altas diminuem a retenção imediata da casa. Mesmo assim, após 1.000 rodadas, mais de 2 em cada 3 apostadores terminam no vermelho. A sensação de "quase vitória" é projetada nas plataformas para instigar novas jogadas.',
    }
  }
  return {
    headline: 'Margem presente a cada rodada.',
    body: 'Odds equilibradas têm margem menor, permitindo maior oscilação (variância) no curto prazo. Mas no longo prazo, para cada R$ 100 apostados coletivamente, a margem de retenção da casa embolsa sua parte exata. A matemática é implacável.',
  }
}

function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block align-middle ml-1.5">
      <button
        type="button"
        className="w-4 h-4 rounded-full border text-[9px] flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
        style={{ borderColor: 'var(--c-line-strong)', color: 'var(--c-muted)' }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        aria-label="Mais informações"
      >
        i
      </button>
      {open && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 text-xs rounded-xl z-50 leading-relaxed shadow-xl"
          style={{
            backgroundColor: 'var(--c-surface)',
            color: 'var(--c-ink)',
            border: '1px solid var(--c-line)'
          }}
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800 dark:border-t-stone-950" />
        </div>
      )}
    </span>
  )
}

interface OddsShareCardProps {
  odd: number
  betAmount: number
  houseEdge: number
  ev: number
  profit1000: number
}

function OddsShareCard({ odd, betAmount, houseEdge, ev, profit1000 }: OddsShareCardProps) {
  const lossPerBet = Math.abs(Math.min(ev, 0))
  const accentColor = '#ef4444'
  return (
    <div
      id="odds-share-card"
      style={{
        backgroundColor: '#1E2538',
        backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.04), transparent 45%), radial-gradient(circle at 10% 90%, rgba(255, 255, 255, 0.02), transparent 45%)',
        width: 600,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
      }}
    >
      {/* Background glow in coral-red */}
      <div 
        style={{
          position: 'absolute',
          top: -150,
          right: -150,
          width: 350,
          height: 350,
          borderRadius: '50%',
          backgroundColor: accentColor,
          opacity: 0.12,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 350,
          height: 350,
          borderRadius: '50%',
          backgroundColor: accentColor,
          opacity: 0.08,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header bar */}
      <div
        style={{
          backgroundColor: '#141A29',
          padding: '18px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Glowing neon dot */}
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 12px 3px ${accentColor}`,
            }}
          />
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '5px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            A PONTA DO LÁPIS
          </span>
        </div>
        <span style={{ color: accentColor, opacity: 0.65, fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', fontFamily: 'monospace' }}>
          apontadolapis.com.br
        </span>
      </div>

      {/* Main content */}
      <div style={{ padding: '36px 36px 0', position: 'relative', zIndex: 2 }}>
        {/* Eyebrow */}
        <div
          style={{
            color: '#8E9CAE',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            marginBottom: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ width: 12, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          matemática das apostas · odd {odd.toFixed(2)}
        </div>

        {/* Main value */}
        <div
          style={{
            color: accentColor,
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: '-2.5px',
            lineHeight: 1.05,
            marginBottom: 10,
            textShadow: `0 0 20px rgba(239, 68, 68, 0.15)`,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {ev < 0 ? `−${formatBRL(lossPerBet)}` : `±${formatBRL(0)}`}
        </div>

        {/* Main label */}
        <div
          style={{
            color: '#94A3B8',
            fontSize: 14,
            marginBottom: 32,
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          de perda matemática esperada por aposta de {formatBRL(betAmount)}
        </div>

        {/* Metrics grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 36,
          }}
        >
          {[
            { label: 'ODD ANALISADA', value: odd.toFixed(2) },
            { label: 'MARGEM DA CASA', value: formatPct(houseEdge) },
            { label: 'RETORNO POR APOSTA', value: formatPct(100 - houseEdge) },
            { label: 'CHANCE DE LUCRO (1000 apostas)', value: formatPct(profit1000) },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                padding: '18px 20px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderLeft: `4px solid ${accentColor}`,
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  color: '#64748B',
                  fontSize: 9,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: 6,
                  fontWeight: 700,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  color: '#F8FAFC',
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                }}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div
        style={{
          backgroundColor: '#141A29',
          padding: '16px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span
          style={{
            color: '#64748B',
            fontSize: 11,
            fontStyle: 'italic',
            fontFamily: 'Georgia, serif',
            fontWeight: 500,
          }}
        >
          “ a casa sempre tem vantagem matemática no longo prazo. ”
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: accentColor, opacity: 0.8, boxShadow: `0 0 8px 1px ${accentColor}` }} />
          <span style={{ color: '#64748B', fontSize: 9, fontWeight: 700, letterSpacing: '1.5px' }}>
            METRICAS VERIFICADAS
          </span>
        </div>
      </div>
    </div>
  )
}

export function OddsCalculator() {
  const [odd, setOdd] = useState(1.9)
  const [betAmount, setBetAmount] = useState(50)
  const [oddPanelOpen, setOddPanelOpen] = useState(false)

  // Simulation states
  const [simHistory, setSimHistory] = useState<number[]>([])
  const [simPeak, setSimPeak] = useState(1000)
  const [simFinal, setSimFinal] = useState(1000)
  const [simWins, setSimWins] = useState(0)
  const [simActive, setSimActive] = useState(false)

  const houseEdge = calcHouseEdge(odd)
  const ev = expectedValuePerBet(odd, betAmount)
  const profit1000 = probProfit(odd, 1000)
  const lossPerBet = Math.abs(Math.min(ev, 0))
  const analogy = getDramaticAnalogy(profit1000)

  // Virtual 100-round bet simulator
  function runSimulation() {
    setSimActive(true)
    let currentBalance = 1000
    let peak = 1000
    let winsCount = 0
    const history: number[] = [1000]

    // True probability of winning a 50/50 prediction is 50%
    const winProbability = 0.5

    for (let i = 0; i < 100; i++) {
      if (currentBalance < betAmount) {
        break // Broke!
      }
      const didWin = Math.random() < winProbability
      if (didWin) {
        currentBalance += betAmount * (odd - 1)
        winsCount++
      } else {
        currentBalance -= betAmount
      }

      if (currentBalance > peak) {
        peak = currentBalance
      }
      history.push(Math.round(currentBalance))
    }

    setSimPeak(peak)
    setSimFinal(currentBalance)
    setSimWins(winsCount)
    setSimHistory(history)
    setSimActive(false)
  }

  const simChartData = useMemo(() => {
    return simHistory.map((val, idx) => ({
      rodada: `R${idx}`,
      Saldo: val,
    }))
  }, [simHistory])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      
      {/* ── LEFT COLUMN: CONTROLS & SETUP (lg:col-span-5) ── */}
      <div className="lg:col-span-5 space-y-4">
        <CalculatorCard title="Probabilidades Reais" subtitle="A casa nunca joga para perder. Veja a matemática crua.">
          
          {/* Bet size */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label htmlFor="bet-amount" className="text-base font-semibold" style={{ color: 'var(--c-muted)' }}>
                Valor por aposta
              </label>
              <div className="relative w-36">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="bet-amount"
                  type="number"
                  inputMode="decimal"
                  min={10}
                  max={500}
                  value={betAmount || ''}
                  onChange={(e) => setBetAmount(Math.max(10, Number(e.target.value) || 0))}
                  className="w-full text-right border rounded-xl pr-3.5 pl-8 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-455 tabular-nums"
                  style={{
                    backgroundColor: 'var(--c-bg)',
                    color: 'var(--c-ink)',
                    borderColor: 'var(--c-line)'
                  }}
                />
              </div>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              aria-label="Valor por Aposta Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 10</span>
              <span>R$ 500</span>
            </div>
          </div>

          {/* Odd selector */}
          <div 
            className="rounded-xl border overflow-hidden"
            style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}
            onMouseEnter={() => setOddPanelOpen(true)}
            onMouseLeave={() => setOddPanelOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOddPanelOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
              aria-expanded={oddPanelOpen}
            >
              <span className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
                Odd selecionada:{' '}
                <strong style={{ color: 'var(--c-ink)' }}>{odd.toFixed(2)}</strong>
                {' '}—{' '}
                <span style={{ color: 'var(--c-muted)' }}>{oddToHumanContext(odd)}</span>
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${oddPanelOpen ? 'rotate-180' : ''}`}
                style={{ color: 'var(--c-muted)' }}
              />
            </button>

            <div
              className={`transition-all duration-300 ease-in-out ${
                oddPanelOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="px-4 pb-4 pt-1 space-y-4 border-t" style={{ borderColor: 'var(--c-line)', backgroundColor: 'var(--c-bg)' }}>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>O que é uma odd?</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
                    A odd é o multiplicador que a casa paga caso você acerte.
                    Com odd <strong>{odd.toFixed(2)}</strong>, cada{' '}
                    <strong>{formatBRL(betAmount)}</strong> apostado vira{' '}
                    <strong>{formatBRL(betAmount * odd)}</strong> em caso de vitória
                    — mas a sua chance real de ganhar é sempre menor do que{' '}
                    <strong>{formatPct((1 / odd) * 100)}</strong>.
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                    A diferença entre a probabilidade real de vitória e a odd informada é o lucro garantido embutido da plataforma.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Ajustar a odd</p>
                  <div className="grid grid-cols-3 gap-2">
                    {ODD_OPTIONS.map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setOdd(o)}
                        className="py-2.5 rounded-lg text-sm font-bold border transition-all cursor-pointer"
                        style={odd === o ? {
                          backgroundColor: 'var(--c-emerald)',
                          color: '#ffffff',
                          borderColor: 'transparent'
                        } : {
                          backgroundColor: 'var(--c-surface)',
                          color: 'var(--c-muted)',
                          borderColor: 'var(--c-line)'
                        }}
                      >
                        {o.toFixed(2)}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider pt-1" style={{ color: 'var(--c-muted)' }}>
                    <span>← Favorito claro</span>
                    <span>Zebra de risco →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CalculatorCard>

        {/* ── OFFICIAL STATISTICS (BACEN & SBVC) ── */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}
        >
          <div>
            <span className="c-pill c-pill-copper" style={{ marginBottom: 8, display: 'inline-flex' }}>
              DADOS OFICIAIS
            </span>
            <h3 className="text-lg font-bold font-serif" style={{ color: 'var(--c-ink)' }}>O Impacto das Bets no Brasil</h3>
          </div>

          <div className="space-y-3.5 divide-y" style={{ borderColor: 'var(--c-line)' }}>
            
            {/* 1. Banco Central */}
            <div className="space-y-1 pt-3 first:pt-0 first:border-0">
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--c-copper)' }}>
                <span>🏛️</span>
                <span>BANCO CENTRAL DO BRASIL (09/2024)</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
                Os brasileiros transferiram <strong>R$ 20,8 bilhões</strong> via Pix para casas de apostas em um único mês. Cerca de <strong>5 milhões de beneficiários do Bolsa Família</strong> gastaram <strong>R$ 3 bilhões</strong> em bets nesse período (média de R$ 100 por pessoa).
              </p>
            </div>

            {/* 2. SBVC */}
            <div className="space-y-1 pt-3">
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--c-copper)' }}>
                <span>📊</span>
                <span>SOCIEDADE BRASILEIRA DE VAREJO (2024)</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
                <strong>63% dos apostadores</strong> tiveram sua renda principal comprometida. <strong>23% reduziram a compra de vestuário</strong> e <strong>19% sacrificaram gastos com saúde e medicamentos</strong> para continuar apostando.
              </p>
            </div>

            {/* 3. USP */}
            <div className="space-y-1 pt-3">
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--c-copper)' }}>
                <span>🧠</span>
                <span>INSTITUTO DE PSIQUIATRIA DA USP</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
                A facilidade do acesso móvel e a sensação de "ganho fácil" aumentaram os diagnósticos de ludomania (vício em jogo) em mais de <strong>150% nos últimos 3 anos</strong>, afetando de forma severa o orçamento familiar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: SIMULATOR & EXPECTED LOSS (lg:col-span-7) ── */}
      <div role="region" aria-live="polite" aria-label="Resultados e Simulações" className="lg:col-span-7 space-y-4">
        
        {/* Expected value card */}
        <div 
          className="rounded-2xl border p-5"
          style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--c-muted)' }}>O que acontece com cada aposta</p>
          {ev < 0 ? (
            <>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-red-500 tabular-nums break-words">−{formatBRL(lossPerBet)}</span>
                <span className="text-sm flex items-center flex-wrap" style={{ color: 'var(--c-muted)' }}>
                  de perda esperada por aposta
                  <InfoTip text={`Valor Esperado (VE): a perda média estatística por aposta. Numa odd de ${odd.toFixed(2)}, cada R$ ${betAmount} apostado resulta em um VE negativo de R$ ${lossPerBet.toFixed(2)}. A longo prazo, a lei dos grandes números garante que o seu resultado real se aproximará desse prejuízo médio.`} />
                </span>
              </div>
              <p className="text-xs mt-3.5" style={{ color: 'var(--c-muted)' }}>
                A plataforma retém{' '}
                <strong style={{ color: 'var(--c-ink)' }}>{formatPct(houseEdge)}</strong>
                <InfoTip text={`Margem de Retenção (House Edge): Para cada R$ 100 apostados coletivamente por todos os jogadores, a casa retém R$ ${houseEdge.toFixed(1)} garantidos matematicamente. Essa margem financia a plataforma e não depende de sorte.`} />
                {' '}em média. Você recebe de volta{' '}
                <strong style={{ color: 'var(--c-ink)' }}>{formatPct(100 - houseEdge)}</strong>
                <InfoTip text={`RTP (Return to Player): ${(100 - houseEdge).toFixed(1)}% de todo o dinheiro apostado retorna aos jogadores como prêmios. Porém, a longo prazo, essa circulação esgota o bolso dos apostadores.`} />
                {' '}do total que aposta.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-amber-500 tabular-nums">±{formatBRL(0)}</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>Valor esperado neutro teórico</span>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--c-muted)' }}>
                Uma odd ≥ 2.0 em evento equilibrado 50/50 seria justa, mas na prática as bets não fornecem essa proporção real para garantir seu lucro comercial.
              </p>
            </>
          )}
        </div>

        {/* ── INTERACTIVE 100-ROUND BET SIMULATOR (WOW FACTOR) ── */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}
        >
          <div>
            <span className="c-pill" style={{ marginBottom: 8, display: 'inline-flex' }}>
              SIMULADOR INTERATIVO
            </span>
            <h3 className="text-lg font-bold font-serif" style={{ color: 'var(--c-ink)' }}>Simular 100 Rodadas Rápidas</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>
              Veja como a oscilação do jogo cria a ilusão de ganho rápido, mas a matemática vence no fim.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={runSimulation}
              disabled={simActive}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {simActive ? 'Simulando...' : '🎰 Jogar Bet Virtual'}
            </button>
            <p className="text-xs" style={{ color: 'var(--c-muted)' }}>
              Carteira inicial de R$ 1.000 virtual · Aposta de {formatBRL(betAmount)} a cada rodada.
            </p>
          </div>

          {simHistory.length > 0 && (
            <div className="space-y-4 pt-3 border-t" style={{ borderColor: 'var(--c-line)' }}>
              
              {/* Simulator Metrics grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl border text-center" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Maior Pico (Sensação)</p>
                  <p className="text-base font-bold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">{formatBRL(simPeak)}</p>
                </div>
                <div className="p-3 rounded-xl border text-center" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Saldo Final</p>
                  <p className={`text-base font-bold tabular-nums mt-1 ${simFinal < 1000 ? 'text-red-500' : 'text-emerald-600'}`}>{formatBRL(simFinal)}</p>
                </div>
                <div className="p-3 rounded-xl border text-center" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Resultado</p>
                  <p className={`text-base font-bold mt-1 ${simFinal < 1000 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {simFinal < 1000 ? `-${formatPct(((1000 - simFinal)/1000)*100)}` : `+${formatPct(((simFinal - 1000)/1000)*100)}`}
                  </p>
                </div>
              </div>

              {/* Sparkline chart of history */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Histórico da Carteira Virtual</p>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" vertical={false} />
                      <XAxis dataKey="rodada" hide />
                      <YAxis tick={{ fontSize: 9, fill: '#78716c' }} domain={['auto', 'auto']} tickLine={false} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          return (
                            <div className="bg-stone-850 text-white rounded-lg px-2.5 py-1 text-[10px] font-semibold tabular-nums">
                              Saldo: {formatBRL(Number(payload[0].value))}
                            </div>
                          )
                        }}
                      />
                      <Line type="monotone" dataKey="Saldo" stroke={simFinal < 1000 ? '#ef4444' : '#10b981'} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Psychological feedback banner */}
              <div 
                className="rounded-xl border p-4 text-xs leading-relaxed"
                style={
                  simFinal < 1000 
                    ? { backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.2)' }
                    : { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.2)' }
                }
              >
                {simPeak > 1000 ? (
                  <p style={{ color: 'var(--c-ink)' }}>
                    💡 <strong>A Armadilha do Cérebro:</strong> Durante a simulação, sua carteira subiu e você chegou a ter <strong>{formatBRL(simPeak)}</strong>! Essa alta temporária gera uma forte descarga de dopamina e cria a crença de que você "venceu a casa". Mas, ao continuar jogando, a margem teórica se impôs e você acabou terminando a rodada com <strong>{formatBRL(simFinal)}</strong>. A casa sempre vence pela persistência.
                  </p>
                ) : (
                  <p style={{ color: 'var(--c-ink)' }}>
                    💡 <strong>Prejuízo imediato:</strong> Sem nem atingir picos, a margem matemática puxou seu saldo para baixo de forma constante desde o início. A variância não te favoreceu e a carteira fechou com <strong>{formatBRL(simFinal)}</strong>.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Probability scale list */}
        <SectionDivider label="Probabilidade de Lucro após N apostas" />

        <div 
          className="rounded-2xl border p-5 space-y-3"
          style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}
        >
          <p className="text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            À medida que o volume de apostas cresce, a variância (sorte) diminui e a desvantagem matemática da casa assume o controle.
          </p>
          
          <div className="space-y-3 pt-2">
            {N_VALUES.map((n) => {
              const pct = probProfit(odd, n)
              const tipText = n <= 50
                ? `Com apenas ${n} apostas, o resultado é muito volátil e a sorte temporária pode simular ganhos. Mas a desvantagem já existe.`
                : `Com ${n.toLocaleString('pt-BR')} apostas, a variância cai a zero. A chance de terminar no positivo é de apenas ${formatPct(pct)}, contra ${formatPct(100 - pct)} de prejuízo.`

              return (
                <div key={n} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold w-36 flex-shrink-0" style={{ color: 'var(--c-muted)' }}>Após {n.toLocaleString('pt-BR')} bets</span>
                  <div className="flex-1 bg-stone-100 dark:bg-stone-900 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(pct, 1)}%`,
                        backgroundColor: pct < 15 ? '#ef4444' : pct < 35 ? '#f59e0b' : '#22c55e',
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0 w-16 justify-end">
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        pct < 15 ? 'text-red-500' : pct < 35 ? 'text-amber-500' : 'text-emerald-600'
                      }`}
                    >
                      {formatPct(pct)}
                    </span>
                    <InfoTip text={tipText} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dramatic analogy card */}
        <div 
          className="rounded-2xl p-5 space-y-2 border"
          style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Na Prática</p>
          <p className="text-base font-bold leading-snug" style={{ color: 'var(--c-ink)' }}>{analogy.headline}</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>{analogy.body}</p>
          <p className="text-xs italic pt-1 border-t mt-1" style={{ borderColor: 'var(--c-line)', color: 'var(--c-muted)' }}>{getProfitComment(profit1000, odd)}</p>
        </div>

        {/* Help resources links */}
        <div className="bg-red-500/5 dark:bg-red-950/20 border border-red-500/20 rounded-2xl p-4 space-y-3">
          <div>
            <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide">Apoio e Prevenção ao Vício</p>
            <p className="text-xs text-red-600 dark:text-red-300 mt-1 leading-relaxed">
              O transtorno por jogo de apostas (ludomania) afeta a saúde mental e orçamentos familiares. Se você ou alguém próximo perdeu o controle, há canais de ajuda gratuitos e confidenciais:
            </p>
          </div>
          <div className="space-y-2">
            <a
              href="https://ja.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white dark:bg-stone-900 rounded-xl px-3 py-2.5 border border-red-500/10 hover:border-red-500/30 transition-colors group"
            >
              <div>
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">Jogadores Anônimos Brasil</p>
                <p className="text-[10px] text-stone-400 dark:text-stone-500">ja.org.br — reuniões presenciais e online gratuitas</p>
              </div>
              <span className="text-stone-300 group-hover:text-red-400 transition-colors ml-3">→</span>
            </a>
            <a
              href="https://cvv.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white dark:bg-stone-900 rounded-xl px-3 py-2.5 border border-red-500/10 hover:border-red-500/30 transition-colors group"
            >
              <div>
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">CVV — Centro de Valorização da Vida</p>
                <p className="text-[10px] text-stone-400 dark:text-stone-500">cvv.org.br · Disque 188 — 24h, gratuito e sob sigilo</p>
              </div>
              <span className="text-stone-300 group-hover:text-red-400 transition-colors ml-3">→</span>
            </a>
            <div className="bg-white dark:bg-stone-900 rounded-xl px-3 py-2.5 border border-red-500/10 text-xs">
              <p className="font-semibold text-stone-700 dark:text-stone-300">CAPS AD (SUS)</p>
              <p className="text-[10px] text-stone-400 dark:text-stone-500">Disque 136 (Disque Saúde) para localizar o CAPS Álcool e Drogas gratuito mais próximo.</p>
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-4">
          <p className="text-xs text-stone-400 mb-3 text-center">Compartilhe este alerta matemático</p>
          <ScaledPreview>
            <OddsShareCard
              odd={odd}
              betAmount={betAmount}
              houseEdge={houseEdge}
              ev={ev}
              profit1000={profit1000}
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="odds-share-card" filename="odds" />
          </div>
        </div>
      </div>
    </div>
  )
}
