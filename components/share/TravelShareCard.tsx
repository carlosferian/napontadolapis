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
  const accentColor = '#00C4BE'

  return (
    <div
      id="travel-share-card"
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
      {/* Background Decorative Glow */}
      <div 
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 320,
          height: 320,
          borderRadius: '50%',
          backgroundColor: accentColor,
          opacity: 0.06,
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: -120,
          left: -120,
          width: 320,
          height: 320,
          borderRadius: '50%',
          backgroundColor: accentColor,
          opacity: 0.03,
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header bar */}
      <div
        style={{
          backgroundColor: '#0B0D1B',
          padding: '16px 28px',
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

      {/* Destination banner (Luxury Glassmorphic Panel) */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(0, 196, 190, 0.08) 0%, rgba(6, 8, 20, 0.85) 100%)',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          position: 'relative',
        }}
      >
        {/* Flag with neon circular frame */}
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 15px rgba(0, 196, 190, 0.25)`,
            flexShrink: 0,
          }}
        >
          {destination.flag}
        </div>
        <div>
          <div
            style={{
              color: '#FFFFFF',
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: '-0.75px',
            }}
          >
            {destination.name}
          </div>
          <div
            style={{
              color: '#94A3B8',
              fontSize: 12,
              marginTop: 4,
              fontWeight: 500,
            }}
          >
            {days} dias · {travelers} pessoa{travelers !== 1 ? 's' : ''} · {STYLE_LABELS[style]}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '10px 16px', borderRadius: 16, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ color: '#64748B', fontSize: 9, textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, marginBottom: 3 }}>
            CUSTO TOTAL
          </div>
          <div style={{ color: accentColor, fontSize: 24, fontWeight: 900, letterSpacing: '-1px' }}>
            {formatBRL(totalBRL)}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '32px 32px 0', position: 'relative', zIndex: 2 }}>
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
          PARA REALIZAR ESSA VIAGEM, VOU POUPAR
        </div>

        {/* Monthly savings hero */}
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 58,
            fontWeight: 950,
            letterSpacing: '-2px',
            lineHeight: 1.05,
            marginBottom: 8,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {formatBRL(monthlyBRL)}
          <span style={{ fontSize: 20, color: '#8E9CAE', fontWeight: 500, letterSpacing: 0, marginLeft: 8 }}>
            /mês
          </span>
        </div>

        <div
          style={{
            color: '#94A3B8',
            fontSize: 14,
            marginBottom: 28,
            fontWeight: 500,
          }}
        >
          atingindo a meta em{' '}
          <strong style={{ color: '#FFFFFF', fontWeight: 800 }}>
            {months} {months === 1 ? 'mês' : 'meses'}
          </strong>
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
          {[
            { label: 'CUSTO DA VIAGEM', value: formatBRL(totalBRL) },
            { label: 'PRAZO', value: `${months} meses` },
            ...(savingsWise > 0
              ? [{ label: 'ECONOMIA ESTIMADA (WISE)', value: formatBRL(savingsWise) }]
              : [{ label: 'PAGAMENTOS', value: 'em reais' }]),
            { label: 'ESTILO', value: STYLE_LABELS[style] },
          ].map((m, i) => (
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
                  fontSize: 18,
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
          “ {sharePhrase} ”
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
