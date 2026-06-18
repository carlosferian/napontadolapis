import type { Metadata } from 'next'
import { CompoundInterestCalculator } from '@/components/calculators/CompoundInterestCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { FAQ } from '@/components/ui/FAQ'

export const metadata: Metadata = {
  title: 'Calculadora de Juros Compostos — Simule seu crescimento patrimonial',
  description: 'Simulador completo de juros compostos: projete a evolução dos seus aportes mensais, compare com poupança e entenda o efeito exponencial no tempo. Sem cadastro.',
  openGraph: {
    title: 'Simulador de Juros Compostos — A Ponta do Lápis',
    description: 'Projete o poder dos juros compostos e o efeito bola de neve no tempo.',
    url: 'https://apontadolapis.com.br/juros-compostos',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/juros-compostos' },
}

export default function CompoundInterestPage() {
  return (
    <div className="space-y-6">
      
      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          CRESCER · SIMULAÇÃO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          O poder exponencial dos<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>juros compostos.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Coloque os números a seu favor.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Projete os aportes mensais, escolha a taxa efetiva (mensal ou anual) e simule a bola de neve temporal.</strong>{' '}
          Sem taxas camufladas, sem ofertas de fundos de investimento com comissões ocultas. Apenas a matemática pura.
        </p>
      </div>

      <CompoundInterestCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-6">
        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Entendendo a matemática dos juros compostos</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Diferente dos juros simples (onde a taxa incide apenas sobre o valor principal inicial), os juros compostos incidem sobre o montante acumulado do período anterior — ou seja, <strong className="text-stone-600 dark:text-stone-300">juros sobre juros</strong>.
            À medida que o tempo passa, a curva de crescimento deixa de ser linear e assume um comportamento exponencial. É o efeito conhecido como "bola de neve", no qual, em prazos mais longos, o rendimento em juros supera significativamente o somatório total de todo o dinheiro investido mensalmente pelo próprio poupador.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Exemplo Prático: A Força do Tempo na Renda Fixa</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Imagine que você inicie um plano financeiro com um aporte inicial de <strong>R$ 5.000,00</strong> e consiga poupar e investir <strong>R$ 500,00 todos os meses</strong> ao longo de <strong>30 anos (360 meses)</strong>, sob uma taxa de retorno líquida de <strong>10% a.a. (cerca de 0,8% a.m.)</strong>.
          </p>
          <ul className="list-disc pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Total investido por você:</strong> Ao longo de 30 anos, você tirou do próprio bolso a quantia total de <strong>R$ 185.000,00</strong> (R$ 5.000 iniciais + 360 parcelas de R$ 500).
            </li>
            <li>
              <strong>Saldo final acumulado:</strong> O valor total na sua conta de investimento ao final do período será de aproximadamente <strong>R$ 1.100.000,00</strong> (R$ 1,1 milhão).
            </li>
            <li>
              <strong>O efeito bola de neve:</strong> Deste saldo final, mais de <strong>R$ 915.000,00 são puros juros</strong> pagos pelo efeito composto. Ou seja, cerca de <strong>83% do seu patrimônio final</strong> veio do rendimento de juros sobre juros, e apenas 17% do dinheiro poupado diretamente.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">A Fórmula dos Juros Compostos</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 font-mono text-xs italic">
            Montante de Aplicação Única: M = P × (1 + i)ᵗ<br />
            Valor Futuro (VF) de Depósitos Recorrentes: VF = P × [((1 + i)ⁿ - 1) / i] + VF_inicial × (1 + i)ⁿ
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Erros Comuns na Simulação de Longo Prazo</h2>
          <ul className="list-decimal pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Ignorar o impacto da inflação (Taxa Nominal vs. Taxa Real):</strong> Simular um investimento rendendo 12% a.a. por 30 anos e achar que terá o poder de compra equivalente a 1 milhão de reais de hoje. A inflação corrói o valor do dinheiro. Para estimar o ganho real, deve-se descontar a inflação média esperada (ex: se o rendimento é 10% e a inflação média é 4,5%, a taxa real líquida é de cerca de 5,2% a.a.).
            </li>
            <li>
              <strong>Começar tarde demais:</strong> O tempo é a variável exponencial na fórmula dos juros compostos. Adiar o início da poupança em apenas 5 ou 10 anos reduz drasticamente o patrimônio final acumulado, obrigando o investidor a fazer aportes mensais muito maiores para alcançar o mesmo objetivo.
            </li>
            <li>
              <strong>Subestimar taxas administrativas e de corretagem:</strong> Em prazos longos, pagar taxas de administração elevadas (como 2% a.a. em fundos de previdência de bancos tradicionais) destrói o patrimônio acumulado, drenando centenas de milhares de reais que deveriam render juros compostos a seu favor.
            </li>
          </ul>
        </div>
      </div>

      <FAQ items={[
        {
          question: 'Qual a diferença entre juros simples e juros compostos?',
          answer: 'Nos juros simples, a taxa incide sempre sobre o valor original aplicado. Nos juros compostos, a taxa incide sobre o saldo acumulado (principal + juros já ganhos), gerando "juros sobre juros" — o que faz o crescimento ser exponencial e não linear ao longo do tempo.',
        },
        {
          question: 'Aportes mensais fazem diferença real no resultado final?',
          answer: 'Sim, e muito. Aportes mensais constantes, somados ao efeito composto, costumam representar a maior parte do patrimônio final em simulações de longo prazo — mais até do que o valor inicial investido, especialmente em horizontes acima de 10-15 anos.',
        },
        {
          question: 'Devo usar a taxa mensal ou anual na simulação?',
          answer: 'Use a taxa que corresponde ao seu investimento real (ex: CDBs costumam divulgar a taxa anual, enquanto alguns fundos informam a taxa mensal). A calculadora converte automaticamente entre as duas, mas o resultado é mais preciso quando você usa a taxa efetiva informada pela instituição financeira.',
        },
        {
          question: 'O que é a famosa "Regra dos 72" e como utilizá-la?',
          answer: 'É uma aproximação matemática rápida para saber em quanto tempo um investimento dobrará de valor sob uma determinada taxa de juros anual. Basta dividir 72 pela taxa de juros. Por exemplo, se um investimento rende 8% a.a., ele levará aproximadamente 9 anos (72 / 8 = 9) para dobrar o capital inicial de forma composta.',
        },
        {
          question: 'Como a tributação de Imposto de Renda afeta os juros compostos?',
          answer: 'Na renda fixa (CDB, Tesouro), a tributação segue a tabela regressiva: 22,5% (até 180 dias), 20% (181 a 360 dias), 17,5% (361 a 720 dias) e 15% (acima de 720 dias). Manter o dinheiro investido por prazos longos reduz a alíquota de imposto ao mínimo de 15%, preservando maior parte do capital para render juros compostos.',
        },
        {
          question: 'O que é o efeito "come-cotas" em fundos de investimento?',
          answer: 'O come-cotas é um adiantamento semestral de Imposto de Renda cobrado em maio e novembro nos fundos de investimento de renda fixa e multimercados. Ele reduz o número de cotas que você possui no fundo. Esse recolhimento periódico prejudica a rentabilidade de longo prazo porque retira capital que continuaria rendendo juros compostos.',
        },
      ]} />

      <SourcesFooter sources={[
        { label: 'CVM — Comissão de Valores Mobiliários: Guia de Educação Financeira', url: 'https://www.investidor.gov.br/' },
        { label: 'B3 — Bolsa de Valores do Brasil: Simulação de Projeção de Renda Fixa', url: 'https://www.b3.com.br/pt_br/dados/indices/indices-de-segmento/' },
        { label: 'BACEN — Fórmulas e Critérios da calculadora cidadã de juros compostos', url: 'https://www3.bcb.gov.br/CALCID/publico/exibirFormAplicacaoValorFuturo.do?method=exibirFormAplicacaoValorFuturo' },
        { label: 'Wikipedia — Juros compostos: deduções matemáticas e comportamento exponencial', url: 'https://pt.wikipedia.org/wiki/Juro_composto' }
      ]} />
      
      <AppCTA context="seu planejamento de longo prazo e juros compostos" />
    </div>
  )
}
