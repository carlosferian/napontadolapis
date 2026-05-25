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
        backgroundColor: '#EEF2F9',
        width: 600,
        fontFamily: 'Georgia, "Times New Roman", serif',
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          backgroundColor: '#172030',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#00C4BE',
            }}
          />
          <span
            style={{
              color: '#00C4BE',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              fontFamily: 'Georgia, serif',
            }}
          >
            A PONTA DO LÁPIS
          </span>
        </div>
        <span style={{ color: '#00C4BE', opacity: 0.35, fontSize: 9, letterSpacing: 1, fontFamily: 'sans-serif' }}>
          apontadolapis.com.br
        </span>
      </div>

      {/* Main content */}
      <div style={{ padding: '28px 28px 0' }}>
        {/* Eyebrow */}
        <div
          style={{
            color: '#8B8F9A',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 10,
            fontFamily: 'sans-serif',
            fontWeight: 600,
          }}
        >
          {eyebrow}
        </div>

        {/* Main value */}
        <div
          style={{
            color: accentColor,
            fontSize: 54,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          {mainValue}
        </div>

        {/* Main label */}
        <div
          style={{
            color: '#6B7280',
            fontSize: 13,
            marginBottom: 24,
            fontFamily: 'sans-serif',
            fontWeight: 400,
          }}
        >
          {mainLabel}
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: '#D6E1EF', marginBottom: 20 }} />

        {/* Metrics grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginBottom: 24,
          }}
        >
          {metrics.map((m, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: '14px 16px',
                borderLeft: `3px solid ${accentColor}`,
              }}
            >
              <div
                style={{
                  color: '#9CA3AF',
                  fontSize: 9,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  marginBottom: 5,
                  fontFamily: 'sans-serif',
                  fontWeight: 600,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  color: '#172030',
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: -0.5,
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
          backgroundColor: '#172030',
          padding: '12px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            color: '#6B7A8D',
            fontSize: 11,
            fontStyle: 'italic',
            fontFamily: 'Georgia, serif',
          }}
        >
          {footer}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#00C4BE', opacity: 0.6 }} />
          <span style={{ color: '#00C4BE', opacity: 0.4, fontSize: 9, letterSpacing: 1, fontFamily: 'sans-serif' }}>
            CALCULADO COM DADOS REAIS
          </span>
        </div>
      </div>
    </div>
  )
}
