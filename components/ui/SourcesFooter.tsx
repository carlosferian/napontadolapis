import Link from 'next/link'

interface Source {
  label: string
  url?: string
}

interface SourcesFooterProps {
  sources: Source[]
  className?: string
}

export function SourcesFooter({ sources, className }: SourcesFooterProps) {
  return (
    <div className={`bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 space-y-2 ${className ?? ''}`}>
      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Fontes e referências</p>
      <ul className="space-y-1">
        {sources.map((src, i) => (
          <li key={i} className="text-xs text-stone-500">
            {src.url ? (
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-stone-700 transition-colors"
              >
                {src.label}
              </a>
            ) : (
              src.label
            )}
          </li>
        ))}
      </ul>
      <p className="text-xs text-stone-400 pt-1 border-t border-stone-100">
        Escrito por{' '}
        <Link href="/sobre" className="underline underline-offset-2 hover:text-stone-600 transition-colors">
          Carlos Ferian
        </Link>
        , profissional com quase dez anos de atuação no setor bancário de varejo.
      </p>
    </div>
  )
}
