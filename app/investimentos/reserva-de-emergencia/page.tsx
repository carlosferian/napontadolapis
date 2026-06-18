import type { Metadata } from 'next'
import { EmergencyFundCalculator } from '@/components/calculators/EmergencyFundCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { FAQ } from '@/components/ui/FAQ'

export const metadata: Metadata = {
  title: 'Calculadora de Reserva de Emergência — Quanto Guardar e Onde',
  description: 'Calcule sua meta de reserva de emergência, veja em quanto tempo você chega lá e onde manter o dinheiro com liquidez e segurança. Sem cadastro.',
  openGraph: {
    title: 'Calculadora de Reserva de Emergência — A Ponta do Lápis',
    description: 'Meta personalizada (3, 6 ou 12 meses), prazo com e sem Selic, e guia de onde guardar com liquidez imediata.',
    url: 'https://apontadolapis.com.br/investimentos/reserva-de-emergencia',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/investimentos/reserva-de-emergencia' },
}

export default function ReservaDeEmergenciaPage() {
  return (
    <div className="space-y-6">

      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          INVESTIMENTOS · PROTEÇÃO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Quanto você precisa de<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>reserva de emergência?</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          A reserva de emergência é o <strong style={{ color: 'var(--c-ink)' }}>primeiro passo de qualquer planejamento financeiro</strong>.
          Veja sua meta personalizada, em quanto tempo você chega lá investindo na Selic e onde manter o dinheiro
          com liquidez imediata. Sem cadastro.
        </p>
      </div>

      <EmergencyFundCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-6">
        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Quantos meses de reserva você precisa?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            O tamanho ideal da reserva depende da <strong>estabilidade da sua renda</strong> e do seu modelo de trabalho:
          </p>
          <ul className="list-disc pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-1">
            <li><strong>Trabalhadores CLT ou Servidores Públicos (3 a 6 meses):</strong> Como possuem maior estabilidade de emprego ou contam com mecanismos de proteção como FGTS, multa rescisória e seguro-desemprego, um colchão equivalente a 3 ou 6 meses dos gastos mensais habituais costuma ser suficiente para acomodar imprevistos.</li>
            <li><strong>Autônomos, Profissionais Liberais ou Empreendedores (6 a 12 meses):</strong> Por terem receitas variáveis e menor proteção legal em caso de interrupção das atividades, necessitam de uma margem de segurança maior. Ter de 6 a 12 meses de despesas cobertas garante a continuidade dos negócios e da vida pessoal durante períodos de baixa demanda.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Exemplo Prático: Acelerando com Juros Compostos</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Imagine que seu custo de vida essencial (aluguel, contas básicas, alimentação, transporte) seja de <strong>R$ 3.000,00</strong> mensais e você definiu uma meta de reserva de <strong>6 meses (totalizando R$ 18.000,00)</strong>.
          </p>
          <ul className="list-disc pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Cenário Sem Rendimento (Debaixo do Colchão):</strong> Se você guardar <strong>R$ 500,00</strong> por mês em dinheiro físico ou em uma conta corrente comum sem rendimento, levará exatamente <strong>36 meses (3 anos)</strong> para alcançar a sua meta.
            </li>
            <li>
              <strong>Cenário Com Rendimento (Investido em Renda Fixa):</strong> Se você aplicar os mesmos R$ 500,00 mensais em uma conta ou título de renda fixa que renda o equivalente a 100% do CDI (atualmente em cerca de <strong>9% a.a. líquido</strong> de impostos), a rentabilidade acumulada fará você atingir os R$ 18.000,00 em aproximadamente <strong>31 meses</strong>.
            </li>
            <li>
              <strong>Economia de tempo:</strong> O poder dos juros compostos poupou <strong>5 meses de esforço de poupança</strong> direta, além de manter o poder de compra do seu dinheiro contra a inflação no período.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">A Matemática do Fundo de Emergência</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 font-mono text-xs italic">
            Meta Financeira = Gastos Mensais Essenciais × Cobertura Desejada (Meses)<br />
            Projeção com Aportes Recorrentes (VF) = P × [((1 + i)ⁿ - 1) / i] + VF_inicial × (1 + i)ⁿ
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Erros Frequentes ao Guardar a Reserva</h2>
          <ul className="list-decimal pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-2">
            <li>
              <strong>Focar excessivamente na rentabilidade:</strong> A reserva de emergência não foi feita para te deixar rico, mas para evitar que você fique pobre. Colocar o dinheiro em fundos de ações, criptoativos ou títulos de renda fixa de longo prazo sem liquidez (CDBs fechados por 3 anos ou Tesouro IPCA+) é um erro grave. No momento da necessidade, você pode não conseguir sacar ou ter que aceitar um prejuízo alto.
            </li>
            <li>
              <strong>Calcular a meta com base no salário líquido, e não nos gastos:</strong> Sua reserva deve cobrir suas <strong>despesas de sobrevivência</strong>, não seus luxos ou a totalidade da sua renda anterior. Se você ganha R$ 5.000, mas gasta R$ 3.500 para viver, sua reserva deve ser baseada nos R$ 3.500. Isso torna a meta mais realista e fácil de ser alcançada no início.
            </li>
            <li>
              <strong>Utilizar a reserva para gastos planejados:</strong> Usar o fundo de emergência para comprar passagens aéreas de férias, trocar de celular ou pagar despesas previsíveis (como IPVA/IPTU) desvirtua a ferramenta. Essas despesas devem estar no seu orçamento anual; a reserva de emergência serve apenas para eventos 100% imprevisíveis e inevitáveis.
            </li>
          </ul>
        </div>
      </div>

      <FAQ items={[
        {
          question: 'O que é liquidez diária e por que ela é indispensável?',
          answer: 'Liquidez diária significa a velocidade com que você consegue converter o investimento de volta em dinheiro na sua conta corrente. Em uma emergência real, você pode precisar do dinheiro em minutos ou horas. Portanto, os ativos da sua reserva devem permitir o resgate imediato (D+0) ou, no máximo, no próximo dia útil (D+1).',
        },
        {
          question: 'A caderneta de poupança ainda é uma boa opção para reserva de emergência?',
          answer: 'Embora a poupança tenha a vantagem da liquidez imediata (inclusive aos fins de semana) e seja isenta de Imposto de Renda, seu rendimento é limitado por lei a 70% da Selic + TR (quando a Selic está acima de 8,5% a.a.). CDBs de liquidez diária ou fundos de investimento com taxa zero rendem significativamente mais e oferecem segurança semelhante.',
        },
        {
          question: 'Como funciona a garantia do Fundo Garantidor de Crédito (FGC)?',
          answer: 'O FGC é uma associação privada sem fins lucrativos que protege os depositantes de instituições financeiras associadas. Em caso de intervenção ou liquidação da instituição (como a falência de um banco médio), o FGC garante o pagamento de até R$ 250.000,00 por CPF e por instituição financeira para saldos em conta corrente, poupança, CDBs, LCI e LCA.',
        },
        {
          question: 'O que é o Tesouro Selic e por que ele é seguro?',
          answer: 'O Tesouro Selic é um título público emitido pelo Governo Federal através do Tesouro Direto. Ele acompanha a taxa básica de juros do país. É considerado o investimento mais seguro da economia nacional porque o risco de crédito (calote) do governo federal é menor do que o risco de qualquer banco privado comercial do país.',
        },
        {
          question: 'Contas digitais remuneradas servem para guardar a reserva?',
          answer: 'Sim, desde que a conta ofereça rendimento automático de pelo menos 100% do CDI com liquidez diária imediata e que o dinheiro esteja aplicado em títulos públicos (como contas de pagamento reguladas) ou coberto pelo FGC (como RDBs/CDBs associados). Exemplos comuns de uso prático são NuConta, Mercado Pago e similares.',
        },
        {
          question: 'Devo quitar dívidas ou montar minha reserva primeiro?',
          answer: 'Geralmente, vale a pena quitar dívidas caras (cartão de crédito, cheque especial) primeiro, pois os juros dessas dívidas são imensamente superiores a qualquer rentabilidade que você consiga investindo a reserva. Contudo, é prudente montar uma mini-reserva básica de pelo menos R$ 1.000,00 antes de destinar 100% do seu esforço para as dívidas, evitando contrair novos empréstimos em caso de imprevistos.',
        },
      ]} />

      <SourcesFooter sources={[
        { label: 'Banco Central do Brasil — Caderno de Educação Financeira: Gestão de Finanças Pessoais', url: 'https://www.bcb.gov.br/nor/relefin/Caderno_de_Educacao_Financeira_Gestao_de_Financas_Pessoais.pdf' },
        { label: 'Tesouro Nacional — Tesouro Selic: características e como investir', url: 'https://www.tesourodireto.com.br/titulos/tipos-de-tesouro/tesouro-selic.htm' },
        { label: 'FGC — Fundo Garantidor de Créditos: limites e garantias para CDB e RDB', url: 'https://www.fgc.org.br' },
        { label: 'Comissão de Valores Mobiliários (CVM) — Portal do Investidor: Conceito de Risco e Liquidez', url: 'https://www.investidor.gov.br/' }
      ]} />

      <AppCTA context="seu planejamento financeiro e reserva de emergência" />
    </div>
  )
}
