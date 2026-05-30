import type { Metadata } from 'next'
import { RotativoCalculator } from '@/components/calculators/RotativoCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Simulador Fuga do Rotativo — Troca Segura de Dívida',
  description: 'Descubra como quitar sua fatura atrasada trocando os juros abusivos do rotativo do cartão de crédito por um empréstimo pessoal ou consignado de baixo custo. Economize milhares de reais.',
  openGraph: {
    title: 'Simulador de Troca Segura de Dívida (Fuga do Rotativo) — A Ponta do Lápis',
    description: 'A matemática da liberdade financeira: calcule a economia real de juros e prazo ao consolidar dívidas caras de cartão de crédito no empréstimo sustentável.',
    url: 'https://apontadolapis.com.br/investimentos/fuga-do-rotativo',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/investimentos/fuga-do-rotativo' },
}

export default function FugaRotativoPage() {
  return (
    <div className="space-y-6">
      
      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex', backgroundColor: 'var(--c-emerald-soft)', color: 'var(--c-emerald)' }}>
          SAÚDE FINANCEIRA · ESCAPE DO ROTATIVO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Descubra a rota de fuga<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>dos juros do cartão.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Pagar apenas o mínimo ou deixar a fatura acumular a juros do rotativo é o caminho mais rápido para a inadimplência familiar.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Insira a sua dívida do cartão de crédito, a parcela mensal que você consegue pagar, e compare instantaneamente os custos de acumular juros do rotativo contra a contratação de um empréstimo saudável de troca.</strong>
        </p>
      </div>

      <RotativoCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">A Armadilha dos Juros do Rotativo do Cartão</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Os juros do cartão de crédito rotativo no Brasil figuram historicamente entre as taxas mais elevadas do planeta, superando com frequência **400% ao ano** ou **14% ao mês**. Sob essa taxa, uma dívida inicial de R$ 5.000 se transforma em mais de R$ 25.000 em apenas 12 meses caso não receba novos pagamentos.
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          <strong>A Espiral Infinita da Dívida:</strong>
          Se o valor da parcela mensal que o usuário consegue quitar for menor do que os juros gerados pela dívida no período, o saldo devedor cresce indefinidamente mesmo com pagamentos mensais ativos. É a famosa "espiral de endividamento".
        </p>
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">A Estratégia de Consolidação de Dívidas (Troca de Passivos)</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          A consolidação ou substituição de dívidas caras por baratas é um dos pilares da reabilitação financeira:
        </p>
        <ul className="text-stone-500 dark:text-stone-400 text-sm list-disc pl-5 space-y-1">
          <li>
            <strong>Amortização Suave</strong>: Linhas de crédito como empréstimos consignados (descontados em folha) ou com garantia real (de veículo ou imóvel) possuem juros médios que variam de 2% a 4% ao mês no Brasil.
          </li>
          <li>
            <strong>Economia Imediata</strong>: Ao contrair esse empréstimo sustentável, quitar integralmente o saldo devedor do cartão de crédito e focar no pagamento das novas parcelas fixas, você interrompe o crescimento exponencial e garante a liquidação total em um prazo finito predefinido.
          </li>
        </ul>
      </div>

      <SourcesFooter sources={[
        { label: 'Associação Brasileira das Empresas de Cartões de Crédito (ABECS)', url: 'https://www.abecs.org.br/' },
        { label: 'Banco Central do Brasil — Relatório de Economia Bancária', url: 'https://www.bcb.gov.br/' },
        { label: 'Defensoria Pública — Orientação sobre Superendividamento', url: 'https://www.dpu.def.br/' },
      ]} />
      
      <AppCTA context="seu saneamento financeiro e fuga sustentável dos juros do cartão" />
    </div>
  )
}
