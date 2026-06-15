import type { Metadata } from 'next'
import { TravelCalculator } from '@/components/calculators/TravelCalculator'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { FAQ } from '@/components/ui/FAQ'

export const metadata: Metadata = {
  title: 'Calculadora da Viagem dos Sonhos — Planeje qualquer destino',
  description: 'Calcule o custo real de qualquer viagem em reais, compare cartão tradicional com fintech e saiba quanto poupar por mês. Sem ilusão, sem susto.',
  openGraph: {
    title: 'Calculadora da Viagem dos Sonhos — A Ponta do Lápis',
    description: 'Você sonha com a viagem. A gente faz a conta.',
    url: 'https://apontadolapis.com.br/viagens/planejar',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/viagens/planejar' },
}

export default function PlanejarPage() {
  return (
    <div className="space-y-6">
      <TravelCalculator />
      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como funciona o cálculo</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          O custo diário inclui hospedagem, alimentação, transporte local e atividades, estimado por
          pessoa por dia em dólares. O voo é calculado em reais (round trip de GRU/CGH). O cartão
          tradicional aplica IOF de 3,38% (Decreto 11.322/2022) mais spread bancário médio de 4%. A fintech (Wise, Nomad)
          aplica apenas cerca de 1,5% de taxa, sem IOF. A meta inclui 15% de margem de segurança.
          O plano de poupança usa a fórmula PMT de anuidade com a taxa Selic.
        </p>
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Cartão tradicional vs. conta internacional</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          A maior parte do "susto" no extrato de quem viaja ao exterior vem do <strong>IOF de 3,38%</strong>{' '}
          cobrado em compras com cartão de crédito ou débito internacional, somado ao spread cambial
          que o banco aplica sobre a cotação do dólar — geralmente entre 3% e 6% acima da cotação
          comercial. Contas digitais como Wise e Nomad não cobram IOF sobre o saldo em moeda
          estrangeira (porque a operação de câmbio acontece antes, na recarga da conta) e aplicam
          spreads bem menores, próximos da cotação real. Para uma viagem de R$ 10.000, essa diferença
          pode representar centenas de reais economizados.
        </p>
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como montar a meta de poupança</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Depois de estimar o custo total da viagem (hospedagem, alimentação, transporte e voos),
          a calculadora adiciona uma <strong>margem de segurança de 15%</strong> — para imprevistos,
          compras extras e variação cambial entre o planejamento e a viagem. Em seguida, distribui
          esse valor em parcelas mensais até a data da viagem, considerando o rendimento da Selic
          sobre o saldo já guardado. Quanto mais cedo você começar a poupar, menor a parcela mensal
          necessária — o efeito dos juros compostos trabalha a seu favor mesmo em prazos curtos.
        </p>
      </div>
      <FAQ items={[
        {
          question: 'Vale mais a pena levar dinheiro em espécie ou usar cartão na viagem?',
          answer: 'Depende do destino e do valor. Cartões internacionais (crédito/débito tradicionais) cobram IOF de 3,38% mais spread bancário. Contas digitais como Wise e Nomad eliminam o IOF e reduzem bastante o spread. Espécie evita taxas de cartão, mas tem riscos de segurança e, em geral, cotação de compra de papel-moeda pior que a eletrônica.',
        },
        {
          question: 'Por que a calculadora soma 15% de margem de segurança na meta?',
          answer: 'Imprevistos (taxas extras, compras não planejadas, variação cambial entre o planejamento e a data da viagem) são praticamente garantidos. A margem de 15% evita que você chegue ao destino com o orçamento exatamente no limite.',
        },
        {
          question: 'O cálculo considera a cotação do dólar no momento da viagem?',
          answer: 'A calculadora usa a cotação informada por você no momento do planejamento. Como o câmbio varia, o ideal é revisitar a simulação periodicamente conforme a data da viagem se aproxima, especialmente se a cotação mudar significativamente.',
        },
      ]} />

      <SourcesFooter sources={[
        { label: 'Decreto 11.322/2022 — IOF sobre operações de câmbio com cartão no exterior (3,38%)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/D11322.htm' },
        { label: 'BCB — Taxa Selic para referência do plano de poupança', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
        { label: 'Banco Central — Câmbio e IOF sobre operações financeiras no exterior', url: 'https://www.bcb.gov.br/acessoinformacao/legado?url=https%3A%2F%2Fwww.bcb.gov.br%2Frex%2Fiof%2Fport%2Flegislacao.asp' },
        { label: 'Wikipedia — Fórmula PMT (valor presente de anuidade ordinária)', url: 'https://pt.wikipedia.org/wiki/Valor_presente_l%C3%ADquido' },
      ]} />
    </div>
  )
}
