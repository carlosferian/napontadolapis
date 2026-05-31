import type { Metadata } from 'next'
import { IncomePageTabs } from '@/components/IncomePageTabs'
import { AppCTA }         from '@/components/AppCTA'
import { SourcesFooter }  from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Calculadora Viver de Renda — Planejador de Independência Financeira',
  description: 'Simulador dinâmico e inteligente para planejar a independência financeira. Descubra o capital necessário, taxa de juros ou tempo de duração para viver de renda passiva. Sem cadastro.',
  openGraph: {
    title: 'Simulador Viver de Renda & Independência Financeira — A Ponta do Lápis',
    description: 'Um planejador multi-direcional inteligente: ajuste o patrimônio, a retirada ou o tempo, e veja a curva de desgaste ou perpetuidade em tempo real.',
    url: 'https://apontadolapis.com.br/investimentos/viver-de-renda',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/investimentos/viver-de-renda' },
}

export default function ViverDeRendaPage() {
  return (
    <div className="space-y-6">
      
      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          CRESCER · INDEPENDÊNCIA FINANCEIRA
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Simulador inteligente para<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>viver de renda passiva.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Planejar a aposentadoria com base em investimentos exige flexibilidade.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Esta calculadora multi-direcional permite que você altere qualquer um dos quatro campos (Capital, Retirada, Juros ou Tempo) e deduz a variável faltante automaticamente</strong>, prevenindo contradições matemáticas e indicando se o seu patrimônio é perpétuo ou finito.
        </p>
      </div>

      <IncomePageTabs />

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">A Matemática do Viver de Renda: Perpetuidade vs. Consumo</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Existem duas formas básicas de planejar a retirada de recursos na aposentadoria financeira:
        </p>
        <ul className="text-stone-500 dark:text-stone-400 text-sm list-disc pl-5 space-y-1">
          <li>
            <strong>Retirada Perpétua (Renda Infinita):</strong> Ocorre quando o valor que você retira mensalmente é **menor ou igual aos juros gerados** pelo capital no mesmo período. Dessa forma, seu patrimônio líquido nunca encolhe — pelo contrário, continua crescendo ou se mantendo estável, protegendo-se da inflação e acumulando herança perpétua.
          </li>
          <li>
            <strong>Consumo de Capital (Renda Finita):</strong> Ocorre quando você retira mais do que o patrimônio rende. Mensalmente, uma fração do seu capital principal é vendida ou sacada para cobrir os custos básicos. O capital entra em uma curva de desgaste e irá zerar no ano projetado. É ideal para planos com prazo definido de fruição.
          </li>
        </ul>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          **Dica de Ouro (A Regra dos 4%):** Desenvolvida no estudo acadêmico americano *Trinity Study*, a regra sugere que retirar anualmente 4% do patrimônio acumulado inicial (corrigido pela inflação) dá uma probabilidade de mais de 95% do patrimônio durar por pelo menos 30 anos sem zerar, mesmo sob fortes crises de mercado.
        </p>
      </div>

      <SourcesFooter sources={[
        { label: 'Trinity Study (Estudo de Retirada Sustentável de Investimentos)', url: 'https://en.wikipedia.org/wiki/Trinity_study' },
        { label: 'CVM — Planejamento Financeiro para a Aposentadoria e Renda Fixa', url: 'https://www.investidor.gov.br/' },
        { label: 'Banco Central do Brasil — Poupança, Selic e rentabilidade real', url: 'https://www.bcb.gov.br/' },
      ]} />
      
      <AppCTA context="seu planejamento de renda passiva e liberdade financeira" />
    </div>
  )
}
