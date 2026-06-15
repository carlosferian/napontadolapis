import type { Metadata } from 'next'
import { ItbiCalculator } from '@/components/calculators/ItbiCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { AdBanner } from '@/components/AdBanner'

export const metadata: Metadata = {
  title: 'Calculadora de ITBI, Registro e Custos de Cartório de Imóvel',
  description: 'Simule o imposto ITBI municipal e as custas de cartório de notas (escritura) e registro para compra de imóvel à vista ou financiado. Descubra descontos de até 50% por lei.',
  openGraph: {
    title: 'Calculadora de ITBI e Custos de Cartório de Imóveis — A Ponta do Lápis',
    description: 'Calcule as taxas extras de transferência imobiliária à vista ou financiada. Planeje seu orçamento sem surpresas de cartório.',
    url: 'https://apontadolapis.com.br/investimentos/itbi-e-cartorio',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/investimentos/itbi-e-cartorio' },
}

export default function ItbiPage() {
  return (
    <div className="space-y-6">
      
      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex', backgroundColor: 'var(--c-emerald-soft)', color: 'var(--c-emerald)' }}>
          IMÓVEIS · PLANEJAMENTO DE AQUISIÇÃO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Impostos e custos de cartório<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>na transferência do imóvel.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Comprar um imóvel vai muito além do valor de venda cobrado pelo proprietário.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Calcule com precisão as taxas do imposto ITBI municipal, escritura pública e registro imobiliário para compras à vista ou financiadas.</strong>{' '}
          A matemática legal e transparente da sua transação patrimonial, livre de surpresas.
        </p>
      </div>

      <ItbiCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-6">
        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">O que é o ITBI e quem deve pagar?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            O <strong>ITBI (Imposto de Transmissão de Bens Imóveis)</strong> é um tributo municipal obrigatório, regido pelo Artigo 156 da Constituição Federal. Ele é cobrado pelas prefeituras sempre que ocorre a compra e venda de um bem imóvel de forma onerosa (ou seja, quando há pagamento). A lei determina que o pagamento do imposto é de responsabilidade do <strong>comprador do imóvel</strong>, e o registro de transferência no cartório só pode ser finalizado após a comprovação de quitação da guia de ITBI emitida pela prefeitura local.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como funciona o desconto de 50% nas custas do cartório?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            A Lei Federal nº 6.015, de 1973 (Lei de Registros Públicos), em seu Artigo 290, assegura um benefício financeiro robusto para o cidadão: quem está adquirindo o seu <strong>primeiro imóvel residencial financiado pelo SFH (Sistema Financeiro de Habitação)</strong> tem direito a um <strong>desconto de 50% sobre os emolumentos de cartório</strong> para o ato de Registro do Imóvel. Para obter esse desconto legal, o comprador deve solicitar formalmente ao cartório de registro e declarar, sob as penas da lei, que se trata de sua primeira aquisição residencial financiada.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Financiamento Imobiliário precisa de Escritura Pública?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Esta é uma das grandes vantagens financeiras de financiar um imóvel: <strong>não há necessidade de pagar taxas para lavrar uma Escritura Pública de compra e venda</strong> no Tabelionato de Notas. Pelo Artigo 61 da Lei nº 4.380/64, o <strong>contrato assinado com o banco tem força legal de Escritura Pública</strong>. Esse contrato é levado diretamente ao Cartório de Registro de Imóveis para averbação, resultando em uma economia automática de milhares de reais (cerca de 1% do valor do imóvel) que seriam gastos com custas notariais em uma transação puramente à vista.
          </p>
        </div>
      </div>

      {/* Bloco de anúncio discreto antes do rodapé de fontes */}
      <AdBanner slot="9876543210" format="horizontal" />

      <SourcesFooter sources={[
        { label: 'Senado Federal — Artigo 156 da Constituição Federal de 1988 (Regulamento de tributos municipais ITBI)', url: 'https://www.senado.leg.br/' },
        { label: 'Planalto — Artigo 290 da Lei de Registros Públicos nº 6.015/73 (Desconto para primeira habitação)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l6015compilado.htm' },
        { label: 'Planalto — Artigo 61 da Lei nº 4.380/64 (Força de escritura pública dos contratos bancários de habitação)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l4380.htm' }
      ]} />
      
      <AppCTA context="seu planejamento de custos imobiliários e taxas de cartório" />
    </div>
  )
}
