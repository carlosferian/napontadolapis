import type { Metadata } from 'next'
import { SmokeCalculator } from '@/components/calculators/SmokeCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { FAQ } from '@/components/ui/FAQ'

export const metadata: Metadata = {
  title: 'Quanto custa fumar ou vapear? Calculadora do custo real do cigarro e vape',
  description: 'Calcule quanto você gasta por mês com cigarro ou vape e o que esse dinheiro renderia investido na Selic em 10 ou 30 anos. Sem moralismo. Só a conta.',
  openGraph: {
    title: 'Custo do Fumo — A Ponta do Lápis',
    description: 'Sem moralismo. Só a conta.',
    url: 'https://apontadolapis.com.br/fumo',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/fumo' },
}

export default function FumoPage() {
  return (
    <div className="space-y-6">

      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          CIGARRO · VAPE · HÁBITOS
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          A conta que<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>ninguém faz.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Você acabou de fazer um cálculo dizendo que gasta R$ 800 por mês com cigarro.
          Imagina o que uma seguradora faria com essa informação.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Aqui, isso não vai acontecer.</strong>{' '}
          Os cálculos rodam no seu navegador. Veja o preço real do hábito.
        </p>
      </div>

      <SmokeCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-6">
        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Sobre o cálculo e o custo de oportunidade</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Esta ferramenta calcula o custo financeiro direto de hábitos de consumo recorrentes, como fumar cigarros convencionais ou utilizar dispositivos eletrônicos (vapes/pods). A premissa central baseia-se no <strong>custo de oportunidade</strong>: a diferença entre gastar uma quantia de forma destrutiva ou acumulá-la e investi-la em um ativo financeiro com rendimento constante.
          </p>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Projetamos os valores economizados utilizando a taxa básica de juros da economia (taxa Selic) como referência de investimento conservador pós-fixado. Isso demonstra matematicamente como despesas diárias pequenas, ao serem estendidas por horizontes longos (10 a 30 anos), acumulam valores surpreendentes devido ao efeito bola de neve dos juros compostos.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Exemplo Numérico Prático: 1 Maço por Dia</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Considere o exemplo de um fumante com consumo habitual de <strong>1 maço de cigarros por dia</strong>:
          </p>
          <ul className="list-disc pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Gasto Diário:</strong> R$ 12,00 (preço médio de um maço de marca intermediária no Brasil).
            </li>
            <li>
              <strong>Gasto Mensal:</strong> 30 dias × R$ 12,00 = <strong>R$ 360,00 por mês</strong>.
            </li>
            <li>
              <strong>Gasto Anual:</strong> 365 dias × R$ 12,00 = <strong>R$ 4.380,00 por ano</strong>.
            </li>
            <li>
              <strong>Projeção de Investimento (10 Anos):</strong> Se em vez de queimar esses R$ 360,00 mensais você os investisse no Tesouro Selic com taxa líquida estimada de 9% a.a. (~0,72% a.m.), você acumularia aproximadamente <strong>R$ 73.000,00</strong>.
            </li>
            <li>
              <strong>Projeção de Investimento (30 Anos):</strong> Mantendo a mesma disciplina de aportes mensais de R$ 360,00, o saldo acumulado total ao final de três décadas passaria de <strong>R$ 660.000,00</strong> (dos quais cerca de R$ 530 mil são puros rendimentos acumulados).
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">A Matemática do Custo Acumulado</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 font-mono text-xs italic">
            Gasto Mensal = Quantidade Consumida Diária × Preço Unitário × 30 dias<br />
            Valor Futuro Acumulado (VF) = Gasto Mensal × [((1 + i)ⁿ - 1) / i]
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Erros Comuns ao Avaliar Pequenas Despesas Diárias</h2>
          <ul className="list-decimal pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Avaliar o custo apenas pelo valor unitário:</strong> Achar que R$ 12,00 ou R$ 15,00 por dia é uma despesa sem importância. A mente humana falha ao tentar calcular de cabeça progressões geométricas e custos compostos no tempo, subestimando o impacto de longo prazo.
            </li>
            <li>
              <strong>Ignorar a depreciação e manutenção de cigarros eletrônicos (vapes):</strong> Usuários de vapes frequentemente acreditam que o hábito é mais barato por envolver essências recarregáveis. Contudo, ao somar o preço de aquisição dos aparelhos (mods/pods), resistências (coils) e essências importadas (juices), o custo médio mensal de muitos vapeadores supera com folga o custo do cigarro tradicional.
            </li>
            <li>
              <strong>Desconsiderar os custos de saúde e seguros de vida associados:</strong> Companhias seguradoras aplicam sobretaxas severas (agravamento de risco) de até 100% ou mais no preço de seguros de vida e planos de previdência para fumantes declarados. Além disso, o custo com coparticipação em consultas médicas, remédios e odontologia preventiva tende a crescer com a idade.
            </li>
          </ul>
        </div>
      </div>

      <FAQ items={[
        {
          question: 'Como a calculadora estima a taxa de rendimento Selic?',
          answer: 'A calculadora utiliza como referência a taxa Selic média anual de mercado, convertida para alíquota equivalente mensal de juros compostos. Essa taxa serve como um indicador conservador de rendimento líquido em renda fixa pós-fixada (como o Tesouro Selic de liquidez diária).',
        },
        {
          question: 'Dispositivos eletrônicos (Vape/Pod) custam menos que cigarro?',
          answer: 'Geralmente, não. Embora o líquido (juice) pareça render mais, os aparelhos possuem vida útil curta, necessitam de trocas de bobinas (coils) frequentes e têm custo de aquisição inicial elevado. Quando somados todos os insumos, o gasto mensal médio de usuários de vape costuma ser equivalente ou superior ao de maços convencionais.',
        },
        {
          question: 'Como as seguradoras sabem se sou fumante ou usuário de vape?',
          answer: 'No momento da contratação do seguro de vida ou contratação corporativa, você responde a um questionário de saúde de preenchimento obrigatório e declaração sob pena de crime de fraude. Em caso de sinistro decorrente de doenças associadas ao fumo, a seguradora realiza perícias médicas e exames laboratoriais e pode recusar o pagamento da indenização em caso de omissão.',
        },
        {
          question: 'O que é custo de oportunidade financeira?',
          answer: 'O custo de oportunidade é o valor do qual você abre mão ao tomar uma decisão de consumo em vez de investir. Ao gastar R$ 400,00 mensais com cigarros, o seu custo real não é apenas os R$ 400,00 em si, mas sim a perda dos juros e rendimentos que esses R$ 400,00 teriam gerado se estivessem aplicados na renda fixa no mesmo período.',
        },
        {
          question: 'Quais as fontes dos dados estatísticos sobre tabagismo no Brasil?',
          answer: 'Nossas referências de dados de saúde e custos populacionais provêm do INCA (Instituto Nacional de Câncer) e da ANVISA, órgãos responsáveis pela regulação, vigilância sanitária e campanhas de controle de tabaco e substâncias fumígenas no país.',
        },
        {
          question: 'Como a economia desse hábito pode impulsionar meu planejamento financeiro?',
          answer: 'Economizar o valor de um maço diário (cerca de R$ 360,00 a R$ 450,00 por mês) equivale a criar uma contribuição espontânea automática para a sua Reserva de Emergência ou Previdência Complementar. Em poucos anos, esse valor vira um patrimônio suficiente para cobrir despesas médicas, dar entrada em bens ou iniciar investimentos mais robustos.',
        },
      ]} />

      <SourcesFooter sources={[
        { label: 'INCA — Instituto Nacional de Câncer: Estatísticas e Impacto Econômico do Tabagismo', url: 'https://www.inca.gov.br/tabagismo' },
        { label: 'ANVISA — Regulação, restrições de venda e controle de substâncias fumígenas', url: 'https://www.gov.br/anvisa/pt-br/assuntos/tabaco' },
        { label: 'Banco Central do Brasil — Histórico de Taxa Selic e Rendimentos de Renda Fixa', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
        { label: 'Ministério da Saúde — Campanhas Nacionais de Prevenção e Cessação do Tabagismo', url: 'https://www.gov.br/saude' }
      ]} />
      <AppCTA context="esse custo" />
    </div>
  )
}
