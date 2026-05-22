import React from 'react'

interface ShareCardBaseProps {
  eyebrow: string
  mainValue: string
  mainLabel: string
  metrics: { label: string; value: string }[]
  footer: string
  bgColor: string
  accentColor: string
  id: string
}

export function ShareCardBase({
  eyebrow,
  mainValue,
  mainLabel,
  metrics,
  footer,
  bgColor,
  accentColor,
  id,
}: ShareCardBaseProps) {
  return (
    <div
      id={id}
      style={{ backgroundColor: bgColor, width: 600, padding: 22, fontFamily: 'DM Sans, sans-serif' }}
      className="rounded-2xl"
    >
      {/* Header */}
      <div style={{ color: '#e8a838', opacity: 0.6, fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>
        · NA PONTA DO LÁPIS
      </div>

      {/* Eyebrow */}
      <div style={{ color: '#a8a29e', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        {eyebrow}
      </div>

      {/* Main value */}
      <div style={{ color: accentColor, fontSize: 34, fontWeight: 700, letterSpacing: -1, marginBottom: 4 }}>
        {mainValue}
      </div>
      <div style={{ color: '#78716c', fontSize: 12, marginBottom: 24 }}>
        {mainLabel}
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 8,
              padding: '12px 14px',
            }}
          >
            <div style={{ color: '#78716c', fontSize: 10, marginBottom: 4 }}>{m.label}</div>
            <div style={{ color: '#e7e5e4', fontSize: 16, fontWeight: 700 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#57534e', fontSize: 11, fontStyle: 'italic' }}>{footer}</div>
        <div style={{ color: '#44403c', fontSize: 10, opacity: 0.5 }}>napontadolapis.com.br</div>
      </div>
    </div>
  )
}
