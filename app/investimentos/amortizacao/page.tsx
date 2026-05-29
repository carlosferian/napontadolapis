import type { Metadata } from 'next'
import { AmortizationCalculator } from '@/components/calculators/AmortizationCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Calculadora de Amortização de Financiamento — SAC vs Price com Aporte Extra',
  description: 'Simule como quitar seu financiamento imobiliário ou de veículo anos mais cedo. Compare o Sistema SAC com a Tabela Price e veja a economia de juros reais ao fazer amortizações extraordinárias.',
  openGraph: {
    title: 'Calculadora de Amortização de Financiamento — A Ponta do Lápis',
    description: 'Projete o poder das amortizações extras mensais e corte anos de boletos do seu banco.',
    url: 'https://apontadolapis.com.br/investimentos/amortizacao',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/investimentos/amortizacao' },
}

export default function AmortizationPage() {
  return (
    <div className="space-y-8">
      
      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex', backgroundColor: 'var(--c-emerald-soft)', color: 'var(--c-emerald)' }}>
          CRESCER · FINANCIAMENTO INTELIGENTE
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Derrube os juros do seu<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>financiamento imobiliário.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Assuma o controle da sua dívida.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Insira as condições do seu contrato, simule aportes adicionais mensais e assista à eliminação dos juros e meses de cobrança do banco.</strong>{' '}
          A matemática exata do seu saldo devedor, sem enrolação.
        </p>
      </div>

      <AmortizationCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-6">
        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como funciona a quitação antecipada por amortização?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            No Brasil, a Lei Federal nº 8.078 (Código de Defesa do Consumidor) assegura a todo cidadão o direito de quitar antecipadamente seus débitos, total ou parcialmente, mediante **redução proporcional dos juros**. Quando você realiza um pagamento extraordinário (amortização extra), esse montante não é utilizado para quitar parcelas futuras ordinárias; em vez disso, ele é subtraído **diretamente do seu saldo devedor principal**. Como os juros mensais incidem apenas sobre o saldo devedor restante, diminuir essa base faz com que o custo total de juros do contrato encolha dramaticamente a partir daquele mês.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">SAC vs. Tabela Price: Qual escolher?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            A escolha do sistema de amortização influi diretamente na velocidade de decaimento do saldo devedor:
          </p>
          <ul className="list-disc pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-1">
            <li><strong>SAC (Sistema de Amortização Constante):</strong> A amortização é igual em todos os meses. Como o saldo devedor cai de forma constante e rápida, os juros diminuem agressivamente a cada período, fazendo com que as prestações comecem mais altas e caiam mês a mês. **É o sistema financeiramente mais eficiente**, resultando em menos juros totais ao final do contrato.</li>
            <li><strong>Tabela Price (Sistema Francês):</strong> As prestações são fixas do início ao fim do financiamento. Nos primeiros anos, quase a totalidade da parcela serve para cobrir os juros do banco, e pouquíssimo dinheiro é usado para de fato reduzir a dívida. Embora facilite o orçamento inicial por começar menor que a prestação do SAC, **a Price acumula muito mais juros no longo prazo**.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Reduzir Prazo ou Reduzir Parcela?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Ao fazer uma amortização extraordinária no banco, você poderá escolher entre duas estratégias de aplicação do saldo:
          </p>
          <ul className="list-disc pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-1">
            <li><strong>Reduzir o Prazo (Recomendado):</strong> Mantém o valor das prestações atuais e reduz o número de parcelas restantes. Como a dívida é quitada mais rapidamente, o efeito dos juros compostos no tempo é cortado pela raiz, gerando a maior economia financeira possível.</li>
            <li><strong>Reduzir o Valor da Parcela:</strong> Mantém o prazo original em anos, mas recalcula as parcelas mensais para baixo. É excelente para desafogar o orçamento mensal caso ocorra uma perda temporária de renda ou aumento de despesas familiares fixas.</li>
          </ul>
        </div>
      </div>

      <SourcesFooter sources={[
        { label: 'Banco Central do Brasil — Resolução CMN nº 3.516 (Direito à liquidação antecipada)', url: 'https://www.bcb.gov.br/' },
        { label: 'Caixa Econômica Federal — Guia Prático de Habitação e Amortizações Extras', url: 'https://www.caixa.gov.br/' },
        { label: 'Planalto — Artigo 52 do Código de Defesa do Consumidor (Abatimento proporcional de juros)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm' }
      ]} />
      
      <AppCTA context="sua amortização e quitação de financiamento" />
    </div>
  )
}
