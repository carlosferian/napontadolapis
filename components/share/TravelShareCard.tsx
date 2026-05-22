import React from 'react'
import { Destination, TravelStyle } from '@/config/travel'
import { formatBRL } from '@/lib/formatters'

const STYLE_LABELS: Record<TravelStyle, string> = {
  budget: 'Econômico',
  mid: 'Confortável',
  premium: 'Premium',
}

interface TravelShareCardProps {
  destination: Destination
  travelers: number
  days: number
  style: TravelStyle
  totalBRL: number
  monthlyBRL: number
  months: number
  savingsWise: number
  sharePhrase: string
}

export function TravelShareCard({
  destination,
  travelers,
  days,
  style,
  totalBRL,
  monthlyBRL,
  months,
  savingsWise,
  sharePhrase,
}: TravelShareCardProps) {
  return (
    <div
      id="travel-share-card"
      style={{
        backgroundColor: '#0a2342',
        width: 600,
        padding: 22,
        fontFamily: 'DM Sans, sans-serif',
        borderRadius: 16,
      }}
    >
      {/* Brand */}
      <div style={{ color: '#e8a838', opacity: 0.5, fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>
        · NA PONTA DO LÁPIS
      </div>

      {/* Destination line */}
      <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>
        {destination.flag} {destination.name.toUpperCase()} · {days} dias · {travelers} pessoa{travelers !== 1 ? 's' : ''}
      </div>

      {/* Eyebrow */}
      <div style={{ color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
        minha viagem dos sonhos custa
      </div>

      {/* Main value */}
      <div style={{ color: '#e8a838', fontSize: 34, fontWeight: 700, letterSpacing: -1, marginBottom: 20 }}>
        {formatBRL(totalBRL)}
      </div>

      {/* Metrics 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginBottom: 20 }}>
        {[
          { label: 'POUPAR/MÊS', value: formatBRL(monthlyBRL) },
          { label: 'EM QUANTO TEMPO', value: `${months} meses` },
          { label: 'ECONOMIA WISE', value: formatBRL(savingsWise) },
          { label: 'ESTILO', value: STYLE_LABELS[style] },
        ].map((m, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 8,
              padding: '12px 14px',
            }}
          >
            <div style={{ color: '#64748b', fontSize: 10, marginBottom: 4 }}>{m.label}</div>
            <div style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 700 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#475569', fontSize: 11, fontStyle: 'italic', opacity: 0.6 }}>{sharePhrase}</div>
        <div style={{ color: '#334155', fontSize: 9, opacity: 0.4 }}>napontadolapis.com.br</div>
      </div>
    </div>
  )
}
