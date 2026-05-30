'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Play, RefreshCw, Flame } from 'lucide-react'
import { formatBRL } from '@/lib/formatters'

// ── Modalidades ──────────────────────────────────────────────────────────
const MODALITIES = [
  // rtp not used in Phase 1 — scripted rounds override outcome. Used in BetsNarrative odds calculator.
  { id: 'slots',    emoji: '🐯', name: 'Tigrinho',  rtp: 0.85, edge: '15% de perda embutida' },
  { id: 'crash',    emoji: '🚀', name: 'Foguetinho', rtp: 0.90, edge: '10% de perda embutida' },
  { id: 'sports',   emoji: '⚽', name: 'Múltiplas',  rtp: 0.75, edge: '25% de perda embutida' },
  { id: 'roulette', emoji: '🎡', name: 'Roleta',     rtp: 0.973, edge: '2.7% de perda embutida' },
] as const

// ── 15 Rodadas Pré-definidas (arco dopamina → ruína) ─────────────────────
// {win} no msg é substituído pelo valor real em tempo de render
const PREDEFINED_ROUNDS = [
  { win: true,  mult: 2.0, msg: '🐯 O Tigre soltou a carta de ouro! Você ganhou {win} de volta. É fácil, né?' },
  { win: true,  mult: 1.8, msg: '🚀 MULTIPLICOU! O Foguetinho subiu até 1.8x. {win} líquidos. Você sente que tem o controle!' },
  { win: false, mult: 0,   msg: '❌ Derrota... A bola bateu na trave no último segundo. Tente mais uma para recuperar!' },
  { win: false, mult: 0,   msg: '🎡 A roleta caiu na cor errada por um fio. A sorte está logo ali...' },
  { win: true,  mult: 4.0, msg: '🎉 BIG WIN!!! 💰 O Tigre multiplicou por 4x! {win} líquidos! Seu cérebro é inundado por dopamina!' },
  { win: false, mult: 0,   msg: '❌ Derrota... Faz parte do gerenciamento de risco. Você ainda está no lucro!' },
  { win: false, mult: 0,   msg: '🚀 O foguete explodiu instantaneamente. Quase deu tempo de sair. Tente de novo!' },
  { win: false, mult: 0,   msg: '❌ Roleta caiu no zero verde. A casa sempre tem essa vantagem oculta.' },
  { win: true,  mult: 1.2, msg: '🐯 Vitória discreta! {win}. Pelo menos recuperou parte. A maré vai virar!' },
  { win: false, mult: 0,   msg: '❌ Derrota... Virada nos acréscimos. A banca agradece.' },
  { win: false, mult: 0,   msg: '🐯 Nada na tela. Você começa a se sentir ansioso para recuperar.' },
  { win: false, mult: 0,   msg: '🚀 Foguete explodiu rápido de novo. A sensação de controle sumiu.' },
  { win: false, mult: 0,   msg: '❌ O saldo está encolhendo em ritmo assustador. Só mais um clique!' },
  { win: false, mult: 0,   msg: '❌ A roleta ignorou sua cor. O pânico de perder tudo bate forte.' },
  { win: false, mult: 0,   msg: '🚨 ALL-IN FORÇADO! Você colocou tudo que restava e... perdeu. O saldo chegou a zero.' },
] as const

// ── Sistema de Decadência: configurações por estágio ─────────────────────
type DecayStage = 0 | 1 | 2 | 3 | 4

function getDecayStage(decay: number): DecayStage {
  if (decay < 20) return 0
  if (decay < 40) return 1
  if (decay < 60) return 2
  if (decay < 80) return 3
  return 4
}

interface StageConfig {
  containerBg: string
  border: string
  containerShadow: string
  titleColor: string
  balanceColor: string
  btnBg: string
  btnColor: string
  btnShadow: string
  liveColor: string
  flickerAnim: string
  slotEmojis: [string | null, string | null, string | null]
  slotBorders: [string, string, string]
  slotGlows: [string, string, string]
  grayscale: number
  showMoneyFly: number   // 0 = não mostra, 1/2/3/4 = quantidade
  showSpider: boolean
  showCrack: boolean
  crackOpacity: number
}

const STAGE_CONFIGS: StageConfig[] = [
  // Estágio 0 — Pristine (0-20%)
  {
    containerBg: '#14102a',
    border: '#e0b35a',
    containerShadow: '0 0 20px rgba(224,179,90,0.15)',
    titleColor: '#fcd34d',
    balanceColor: '#fcd34d',
    btnBg: 'linear-gradient(135deg,#fcd34d,#f59e0b,#d97706)',
    btnColor: '#000',
    btnShadow: '0 4px 16px rgba(245,158,11,0.5)',
    liveColor: '#ff6b6b',
    flickerAnim: '',
    slotEmojis: [null, null, null],
    slotBorders: ['#d97706', '#3b82f6', '#22c55e'],
    slotGlows: ['rgba(217,119,6,0.6)', 'rgba(59,130,246,0.5)', 'rgba(34,197,94,0.5)'],
    grayscale: 0,
    showMoneyFly: 0,
    showSpider: false,
    showCrack: false,
    crackOpacity: 0,
  },
  // Estágio 1 — Primeiros Sinais (20-40%)
  {
    containerBg: '#110e22',
    border: '#b45309',
    containerShadow: 'none',
    titleColor: '#fb923c',
    balanceColor: '#fb923c',
    btnBg: 'linear-gradient(135deg,#d97706,#b45309)',
    btnColor: '#000',
    btnShadow: '0 3px 8px rgba(180,83,9,0.3)',
    liveColor: '#f87171',
    flickerAnim: 'casino-flicker-slow 3s infinite',
    slotEmojis: [null, null, null],
    slotBorders: ['#92400e', '#1e3a6e', '#166534'],
    slotGlows: ['rgba(146,64,14,0.3)', 'none', 'rgba(22,100,52,0.2)'],
    grayscale: 0,
    showMoneyFly: 1,
    showSpider: false,
    showCrack: false,
    crackOpacity: 0,
  },
  // Estágio 2 — Alerta (40-60%)
  {
    containerBg: '#0d0508',
    border: '#dc2626',
    containerShadow: 'none',
    titleColor: '#f87171',
    balanceColor: '#f87171',
    btnBg: '#7f1d1d',
    btnColor: '#fca5a5',
    btnShadow: 'none',
    liveColor: '#f87171',
    flickerAnim: 'casino-flicker-fast 1.5s infinite',
    slotEmojis: [null, '😵', null],
    slotBorders: ['#7f1d1d', '#991b1b', '#7f1d1d'],
    slotGlows: ['none', 'none', 'none'],
    grayscale: 0.3,
    showMoneyFly: 2,
    showSpider: true,
    showCrack: false,
    crackOpacity: 0,
  },
  // Estágio 3 — Crítico (60-80%)
  {
    containerBg: '#110303',
    border: '#7f1d1d',
    containerShadow: 'none',
    titleColor: '#ef4444',
    balanceColor: '#ef4444',
    btnBg: '#3f0000',
    btnColor: '#ef4444',
    btnShadow: 'none',
    liveColor: '#ef4444',
    flickerAnim: 'casino-flicker-fast 0.8s infinite',
    slotEmojis: ['💀', null, null],
    slotBorders: ['#450a0a', '#450a0a', '#450a0a'],
    slotGlows: ['none', 'none', 'none'],
    grayscale: 0.6,
    showMoneyFly: 3,
    showSpider: true,
    showCrack: true,
    crackOpacity: 0.5,
  },
  // Estágio 4 — Colapso (80-100%)
  {
    containerBg: '#0d0000',
    border: '#450a0a',
    containerShadow: '0 0 12px rgba(220,38,38,0.2)',
    titleColor: '#dc2626',
    balanceColor: '#dc2626',
    btnBg: '#0a0000',
    btnColor: '#450a0a',
    btnShadow: 'none',
    liveColor: '#dc2626',
    flickerAnim: 'casino-flicker-critical 0.4s infinite',
    slotEmojis: ['💀', '💀', '💀'],
    slotBorders: ['#1c0000', '#1c0000', '#1c0000'],
    slotGlows: ['none', 'none', 'none'],
    grayscale: 0.9,
    showMoneyFly: 4,
    showSpider: true,
    showCrack: true,
    crackOpacity: 0.8,
  },
]

// ── Emojis dos slots por modalidade ──────────────────────────────────────
const SLOT_EMOJIS: Record<string, [string, string, string]> = {
  slots:    ['🐯', '🍒', '💎'],
  crash:    ['🚀', '💥', '🟢'],
  sports:   ['⚽', '🏆', '🎯'],
  roulette: ['🔴', '⚫', '🟢'],
}

// ── Props ─────────────────────────────────────────────────────────────────
interface BetsCasinoProps {
  onBankrupt: (rounds: number) => void
}

// ── Log entry ─────────────────────────────────────────────────────────────
interface LogEntry {
  id: number
  mod: string
  result: 'win' | 'lose'
  val: number
  msg: string
}

export function BetsCasino({ onBankrupt }: BetsCasinoProps) {
  const [balance, setBalance]               = useState(200)
  const [betAmount, setBetAmount]           = useState(20)
  const [modality, setModality]             = useState<string>('slots')
  const [roundCount, setRoundCount]         = useState(0)
  const [log, setLog]                       = useState<LogEntry[]>([])
  const [isRolling, setIsRolling]           = useState(false)
  const [rollingEmoji, setRollingEmoji]     = useState('🐯')
  const [bankrupt, setBankrupt]             = useState(false)

  // Decay: 0 (pristine) → 100 (colapso), derivado do balance
  const decay = useMemo(
    () => Math.max(0, Math.round((200 - balance) / 2)),
    [balance]
  )
  const stage = useMemo(() => getDecayStage(decay), [decay])
  const cfg   = STAGE_CONFIGS[stage]

  // Emoji spinning durante o roll
  useEffect(() => {
    if (!isRolling) return
    const emojis = ['🐯', '🚀', '⚽', '🎡', '💎', '🍒', '💥', '🟢', '⭐']
    let i = 0
    const interval = setInterval(() => {
      setRollingEmoji(emojis[i % emojis.length])
      i++
    }, 80)
    return () => clearInterval(interval)
  }, [isRolling])

  const handleBet = useCallback(() => {
    if (balance <= 0 || isRolling) return
    setIsRolling(true)

    setTimeout(() => {
      setIsRolling(false)
      const idx       = Math.min(roundCount, PREDEFINED_ROUNDS.length - 1)
      const round     = PREDEFINED_ROUNDS[idx]
      const bet       = Math.min(betAmount, balance)
      const mod       = MODALITIES.find(m => m.id === modality)!
      let nextBalance = balance
      let winAmt      = 0
      let result: 'win' | 'lose' = 'lose'

      if (round.win && idx < PREDEFINED_ROUNDS.length - 1) {
        winAmt      = Math.round(bet * round.mult)
        nextBalance = balance - bet + winAmt
        result      = 'win'
      } else {
        nextBalance = balance - bet
      }

      nextBalance = Math.max(0, nextBalance)

      // Preenche {win} na mensagem com o valor real
      const netGain = winAmt - bet
      const msg     = round.msg.replace('{win}', formatBRL(Math.abs(netGain)))

      setBalance(nextBalance)
      setRoundCount(r => r + 1)
      setLog(prev => [
        { id: Date.now(), mod: mod.emoji, result, val: result === 'win' ? netGain : -bet, msg },
        ...prev.slice(0, 14),
      ])

      if (nextBalance <= 0) {
        setBankrupt(true)
        setTimeout(() => onBankrupt(roundCount + 1), 800)
      }
    }, 750)
  }, [balance, betAmount, isRolling, modality, roundCount, onBankrupt])

  const handleReset = useCallback(() => {
    setBalance(200)
    setBetAmount(20)
    setModality('slots')
    setRoundCount(0)
    setLog([])
    setBankrupt(false)
    setIsRolling(false)
  }, [])

  const slotBase = SLOT_EMOJIS[modality] ?? SLOT_EMOJIS.slots

  return (
    <div
      className="rounded-[32px] border-2 overflow-hidden"
      style={{
        background:   cfg.containerBg,
        borderColor:  cfg.border,
        boxShadow:    cfg.containerShadow,
        transition:   'background 0.8s ease, border-color 0.8s ease',
        position:     'relative',
      }}
    >
      {/* Gradiente de fundo radial (pristine only) */}
      {stage === 0 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(224,179,90,0.45) 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, rgba(100,50,220,0.25) 0%, transparent 45%), radial-gradient(ellipse at 90% 70%, rgba(30,120,220,0.2) 0%, transparent 40%)',
          }}
        />
      )}

      {/* Rachadura SVG — aparece no estágio 3+ */}
      {cfg.showCrack && (
        <svg
          className="pointer-events-none absolute top-0 right-0"
          width="120" height="120"
          viewBox="0 0 120 120"
          style={{ opacity: cfg.crackOpacity, transition: 'opacity 1s ease' }}
        >
          <path
            d="M120,0 L88,22 L102,52 L72,48 L88,95 L56,90 L68,120"
            stroke="#dc2626" strokeWidth="2.5" fill="none" strokeLinecap="round"
          />
          <path d="M102,52 L116,62" stroke="#dc2626" strokeWidth="1.5" fill="none" opacity="0.5"/>
          <path d="M20,0 L42,15 L30,38 L52,34" stroke="#dc2626" strokeWidth="1.5" fill="none" opacity="0.4"/>
        </svg>
      )}

      {/* Símbolos de decadência flutuantes */}
      {cfg.showSpider  && <div className="absolute top-3 right-3 text-base pointer-events-none" style={{ opacity: 0.7 }}>🕷️</div>}
      {stage >= 3      && <div className="absolute top-3 left-3 text-sm pointer-events-none" style={{ animation: 'casino-flicker-fast 0.8s infinite' }}>🚨</div>}
      {stage >= 3      && <div className="absolute bottom-20 right-4 text-sm pointer-events-none" style={{ opacity: 0.6 }}>💔</div>}
      {Array.from({ length: cfg.showMoneyFly }).map((_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none text-xs"
          style={{
            left: `${15 + i * 20}%`,
            top: '42%',
            animation: `money-fly ${0.8 + i * 0.25}s ${i * 0.2}s ease-out infinite`,
            opacity: 0,
          }}
        >💸</div>
      ))}

      <div className="relative z-10 p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1.5">
            <Flame size={12} style={{ color: cfg.liveColor }} />
            <span
              className="text-[10px] font-extrabold uppercase tracking-widest"
              style={{ color: cfg.liveColor, animation: cfg.flickerAnim || undefined }}
            >
              {stage < 4 ? 'CASSINO DIGITAL AO VIVO' : '💀 CASSINO MORTO'}
            </span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {stage < 4 ? '148.320 jogando' : 'SALDO ESGOTADO'}
          </span>
        </div>

        {/* Título */}
        <div
          className="text-center text-[11px] font-black uppercase tracking-[4px]"
          style={{
            color:       cfg.titleColor,
            animation:   stage === 0 ? 'casino-glow 2s infinite' : cfg.flickerAnim || undefined,
            textShadow:  stage === 0 ? '0 0 12px rgba(252,211,77,0.8)' : 'none',
            transition:  'color 1s ease',
          }}
        >
          ⚡ FORTUNE TIGER ⚡
        </div>

        {/* Seletor de modalidades */}
        <div className="grid grid-cols-2 gap-2">
          {MODALITIES.map(m => (
            <button
              key={m.id}
              onClick={() => !isRolling && setModality(m.id)}
              disabled={isRolling || bankrupt}
              className="p-2.5 rounded-2xl border text-left transition-all cursor-pointer disabled:opacity-40"
              style={modality === m.id
                ? { background: `${cfg.border}18`, borderColor: cfg.border, color: 'white' }
                : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)', color: '#6b7280' }
              }
            >
              <span className="text-4xl block mb-1">{m.emoji}</span>
              <span className="text-[10px] font-extrabold block truncate">{m.name}</span>
              <span className="text-[9px] block mt-0.5" style={{ color: cfg.border }}>{m.edge}</span>
            </button>
          ))}
        </div>

        {/* Slots */}
        <div className="flex gap-3 justify-center">
          {[0, 1, 2].map(i => {
            const overrideEmoji = cfg.slotEmojis[i]
            const displayEmoji  = overrideEmoji ?? slotBase[i]
            return (
              <div
                key={i}
                className="w-16 h-20 rounded-xl border-2 flex items-center justify-center text-3xl"
                style={{
                  background:   `linear-gradient(160deg, ${cfg.containerBg}, rgba(0,0,0,0.4))`,
                  borderColor:  cfg.slotBorders[i],
                  boxShadow:    cfg.slotGlows[i] !== 'none' ? `0 0 12px ${cfg.slotGlows[i]}` : 'none',
                  filter:       `grayscale(${cfg.grayscale}) brightness(${stage === 4 ? 0.35 : 1})`,
                  animation:    isRolling ? 'casino-flicker-fast 0.12s infinite' : undefined,
                  transition:   'filter 1s ease, border-color 1s ease',
                }}
              >
                {isRolling ? rollingEmoji : displayEmoji}
              </div>
            )
          })}
        </div>

        {/* Saldo */}
        <div
          className="rounded-xl p-4 flex justify-between items-center border"
          style={{
            background:  'rgba(0,0,0,0.4)',
            borderColor: `${cfg.border}66`,
            boxShadow:   stage === 0 ? '0 0 8px rgba(252,211,77,0.1)' : 'none',
          }}
        >
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">Saldo Virtual</span>
            <span
              className="block text-3xl font-black tabular-nums mt-0.5"
              style={{
                color:      cfg.balanceColor,
                textShadow: stage === 0 ? '0 0 10px rgba(252,211,77,0.5)' : 'none',
                animation:  stage >= 3 ? cfg.flickerAnim : (stage === 0 ? 'casino-glow 2s infinite' : undefined),
                transition: 'color 1s ease',
              }}
            >
              {formatBRL(balance)}
            </span>
          </div>
          {/* Badge de estado psicológico */}
          <div className="text-right">
            {roundCount === 0 && <span className="text-[9px] text-stone-600 uppercase tracking-wider">Aguardando</span>}
            {roundCount > 0 && balance > 200 && <span className="text-[9px] font-bold text-emerald-500 animate-pulse">🎯 DOPAMINA!</span>}
            {roundCount > 0 && balance <= 200 && balance > 120 && <span className="text-[9px] font-bold text-amber-500">⚠️ Drenando</span>}
            {roundCount > 0 && balance <= 120 && balance > 0 && <span className="text-[9px] font-bold text-red-500 animate-bounce">🚨 Queda livre</span>}
            {balance <= 0 && <span className="text-[9px] font-extrabold text-red-700">💀 Falência</span>}
          </div>
        </div>

        {/* Valor por rodada */}
        <div className="space-y-2 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex justify-between text-[10px]">
            <span className="font-bold text-stone-500 uppercase tracking-wider">Aposta por rodada</span>
            <span className="font-extrabold" style={{ color: cfg.border }}>{formatBRL(betAmount)}</span>
          </div>
          <input
            type="range" min={5} max={50} step={5}
            value={betAmount}
            disabled={isRolling || bankrupt}
            onChange={e => setBetAmount(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', accentColor: cfg.border } as React.CSSProperties}
          />
          <div className="flex justify-between text-[9px] text-stone-600">
            <span>R$ 5</span><span>R$ 50</span>
          </div>
        </div>

        {/* Botão principal */}
        {bankrupt ? (
          <button
            onClick={handleReset}
            className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            style={{ background: cfg.border, color: '#000' }}
          >
            <RefreshCw size={16} /> Recomeçar
          </button>
        ) : (
          <button
            onClick={handleBet}
            disabled={isRolling}
            className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-transform active:scale-95"
            style={{ background: cfg.btnBg, color: cfg.btnColor, boxShadow: cfg.btnShadow }}
          >
            {isRolling
              ? <><span className="text-lg">{rollingEmoji}</span> GIRANDO...</>
              : <><Play size={16} fill="currentColor" /> Apostar {formatBRL(betAmount)}</>
            }
          </button>
        )}

        {/* Log de rodadas */}
        {log.length > 0 && (
          <div
            className="rounded-xl border overflow-y-auto max-h-36 p-3 space-y-2"
            style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.05)' }}
          >
            {log.map(entry => (
              <div key={entry.id} className="flex justify-between items-start gap-2 text-xs">
                <div className="flex gap-1.5 min-w-0">
                  <span className="shrink-0">{entry.mod}</span>
                  <span className="text-stone-500 leading-tight break-words min-w-0">{entry.msg}</span>
                </div>
                <span
                  className="font-extrabold tabular-nums shrink-0"
                  style={{ color: entry.result === 'win' ? '#4ade80' : '#f87171' }}
                >
                  {entry.result === 'win' ? '+' : ''}{formatBRL(entry.val)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
