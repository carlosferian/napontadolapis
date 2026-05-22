import type { Metadata } from 'next'
import { BetsCalculator } from '@/components/calculators/BetsCalculator'

export const metadata: Metadata = {
  title: 'Calculadora de Gastos com Apostas — Quanto você gasta com bets?',
  description: 'Descubra quanto você realmente gasta com apostas esportivas e o que esse dinheiro renderia investido. Sem julgamento, só os números.',
  openGraph: {
    title: 'Calculadora de Apostas — Na Ponta do Lápis',
    description: 'os números não mentem. a gente só mostra eles.',
    url: 'https://napontadolapis.com.br/apostas',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://napontadolapis.com.br/apostas' },
}

export default function ApostasPage() {
  return (
    <div className="space-y-6">
      <BetsCalculator />
      <div className="prose prose-sm prose-stone max-w-none">
        <h2 className="text-base font-semibold text-stone-700">Sobre esta calculadora</h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          A calculadora de gastos com apostas mostra quanto você gasta por mês com bets esportivas,
          o total acumulado e o que esse dinheiro renderia se investido na Selic ao longo de 5 anos.
          Os valores são calculados com juros compostos mensais, usando a taxa Selic como referência.
          Não há julgamento — só matemática honesta.
        </p>
      </div>
    </div>
  )
}
