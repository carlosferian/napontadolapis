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
            NA PONTA DO LÁPIS
          </span>
        </div>
        <span
          style={{
            color: '#00C4BE',
            opacity: 0.35,
            fontSize: 9,
            letterSpacing: 1,
            fontFamily: 'sans-serif',
          }}
        >
          napontadolapis.com.br
        </span>
      </div>

      {/* Destination banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A3A5C 0%, #0D2A42 100%)',
          padding: '18px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 32 }}>{destination.flag}</span>
        <div>
          <div
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            {destination.name}
          </div>
          <div
            style={{
              color: '#94B4C8',
              fontSize: 11,
              fontFamily: 'sans-serif',
              marginTop: 2,
            }}
          >
            {days} dias · {travelers} pessoa{travelers !== 1 ? 's' : ''} · {STYLE_LABELS[style]}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ color: '#94B4C8', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1.5, fontFamily: 'sans-serif', marginBottom: 3 }}>
            custo total
          </div>
          <div style={{ color: '#00C4BE', fontSize: 26, fontWeight: 700, letterSpacing: -1 }}>
            {formatBRL(totalBRL)}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '22px 28px 0' }}>
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
          para realizar essa viagem, vou poupar
        </div>

        {/* Monthly savings hero */}
        <div
          style={{
            color: '#172030',
            fontSize: 46,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1,
            marginBottom: 6,
          }}
        >
          {formatBRL(monthlyBRL)}
          <span style={{ fontSize: 18, color: '#8B8F9A', fontWeight: 400, letterSpacing: 0, marginLeft: 8 }}>
            /mês
          </span>
        </div>

        <div
          style={{
            color: '#6B7280',
            fontSize: 13,
            marginBottom: 20,
            fontFamily: 'sans-serif',
          }}
        >
          chegando lá em{' '}
          <strong style={{ color: '#172030' }}>
            {months} {months === 1 ? 'mês' : 'meses'}
          </strong>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: '#D6E1EF', marginBottom: 18 }} />

        {/* Metrics grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginBottom: 22,
          }}
        >
          {[
            { label: 'CUSTO DA VIAGEM', value: formatBRL(totalBRL) },
            { label: 'PRAZO', value: `${months} meses` },
            ...(savingsWise > 0
              ? [{ label: 'ECONOMIA WISE/NOMAD', value: formatBRL(savingsWise) }]
              : [{ label: 'PAGAMENTOS', value: 'em reais' }]),
            { label: 'ESTILO', value: STYLE_LABELS[style] },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: '14px 16px',
                borderLeft: '3px solid #00C4BE',
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
          {sharePhrase}
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
