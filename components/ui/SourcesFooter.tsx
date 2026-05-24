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
    </div>
  )
}
