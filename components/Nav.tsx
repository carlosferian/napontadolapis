import React from 'react'
import Link from 'next/link'

export function Nav() {
  return (
    <nav className="border-b border-stone-200 bg-brand-paper/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-pencil rounded-full flex items-center justify-center font-bold text-brand-graphite group-hover:rotate-12 transition-transform">
            ✎
          </div>
          <span className="font-bold text-brand-graphite text-xl tracking-tight font-serif">na ponta do lápis</span>
        </Link>
        
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/investimentos" className="text-stone-600 hover:text-category-growth transition-colors flex flex-col items-center sm:items-start">
            <span className="text-[10px] uppercase tracking-widest text-stone-400">Crescer</span>
            <span>investimentos</span>
          </Link>
          <Link href="/apostas" className="text-stone-600 hover:text-category-saving transition-colors flex flex-col items-center sm:items-start">
            <span className="text-[10px] uppercase tracking-widest text-stone-400">Economizar</span>
            <span>hábitos</span>
          </Link>
          <Link href="/viagens" className="text-stone-600 hover:text-category-dream transition-colors flex flex-col items-center sm:items-start">
            <span className="text-[10px] uppercase tracking-widest text-stone-400">Realizar</span>
            <span>viagens</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
