import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { destinations } from '@/config/travel'
import { TravelCalculator } from '@/components/calculators/TravelCalculator'

interface PageProps {
  params: Promise<{ destino: string }>
}

export async function generateStaticParams() {
  return destinations.map((d) => ({ destino: d.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { destino } = await params
  const dest = destinations.find((d) => d.id === destino)
  if (!dest) return {}

  const year = new Date().getFullYear()
  return {
    title: `Quanto custa viajar para ${dest.name}? Calculadora ${year}`,
    description: `Calcule o custo real de uma viagem para ${dest.name} em reais, com câmbio, IOF e plano de poupança mensal. Sem ilusão, sem susto.`,
    openGraph: {
      title: `Viagem para ${dest.name}: quanto custa de verdade?`,
      description: `${dest.flag} ${dest.name} · ${dest.highlight}`,
      url: `https://apontadolapis.com.br/viagens/${dest.id}`,
      locale: 'pt_BR',
      type: 'website',
    },
    alternates: { canonical: `https://apontadolapis.com.br/viagens/${dest.id}` },
  }
}

export default async function DestinationPage({ params }: PageProps) {
  const { destino } = await params
  const dest = destinations.find((d) => d.id === destino)
  if (!dest) notFound()

  return (
    <div className="space-y-6">
      <TravelCalculator initialDestination={dest} />

      <div className="space-y-3">
        <h2 className="text-base font-semibold text-stone-700">
          Quanto custa viajar para {dest.name}?
        </h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          Os valores estimados incluem hospedagem, alimentação, transporte local e atividades.
          O custo do voo é calculado em reais (round trip de Guarulhos ou Congonhas).
        </p>
        {dest.visa.required && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-amber-700 text-sm font-medium">Visto para {dest.country}</p>
            <p className="text-amber-600 text-sm mt-1">
              {dest.visa.notes}. Custo aproximado: US$ {dest.visa.costUSD} por pessoa.
            </p>
          </div>
        )}
        <p className="text-xs text-stone-400">
          Preços atualizados em {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}.
          Câmbio e valores variam — use a margem de segurança de 15% já incluída na calculadora.
        </p>
      </div>
    </div>
  )
}
