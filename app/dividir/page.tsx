import type { Metadata } from 'next'
import { SplitBillCalculator } from '@/components/calculators/SplitBillCalculator'

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
      <SplitBillCalculator />
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-brand-ink">Sobre a calculadora</h2>
        <p className="text-brand-muted text-sm leading-relaxed">
          Divisão simples e igual entre todos. Digite o total, selecione a gorjeta (opcional)
          e adicione os nomes de quem vai pagar. O app A Ponta do Lápis, em desenvolvimento
          para Android, vai além: foto do cardápio, divisão por item e cálculo individualizado com IA.
        </p>
      </div>
    </div>
  )
}
