import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Na Ponta do Lápis — calculadoras financeiras para o brasileiro',
  description: 'Descubra o custo real das suas decisões financeiras. Calculadoras simples, honestas e sem julgamento.',
}

const categories = [
  {
    title: 'Realizar',
    description: 'Planeje o que traz felicidade.',
    color: 'text-category-dream',
    items: [
      {
        href: '/viagens',
        emoji: '✈️',
        title: 'Viagem dos Sonhos',
        subtitle: 'Câmbio, IOF, Wise e plano de poupança.',
        tag: 'novo',
        border: 'border-category-dream',
      },
    ]
  },
  {
    title: 'Crescer',
    description: 'Faça seu dinheiro trabalhar por você.',
    color: 'text-category-growth',
    items: [
      {
        href: '/investimentos',
        emoji: '📈',
        title: 'E se eu tivesse investido?',
        subtitle: 'Compare apostas com Selic e Tesouro.',
        tag: null,
        border: 'border-category-growth',
      },
    ]
  },
  {
    title: 'Repensar',
    description: 'Onde o dinheiro está escorrendo.',
    color: 'text-category-saving',
    items: [
      {
        href: '/apostas',
        emoji: '🎯',
        title: 'Gastos com Apostas',
        subtitle: 'O custo real e o rendimento perdido.',
        tag: 'popular',
        border: 'border-category-saving',
      },
      {
        href: '/apostas/probabilidades',
        emoji: '📊',
        title: 'Probabilidades Reais',
        subtitle: 'A matemática por trás do lucro.',
        tag: null,
        border: 'border-category-saving/40',
      },
      {
        href: '/fumo',
        emoji: '🚬',
        title: 'Custo do Fumo',
        subtitle: 'Quanto custa fumar em 10, 20 e 30 anos.',
        tag: null,
        border: 'border-category-saving/40',
      },
    ]
  }
]

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      <div className="space-y-4 max-w-2xl">
        <div className="inline-block px-3 py-1 bg-brand-pencil/20 text-brand-graphite rounded-full text-xs font-bold uppercase tracking-widest">
          Simplificando a Vida
        </div>
        <h1 className="text-5xl font-bold text-brand-graphite tracking-tight font-serif leading-tight">
          Os números não mentem.<br/>
          <span className="text-stone-400">A gente só mostra eles.</span>
        </h1>
        <p className="text-stone-600 text-lg max-w-lg font-medium">
          Calculadoras financeiras honestas que traduzem decisões do dia a dia em realidade. 
          <span className="font-hand text-2xl text-brand-graphite ml-2 leading-none block sm:inline mt-2 sm:mt-0">Sem sermão, só a conta.</span>
        </p>
      </div>

      <div className="space-y-10">
        {categories.map((cat) => (
          <div key={cat.title} className="space-y-4">
            <div className="flex items-baseline gap-3 border-b border-stone-200 pb-2">
              <h2 className={`text-2xl font-bold font-serif ${cat.color}`}>{cat.title}</h2>
              <p className="text-stone-400 text-sm italic">{cat.description}</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {cat.items.map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className={`bg-white p-6 rounded-2xl border-2 ${calc.border} group transition-all hover:translate-y-[-4px] card-shadow flex flex-col justify-between min-h-[160px]`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-4xl">{calc.emoji}</span>
                      {calc.tag && (
                        <span className="text-[10px] bg-brand-pencil text-brand-graphite px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                          {calc.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-brand-graphite text-lg mb-1 group-hover:underline decoration-brand-pencil underline-offset-4 decoration-2">
                      {calc.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-snug">{calc.subtitle}</p>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-bold text-stone-400 group-hover:text-brand-graphite transition-colors uppercase tracking-widest">
                    Ver calculadora <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-pencil/10 border-2 border-brand-pencil border-dashed rounded-3xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-brand-graphite text-xs font-bold uppercase tracking-widest mb-2">Bloco de Notas</p>
          <h3 className="text-2xl font-bold font-serif text-brand-graphite mb-4">O que vem por aí?</h3>
          <p className="text-stone-700 max-w-md leading-relaxed">
            Estamos rabiscando novas calculadoras: rescisão trabalhista, seguro-desemprego, 
            prescrição de dívidas e pensão alimentícia.
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12 select-none">✎</div>
      </div>
    </div>
  )
}
