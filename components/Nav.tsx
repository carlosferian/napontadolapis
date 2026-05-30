'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from './ThemeToggle'
import { ChevronDown, Menu, X } from 'lucide-react'

const investmentItems = [
  { href: '/investimentos', label: 'E se tivesse investido?', desc: 'Compare hábitos do cotidiano com renda fixa.' },
  { href: '/juros-compostos', label: 'Juros Compostos', desc: 'Simule seus aportes mensais no tempo.' },
  { href: '/investimentos/viver-de-renda', label: 'Viver de Renda', desc: 'Planeje sua aposentadoria e independência financeira.' },
  { href: '/investimentos/amortizacao', label: 'Amortizar Financiamento', desc: 'Simule quitação acelerada (SAC vs Price).' },
  { href: '/investimentos/itbi-e-cartorio', label: 'ITBI e Custos de Cartório', desc: 'Calcule as taxas extras de transferência de imóvel.' },
  { href: '/investimentos/parcelado-ou-a-vista', label: 'Parcelado ou À Vista?', desc: 'Descubra os juros embutidos no parcelamento "sem juros".' },
  { href: '/investimentos/fuga-do-rotativo', label: 'Fuga do Rotativo', desc: 'Troque dívida de cartão de crédito por uma linha saudável.' },
]

const workItems = [
  { href: '/trabalho/realidade-brasileira', label: 'Realidade Brasileira', desc: 'Onde seu salário se situa na pirâmide real.' },
  { href: '/trabalho/seguro-desemprego', label: 'Seguro-Desemprego 2026', desc: 'Calcule parcelas e sua pista financeira de transição.' },
  { href: '/trabalho/rescisao', label: 'Rescisão CLT', desc: 'Simule seus proventos e descontos demissionais.' },
  { href: '/viagens/custo-de-vida', label: 'Custo de Vida entre Cidades', desc: 'Compare orçamentos para mudança ou trabalho remoto.' },
]

const travelItems = [
  { href: '/viagens', label: 'Hub de Viagens', desc: 'Todas as ferramentas de planejamento de viagem.' },
  { href: '/viagens/milhas-ou-dinheiro', label: 'Milhas ou Dinheiro?', desc: 'Calcule o CPP e saiba se vale a pena emitir ou comprar milhas.' },
  { href: '/viagens/planejar', label: 'Planejar Viagem', desc: 'Simule o custo total de uma viagem internacional.' },
  { href: '/viagens/custo-de-vida', label: 'Custo de Vida entre Cidades', desc: 'Compare orçamentos para mudança ou trabalho remoto.' },
]

const habitItems = [
  { href: '/apostas', label: 'Gastos com Apostas', desc: 'Cassino imersivo que revela a matemática real das bets.' },
  { href: '/fumo', label: 'Custo do Fumo', desc: 'O preço de cigarros, vape ou pod por décadas.' },
]

// Todos os links agrupados para o menu mobile
const mobileGroups = [
  { label: 'Investimentos', items: investmentItems },
  { label: 'Trabalho', items: workItems },
  { label: 'Hábitos', items: habitItems },
  { label: 'Viagens', items: travelItems },
  { label: 'Outros', items: [
    { href: '/dividir', label: 'Dividir Conta', desc: 'Calcule a divisão de despesas em grupo.' },
  ]},
]

export function Nav() {
  const [investmentsOpen, setInvestmentsOpen] = useState(false)
  const [workOpen, setWorkOpen] = useState(false)
  const [habitsOpen, setHabitsOpen] = useState(false)
  const [travelOpen, setTravelOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const investmentsRef = useRef<HTMLDivElement>(null)
  const workRef        = useRef<HTMLDivElement>(null)
  const habitsRef      = useRef<HTMLDivElement>(null)
  const travelRef      = useRef<HTMLDivElement>(null)

  const investmentsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const workTimeoutRef        = useRef<ReturnType<typeof setTimeout> | null>(null)
  const habitsTimeoutRef      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const travelTimeoutRef      = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openInvestments  = () => { if (investmentsTimeoutRef.current) clearTimeout(investmentsTimeoutRef.current); setInvestmentsOpen(true) }
  const closeInvestments = () => { investmentsTimeoutRef.current = setTimeout(() => setInvestmentsOpen(false), 150) }
  const openWork         = () => { if (workTimeoutRef.current) clearTimeout(workTimeoutRef.current); setWorkOpen(true) }
  const closeWork        = () => { workTimeoutRef.current = setTimeout(() => setWorkOpen(false), 150) }
  const openHabits       = () => { if (habitsTimeoutRef.current) clearTimeout(habitsTimeoutRef.current); setHabitsOpen(true) }
  const closeHabits      = () => { habitsTimeoutRef.current = setTimeout(() => setHabitsOpen(false), 150) }
  const openTravel       = () => { if (travelTimeoutRef.current) clearTimeout(travelTimeoutRef.current); setTravelOpen(true) }
  const closeTravel      = () => { travelTimeoutRef.current = setTimeout(() => setTravelOpen(false), 150) }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (investmentsRef.current && !investmentsRef.current.contains(event.target as Node)) setInvestmentsOpen(false)
      if (workRef.current        && !workRef.current.contains(event.target as Node))        setWorkOpen(false)
      if (habitsRef.current      && !habitsRef.current.contains(event.target as Node))      setHabitsOpen(false)
      if (travelRef.current      && !travelRef.current.contains(event.target as Node))      setTravelOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (investmentsTimeoutRef.current) clearTimeout(investmentsTimeoutRef.current)
      if (workTimeoutRef.current)        clearTimeout(workTimeoutRef.current)
      if (habitsTimeoutRef.current)      clearTimeout(habitsTimeoutRef.current)
      if (travelTimeoutRef.current)      clearTimeout(travelTimeoutRef.current)
    }
  }, [])

  // Fecha o menu mobile ao navegar
  const closeMobile = () => setMobileOpen(false)

  const dropdownCls = "absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-1 w-64 rounded-xl shadow-xl border p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
  const dropdownStyle = { backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }
  const btnCls = "px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] cursor-pointer"
  const linkCls = "block p-2 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors group"

  return (
    <nav className="calm-nav sticky top-0 z-50" style={{ background: 'var(--c-bg)', borderBottom: '1px solid var(--c-line)' }}>

      {/* ── Barra principal ── */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" style={{ textDecoration: 'none' }}>
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <Image src="/logo.png" alt="A Ponta do Lápis" width={32} height={32} className="object-cover" />
          </div>
          <span className="c-display font-semibold" style={{ fontSize: 17, color: 'var(--c-ink)' }}>
            a ponta do lápis
          </span>
        </Link>

        {/* Desktop nav — oculto abaixo de md */}
        <div className="hidden md:flex items-center gap-2">

          {/* Investimentos */}
          <div ref={investmentsRef} className="relative" onMouseEnter={openInvestments} onMouseLeave={closeInvestments}>
            <button onClick={() => setInvestmentsOpen(!investmentsOpen)} className={btnCls} style={{ color: 'var(--c-ink)' }}>
              Investimentos <ChevronDown size={12} className={`transition-transform duration-200 ${investmentsOpen ? 'rotate-180' : ''}`} />
            </button>
            {investmentsOpen && (
              <div className={dropdownCls} style={dropdownStyle}>
                {investmentItems.map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setInvestmentsOpen(false)} className={linkCls} style={{ textDecoration: 'none' }}>
                    <p className="text-sm font-semibold transition-colors group-hover:text-[var(--c-emerald)]" style={{ color: 'var(--c-ink)' }}>{item.label}</p>
                    <p className="text-[11px] leading-normal mt-0.5" style={{ color: 'var(--c-muted)' }}>{item.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Trabalho */}
          <div ref={workRef} className="relative" onMouseEnter={openWork} onMouseLeave={closeWork}>
            <button onClick={() => setWorkOpen(!workOpen)} className={btnCls} style={{ color: 'var(--c-ink)' }}>
              Trabalho <ChevronDown size={12} className={`transition-transform duration-200 ${workOpen ? 'rotate-180' : ''}`} />
            </button>
            {workOpen && (
              <div className={dropdownCls} style={dropdownStyle}>
                {workItems.map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setWorkOpen(false)} className={linkCls} style={{ textDecoration: 'none' }}>
                    <p className="text-sm font-semibold transition-colors group-hover:text-[var(--c-emerald)]" style={{ color: 'var(--c-ink)' }}>{item.label}</p>
                    <p className="text-[11px] leading-normal mt-0.5" style={{ color: 'var(--c-muted)' }}>{item.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Hábitos */}
          <div ref={habitsRef} className="relative" onMouseEnter={openHabits} onMouseLeave={closeHabits}>
            <button onClick={() => setHabitsOpen(!habitsOpen)} className={btnCls} style={{ color: 'var(--c-ink)' }}>
              Hábitos <ChevronDown size={12} className={`transition-transform duration-200 ${habitsOpen ? 'rotate-180' : ''}`} />
            </button>
            {habitsOpen && (
              <div className={`${dropdownCls} w-72`} style={dropdownStyle}>
                {habitItems.map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setHabitsOpen(false)} className={linkCls} style={{ textDecoration: 'none' }}>
                    <p className="text-sm font-semibold transition-colors group-hover:text-[var(--c-emerald)]" style={{ color: 'var(--c-ink)' }}>{item.label}</p>
                    <p className="text-[11px] leading-normal mt-0.5" style={{ color: 'var(--c-muted)' }}>{item.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Viagens */}
          <div ref={travelRef} className="relative" onMouseEnter={openTravel} onMouseLeave={closeTravel}>
            <button onClick={() => setTravelOpen(!travelOpen)} className={btnCls} style={{ color: 'var(--c-ink)' }}>
              Viagens <ChevronDown size={12} className={`transition-transform duration-200 ${travelOpen ? 'rotate-180' : ''}`} />
            </button>
            {travelOpen && (
              <div className={`${dropdownCls} right-0 left-auto translate-x-0`} style={dropdownStyle}>
                {travelItems.map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setTravelOpen(false)} className={linkCls} style={{ textDecoration: 'none' }}>
                    <p className="text-sm font-semibold transition-colors group-hover:text-[var(--c-emerald)]" style={{ color: 'var(--c-ink)' }}>{item.label}</p>
                    <p className="text-[11px] leading-normal mt-0.5" style={{ color: 'var(--c-muted)' }}>{item.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/dividir" className={`${btnCls} hidden sm:flex`} style={{ color: 'var(--c-ink)', textDecoration: 'none' }}>
            Dividir
          </Link>

          <div className="ml-1"><ThemeToggle /></div>
        </div>

        {/* Mobile: theme toggle + hambúrguer */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="p-2 rounded-lg transition-colors cursor-pointer"
            style={{ color: 'var(--c-ink)' }}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Menu mobile — painel deslizante ── */}
      {mobileOpen && (
        <div
          className="md:hidden border-t overflow-y-auto"
          style={{
            background: 'var(--c-bg)',
            borderColor: 'var(--c-line)',
            maxHeight: 'calc(100dvh - 56px)',
          }}
        >
          <div className="px-4 py-3 space-y-1">
            {mobileGroups.map(group => (
              <div key={group.label}>
                <p className="text-[10px] font-extrabold uppercase tracking-widest px-2 pt-3 pb-1" style={{ color: 'var(--c-muted)' }}>
                  {group.label}
                </p>
                {group.items.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className="flex items-center gap-2 px-2 py-2.5 rounded-lg transition-colors"
                    style={{ textDecoration: 'none', color: 'var(--c-ink)' }}
                  >
                    <span className="text-sm font-semibold">{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
