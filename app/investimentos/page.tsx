import type { Metadata } from 'next'
import { InvestmentComparison } from '@/components/calculators/InvestmentComparison'

export const metadata: Metadata = {
  title: 'E se eu tivesse investido? Comparador de investimentos vs apostas',
  description: 'Compare quanto renderia poupança, Selic, CDB e Tesouro Direto contra apostas esportivas. O dinheiro trabalha — ou some.',
  openGraph: {
    title: 'Comparativo de Investimentos — Na Ponta do Lápis',
    description: 'O dinheiro trabalha — ou some.',
    url: 'https://napontadolapis.com.br/investimentos',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://napontadolapis.com.br/investimentos' },
}

export default function InvestimentosPage() {
  return (
    <div className="space-y-6">
      <InvestmentComparison />
      <div className="prose prose-sm prose-stone max-w-none">
        <h2 className="text-base font-semibold text-stone-700">Sobre os investimentos</h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          Os cálculos usam juros compostos com aporte mensal (fórmula de valor futuro de anuidade).
          As taxas são estimativas baseadas nos índices atuais do BACEN e B3 — podem mudar conforme
          a política monetária. Rentabilidade passada não garante resultados futuros.
          O retorno de 72% nas apostas é baseado em estudos de mercado de apostas esportivas brasileiras.
        </p>
      </div>
    </div>
  )
}
