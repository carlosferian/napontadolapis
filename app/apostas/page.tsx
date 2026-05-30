import type { Metadata } from 'next'
import { BetsCalculator } from '@/components/calculators/BetsCalculator'
import { AppCTA }         from '@/components/AppCTA'

export const metadata: Metadata = {
  title: 'A Ilusão das Apostas — Jogue, perca e entenda a matemática',
  description: 'Um cassino virtual que revela a matemática real das bets. Jogue, experimente a decadência, e descubra quanto você realmente perde.',
  openGraph: {
    title: 'A Ilusão das Apostas — A Ponta do Lápis',
    description: 'Jogue. Perca. Entenda. A matemática das bets nunca mente.',
    url: 'https://apontadolapis.com.br/apostas',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/apostas' },
}

export default function ApostasPage() {
  return (
    <div className="space-y-6">
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          APOSTAS · SIMULAÇÃO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          A casa não é burra.<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>Mas você pode ser mais esperto.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Jogue o cassino abaixo. Sinta a adrenalina. Depois veja o que a matemática tem a dizer sobre cada clique que você deu.
        </p>
      </div>

      <BetsCalculator />

      <AppCTA context="esse gasto" />
    </div>
  )
}
