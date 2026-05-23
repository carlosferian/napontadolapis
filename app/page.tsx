import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Na Ponta do Lápis — calculadoras financeiras para o brasileiro',
  description: 'Descubra o custo real das suas decisões financeiras. Calculadoras simples, honestas e sem julgamento.',
}

const categories = [
  {
    title: 'Repensar',
    description: 'Onde o dinheiro está escorrendo sem você perceber.',
    color: 'text-category-saving',
    highlight: true,
    items: [
      {
        href: '/apostas',
        emoji: '🎯',
        title: 'Gastos com Apostas',
        subtitle: 'O custo real e o que esse dinheiro renderia em 10 anos.',
        tag: 'viral',
        border: 'border-category-saving',
      },
      {
        href: '/fumo',
        emoji: '🚬',
        title: 'Custo do Fumo',
        subtitle: 'A conta que ninguém faz: o preço de fumar por décadas.',
        tag: null,
        border: 'border-category-saving/40',
      },
      {
        href: '/apostas/probabilidades',
        emoji: '📊',
        title: 'Probabilidades Reais',
        subtitle: 'A matemática crua: qual sua chance real de ganhar?',
        tag: null,
        border: 'border-category-saving/40',
      },
    ]
  },
  {
    title: 'Realizar',
    description: 'Transforme planos abstratos em números concretos.',
    color: 'text-category-dream',
    items: [
      {
        href: '/viagens',
        emoji: '✈️',
        title: 'Viagem dos Sonhos',
        subtitle: 'Câmbio, IOF, Wise e plano de poupança real.',
        tag: 'novo',
        border: 'border-category-dream',
      },
    ]
  },
  {
    title: 'Crescer',
    description: 'A força do tempo a seu favor.',
    color: 'text-category-growth',
    items: [
      {
        href: '/investimentos',
        emoji: '📈',
        title: 'E se eu tivesse investido?',
        subtitle: 'Compare hábitos comuns com Selic e Tesouro.',
        tag: null,
        border: 'border-category-growth',
      },
    ]
  }
]

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <div className="space-y-6 max-w-3xl">
        <div className="inline-block px-3 py-1 bg-brand-pencil/20 text-brand-graphite rounded-full text-xs font-bold uppercase tracking-widest">
          Dinheiro sem Tabu
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold text-brand-graphite tracking-tight font-serif leading-[1.1]">
          A verdade dói,<br/>
          <span className="text-stone-400">mas liberta.</span>
        </h1>
        <p className="text-stone-600 text-xl max-w-2xl font-medium leading-relaxed">
          O <strong>Na Ponta do Lápis</strong> nasceu para uma missão simples: traduzir decisões do dia a dia em números reais. 
          Sem sermão, sem fórmulas mágicas e sem julgamento. 
          <span className="font-hand text-3xl text-brand-graphite block mt-4 leading-tight">É só você, seu hábito e a calculadora.</span>
        </p>
      </div>

      {/* Categories Grid */}
      <div className="space-y-16">
        {categories.map((cat) => (
          <div key={cat.title} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 border-b border-stone-200 pb-4">
              <h2 className={`text-3xl font-bold font-serif ${cat.color}`}>{cat.title}</h2>
              <p className="text-stone-500 font-medium italic">{cat.description}</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className={`bg-white p-8 rounded-[32px] border-2 ${calc.border} group transition-all hover:translate-y-[-6px] card-shadow flex flex-col justify-between min-h-[220px]`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                        {calc.emoji}
                      </div>
                      {calc.tag && (
                        <span className="text-[10px] bg-brand-pencil text-brand-graphite px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-sm">
                          {calc.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-brand-graphite text-xl mb-2 group-hover:underline decoration-brand-pencil underline-offset-4 decoration-2 leading-tight">
                      {calc.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{calc.subtitle}</p>
                  </div>
                  <div className="mt-6 flex items-center text-[10px] font-bold text-stone-400 group-hover:text-brand-graphite transition-colors uppercase tracking-[0.2em]">
                    Abrir calculadora <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Explanation Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center py-16 border-y border-stone-200">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold font-serif text-brand-graphite leading-tight">
            Por que colocar tudo na ponta do lápis?
          </h2>
          <div className="space-y-4 text-stone-600 leading-relaxed">
            <p>
              A maioria das pessoas não sabe quanto gasta porque o cérebro ignora as "pequenas" saídas. 
              R$ 20 aqui, R$ 50 ali... parece nada, até você multiplicar por 12 meses e adicionar os juros que esse dinheiro renderia.
            </p>
            <p className="font-bold text-brand-graphite">
              Nossa filosofia é baseada em três pilares:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-brand-pencil font-bold">01.</span>
                <span><strong>Honestidade Matemática:</strong> Não arredondamos para baixo para te agradar. Os números são o que são.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-pencil font-bold">02.</span>
                <span><strong>Contexto Brasileiro:</strong> Nossas taxas (Selic, CDI, IOF) são atualizadas para a realidade do Brasil.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-pencil font-bold">03.</span>
                <span><strong>Privacidade Total:</strong> Não pedimos seu e-mail, seu CPF ou acesso à sua conta. Seus dados moram no seu navegador.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-brand-pencil/5 p-10 rounded-[60px] border-2 border-brand-pencil/20 rotate-1 hidden md:block">
          <div className="space-y-4 font-hand text-2xl text-stone-700 leading-tight">
            <p>"Eu achava que gastava R$ 200 por mês com apostas."</p>
            <p className="ml-6 text-brand-graphite font-bold">"A calculadora me mostrou que, em 3 anos, eu queimei um carro popular."</p>
            <p className="text-right text-stone-400">— Depoimento real (e dolorido)</p>
          </div>
        </div>
      </div>

      {/* Coming Soon / Newsletter Alternative */}
      <div className="bg-brand-graphite text-brand-paper rounded-[40px] p-10 sm:p-16 relative overflow-hidden text-center space-y-8">
        <div className="relative z-10 space-y-4">
          <h3 className="text-3xl sm:text-5xl font-bold font-serif">O que estamos rabiscando?</h3>
          <p className="text-stone-400 text-lg max-w-xl mx-auto">
            Novas calculadoras estão saindo do papel: Rescisão, Seguro-Desemprego e Pensão Alimentícia.
          </p>
          <div className="pt-4">
            <Link 
              href="https://github.com/carlosferian/napontadolapis" 
              className="inline-block bg-brand-pencil text-brand-graphite font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
            >
              Acompanhe no GitHub ✎
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-32 -mt-32 rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 -ml-32 -mt-32 rounded-full" />
      </div>
    </div>
  )
}
