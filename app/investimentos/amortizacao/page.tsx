import type { Metadata } from 'next'
import { AmortizationCalculator } from '@/components/calculators/AmortizationCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { FAQ } from '@/components/ui/FAQ'

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
            No Brasil, a Lei Federal nº 8.078 (Código de Defesa do Consumidor, Artigo 52, § 2º) assegura a todo cidadão o direito de quitar antecipadamente seus débitos, total ou parcialmente, mediante <strong>redução proporcional dos juros e demais acréscimos</strong>. Quando você realiza um pagamento extraordinário (amortização extra), esse montante não é utilizado para quitar parcelas futuras ordinárias; em vez disso, ele é subtraído <strong>diretamente do seu saldo devedor principal</strong>. Como os juros mensais incidem apenas sobre o saldo devedor restante, diminuir essa base faz com que o custo total de juros do contrato encolha dramaticamente a partir daquele mês.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Exemplo Prático: O Impacto Real no Seu Bolso</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Para compreender o poder da amortização extraordinária, imagine um financiamento imobiliário de <strong>R$ 200.000,00</strong> com taxa de juros de <strong>10% a.a. (cerca de 0,8% a.m.)</strong> contratado em <strong>360 meses (30 anos)</strong> pela Tabela Price.
          </p>
          <ul className="list-disc pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>A primeira parcela:</strong> Sua prestação fixa será de aproximadamente <strong>R$ 1.755,00</strong>. No entanto, deste valor, cerca de <strong>R$ 1.600,00 são apenas juros</strong> pagos ao banco pelo aluguel do dinheiro, e míseros <strong>R$ 155,00</strong> são usados para de fato abater a sua dívida de R$ 200 mil.
            </li>
            <li>
              <strong>O aporte extra:</strong> Se no mesmo mês você poupar e realizar uma amortização extraordinária de <strong>R$ 10.000,00</strong> com a opção de <strong>Reduzir o Prazo</strong>, esses R$ 10 mil são deduzidos integralmente da dívida principal (o saldo devedor cai instantaneamente para R$ 189.845,00).
            </li>
            <li>
              <strong>O resultado:</strong> Ao fazer isso, você elimina de uma só vez cerca de <strong>60 parcelas finais</strong> do seu financiamento. Isso ocorre porque você cortou a incidência de juros compostos que incidiriam sobre esses R$ 10.000 ao longo de quase 30 anos. A economia real em juros que deixam de ir para o banco pode ultrapassar <strong>R$ 35.000,00</strong>.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">SAC vs. Tabela Price: A Diferença Matemática</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Os dois sistemas de amortização diferem na velocidade de redução do saldo devedor e na forma de distribuição dos juros ao longo das parcelas:
          </p>
          <div className="space-y-4 mt-3">
            <div>
              <h3 className="text-sm font-bold text-stone-600 dark:text-stone-400">1. Sistema SAC (Amortização Constante)</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                Neste modelo, a parcela de amortização é fixa do primeiro ao último mês. Os juros incidem sobre o saldo restante, que cai rapidamente de forma linear. Como consequência, as parcelas iniciais são mais elevadas, mas decrescem de forma constante a cada mês.
              </p>
              <p className="text-stone-500 dark:text-stone-400 text-xs italic mt-1 font-mono">
                Fórmula de Amortização (A): A = SD₀ / N<br />
                Fórmula da Prestação (P_t) no mês t: P_t = A + (SD_(t-1) × i)
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-600 dark:text-stone-400">2. Tabela Price (Sistema Francês)</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                Neste sistema, todas as parcelas têm valor fixo do início ao fim. Contudo, nas primeiras parcelas, a maior parte do valor serve para pagar juros e uma fatia mínima é usada para amortizar o saldo. À medida que o saldo devedor cai, a proporção se inverte.
              </p>
              <p className="text-stone-500 dark:text-stone-400 text-xs italic mt-1 font-mono">
                Fórmula da Prestação Fixa (P): P = SD₀ × [i × (1 + i)^N] / [(1 + i)^N - 1]
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Erros Comuns Cometidos ao Amortizar</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Evite essas falhas frequentes para garantir a maior eficiência financeira nas suas decisões:
          </p>
          <ul className="list-decimal pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Apenas depositar o dinheiro na conta do financiamento:</strong> Se você simplesmente transferir um saldo extra para a conta em que o financiamento é debitado, o banco não saberá o que fazer e provavelmente apenas reterá o saldo ou adiantará a parcela seguinte (mantendo os juros futuros intactos). Você precisa entrar explicitamente no aplicativo do banco ou entrar em contato para solicitar a "Amortização Extraordinária".
            </li>
            <li>
              <strong>Desconsiderar o custo de oportunidade do FGTS:</strong> O saldo do Fundo de Garantia por Tempo de Serviço rende apenas 3% a.a. mais a Taxa Referencial (TR). Se os juros do seu financiamento imobiliário são de 9%, 10% ou 11% a.a., manter o dinheiro no FGTS em vez de utilizá-lo para amortizar a dívida imobiliária gera uma perda real de patrimônio a cada ano. A legislação permite o uso do FGTS para essa finalidade a cada 24 meses.
            </li>
            <li>
              <strong>Amortizar sem possuir uma reserva de emergência:</strong> O dinheiro amortizado no financiamento fica "preso" no imóvel. Se você usar toda a sua liquidez para amortizar e enfrentar uma emergência financeira (como desemplo ou problemas de saúde), não poderá reaver esse dinheiro rapidamente, sendo forçado a contratar linhas de crédito pessoal com juros astronômicos.
            </li>
          </ul>
        </div>
      </div>

      <FAQ items={[
        {
          question: 'Qual a diferença entre amortizar prazo ou amortizar o valor da parcela?',
          answer: 'Amortizar prazo mantém a parcela no valor atual e diminui a duração total do contrato (elimina parcelas do final). É a opção financeiramente mais vantajosa porque reduz o tempo de incidência de juros compostos. Amortizar parcela diminui o valor a ser pago mensalmente, mas mantém o prazo original do contrato. É recomendada apenas para desafogar o orçamento mensal em momentos de dificuldade.',
        },
        {
          question: 'De quanto em quanto tempo posso fazer amortizações extraordinárias?',
          answer: 'Com recursos próprios (dinheiro em conta corrente, poupança, etc.), você pode amortizar quantas vezes desejar, inclusive mensalmente ou semanalmente. Não há limite ou carência para aportes extras em dinheiro. Apenas para o uso do FGTS existe a carência de 2 anos (24 meses) entre cada operação de amortização ou amortização parcial de saldo devedor.',
        },
        {
          question: 'O banco cobra alguma taxa ou tarifa para eu realizar uma amortização extra?',
          answer: 'Não. Pela regulamentação do Banco Central do Brasil (Resolução CMN nº 3.516/2007), os bancos são proibidos de cobrar tarifas, taxas de serviço ou qualquer encargo para liquidação antecipada (total ou parcial) de contratos de financiamento habitacional ou de veículos. O valor aportado deve ir 100% para o abatimento do saldo devedor principal.',
        },
        {
          question: 'Qual é o melhor momento do mês para fazer um aporte extra de amortização?',
          answer: 'O ideal é fazer a amortização extraordinária no mesmo dia do vencimento da sua parcela mensal recorrente, logo após o débito da prestação. Isso evita que o banco calcule juros diários parciais (chamados juros acavalados ou proporcionais) entre a data do último pagamento e o dia da amortização, otimizando o abatimento.',
        },
        {
          question: 'O que são as taxas MIP e DFI cobradas mensalmente na prestação?',
          answer: 'São os seguros obrigatórios do financiamento imobiliário. O MIP (Morte e Invalidez Permanente) quita o saldo devedor em caso de sinistro com o devedor. O DFI (Danos Físicos ao Imóvel) cobre avarias físicas estruturais no imóvel. O valor desses seguros é recalculado periodicamente e costuma cair conforme o saldo devedor geral do financiamento diminui.',
        },
        {
          question: 'Vale a pena pegar um empréstimo pessoal com taxa menor para amortizar o financiamento?',
          answer: 'Dificilmente. Embora matematicamente fizesse sentido trocar uma dívida cara por uma mais barata, os juros de empréstimo pessoal comum no Brasil são muito mais altos do que as taxas de financiamento imobiliário (que possuem o imóvel como garantia real). A troca só faria sentido em casos muito específicos e raros de taxas excepcionais de crédito corporativo.',
        },
      ]} />

      <SourcesFooter sources={[
        { label: 'Banco Central do Brasil — Resolução CMN nº 3.516 (Direito à liquidação antecipada de dívidas)', url: 'https://www.bcb.gov.br/' },
        { label: 'Caixa Econômica Federal — Guia Prático de Habitação e Regras de Amortizações', url: 'https://www.caixa.gov.br/' },
        { label: 'Planalto — Artigo 52 do Código de Defesa do Consumidor (Abatimento proporcional de juros)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm' },
        { label: 'FGTS — Manual de Moradia Popular para utilização do saldo do Fundo de Garantia', url: 'https://www.fgts.gov.br/' }
      ]} />

      <AppCTA context="sua amortização e quitação de financiamento" />
    </div>
  )
}
