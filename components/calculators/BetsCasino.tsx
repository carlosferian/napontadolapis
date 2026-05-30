'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Play, RefreshCw, Flame, Volume2, VolumeX } from 'lucide-react'
import { formatBRL } from '@/lib/formatters'
import { playSpin, playWin, playBigWin, playLose, playRupture } from '@/lib/casino-sounds'

// ── Modalidades ──────────────────────────────────────────────────────────
const MODALITIES = [
  // rtp not used in Phase 1 — scripted rounds override outcome. Used in BetsNarrative odds calculator.
  { id: 'slots',    emoji: '🐯', name: 'Tigrinho',  rtp: 0.85, edge: '15% de perda embutida' },
  { id: 'crash',    emoji: '🚀', name: 'Foguetinho', rtp: 0.90, edge: '10% de perda embutida' },
  { id: 'sports',   emoji: '⚽', name: 'Múltiplas',  rtp: 0.75, edge: '25% de perda embutida' },
  { id: 'roulette', emoji: '🎡', name: 'Roleta',     rtp: 0.973, edge: '2.7% de perda embutida' },
] as const

// ── Créditos reais que podem ser depositados — cada um APENAS UMA VEZ ─────
const CREDIT_ITEMS = [
  { id: 'cinema',   emoji: '🎬', name: 'Cinema (2x)',          value: 70,  desc: '2 ingressos de cinema + pipoca' },
  { id: 'tenis',    emoji: '👟', name: 'Tênis novo',            value: 280, desc: 'um par de tênis esportivo' },
  { id: 'celular',  emoji: '📱', name: 'Entrada celular',       value: 500, desc: 'a entrada do celular novo' },
  { id: 'poupanca', emoji: '💰', name: 'Poupança filhos',       value: 200, desc: 'a poupança mensal das crianças' },
  { id: 'livros',   emoji: '📚', name: 'Livros (3x)',           value: 90,  desc: '3 livros que você queria ler' },
  { id: 'jantar',   emoji: '🍕', name: 'Jantar família',        value: 150, desc: 'o jantar em família do fim de semana' },
] as const
type CreditItem = typeof CREDIT_ITEMS[number]

// ── 15 Rodadas Sortudas (12-15% dos jogadores) — termina no positivo ──────
// Arco: vitória → derrota → vitória → ... → vitória final
// Projetado para que qualquer aposta entre R$5 e R$50 com qualquer depósito termine positiva
const LUCKY_ROUNDS = [
  { win: true,  mult: 2.5, msg: '🎉 Primeira aposta e já ganhou {win}! Você tem jeito pra isso.' },
  { win: false, mult: 0,   msg: '❌ Primeira derrota. Faz parte. Você ainda está no positivo.' },
  { win: true,  mult: 2.0, msg: '🚀 Recuperou e ainda ganhou mais! +{win}. A maré está boa.' },
  { win: false, mult: 0,   msg: '🎡 Roleta errou. Mas você está controlando bem.' },
  { win: true,  mult: 3.0, msg: '🎉 BIG WIN! 💰 O Tigre multiplicou por 3x! +{win}. Você está muito na frente!' },
  { win: false, mult: 0,   msg: '❌ Uma perda. Mas você ainda está bem no azul.' },
  { win: true,  mult: 1.5, msg: '🐯 Vitória! +{win}. O saldo segue crescendo.' },
  { win: false, mult: 0,   msg: '❌ Derrota. Normal. Você ainda tem boa margem.' },
  { win: true,  mult: 1.8, msg: '🚀 Mais uma! +{win}. Você claramente tem instinto.' },
  { win: false, mult: 0,   msg: '❌ Perdeu. Mas continue — você está na frente.' },
  { win: true,  mult: 2.0, msg: '⚽ Gol! +{win}. Seu acerto está acima da média.' },
  { win: false, mult: 0,   msg: '❌ Derrota... O saldo oscilou, mas ainda positivo.' },
  { win: true,  mult: 1.3, msg: '🐯 Pequena vitória. +{win}. Consistência é tudo.' },
  { win: false, mult: 0,   msg: '❌ Perdeu algum. Mas o saldo final vai te surpreender.' },
  { win: true,  mult: 1.5, msg: '🎰 Última rodada — e você GANHOU! +{win}. Essa foi uma boa sessão.' },
] as const

// ── 15 Rodadas Pré-definidas — arco realista de um apostador real ─────────
// Fase 1 (0-2): 3 vitórias seguidas → hook dopaminérgico forte
// Fase 2 (3-6): altos e baixos → sensação de controle ilusória
// Fase 3 (7-10): perdas crescentes → ansiedade de recuperação
// Fase 4 (11-14): colapso → desespero e all-in inevitável
const PREDEFINED_ROUNDS = [
  // ── Fase 1: O Hook ──
  { win: true,  mult: 3.0, msg: '🎉 PRIMEIRO GIRO E JÁ GANHOU! +{win} líquidos. É assim tão fácil?' },
  { win: true,  mult: 2.5, msg: '🚀 DE NOVO! Foguetinho subiu 2.5x. Mais {win} no bolso. Você é bom nisso!' },
  { win: true,  mult: 1.8, msg: '🐯 Terceira seguida! +{win}. Quem disse que bets são difíceis?' },
  // ── Fase 2: Altos e Baixos ──
  { win: false, mult: 0,   msg: '❌ Primeira derrota. Normal — você ainda está bem no positivo!' },
  { win: true,  mult: 2.0, msg: '⚽ Recuperou na hora! +{win}. Você claramente tem o tato pra isso.' },
  { win: false, mult: 0,   msg: '🎡 Roleta caiu no zero. Faz parte. O saldo ainda é forte.' },
  { win: true,  mult: 1.4, msg: '🐯 Pequena vitória. +{win}. Uma hora ganha, outra perde — é gerenciamento.' },
  { win: false, mult: 0,   msg: '❌ Derrota... mas você está no controle. Só mais uma.' },
  // ── Fase 3: A Virada ──
  { win: false, mult: 0,   msg: '❌ Perdeu de novo. O saldo começa a encolher de verdade.' },
  { win: false, mult: 0,   msg: '❌ Mais uma perda. A sensação de querer recuperar tudo aumenta.' },
  { win: false, mult: 0,   msg: '❌ Perdendo... O pensamento "só mais uma" fica cada vez mais forte.' },
  // ── Fase 4: O Colapso ──
  { win: false, mult: 0,   msg: '❌ O saldo caindo rápido. A lógica sumiu — só o desespero de recuperar.' },
  { win: false, mult: 0,   msg: '❌ Derrota. Cada clique agora é uma tentativa de desfazer o estrago.' },
  { win: false, mult: 0,   msg: '❌ Quase no limite. Uma última tentativa. Tudo ou nada.' },
  { win: false, mult: 0,   msg: '🚨 Você apostou tudo que restava. E perdeu. É assim que termina sempre.' },
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
  onBankrupt:  (rounds: number) => void
  onLuckyWin:  (finalBalance: number, totalInvested: number) => void
}

// ── Log entry ─────────────────────────────────────────────────────────────
interface LogEntry {
  id: number
  mod: string
  result: 'win' | 'lose'
  val: number
  msg: string
  isDeposit?: boolean
}

export function BetsCasino({ onBankrupt, onLuckyWin }: BetsCasinoProps) {
  // Decide no mount se esta será uma sessão sortuda (12% de chance)
  const [isLucky] = useState(() => Math.random() < 0.12)
  const [balance, setBalance]               = useState(0)
  const [betAmount, setBetAmount]           = useState(40)
  const [modality, setModality]             = useState<string>('slots')
  const [roundCount, setRoundCount]         = useState(0)
  const [log, setLog]                       = useState<LogEntry[]>([])
  const [isRolling, setIsRolling]           = useState(false)
  const [rollingEmoji, setRollingEmoji]     = useState('🐯')
  const [bankrupt, setBankrupt]             = useState(false)
  const [muted, setMuted]                   = useState(false)
  const [decayBase, setDecayBase]           = useState(0)
  const [totalIn, setTotalIn]               = useState(0)
  const [usedCreditIds, setUsedCreditIds]   = useState<string[]>([])

  // Decay: 0 (pristine) → 100 (colapso). Guarda contra decayBase=0 (antes do 1º depósito)
  const decay = useMemo(
    () => decayBase > 0 ? Math.max(0, Math.round((decayBase - balance) / (decayBase / 100))) : 0,
    [balance, decayBase]
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
    if (!muted) playSpin()

    setTimeout(() => {
      setIsRolling(false)
      const bet    = Math.min(betAmount, balance)
      const mod    = MODALITIES.find(m => m.id === modality)!
      const rounds = isLucky ? LUCKY_ROUNDS : PREDEFINED_ROUNDS
      let nextBalance = balance
      let winAmt      = 0
      let result: 'win' | 'lose' = 'lose'
      let msg: string
      let bigWinFlag  = false

      if (roundCount < rounds.length) {
        // Arco roteirizado (lucky ou normal)
        const round = rounds[roundCount]
        if (round.win) {
          winAmt      = Math.round(bet * round.mult)
          nextBalance = balance - bet + winAmt
          result      = 'win'
          bigWinFlag  = round.mult >= 3
        } else {
          nextBalance = balance - bet
        }
        msg = round.msg.replace('{win}', formatBRL(Math.abs(winAmt - bet)))
      } else {
        // Pós-roteiro: perda garantida — só alcançado no arco normal se sobrou saldo
        const postMsgs = [
          `${mod.emoji} Mais uma perda. A casa nunca perde.`,
          `${mod.emoji} Derrota. A banca agradece silenciosamente.`,
          `💸 Cada clique drena o que você colocou em jogo.`,
          `${mod.emoji} Não era sorte — era matemática.`,
          `📉 O saldo cai. Sempre cai. É design, não azar.`,
        ]
        nextBalance = balance - bet
        msg         = postMsgs[roundCount % postMsgs.length]
      }

      // Detecção de vitória na sessão sortuda (última rodada + saldo positivo)
      const isLuckyFinalRound = isLucky && roundCount === LUCKY_ROUNDS.length - 1

      nextBalance = Math.max(0, nextBalance)
      const netGain = winAmt - bet

      if (!muted) {
        if (result === 'win') { bigWinFlag ? playBigWin() : playWin() }
        else                  { playLose() }
      }

      setBalance(nextBalance)
      setRoundCount(r => r + 1)
      setLog(prev => [
        { id: Date.now(), mod: mod.emoji, result, val: result === 'win' ? netGain : -bet, msg },
        ...prev.slice(0, 14),
      ])

      if (nextBalance <= 0) {
        if (!muted) playRupture()
        setBankrupt(true)
        setTimeout(() => onBankrupt(roundCount + 1), 800)
      } else if (isLuckyFinalRound) {
        // Sessão sortuda completada com saldo positivo!
        if (!muted) playBigWin()
        setTimeout(() => onLuckyWin(nextBalance, totalIn), 1200)
      }
    }, 750)
  }, [balance, betAmount, isRolling, modality, muted, roundCount, onBankrupt])

  const handleAddCredit = useCallback((item: CreditItem) => {
    if (usedCreditIds.includes(item.id)) return
    const newBalance = balance + item.value
    setBalance(newBalance)
    setDecayBase(newBalance)
    setTotalIn(prev => prev + item.value)
    setUsedCreditIds(prev => [...prev, item.id])
    if (!muted) playWin()
    const isFirst = totalIn === 0
    setLog(prev => [{
      id: Date.now(),
      mod: item.emoji,
      result: 'win' as const,
      val: item.value,
      msg: isFirst
        ? `Você colocou ${item.desc} em jogo. Bem-vindo ao cassino.`
        : `Você jogou ${item.desc} no cassino. +${formatBRL(item.value)} adicionados.`,
      isDeposit: true,
    }, ...prev.slice(0, 14)])
  }, [balance, muted, usedCreditIds])

  const handleReset = useCallback(() => {
    setBalance(0)
    setBetAmount(40)
    setModality('slots')
    setRoundCount(0)
    setLog([])
    setBankrupt(false)
    setIsRolling(false)
    setDecayBase(0)
    setTotalIn(0)
    setUsedCreditIds([])
  }, [])

  const slotBase = SLOT_EMOJIS[modality] ?? SLOT_EMOJIS.slots

  return (
    <div
      className="rounded-2xl sm:rounded-[32px] border-2 overflow-hidden"
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

      <div className="relative z-10 p-2 sm:p-4 space-y-2 sm:space-y-3">
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
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {stage < 4 ? '148.320 jogando' : 'SALDO ESGOTADO'}
            </span>
            <button
              onClick={() => setMuted(m => !m)}
              className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
              title={muted ? 'Ativar som' : 'Silenciar'}
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
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
        {/* Mobile: 4 chips em linha. Desktop: grid 2x2 com info completa */}
        <div className="grid grid-cols-4 sm:grid-cols-2 gap-1.5 sm:gap-2">
          {MODALITIES.map(m => (
            <button
              key={m.id}
              onClick={() => !isRolling && setModality(m.id)}
              disabled={isRolling || bankrupt}
              className="flex flex-col items-center sm:items-start p-1.5 sm:p-2.5 sm:rounded-2xl rounded-xl border transition-all cursor-pointer disabled:opacity-40 text-center sm:text-left"
              style={modality === m.id
                ? { background: `${cfg.border}18`, borderColor: cfg.border, color: 'white' }
                : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)', color: '#6b7280' }
              }
            >
              <span className="text-xl sm:text-2xl lg:text-4xl block leading-none mb-0.5">{m.emoji}</span>
              <span className="text-[8px] sm:text-[10px] font-extrabold block truncate w-full leading-tight">{m.name}</span>
              <span className="hidden sm:block text-[9px] mt-0.5" style={{ color: cfg.border }}>{m.edge}</span>
            </button>
          ))}
        </div>

        {/* Slots */}
        <div className="flex gap-2 sm:gap-3 justify-center">
          {[0, 1, 2].map(i => {
            const overrideEmoji = cfg.slotEmojis[i]
            const displayEmoji  = overrideEmoji ?? slotBase[i]
            return (
              <div
                key={i}
                className="w-14 h-16 sm:w-16 sm:h-20 rounded-xl border-2 flex items-center justify-center text-2xl sm:text-3xl"
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

        {/* Estado dormant: convite para depositar o primeiro bem */}
        {balance === 0 && !bankrupt && (
          <div
            className="rounded-xl p-4 border text-center space-y-1"
            style={{ background: 'rgba(224,179,90,0.04)', borderColor: 'rgba(224,179,90,0.15)', borderStyle: 'dashed' }}
          >
            <div className="text-2xl">🎰</div>
            <div className="text-sm font-extrabold uppercase tracking-wider" style={{ color: 'rgba(224,179,90,0.8)' }}>
              Escolha um bem para entrar no jogo
            </div>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Cada bem só pode ser usado uma vez
            </div>
          </div>
        )}

        {/* Saldo — só aparece quando há dinheiro em jogo */}
        {balance > 0 && (
        <div
          className="rounded-xl p-3 sm:p-4 flex justify-between items-center border"
          style={{
            background:  'rgba(0,0,0,0.4)',
            borderColor: `${cfg.border}66`,
            boxShadow:   stage === 0 ? '0 0 8px rgba(252,211,77,0.1)' : 'none',
          }}
        >
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">Saldo Virtual</span>
            <span
              className="block text-2xl sm:text-3xl font-black tabular-nums mt-0.5"
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
            {roundCount > 0 && balance > decayBase && <span className="text-[9px] font-bold text-emerald-500 animate-pulse">🎯 DOPAMINA!</span>}
            {roundCount > 0 && balance <= decayBase && balance > decayBase * 0.5 && <span className="text-[9px] font-bold text-amber-500">⚠️ Drenando</span>}
            {roundCount > 0 && balance <= decayBase * 0.5 && balance > 0 && <span className="text-[9px] font-bold text-red-500 animate-bounce">🚨 Queda livre</span>}
            {balance <= 0 && <span className="text-[9px] font-extrabold text-red-700">💀 Falência</span>}
          </div>
        </div>
        )} {/* fim do bloco balance > 0 */}

        {/* Feedback da última rodada */}
        {log.length > 0 && (() => {
          const entry = log[0]
          const isDep = entry.isDeposit
          const bg    = isDep ? 'rgba(245,158,11,0.08)' : entry.result === 'win' ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)'
          const bc    = isDep ? 'rgba(245,158,11,0.3)'  : entry.result === 'win' ? 'rgba(74,222,128,0.2)'  : 'rgba(248,113,113,0.2)'
          const vc    = isDep ? '#fbbf24'               : entry.result === 'win' ? '#4ade80'               : '#f87171'
          return (
            <div className="rounded-xl p-2.5 sm:p-4 border" style={{ background: bg, borderColor: bc }}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex gap-2 min-w-0">
                  <span className="text-xl shrink-0">{entry.mod}</span>
                  <span className="text-sm font-semibold leading-snug break-words min-w-0" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {entry.msg}
                  </span>
                </div>
                <span className="text-lg font-black tabular-nums shrink-0 whitespace-nowrap" style={{ color: vc }}>
                  {entry.result === 'win' ? '+' : ''}{formatBRL(entry.val)}
                </span>
              </div>
            </div>
          )
        })()}

        {/* Valor por rodada — só aparece quando há saldo */}
        {balance > 0 && <div className="space-y-2 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-bold text-stone-500 uppercase tracking-wider">Aposta por rodada</span>
            <span className="font-extrabold text-base" style={{ color: cfg.border }}>{formatBRL(betAmount)}</span>
          </div>
          {/* Chips de valor rápido */}
          <div className="flex gap-1.5 flex-wrap">
            {[5, 10, 20, 50].map(v => (
              <button
                key={v}
                onClick={() => setBetAmount(Math.min(v, balance))}
                disabled={isRolling || bankrupt || v > balance}
                className="px-3 py-1.5 rounded-lg text-xs font-extrabold border cursor-pointer transition-all disabled:opacity-25"
                style={betAmount === v
                  ? { background: cfg.border, color: '#000', borderColor: 'transparent' }
                  : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#9ca3af' }
                }
              >
                R$ {v}
              </button>
            ))}
            <button
              onClick={() => setBetAmount(Math.max(5, balance))}
              disabled={isRolling || bankrupt || balance <= 0}
              className="px-3 py-1.5 rounded-lg text-xs font-extrabold border cursor-pointer transition-all disabled:opacity-25"
              style={{ background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.35)', color: '#f87171' }}
            >
              All-in
            </button>
          </div>
          {/* Slider fino */}
          <input
            type="range" min={5} max={Math.max(5, balance)} step={5}
            value={Math.min(betAmount, balance)}
            disabled={isRolling || bankrupt}
            onChange={e => setBetAmount(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', accentColor: cfg.border } as React.CSSProperties}
          />
        </div>} {/* fim dos controles de aposta */}

        {/* Depositar / Entrar com créditos */}
        {!bankrupt && (
          <div className="space-y-2 border-t pt-3" style={{ borderColor: balance === 0 ? 'rgba(224,179,90,0.15)' : 'rgba(255,255,255,0.06)' }}>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: balance === 0 ? 'rgba(224,179,90,0.6)' : '#57534e' }}>
                {balance === 0
                  ? `Seus bens (escolha um para entrar):`
                  : `Jogar mais bens (${CREDIT_ITEMS.length - usedCreditIds.length} restantes):`
                }
              </span>
              {totalIn > 0 && (
                <span className="text-[9px] font-extrabold" style={{ color: 'rgba(245,158,11,0.7)' }}>
                  {formatBRL(totalIn)} em jogo
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
              {CREDIT_ITEMS.map(item => {
                const used = usedCreditIds.includes(item.id)
                return (
                <button
                  key={item.id}
                  onClick={() => !used && handleAddCredit(item)}
                  disabled={isRolling || used}
                  className="flex flex-col items-center gap-0.5 px-1 py-2 sm:py-2.5 rounded-xl border transition-all text-center"
                  style={used
                    ? { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)', cursor: 'default', opacity: 0.35 }
                    : { background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)', cursor: 'pointer' }
                  }
                >
                  <span className="text-xl sm:text-2xl leading-none">{used ? '✓' : item.emoji}</span>
                  <div className="min-w-0 w-full px-0.5">
                    <div className="text-[8px] sm:text-[9px] font-extrabold truncate leading-tight" style={{ color: used ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)' }}>{item.name}</div>
                    <div className="text-[10px] font-black" style={{ color: used ? 'rgba(255,255,255,0.2)' : '#fbbf24' }}>{formatBRL(item.value)}</div>
                  </div>
                </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Botão principal */}
        {bankrupt ? (
          <button
            onClick={handleReset}
            className="w-full py-3 sm:py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            style={{ background: cfg.border, color: '#000' }}
          >
            <RefreshCw size={16} /> Recomeçar
          </button>
        ) : balance > 0 ? (
          <button
            onClick={handleBet}
            disabled={isRolling}
            className="w-full py-3 sm:py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-transform active:scale-95"
            style={{ background: cfg.btnBg, color: cfg.btnColor, boxShadow: cfg.btnShadow }}
          >
            {isRolling
              ? <><span className="text-lg">{rollingEmoji}</span> GIRANDO...</>
              : <><Play size={16} fill="currentColor" /> Apostar {formatBRL(betAmount)}</>
            }
          </button>
        ) : null
        }

      </div>
    </div>
  )
}
