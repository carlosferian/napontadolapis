import type { Metadata } from 'next'
import { EmergencyFundCalculator } from '@/components/calculators/EmergencyFundCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Calculadora de Reserva de Emergência — Quanto Guardar e Onde',
  description: 'Calcule sua meta de reserva de emergência, veja em quanto tempo você chega lá e onde manter o dinheiro com liquidez e segurança. Sem cadastro.',
  openGraph: {
    title: 'Calculadora de Reserva de Emergência — A Ponta do Lápis',
    description: 'Meta personalizada (3, 6 ou 12 meses), prazo com e sem Selic, e guia de onde guardar com liquidez imediata.',
    url: 'https://apontadolapis.com.br/investimentos/reserva-de-emergencia',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/investimentos/reserva-de-emergencia' },
}

export default function ReservaDeEmergenciaPage() {
  return (
    <div className="space-y-6">

      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          INVESTIMENTOS · PROTEÇÃO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Quanto você precisa de<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>reserva de emergência?</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          A reserva de emergência é o <strong style={{ color: 'var(--c-ink)' }}>primeiro passo de qualquer planejamento financeiro</strong>.
          Veja sua meta personalizada, em quanto tempo você chega lá investindo na Selic e onde manter o dinheiro
          com liquidez imediata. Sem cadastro.
        </p>
      </div>

      <EmergencyFundCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Quantos meses de reserva você precisa?</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          O tamanho ideal da reserva depende da <strong>estabilidade da sua renda</strong>.
          Para trabalhadores CLT com emprego estável, <strong>3 a 6 meses</strong> de gastos costumam ser suficientes.
          Para autônomos, freelancers ou quem tem renda variável, <strong>6 a 12 meses</strong> é o recomendado pela maioria dos planejadores financeiros —
          porque o tempo médio para encontrar uma nova fonte de renda costuma ser maior.
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          A regra básica é simples: some todos os seus gastos mensais essenciais (aluguel, alimentação, contas, transporte)
          e multiplique pelo número de meses de cobertura desejados. Esse é o seu alvo.
          A reserva deve ficar em produtos com <strong>liquidez diária ou D+1</strong> — Tesouro Selic ou CDB com liquidez diária são as melhores opções.
        </p>
      </div>

      <SourcesFooter sources={[
        { label: 'Banco Central do Brasil — Caderno de Educação Financeira: Gestão de Finanças Pessoais', url: 'https://www.bcb.gov.br/nor/relefin/Caderno_de_Educacao_Financeira_Gestao_de_Financas_Pessoais.pdf' },
        { label: 'Tesouro Nacional — Tesouro Selic: características e como investir', url: 'https://www.tesourodireto.com.br/titulos/tipos-de-tesouro/tesouro-selic.htm' },
        { label: 'FGC — Fundo Garantidor de Créditos: garantias para CDB e outros', url: 'https://www.fgc.org.br' },
      ]} />

      <AppCTA context="seu planejamento financeiro e reserva de emergência" />
    </div>
  )
}
