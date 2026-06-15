import type { Metadata } from 'next'
import { SplitBillCalculator } from '@/components/calculators/SplitBillCalculator'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Dividir a Conta — Calculadora de rateio por pessoa',
  description: 'Divida a conta do restaurante sem discussão. Adicione os nomes, escolha a gorjeta e pronto. Sem julgamento, só a matemática.',
  openGraph: {
    title: 'Dividir a Conta — A Ponta do Lápis',
    description: 'Sem discussão. Só a matemática.',
    url: 'https://apontadolapis.com.br/dividir',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/dividir' },
}

export default function DividirPage() {
  return (
    <div className="space-y-6">

      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill c-pill-blue" style={{ marginBottom: 16, display: 'inline-flex' }}>
          SOCIAL · DIVIDIR CONTA
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Sem discussão.<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>Só a matemática.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Rateio por pessoa com gorjeta. Sem constrangimento, sem quem pagou mais ou menos.
          Funciona no celular, sem precisar instalar nada.
        </p>
      </div>

      <SplitBillCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como funciona o rateio</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          A calculadora faz a divisão <strong>simples e igual</strong> entre todas as pessoas: soma o valor
          total da conta, aplica a gorjeta escolhida (10% é o padrão sugerido em boa parte dos
          restaurantes, mas é opcional e pode ser ajustada) e divide o resultado pelo número de
          pessoas adicionadas. O valor por pessoa é arredondado para facilitar o pagamento via Pix
          ou dinheiro, sem casas decimais difíceis de acertar.
        </p>
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">A gorjeta é obrigatória?</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Não. No Brasil, a chamada "taxa de serviço" de 10% incluída na conta é, segundo o Código
          de Defesa do Consumidor, uma <strong>cobrança opcional</strong> — o cliente pode recusar
          o pagamento sem qualquer justificativa, embora seja uma forma importante de remunerar
          garçons e equipe de salão. A Lei da Gorjeta (nº 13.419/2017) regulamenta o repasse desses
          valores aos trabalhadores quando cobrados. A calculadora permite zerar, reduzir ou
          aumentar a porcentagem livremente, conforme o atendimento recebido.
        </p>
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Quando a divisão igual não é justa</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          A divisão igual funciona bem quando todos consomem aproximadamente o mesmo. Em grupos
          onde uma pessoa pediu só uma água e outra pediu prato principal, bebida e dessert, a
          divisão igual pode parecer injusta. Nesses casos, a alternativa é a divisão por item
          (cada um paga exatamente o que consumiu, mais a gorjeta proporcional), recurso que está
          em desenvolvimento no app A Ponta do Lápis para Android.
        </p>
      </div>

      <SourcesFooter sources={[
        { label: 'Planalto — Lei da Gorjeta nº 13.419/2017 (Regulamentação e repasse de taxas de serviço)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13419.htm' },
        { label: 'Código de Defesa do Consumidor — Cobrança opcional de taxa de serviço (Art. 39, V)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm' }
      ]} />
    </div>
  )
}
