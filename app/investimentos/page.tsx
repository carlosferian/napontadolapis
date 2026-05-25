import type { Metadata } from 'next'
import { InvestmentComparison } from '@/components/calculators/InvestmentComparison'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'E se eu tivesse investido? Comparador de investimentos vs apostas',
  description: 'Compare quanto renderia poupança, Selic, CDB e Tesouro Direto contra apostas esportivas. O dinheiro trabalha — ou some.',
  openGraph: {
    title: 'Comparativo de Investimentos — A Ponta do Lápis',
    description: 'O dinheiro trabalha — ou some.',
    url: 'https://apontadolapis.com.br/investimentos',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/investimentos' },
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
      <SourcesFooter sources={[
        { label: 'BCB — Taxa Selic vigente e histórico', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
        { label: 'Resolução BCB 4.930/2021 — Regra de remuneração da poupança (0,5%/mês + TR quando Selic > 8,5%)' },
        { label: 'Tesouro Nacional — Tesouro IPCA+ e taxas de referência', url: 'https://www.tesourodireto.com.br/titulos/tipos-de-tesouro.htm' },
        { label: 'Receita Federal — IR tabela regressiva: 22,5% (< 6 meses) a 15% (> 24 meses)', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/irrf' },
        { label: 'BCB — Apostas Esportivas e impacto no orçamento das famílias', url: 'https://www.bcb.gov.br/estabilidadefinanceira/apostasesportivas' },
      ]} />
      <AppCTA context="seus aportes e investimentos" />
    </div>
  )
}
