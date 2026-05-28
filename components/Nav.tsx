import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from './ThemeToggle'

export function Nav() {
  return (
    <nav className="calm-nav sticky top-0 z-10" style={{
      background: 'var(--c-bg)',
      borderBottom: '1px solid var(--c-line)',
    }}>
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group" style={{ textDecoration: 'none' }}>
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <Image src="/logo.png" alt="A Ponta do Lápis" width={32} height={32} className="object-cover" />
          </div>
          <span className="c-display font-semibold" style={{ fontSize: 17, color: 'var(--c-ink)' }}>
            a ponta do lápis
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/investimentos"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all hidden sm:block"
            style={{ color: 'var(--c-muted)' }}
          >
            Investimentos
          </Link>
          <Link
            href="/apostas"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all hidden sm:block"
            style={{ color: 'var(--c-muted)' }}
          >
            Hábitos
          </Link>
          <Link
            href="/viagens"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all hidden md:block"
            style={{ color: 'var(--c-muted)' }}
          >
            Viagens
          </Link>
          <Link
            href="/dividir"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all hidden sm:block"
            style={{ color: 'var(--c-muted)' }}
          >
            Dividir
          </Link>

          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
