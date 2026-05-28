import type { Metadata } from 'next'
import { BetsCalculator } from '@/components/calculators/BetsCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Calculadora de Gastos com Apostas — Quanto você gasta com bets?',
  description: 'Descubra quanto você realmente gasta com apostas esportivas e o que esse dinheiro renderia investido. Sem julgamento, só os números.',
  openGraph: {
    title: 'Calculadora de Apostas — A Ponta do Lápis',
    description: 'os números não mentem. a gente só mostra eles.',
    url: 'https://apontadolapis.com.br/apostas',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/apostas' },
}

export default function ApostasPage() {
  return (
    <div className="space-y-6">

      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          APOSTAS · HÁBITOS
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          A casa não é burra.<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>Mas você pode ser mais esperto.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          A indústria de apostas brasileira movimentou{' '}
          <strong style={{ color: 'var(--c-ink)' }}>R$ 130 bilhões em 2024</strong>.
          Cada odd tem uma margem matemática garantida — em média 5% a 7%.{' '}
          <em>Você está pagando isso tudo.</em> Veja os números abaixo.
        </p>
      </div>

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

      <SourcesFooter sources={[
        { label: 'Banco Central do Brasil — Apostas Esportivas e impacto no orçamento das famílias', url: 'https://www.bcb.gov.br/estabilidadefinanceira/apostasesportivas' },
        { label: 'BCB — Sistema de Metas de Inflação e taxa Selic vigente', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
        { label: 'Receita Federal — Tabela regressiva de IR sobre rendimentos de renda fixa', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/irrf' },
        { label: 'Wikipedia — Juros compostos: fórmula e aplicações', url: 'https://pt.wikipedia.org/wiki/Juro_composto' },
      ]} />
      <AppCTA context="esse gasto" />
    </div>
  )
}
