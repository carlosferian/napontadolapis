import type { Metadata } from 'next'
import Link from 'next/link'
import {
  TrendingDown,
  Cigarette,
  PieChart,
  Compass,
  TrendingUp,
  Users,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'A Ponta do Lápis — calculadoras financeiras gratuitas para o brasileiro',
  description: 'Calculadoras financeiras gratuitas: custo de apostas, cigarro, vape, viagens com câmbio e IOF, dividir conta e comparativo de investimentos. Sem cadastro.',
}

type CalcItem = {
  href: string
  Icon: LucideIcon
  iconColor: string
  title: string
  subtitle: string
  tag?: string
  accentClass: string
}

type Category = {
  title: string
  description: string
  labelColor: string
  items: CalcItem[]
}

const categories: Category[] = [
  {
    title: 'Repensar',
    description: 'Onde o dinheiro está escorrendo sem você perceber.',
    labelColor: 'text-category-saving',
    items: [
      {
        href: '/apostas',
        Icon: TrendingDown,
        iconColor: '#C83333',
        title: 'Gastos com Apostas',
        subtitle: 'O custo real e o que esse dinheiro renderia em 10 anos.',
        tag: 'mais acessado',
        accentClass: 'hover:border-category-saving/60',
      },
      {
        href: '/fumo',
        Icon: Cigarette,
        iconColor: '#C83333',
        title: 'Custo do Fumo',
        subtitle: 'A conta que ninguém faz: o preço de fumar por décadas.',
        accentClass: 'hover:border-category-saving/40',
      },
      {
        href: '/apostas/probabilidades',
        Icon: PieChart,
        iconColor: '#C83333',
        title: 'Probabilidades Reais',
        subtitle: 'A matemática crua: qual sua chance real de ganhar?',
        accentClass: 'hover:border-category-saving/40',
      },
    ],
  },
  {
    title: 'Realizar',
    description: 'Transforme planos abstratos em números concretos.',
    labelColor: 'text-category-dream',
    items: [
      {
        href: '/viagens',
        Icon: Compass,
        iconColor: '#0A8A7E',
        title: 'Viagem dos Sonhos',
        subtitle: 'Câmbio, IOF, Wise e plano de poupança real.',
        tag: 'novo',
        accentClass: 'hover:border-category-dream/60',
      },
      {
        href: '/dividir',
        Icon: Users,
        iconColor: '#0A8A7E',
        title: 'Dividir a Conta',
        subtitle: 'Rateio por pessoa com gorjeta. Sem discussão, só a matemática.',
        accentClass: 'hover:border-category-dream/40',
      },
    ],
  },
  {
    title: 'Crescer',
    description: 'A força do tempo a seu favor.',
    labelColor: 'text-category-growth',
    items: [
      {
        href: '/investimentos',
        Icon: TrendingUp,
        iconColor: '#1A5E40',
        title: 'E se eu tivesse investido?',
        subtitle: 'Compare hábitos comuns com Selic e Tesouro.',
        accentClass: 'hover:border-category-growth/60',
      },
    ],
  },
]

export default function HomePage() {
  return (
    <div className="space-y-20 pb-24">

      {/* Hero */}
      <section className="space-y-7 max-w-3xl pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-surface border border-brand-border rounded-full text-xs font-semibold text-brand-muted tracking-wide uppercase shadow-sm">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, #1A5E40, #00C4BE)' }}
          />
          Dinheiro sem Tabu
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold text-brand-ink tracking-tight font-serif leading-[1.05]">
          A verdade dói,
          <br />
          <span className="text-brand-muted font-normal italic">mas liberta.</span>
        </h1>

        <p className="text-brand-muted text-lg max-w-xl leading-relaxed">
          O <strong className="text-brand-ink font-semibold">A Ponta do Lápis</strong> traduz
          decisões do dia a dia em números reais. Sem sermão, sem fórmulas mágicas, sem julgamento.
        </p>

        <p className="text-brand-ink font-serif italic text-2xl font-medium leading-snug">
          "É só você, seu hábito e a calculadora."
        </p>
      </section>

      {/* Categories */}
      <div className="space-y-16">
        {categories.map((cat) => (
          <section key={cat.title} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4 border-b border-brand-border pb-4">
              <h2 className={`text-2xl font-bold font-serif ${cat.labelColor}`}>
                {cat.title}
              </h2>
              <p className="text-brand-muted text-sm font-medium">{cat.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className={`bg-brand-surface p-7 rounded-2xl border border-brand-border ${calc.accentClass} group transition-all duration-200 hover:-translate-y-1 card-shadow hover:card-shadow-hover flex flex-col justify-between min-h-[210px]`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${calc.iconColor}14` }}
                      >
                        <calc.Icon
                          size={20}
                          style={{ color: calc.iconColor }}
                          strokeWidth={1.75}
                        />
                      </div>
                      {calc.tag && (
                        <span
                          className="text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider"
                          style={{
                            background: 'linear-gradient(135deg, #1A5E40, #00C4BE)',
                            color: '#fff',
                          }}
                        >
                          {calc.tag}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-brand-ink text-base mb-1.5 leading-snug group-hover:text-brand-teal transition-colors">
                      {calc.title}
                    </h3>
                    <p className="text-brand-muted text-sm leading-relaxed">{calc.subtitle}</p>
                  </div>

                  <div className="mt-5 flex items-center gap-1 text-[11px] font-semibold text-brand-muted group-hover:text-brand-teal transition-colors uppercase tracking-widest">
                    Abrir calculadora
                    <ArrowRight
                      size={12}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Philosophy section */}
      <section className="grid md:grid-cols-2 gap-12 items-start py-16 border-y border-brand-border">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold font-serif text-brand-ink leading-tight">
            Por que colocar tudo<br />
            <span className="italic font-normal text-brand-muted">a ponta do lápis?</span>
          </h2>
          <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
            <p>
              A maioria das pessoas não sabe quanto gasta porque o cérebro ignora as
              "pequenas" saídas. R$ 20 aqui, R$ 50 ali... parece nada, até você multiplicar
              por 12 meses e somar os juros que esse dinheiro renderia.
            </p>
            <p className="font-semibold text-brand-ink text-sm">Nossa filosofia tem três alicerces:</p>
            <ul className="space-y-4">
              {[
                {
                  n: '01',
                  title: 'Honestidade Matemática',
                  body: 'Não arredondamos para baixo para te agradar. Os números são o que são.',
                },
                {
                  n: '02',
                  title: 'Contexto Brasileiro',
                  body: 'Nossas taxas — Selic, CDI, IOF — refletem a realidade do Brasil de hoje.',
                },
                {
                  n: '03',
                  title: 'Privacidade Total',
                  body: 'Não pedimos e-mail, CPF nem acesso à conta. Seus dados ficam só no seu navegador.',
                },
              ].map((item) => (
                <li key={item.n} className="flex gap-4">
                  <span
                    className="text-xs font-bold pt-0.5 flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #1A5E40, #00C4BE)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {item.n}
                  </span>
                  <span className="text-brand-muted">
                    <strong className="text-brand-ink font-semibold">{item.title}:</strong>{' '}
                    {item.body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-brand-surface rounded-2xl border border-brand-border p-8 shadow-sm hidden md:block">
          <div
            className="w-1 h-16 rounded-full mb-6"
            style={{ background: 'linear-gradient(to bottom, #1A5E40, #00C4BE)' }}
          />
          <blockquote className="space-y-3">
            <p className="font-serif italic text-xl text-brand-ink leading-relaxed font-medium">
              "Eu achava que gastava R$ 200 por mês com apostas. A calculadora me mostrou
              que, em 3 anos, queimei um carro popular."
            </p>
            <footer className="text-xs text-brand-muted font-medium pt-2">
              — Depoimento real (e dolorido)
            </footer>
          </blockquote>
        </div>
      </section>

      {/* App announcement */}
      <section
        id="app"
        className="rounded-3xl p-10 sm:p-14 border space-y-8"
        style={{ background: 'linear-gradient(145deg, #0D1A2A 0%, #122030 100%)', borderColor: '#1E3040' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#00C4BE' }}
          />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#00C4BE' }}>
            App em desenvolvimento — Android
          </span>
        </div>

        <div className="space-y-3 max-w-2xl">
          <h3 className="text-3xl sm:text-4xl font-bold font-serif text-white leading-tight">
            A Ponta do Lápis<br />
            <span className="italic font-normal" style={{ color: '#00C4BE' }}>no seu bolso.</span>
          </h3>
          <p className="text-white/50 text-base leading-relaxed">
            Calculadoras pontuais são o ponto de partida. O app é para quem quer acompanhar
            o mês inteiro — cada gasto, cada entrada, cada meta. A mesma honestidade matemática
            do site, agora como rotina diária.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 gap-3">
          {[
            'Lance despesas em segundos — com ou sem câmera, com ou sem IA',
            'Divida a conta da mesa sem discussão',
            'Veja para onde o dinheiro vai, com gráficos que não mentem',
            'Defina limites por categoria e receba alertas antes de estourar',
            'Importe sua fatura inteira de uma vez',
            'Sem sincronização em nuvem. Sem e-mail. Sem CPF.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-white/40">
              <span className="mt-1 shrink-0 text-xs" style={{ color: '#00C4BE' }}>·</span>
              {item}
            </li>
          ))}
        </ul>

        <p className="text-white/20 text-xs italic">sem data prometida — só quando estiver bom.</p>
      </section>

      {/* Coming soon */}
      <section
        className="rounded-3xl p-10 sm:p-16 relative overflow-hidden text-center space-y-8"
        style={{ background: 'linear-gradient(145deg, #172030 0%, #1A3A2A 100%)' }}
      >
        <div className="relative z-10 space-y-5">
          <h3 className="text-3xl sm:text-5xl font-bold font-serif text-white leading-tight">
            O que estamos<br />
            <span
              className="italic font-normal"
              style={{
                background: 'linear-gradient(90deg, #0D8B72, #00C4BE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              rabiscando?
            </span>
          </h3>
          <p className="text-white/50 text-base max-w-sm mx-auto leading-relaxed">
            Novas calculadoras saindo do papel: Rescisão, Seguro-Desemprego e Pensão Alimentícia.
          </p>
          <div className="pt-2">
            <Link
              href="https://github.com/carlosferian/napontadolapis"
              className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #1A5E40, #00C4BE)',
                color: '#fff',
              }}
            >
              Acompanhe no GitHub
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div
          className="absolute top-0 right-0 w-72 h-72 -mr-24 -mt-24 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #00C4BE, transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 -ml-24 -mb-24 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1A5E40, transparent)' }}
        />
      </section>
    </div>
  )
}
