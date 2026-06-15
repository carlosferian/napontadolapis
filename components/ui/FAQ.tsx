interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
  title?: string
}

export function FAQ({ items, title = 'Perguntas frequentes' }: FAQProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div className="space-y-3">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">{title}</h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <details key={i} className="group rounded-xl border border-stone-100 bg-stone-50 px-4 py-3">
            <summary className="text-sm font-bold text-stone-700 dark:text-stone-200 cursor-pointer list-none flex items-center justify-between gap-2">
              {item.question}
              <span className="text-stone-400 transition-transform group-open:rotate-45 flex-shrink-0">+</span>
            </summary>
            <p className="text-sm mt-2 leading-relaxed text-stone-500 dark:text-stone-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
