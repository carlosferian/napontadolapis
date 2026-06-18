import type { Metadata } from 'next'
import { UberCarCalculator } from '@/components/calculators/UberCarCalculator'
import { AppCTA }            from '@/components/AppCTA'
import { SourcesFooter }     from '@/components/ui/SourcesFooter'
import { FAQ } from '@/components/ui/FAQ'

export const metadata: Metadata = {
  title: 'Uber vs. Carro Próprio — Qual realmente compensa?',
  description: 'Compare o custo total real de ter um carro próprio com usar Uber e transporte público. Inclui depreciação, seguro, IPVA, custo de oportunidade e projeção de 5 anos.',
  openGraph: {
    title: 'Uber vs. Carro Próprio — A Ponta do Lápis',
    description: 'O carro parece barato — até você ver a conta completa.',
    url: 'https://apontadolapis.com.br/trabalho/uber-vs-carro',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/trabalho/uber-vs-carro' },
}

export default function UberVsCarroPage() {
  return (
    <div className="space-y-6">

      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          TRANSPORTE · CUSTO REAL
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          O carro parece barato.<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>Até você ver a conta completa.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 580 }}>
          A maioria das pessoas compara o Uber com o{' '}
          <strong style={{ color: 'var(--c-ink)' }}>combustível</strong> — e esquece depreciação,
          seguro, IPVA, manutenção e o custo de oportunidade do capital parado no veículo.
          Esta calculadora faz a conta completa.
        </p>
      </div>

      <UberCarCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-6">
        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">O verdadeiro custo de ter um carro</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Quando alguém calcula "quanto custa meu carro por mês", quase sempre soma só{' '}
            <strong>combustível e estacionamento</strong>. Mas o Custo Total de Propriedade (TCO) inclui também{' '}
            <strong>depreciação</strong> (o carro perde valor todo ano, mesmo parado), <strong>seguro</strong>,{' '}
            <strong>IPVA e licenciamento</strong>, <strong>manutenção preventiva</strong> e o{' '}
            <strong>custo de oportunidade</strong> — o quanto o dinheiro investido no carro renderia se estivesse
            aplicado na Selic ou CDI em vez de parado em um ativo que desvaloriza.
          </p>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            A calculadora acima soma todos esses fatores e projeta o custo mensal real ao longo de <strong>5 anos</strong>,
            comparando com o gasto equivalente em <strong>Uber/99</strong> e <strong>transporte público</strong> para a
            mesma rotina de deslocamentos. Em muitos casos, principalmente para quem roda pouco (até 500–800 km/mês),
            o carro próprio custa significativamente mais do que parece — e o ponto de equilíbrio (break-even) só
            aparece para quem realmente depende do veículo diariamente.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Exemplo Prático: Um Carro de R$ 60.000,00</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Imagine um veículo seminovo de <strong>R$ 60.000,00</strong>. Vamos calcular as despesas mensais reais invisíveis:
          </p>
          <ul className="list-disc pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Custos Fixos (Anual):</strong> IPVA e licenciamento (~4% = R$ 2.400), seguro médio (~5% = R$ 3.000), manutenção preventiva básica (trocas de óleo, filtros, revisões = R$ 1.500). Total: R$ 6.900,00 por ano (<strong>R$ 575,00 por mês</strong>).
            </li>
            <li>
              <strong>Depreciação Anual (Média 10%):</strong> O carro perde valor. São R$ 6.000,00 a menos de patrimônio por ano (<strong>R$ 500,00 por mês</strong>).
            </li>
            <li>
              <strong>Custo de Oportunidade:</strong> Se os R$ 60.000,00 estivessem em um investimento rendendo 9% a.a. líquidos, renderiam R$ 5.400,00 por ano (<strong>R$ 450,00 por mês</strong>) livre de risco. Ao comprar o carro, você abre mão desse rendimento.
            </li>
            <li>
              <strong>Combustível e Uso (Rodando 1.000 km/mês):</strong> Com gasolina a R$ 6,00/litro e média de 10 km/l, o combustível soma <strong>R$ 600,00 por mês</strong>.
            </li>
            <li>
              <strong>Custo Mensal Real do Carro:</strong> R$ 575 + R$ 500 + R$ 450 + R$ 600 = <strong>R$ 2.125,00 por mês</strong> (mesmo sem contar estacionamentos, multas ou lavagens).
            </li>
            <li>
              <strong>Comparação com Aplicativos:</strong> Se você usa o aplicativo para ir e voltar do trabalho todos os dias úteis (R$ 70,00 ida e volta × 20 dias = R$ 1.400,00) e mais R$ 300,00 nos fins de semana, gasta R$ 1.700,00 por mês. O aplicativo representou uma economia real de <strong>R$ 425,00 por mês</strong> em relação ao carro próprio.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">A Fórmula Matemática do Custo Total de Propriedade (TCO)</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 font-mono text-xs italic">
            Custo Fixo Mensal = (IPVA + Seguro + Manutenção) / 12<br />
            Depreciação Mensal = (Valor do Carro × Taxa Depreciação) / 12<br />
            Custo Oportunidade Mensal = (Valor do Carro × Taxa de Juros Líquida) / 12<br />
            Custo Combustível Mensal = (Km Rodados / Consumo km/l) × Preço Combustível<br />
            TCO Mensal = Custo Fixo + Depreciação + Custo Oportunidade + Custo Combustível + Estacionamento + Lavagens
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Erros Comuns na Comparação de Transporte</h2>
          <ul className="list-decimal pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Achar que o custo do carro é apenas a parcela do financiamento e a gasolina:</strong> A parcela do financiamento representa a aquisição do ativo (com juros elevados), enquanto o IPVA, seguro e manutenção preventiva são custos de manutenção ordinários. A depreciação atua em segundo plano diminuindo o patrimônio real ano após ano de forma invisível.
            </li>
            <li>
              <strong>Subestimar o tempo de espera e a flutuação dinâmica nos aplicativos:</strong> Em dias chuvosos ou horários de pico, o preço das corridas de aplicativo sobe de forma expressiva (taxa dinâmica), e o tempo de espera pode ser elevado. O carro próprio oferece a segurança e a conveniência de disponibilidade imediata. A análise econômica deve ser ponderada com esses fatores subjetivos.
            </li>
            <li>
              <strong>Desconsiderar o custo do estacionamento e pedágios:</strong> Quem mora ou trabalha em grandes metrópoles pode gastar centenas de reais por mês com estacionamentos privados e valets, valores que sozinhos igualam o custo de várias corridas curtas de aplicativo.
            </li>
          </ul>
        </div>
      </div>

      <FAQ items={[
        {
          question: 'O que é custo de oportunidade do capital do veículo?',
          answer: 'O custo de oportunidade representa o rendimento que o seu dinheiro geraria se estivesse aplicado em um investimento seguro (como o Tesouro Selic ou CDB) em vez de estar imobilizado em um veículo. Ao comprar um carro de R$ 80.000,00 à vista, você deixa de ganhar cerca de R$ 600,00 por mês em rendimentos líquidos — esse valor deve ser somado como custo invisível do veículo.',
        },
        {
          question: 'Qual a diferença de depreciação entre um carro zero-quilômetro e um seminovo?',
          answer: 'Carros zero-quilômetro sofrem a maior taxa de desvalorização justamente ao saírem da concessionária (geralmente entre 15% e 20% de perda no primeiro ano). Carros seminovos (com 2 a 4 anos de uso) já passaram pela curva mais acentuada de desvalorização e depreciam de forma mais suave (cerca de 8% a 10% a.a.), sendo opções financeiramente mais eficientes.',
        },
        {
          question: 'Como calcular o consumo médio real do meu carro?',
          answer: 'Zere o hodômetro parcial (trip) ao encher o tanque de combustível. Rodar normalmente até o próximo reabastecimento. Ao encher o tanque novamente, anote a quantidade exata de litros que coube no tanque e a quilometragem percorrida. Divida a quilometragem pelos litros reabastecidos. Esse é o consumo médio real do seu carro.',
        },
        {
          question: 'Vale a pena alugar carro por assinatura em vez de comprar?',
          answer: 'O carro por assinatura elimina a preocupação com IPVA, seguro, manutenção e depreciação, embutindo tudo em uma mensalidade fixa. Financeiramente, o aluguel por assinatura pode compensar para quem troca de carro a cada 1 ou 2 anos (período de maior desvalorização do veículo zero), mas costuma custar mais caro do que manter um carro seminovo por 5 anos.',
        },
        {
          question: 'O que é o Custo Total de Propriedade (TCO)?',
          answer: 'O TCO (Total Cost of Ownership) é a metodologia contábil que estima todos os custos associados à aquisição, uso e descarte de um ativo. No caso dos automóveis, o TCO é a somatória do preço de compra + juros de financiamento + impostos + seguro + manutenção + combustível + depreciação - preço de revenda final.',
        },
        {
          question: 'Combinar transporte público e aplicativo é viável financeiramente?',
          answer: 'Na maioria dos casos, essa é a alternativa de menor custo absoluto para quem mora em grandes cidades com malha ferroviária e metroviária estruturada. Utilizar o metrô/ônibus para trajetos longos e previsíveis e o aplicativo (Uber) para conexões curtas, compras ou dias de chuva gera uma economia financeira enorme frente a qualquer carro próprio.',
        },
      ]} />

      <SourcesFooter sources={[
        { label: 'FIPE — Tabela de Preços Médios e Índices de Depreciação de Veículos', url: 'https://veiculos.fipe.org.br/' },
        { label: 'ANP — Agência Nacional do Petróleo: Levantamento de Preços de Combustíveis', url: 'https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/serie-historica-de-precos-de-combustiveis' },
        { label: 'Banco Central do Brasil — Histórico de taxas Selic e taxas médias de financiamento', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
        { label: 'SUSEP — Superintendência de Seguros Privados: Estatísticas de sinistros e seguros', url: 'https://www.gov.br/susep/pt-br' }
      ]} />

      <AppCTA context="seu custo de transporte" />
    </div>
  )
}
