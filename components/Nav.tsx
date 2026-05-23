import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function Nav() {
  return (
    <nav className="border-b border-brand-border bg-brand-paper/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <Image src="/logo.png" alt="Na Ponta do Lápis" width={32} height={32} className="object-cover" />
          </div>
          <span className="font-semibold text-brand-ink text-lg tracking-tight font-serif leading-none">
            na ponta do lápis
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/investimentos"
            className="px-3 py-2 rounded-lg text-brand-muted hover:text-brand-green hover:bg-brand-green/8 transition-all text-sm font-medium"
          >
            Investimentos
          </Link>
          <Link
            href="/apostas"
            className="px-3 py-2 rounded-lg text-brand-muted hover:text-category-saving hover:bg-category-saving/8 transition-all text-sm font-medium"
          >
            Hábitos
          </Link>
          <Link
            href="/viagens"
            className="px-3 py-2 rounded-lg text-brand-muted hover:text-category-dream hover:bg-category-dream/8 transition-all text-sm font-medium"
          >
            Viagens
          </Link>
        </div>
      </div>
    </nav>
  )
}
