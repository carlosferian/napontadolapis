import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Fale Conosco — A Ponta do Lápis',
  description: 'Entre em contato com a equipe da A Ponta do Lápis. Sugestões, dúvidas ou reportar um erro — adoramos ouvir você.',
  alternates: { canonical: 'https://apontadolapis.com.br/fale-conosco' },
}

export default function FaleConoscoPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-10">

      {/* Header */}
      <div className="calm-header" style={{ paddingBottom: 24, borderBottom: '1px solid var(--c-line)' }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          CONTATO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Fale Conosco
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Sugestão de calculadora, erro nos números, dúvida ou só queria dizer oi — adoramos ouvir.
        </p>
      </div>

      {/* Principal: e-mail */}
      <div className="rounded-2xl border p-6 flex gap-5" style={{ background: 'var(--c-emerald-soft)', borderColor: 'rgba(16,185,129,0.2)' }}>
        <span className="text-3xl flex-shrink-0">✉️</span>
        <div className="space-y-2">
          <p className="font-black text-base" style={{ color: 'var(--c-emerald)' }}>E-mail direto</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            A forma mais rápida de chegar até nós. Costumamos responder em até 48 horas úteis.
          </p>
          <a
            href="mailto:quaseiso@gmail.com"
            className="inline-flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--c-emerald)' }}
          >
            quaseiso@gmail.com
          </a>
        </div>
      </div>

      {/* O que você pode nos enviar */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>O que nos contar</h2>
        <div className="space-y-3">
          {topics.map(t => (
            <div key={t.title} className="rounded-2xl border p-4 flex gap-4" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
              <span className="text-xl flex-shrink-0">{t.icon}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--c-ink)' }}>{t.title}</p>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--c-muted)' }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aviso */}
      <div className="rounded-2xl border p-4 flex gap-4" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
        <span className="text-lg flex-shrink-0">ℹ️</span>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          A Ponta do Lápis é um projeto independente, sem equipe de suporte dedicada. Respondemos com carinho, mas sem prazo garantido para pedidos complexos.
        </p>
      </div>

      {/* Footer links */}
      <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--c-line)' }}>
        <Link href="/sobre" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--c-muted)' }}>
          ← Sobre nós
        </Link>
        <Link href="/privacidade" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--c-emerald)' }}>
          Política de Privacidade →
        </Link>
      </div>

    </div>
  )
}

const topics = [
  {
    icon: '💡',
    title: 'Sugestão de calculadora',
    desc: 'Tem uma situação financeira brasileira que ainda não cobrimos? Conta pra gente. Priorizamos sugestões com mais pedidos.',
  },
  {
    icon: '🐛',
    title: 'Erro ou resultado suspeito',
    desc: 'Encontrou um cálculo errado, um bug na interface ou um dado desatualizado? Descreva o cenário e o resultado esperado — corrigimos rápido.',
  },
  {
    icon: '🤝',
    title: 'Parcerias e imprensa',
    desc: 'Quer mencionar a Ponta do Lápis em um artigo, reportagem ou conteúdo? Entre em contato antes de publicar — adoramos colaborar.',
  },
  {
    icon: '🔒',
    title: 'Dúvidas sobre privacidade',
    desc: 'Questões sobre como seus dados são (ou não são) usados. Leia também nossa Política de Privacidade — ela é curta e direta.',
  },
]
