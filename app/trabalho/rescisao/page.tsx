import type { Metadata } from 'next'
import { RescissionCalculator } from '@/components/calculators/RescissionCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Calculadora de Rescisão de Contrato CLT — Proventos e Descontos',
  description: 'Simulador completo e detalhado de rescisão de contrato de trabalho sob regime CLT. Calcule saldo de salário, férias proporcionais, 13º proporcional e multa do FGTS.',
  openGraph: {
    title: 'Simulador de Rescisão Trabalhista CLT — A Ponta do Lápis',
    description: 'Projete detalhadamente todos os proventos e descontos da sua demissão, incluindo aviso prévio e multa do FGTS. Sem cadastro.',
    url: 'https://apontadolapis.com.br/trabalho/rescisao',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/trabalho/rescisao' },
}

export default function RescisaoPage() {
  return (
    <div className="space-y-6">
      
      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          TRABALHO · DIREITOS CLT
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Simulador de rescisão de<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>contrato de trabalho.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Calcular os direitos da demissão não precisa ser um mistério de planilhas complexas ou termos inacessíveis.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Veja de forma clara e detalhada cada provento de férias, 13º salário e aviso prévio devidos, além da retenção progressiva de INSS e IRRF sobre a sua rescisão.</strong>{' '}
          Sem taxas, sem cadastro. Apenas os números.
        </p>
      </div>

      <RescissionCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como Funciona a Rescisão sob Regime CLT</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Os direitos e descontos de um desligamento trabalhista no Brasil variam drasticamente conforme o <strong>motivo da rescisão</strong>. A demissão sem justa causa pelo empregador é a modalidade mais abrangente em termos de garantias ao trabalhador, enquanto o pedido de demissão voluntária ou a demissão por justa causa removem diversos proventos importantes.
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          A Reforma Trabalhista (Lei 13.467/2017) introduziu também a <strong>rescisão por comum acordo</strong>, na qual o trabalhador tem direito a sacar 80% do saldo do FGTS, recebe metade da multa rescisória (20%) e metade do aviso prévio indenizado correspondente, mas abre mão de ingressar no programa de Seguro-Desemprego.
        </p>
      </div>

      <SourcesFooter sources={[
        { label: 'Consolidação das Leis do Trabalho (CLT) — Decreto-Lei Nº 5.452 sobre rescisão contratual', url: 'http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm' },
        { label: 'Lei Nº 12.506/2011 — Dispõe sobre o aviso prévio proporcional ao tempo de serviço', url: 'http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12506.htm' },
        { label: 'Ministério do Trabalho e Emprego — Cartilha de direitos do trabalhador demitido', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/direitos-trabalhistas' },
      ]} />
      
      <AppCTA context="seu planejamento de carreira e finanças pessoais" />
    </div>
  )
}
