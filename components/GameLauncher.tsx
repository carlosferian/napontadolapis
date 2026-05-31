'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { BetsCalculator } from './calculators/BetsCalculator'

export function GameLauncher() {
  const [open, setOpen] = useState(false)

  // Trava o scroll do body quando o overlay está aberto
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  return (
    <>
      {/* Botão de entrada na página */}
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

      {/* Overlay fullscreen — flex column para header fixo + conteúdo scrollável */}
      {open && (
        <div
          style={{
            // ── Posicionamento ──
            position:   'fixed',
            top:        0,
            left:       0,
            right:      0,
            bottom:     0,
            zIndex:     200,
            // ── Altura correta no iOS Safari (lvh = large viewport height) ──
            height:     '100lvh',
            // ── Flex column: header não-scrollável + conteúdo scrollável ──
            display:        'flex',
            flexDirection:  'column',
            // ── Safe areas para notch e home indicator ──
            paddingTop:    'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft:   'env(safe-area-inset-left)',
            paddingRight:  'env(safe-area-inset-right)',
            background:    'var(--c-bg)',
            // Previne scroll horizontal
            overflowX:     'hidden',
          }}
        >
          {/* ── Header: flex-shrink:0 para nunca ser comprimido ── */}
          <div
            style={{
              flexShrink:   0,
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'space-between',
              padding:      '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              background:   'rgba(10,10,20,0.92)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                display:     'flex',
                alignItems:  'center',
                gap:         6,
                background:  'rgba(255,255,255,0.1)',
                border:      '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8,
                padding:     '7px 14px',
                color:       '#e2e8f0',
                fontSize:    13,
                fontWeight:  700,
                cursor:      'pointer',
                flexShrink:  0,
                // Hit area confortável no mobile
                minHeight:   40,
              }}
            >
              <ArrowLeft size={16} />
              Voltar
            </button>

            <span
              style={{
                color:          'rgba(255,255,255,0.3)',
                fontSize:       10,
                fontWeight:     800,
                letterSpacing:  3,
                textTransform:  'uppercase',
              }}
            >
              A Ilusão das Apostas
            </span>

            {/* Spacer simétrico ao botão */}
            <div style={{ width: 80, flexShrink: 0 }} />
          </div>

          {/* ── Área de conteúdo: flex:1 + overflow-y:auto ──
               Scroll apenas aqui, nunca na página por baixo */}
          <div
            style={{
              flex:             1,
              overflowY:        'auto',
              overflowX:        'hidden',
              overscrollBehavior: 'contain',
              // Scroll suave no iOS
              WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
            }}
          >
            <div style={{ padding: '12px 12px 32px', maxWidth: 580, margin: '0 auto' }}>
              <BetsCalculator />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
