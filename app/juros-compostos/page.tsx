import type { Metadata } from 'next'
import { CompoundInterestCalculator } from '@/components/calculators/CompoundInterestCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { FAQ } from '@/components/ui/FAQ'

export const metadata: Metadata = {
  title: 'Calculadora de Juros Compostos — Simule seu crescimento patrimonial',
  description: 'Simulador completo de juros compostos: projete a evolução dos seus aportes mensais, compare com poupança e entenda o efeito exponencial no tempo. Sem cadastro.',
  openGraph: {
    title: 'Simulador de Juros Compostos — A Ponta do Lápis',
    description: 'Projete o poder dos juros compostos e o efeito bola de neve no tempo.',
    url: 'https://apontadolapis.com.br/juros-compostos',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/juros-compostos' },
}

export default function CompoundInterestPage() {
  return (
    <div className="space-y-6">
      
      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          CRESCER · SIMULAÇÃO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          O poder exponencial dos<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>juros compostos.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Coloque os números a seu favor.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Projete os aportes mensais, escolha a taxa efetiva (mensal ou anual) e simule a bola de neve temporal.</strong>{' '}
          Sem taxas camufladas, sem ofertas de fundos de investimento com comissões ocultas. Apenas a matemática pura.
        </p>
      </div>

      <CompoundInterestCalculator />

      <div className="prose prose-sm prose-stone max-w-none">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Entendendo a matemática dos juros compostos</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Diferente dos juros simples (onde a taxa incide apenas sobre o valor principal inicial), os juros compostos incidem sobre o montante acumulado do período anterior — ou seja, <strong className="text-stone-600 dark:text-stone-300">juros sobre juros</strong>.
          À medida que o tempo passa, a curva de crescimento deixa de ser linear e assume um comportamento exponencial. É o efeito conhecido como "bola de neve", no qual, em prazos mais longos, o rendimento em juros supera significativamente o somatório total de todo o dinheiro investido mensalmente pelo próprio poupador.
        </p>
      </div>

      <FAQ items={[
        {
          question: 'Qual a diferença entre juros simples e juros compostos?',
          answer: 'Nos juros simples, a taxa incide sempre sobre o valor original aplicado. Nos juros compostos, a taxa incide sobre o saldo acumulado (principal + juros já ganhos), gerando "juros sobre juros" — o que faz o crescimento ser exponencial e não linear ao longo do tempo.',
        },
        {
          question: 'Aportes mensais fazem diferença real no resultado final?',
          answer: 'Sim, e muito. Aportes mensais constantes, somados ao efeito composto, costumam representar a maior parte do patrimônio final em simulações de longo prazo — mais até do que o valor inicial investido, especialmente em horizontes acima de 10-15 anos.',
        },
        {
          question: 'Devo usar a taxa mensal ou anual na simulação?',
          answer: 'Use a taxa que corresponde ao seu investimento real (ex: CDBs costumam divulgar a taxa anual, enquanto alguns fundos informam a taxa mensal). A calculadora converte automaticamente entre as duas, mas o resultado é mais preciso quando você usa a taxa efetiva informada pela instituição financeira.',
        },
      ]} />

      <SourcesFooter sources={[
        { label: 'CVM — Comissão de Valores Mobiliários (Educação Financeira)', url: 'https://www.investidor.gov.br/' },
        { label: 'B3 — Bolsa de Valores do Brasil (Simulação e Projeção Patrimonial)', url: 'https://www.b3.com.br/pt_br/dados/indices/indices-de-segmento/' },
        { label: 'BACEN — Fórmulas e Critérios da calculadora cidadã de juros compostos', url: 'https://www3.bcb.gov.br/CALCID/publico/exibirFormAplicacaoValorFuturo.do?method=exibirFormAplicacaoValorFuturo' },
      ]} />
      
      <AppCTA context="seu planejamento de longo prazo e juros compostos" />
    </div>
  )
}
