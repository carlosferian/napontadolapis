import type { Metadata } from 'next'
import { SmokeCalculator } from '@/components/calculators/SmokeCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Quanto custa fumar ou vapear? Calculadora do custo real do cigarro e vape',
  description: 'Calcule quanto você gasta por mês com cigarro ou vape e o que esse dinheiro renderia investido na Selic em 10 ou 30 anos. Sem moralismo. Só a conta.',
  openGraph: {
    title: 'Custo do Fumo — Na Ponta do Lápis',
    description: 'Sem moralismo. Só a conta.',
    url: 'https://apontadolapis.com.br/fumo',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/fumo' },
}

export default function FumoPage() {
  return (
    <div className="space-y-6">

      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          CIGARRO · VAPE · HÁBITOS
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          A conta que<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>ninguém faz.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Você acabou de fazer um cálculo dizendo que gasta R$ 800 por mês com cigarro.
          Imagina o que uma seguradora faria com essa informação.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Aqui, isso não vai acontecer.</strong>{' '}
          Os cálculos rodam no seu navegador. Veja o preço real do hábito.
        </p>
      </div>

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
