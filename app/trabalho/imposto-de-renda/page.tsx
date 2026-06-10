import type { Metadata } from 'next'
import { IRPFCalculator } from '@/components/calculators/IRPFCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Calculadora de Imposto de Renda 2026 — IRPF com Lei dos 5 Mil',
  description: 'Calcule quanto você paga de IR em 2026 com a tabela progressiva atualizada e a Lei dos 5 Mil (Lei 15.270/2025). Veja a alíquota efetiva, detalhamento por faixas e projeção anual.',
  openGraph: {
    title: 'Calculadora IRPF 2026 — A Ponta do Lápis',
    description: 'Tabela progressiva 2026 com Lei dos 5 Mil. Calcule IR mensal, alíquota efetiva e quanto você recebe líquido. Sem cadastro.',
    url: 'https://apontadolapis.com.br/trabalho/imposto-de-renda',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/trabalho/imposto-de-renda' },
}

export default function ImpostoDeRendaPage() {
  return (
    <div className="space-y-6">

      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          TRABALHO · IMPOSTO DE RENDA
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Quanto você paga de<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>imposto de renda?</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Tabela progressiva do IRPF 2026 com a <strong style={{ color: 'var(--c-ink)' }}>Lei dos 5 Mil (Lei nº 15.270/2025)</strong>.
          Veja o IR mensal, a alíquota efetiva, o detalhamento por faixas e quanto você realmente leva para casa.
          Sem cadastro. 100% no seu navegador.
        </p>
      </div>

      <IRPFCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como funciona a tabela progressiva do IRPF 2026</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          O Imposto de Renda Retido na Fonte (IRRF) é calculado sobre o salário bruto mensal em faixas crescentes.
          Cada real é tributado pela alíquota da sua faixa — não do salário inteiro.
          A <strong>Lei nº 15.270/2025 (Lei dos 5 Mil)</strong> zerou o IR para quem ganha até R$5.000 e criou uma zona de transição
          entre R$5.000 e R$7.350 com um redutor decrescente, suavizando o impacto de cruzar a faixa de isenção.
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          A <strong>alíquota efetiva</strong> é o percentual real pago sobre o salário bruto total — sempre menor que a alíquota marginal
          (da faixa mais alta atingida), porque as faixas inferiores pagam menos ou nada.
          Uma calculadora de IRPF correta precisa calcular faixa por faixa e depois subtrair o redutor da Lei dos 5 Mil.
        </p>
      </div>

      <SourcesFooter sources={[
        { label: 'Lei nº 15.270/2025 (Lei dos 5 Mil) — Presidência da República', url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/L15270.htm' },
        { label: 'Tabela Progressiva IRPF 2026 — Receita Federal do Brasil', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026' },
        { label: 'Instrução Normativa RFB nº 2.178/2024 — Retenção do IRRF na fonte', url: 'https://www.gov.br/receitafederal/pt-br' },
      ]} />

      <AppCTA context="seu planejamento tributário e financeiro" />
    </div>
  )
}
