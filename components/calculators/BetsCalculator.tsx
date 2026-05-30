'use client'

import React, { useState, useCallback } from 'react'
import { BetsCasino }    from './BetsCasino'
import { BetsRupture }   from './BetsRupture'
import { BetsNarrative } from './BetsNarrative'
import { BetsLucky }     from './BetsLucky'

type Phase = 'casino' | 'rupture' | 'narrative' | 'lucky'

interface LuckyData { finalBalance: number; totalInvested: number }

export function BetsCalculator() {
  const [phase, setPhase]                     = useState<Phase>('casino')
  const [completedRounds, setCompletedRounds] = useState(0)
  const [luckyData, setLuckyData]             = useState<LuckyData | null>(null)
  // Key para forçar remount do BetsCasino ao reiniciar (re-randomiza isLucky)
  const [casinoKey, setCasinoKey]             = useState(0)

  const handleRestart = useCallback(() => {
    setPhase('casino')
    setCompletedRounds(0)
    setLuckyData(null)
    setCasinoKey(k => k + 1)
  }, [])

  const handleLuckyWin = useCallback((finalBalance: number, totalInvested: number) => {
    setLuckyData({ finalBalance, totalInvested })
    setPhase('lucky')
  }, [])

  return (
    <div className="space-y-0">
      {phase === 'casino' && (
        <BetsCasino
          key={casinoKey}
          onBankrupt={(rounds) => {
            setCompletedRounds(rounds)
            setPhase('rupture')
          }}
          onLuckyWin={handleLuckyWin}
        />
      )}

      {phase === 'rupture' && (
        <BetsRupture
          rounds={completedRounds}
          onReveal={() => setPhase('narrative')}
          onRestart={handleRestart}
        />
      )}

      {phase === 'lucky' && luckyData && (
        <BetsLucky
          finalBalance={luckyData.finalBalance}
          totalInvested={luckyData.totalInvested}
          onReveal={() => setPhase('narrative')}
          onRestart={handleRestart}
        />
      )}

      {phase === 'narrative' && (
        <BetsNarrative onRestart={handleRestart} />
      )}
    </div>
  )
}
