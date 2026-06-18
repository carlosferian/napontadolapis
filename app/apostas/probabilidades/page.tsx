import type { Metadata } from 'next'
import { OddsCalculator } from '@/components/calculators/OddsCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { FAQ } from '@/components/ui/FAQ'

export const metadata: Metadata = {
  title: 'Probabilidades Reais das Apostas — Calculadora de Odds e Margem da Casa',
  description: 'Descubra a probabilidade implícita de uma odd, a margem retida pela casa e a chance real de lucro após 10, 100 ou 1.000 apostas. A matemática crua, sem ilusão.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Probabilidades Reais das Apostas — A Ponta do Lápis',
    description: 'A casa não é burra. Veja a matemática por trás de qualquer odd.',
    url: 'https://apontadolapis.com.br/apostas/probabilidades',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/apostas/probabilidades' },
}

export default function ProbabilidadesPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          APOSTAS · MATEMÁTICA
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Qual sua chance real<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>de ganhar?</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Escolha uma odd e veja a <strong style={{ color: 'var(--c-ink)' }}>probabilidade implícita</strong>,
          a margem retida pela casa e a chance real de terminar no lucro depois de 10, 50, 100, 500 ou 1.000 apostas.
          Sem ilusão, só a matemática.
        </p>
      </div>

      <OddsCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como calculamos a probabilidade implícita</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Toda odd decimal embute uma probabilidade: <strong>probabilidade ≈ 1 ÷ odd</strong>. Uma odd de 2,0 sugere
          50% de chance; uma odd de 1,5 sugere cerca de 66,7%. Mas as casas de apostas ajustam essas odds para somar
          mais de 100% entre todos os resultados possíveis — essa diferença é a margem (ou "overround") que garante
          o lucro da casa, independente do resultado da partida.
        </p>
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Por que repetir a aposta piora suas chances</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Em uma única aposta, até é possível ter uma probabilidade razoável de lucro. Mas cada rodada repete a mesma
          desvantagem matemática — e probabilidades desfavoráveis compostas ao longo de centenas de apostas convergem
          rapidamente para a perda quase certa. É o mesmo princípio dos juros compostos, só que trabalhando contra o apostador.
        </p>
      </div>

      <FAQ items={[
        {
          question: 'Uma odd de 2,0 significa 50% de chance de ganhar?',
          answer: 'Não exatamente. 1 ÷ 2,0 = 50% é a probabilidade implícita "crua", mas as casas de apostas ajustam as odds para que a soma das probabilidades de todos os resultados passe de 100%. Na prática, a chance real de você ganhar é um pouco menor que a probabilidade implícita sugere.',
        },
        {
          question: 'Existe alguma odd em que vale a pena apostar repetidamente?',
          answer: 'Matematicamente, não — toda odd oferecida por uma casa de apostas já embute a margem da casa. Mesmo em odds "equilibradas" (próximas de 2,0), repetir a aposta centenas de vezes reduz drasticamente a probabilidade de terminar no lucro, por mais favorável que a odd individual pareça.',
        },
        {
          question: 'Essa calculadora usa dados de apostas reais?',
          answer: 'Não. É uma ferramenta educativa que aplica a matemática de probabilidade e valor esperado sobre odds hipotéticas que você escolhe — sem conexão com casas de apostas, sem dinheiro real e sem coleta de dados.',
        },
      ]} />

      <SourcesFooter sources={[
        { label: 'Banco Central do Brasil — Apostas Esportivas e impacto no orçamento das famílias', url: 'https://www.bcb.gov.br/estabilidadefinanceira/apostasesportivas' },
        { label: 'Wikipedia — Probabilidade implícita e margem da casa (overround)', url: 'https://en.wikipedia.org/wiki/Overround' },
      ]} />

      <AppCTA context="esse gasto" />
    </div>
  )
}
