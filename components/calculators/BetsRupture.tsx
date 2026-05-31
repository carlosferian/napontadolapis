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
  onRestart: () => void
}

export function BetsRupture({ rounds, onReveal, onRestart }: BetsRuptureProps) {
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
      className="rounded-2xl sm:rounded-[32px] border-2 overflow-hidden flex flex-col sm:grid sm:grid-cols-[40%_4px_1fr]"
      style={{
        borderColor: '#dc2626',
        minHeight: 360,
      }}
    >
      {/* LADO ESQUERDO — cassino morto */}
      <div
        className="py-6 px-4 sm:py-7 sm:px-5 flex flex-col items-center justify-center gap-2.5 shrink-0 relative animate-pulse"
        style={{
          background: '#0d0000',
          backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(80,0,0,0.4) 0%, transparent 70%)',
          filter: 'grayscale(0.65)',
        }}
      >
        <svg className="absolute top-0 right-0 pointer-events-none hidden sm:block" width="80" height="100%" viewBox="0 0 80 360" preserveAspectRatio="none" style={{ opacity: 0.55 }}>
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
        className="w-full h-1 sm:w-auto sm:h-full"
        style={{
          background: 'linear-gradient(to right, rgba(255,255,255,0.9), #ef4444 20%, #dc2626 70%, #991b1b)',
          boxShadow: '0 0 16px rgba(220,38,38,0.5)',
          position: 'relative',
          zIndex: 10,
        }}
      />

      {/* LADO DIREITO — revelação */}
      <div
        className="py-8 px-5 sm:py-8 sm:px-6 flex flex-col justify-center items-center text-center gap-3"
        style={{
          background: '#f8f7f5',
          animation: 'slide-in-right 0.5s ease-out both',
        }}
      >
        <div style={{ animation: 'fade-up 0.4s 0.15s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, justifySelf: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', boxShadow: '0 0 6px #059669' }}/>
            <span style={{ fontSize: 8, fontWeight: 800, color: '#059669', letterSpacing: 3, textTransform: 'uppercase' }}>A REALIDADE</span>
          </div>
          <h2
            className="text-stone-900 font-black leading-tight text-2xl sm:text-3xl"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              margin: '6px 0 8px',
            }}
          >
            A ilusão<br/>acabou.
          </h2>
          <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 700, marginBottom: 10 }}>
            R$ 200 perdidos em {rounds} cliques.
          </p>
          <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.6, maxWidth: 220 }}>
            É assim que funciona toda vez.<br/>
            A matemática é implacável.
          </p>
        </div>

        <div style={{ animation: 'fade-up 0.4s 0.45s both', marginTop: 4, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', width: '100%' }}>
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
              justifyContent: 'center',
              gap: 6,
              width: '100%',
              maxWidth: 220,
            }}
          >
            Ver a verdade completa →
          </button>
          <button
            onClick={onRestart}
            style={{
              background: 'transparent',
              color: '#9ca3af',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ↺ Jogar novamente
          </button>
        </div>
      </div>
    </div>
  )
}
