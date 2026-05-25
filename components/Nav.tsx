import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function Nav() {
  return (
    <nav className="border-b border-brand-border bg-brand-paper sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <Image src="/logo.png" alt="A Ponta do Lápis" width={32} height={32} className="object-cover" />
          </div>
          <span className="font-semibold text-brand-ink text-lg tracking-tight font-serif leading-none">
            a ponta do lápis
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/investimentos"
            className="px-3 py-2 rounded-lg text-brand-muted hover:text-brand-green hover:bg-brand-green/8 transition-all text-sm font-medium hidden sm:block"
          >
            Investimentos
          </Link>
          <Link
            href="/apostas"
            className="px-3 py-2 rounded-lg text-brand-muted hover:text-category-saving hover:bg-category-saving/8 transition-all text-sm font-medium hidden sm:block"
          >
            Hábitos
          </Link>
          <Link
            href="/viagens"
            className="px-3 py-2 rounded-lg text-brand-muted hover:text-category-dream hover:bg-category-dream/8 transition-all text-sm font-medium hidden md:block"
          >
            Viagens
          </Link>
          <Link
            href="/dividir"
            className="px-3 py-2 rounded-lg text-brand-muted hover:text-brand-teal hover:bg-brand-teal/8 transition-all text-sm font-medium hidden sm:block"
          >
            Dividir conta
          </Link>
          <Link
            href="/#app"
            className="ml-2 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #172030, #1A3A2A)', color: '#00C4BE', border: '1px solid #1E3040' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00C4BE' }} />
            app em breve
          </Link>
        </div>
      </div>
    </nav>
  )
}
