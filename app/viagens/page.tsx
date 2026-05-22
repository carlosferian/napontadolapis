import type { Metadata } from 'next'
import Link from 'next/link'
import { destinations, regionLabels, type Region } from '@/config/travel'

export const metadata: Metadata = {
  title: 'Calculadoras de Viagem — Quanto custa viajar?',
  description: 'Calcule o custo real da sua próxima viagem em reais, com câmbio, IOF e plano de poupança mensal. Você sonha com a viagem. A gente faz a conta.',
  openGraph: {
    title: 'Viagens — Na Ponta do Lápis',
    description: 'Você sonha com a viagem. A gente faz a conta.',
    url: 'https://napontadolapis.com.br/viagens',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://napontadolapis.com.br/viagens' },
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
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Viagens</h1>
        <p className="text-stone-500 text-lg italic">Você sonha com a viagem. A gente faz a conta.</p>
        <Link
          href="/viagens/planejar"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
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
    </div>
  )
}
