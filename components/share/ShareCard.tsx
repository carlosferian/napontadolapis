import React from 'react'

interface ShareCardBaseProps {
  eyebrow: string
  mainValue: string
  mainLabel: string
  metrics: { label: string; value: string }[]
  footer: string
  accentColor?: string
  id: string
}

export function ShareCardBase({
  eyebrow,
  mainValue,
  mainLabel,
  metrics,
  footer,
  accentColor = '#00C4BE',
  id,
}: ShareCardBaseProps) {
  return (
    <div
      id={id}
      style={{
        backgroundColor: '#060814',
        backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.02), transparent 40%), radial-gradient(circle at 10% 90%, rgba(255, 255, 255, 0.01), transparent 40%)',
        width: 600,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
      }}
    >
      {/* Dynamic Background Glow representing the Accent Color */}
      <div 
        style={{
          position: 'absolute',
          top: -150,
          right: -150,
          width: 350,
          height: 350,
          borderRadius: '50%',
          backgroundColor: accentColor,
          opacity: 0.07,
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
          opacity: 0.04,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header bar */}
      <div
        style={{
          backgroundColor: '#0B0D1B',
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
          {eyebrow}
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
            textShadow: `0 0 20px rgba(${accentColor === '#10b981' ? '16, 185, 129' : '0, 196, 190'}, 0.15)`,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {mainValue}
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
          {mainLabel}
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
          {metrics.map((m, i) => (
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
                  fontSize: 20,
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
          backgroundColor: '#0B0D1B',
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
          “ {footer} ”
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
