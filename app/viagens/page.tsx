import type { Metadata } from 'next'
import Link from 'next/link'
import { destinations, regionLabels, type Region } from '@/config/travel'
import { AppCTA } from '@/components/AppCTA'

export const metadata: Metadata = {
  title: 'Calculadoras de Viagem — Quanto custa viajar?',
  description: 'Calcule o custo real da sua próxima viagem em reais, com câmbio, IOF e plano de poupança mensal. Você sonha com a viagem. A gente faz a conta.',
  openGraph: {
    title: 'Viagens — A Ponta do Lápis',
    description: 'Você sonha com a viagem. A gente faz a conta.',
    url: 'https://apontadolapis.com.br/viagens',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/viagens' },
}

const regionOrder: Region[] = ['brasil', 'america_sul', 'caribe', 'america_norte', 'europa', 'asia_oceania']

export default function ViagensPage() {
  const byRegion = regionOrder
    .map((region) => ({
      region,
      label: regionLabels[region],
      dests: destinations.filter((d) => d.region === region),
    }))
    .filter((g) => g.dests.length > 0)

  return (
    <div className="space-y-8">

      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)' }}>
        <span className="c-pill c-pill-blue" style={{ marginBottom: 16, display: 'inline-flex' }}>
          SONHOS · VIAGENS
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Você sonha<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>com a viagem.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560, marginBottom: 20 }}>
          A gente faz a conta. Câmbio, IOF, Wise e plano de poupança real para chegar lá.
          Escolha um destino abaixo ou planeje o seu próprio.
        </p>
        <Link
          href="/viagens/planejar"
          className="c-btn c-btn-emerald"
          style={{ fontSize: 14 }}
        >
          ✏ Planejar qualquer destino →
        </Link>
      </div>

      {byRegion.map(({ region, label, dests }) => (
        <div key={region} className="space-y-3">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{label}</h2>
          <div className="grid gap-2">
            {dests.map((dest) => (
              <Link
                key={dest.id}
                href={`/viagens/${dest.id}`}
                className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center gap-4 hover:border-amber-200 hover:shadow-sm transition-all group"
              >
                <span className="text-3xl">{dest.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-stone-800">{dest.name}</span>
                    <span className="text-xs text-stone-400">{dest.country}</span>
                    {dest.visa.required && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md">visto</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 italic mt-0.5">{dest.highlight}</p>
                </div>
                <span className="text-stone-300 group-hover:text-amber-400 transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
      <AppCTA context="os gastos da sua viagem" />
    </div>
  )
}
