'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { ComparisonList } from '@/components/ui/ComparisonList'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareCardBase } from '@/components/share/ShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { compoundMonthly } from '@/lib/calculations/compound'
import { formatBRL } from '@/lib/formatters'
import { comments } from '@/lib/contextualComments'
import { RATES } from '@/config/rates'
import { 
  ShoppingCart, Tv, Fuel, BookOpen, Flame, Sparkles, TrendingDown, 
  RefreshCw, AlertTriangle, Play, HelpCircle, Trophy, Coins, Dices, 
  LineChart, Phone, ShieldAlert, HeartHandshake
} from 'lucide-react'

// Comparações de poder de compra
const comparisons = [
  { 
    icon: ShoppingCart, 
    label: 'Carrinhos de supermercado', 
    value: 250, 
    unit: 'compras',
    explanation: 'Calculado com base em um carrinho de compras básico de supermercado no valor de R$ 250,00.' 
  },
  { 
    icon: Tv, 
    label: 'Assinaturas de streaming premium', 
    value: 60, 
    unit: 'meses',
    explanation: 'Baseado no custo médio mensal de R$ 60,00 para planos familiares de streaming de vídeo ou música.' 
  },
  { 
    icon: Fuel, 
    label: 'Tanques de combustível (50L)', 
    value: 280, 
    unit: 'tanques',
    explanation: 'Estimado a partir do preço médio nacional de R$ 5,60/L da gasolina comum para encher um tanque de 50 litros.' 
  },
  { 
    icon: BookOpen, 
    label: 'Livros físicos impressos', 
    value: 50, 
    unit: 'livros',
    explanation: 'Considerando o preço médio de capa de R$ 50,00 para livros físicos novos de literatura ou técnicos.' 
  },
]

// Modalidades de Apostas
const MODALITIES = [
  { id: 'slots', name: '🐯 Slots do Tigrinho', emoji: '🐯', desc: 'Gire e tente alinhar as frutas e o ouro. Custo fixo por giro.', rtp: 0.85, baseLoss: '15% de perda embutida' },
  { id: 'crash', name: '🚀 Foguetinho / Aviator', emoji: '🚀', desc: 'Saia antes que o avião exploda. 3% de chance de explosão instantânea.', rtp: 0.90, baseLoss: '10% de perda embutida' },
  { id: 'sports', name: '⚽ Múltiplas de Futebol', emoji: '⚽', desc: 'Combine 4 zebras e torça por um milagre improvável.', rtp: 0.75, baseLoss: '25% de perda embutida' },
  { id: 'roulette', name: '🎡 Roleta do Cassino', emoji: '🎡', desc: 'Aposte no Vermelho/Preto. A casa vence pelo zero verde (2,7% edge).', rtp: 0.973, baseLoss: '2.7% de perda embutida' },
]

// 15 passos da Ilusão (Simulação de Dopamina e Quebra)
const PREDEFINED_ROUNDS = [
  { win: true, mult: 2.0, msg: '🐯 O Tigre soltou a carta de ouro! Você ganhou +R$ 10,00 líquidos. É extremamente fácil, né?' },
  { win: true, mult: 1.8, msg: '🚀 MULTIPLICOU! O Foguetinho subiu até 1.8x. +R$ 8,00 líquidos. Você sente que tem o controle do tempo!' },
  { win: false, mult: 0, msg: '❌ Derrota... A bola bateu na trave no último segundo do jogo. Tente mais uma para recuperar!' },
  { win: false, mult: 0, msg: '🎡 A roleta caiu na cor Preta por um fio. A sorte está logo ali na próxima rodada...' },
  { win: true, mult: 4.0, msg: '🎉 BIG WIN!!! 💰 O Tigre multiplicou por 4x! +R$ 30,00 líquidos! Seu cérebro é inundado por dopamina. Você se sente um gênio das apostas!' },
  { win: false, mult: 0, msg: '❌ Derrota... Faz parte. É o gerenciamento de risco. Você ainda está no lucro acumulado!' },
  { win: false, mult: 0, msg: '🚀 O foguete explodiu instantaneamente em 1.02x. Quase deu tempo de sair. Tente de novo!' },
  { win: false, mult: 0, msg: '❌ Roleta caiu no verde (Zero). A casa sempre tem essa vantagem oculta.' },
  { win: true, mult: 1.2, msg: '🐯 Vitória discreta! +R$ 2,00. Pelo menos recuperou uma parte da aposta anterior. A maré vai virar!' },
  { win: false, mult: 0, msg: '❌ Derrota... O jogo esportivo teve uma virada improvável nos acréscimos. A banca agradece.' },
  { win: false, mult: 0, msg: '🐯 Nada na tela. Você começa a se sentir frustrado e ansioso para recuperar seu capital.' },
  { win: false, mult: 0, msg: '🚀 Foguete explodiu rápido de novo. A sensação de controle sumiu por completo.' },
  { win: false, mult: 0, msg: '❌ Derrota... O saldo está encolhendo em ritmo assustador. Só mais um clique para salvar o dia!' },
  { win: false, mult: 0, msg: '❌ Derrota... A roleta ignorou sua cor preferida de novo. O pânico de perder tudo bate forte.' },
  { win: false, mult: 0, msg: '🚨 ALL-IN FORÇADO! Você colocou seu saldo restante e... perdeu tudo. O tigre sumiu e a roleta parou.' }
]

export function BetsCalculator() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'calculator'>('simulator')

  // --- ESTADOS DA CALCULADORA DE PERDA REAL ---
  const [monthly, setMonthly] = useState(300)
  const [months, setMonths] = useState(12)

  const totalSpent = monthly * months
  const projection5y = monthly * 60
  const invested5y = compoundMonthly(monthly, 5, RATES.selic)
  const difference = invested5y - projection5y

  // --- ESTADOS DO SIMULADOR DA ILUSÃO (GAMIFICADO) ---
  const [balance, setBalance] = useState(100)
  const [betAmount, setBetAmount] = useState(10)
  const [selectedModality, setSelectedModality] = useState('slots')
  const [roundCount, setRoundCount] = useState(0)
  const [log, setLog] = useState<{ id: number; mod: string; result: 'win' | 'lose'; val: number; desc: string }[]>([])
  const [isRolling, setIsRolling] = useState(false)
  const [rollingEmoji, setRollingEmoji] = useState('🐯')
  const [alertOverlay, setAlertOverlay] = useState<string | null>(null)
  
  // Automático (Piloto Automático)
  const [autoSimulating, setAutoSimulating] = useState(false)
  const [autoRounds, setAutoRounds] = useState(0)
  const [autoPeak, setAutoPeak] = useState(1000)
  const [autoBrokeRound, setAutoBrokeRound] = useState(0)

  // Rolagem de emojis festivos quando gira a aposta
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRolling) {
      const emojis = ['🐯', '🚀', '⚽', '🎡', '💎', '🍒', '💥', '🟢', '⚫']
      let idx = 0
      interval = setInterval(() => {
        setRollingEmoji(emojis[idx % emojis.length])
        idx++
      }, 80)
    }
    return () => clearInterval(interval)
  }, [isRolling])

  // Rodar aposta manual
  const handleBet = () => {
    if (balance <= 0) return
    setIsRolling(true)
    
    // Simula 750ms de "tensão/espera"
    setTimeout(() => {
      setIsRolling(false)
      const currentRoundIdx = roundCount
      const predefined = PREDEFINED_ROUNDS[Math.min(currentRoundIdx, PREDEFINED_ROUNDS.length - 1)]
      
      let nextBalance = balance
      let currentBet = betAmount

      // Proteção de aposta excedente
      if (nextBalance < currentBet) {
        currentBet = nextBalance
      }

      let winAmount = 0
      let logResult: 'win' | 'lose' = 'lose'

      if (predefined.win && currentRoundIdx < PREDEFINED_ROUNDS.length - 1) {
        winAmount = Math.round(currentBet * predefined.mult)
        nextBalance = nextBalance - currentBet + winAmount
        logResult = 'win'
      } else {
        nextBalance = nextBalance - currentBet
      }

      // Se for a última jogada forçada ou zerou
      if (nextBalance <= 0) {
        nextBalance = 0
        setAlertOverlay('🚨 SALDO ZERADO! Você perdeu 100% do seu saldo virtual. A banca sempre vence a longo prazo.')
      }

      setBalance(nextBalance)
      setRoundCount(prev => prev + 1)
      
      const modalityObj = MODALITIES.find(m => m.id === selectedModality)

      setLog(prev => [
        {
          id: Date.now(),
          mod: modalityObj?.emoji || '🎰',
          result: logResult,
          val: logResult === 'win' ? winAmount - currentBet : -currentBet,
          desc: predefined.msg
        },
        ...prev
      ])
    }, 750)
  }

  // Reiniciar Simulador
  const handleResetSimulator = () => {
    setBalance(100)
    setBetAmount(10)
    setRoundCount(0)
    setLog([])
    setAlertOverlay(null)
    setAutoSimulating(false)
    setAutoRounds(0)
    setAutoPeak(100)
    setAutoBrokeRound(0)
  }

  // Iniciar Piloto Automático de 1.000 Rodadas (Ruin Theory)
  const handleAutoSimulate = () => {
    setAutoSimulating(true)
    let currentBalance = 1000 // Inicia com mais dinheiro para ver a curva
    let peak = 1000
    let rounds = 0
    let brokeAt = 0
    const betSize = 20
    const modalityObj = MODALITIES.find(m => m.id === selectedModality)
    const rtp = modalityObj?.rtp || 0.85

    const interval = setInterval(() => {
      if (currentBalance <= 0) {
        currentBalance = 0
        clearInterval(interval)
        setAutoSimulating(false)
        setBalance(0)
        setAlertOverlay(`💥 QUEBRA TOTAL NO PILOTO AUTOMÁTICO! Você iniciou com R$ 1.000,00 e aguentou exatamente ${rounds} rodadas automáticas até ir à falência absoluta. RTP real de mercado: ${Math.round(rtp * 100)}%.`)
        return
      }

      rounds++
      // Algoritmo matemático real de aposta com expectativa negativa (RTP)
      const win = Math.random() < (rtp * 0.45) // Ajustado para simular o edge matemático da banca
      if (win) {
        const reward = Math.round(betSize * 2.1)
        currentBalance = currentBalance - betSize + reward
        if (currentBalance > peak) {
          peak = currentBalance
        }
      } else {
        currentBalance = currentBalance - betSize
      }

      // Atualizações de progresso visual rápidas
      setBalance(Math.max(0, currentBalance))
      setAutoRounds(rounds)
      setAutoPeak(peak)
      if (currentBalance <= 0 && brokeAt === 0) {
        brokeAt = rounds
        setAutoBrokeRound(brokeAt)
      }
    }, 15) // Ticker ultra veloz de 15ms por rodada
  }

  return (
    <div className="space-y-6">
      
      {/* Menu principal de Abas do Portal */}
      <div className="rounded-2xl border p-1.5 flex gap-1 bg-stone-500/5 max-w-lg mx-auto" style={{ borderColor: 'var(--c-line)' }}>
        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${activeTab === 'simulator' ? 'bg-white dark:bg-stone-800 shadow-sm border text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}
          style={{ borderColor: activeTab === 'simulator' ? 'var(--c-line)' : 'transparent' }}
        >
          🎰 Simulador da Ilusão (O Jogo)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${activeTab === 'calculator' ? 'bg-white dark:bg-stone-800 shadow-sm border text-stone-900 dark:text-stone-100' : 'text-stone-500'}`}
          style={{ borderColor: activeTab === 'calculator' ? 'var(--c-line)' : 'transparent' }}
        >
          📊 Quanto Você Perde na Real?
        </button>
      </div>

      {activeTab === 'simulator' ? (
        // ─── ABA 1: SIMULADOR INTERATIVO GAMIFICADO ───────────────────────────
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LOBBY DE APOSTAS E CONTROLES (COLUNA ESQUERDA) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-[32px] border-2 bg-stone-950 text-stone-100" style={{ borderColor: '#e0b35a' }}>
              <div className="space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-stone-800">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e0b35a] flex items-center gap-1.5 animate-pulse">
                    <Flame size={12} className="text-amber-500" /> CASSINO DIGITAL RIGGED
                  </span>
                  <span className="text-xs text-stone-400 font-medium">Banca Virtual</span>
                </div>

                {/* Seletor de Modalidades Visuais */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Escolha o seu Jogo:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {MODALITIES.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedModality(m.id)}
                        disabled={isRolling || autoSimulating}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${selectedModality === m.id ? 'bg-[#e0b35a]/10 border-[#e0b35a] text-white shadow-[0_0_12px_rgba(224,179,90,0.15)]' : 'bg-stone-900/50 border-stone-800 text-stone-400 hover:border-stone-700'}`}
                      >
                        <span className="text-lg block mb-0.5">{m.emoji}</span>
                        <span className="text-xs font-extrabold block truncate">{m.name.split(' ').slice(1).join(' ')}</span>
                        <span className="text-[9px] text-[#e0b35a] block font-medium mt-0.5">{m.baseLoss}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seleção do valor da aposta */}
                <div className="space-y-2 pt-2 border-t border-stone-900">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-400">Aposta por Rodada:</span>
                    <span className="font-extrabold text-[#e0b35a] text-sm">{formatBRL(betAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={50}
                    step={2}
                    value={betAmount}
                    disabled={isRolling || autoSimulating}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#e0b35a]"
                  />
                  <div className="flex justify-between text-[9px] text-stone-500 font-semibold">
                    <span>Mínimo R$ 2</span>
                    <span>Máximo R$ 50</span>
                  </div>
                </div>
              </div>

              {/* Botão de Jogada Grande */}
              <div className="space-y-3 pt-6">
                
                {/* Visualizador de Tensão / Spin */}
                <div className="h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center relative overflow-hidden">
                  {isRolling ? (
                    <div className="text-3xl font-extrabold animate-bounce flex items-center gap-2 text-white">
                      <span>{rollingEmoji}</span>
                      <span className="text-sm tracking-widest text-[#e0b35a] animate-pulse">GIRENDO...</span>
                      <span>{rollingEmoji}</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      {balance <= 0 ? (
                        <span className="text-xs font-bold text-red-500 uppercase tracking-wider block">🚫 Limite Atingido</span>
                      ) : (
                        <span className="text-2xl font-black text-white flex items-center gap-1.5 justify-center">
                          {MODALITIES.find(m => m.id === selectedModality)?.emoji} 
                          <span className="text-sm font-semibold text-stone-400">Pronto para girar</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {balance <= 0 ? (
                  <button
                    onClick={handleResetSimulator}
                    className="w-full py-4 rounded-2xl bg-[#e0b35a] text-black font-black text-sm uppercase tracking-wider hover:bg-[#e6c178] shadow-lg cursor-pointer transition-transform duration-100 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} className="animate-spin-slow" /> Recomeçar Simulação 🔄
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleBet}
                      disabled={isRolling || autoSimulating}
                      className="flex-[2] py-4 rounded-2xl bg-[#e0b35a] text-black font-black text-sm uppercase tracking-wider hover:bg-[#e6c178] shadow-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-transform duration-100 active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Play size={16} fill="black" /> Apostar {formatBRL(betAmount)} 🎰
                    </button>
                    
                    <button
                      onClick={handleAutoSimulate}
                      disabled={isRolling || autoSimulating}
                      className="flex-1 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 font-bold text-xs uppercase hover:bg-stone-800 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      <LineChart size={14} /> Piloto Auto
                    </button>
                  </div>
                )}
                
                <p className="text-[10px] text-center text-stone-500 font-medium">
                  *Cada clique simula as chances matemáticas e margens reais aplicadas pelas Bets.
                </p>
              </div>
            </div>

            {/* PAINEL DE CONTROLE DE SALDO E HISTÓRICO (COLUNA DIREITA) */}
            <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-[32px] border bg-white dark:bg-stone-900" style={{ borderColor: 'var(--c-line)' }}>
              <div className="space-y-4">
                
                {/* Saldo Virtual Gigante */}
                <div className="p-5 rounded-2xl border text-center relative overflow-hidden" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Coins size={48} className="text-[#e0b35a]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: 'var(--c-muted)' }}>Seu Saldo Virtual</span>
                  <span className={`text-4xl sm:text-5xl font-black tracking-tight block mt-1 tabular-nums ${balance > 100 ? 'text-[#e0b35a]' : balance > 0 ? 'text-stone-800 dark:text-stone-100' : 'text-red-500'}`}>
                    {formatBRL(balance)}
                  </span>
                  
                  {/* Badge de Dopamina Dinâmico */}
                  <div className="mt-2.5 flex justify-center">
                    {roundCount === 0 ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-stone-500/10 rounded-full" style={{ color: 'var(--c-muted)' }}>Aguardando 1ª rodada</span>
                    ) : balance > 100 ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center gap-1 animate-pulse">
                        🎯 Pico de Dopamina (Você quer mais!)
                      </span>
                    ) : balance > 30 ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center gap-1 animate-pulse">
                        ⚠️ Alerta: Drenando (Ansiedade ativada)
                      </span>
                    ) : balance > 0 ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center gap-1 animate-bounce">
                        🚨 Queda Livre! Quase zero.
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 bg-red-600 text-white rounded-full flex items-center gap-1">
                        💀 Falência Completa. A Banca Venceu.
                      </span>
                    )}
                  </div>
                </div>

                {/* Se estiver no Piloto Automático */}
                {autoRounds > 0 && (
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.02] text-xs space-y-1.5 animate-fadeIn">
                    <p className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <AlertTriangle size={14} /> Relatório da Automação de Edge:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-stone-600 dark:text-stone-400">
                      <p>Rodadas simuladas: <strong className="text-stone-900 dark:text-stone-100">{autoRounds}</strong></p>
                      <p>Pico máximo saldo: <strong className="text-stone-900 dark:text-stone-100">{formatBRL(autoPeak)}</strong></p>
                      <p>Expectativa teórica: <strong className="text-red-500">-100% (Quebra)</strong></p>
                      {autoBrokeRound > 0 && <p>Quebrou na rodada: <strong className="text-red-500">{autoBrokeRound}</strong></p>}
                    </div>
                  </div>
                )}

                {/* Painel do Veredito / Ilusão */}
                {alertOverlay ? (
                  <div className="p-4 rounded-2xl border-2 border-red-500/30 bg-red-500/5 text-xs leading-relaxed text-red-950 dark:text-red-200">
                    <p className="font-extrabold text-sm mb-1.5 flex items-center gap-1.5"><ShieldAlert size={16} /> Como a Ilusão foi desmascarada:</p>
                    <p className="mb-2">
                      {alertOverlay}
                    </p>
                    <p className="font-semibold text-stone-600 dark:text-stone-400">
                      O algoritmo gerou pequenas vitórias iniciais propositalmente (como no Giro 1, 2 e 5) para acionar impulsos químicos de empolgação no seu cérebro. Mas o final é sempre o mesmo: a desvantagem matemática drena seu saldo até a falência.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border flex gap-3 text-xs leading-relaxed" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)', color: 'var(--c-muted)' }}>
                    <HelpCircle className="shrink-0 text-stone-500" size={18} style={{ color: 'var(--c-muted)' }} />
                    <div>
                      <p className="font-bold mb-0.5" style={{ color: 'var(--c-ink)' }}>Como funciona a simulação? 💡</p>
                      <p>
                        Dê os primeiros cliques em "Apostar" e preste atenção na montanha-russa do saldo. Você experimentará o ciclo de ilusão programado das plataformas reais: <strong>ganhos pequenos iniciais para te empolgar, seguidos da perda rápida e inevitável de todo o seu dinheiro.</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Histórico Recente de Jogadas */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Histórico de Rodadas:</span>
                  <div className="h-44 rounded-xl border overflow-y-auto p-3.5 space-y-2.5 text-xs font-medium scrollbar-thin" style={{ borderColor: 'var(--c-line)', backgroundColor: 'var(--c-surface)' }}>
                    {log.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-stone-400 italic">
                        Nenhuma aposta efetuada ainda. Clique em "Apostar" para iniciar.
                      </div>
                    ) : (
                      log.map((item, idx) => (
                        <div key={item.id} className="flex justify-between items-start gap-3 pb-2 border-b last:border-0" style={{ borderColor: 'var(--c-line)' }}>
                          <div className="flex gap-2 min-w-0">
                            <span className="text-base shrink-0">{item.mod}</span>
                            <p className="text-stone-500 dark:text-stone-400 leading-tight min-w-0 break-words">{item.desc}</p>
                          </div>
                          <span className={`font-extrabold tabular-nums shrink-0 whitespace-nowrap ${item.result === 'win' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                            {item.result === 'win' ? '+' : ''}{formatBRL(item.val)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      ) : (
        // ─── ABA 2: CALCULADORA DE PERDA REAL (ORIGINAL REESTRUTURADA COM INPUTS FORMATADOS) ───
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start animate-fadeIn">
          
          {/* COLUNA ESQUERDA: PARÂMETROS */}
          <div className="lg:col-span-5">
            <CalculatorCard title="Seus Números no Papel" subtitle="Preencha os valores reais que saem do seu bolso com apostas e compare.">
              {/* Valor apostado por mês */}
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-4 mb-1">
                  <label htmlFor="monthly-bet-input" className="text-xs font-bold" style={{ color: 'var(--c-muted)' }}>
                    Valor Apostado por Mês
                  </label>
                  <div className="relative max-w-[140px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold" style={{ color: 'var(--c-muted-2)' }}>R$</span>
                    <input
                      id="monthly-bet-input"
                      type="text"
                      inputMode="numeric"
                      value={monthly === 0 ? '' : monthly.toLocaleString('pt-BR')}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        const val = raw ? parseInt(raw, 10) : 0;
                        setMonthly(Math.min(100000, val));
                      }}
                      className="w-full text-right border rounded-xl pr-3 pl-8 py-1.5 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums bg-transparent"
                      style={{
                        color: 'var(--c-ink)',
                        borderColor: 'var(--c-line)'
                      }}
                    />
                  </div>
                </div>
                <input
                  id="monthly-bet"
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={Math.min(5000, monthly)}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  style={{ backgroundColor: 'var(--c-line)' }}
                />
                <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
                  <span>R$ 50</span>
                  <span>R$ 5.000</span>
                </div>
              </div>

              {/* Meses apostando */}
              <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--c-line)' }}>
                <div className="flex justify-between items-center gap-4 mb-1">
                  <label htmlFor="months-bet-input" className="text-xs font-bold" style={{ color: 'var(--c-muted)' }}>
                    Tempo Apostando (Meses)
                  </label>
                  <div className="relative max-w-[100px]">
                    <input
                      id="months-bet-input"
                      type="text"
                      inputMode="numeric"
                      value={months === 0 ? '' : months.toLocaleString('pt-BR')}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        const val = raw ? parseInt(raw, 10) : 0;
                        setMonths(Math.min(360, val));
                      }}
                      className="w-full text-right border rounded-xl px-3 py-1.5 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums bg-transparent"
                      style={{
                        color: 'var(--c-ink)',
                        borderColor: 'var(--c-line)'
                      }}
                    />
                  </div>
                </div>
                <input
                  id="months-bet"
                  type="range"
                  min={1}
                  max={60}
                  step={1}
                  value={Math.min(60, months)}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  style={{ backgroundColor: 'var(--c-line)' }}
                />
                <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
                  <span>1 mês</span>
                  <span>60 meses (5 anos)</span>
                </div>
              </div>
            </CalculatorCard>
          </div>

          {/* COLUNA DIREITA: ANÁLISE E PODER DE COMPRA */}
          <div role="region" aria-live="polite" aria-label="Resultado do cálculo" className="space-y-4 lg:col-span-7">
            <ResultHero
              label="O que saiu do seu bolso"
              value={formatBRL(totalSpent)}
              comment={comments.apostasTotal(totalSpent)}
              colorClass="text-red-500"
              infoTooltip="Esta comparação ilustra o poder de compra real do montante total acumulado que saiu do seu bolso, baseado em valores médios de bens e serviços de consumo vigentes no Brasil."
            />

            <SectionDivider label="Projeção em 5 anos" />

            <MetricGrid
              metrics={[
                { label: 'No ritmo atual', value: formatBRL(projection5y), sublabel: '5 anos apostando', colorClass: 'text-red-500 animate-pulse' },
                { label: 'Se investido na Selic', value: formatBRL(invested5y), sublabel: `${(RATES.selic * 100).toFixed(2)}% a.a.`, colorClass: 'text-emerald-600' },
                { label: 'Diferença perdida', value: formatBRL(difference), sublabel: 'juros compostos perdidos', colorClass: 'text-amber-500 font-extrabold' },
              ]}
            />

            <SectionDivider label={`Com R$ ${monthly.toLocaleString('pt-BR')}/mês você pagaria`} />

            <ComparisonList monthlyAmount={monthly} comparisons={comparisons} />

            <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
              <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Compartilhe o resultado</p>
              <ScaledPreview>
                <ShareCardBase
                  id="bets-share-card"
                  eyebrow="meus gastos com apostas"
                  mainValue={formatBRL(monthly) + '/mês'}
                  mainLabel="valor apostado mensalmente"
                  metrics={[
                    { label: 'já perdi', value: formatBRL(totalSpent) },
                    { label: 'em 5 anos', value: formatBRL(projection5y) },
                    { label: 'se investido', value: formatBRL(invested5y) },
                    { label: 'diferença', value: '+' + formatBRL(difference) },
                  ]}
                  footer="a conta chegou faz tempo."
                  accentColor="#ef4444"
                />
              </ScaledPreview>
              <div className="mt-3">
                <ShareButtons cardId="bets-share-card" filename="apostas" />
              </div>
            </div>

            <p className="text-xs text-stone-400 text-center leading-relaxed">
              Selic utilizada: {(RATES.selic * 100).toFixed(2)}% a.a. — {RATES.lastUpdated}. Valores são estimativas.<br />
              O rendimento da Selic está sujeito a IR (15% sobre ganhos após 24 meses).
            </p>
          </div>

        </div>
      )}

      {/* ─── DADOS OFICIAIS E PREVENÇÃO AO VÍCIO (RODAPÉ PEDAGÓGICO) ───────────────── */}
      <div className="rounded-3xl border p-6 sm:p-8 space-y-6" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
        
        <div>
          <h2 className="text-lg font-black flex items-center gap-2" style={{ color: 'var(--c-ink)' }}>
            <ShieldAlert size={20} className="text-red-500 animate-pulse" /> O Impacto Real das Apostas no Brasil (Dados Oficiais)
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed mt-2">
            No Brasil, a explosão de jogos digitais de azar desestruturou o orçamento de milhões de lares. Entenda o que as estatísticas mostram sobre o mercado de Bets:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs">
            <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10">
              <p className="font-extrabold text-red-600 dark:text-red-400">85% a 92% perdem a longo prazo</p>
              <p className="text-stone-500 dark:text-stone-400 mt-1">Levantamentos e estatísticas financeiras revelam que a imensa maioria dos usuários frequentes encerra suas contas em prejuízo financeiro acumulado.</p>
            </div>
            <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10">
              <p className="font-extrabold text-red-600 dark:text-red-400">Prejuízo aos Consumos Básicos</p>
              <p className="text-stone-500 dark:text-stone-400 mt-1">Estudos do Banco Central indicam que beneficiários de programas de distribuição de renda transferiram bilhões de reais em Pix para plataformas de apostas em 2024.</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-5 space-y-3" style={{ borderColor: 'var(--c-line)' }}>
          <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--c-ink)' }}>
            <HeartHandshake size={18} className="text-emerald-600" /> Onde Conseguir Ajuda e Apoio Gratuito
          </h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">
            Se você ou alguém próximo está enfrentando dificuldades com o controle de apostas, lembre-se que <strong>o vício em jogos (ludopatia) é uma condição médica tratável e o apoio é gratuito</strong>:
          </p>
          <div className="space-y-3 mt-3 text-xs">
            <div className="p-4 rounded-xl bg-stone-500/5 border" style={{ borderColor: 'var(--c-line)' }}>
              <p className="font-extrabold" style={{ color: 'var(--c-ink-2)' }}>👥 Jogadores Anônimos do Brasil (JA)</p>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                Uma irmandade de homens e mulheres que compartilham suas experiências para se recuperar mutuamente do vício do jogo de forma 100% anônima e gratuita. Oferece reuniões diárias online e presenciais por todo o país.
              </p>
              <p className="mt-2 font-bold text-emerald-600">
                Acesse o site oficial: <a href="https://jogadoresanonimos.com.br/" target="_blank" rel="noopener noreferrer nofollow" className="underline hover:opacity-80">jogadoresanonimos.com.br</a>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-500/5 border" style={{ borderColor: 'var(--c-line)' }}>
              <p className="font-extrabold" style={{ color: 'var(--c-ink-2)' }}>🏥 Rede Pública do SUS (CAPS)</p>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                Você pode buscar atendimento voluntário gratuito nos Centros de Atenção Psicossocial (CAPS) da sua cidade. Profissionais de psicologia e psiquiatria prestam acolhimento imediato e orientações clínicas para superar a ludopatia.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-500/5 border" style={{ borderColor: 'var(--c-line)' }}>
              <p className="font-extrabold" style={{ color: 'var(--c-ink-2)' }}>🔒 Autoexclusão (A Atitude Mais Eficaz)</p>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                Uma das formas mais fortes de interromper o hábito é a autoexclusão. Você tem o direito de solicitar diretamente no suporte ou painel de configurações das operadoras o <strong>bloqueio permanente e definitivo do seu CPF</strong> para depósitos e apostas.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
