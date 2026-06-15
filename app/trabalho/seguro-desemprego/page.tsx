import type { Metadata } from 'next'
import { UnemploymentCalculator } from '@/components/calculators/UnemploymentCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Calculadora de Seguro-Desemprego 2026 — Planejador de Pista Financeira',
  description: 'Simulador completo de Seguro-Desemprego reajustado em 2026 com planejador de sobrevivência financeira (runway) pós-rescisão. Veja se tem direito e planeje o fôlego da reserva.',
  openGraph: {
    title: 'Calculadora de Seguro-Desemprego & Pista Financeira 2026 — A Ponta do Lápis',
    description: 'Calcule seu benefício com as tabelas de 2026 e projete exatamente quantos meses você sobrevive sem um novo emprego.',
    url: 'https://apontadolapis.com.br/trabalho/seguro-desemprego',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/trabalho/seguro-desemprego' },
}

export default function SeguroDesempregoPage() {
  return (
    <div className="space-y-6">
      
      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          TRABALHO · TRANSIÇÃO PROFISSIONAL
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Seguro-Desemprego 2026 e<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>pista de sobrevivência.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Descobrir quanto vai receber de seguro-desemprego é apenas o primeiro passo.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>O mais importante é saber quanto tempo de pista financeira (runway) real você tem para encontrar sua próxima recolocação com calma.</strong>{' '}
          Calcule seu direito com a tabela oficial de 2026 e planeje sua transição profissional sem desespero.
        </p>
      </div>

      <UnemploymentCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">As Regras de Elegibilidade e Valores em 2026</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Com a entrada em vigor dos novos valores em 11 de janeiro de 2026, a parcela mínima do seguro-desemprego foi fixada em <strong>R$ 1.621,00</strong> (equivalente ao salário mínimo nacional reajustado), e o teto máximo de pagamento por parcela passou a ser de <strong>R$ 2.518,65</strong>.
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Para ter direito, além de ter sido demitido sem justa causa de um regime CLT, você precisa preencher o tempo mínimo trabalhado de acordo com a ordem da solicitação:
        </p>
        <ul className="text-stone-500 dark:text-stone-400 text-sm list-disc pl-5 space-y-1">
          <li><strong>1ª solicitação na vida:</strong> Ter trabalhado no mínimo 12 meses nos últimos 18 meses anteriores à data de dispensa.</li>
          <li><strong>2ª solicitação na vida:</strong> Ter trabalhado no mínimo 9 meses nos últimos 12 meses anteriores à data de dispensa.</li>
          <li><strong>3ª solicitação em diante:</strong> Ter trabalhado no mínimo 6 meses consecutivos imediatamente anteriores à dispensa.</li>
        </ul>
      </div>

      <SourcesFooter sources={[
        { label: 'Ministério do Trabalho e Emprego (MTE) — Nova Tabela de Seguro-Desemprego 2026', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/noticias/tabela-seguro-desemprego-reajustada-2026' },
        { label: 'MTE — Instruções de solicitação do Seguro-Desemprego Digital', url: 'https://www.gov.br/pt-br/servicos/solicitar-o-seguro-desemprego' },
        { label: 'Decreto Federal — Reajuste do Salário Mínimo e INPC acumulado', url: 'https://www.in.gov.br/web/dou/-/decreto-salario-minimo-vigente' },
      ]} />
      
      <AppCTA context="sua transição de carreira e controle financeiro" />
    </div>
  )
}
