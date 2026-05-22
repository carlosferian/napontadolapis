import type { Metadata } from 'next'
import { OddsCalculator } from '@/components/calculators/OddsCalculator'

export const metadata: Metadata = {
  title: 'Qual é a chance real de ganhar na bet? Calculadora de probabilidades',
  description: 'Descubra qual é sua chance matemática real de lucrar com apostas esportivas. A casa não é burra — veja os números.',
  openGraph: {
    title: 'Probabilidades Reais — Na Ponta do Lápis',
    description: 'A casa não é burra. Veja os números.',
    url: 'https://napontadolapis.com.br/apostas/probabilidades',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://napontadolapis.com.br/apostas/probabilidades' },
}

export default function ProbabilidadesPage() {
  return (
    <div className="space-y-6">
      <OddsCalculator />
      <div className="prose prose-sm prose-stone max-w-none">
        <h2 className="text-base font-semibold text-stone-700">Como funciona o cálculo</h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          Toda odd embute uma margem para a casa — a diferença entre a probabilidade implícita e o retorno real.
          A probabilidade de estar no lucro após muitas apostas é calculada pelo Teorema do Limite Central,
          que aproxima a distribuição acumulada de ganhos e perdas por uma curva normal. Em odds comuns (1.7–2.0),
          a matemática é implacável: quanto mais apostas, menor a chance de lucro.
        </p>
      </div>
    </div>
  )
}
