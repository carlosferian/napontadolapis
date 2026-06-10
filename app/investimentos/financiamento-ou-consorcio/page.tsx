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

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">SAC ou Price: qual sistema de amortização escolher?</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          No <strong>SAC (Sistema de Amortização Constante)</strong>, a parcela de amortização do saldo devedor é fixa
          e os juros diminuem mês a mês — por isso a parcela total começa mais alta e vai caindo ao longo do contrato.
          No <strong>Price (Tabela Price)</strong>, a parcela total é fixa do início ao fim, mas no começo você paga
          proporcionalmente mais juros e menos amortização. Resultado: o SAC tem <strong>custo total menor</strong>,
          mas exige uma renda inicial maior para aprovar o financiamento; o Price facilita a aprovação por ter parcelas
          menores no início, porém custa mais caro ao final do contrato.
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          A simulação acima calcula a tabela completa de ambos os sistemas, parcela a parcela, para que você compare
          o <strong>custo total</strong>, a <strong>evolução das parcelas</strong> e o <strong>saldo devedor</strong> em
          cada mês — sem depender de planilhas.
        </p>
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Por que o consórcio raramente compensa</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          O consórcio não cobra juros, mas cobra uma <strong>taxa de administração</strong> (geralmente entre 15% e 25%
          do valor da carta, diluída nas parcelas) e aplica <strong>reajuste anual</strong> pelo INCC ou IPCA sobre o
          saldo devedor — o que aumenta o valor das parcelas restantes todos os anos. Além disso, você só recebe o bem
          quando for <strong>contemplado por sorteio ou lance</strong>, podendo levar anos. Em praticamente todos os
          cenários simulados, o custo efetivo total do consórcio fica próximo — ou acima — do financiamento via SAC,
          sem a vantagem de ter o bem disponível imediatamente.
        </p>
      </div>

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
