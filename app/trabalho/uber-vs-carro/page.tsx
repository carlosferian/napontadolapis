import type { Metadata } from 'next'
import { UberCarCalculator } from '@/components/calculators/UberCarCalculator'
import { AppCTA }            from '@/components/AppCTA'
import { SourcesFooter }     from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Uber vs. Carro Próprio — Qual realmente compensa?',
  description: 'Compare o custo total real de ter um carro próprio com usar Uber e transporte público. Inclui depreciação, seguro, IPVA, custo de oportunidade e projeção de 5 anos.',
  openGraph: {
    title: 'Uber vs. Carro Próprio — A Ponta do Lápis',
    description: 'O carro parece barato — até você ver a conta completa.',
    url: 'https://apontadolapis.com.br/trabalho/uber-vs-carro',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/trabalho/uber-vs-carro' },
}

export default function UberVsCarroPage() {
  return (
    <div className="space-y-6">

      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          TRANSPORTE · CUSTO REAL
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          O carro parece barato.<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>Até você ver a conta completa.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 580 }}>
          A maioria das pessoas compara o Uber com o{' '}
          <strong style={{ color: 'var(--c-ink)' }}>combustível</strong> — e esquece depreciação,
          seguro, IPVA, manutenção e o custo de oportunidade do capital parado no veículo.
          Esta calculadora faz a conta completa.
        </p>
      </div>

      <UberCarCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">O verdadeiro custo de ter um carro</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Quando alguém calcula "quanto custa meu carro por mês", quase sempre soma só{' '}
          <strong>combustível e estacionamento</strong>. Mas o Custo Total de Propriedade (TCO) inclui também{' '}
          <strong>depreciação</strong> (o carro perde valor todo ano, mesmo parado), <strong>seguro</strong>,{' '}
          <strong>IPVA e licenciamento</strong>, <strong>manutenção preventiva</strong> e o{' '}
          <strong>custo de oportunidade</strong> — o quanto o dinheiro investido no carro renderia se estivesse
          aplicado na Selic ou CDI em vez de parado em um ativo que desvaloriza.
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          A calculadora acima soma todos esses fatores e projeta o custo mensal real ao longo de <strong>5 anos</strong>,
          comparando com o gasto equivalente em <strong>Uber/99</strong> e <strong>transporte público</strong> para a
          mesma rotina de deslocamentos. Em muitos casos, principalmente para quem roda pouco (até 500–800 km/mês),
          o carro próprio custa significativamente mais do que parece — e o ponto de equilíbrio (break-even) só
          aparece para quem realmente depende do veículo diariamente.
        </p>
      </div>

      <SourcesFooter sources={[
        { label: 'FIPE — Tabela de Preços e Índice de Depreciação de Veículos', url: 'https://veiculos.fipe.org.br/' },
        { label: 'ANP — Preços dos Combustíveis no Brasil (Série Histórica)', url: 'https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/serie-historica-de-precos-de-combustiveis' },
        { label: 'BCB — Taxa Selic vigente', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
        { label: 'Susep — Referência para cálculo de seguros de automóveis no Brasil', url: 'https://www.gov.br/susep/pt-br' },
      ]} />

      <AppCTA context="seu custo de transporte" />
    </div>
  )
}
