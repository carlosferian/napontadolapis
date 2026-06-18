import type { Metadata } from 'next'
import { ParceladoCalculator } from '@/components/calculators/ParceladoCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { FAQ } from '@/components/ui/FAQ'

export const metadata: Metadata = {
  title: 'Calculadora Parcelado ou À Vista — Juros Embutidos Ocultos',
  description: 'Descubra a taxa de juros implícita real embutida no parcelamento "sem juros" em comparação ao desconto oferecido para pagamento à vista. Evite juros ocultos.',
  openGraph: {
    title: 'Simulador Parcelado ou À Vista (Juros Ocultos) — A Ponta do Lápis',
    description: 'Descubra se o parcelamento "sem juros" do varejo na verdade esconde uma taxa de lançamento abusiva em relação ao desconto Pix ou Boleto.',
    url: 'https://apontadolapis.com.br/investimentos/parcelado-ou-a-vista',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/investimentos/parcelado-ou-a-vista' },
}

export default function ParceladoPage() {
  return (
    <div className="space-y-6">
      
      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex', backgroundColor: 'var(--c-emerald-soft)', color: 'var(--c-emerald)' }}>
          COMPRAR CONSCIENTE · JUROS EMBUTIDOS
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Descubra a taxa real do<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>parcelamento "sem juros".</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          O varejo costuma embutir as despesas de financiamento no preço parcelado e oferece descontos no pagamento à vista.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Insira o preço parcelado total, o preço à vista no Pix/Boleto e o número de parcelas, e nosso solver financeiro revelará a taxa de juros implícita real da sua compra.</strong>
        </p>
      </div>

      <ParceladoCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-6">
        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como funciona o Juro Embutido no Parcelamento?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Embora muitas lojas anunciem a opção de parcelar em "10x sem juros" ou "12x sem juros", a existência de um preço à vista menor (com desconto de 5%, 10% ou 15% no Pix ou boleto bancário) é a prova matemática definitiva de que o parcelamento tem, sim, um custo financeiro cobrado nas sombras.
          </p>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Quando a loja anuncia um produto por R$ 1.000,00 em 10x ou R$ 900,00 à vista, ela está te cobrando R$ 100,00 apenas pela conveniência de adiar o pagamento. Essa diferença é o <strong>juro embutido</strong>. Se você optar por parcelar, está contratando um financiamento implícito.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Exemplo Prático: A TV de R$ 2.000,00</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Considere um eletrodoméstico anunciado em uma rede varejista:
          </p>
          <ul className="list-disc pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Preço Parcelado:</strong> 10 parcelas mensais fixas de <strong>R$ 200,00</strong> (total R$ 2.000,00).
            </li>
            <li>
              <strong>Preço à Vista:</strong> Desconto de 10% no Pix, custando <strong>R$ 1.800,00</strong>.
            </li>
            <li>
              <strong>A taxa oculta:</strong> Ao rodar o solver financeiro (TIR), descobrimos que a taxa de juros implícita dessa transação é de <strong>2,05% ao mês</strong> (o que representa mais de 27% a.a.).
            </li>
            <li>
              <strong>A decisão:</strong> Como nenhum investimento conservador de liquidez diária rende 2% a.m. livre de impostos, a melhor decisão financeira é, sem dúvida, <strong>pagar à vista</strong> e embolsar o desconto.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">A Matemática do Solver Financeiro</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Para deduzir essa taxa de juros mensal invisível, utilizamos a fórmula do Valor Presente da Anuidade. O sistema calcula a Taxa Interna de Retorno (TIR) que iguala o fluxo de parcelas mensais ao preço com desconto à vista:
          </p>
          <p className="text-stone-500 dark:text-stone-400 text-xs italic mt-1 font-mono text-center">
            PV = Σ [ P / (1 + i)ᵗ ] para t de 1 a N
          </p>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Como a variável <i>i</i> (taxa de juros) não pode ser isolada algebricamente em equações polinomiais de grau elevado, o solver utiliza métodos numéricos iterativos (como o Método de Newton-Raphson) para convergir na taxa de juros exata.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Erros Psicológicos Comuns nas Compras Parceladas</h2>
          <ul className="list-decimal pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Focar apenas no valor da parcela individual:</strong> Achar que R$ 50,00 por mês é irrelevante e fazer 15 compras diferentes nessa mesma modalidade. No final do mês, a soma das parcelas (R$ 750,00) compromete uma fatia enorme do orçamento, virando uma despesa fixa indesejada de longo prazo.
            </li>
            <li>
              <strong>Achar que todo desconto menor que 5% não compensa pagar à vista:</strong> Achar que um desconto Pix de 3% é insignificante. Dependendo do número de parcelas (ex: em 12 vezes), mesmo um desconto de 3% à vista representa um ganho real superior à rentabilidade líquida do dinheiro investido no mesmo período.
            </li>
            <li>
              <strong>Não provisionar a compra à vista:</strong> Comprar parcelado por impulso apenas por não ter o dinheiro todo disponível hoje. Se você precisa parcelar porque não tem o capital, você não tem o preço à vista — e está contratando uma dívida sem ter reservas, aumentando o risco de inadimplência em caso de desemprego.
            </li>
          </ul>
        </div>
      </div>

      <FAQ items={[
        {
          question: 'Como as lojas conseguem anunciar parcelamento "sem juros"?',
          answer: 'As lojas já embutem o custo de financiamento (taxas das operadoras de cartão e taxas de antecipação de recebíveis) no preço "cheio" parcelado do produto. O preço cobrado a prazo já cobre todos os riscos e custos de capital da administradora do cartão, tornando o desconto à vista o preço real do produto.',
        },
        {
          question: 'O que é a antecipação de parcelas no cartão de crédito?',
          answer: 'Alguns bancos e emissores de cartões (como o Nubank) permitem que o cliente antecipe o pagamento de parcelas futuras de compras feitas sem juros. Ao fazer isso, o banco concede um desconto proporcional na fatura corrente, abatendo parte dos juros embutidos que foram repassados pela adquirente no momento da compra.',
        },
        {
          question: 'Quando o desconto à vista é muito pequeno ou inexistente, vale a pena parcelar?',
          answer: 'Sim. Se a loja cobra exatamente o mesmo valor à vista (Pix/Boleto) e parcelado no cartão, a taxa de juros implícita é de 0%. Nesse caso específico, vale a pena parcelar na maior quantidade de vezes possível sem juros, mantendo o seu dinheiro principal rendendo na renda fixa durante o período.',
        },
        {
          question: 'O desconto à vista é sempre isento de Imposto de Renda?',
          answer: 'Sim. O desconto concedido em uma compra de consumo pessoal não é classificado como ganho de capital ou rendimento tributável. É uma redução de despesa direta, funcionando como um rendimento líquido e garantido, livre de impostos na fonte ou no ajuste anual.',
        },
        {
          question: 'O que é o Custo Efetivo Total (CET) nas compras parceladas?',
          answer: 'O CET é o indicador que expressa o custo total de uma operação de crédito em formato de taxa percentual anual. Nas compras parceladas com juros explícitos, o CET inclui não apenas a taxa de juros contratual, mas taxas de abertura de crédito (TAC), seguros e impostos (como o IOF).',
        },
        {
          question: 'Como usar a taxa implícita para negociar descontos nas compras?',
          answer: 'Ao saber que o parcelamento em 10x embute juros de 2% a.m., você pode argumentar com o vendedor que, se pagar à vista no Pix, economizará a taxa de antecipação que a loja pagaria à credenciadora do cartão. Isso te dá base técnica para negociar descontos de 7% a 10% no fechamento da compra.',
        },
      ]} />

      <SourcesFooter sources={[
        { label: 'Banco Central do Brasil — Resolução CMN sobre CET e Transparência em Operações de Crédito', url: 'https://www.bcb.gov.br/' },
        { label: 'Planalto — Decreto Federal nº 5.903/2006 (Regulamentação sobre fixação de preços e descontos)', url: 'http://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/decreto/d5903.htm' },
        { label: 'Código de Defesa do Consumidor — Direito à informação clara de juros e descontos', url: 'https://www.planalto.gov.br/' },
        { label: 'CVM — Princípios de Matemática Financeira e Valor Presente Líquido', url: 'https://www.gov.br/cvm/' }
      ]} />
      
      <AppCTA context="suas compras conscientes e decisões de consumo sem juros embutidos" />
    </div>
  )
}
