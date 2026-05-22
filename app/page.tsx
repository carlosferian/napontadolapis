import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Na Ponta do Lápis — calculadoras financeiras para o brasileiro',
  description: 'Descubra o custo real das suas decisões financeiras. Calculadoras simples, honestas e sem julgamento.',
}

const calculators = [
  {
    href: '/viagens',
    emoji: '✈️',
    title: 'Viagem dos Sonhos',
    subtitle: 'Quanto custa viajar — câmbio, IOF, Wise e plano de poupança.',
    tag: 'novo',
    bg: 'bg-blue-950',
    accent: 'text-blue-300',
  },
  {
    href: '/apostas',
    emoji: '🎯',
    title: 'Gastos com Apostas',
    subtitle: 'Quanto você já apostou — e o que esse dinheiro renderia.',
    tag: 'popular',
    bg: 'bg-stone-900',
    accent: 'text-amber-400',
  },
  {
    href: '/apostas/probabilidades',
    emoji: '📊',
    title: 'Probabilidades Reais',
    subtitle: 'A chance matemática de lucrar com apostas esportivas.',
    tag: null,
    bg: 'bg-purple-950',
    accent: 'text-purple-300',
  },
  {
    href: '/investimentos',
    emoji: '📈',
    title: 'E se eu tivesse investido?',
    subtitle: 'Compare apostas com poupança, Selic e Tesouro Direto.',
    tag: null,
    bg: 'bg-emerald-950',
    accent: 'text-emerald-300',
  },
  {
    href: '/fumo',
    emoji: '🚬',
    title: 'Custo do Fumo',
    subtitle: 'Quanto custa fumar por mês, ano e em 30 anos.',
    tag: null,
    bg: 'bg-orange-950',
    accent: 'text-orange-300',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-3xl font-bold">·</span>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">na ponta do lápis</h1>
        </div>
        <p className="text-stone-500 text-lg italic">os números não mentem. a gente só mostra eles.</p>
        <p className="text-stone-400 text-sm max-w-lg">
          Calculadoras financeiras que traduzem decisões do dia a dia em números reais.
          Sem julgamento, sem sermão — só a conta.
        </p>
      </div>

      <div className="grid gap-3">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className={`${calc.bg} rounded-2xl p-5 flex items-center gap-4 group transition-opacity hover:opacity-90`}
          >
            <span className="text-3xl">{calc.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className={`font-bold ${calc.accent} text-base`}>{calc.title}</h2>
                {calc.tag && (
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                    {calc.tag}
                  </span>
                )}
              </div>
              <p className="text-stone-400 text-sm mt-0.5 leading-snug">{calc.subtitle}</p>
            </div>
            <span className="text-stone-600 group-hover:text-stone-400 transition-colors">→</span>
          </Link>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
        <p className="text-amber-800 text-sm font-medium mb-1">Em breve</p>
        <p className="text-amber-700 text-sm">
          Calculadoras de rescisão trabalhista, seguro-desemprego, prescrição de dívidas,
          pensão alimentícia e muito mais.
        </p>
      </div>
    </div>
  )
}
