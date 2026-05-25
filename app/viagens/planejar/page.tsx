import type { Metadata } from 'next'
import { TravelCalculator } from '@/components/calculators/TravelCalculator'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Calculadora da Viagem dos Sonhos — Planeje qualquer destino',
  description: 'Calcule o custo real de qualquer viagem em reais, compare cartão tradicional com fintech e saiba quanto poupar por mês. Sem ilusão, sem susto.',
  openGraph: {
    title: 'Calculadora da Viagem dos Sonhos — A Ponta do Lápis',
    description: 'Você sonha com a viagem. A gente faz a conta.',
    url: 'https://apontadolapis.com.br/viagens/planejar',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/viagens/planejar' },
}

export default function PlanejarPage() {
  return (
    <div className="space-y-6">
      <TravelCalculator />
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-stone-700">Como funciona o cálculo</h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          O custo diário inclui hospedagem, alimentação, transporte local e atividades, estimado por
          pessoa por dia em dólares. O voo é calculado em reais (round trip de GRU/CGH). O cartão
          tradicional aplica IOF de 3,38% (Decreto 11.322/2022) mais spread bancário médio de 4%. A fintech (Wise, Nomad)
          aplica apenas cerca de 1,5% de taxa, sem IOF. A meta inclui 15% de margem de segurança.
          O plano de poupança usa a fórmula PMT de anuidade com a taxa Selic.
        </p>
      </div>
      <SourcesFooter sources={[
        { label: 'Decreto 11.322/2022 — IOF sobre operações de câmbio com cartão no exterior (3,38%)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/D11322.htm' },
        { label: 'BCB — Taxa Selic para referência do plano de poupança', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
        { label: 'Banco Central — Câmbio e IOF sobre operações financeiras no exterior', url: 'https://www.bcb.gov.br/acessoinformacao/legado?url=https%3A%2F%2Fwww.bcb.gov.br%2Frex%2Fiof%2Fport%2Flegislacao.asp' },
        { label: 'Wikipedia — Fórmula PMT (valor presente de anuidade ordinária)', url: 'https://pt.wikipedia.org/wiki/Valor_presente_l%C3%ADquido' },
      ]} />
    </div>
  )
}
