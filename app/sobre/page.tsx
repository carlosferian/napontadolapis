import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre — A Ponta do Lápis',
  description: 'Conheça a A Ponta do Lápis: calculadoras financeiras gratuitas para o brasileiro, sem cadastro, sem CPF e sem julgamento.',
  alternates: { canonical: 'https://apontadolapis.com.br/sobre' },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Carlos Ferian',
  url: 'https://apontadolapis.com.br/sobre',
  jobTitle: 'Autor — A Ponta do Lápis',
  description: 'Criador da A Ponta do Lápis, com quase dez anos de atuação no setor bancário de varejo, com experiência em crédito, financiamento, investimentos e câmbio para clientes pessoa física.',
  knowsAbout: ['Educação financeira', 'Crédito e financiamento', 'Investimentos', 'Câmbio'],
}

export default function SobrePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-10">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Header */}
      <div className="calm-header" style={{ paddingBottom: 24, borderBottom: '1px solid var(--c-line)' }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          SOBRE NÓS
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          A Ponta do Lápis
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Calculadoras financeiras gratuitas feitas para o brasileiro — sem cadastro, sem CPF e sem julgamento.
        </p>
      </div>

      {/* Missão */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>Nossa missão</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Dinheiro no Brasil é complicado: impostos embutidos, juros altos, parcelas disfarçadas e comparações difíceis de fazer. A Ponta do Lápis existe para tornar esses cálculos simples, honestos e acessíveis a qualquer pessoa — seja para entender o custo real de um hábito, planejar uma viagem, ou tomar decisões de investimento com clareza.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Nada de teorias complicadas. Só os números que importam, com contexto suficiente para fazer sentido.
        </p>
      </div>

      {/* Princípios */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>Como trabalhamos</h2>
        <div className="space-y-3">
          {principles.map(p => (
            <div key={p.title} className="rounded-2xl border p-4 flex gap-4" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
              <span className="text-xl flex-shrink-0">{p.icon}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--c-ink)' }}>{p.title}</p>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--c-muted)' }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Autor */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>Quem está por trás</h2>
        <div className="rounded-2xl border p-4" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            A Ponta do Lápis é criada e mantida por <strong style={{ color: 'var(--c-ink)' }}>Carlos Ferian</strong>,
            profissional com <strong style={{ color: 'var(--c-ink)' }}>quase dez anos de atuação no setor bancário de varejo</strong>,
            com experiência direta em produtos de crédito, financiamento, investimentos e câmbio para clientes pessoa física.
          </p>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            Foi nesse período, vendo de perto as dúvidas mais comuns dos clientes — e as armadilhas de produtos
            financeiros mal explicados — que nasceu a ideia da Ponta do Lápis: traduzir esse conhecimento em
            ferramentas simples, gratuitas e sem letra miúda, para que qualquer pessoa possa fazer a própria conta
            antes de tomar uma decisão financeira.
          </p>
        </div>
      </div>

      {/* Ferramentas */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>O que você encontra aqui</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tools.map(t => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-2xl border p-4 block hover:border-[var(--c-emerald)] transition-colors group"
              style={{ background: 'var(--c-card-calm)', borderColor: 'var(--c-line)', textDecoration: 'none' }}
            >
              <p className="text-sm font-bold transition-colors group-hover:text-[var(--c-emerald)]" style={{ color: 'var(--c-ink)' }}>{t.label}</p>
              <p className="text-[11px] mt-1 leading-normal" style={{ color: 'var(--c-muted)' }}>{t.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--c-line)' }}>
        <Link href="/" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--c-muted)' }}>
          ← Voltar ao início
        </Link>
        <Link href="/fale-conosco" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--c-emerald)' }}>
          Fale Conosco →
        </Link>
      </div>

    </div>
  )
}

const principles = [
  {
    icon: '🔒',
    title: 'Privacidade por padrão',
    desc: 'Todos os cálculos rodam no seu navegador. Não coletamos dados financeiros, não pedimos cadastro e não usamos seus números para nada além de mostrar o resultado na tela.',
  },
  {
    icon: '🇧🇷',
    title: 'Contexto brasileiro',
    desc: 'Taxas de câmbio, IOF, SELIC, INSS, FGTS — tudo calibrado para a realidade do Brasil, não adaptado de calculadoras americanas.',
  },
  {
    icon: '⚖️',
    title: 'Sem julgamento',
    desc: 'Apostas, cigarros, parcelamento no cartão: a ferramenta mostra os números, você decide o que fazer com eles. Sem disclaimers moralizantes.',
  },
  {
    icon: '✏️',
    title: 'Transparência nos cálculos',
    desc: 'Cada calculadora explica a metodologia e cita as fontes usadas. Você não precisa confiar cegamente — pode conferir.',
  },
]

const tools = [
  { href: '/investimentos', label: 'E se tivesse investido?', desc: 'Compare hábitos com renda fixa.' },
  { href: '/juros-compostos', label: 'Juros Compostos', desc: 'Simule aportes mensais no tempo.' },
  { href: '/apostas', label: 'Custo das Apostas', desc: 'A matemática real das bets.' },
  { href: '/fumo', label: 'Custo do Fumo', desc: 'Cigarros, vape ou pod por décadas.' },
  { href: '/viagens', label: 'Viagens', desc: 'Milhas, câmbio e planejamento.' },
  { href: '/dividir', label: 'Dividir Conta', desc: 'Divida despesas em grupo.' },
]
