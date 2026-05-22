import type { Metadata } from 'next'
import { TravelCalculator } from '@/components/calculators/TravelCalculator'

export const metadata: Metadata = {
  title: 'Calculadora da Viagem dos Sonhos — Planeje qualquer destino',
  description: 'Calcule o custo real de qualquer viagem em reais, compare cartão tradicional com fintech e saiba quanto poupar por mês. Sem ilusão, sem susto.',
  openGraph: {
    title: 'Calculadora da Viagem dos Sonhos — Na Ponta do Lápis',
    description: 'Você sonha com a viagem. A gente faz a conta.',
    url: 'https://napontadolapis.com.br/viagens/planejar',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://napontadolapis.com.br/viagens/planejar' },
}

export default function PlanejarPage() {
  return (
    <div className="space-y-6">
      <TravelCalculator />
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-stone-700">Como funciona o cálculo</h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          O custo diário inclui hospedagem, alimentação, transporte local e atividades, estimado por
          pessoa por dia em dólares. O voo é calculado em reais (round trip de GRU/CGH). O cartão
          tradicional aplica IOF de 4,38% mais spread bancário médio de 4%. A fintech (Wise, Nomad)
          aplica apenas cerca de 1,5% de taxa, sem IOF. A meta inclui 15% de margem de segurança.
          O plano de poupança usa a fórmula PMT de anuidade com a taxa Selic.
        </p>
      </div>
    </div>
  )
}
