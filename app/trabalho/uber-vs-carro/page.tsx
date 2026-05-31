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
