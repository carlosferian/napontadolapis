import type { Metadata } from 'next'
import { ParceladoCalculator } from '@/components/calculators/ParceladoCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Calculadora Parcelado ou À Vista — Juros Embutidos Ocultos',
  description: 'Descubra a taxa de juros implícita real embutida no parcelamento "sem juros" em comparação ao desconto oferecido para pagamento à vista. Evite juros ocultos.',
  openGraph: {
    title: 'Simulador Parcelado ou À Vista (Juros Ocultos) — A Ponta do Lápis',
    description: 'Descubra se o parcelamento "sem juros" do varejo na verdade esconde uma taxa de financiamento abusiva em relação ao desconto Pix ou Boleto.',
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

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como funciona o Juro Embutido no Parcelamento?</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Embora muitas lojas anunciem a opção de parcelar em "10x sem juros" ou "12x sem juros", a existência de um preço à vista menor (com desconto de 5%, 10% ou 15% no Pix ou boleto bancário) é a prova matemática definitiva de que o parcelamento tem, sim, um custo financeiro cobrado nas sombras.
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          <strong>A Matemática por Trás do Solver:</strong>
          Para deduzir essa taxa de juros mensal invisível, utilizamos a fórmula do Valor Presente da Anuidade (regra padrão de matemática financeira). O sistema calcula a Taxa Interna de Retorno (TIR) que iguala o fluxo de parcelas mensais ao preço com desconto à vista.
        </p>
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Custo de Oportunidade: Quando vale a pena parcelar ou pagar à vista?</h2>
        <ul className="text-stone-500 dark:text-stone-400 text-sm list-disc pl-5 space-y-1">
          <li>
            <strong>Quando pagar à vista:</strong> Se a taxa de juros implícita calculada for **superior à rentabilidade líquida do seu dinheiro** investido (como o CDI ou a Poupança). Quitar o produto à vista equivale a obter um rendimento livre de imposto de renda igual à taxa de juros economizada.
          </li>
          <li>
            <strong>Quando parcelar:</strong> Se o desconto à vista for extremamente pequeno ou inexistente (gerando uma taxa de juros próxima a 0% a.m.). Nesses cenários, parcelar é matematicamente vantajoso, pois permite que o seu dinheiro principal continue rendendo na sua conta corrente ao longo dos meses enquanto você paga as parcelas de forma suave.
          </li>
        </ul>
      </div>

      <SourcesFooter sources={[
        { label: 'Banco Central do Brasil — Custo Efetivo Total (CET) de Operações', url: 'https://www.bcb.gov.br/' },
        { label: 'Código de Defesa do Consumidor — Transparência de Preços no Varejo', url: 'http://www.planalto.gov.br/' },
        { label: 'CVM — Princípios de Matemática Financeira e Desconto de Recebíveis', url: 'https://www.gov.br/cvm/' },
      ]} />
      
      <AppCTA context="suas compras conscientes e decisões de consumo sem juros embutidos" />
    </div>
  )
}
