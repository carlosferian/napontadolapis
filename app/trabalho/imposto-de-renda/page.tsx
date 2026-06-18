import type { Metadata } from 'next'
import { IRPFCalculator } from '@/components/calculators/IRPFCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { FAQ } from '@/components/ui/FAQ'

export const metadata: Metadata = {
  title: 'Calculadora de Imposto de Renda 2026 — IRPF com Lei dos 5 Mil',
  description: 'Calcule quanto você paga de IR em 2026 com a tabela progressiva atualizada e a Lei dos 5 Mil (Lei 15.270/2025). Veja a alíquota efetiva, detalhamento por faixas e projeção anual.',
  openGraph: {
    title: 'Calculadora IRPF 2026 — A Ponta do Lápis',
    description: 'Tabela progressiva 2026 com Lei dos 5 Mil. Calcule IR mensal, alíquota efetiva e quanto você recebe líquido. Sem cadastro.',
    url: 'https://apontadolapis.com.br/trabalho/imposto-de-renda',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/trabalho/imposto-de-renda' },
}

export default function ImpostoDeRendaPage() {
  return (
    <div className="space-y-6">

      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          TRABALHO · IMPOSTO DE RENDA
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Quanto você paga de<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>imposto de renda?</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Tabela progressiva do IRPF 2026 com a <strong style={{ color: 'var(--c-ink)' }}>Lei dos 5 Mil (Lei nº 15.270/2025)</strong>.
          Veja o IR mensal, a alíquota efetiva, o detalhamento por faixas e quanto você realmente leva para casa.
          Sem cadastro. 100% no seu navegador.
        </p>
      </div>

      <IRPFCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-6">
        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como funciona a tabela progressiva do IRPF 2026</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            O Imposto de Renda Retido na Fonte (IRRF) sobre rendimentos do trabalho assalariado é calculado de forma progressiva no Brasil. Isto significa que a alíquota nominal de imposto aumenta à medida que a base salarial sobe. 
            No entanto, as alíquotas (que vão de 7,5% a 27,5%) não incidem sobre todo o salário bruto. Elas são calculadas por faixas: cada fatia do salário que ultrapassa a faixa anterior é tributada pela alíquota da nova faixa.
          </p>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            A principal novidade legislativa é a <strong>Lei nº 15.270/2025 (conhecida como Lei dos 5 Mil)</strong>. Ela elevou o teto de isenção efetiva para salários mensais brutos de até R$ 5.000,00 e estabeleceu uma <strong>zona de transição suavizada entre R$ 5.000,01 e R$ 7.350,00</strong>. Esse mecanismo de amortecimento impede o "efeito degrau", onde um pequeno aumento salarial faria o trabalhador levar menos dinheiro líquido para casa devido à incidência abrupta de imposto.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Exemplo Prático de Cálculo (Salário de R$ 6.000,00)</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Vamos simular o cálculo passo a passo de um salário bruto de <strong>R$ 6.000,00</strong> em 2026 (sem dependentes e sem dedução simplificada):
          </p>
          <ul className="list-disc pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>1. Contribuição ao INSS:</strong> O INSS é descontado primeiro. Em 2026, para um salário de R$ 6.000,00, a contribuição progressiva ao INSS é de cerca de <strong>R$ 680,00</strong>.
            </li>
            <li>
              <strong>2. Base de cálculo do IRPF:</strong> Subtraindo o INSS, temos a base tributável de <strong>R$ 5.320,00</strong>.
            </li>
            <li>
              <strong>3. Aplicação das faixas de IR (Tabela Progressiva convencional):</strong>
              <br />· Até R$ 2.259,20: Isento (R$ 0,00)
              <br />· De R$ 2.259,21 até R$ 2.826,65: 7,5% sobre R$ 567,45 = R$ 42,56
              <br />· De R$ 2.826,66 até R$ 3.751,05: 15% sobre R$ 924,40 = R$ 138,66
              <br />· De R$ 3.751,06 até R$ 4.664,68: 22,5% sobre R$ 913,63 = R$ 205,57
              <br />· Acima de R$ 4.664,68 (sobre R$ 655,32 restantes): 27,5% = R$ 180,21
              <br />· <strong>IR Brutal Calculado:</strong> R$ 567,00
            </li>
            <li>
              <strong>4. O Redutor da Lei dos 5 Mil:</strong> Como o salário de R$ 6.000 está na faixa de transição (R$ 5.000 a R$ 7.350), a lei aplica um redutor especial que abate parte desse imposto bruto, fazendo com que o IR final a pagar seja de cerca de <strong>R$ 267,00</strong>.
            </li>
            <li>
              <strong>5. Alíquota Efetiva:</strong> O imposto final de R$ 267,00 representa apenas <strong>4,45%</strong> do salário bruto de R$ 6.000,00, provando a diferença crucial entre a faixa marginal (27,5%) e a alíquota real efetiva.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Fórmulas Matemáticas do IRPF</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 font-mono text-xs italic">
            Base de Cálculo (BC) = Salário Bruto - Desconto INSS - (Dependentes × R$ 189,59) - Deduções Adicionais (como Pensão)<br />
            Imposto Bruto = Σ (Base_na_Faixa_j × Alíquota_j)<br />
            Imposto Líquido Retido = Imposto Bruto - Redutor Especial (Lei 15.270/2025)
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Erros Comuns na Análise do Imposto de Renda</h2>
          <ul className="list-decimal pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Confundir alíquota marginal (faixa) com alíquota efetiva (real):</strong> Muitas pessoas acreditam que, ao ter o salário reconfigurado para uma faixa de 27,5%, essa alíquota incidirá sobre todo o salário bruto, reduzindo os ganhos líquidos. Na realidade, o percentual de 27,5% incide apenas sobre o valor que excede a última faixa.
            </li>
            <li>
              <strong>Ignorar o desconto simplificado mensal:</strong> A Receita Federal oferece a dedução simplificada mensal direta na folha (um desconto fixo padrão na base de cálculo). A empresa deve aplicar o modelo que for mais vantajoso para o trabalhador (seja deduções legais com INSS/dependentes ou o desconto simplificado). Nossa calculadora compara ambos automaticamente no Solver.
            </li>
            <li>
              <strong>Não provisionar a declaração de ajuste anual:</strong> O imposto descontado na folha de pagamento todo mês é apenas uma antecipação (daí o nome "Retido na Fonte"). Na declaração anual de ajuste (março/abril do ano seguinte), todas as rendas e despesas dedutíveis (saúde, educação própria e de dependentes) são recalculadas para determinar se há saldo de imposto a restituir ou saldo complementar a pagar.
            </li>
          </ul>
        </div>
      </div>

      <FAQ items={[
        {
          question: 'O que é a Lei dos 5 Mil (Lei nº 15.270/2025)?',
          answer: 'É a legislação federal que isenta do Imposto de Renda as pessoas físicas com rendimentos salariais brutos mensais de até R$ 5.000,00. Para acomodar quem ganha um pouco acima disso e evitar um aumento brusco de imposto, a lei criou uma fórmula de transição atenuada para salários brutos entre R$ 5.000,01 e R$ 7.350,00, diminuindo progressivamente o desconto do redutor especial.',
        },
        {
          question: 'Como a dedução de dependentes diminui o meu imposto de renda retido?',
          answer: 'Cada dependente legal cadastrado (filhos menores de 21 anos, ou até 24 se universitários; cônjuge, etc.) dá direito a um abatimento fixo mensal de R$ 189,59 diretamente da base de cálculo do imposto na folha de pagamento. Com a base menor, o valor de imposto a ser recolhido diminui proporcionalmente.',
        },
        {
          question: 'Qual a diferença entre a Declaração Simplificada e a Declaração por Deduções Legais?',
          answer: 'No ajuste anual, a declaração simplificada aplica um desconto padrão de 20% sobre os rendimentos tributáveis (limitado a um teto anual regulado pela Receita). É ideal para quem não tem dependentes ou gastos altos com saúde e educação. A declaração completa (deduções legais) permite somar individualmente todos os gastos dedutíveis sem limite para despesas médicas e com limites para educação, ideal para famílias ou quem possui despesas elevadas.',
        },
        {
          question: 'PLR (Participação nos Lucros ou Resultados) entra no cálculo do salário comum?',
          answer: 'Não. A PLR possui uma tributação exclusiva na fonte, com tabela própria de faixas e isenções. Ela não se soma ao salário mensal normal do mês do recebimento para cálculo do IRPF progressivo ordinário, sendo recolhida de forma separada na fonte pelo banco ou empresa.',
        },
        {
          question: 'O 13º salário é calculado da mesma forma que os salários mensais?',
          answer: 'Sim, o 13º salário utiliza a mesma tabela progressiva mensal, mas o cálculo e a retenção de imposto são definitivos na fonte (no recebimento da segunda parcela em dezembro). Isso significa que o imposto retido sobre o 13º não pode ser compensado ou reduzido por deduções normais de ajuste na declaração anual.',
        },
        {
          question: 'Como funciona o cálculo progressivo do INSS em conjunto com o IRPF?',
          answer: 'O INSS é calculado primeiro, aplicando as faixas de contribuição progressiva da Previdência Social. O valor final descontado de INSS é deduzido integralmente da sua renda bruta para obtermos a Base de Cálculo do IRPF. O imposto de renda, portanto, incide apenas sobre o salário já livre da contribuição do INSS.',
        },
      ]} />

      <SourcesFooter sources={[
        { label: 'Lei nº 15.270/2025 (Lei dos 5 Mil) — Presidência da República', url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/L15270.htm' },
        { label: 'Tabela Progressiva IRPF 2026 — Receita Federal do Brasil', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026' },
        { label: 'Instrução Normativa RFB nº 2.178/2024 — Regras de Retenção do IRRF', url: 'https://www.gov.br/receitafederal/pt-br' },
        { label: 'Ministério da Previdência Social — Tabelas e Alíquotas de Contribuição ao INSS', url: 'https://www.gov.br/previdencia' }
      ]} />

      <AppCTA context="seu planejamento tributário e financeiro" />
    </div>
  )
}
