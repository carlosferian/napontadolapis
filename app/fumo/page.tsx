import type { Metadata } from 'next'
import { SmokeCalculator } from '@/components/calculators/SmokeCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Quanto custa fumar? Calculadora do custo real do cigarro',
  description: 'Descubra quanto você gasta por mês, ano e em 10 anos com cigarro — e o que esse dinheiro renderia investido. Sem moralismo. Só a conta.',
  openGraph: {
    title: 'Custo do Fumo — Na Ponta do Lápis',
    description: 'Sem moralismo. Só a conta.',
    url: 'https://napontadolapis.com.br/fumo',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://napontadolapis.com.br/fumo' },
}

export default function FumoPage() {
  return (
    <div className="space-y-6">
      <SmokeCalculator />
      <div className="prose prose-sm prose-stone max-w-none">
        <h2 className="text-base font-semibold text-stone-700">Sobre o cálculo</h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          O custo é calculado com base no número de cigarros por dia e o preço do maço de 20 unidades.
          O custo mensal usa 30 dias como base. A projeção de investimento usa juros compostos mensais
          com a taxa Selic como referência. Esta calculadora não tem objetivo de julgamento — apenas mostra
          os números para quem quiser vê-los.
        </p>
      </div>
      <SourcesFooter sources={[
        { label: 'INCA — Instituto Nacional de Câncer: dados sobre tabagismo no Brasil', url: 'https://www.inca.gov.br/tabagismo' },
        { label: 'ANVISA — Regulação e controle do tabaco no Brasil', url: 'https://www.gov.br/anvisa/pt-br/assuntos/tabaco' },
        { label: 'BCB — Taxa Selic para referência de projeção de investimento', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
        { label: 'Wikipedia — Juros compostos: fórmula usada na projeção', url: 'https://pt.wikipedia.org/wiki/Juro_composto' },
      ]} />
      <AppCTA context="esse custo" />
    </div>
  )
}
