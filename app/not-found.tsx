import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
      <span className="c-pill" style={{ display: 'inline-flex' }}>
        ERRO 404
      </span>
      <h1 className="c-display" style={{ fontSize: 'clamp(28px, 5vw, 48px)', color: 'var(--c-ink)' }}>
        Essa página não existe.
      </h1>
      <p className="text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
        O link pode estar errado ou a página foi movida. Que tal voltar para o início
        ou conferir uma das calculadoras abaixo?
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link href="/" className="c-btn c-btn-emerald" style={{ fontSize: 14 }}>
          ← Voltar ao início
        </Link>
        <Link href="/glossario" className="c-btn c-btn-ghost" style={{ fontSize: 14 }}>
          Glossário Financeiro
        </Link>
        <Link href="/investimentos" className="c-btn c-btn-ghost" style={{ fontSize: 14 }}>
          E se tivesse investido?
        </Link>
      </div>
    </div>
  )
}
