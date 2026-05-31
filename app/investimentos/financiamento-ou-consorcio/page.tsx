import type { Metadata } from 'next'
import { FinancingPageTabs } from '@/components/FinancingPageTabs'
import { AppCTA }        from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Financiamento vs. Consórcio — A diferença matemática que ninguém te conta',
  description: 'Compare SAC, Price, Empréstimo Pessoal e Consórcio com tabela matemática detalhada. Veja custo total, evolução das parcelas e por que o consórcio raramente compensa.',
  openGraph: {
    title: 'Financiamento vs. Consórcio — A Ponta do Lápis',
    description: 'Consórcio "sem juros" é mais barato? A matemática responde.',
    url: 'https://apontadolapis.com.br/investimentos/financiamento-ou-consorcio',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/investimentos/financiamento-ou-consorcio' },
}

export default function FinanciamentoOuConsorcioPage() {
  return (
    <div className="space-y-6">

      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          CRÉDITO · COMPARATIVO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(28px, 4vw, 50px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Consórcio "sem juros"<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>é mais barato que financiamento?</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 620 }}>
          Vendedores apresentam o consórcio como a alternativa sem juros ao financiamento.
          A realidade é outra: há{' '}
          <strong style={{ color: 'var(--c-ink)' }}>taxa de administração (15–25% sobre a carta)</strong>,{' '}
          <strong style={{ color: 'var(--c-ink)' }}>reajuste anual que aumenta suas parcelas</strong>{' '}
          e a agravante de que{' '}
          <strong style={{ color: 'var(--c-ink)' }}>você não recebe o bem até ser sorteado</strong>.
          A tabela abaixo coloca todos os modelos lado a lado, com a matemática completa.
        </p>
      </div>

      <FinancingPageTabs />

      <SourcesFooter sources={[
        { label: 'Banco Central do Brasil — Nota sobre Consórcios (Lei nº 11.795/2008)', url: 'https://www.bcb.gov.br/estabilidadefinanceira/consorcio' },
        { label: 'Receita Federal — Tabela SAC e sistemas de amortização', url: 'https://www.gov.br/receitafederal/pt-br' },
        { label: 'ABAC — Associação Brasileira de Administradoras de Consórcios', url: 'https://abac.org.br/' },
        { label: 'Procon-SP — Reclamações e orientações sobre consórcios', url: 'https://www.procon.sp.gov.br/' },
        { label: 'BCB — Calculadora do Cidadão (CET e comparativo de crédito)', url: 'https://www3.bcb.gov.br/CALCIDADAO/' },
      ]} />

      <AppCTA context="seu financiamento ou consórcio" />
    </div>
  )
}
