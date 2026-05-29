import type { Metadata } from 'next'
import { OddsCalculator } from '@/components/calculators/OddsCalculator'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Qual é a chance real de ganhar na bet? Calculadora de probabilidades',
  description: 'Descubra qual é sua chance matemática real de lucrar com apostas esportivas. A casa não é burra — veja os números.',
  openGraph: {
    title: 'Probabilidades Reais — A Ponta do Lápis',
    description: 'A casa não é burra. Veja os números.',
    url: 'https://apontadolapis.com.br/apostas/probabilidades',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/apostas/probabilidades' },
}

export default function ProbabilidadesPage() {
  return (
    <div className="space-y-8">

      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          MATEMÁTICA · ODDS
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          A matemática crua<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>de ganhar na bet.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Cada odd tem uma margem matemática garantida — a diferença entre a probabilidade implícita
          e a realidade. Em média{' '}
          <strong style={{ color: 'var(--c-ink)' }}>5% a 7% de margem para a casa</strong>,
          independente do resultado.
          A gente não vai te dizer pra não apostar. Mas vai mostrar a conta.
        </p>
      </div>

      <OddsCalculator />

      <div className="space-y-5 text-sm text-stone-500 leading-relaxed border-t border-stone-200 pt-8">
        <h2 className="text-base font-semibold text-stone-700">Como a matemática funciona</h2>

        <p>
          Toda odd embute uma <strong className="text-stone-600">margem para a casa</strong> — a diferença entre a
          probabilidade implícita (1 ÷ odd) e a probabilidade real do evento. Num mercado de duas opções (vitória
          ou derrota), se a casa oferecer odd 1.90 para os dois lados, cada lado implica 52,6% de probabilidade.
          Somados, dão 105,2% — os 5,2% extras são o lucro garantido da casa, independente do resultado.
        </p>

        <p>
          A chance de estar no lucro após muitas apostas é calculada pelo{' '}
          <strong className="text-stone-600">Teorema do Limite Central</strong>: à medida que o número de apostas
          cresce, a distribuição dos resultados se aproxima de uma curva normal centrada no valor esperado.
          Como o valor esperado é negativo para o apostador, a probabilidade de lucro converge para zero com o tempo.
        </p>

        <SourcesFooter sources={[
          { label: 'Wikipedia — Valor Esperado (Estatística e expectativa matemática)', url: 'https://pt.wikipedia.org/wiki/Valor_esperado' },
          { label: 'Wikipedia — Teorema Central do Limite (Base de probabilidade de retornos)', url: 'https://pt.wikipedia.org/wiki/Teorema_central_do_limite' },
          { label: 'Banco Central do Brasil — Impacto das apostas esportivas nas finanças familiares', url: 'https://www.bcb.gov.br/estabilidadefinanceira/apostasesportivas' }
        ]} />

        <p className="text-xs text-stone-400">
          Os cálculos assumem apostas simples (não acumuladas) com probabilidade implícita igual a 1 ÷ odd.
          Mercados reais possuem margens maiores — as odds aqui são cenários didáticos.
          Rentabilidade passada não garante resultados futuros.
        </p>
      </div>
    </div>
  )
}
