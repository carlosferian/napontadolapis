'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from './ThemeToggle'
import { ChevronDown } from 'lucide-react'

const investmentItems = [
  { href: '/investimentos', label: 'E se tivesse investido?', desc: 'Compare hábitos do cotidiano com renda fixa.' },
  { href: '/juros-compostos', label: 'Juros Compostos', desc: 'Simule seus aportes mensais no tempo.' },
]

const habitItems = [
  { href: '/apostas', label: 'Gastos com Apostas', desc: 'O custo de queimar dinheiro em bets.' },
  { href: '/fumo', label: 'Custo do Fumo', desc: 'O preço de cigarros, vape ou pod por décadas.' },
  { href: '/apostas/probabilidades', label: 'Probabilidades Reais', desc: 'A matemática por trás das odds e margens.' },
]

export function Nav() {
  const [investmentsOpen, setInvestmentsOpen] = useState(false)
  const [habitsOpen, setHabitsOpen] = useState(false)

  const investmentsRef = useRef<HTMLDivElement>(null)
  const habitsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (investmentsRef.current && !investmentsRef.current.contains(event.target as Node)) {
        setInvestmentsOpen(false)
      }
      if (habitsRef.current && !habitsRef.current.contains(event.target as Node)) {
        setHabitsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="calm-nav sticky top-0 z-50" style={{
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

        <div className="flex items-center gap-2">
          
          {/* Investimentos Dropdown */}
          <div 
            ref={investmentsRef} 
            className="relative"
            onMouseEnter={() => setInvestmentsOpen(true)}
            onMouseLeave={() => setInvestmentsOpen(false)}
          >
            <button
              onClick={() => setInvestmentsOpen(!investmentsOpen)}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] cursor-pointer"
              style={{ color: 'var(--c-ink)' }}
            >
              Investimentos
              <ChevronDown size={12} className={`transition-transform duration-200 ${investmentsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {investmentsOpen && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-1 w-64 rounded-xl shadow-xl border p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}
              >
                {investmentItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setInvestmentsOpen(false)}
                    className="block p-2 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors group"
                    style={{ textDecoration: 'none' }}
                  >
                    <p className="text-sm font-semibold transition-colors group-hover:text-[var(--c-emerald)]" style={{ color: 'var(--c-ink)' }}>
                      {item.label}
                    </p>
                    <p className="text-[11px] leading-normal mt-0.5" style={{ color: 'var(--c-muted)' }}>
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Hábitos Dropdown */}
          <div 
            ref={habitsRef} 
            className="relative"
            onMouseEnter={() => setHabitsOpen(true)}
            onMouseLeave={() => setHabitsOpen(false)}
          >
            <button
              onClick={() => setHabitsOpen(!habitsOpen)}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] cursor-pointer"
              style={{ color: 'var(--c-ink)' }}
            >
              Hábitos
              <ChevronDown size={12} className={`transition-transform duration-200 ${habitsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {habitsOpen && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-1 w-72 rounded-xl shadow-xl border p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}
              >
                {habitItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setHabitsOpen(false)}
                    className="block p-2 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors group"
                    style={{ textDecoration: 'none' }}
                  >
                    <p className="text-sm font-semibold transition-colors group-hover:text-[var(--c-emerald)]" style={{ color: 'var(--c-ink)' }}>
                      {item.label}
                    </p>
                    <p className="text-[11px] leading-normal mt-0.5" style={{ color: 'var(--c-muted)' }}>
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/viagens"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all hidden sm:block hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
            style={{ color: 'var(--c-ink)' }}
          >
            Viagens
          </Link>
          <Link
            href="/dividir"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all hidden sm:block hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
            style={{ color: 'var(--c-ink)' }}
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
