# Apostas — Redesign Completo (Jornada em 3 Fases) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar a seção de apostas como uma jornada linear imersiva de 3 fases: cassino neon com decadência progressiva → ruptura dramática split-screen → narrativa educativa de 5 capítulos.

**Architecture:** `BetsCalculator.tsx` torna-se um orquestrador leve (~40 linhas) que renderiza um de três sub-componentes (`BetsCasino`, `BetsRupture`, `BetsNarrative`) com base no estado de fase. O sistema de decadência do cassino é derivado via `useMemo` do `balance` — sem loops, sem `setInterval`. A animação de ruptura usa uma cadeia de `setTimeout` disparada por `useEffect` quando `balance === 0`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Recharts (já instalado), Lucide React, `lib/calculations/probability.ts` (sem alteração), `lib/calculations/compound.ts` (sem alteração).

---

## File Map

| Arquivo | Ação | Responsabilidade |
|---------|------|-----------------|
| `components/calculators/BetsCasino.tsx` | **Criar** | Fase 1: lobby do cassino com sistema de decadência de 5 estágios |
| `components/calculators/BetsRupture.tsx` | **Criar** | Fase 2: sequência de animação (4 steps) + split screen com raio |
| `components/calculators/BetsNarrative.tsx` | **Criar** | Fase 3: 5 capítulos educativos com calculadoras interativas inline |
| `components/calculators/BetsCalculator.tsx` | **Reescrever** | Orquestrador de fase — renderiza um dos três sub-componentes |
| `app/apostas/page.tsx` | **Modificar** | Header e metadata atualizados |
| `app/apostas/probabilidades/page.tsx` | **Deletar** | Rota removida |
| `app/sitemap.ts` | **Modificar** | Remover entrada `/apostas/probabilidades` |
| `app/globals.css` | **Modificar** | Adicionar 4 `@keyframes` para animações do cassino |
| `lib/calculations/probability.ts` | Sem alteração | Reutilizado na Fase 3 |
| `components/calculators/OddsCalculator.tsx` | Sem alteração | Não deletado — apenas sem rota própria |

---

## Task 1: Limpeza e Keyframes CSS

**Files:**
- Delete: `app/apostas/probabilidades/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: `app/globals.css`

- [ ] **1.1 — Deletar a página de probabilidades**

```bash
# No PowerShell, na raiz do projeto
Remove-Item "app\apostas\probabilidades\page.tsx"
# Verificar que o diretório ficou vazio e pode ser removido também:
Remove-Item "app\apostas\probabilidades" -Recurse
```

- [ ] **1.2 — Remover entrada do sitemap**

Em `app/sitemap.ts`, remover esta linha (linha 18):
```typescript
{ url: `${base}/apostas/probabilidades`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
```

- [ ] **1.3 — Adicionar keyframes CSS para o cassino**

No final de `app/globals.css`, adicionar:

```css
/* ─── Casino animations ──────────────────────────────────────────── */

@keyframes casino-glow {
  0%, 100% { text-shadow: 0 0 8px var(--glow-color, rgba(252,211,77,0.5)); }
  50%       { text-shadow: 0 0 20px var(--glow-color, rgba(252,211,77,0.9)); }
}

@keyframes casino-flicker-slow {
  0%, 88%, 100% { opacity: 1; }
  90%           { opacity: 0.5; }
  94%           { opacity: 1; }
  97%           { opacity: 0.6; }
}

@keyframes casino-flicker-fast {
  0%, 70%, 100% { opacity: 1; }
  72%           { opacity: 0.2; }
  76%           { opacity: 0.9; }
  80%           { opacity: 0.1; }
  84%           { opacity: 0.8; }
}

@keyframes casino-flicker-critical {
  0%, 40%, 100% { opacity: 1; }
  42%           { opacity: 0.1; }
  46%           { opacity: 0.6; }
  50%           { opacity: 0; }
  54%           { opacity: 0.8; }
}

@keyframes money-fly {
  0%   { opacity: 0; transform: translateY(0px) rotate(-10deg) scale(0.8); }
  25%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-36px) rotate(20deg) scale(1.1); }
}

@keyframes casino-shake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  20%      { transform: translateX(-5px) rotate(-0.4deg); }
  40%      { transform: translateX(5px) rotate(0.4deg); }
  60%      { transform: translateX(-4px) rotate(-0.2deg); }
  80%      { transform: translateX(4px) rotate(0.2deg); }
}

@keyframes rupture-flash {
  0%   { opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

- [ ] **1.4 — Commit**

```bash
git add app/sitemap.ts app/globals.css
git commit -m "chore(apostas): remove /probabilidades route and add casino CSS keyframes"
```

---

## Task 2: `BetsCasino.tsx` — Fase 1 (O Cassino)

**Files:**
- Create: `components/calculators/BetsCasino.tsx`

Este é o componente mais complexo. Implementa o lobby do cassino com o sistema de decadência progressiva de 5 estágios.

- [ ] **2.1 — Criar o arquivo com constantes e helpers**

Criar `components/calculators/BetsCasino.tsx` com este conteúdo completo:

```tsx
'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Play, RefreshCw, Flame } from 'lucide-react'
import { formatBRL } from '@/lib/formatters'

// ── Modalidades ──────────────────────────────────────────────────────────
const MODALITIES = [
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
  showAlertBadge: boolean
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
    showAlertBadge: false,
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
    showAlertBadge: false,
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
    showAlertBadge: false,
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
    showAlertBadge: true,
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
    showAlertBadge: false,
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
          {stage < 3 ? '⚡ FORTUNE TIGER ⚡' : '⚡ FORTUNE TIGER ⚡'}
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
              <span className="text-base block">{m.emoji}</span>
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
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', accentColor: cfg.border }}
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
```

- [ ] **2.2 — Verificar build após criar o arquivo**

```bash
npm run build 2>&1 | Select-String -Pattern "error|Error|warning" | Select-Object -First 20
```

Esperado: sem erros de TypeScript. Se houver erro de tipo, corrigir antes de continuar.

- [ ] **2.3 — Commit**

```bash
git add components/calculators/BetsCasino.tsx
git commit -m "feat(apostas): add BetsCasino with 5-stage progressive decay system"
```

---

## Task 3: `BetsRupture.tsx` — Fase 2 (A Ruptura)

**Files:**
- Create: `components/calculators/BetsRupture.tsx`

- [ ] **3.1 — Criar o componente da ruptura**

```tsx
'use client'

import React, { useState, useEffect } from 'react'

// ruptureStep:
//  0 = inativo (nunca deve aparecer visível)
//  1 = cassino morto (slots 💀, saldo 0)
//  2 = tremor
//  3 = flash vermelho
//  4 = split screen final
type RuptureStep = 0 | 1 | 2 | 3 | 4

interface BetsRuptureProps {
  rounds: number
  onReveal: () => void
}

export function BetsRupture({ rounds, onReveal }: BetsRuptureProps) {
  const [step, setStep] = useState<RuptureStep>(1)

  useEffect(() => {
    // Cadeia de animação disparada uma vez ao montar
    const t1 = setTimeout(() => setStep(2), 400)   // tremor
    const t2 = setTimeout(() => setStep(3), 700)   // flash
    const t3 = setTimeout(() => setStep(4), 950)   // split final
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Step 3: flash vermelho — fundo inteiro
  if (step === 3) {
    return (
      <div
        className="rounded-[32px] overflow-hidden"
        style={{
          background: '#dc2626',
          minHeight: 360,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'rupture-flash 0.25s ease-in-out',
        }}
      >
        <span style={{ fontSize: 48 }}>⚡</span>
      </div>
    )
  }

  // Step 1-2: cassino morto (step 2 adiciona tremor)
  if (step < 3) {
    return (
      <div
        className="rounded-[32px] border-2 overflow-hidden"
        style={{
          background: '#0d0000',
          borderColor: '#450a0a',
          minHeight: 360,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          position: 'relative',
          animation: step === 2 ? 'casino-shake 80ms ease-in-out 3' : undefined,
        }}
      >
        {/* SVG rachadura */}
        <svg className="absolute top-0 right-0 pointer-events-none" width="140" height="140" viewBox="0 0 140 140" style={{ opacity: 0.65 }}>
          <path d="M140,0 L105,28 L120,62 L85,58 L100,115 L65,108 L80,140" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M120,62 L136,74" stroke="#dc2626" strokeWidth="2" fill="none" opacity="0.5"/>
          <path d="M20,0 L48,18 L36,45 L60,40" stroke="#dc2626" strokeWidth="2" fill="none" opacity="0.4"/>
        </svg>
        <div style={{ fontSize: 40, filter: 'grayscale(1) brightness(0.3)' }}>💀💀💀</div>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 32,
            fontWeight: 900,
            color: '#450a0a',
            letterSpacing: 2,
            animation: 'casino-flicker-critical 0.5s infinite',
          }}
        >
          R$ 0,00
        </div>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: '#7f1d1d', textTransform: 'uppercase' }}>
          ✕ SALDO ESGOTADO
        </div>
        <div style={{ position: 'absolute', bottom: 12, fontSize: 9, color: '#3b0a0a', letterSpacing: 2 }}>
          A BANCA AGRADECE
        </div>
      </div>
    )
  }

  // Step 4: SPLIT SCREEN FINAL
  return (
    <div
      className="rounded-[32px] border-2 overflow-hidden"
      style={{
        borderColor: '#dc2626',
        display: 'grid',
        gridTemplateColumns: '42% 4px 1fr',
        minHeight: 360,
      }}
    >
      {/* LADO ESQUERDO — cassino morto */}
      <div
        style={{
          background: '#0d0000',
          backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(80,0,0,0.4) 0%, transparent 70%)',
          padding: '28px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          filter: 'grayscale(0.65)',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg className="absolute top-0 right-0 pointer-events-none" width="80" height="100%" viewBox="0 0 80 360" preserveAspectRatio="none" style={{ opacity: 0.55 }}>
          <path d="M80,0 L55,50 L68,110 L42,105 L58,200 L30,192 L44,310 L18,360" stroke="#dc2626" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </svg>
        <div style={{ fontSize: 28, filter: 'brightness(0.4)' }}>💀</div>
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 3, color: '#450a0a', textTransform: 'uppercase', textAlign: 'center' }}>
          A ILUSÃO
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 900, color: '#7f1d1d', animation: 'casino-flicker-fast 0.5s infinite' }}>
          R$ 0,00
        </div>
        <div style={{ fontSize: 14, opacity: 0.5, letterSpacing: 4, textAlign: 'center' }}>🕷️ 💔 💸 💀</div>
      </div>

      {/* RAIO CENTRAL */}
      <div
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), #ef4444 20%, #dc2626 70%, #991b1b)',
          boxShadow: '0 0 16px rgba(220,38,38,0.5), -4px 0 20px rgba(220,38,38,0.3), 4px 0 20px rgba(220,38,38,0.3)',
          position: 'relative',
          zIndex: 10,
        }}
      />

      {/* LADO DIREITO — revelação */}
      <div
        style={{
          background: '#f8f7f5',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 12,
          animation: 'slide-in-right 0.5s ease-out both',
        }}
      >
        <div style={{ animation: 'fade-up 0.4s 0.15s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, justifyContent: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', boxShadow: '0 0 6px #059669' }}/>
            <span style={{ fontSize: 8, fontWeight: 800, color: '#059669', letterSpacing: 3, textTransform: 'uppercase' }}>A REALIDADE</span>
          </div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: '#111827',
              lineHeight: 1.15,
              fontFamily: "'Cormorant Garamond', serif",
              marginBottom: 8,
            }}
          >
            A ilusão<br/>acabou.
          </h2>
          <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 700, marginBottom: 10 }}>
            R$ 200 perdidos em {rounds} cliques.
          </p>
          <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.6, maxWidth: 180 }}>
            É assim que funciona toda vez.<br/>
            A matemática é implacável.
          </p>
        </div>

        <div style={{ animation: 'fade-up 0.4s 0.45s both', marginTop: 4 }}>
          <button
            onClick={onReveal}
            style={{
              background: '#111827',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              padding: '12px 22px',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              letterSpacing: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Ver a verdade completa →
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **3.2 — Verificar build**

```bash
npm run build 2>&1 | Select-String -Pattern "error TS" | Select-Object -First 10
```

Esperado: sem erros TypeScript.

- [ ] **3.3 — Commit**

```bash
git add components/calculators/BetsRupture.tsx
git commit -m "feat(apostas): add BetsRupture split-screen animation sequence"
```

---

## Task 4: `BetsNarrative.tsx` — Fase 3 (A Narrativa)

**Files:**
- Create: `components/calculators/BetsNarrative.tsx`

Este componente contém os 5 capítulos educativos. Importa cálculos e UI existentes.

- [ ] **4.1 — Criar o componente da narrativa**

```tsx
'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { ResultHero }     from '@/components/ui/ResultHero'
import { MetricGrid }     from '@/components/ui/MetricGrid'
import { ComparisonList } from '@/components/ui/ComparisonList'
import { ShareButtons }   from '@/components/ui/ShareButtons'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { SourcesFooter }  from '@/components/ui/SourcesFooter'
import { ShareCardBase }  from '@/components/share/ShareCard'
import { ScaledPreview }  from '@/components/ui/ScaledPreview'
import { compoundMonthly } from '@/lib/calculations/compound'
import { calcHouseEdge, expectedValuePerBet, probProfit } from '@/lib/calculations/probability'
import { formatBRL, formatPct } from '@/lib/formatters'
import { RATES } from '@/config/rates'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ShoppingCart, Tv, Fuel, BookOpen, HeartHandshake, Phone, Lock } from 'lucide-react'

type Chapter = 0 | 1 | 2 | 3 | 4

// Barras de dopamina dos 15 giros (alturas em %, cores)
// Giros 1,2,5 = picos verdes; 3-4 = queda âmbar; 6-15 = drenagem vermelha
const DOPAMINE_BARS = [
  { h: 58,  color: '#22c55e' }, // Giro 1 — win 2x
  { h: 46,  color: '#22c55e' }, // Giro 2 — win 1.8x
  { h: 22,  color: '#f59e0b' }, // Giro 3 — lose
  { h: 18,  color: '#f59e0b' }, // Giro 4 — lose
  { h: 100, color: '#ef4444' }, // Giro 5 — BIG WIN 4x (pico)
  { h: 16,  color: '#f59e0b' }, // Giro 6 — lose
  { h: 14,  color: '#f59e0b' }, // Giro 7 — lose
  { h: 12,  color: '#6b7280' }, // Giro 8 — lose
  { h: 24,  color: '#f59e0b' }, // Giro 9 — small win
  { h: 10,  color: '#6b7280' }, // Giro 10 — lose
  { h: 8,   color: '#6b7280' }, // Giro 11 — lose
  { h: 7,   color: '#dc2626' }, // Giro 12 — lose
  { h: 5,   color: '#dc2626' }, // Giro 13 — lose
  { h: 4,   color: '#dc2626' }, // Giro 14 — lose
  { h: 2,   color: '#111827' }, // Giro 15 — falência
] as const

const COMPARISONS = [
  { icon: ShoppingCart, label: 'Carrinhos de supermercado', value: 250, unit: 'compras', explanation: 'Carrinho básico de R$ 250.' },
  { icon: Tv,           label: 'Meses de streaming premium', value: 60,  unit: 'meses',   explanation: 'Plano familiar de streaming a R$ 60/mês.' },
  { icon: Fuel,         label: 'Tanques de combustível (50L)', value: 280, unit: 'tanques', explanation: 'Gasolina a R$ 5,60/L.' },
  { icon: BookOpen,     label: 'Livros físicos novos', value: 50, unit: 'livros', explanation: 'Preço médio de capa R$ 50.' },
]

const N_BETS = [10, 100, 500, 1000] as const

export function BetsNarrative() {
  const [chapter, setChapter] = useState<Chapter>(0)

  // Cap. 2 — Calculadora de odds
  const [odd, setOdd]                   = useState(1.9)
  const [betAmountOdds, setBetAmountOdds] = useState(50)
  const [simHistory, setSimHistory]     = useState<number[]>([])
  const [simPeak, setSimPeak]           = useState(1000)
  const [simFinal, setSimFinal]         = useState(1000)
  const [simRunning, setSimRunning]     = useState(false)

  // Cap. 3 — Calculadora de perda
  const [monthly, setMonthly] = useState(300)
  const [months, setMonths]   = useState(12)

  // Derivados Cap. 2
  const houseEdge  = calcHouseEdge(odd)
  const ev         = expectedValuePerBet(odd, betAmountOdds)
  const lossPerBet = Math.abs(Math.min(ev, 0))

  // Derivados Cap. 3
  const totalSpent    = monthly * months
  const projection5y  = monthly * 60
  const invested5y    = compoundMonthly(monthly, 5, RATES.selic)
  const difference    = invested5y - projection5y

  // Simulação de 100 rodadas (Cap. 2)
  const runSimulation = useCallback(() => {
    setSimRunning(true)
    let bal = 1000
    let peak = 1000
    let wins = 0
    const history: number[] = [1000]
    for (let i = 0; i < 100; i++) {
      if (bal < betAmountOdds) break
      if (Math.random() < 0.5) { bal += betAmountOdds * (odd - 1); wins++ }
      else                      { bal -= betAmountOdds }
      if (bal > peak) peak = bal
      history.push(Math.round(bal))
    }
    setSimPeak(peak)
    setSimFinal(bal)
    setSimHistory(history)
    setSimRunning(false)
  }, [odd, betAmountOdds])

  const simChartData = useMemo(
    () => simHistory.map((v, i) => ({ r: `R${i}`, Saldo: v })),
    [simHistory]
  )

  // Navegação de capítulos
  const CHAPTER_META = [
    { icon: '🧠', color: '#ef4444', label: 'Psicologia'  },
    { icon: '📐', color: '#6366f1', label: 'Matemática'  },
    { icon: '💸', color: '#f59e0b', label: 'Custo Real'  },
    { icon: '🇧🇷', color: '#10b981', label: 'Brasil'     },
    { icon: '🚪', color: '#059669', label: 'Saída'       },
  ]

  return (
    <div className="rounded-[32px] overflow-hidden border" style={{ borderColor: 'var(--c-line)' }}>

      {/* Header da fase 3 */}
      <div className="flex items-center justify-between px-6 py-4" style={{ background: '#111827' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
          <div>
            <div className="text-[11px] font-extrabold text-white uppercase tracking-[2px]">FASE 3 — A NARRATIVA</div>
            <div className="text-[9px] text-stone-600">5 capítulos · Educativo · Compartilhável</div>
          </div>
        </div>
        {/* Barra de progresso */}
        <div className="flex gap-1.5">
          {CHAPTER_META.map((m, i) => (
            <div
              key={i}
              className="h-1 w-7 rounded-full transition-all duration-500"
              style={{ background: i <= chapter ? m.color : 'rgba(255,255,255,0.1)' }}
            />
          ))}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '56px 1fr' }}>

        {/* Sidebar de capítulos */}
        <div className="flex flex-col items-center py-5 gap-1" style={{ background: '#111827' }}>
          {CHAPTER_META.map((m, i) => (
            <button
              key={i}
              onClick={() => setChapter(i as Chapter)}
              title={m.label}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm cursor-pointer transition-all"
              style={i === chapter
                ? { background: `${m.color}22`, borderColor: m.color, transform: 'scale(1.15)', color: m.color }
                : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: '#4b5563' }
              }
            >
              {m.icon}
            </button>
          ))}
        </div>

        {/* Conteúdo dos capítulos */}
        <div style={{ background: '#f8f7f5', minHeight: 480 }}>

          {/* ── CAPÍTULO 0: PSICOLOGIA ── */}
          {chapter === 0 && (
            <div className="p-6 space-y-5 animate-fadeIn">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[3px]" style={{ color: '#ef4444' }}>Capítulo 1 · Psicologia</span>
                <h2 className="text-2xl font-black text-stone-900 mt-1 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Seu cérebro foi<br/>manipulado por design.
                </h2>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                Aquelas vitórias nos primeiros giros? Não foram sorte. É um algoritmo de{' '}
                <strong className="text-stone-700">reforço intermitente</strong> — a mesma mecânica que cria
                dependência de redes sociais, descrita por B.F. Skinner em 1950.
                Vitórias aleatórias e imprevisíveis criam vínculos mais fortes do que recompensas garantidas.
              </p>

              {/* Gráfico de dopamina */}
              <div className="rounded-xl border p-4" style={{ background: 'white', borderColor: '#e5e7eb' }}>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400 mb-3">
                  Seu nível de dopamina durante os 15 giros:
                </div>
                <div className="flex items-end gap-1 h-14">
                  {DOPAMINE_BARS.map((b, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height:     `${b.h}%`,
                        background: b.color,
                        opacity:    0.85,
                        transition: `height 0.3s ${i * 0.05}s ease-out`,
                      }}
                      title={`Giro ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[8px] text-stone-400 mt-1.5">
                  <span>← Giro 1</span>
                  <span className="text-red-500 font-bold">Pico: Giro 5 (BIG WIN 4×)</span>
                  <span>Giro 15 →</span>
                </div>
              </div>

              <div className="rounded-xl border p-4 text-xs" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                <p className="font-bold text-red-700 mb-1">🧪 Reforço Intermitente (Skinner, 1950)</p>
                <p className="text-red-600 leading-relaxed">
                  Pombos em experimentos recebiam comida de forma aleatória. Isso os fez bater no botão
                  obsessivamente — muito mais do que quando a comida vinha garantida. As bets replicam
                  esse experimento em 150 milhões de brasileiros.
                </p>
              </div>

              <ChapterNav chapter={chapter} total={5} onNext={() => setChapter(1)} />
            </div>
          )}

          {/* ── CAPÍTULO 1: MATEMÁTICA ── */}
          {chapter === 1 && (
            <div id="matematica" className="p-6 space-y-5 animate-fadeIn">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[3px]" style={{ color: '#6366f1' }}>Capítulo 2 · Matemática</span>
                <h2 className="text-2xl font-black text-stone-900 mt-1 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  A casa nunca<br/>joga para perder.
                </h2>
              </div>

              {/* Calculadora de odds compacta */}
              <div className="rounded-xl border p-4 space-y-3" style={{ background: 'white', borderColor: '#e5e7eb' }}>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400">Calculadora de Odds</div>

                {/* Odd selector */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-500 font-semibold">Odd selecionada</span>
                    <span className="font-extrabold text-stone-800">{odd.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {[1.5, 1.7, 1.9, 2.0, 2.5, 3.0].map(o => (
                      <button
                        key={o}
                        onClick={() => setOdd(o)}
                        className="px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all"
                        style={odd === o
                          ? { background: '#6366f1', color: 'white', borderColor: 'transparent' }
                          : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }
                        }
                      >
                        {o.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Valor por aposta */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-500 font-semibold">Valor por aposta</span>
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-bold">R$</span>
                    <input
                      type="number" min={10} max={500}
                      value={betAmountOdds}
                      onChange={e => setBetAmountOdds(Math.max(10, Number(e.target.value) || 10))}
                      className="w-full border rounded-lg pl-7 pr-2.5 py-1 text-sm font-bold text-right tabular-nums"
                      style={{ borderColor: '#e5e7eb', color: '#111827' }}
                    />
                  </div>
                </div>

                {/* Resultado */}
                <div className="rounded-lg p-3" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                  <div className="text-[10px] text-stone-500 mb-0.5">Perda esperada por aposta</div>
                  <div className="text-2xl font-black text-red-500 tabular-nums">−{formatBRL(lossPerBet)}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    A casa retém <strong className="text-stone-600">{formatPct(houseEdge)}</strong> de cada real apostado.
                  </div>
                </div>

                {/* Barras de probabilidade */}
                <div className="space-y-2 pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
                  <div className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400">Chance de lucro após N apostas</div>
                  {N_BETS.map(n => {
                    const pct = probProfit(odd, n)
                    const col = pct < 15 ? '#ef4444' : pct < 35 ? '#f59e0b' : '#22c55e'
                    return (
                      <div key={n} className="flex items-center gap-2">
                        <span className="text-[9px] text-stone-400 w-24 flex-shrink-0">{n.toLocaleString('pt-BR')} apostas</span>
                        <div className="flex-1 bg-stone-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${Math.max(pct, 0.5)}%`, background: col }} />
                        </div>
                        <span className="text-[9px] font-bold w-10 text-right" style={{ color: col }}>{formatPct(pct)}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Simulação de 100 rodadas */}
                <div className="pt-2 border-t space-y-2" style={{ borderColor: '#f3f4f6' }}>
                  <button
                    onClick={runSimulation}
                    disabled={simRunning}
                    className="w-full py-2.5 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                    style={{ background: '#dc2626', color: 'white' }}
                  >
                    {simRunning ? 'Simulando...' : '🎰 Simular 100 Rodadas (R$ 1.000 virtual)'}
                  </button>
                  {simHistory.length > 0 && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { label: 'Pico',   val: formatBRL(simPeak),  col: '#16a34a' },
                          { label: 'Final',  val: formatBRL(simFinal), col: simFinal < 1000 ? '#ef4444' : '#16a34a' },
                          { label: 'Result', val: simFinal < 1000 ? `-${formatPct(((1000-simFinal)/1000)*100)}` : `+${formatPct(((simFinal-1000)/1000)*100)}`, col: simFinal < 1000 ? '#ef4444' : '#16a34a' },
                        ].map(m => (
                          <div key={m.label} className="rounded-lg p-2 text-center" style={{ border: '1px solid #e5e7eb' }}>
                            <div className="text-[9px] text-stone-400 uppercase tracking-wider">{m.label}</div>
                            <div className="text-sm font-bold mt-0.5" style={{ color: m.col }}>{m.val}</div>
                          </div>
                        ))}
                      </div>
                      <div className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={simChartData} margin={{ top: 4, right: 4, left: -30, bottom: 4 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="r" hide />
                            <YAxis tick={{ fontSize: 8, fill: '#9ca3af' }} tickLine={false} />
                            <Tooltip content={({ active, payload }) => {
                              if (!active || !payload?.length) return null
                              return <div className="bg-stone-800 text-white rounded px-2 py-1 text-[10px] font-semibold">{formatBRL(Number(payload[0].value))}</div>
                            }} />
                            <Line type="monotone" dataKey="Saldo" stroke={simFinal < 1000 ? '#ef4444' : '#10b981'} strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <ChapterNav chapter={chapter} total={5} onPrev={() => setChapter(0)} onNext={() => setChapter(2)} />
            </div>
          )}

          {/* ── CAPÍTULO 2: CUSTO REAL ── */}
          {chapter === 2 && (
            <div className="p-6 space-y-5 animate-fadeIn">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[3px]" style={{ color: '#f59e0b' }}>Capítulo 3 · Custo Real</span>
                <h2 className="text-2xl font-black text-stone-900 mt-1 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Quanto você<br/>realmente perdeu?
                </h2>
              </div>

              {/* Inputs */}
              <div className="rounded-xl border p-4 space-y-4" style={{ background: 'white', borderColor: '#e5e7eb' }}>
                {/* Monthly */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-stone-500">Apostado por mês</label>
                    <div className="relative w-36">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-stone-400">R$</span>
                      <input
                        type="text" inputMode="numeric"
                        value={monthly === 0 ? '' : monthly.toLocaleString('pt-BR')}
                        onChange={e => { const v = parseInt(e.target.value.replace(/\D/g,''),10); setMonthly(isNaN(v) ? 0 : Math.min(50000, v)) }}
                        className="w-full border rounded-xl pr-3 pl-8 py-1.5 text-sm font-extrabold text-right tabular-nums"
                        style={{ borderColor: '#e5e7eb', color: '#111827' }}
                      />
                    </div>
                  </div>
                  <input type="range" min={50} max={5000} step={50} value={Math.min(5000, monthly)} onChange={e => setMonthly(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer" style={{ accentColor: '#f59e0b', backgroundColor: '#e5e7eb' }} />
                </div>
                {/* Months */}
                <div className="space-y-2 pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-stone-500">Meses apostando</label>
                    <div className="relative w-24">
                      <input
                        type="text" inputMode="numeric"
                        value={months === 0 ? '' : months.toLocaleString('pt-BR')}
                        onChange={e => { const v = parseInt(e.target.value.replace(/\D/g,''),10); setMonths(isNaN(v) ? 0 : Math.min(360, v)) }}
                        className="w-full border rounded-xl px-3 py-1.5 text-sm font-extrabold text-right tabular-nums"
                        style={{ borderColor: '#e5e7eb', color: '#111827' }}
                      />
                    </div>
                  </div>
                  <input type="range" min={1} max={60} step={1} value={Math.min(60, months)} onChange={e => setMonths(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer" style={{ accentColor: '#f59e0b', backgroundColor: '#e5e7eb' }} />
                </div>
              </div>

              <ResultHero
                label="O que saiu do seu bolso"
                value={formatBRL(totalSpent)}
                comment={`${months} meses de apostas.`}
                colorClass="text-red-500"
              />

              <SectionDivider label="Projeção em 5 anos" />

              <MetricGrid metrics={[
                { label: 'No ritmo atual',       value: formatBRL(projection5y), sublabel: '5 anos apostando',          colorClass: 'text-red-500 animate-pulse' },
                { label: 'Se investido na Selic', value: formatBRL(invested5y),  sublabel: `${(RATES.selic*100).toFixed(2)}% a.a.`, colorClass: 'text-emerald-600' },
                { label: 'Diferença perdida',     value: formatBRL(difference),  sublabel: 'juros compostos perdidos',  colorClass: 'text-amber-500 font-extrabold' },
              ]} />

              <SectionDivider label={`Com ${formatBRL(monthly)}/mês você pagaria`} />
              <ComparisonList monthlyAmount={monthly} comparisons={COMPARISONS} />

              {/* Share card */}
              <div className="rounded-2xl p-4 border" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
                <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider text-stone-400">Compartilhe o resultado</p>
                <ScaledPreview>
                  <ShareCardBase
                    id="bets-share-card"
                    eyebrow="meus gastos com apostas"
                    mainValue={formatBRL(monthly) + '/mês'}
                    mainLabel="valor apostado mensalmente"
                    metrics={[
                      { label: 'já perdi',    value: formatBRL(totalSpent)   },
                      { label: 'em 5 anos',   value: formatBRL(projection5y) },
                      { label: 'se investido', value: formatBRL(invested5y)  },
                      { label: 'diferença',   value: '+' + formatBRL(difference) },
                    ]}
                    footer="a conta chegou faz tempo."
                    accentColor="#ef4444"
                  />
                </ScaledPreview>
                <div className="mt-3"><ShareButtons cardId="bets-share-card" filename="apostas" /></div>
              </div>

              <ChapterNav chapter={chapter} total={5} onPrev={() => setChapter(1)} onNext={() => setChapter(3)} />
            </div>
          )}

          {/* ── CAPÍTULO 3: BRASIL ── */}
          {chapter === 3 && (
            <div className="p-6 space-y-5 animate-fadeIn">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[3px]" style={{ color: '#10b981' }}>Capítulo 4 · Impacto Nacional</span>
                <h2 className="text-2xl font-black text-stone-900 mt-1 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  O Brasil sangra<br/>R$ 130 bilhões.
                </h2>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                Em 2024, os brasileiros transferiram R$ 130 bilhões para plataformas de apostas.
                É mais do que o orçamento anual de saúde de vários estados somados.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: '85–92%', label: 'perdem a longo prazo',           bg: '#fef2f2', bc: '#fecaca', vc: '#dc2626', lc: '#ef4444' },
                  { val: '5 mi',   label: 'Bolsa Família apostaram em 2024', bg: '#fef2f2', bc: '#fecaca', vc: '#dc2626', lc: '#ef4444' },
                  { val: '63%',    label: 'tiveram renda comprometida',      bg: '#fff7ed', bc: '#fed7aa', vc: '#d97706', lc: '#f59e0b' },
                  { val: '+150%',  label: 'diagnósticos de ludomania (3a)',   bg: '#fff7ed', bc: '#fed7aa', vc: '#d97706', lc: '#f59e0b' },
                ].map(s => (
                  <div key={s.val} className="rounded-xl p-3 text-center border" style={{ background: s.bg, borderColor: s.bc }}>
                    <div className="text-xl font-black" style={{ color: s.vc }}>{s.val}</div>
                    <div className="text-[9px] font-bold mt-0.5" style={{ color: s.lc }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {[
                  {
                    src: '🏛️ Banco Central do Brasil (09/2024)',
                    text: 'R$ 20,8 bilhões em Pix para casas de apostas em um único mês. Beneficiários do Bolsa Família transferiram R$ 3 bilhões — média de R$ 100 por pessoa.',
                  },
                  {
                    src: '📊 Sociedade Brasileira de Varejo (2024)',
                    text: '63% dos apostadores tiveram sua renda principal comprometida. 23% reduziram vestuário e 19% sacrificaram saúde e medicamentos.',
                  },
                  {
                    src: '🧠 Instituto de Psiquiatria da USP',
                    text: 'Diagnósticos de ludomania cresceram mais de 150% nos últimos 3 anos devido à facilidade do acesso móvel e à sensação de ganho fácil.',
                  },
                ].map(d => (
                  <div key={d.src} className="rounded-xl border p-3 text-xs" style={{ background: 'white', borderColor: '#e5e7eb' }}>
                    <div className="font-bold text-stone-600 mb-1">{d.src}</div>
                    <div className="text-stone-500 leading-relaxed">{d.text}</div>
                  </div>
                ))}
              </div>

              <ChapterNav chapter={chapter} total={5} onPrev={() => setChapter(2)} onNext={() => setChapter(4)} />
            </div>
          )}

          {/* ── CAPÍTULO 4: SAÍDA ── */}
          {chapter === 4 && (
            <div className="p-6 space-y-5 animate-fadeIn">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[3px]" style={{ color: '#059669' }}>Capítulo 5 · Saída</span>
                <h2 className="text-2xl font-black text-stone-900 mt-1 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Você pode<br/>parar agora.
                </h2>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                O transtorno por jogo (ludopatia) é uma condição médica tratável.
                Apoio gratuito, confidencial e imediato:
              </p>

              <div className="space-y-2">
                {[
                  { icon: <HeartHandshake size={14}/>, title: 'Jogadores Anônimos Brasil', sub: 'ja.org.br · Reuniões diárias gratuitas — online e presencial', href: 'https://ja.org.br' },
                  { icon: <Phone size={14}/>, title: 'CVV — Centro de Valorização da Vida', sub: 'Disque 188 · 24h, gratuito e sob sigilo', href: 'https://cvv.org.br' },
                  { icon: <HeartHandshake size={14}/>, title: 'CAPS AD — SUS', sub: 'Disque 136 para localizar o CAPS mais próximo gratuitamente', href: 'https://www.gov.br/saude' },
                  { icon: <Lock size={14}/>, title: 'Autoexclusão de CPF', sub: 'Solicite o bloqueio permanente do seu CPF em todas as plataformas', href: 'https://www.gov.br/fazenda/pt-br/assuntos/noticias/2024/marco/bets' },
                ].map(r => (
                  <a
                    key={r.title}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center justify-between rounded-xl border p-3 hover:border-stone-300 transition-colors group"
                    style={{ background: 'white', borderColor: '#e5e7eb', textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-stone-400 group-hover:text-stone-600 transition-colors">{r.icon}</div>
                      <div>
                        <div className="text-xs font-bold text-stone-700">{r.title}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">{r.sub}</div>
                      </div>
                    </div>
                    <span className="text-stone-300 group-hover:text-stone-500 transition-colors ml-2">→</span>
                  </a>
                ))}
              </div>

              <SourcesFooter sources={[
                { label: 'Banco Central do Brasil — Apostas Esportivas e impacto no orçamento das famílias', url: 'https://www.bcb.gov.br/estabilidadefinanceira/apostasesportivas' },
                { label: 'Sociedade Brasileira de Varejo — Pesquisa de impacto das bets no consumo (2024)',  url: 'https://sbvc.com.br' },
                { label: 'Instituto de Psiquiatria da USP — Ludomania no Brasil',                            url: 'https://www.ipq.hc.fm.usp.br' },
                { label: 'BCB — Taxa Selic vigente',                                                         url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
              ]} />

              <ChapterNav chapter={chapter} total={5} onPrev={() => setChapter(3)} />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Sub-componente de navegação de capítulos ──────────────────────────────
function ChapterNav({ chapter, total, onPrev, onNext }: {
  chapter: number
  total: number
  onPrev?: () => void
  onNext?: () => void
}) {
  return (
    <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
      {onPrev
        ? <button onClick={onPrev} className="text-xs font-bold text-stone-400 hover:text-stone-600 cursor-pointer px-3 py-2 rounded-lg border border-stone-200 hover:border-stone-300 transition-all">← Anterior</button>
        : <div />
      }
      <span className="text-[9px] text-stone-300 uppercase tracking-wider">{chapter + 1} de {total}</span>
      {onNext
        ? <button onClick={onNext} className="text-xs font-bold cursor-pointer px-3 py-2 rounded-lg transition-all" style={{ background: '#111827', color: 'white' }}>Próximo →</button>
        : <span className="text-[9px] text-emerald-600 font-bold">✓ Jornada completa</span>
      }
    </div>
  )
}
```

- [ ] **4.2 — Verificar build**

```bash
npm run build 2>&1 | Select-String -Pattern "error TS" | Select-Object -First 10
```

Esperado: sem erros TypeScript.

- [ ] **4.3 — Commit**

```bash
git add components/calculators/BetsNarrative.tsx
git commit -m "feat(apostas): add BetsNarrative with 5 educational chapters"
```

---

## Task 5: Reescrever `BetsCalculator.tsx` como orquestrador

**Files:**
- Modify: `components/calculators/BetsCalculator.tsx` (substituição completa)

- [ ] **5.1 — Substituir o conteúdo do arquivo**

Substituir TODO o conteúdo de `components/calculators/BetsCalculator.tsx` por:

```tsx
'use client'

import React, { useState } from 'react'
import { BetsCasino }    from './BetsCasino'
import { BetsRupture }   from './BetsRupture'
import { BetsNarrative } from './BetsNarrative'

type Phase = 'casino' | 'rupture' | 'narrative'

export function BetsCalculator() {
  const [phase, setPhase]               = useState<Phase>('casino')
  const [completedRounds, setCompletedRounds] = useState(0)

  return (
    <div className="space-y-0">
      {phase === 'casino' && (
        <BetsCasino
          onBankrupt={(rounds) => {
            setCompletedRounds(rounds)
            setPhase('rupture')
          }}
        />
      )}

      {phase === 'rupture' && (
        <BetsRupture
          rounds={completedRounds}
          onReveal={() => setPhase('narrative')}
        />
      )}

      {phase === 'narrative' && (
        <BetsNarrative />
      )}
    </div>
  )
}
```

- [ ] **5.2 — Verificar build completo**

```bash
npm run build 2>&1 | Select-String -Pattern "error|Error TS" | Select-Object -First 20
```

Esperado: build bem-sucedido, sem erros TypeScript.

- [ ] **5.3 — Commit**

```bash
git add components/calculators/BetsCalculator.tsx
git commit -m "feat(apostas): rewrite BetsCalculator as phase orchestrator"
```

---

## Task 6: Atualizar `app/apostas/page.tsx`

**Files:**
- Modify: `app/apostas/page.tsx`

- [ ] **6.1 — Atualizar metadata e header**

Substituir TODO o conteúdo de `app/apostas/page.tsx` por:

```tsx
import type { Metadata } from 'next'
import { BetsCalculator } from '@/components/calculators/BetsCalculator'
import { AppCTA }         from '@/components/AppCTA'

export const metadata: Metadata = {
  title: 'A Ilusão das Apostas — Jogue, perca e entenda a matemática',
  description: 'Um cassino virtual que revela a matemática real das bets. Jogue, experimente a decadência, e descubra quanto você realmente perde.',
  openGraph: {
    title: 'A Ilusão das Apostas — A Ponta do Lápis',
    description: 'Jogue. Perca. Entenda. A matemática das bets nunca mente.',
    url: 'https://apontadolapis.com.br/apostas',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/apostas' },
}

export default function ApostasPage() {
  return (
    <div className="space-y-6">
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          APOSTAS · SIMULAÇÃO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          A casa não é burra.<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>Mas você pode ser mais esperto.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Jogue o cassino abaixo. Sinta a adrenalina. Depois veja o que a matemática tem a dizer sobre cada clique que você deu.
        </p>
      </div>

      <BetsCalculator />

      <AppCTA context="esse gasto" />
    </div>
  )
}
```

- [ ] **6.2 — Verificar build final**

```bash
npm run build
```

Esperado: **Build successful.** Todas as páginas geradas sem erros ou avisos de TypeScript.

- [ ] **6.3 — Commit final**

```bash
git add app/apostas/page.tsx
git commit -m "feat(apostas): complete redesign — casino + rupture + narrative journey

- Phase 1: Immersive casino with 5-stage progressive decay
- Phase 2: Dramatic split-screen rupture animation
- Phase 3: 5-chapter educational narrative
- Remove /apostas/probabilidades route
- Update page metadata and header

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Verificação Visual no Dev Server

- [ ] **7.1 — Iniciar servidor de desenvolvimento**

```bash
npm run dev
```

Abrir `http://localhost:3000/apostas` no browser.

- [ ] **7.2 — Checklist de verificação**

| Item | O que verificar |
|------|----------------|
| Fase 1 — Pristine | Cassino com fundo `#14102a`, neon dourado, glows coloridos nas slots |
| Fase 1 — Decadência | Após rodadas 11-14 (balance caindo abaixo de 160), cores mudam para âmbar → vermelho, 💸 voam |
| Fase 1 — Estágio 2 | Teia de aranha `🕷️` aparece no canto quando balance < 120 |
| Fase 1 — Estágio 3 | Rachadura SVG visível quando balance < 80, `🚨💔` aparecem |
| Fase 1 — Colapso | Quando balance = 0, slots viram 💀, animação de colapso |
| Fase 2 — Sequência | Tremor → flash vermelho → split screen com raio (total ~1s) |
| Fase 2 — Split | Lado esquerdo: cassino cinza morto. Raio vermelho. Lado direito: fundo claro, "A ilusão acabou." |
| Fase 2 — CTA | Botão "Ver a verdade completa →" funciona e exibe Fase 3 |
| Fase 3 — Sidebar | 5 nós clicáveis na sidebar escura, ativo muda de cor |
| Fase 3 — Capítulos | Navegação Próximo/Anterior funciona entre todos os 5 capítulos |
| Fase 3 — Cap.1 | Gráfico de barras de dopamina renderiza com 15 barras coloridas |
| Fase 3 — Cap.2 | Calculadora de odds: mudar odd e betAmount atualiza valores em tempo real |
| Fase 3 — Cap.2 | Botão "Simular 100 Rodadas" gera gráfico sparkline |
| Fase 3 — Cap.3 | Sliders + inputs sincronizados, MetricGrid e ComparisonList renderizam |
| Fase 3 — Cap.5 | Links de recursos e SourcesFooter visíveis |
| `/apostas/probabilidades` | Rota retorna 404 (não existe mais) |
| Dark mode | Alternar tema — cassino deve continuar visível e legível |
| Mobile | Testar em viewport 375px — layout responsivo sem overflow horizontal |

- [ ] **7.3 — Se build OK e visual aprovado, PR está pronto**

```bash
git log --oneline -7
```

Esperado: 7 commits limpos com mensagens descritivas desde o início da feature.
