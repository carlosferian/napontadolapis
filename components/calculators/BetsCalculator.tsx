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
