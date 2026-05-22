import React from 'react'
import Link from 'next/link'

export function Nav() {
  return (
    <nav className="border-b border-stone-100 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-amber-500 font-bold text-xl">·</span>
          <span className="font-bold text-stone-900 text-lg tracking-tight">na ponta do lápis</span>
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/apostas" className="text-stone-500 hover:text-stone-900 transition-colors">apostas</Link>
          <Link href="/investimentos" className="text-stone-500 hover:text-stone-900 transition-colors">investimentos</Link>
          <Link href="/fumo" className="text-stone-500 hover:text-stone-900 transition-colors">fumo</Link>
        </div>
      </div>
    </nav>
  )
}
