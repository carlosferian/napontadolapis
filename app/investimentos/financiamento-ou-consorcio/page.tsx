import type { Metadata } from 'next'
import { FinancingPageTabs } from '@/components/FinancingPageTabs'
import { AppCTA }        from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { FAQ } from '@/components/ui/FAQ'

export const metadata: Metadata = {
  title: 'Financiamento vs. Consórcio — A diferença matemática que ninguém te conta',
  description: 'Compare SAC, Price, Empréstimo Pessoal e Consórcio com tabela matemática detalhada. Veja custo total, evolução das parcelas e por que o consórcio raramente compensa.',
  openGraph: {
    title: 'Financiamento vs. Consórcio — A Ponta do Lápis',
    description: 'Consórcio "sem juros" é mais barato? A matemática responde.',
    url: 'https://apontadolapis.com.br/investimentos/financiamento-ou-consorcio',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/investimentos/financiamento-ou-consorcio' },
}

export default function FinanciamentoOuConsorcioPage() {
  return (
    <div className="space-y-6">

      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          CRÉDITO · COMPARATIVO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(28px, 4vw, 50px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Consórcio "sem juros"<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>é mais barato que financiamento?</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 620 }}>
          Vendedores apresentam o consórcio como a alternativa sem juros ao financiamento.
          A realidade é outra: há{' '}
          <strong style={{ color: 'var(--c-ink)' }}>taxa de administração (15–25% sobre a carta)</strong>,{' '}
          <strong style={{ color: 'var(--c-ink)' }}>reajuste anual que aumenta suas parcelas</strong>{' '}
          e a agravante de que{' '}
          <strong style={{ color: 'var(--c-ink)' }}>você não recebe o bem até ser sorteado</strong>.
          A tabela abaixo coloca todos os modelos lado a lado, com a matemática completa.
        </p>
      </div>

      <FinancingPageTabs />

      <div className="prose prose-sm prose-stone max-w-none space-y-6">
        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">SAC ou Price: qual sistema de amortização escolher?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            No <strong>SAC (Sistema de Amortização Constante)</strong>, a parcela de amortização do saldo devedor é fixa
            e os juros diminuem mês a mês — por isso a parcela total começa mais alta e vai caindo ao longo do contrato.
            No <strong>Price (Tabela Price)</strong>, a parcela total é fixa do início ao fim, mas no começo você paga
            proporcionalmente mais juros e menos amortização. Resultado: o SAC tem <strong>custo total menor</strong>,
            mas exige uma renda inicial maior para aprovar o financiamento; o Price facilita a aprovação por ter parcelas
            menores no início, porém custa mais caro ao final do contrato.
          </p>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            A simulação acima calcula a tabela completa de ambos os sistemas, parcela a parcela, para que você compare
            o <strong>custo total</strong>, a <strong>evolução das parcelas</strong> e o <strong>saldo devedor</strong> em
            cada mês — sem depender de planilhas complexas.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Exemplo Prático: Carta de R$ 100.000,00 (120 meses / 10 anos)</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Colocando os números reais lado a lado para uma necessidade de R$ 100.000,00 em 10 anos:
          </p>
          <ul className="list-disc pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Financiamento Imobiliário (Tabela SAC):</strong> Com taxa de juros de 10% a.a. em 120 meses, a prestação inicial começa em <strong>R$ 1.666,00</strong> e cai mês a mês até terminar em <strong>R$ 840,00</strong>. Ao final do contrato, o total pago será de aproximadamente <strong>R$ 150.000,00</strong>. Você usufruiu do bem desde o primeiro mês.
            </li>
            <li>
              <strong>Consórcio Comercial:</strong> Com taxa de administração de 20% diluída no prazo (2% a.a.), a parcela básica começa em <strong>R$ 1.000,00</strong>. No entanto, anualmente, o saldo da carta de crédito e as parcelas são reajustados pela inflação do setor (ex: INCC a 6% a.a.). Se você for contemplado no <strong>último mês (120º)</strong>, a soma de todas as suas parcelas reajustadas ao longo de 10 anos ultrapassará <strong>R$ 160.000,00</strong> devido à correção inflacionária da sua dívida e da taxa de administração cobrada sobre o saldo reajustado. Você pagou mais e só teve o bem ao fim do contrato.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">A Matemática Comparativa Básica</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 font-mono text-xs italic">
            Custo Total Financiamento = Principal + Σ (Saldo Devedor_t-1 × Taxa Juros_t) + Seguros Obrigatórios<br />
            Custo Total Consórcio = Σ [ (Carta_inicial × (1 + Taxa Adm) / N) × (1 + Reajuste Anual)ⁿ ] + Fundo de Reserva
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Erros Comuns ao Optar por Consórcio</h2>
          <ul className="list-decimal pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Achar que taxa de administração é menor que juros de financiamento:</strong> A taxa de administração incide sobre o <strong>valor total da carta de crédito</strong> durante todo o período, enquanto os juros do financiamento incidem sobre o <strong>saldo devedor decrescente</strong>. Uma taxa de administração nominal de 20% distribuída em 5 anos equivale a uma taxa de juros real de aproximadamente 7,5% a.a. em um financiamento em termos de custo efetivo anual.
            </li>
            <li>
              <strong>Subestimar o impacto dos reajustes anuais:</strong> O reajuste anual da carta de crédito (pelo INCC para imóveis ou IPCA para veículos) é feito para garantir o poder de compra da carta para o grupo. No entanto, ele aumenta o saldo devedor restante do consorciado. Nos anos finais, a parcela pode se tornar pesada para o orçamento familiar se os salários não acompanharem a inflação setorial.
            </li>
            <li>
              <strong>Entrar sem capital para lances em prazos muito longos:</strong> Contratos de consórcio imobiliário de 15 a 20 anos baseados apenas na sorte do sorteio mensal são arriscados. Sem dar lances altos (geralmente entre 30% e 50% do valor da carta), você corre o risco de pagar metade do consórcio ao longo de 10 anos sem receber a carta, acumulando prejuízo de oportunidade.
            </li>
          </ul>
        </div>
      </div>

      <FAQ items={[
        {
          question: 'O que é taxa de administração e fundo de reserva?',
          answer: 'A taxa de administração é a remuneração paga à empresa organizadora do consórcio para gerenciar o grupo e as assembleias. O fundo de reserva é uma taxa extra cobrada para cobrir eventuais inadimplências de membros do grupo e garantir a saúde financeira das contemplações, sendo parcialmente devolvida aos consorciados de forma proporcional no encerramento do grupo.',
        },
        {
          question: 'Como funcionam os lances em um grupo de consórcio?',
          answer: 'O lance é a oferta de adiantamento de parcelas feita pelo consorciado para tentar antecipar a contemplação sem depender apenas do sorteio mensal. O lance vencedor costuma ser aquele que representa o maior percentual de amortização do saldo devedor da carta. Existem modalidades de lance livre, lance fixo e lance embutido.',
        },
        {
          question: 'O que é o lance embutido e como ele funciona?',
          answer: 'O lance embutido permite utilizar uma porcentagem da própria carta de crédito (geralmente até 30%) como lance na assembleia. Se você for contemplado usando essa modalidade, o valor correspondente ao lance é retido e você recebe uma carta de crédito de valor menor (ex: em uma carta de R$ 100 mil com lance embutido de 30%, você recebe R$ 70 mil e abate R$ 30 mil do saldo devedor restante).',
        },
        {
          question: 'Por que o consórcio é reajustado anualmente?',
          answer: 'Para manter o poder de compra da carta de crédito. Se você entra em um consórcio de imóvel de R$ 200 mil que dura 15 anos, a inflação da construção civil faria com que R$ 200 mil no 10º ano comprassem muito menos material do que no 1º ano. Por isso, a administradora atualiza o valor da carta de todos (e consequentemente as parcelas a pagar) de forma anual.',
        },
        {
          question: 'Posso desistir do consórcio e reaver meu dinheiro imediatamente?',
          answer: 'Não imediatamente. Pela Lei nº 11.795/2008, ao desistir ou ser excluído do grupo por inadimplência, você continua participando das assembleias mensais apenas na categoria de cotas canceladas. Você só reaverá as parcelas pagas (deduzindo multas contratuais e taxas de administração) se for sorteado nessa categoria ou quando o grupo for oficialmente encerrado.',
        },
        {
          question: 'Posso usar o FGTS para dar lance no consórcio imobiliário?',
          answer: 'Sim. As regras da Caixa Econômica Federal e do SFH permitem a utilização do saldo de FGTS do trabalhador para dar lance ou complementar a carta de crédito na aquisição de imóvel residencial urbano, respeitando as condições de tempo de carteira assinada e não propriedade de outro imóvel na mesma região.',
        },
      ]} />

      <SourcesFooter sources={[
        { label: 'Banco Central do Brasil — Nota sobre Consórcios (Lei nº 11.795/2008)', url: 'https://www.bcb.gov.br/estabilidadefinanceira/consorcio' },
        { label: 'Receita Federal — Tabela SAC e sistemas de amortização de crédito', url: 'https://www.gov.br/receitafederal/pt-br' },
        { label: 'ABAC — Associação Brasileira de Administradoras de Consórcios', url: 'https://abac.org.br/' },
        { label: 'Procon-SP — Reclamações e orientações gerais sobre venda de consórcios', url: 'https://www.procon.sp.gov.br/' },
        { label: 'Banco Central do Brasil — Calculadora do Cidadão (CET de Crédito e Financiamento)', url: 'https://www3.bcb.gov.br/CALCIDADAO/' }
      ]} />

      <AppCTA context="seu financiamento ou consórcio" />
    </div>
  )
}
