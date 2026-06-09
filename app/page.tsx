import type { Metadata } from 'next'
import Link from 'next/link'
import { MARKET_DATA } from '@/config/market'

export const metadata: Metadata = {
  title: 'A Ponta do Lápis — calculadoras financeiras gratuitas para o brasileiro',
  description: 'Calculadoras financeiras gratuitas: custo de apostas, cigarro, vape, viagens com câmbio e IOF, dividir conta e comparativo de investimentos. Sem cadastro.',
}

const calcs = [
  {
    href: '/apostas',
    eyebrow: 'HÁBITOS · MAIS ACESSADO',
    title: 'Gastos com Apostas',
    body: 'Quanto você queima por mês e o que esse dinheiro viraria em 10 anos de Selic.',
    pill: 'APOSTAS',
    pillVariant: 'c-pill-copper',
    accent: 'var(--c-copper)',
  },
  {
    href: '/fumo',
    eyebrow: 'HÁBITOS',
    title: 'Custo do Fumo',
    body: 'A conta que ninguém faz: o preço de fumar por décadas.',
    pill: 'CIGARRO',
    pillVariant: 'c-pill-copper',
    accent: 'var(--c-copper)',
  },
  {
    href: '/apostas/probabilidades',
    eyebrow: 'MATEMÁTICA',
    title: 'Probabilidades Reais',
    body: 'A matemática crua: qual sua chance real de ganhar? Spoiler: a casa não é burra.',
    pill: 'ODDS',
    pillVariant: 'c-pill-copper',
    accent: 'var(--c-copper)',
  },
  {
    href: '/viagens',
    eyebrow: 'SONHOS · NOVO',
    title: 'Viagem dos Sonhos',
    body: 'Câmbio, IOF, Wise e plano de poupança real para chegar lá.',
    pill: 'VIAGENS',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-blue-calm)',
  },
  {
    href: '/viagens/custo-de-vida',
    eyebrow: 'GEOGRAFIA · NOVO',
    title: 'Custo de Vida entre Cidades',
    body: 'Compare o custo de vida real entre mais de 30 cidades brasileiras para planejar sua mudança ou trabalho remoto.',
    pill: 'CUSTO DE VIDA',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-blue-calm)',
  },
  {
    href: '/dividir',
    eyebrow: 'SOCIAL',
    title: 'Dividir a Conta',
    body: 'Rateio com gorjeta. Sem discussão, só a matemática.',
    pill: 'DIVIDIR',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-blue-calm)',
  },
  {
    href: '/investimentos',
    eyebrow: 'CRESCER',
    title: 'E se tivesse investido?',
    body: 'Compare hábitos do cotidiano com Selic, CDI e Tesouro. O dinheiro trabalha — ou some.',
    pill: 'INVESTIMENTOS',
    pillVariant: '',
    accent: 'var(--c-emerald)',
  },
  {
    href: '/juros-compostos',
    eyebrow: 'CRESCER · SIMULADOR',
    title: 'Juros Compostos',
    body: 'Projete o crescimento de seus aportes mensais e visualize o efeito bola de neve.',
    pill: 'JUROS COMPOSTOS',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-emerald)',
  },
  {
    href: '/trabalho/realidade-brasileira',
    eyebrow: 'TRABALHO · NOVO',
    title: 'Realidade Brasileira',
    body: 'Onde seu salário líquido te posiciona na pirâmide da desigualdade social brasileira.',
    pill: 'REALIDADE BR',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-emerald)',
  },
  {
    href: '/trabalho/seguro-desemprego',
    eyebrow: 'TRABALHO · 2026',
    title: 'Seguro-Desemprego & Pista',
    body: 'Projete suas parcelas oficiais de 2026 e planeje sua pista financeira de transição pós-demissão.',
    pill: 'SEGURO',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-emerald)',
  },
  {
    href: '/trabalho/imposto-de-renda',
    eyebrow: 'TRABALHO · NOVO',
    title: 'Imposto de Renda 2026',
    body: 'Quanto você paga de IR com a tabela progressiva e a Lei dos 5 Mil? Veja IR mensal, alíquota efetiva e projeção anual.',
    pill: 'IRPF',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-emerald)',
  },
  {
    href: '/trabalho/rescisao',
    eyebrow: 'TRABALHO · NOVO',
    title: 'Rescisão Trabalhista CLT',
    body: 'Projete detalhadamente todos os proventos, férias, 13º proporcional e descontos de INSS/IRRF da sua demissão.',
    pill: 'RESCISÃO',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-emerald)',
  },
  {
    href: '/investimentos/viver-de-renda',
    eyebrow: 'CRESCER · NOVO',
    title: 'Viver de Renda',
    body: 'Planeje sua aposentadoria: altere qualquer campo e o sistema calcula e projeta juros ou tempo de retirada automaticamente.',
    pill: 'VIVER DE RENDA',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-emerald)',
  },
  {
    href: '/investimentos/amortizacao',
    eyebrow: 'CRESCER · NOVO · VIRAL',
    title: 'Amortizar Financiamento',
    body: 'Simule quitação acelerada de imóveis ou veículos. Veja na tela quanto economizará de juros e anos de boleto do banco.',
    pill: 'AMORTIZAÇÃO',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-emerald)',
  },
  {
    href: '/investimentos/itbi-e-cartorio',
    eyebrow: 'IMÓVEIS · NOVO',
    title: 'ITBI e Custos de Cartório',
    body: 'Estime taxas de imposto ITBI, escritura pública e registro para compras de imóveis à vista ou financiados.',
    pill: 'ITBI & CARTÓRIO',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-emerald)',
  },
  {
    href: '/viagens/milhas-ou-dinheiro',
    eyebrow: 'VIAGENS · NOVO · VIRAL',
    title: 'Milhas ou Dinheiro?',
    body: 'Converta milhas em reais de forma séria (CPP). Compare a emissão de voos em milhas vs. dinheiro e avalie promoções de pontos.',
    pill: 'MILHAS & PONTOS',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-blue-calm)',
  },
  {
    href: '/investimentos/parcelado-ou-a-vista',
    eyebrow: 'JUROS · NOVO · COTIDIANO',
    title: 'Parcelado ou À Vista?',
    body: 'Descubra a taxa de juros real embutida no parcelamento "sem juros" do varejo em comparação ao desconto Pix.',
    pill: 'JUROS EMBUTIDOS',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-emerald)',
  },
  {
    href: '/investimentos/fuga-do-rotativo',
    eyebrow: 'SAÚDE · NOVO · CRÍTICO',
    title: 'Fuga do Rotativo',
    body: 'Troque a espiral infinita de juros do cartão de crédito por um empréstimo saudável de baixo custo.',
    pill: 'ESCAPE DÍVIDAS',
    pillVariant: 'c-pill-blue',
    accent: 'var(--c-emerald)',
  },
]

const principles = [
  {
    n: '§ 01',
    title: 'O cérebro ignora.',
    body: 'R$ 20 num app de delivery, R$ 50 numa aposta no fim de semana... parece nada. Multiplicado por 365, vira dinheiro de carro novo. Não é falha moral — é arquitetura do cérebro. A gente só bota o número na tela.',
  },
  {
    n: '§ 02',
    title: 'Privacidade radical.',
    body: 'Não pedimos seu e-mail, CPF, conta bancária, ou sequer um login. Os cálculos rodam no seu navegador. Quando você fecha a aba, nem nós sabemos o que você calculou. Compromisso técnico, não só promessa.',
  },
  {
    n: '§ 03',
    title: 'Honestidade brasileira.',
    body: 'Selic, CDI, IPCA, IOF: valores reais do BCB e Anbima. Sem fundo escondido, sem CDB ofertado por trás. Quando recomendamos Tesouro IPCA+, é porque é o ativo de menor risco com retorno real positivo no Brasil hoje.',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-20 pb-24">

      {/* Hero */}
      <section className="pt-4 space-y-8 max-w-3xl">
        <span className="c-pill">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-emerald)', display: 'inline-block' }} />
          Calculadoras · Gratuitas · Privadas
        </span>

        <h1 className="c-display" style={{ fontSize: 'clamp(48px, 8vw, 88px)', color: 'var(--c-ink)' }}>
          Coloca tudo<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>na ponta do</span>{' '}
          <span style={{ color: 'var(--c-emerald)' }}>lápis.</span>
        </h1>

        <div className="c-pull-quote" style={{ fontSize: 'clamp(16px, 2vw, 22px)', maxWidth: 600 }}>
          A parte difícil de educação financeira no Brasil não é falta de informação.{' '}
          <em style={{ color: 'var(--c-emerald)' }}>É a falta de números doloridos, na sua cara, agora.</em>
        </div>

        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 520 }}>
          Quando você bota o número na tela, o cérebro não consegue mais ignorar.
          A planilha vence o impulso. <strong style={{ color: 'var(--c-ink)' }}>É só isso.</strong>
        </p>
      </section>

      {/* Market context strip — Infinite marquee stock ticker */}
      <div className="c-ticker-container">
        <div className="c-ticker-track">
          {[
            { label: 'APOSTAS 2024', value: MARKET_DATA.apostas, isAccent: true },
            { label: 'SELIC COPOM', value: MARKET_DATA.selic },
            { label: 'DÓLAR (USD/BRL)', value: MARKET_DATA.usd },
            { label: 'IOF CÂMBIO', value: MARKET_DATA.iof },
            { label: 'IPCA 12M', value: MARKET_DATA.ipca },
          ].concat([
            { label: 'APOSTAS 2024', value: MARKET_DATA.apostas, isAccent: true },
            { label: 'SELIC COPOM', value: MARKET_DATA.selic },
            { label: 'DÓLAR (USD/BRL)', value: MARKET_DATA.usd },
            { label: 'IOF CÂMBIO', value: MARKET_DATA.iof },
            { label: 'IPCA 12M', value: MARKET_DATA.ipca },
          ]).map(({ label, value, isAccent }, idx) => (
            <div key={idx} className="c-ticker-item">
              <span className="c-eyebrow" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--c-muted)', fontWeight: 600 }}>
                {label}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '16px',
                  fontWeight: 700,
                  color: isAccent ? 'var(--c-emerald)' : 'var(--c-ink)',
                  whiteSpace: 'nowrap',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Calculator grid */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-3" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 16 }}>
          <h2 className="c-display" style={{ fontSize: 28, color: 'var(--c-ink)' }}>Calculadoras</h2>
          <span className="c-eyebrow">13 ferramentas</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {calcs.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="calm-card calm-calc-link group"
              style={{
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 200,
                textDecoration: 'none',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <span className={`c-pill ${calc.pillVariant}`}>{calc.pill}</span>
                  <span className="c-eyebrow" style={{ fontSize: 9 }}>{calc.eyebrow}</span>
                </div>
                <h3 className="c-display" style={{ fontSize: 20, color: 'var(--c-ink)', marginBottom: 8 }}>{calc.title}</h3>
                <p style={{ color: 'var(--c-muted)', fontSize: 14, lineHeight: 1.55 }}>{calc.body}</p>
              </div>
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="c-eyebrow" style={{ fontSize: 10, color: calc.accent }}>
                  Abrir calculadora
                </span>
                <span style={{ color: calc.accent, fontSize: 12 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Philosophy — manifesto-inspired */}
      <section className="space-y-0" style={{ borderTop: '1px solid var(--c-line)', paddingTop: 64 }}>
        <div style={{ marginBottom: 48 }}>
          <span className="c-eyebrow" style={{ display: 'block', marginBottom: 16 }}>MANIFESTO</span>
          <h2 className="c-display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--c-ink)', maxWidth: 600 }}>
            Por que colocar tudo<br />
            <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>na ponta do lápis.</span>
          </h2>
        </div>

        <div className="space-y-0">
          {principles.map((p, i) => (
            <div
              key={p.n}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: 32,
                padding: '32px 0',
                borderTop: i > 0 ? '1px solid var(--c-line)' : undefined,
                alignItems: 'start',
              }}
            >
              <div>
                <span className="c-eyebrow" style={{ fontSize: 10 }}>{p.n}</span>
                <p className="c-display" style={{ fontSize: 18, color: 'var(--c-ink)', marginTop: 6, lineHeight: 1.2 }}>
                  {p.title.split('.')[0]}.<br />
                </p>
              </div>
              <div style={{ maxWidth: 560 }}>
                <p style={{ color: 'var(--c-ink-2)', fontSize: 16, lineHeight: 1.65 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <Link href="/apostas" className="c-btn c-btn-emerald" style={{ fontSize: 14 }}>
            Ver calculadoras <span style={{ fontSize: 16 }}>→</span>
          </Link>
        </div>
      </section>

      {/* App announcement — dark card */}
      <section
        id="app"
        className="calm-section rounded-3xl p-10 sm:p-14 space-y-6"
        style={{ background: 'var(--c-banner-bg)', border: '1px solid var(--c-banner-border)' }}
      >
        <div>
          <span className="c-eyebrow" style={{ color: 'var(--c-banner-accent)', fontSize: 10 }}>
            APP EM DESENVOLVIMENTO · ANDROID
          </span>
        </div>

        <div style={{ maxWidth: 560 }}>
          <h3 className="c-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--c-banner-title)', lineHeight: 1.05 }}>
            A Ponta do Lápis<br />
            <span className="c-display-500" style={{ color: 'var(--c-banner-accent)' }}>no seu bolso.</span>
          </h3>
          <p style={{ color: 'var(--c-banner-text)', fontSize: 15, lineHeight: 1.65, marginTop: 16 }}>
            Calculadoras pontuais são o ponto de partida. O app é para quem quer acompanhar o mês
            inteiro — cada gasto, cada entrada, cada meta. A mesma honestidade matemática do site,
            agora como rotina diária.
          </p>
        </div>

        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          {[
            'Lance despesas em segundos, sem nuvem, sem CPF',
            'Seus dados ficam só no seu celular',
            'Divide a conta da mesa sem discussão',
            'Veja para onde o dinheiro vai, com gráficos que não mentem',
            'Importe sua fatura inteira de uma vez',
            'Defina limites por categoria e receba alertas antes de estourar',
          ].map((item) => (
            <li key={item} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--c-banner-text)', opacity: 0.85, lineHeight: 1.5 }}>
              <span style={{ color: 'var(--c-banner-accent)', flexShrink: 0, marginTop: 2 }}>·</span>
              {item}
            </li>
          ))}
        </ul>

        <p style={{ color: 'var(--c-banner-muted)', fontSize: 11, fontStyle: 'italic' }}>
          sem data prometida — só quando estiver bom.
        </p>
      </section>

      {/* Coming soon */}
      <section
        className="calm-section rounded-3xl text-center space-y-6 p-10 sm:p-16 relative overflow-hidden"
        style={{ background: 'var(--c-surface)' }}
      >
        <div className="relative" style={{ zIndex: 1 }}>
          <span className="c-eyebrow" style={{ display: 'block', marginBottom: 20 }}>EM CONSTRUÇÃO</span>
          <h3 className="c-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--c-ink)' }}>
            O que estamos<br />
            <span style={{ color: 'var(--c-emerald)' }}>rabiscando?</span>
          </h3>
          <p style={{ color: 'var(--c-muted)', fontSize: 15, maxWidth: 360, margin: '16px auto 0', lineHeight: 1.65 }}>
            Novas calculadoras saindo do papel: Rescisão CLT, Seguro-Desemprego e Pensão Alimentícia.
          </p>
          <div style={{ marginTop: 32 }}>
            <Link
              href="https://github.com/carlosferian/napontadolapis"
              className="c-btn c-btn-emerald"
              style={{ fontSize: 14 }}
            >
              Acompanhe no GitHub <span style={{ fontSize: 16 }}>↗</span>
            </Link>
          </div>
        </div>
        {/* decorative */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 200, height: 200,
          borderRadius: '50%', opacity: 0.06, pointerEvents: 'none',
          background: 'radial-gradient(circle, var(--c-emerald), transparent)',
          transform: 'translate(30%, -30%)',
        }} />
      </section>

    </div>
  )
}
