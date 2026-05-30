'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { BetsCalculator } from './calculators/BetsCalculator'

export function GameLauncher() {
  const [open, setOpen] = useState(false)

  // Bloqueia scroll do body enquanto o overlay está aberto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Botão de entrada */}
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl py-4 sm:py-5 font-black text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer transition-all active:scale-[0.98] hover:brightness-110"
        style={{
          background: 'linear-gradient(135deg, #14102a 0%, #1a0a1a 40%, #0d0000 100%)',
          color: '#fcd34d',
          border: '2px solid rgba(224,179,90,0.3)',
          boxShadow: '0 0 24px rgba(224,179,90,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <span className="text-2xl">🎰</span>
        Jogar a Simulação
      </button>

      {/* Overlay fullscreen */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'var(--c-bg)',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Header fixo com botão Voltar */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(10,10,20,0.9)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                padding: '6px 12px',
                color: '#e2e8f0',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={16} />
              Voltar
            </button>

            <span
              style={{
                color: 'rgba(255,255,255,0.35)',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}
            >
              A Ilusão das Apostas
            </span>

            {/* Spacer para centralizar o título */}
            <div style={{ width: 72, flexShrink: 0 }} />
          </div>

          {/* Conteúdo do jogo */}
          <div style={{ padding: '12px 12px 24px', maxWidth: 580, margin: '0 auto' }}>
            <BetsCalculator />
          </div>
        </div>
      )}
    </>
  )
}
