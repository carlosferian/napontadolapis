'use client'

import React, { useState, useMemo } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import { formatBRLDecimal } from '@/lib/formatters'
import { SectionDivider } from '@/components/ui/SectionDivider'

interface Person {
  id: number
  name: string
}

interface BillItem {
  id: number
  description: string
  price: number
  payers: number[] // empty = all people
}

function displayName(person: Person, index: number) {
  return person.name.trim() || `Pessoa ${index + 1}`
}

function Tip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block align-middle ml-1.5">
      <button
        type="button"
        tabIndex={-1}
        className="w-4 h-4 rounded-full border text-[9px] inline-flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
        style={{ borderColor: 'var(--c-line-strong)', color: 'var(--c-muted)' }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        aria-label="Dica"
      >
        ?
      </button>
      {open && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-60 p-3 text-xs rounded-xl z-50 leading-relaxed shadow-xl pointer-events-none"
          style={{
            backgroundColor: 'var(--c-surface)',
            color: 'var(--c-ink)',
            border: '1px solid var(--c-line)'
          }}
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-stone-800 dark:border-t-stone-950" />
        </div>
      )}
    </span>
  )
}

export function SplitBillCalculator() {
  const [mode, setMode] = useState<'itemized' | 'equal'>('itemized')
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: '' },
    { id: 2, name: '' },
  ])
  const [items, setItems] = useState<BillItem[]>([])
  const [tip, setTip] = useState(0)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [equalTotal, setEqualTotal] = useState('')
  const [copied, setCopied] = useState(false)

  // Inline editing state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDesc, setEditDesc] = useState('')
  const [editPrice, setEditPrice] = useState('')

  // ── Derived ─────────────────────────────────────────────────────

  const allIds = people.map((p) => p.id)

  function resolvePayers(item: BillItem): number[] {
    return item.payers.length === 0
      ? allIds
      : item.payers.filter((id) => allIds.includes(id))
  }

  const calc = useMemo(() => {
    const ids = people.map((p) => p.id)
    const subs: Record<number, number> = {}
    for (const p of people) subs[p.id] = 0

    for (const item of items) {
      const payers = item.payers.length === 0 ? ids : item.payers.filter((id) => ids.includes(id))
      if (payers.length === 0) continue
      const share = item.price / payers.length
      for (const pid of payers) {
        if (subs[pid] !== undefined) subs[pid] += share
      }
    }

    const subtotal = Object.values(subs).reduce((a, b) => a + b, 0)
    const tipAmt = subtotal * (tip / 100)

    const breakdown = people.map((person, i) => {
      const sub = subs[person.id] ?? 0
      const personTip = subtotal > 0 ? (sub / subtotal) * tipAmt : 0
      return { person, index: i, sub, tip: personTip, total: sub + personTip }
    })

    return { subtotal, tipAmt, breakdown }
  }, [people, items, tip])

  const equalNum = parseFloat(equalTotal.replace(',', '.')) || 0
  const equalWithTip = equalNum * (1 + tip / 100)
  const perPersonEqual = people.length > 0 ? equalWithTip / people.length : 0
  const hasResults = mode === 'itemized' ? items.length > 0 : equalNum > 0

  // ── People actions ───────────────────────────────────────────────

  function addPerson() {
    const name = newName.trim()
    const id = Date.now()
    setPeople((prev) => [...prev, { id, name }])
    setNewName('')
  }

  function removePerson(id: number) {
    if (people.length <= 2) return
    setPeople((prev) => prev.filter((p) => p.id !== id))
    setItems((prev) =>
      prev.map((item) => ({ ...item, payers: item.payers.filter((pid) => pid !== id) }))
    )
  }

  function updateName(id: number, name: string) {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)))
  }

  // ── Item actions ─────────────────────────────────────────────────

  function addItem() {
    const desc = newDesc.trim()
    const price = parseFloat(newPrice.replace(',', '.'))
    if (!desc || isNaN(price) || price <= 0) return
    setItems((prev) => [...prev, { id: Date.now(), description: desc, price, payers: [] }])
    setNewDesc('')
    setNewPrice('')
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function startEdit(item: BillItem) {
    setEditingId(item.id)
    setEditDesc(item.description)
    setEditPrice(String(item.price))
  }

  function saveEdit(id: number) {
    const desc = editDesc.trim()
    const price = parseFloat(editPrice.replace(',', '.'))
    if (!desc || isNaN(price) || price <= 0) return
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, description: desc, price } : item))
    )
    setEditingId(null)
  }

  function toggleItemPayer(itemId: number, personId: number) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item
        const ids = people.map((p) => p.id)
        const current = item.payers.length === 0 ? ids : item.payers.filter((id) => ids.includes(id))
        const next = current.includes(personId)
          ? current.filter((id) => id !== personId)
          : [...current, personId]
        return { ...item, payers: next.length === ids.length ? [] : next }
      })
    )
  }

  function copyMarkdown() {
    const lines: string[] = ['**Divisão de conta — A Ponta do Lápis**', '']
    if (mode === 'itemized') {
      lines.push('**Itens:**', '')
      for (const item of items) {
        const payers = resolvePayers(item)
        const names = payers.map((id) => {
          const idx = people.findIndex((p) => p.id === id)
          const p = people[idx]
          return p ? displayName(p, idx) : '?'
        })
        lines.push(`- ${item.description}: ${formatBRLDecimal(item.price)} (${names.join(', ')})`)
      }
      lines.push('', '**Por pessoa:**', '', '| Quem | Itens | Gorjeta | Total |', '|------|-------|---------|-------|')
      for (const { person, index, sub, tip: t, total } of calc.breakdown) {
        lines.push(`| ${displayName(person, index)} | ${formatBRLDecimal(sub)} | ${formatBRLDecimal(t)} | ${formatBRLDecimal(total)} |`)
      }
    } else {
      lines.push(`Total: ${formatBRLDecimal(equalNum)}`)
      if (tip > 0) {
        lines.push(`Gorjeta (${tip}%): ${formatBRLDecimal(equalWithTip - equalNum)}`, `Total com gorjeta: ${formatBRLDecimal(equalWithTip)}`)
      }
      lines.push(`Por pessoa: ${formatBRLDecimal(perPersonEqual)}`, '', '| Quem | Valor |', '|------|-------|')
      for (const [i, p] of people.entries()) {
        lines.push(`| ${displayName(p, i)} | ${formatBRLDecimal(perPersonEqual)} |`)
      }
    }
    lines.push('', '_apontadolapis.com.br_')
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Person chip ──────────────────────────────────────────────────

  function PersonChip({ personId, selected, onToggle }: { personId: number; selected: boolean; onToggle: () => void }) {
    const idx = people.findIndex((p) => p.id === personId)
    const person = people[idx]
    if (!person) return null
    return (
      <button
        type="button"
        onClick={onToggle}
        title={selected ? `${displayName(person, idx)} divide este item — clique para remover` : `${displayName(person, idx)} não divide este item — clique para incluir`}
        className="px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer"
        style={
          selected
            ? { backgroundColor: 'var(--c-emerald)', color: '#ffffff', borderColor: 'transparent' }
            : { backgroundColor: 'var(--c-surface)', color: 'var(--c-muted)', borderColor: 'var(--c-line)' }
        }
      >
        {displayName(person, idx)}
      </button>
    )
  }

  // ── Render ───────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      
      {/* ── COLUMN 1: CONFIG & PARTICIPANTS (lg:col-span-5) ── */}
      <div className="lg:col-span-5 space-y-4">
        <div 
          className="rounded-2xl border p-5 sm:p-6 space-y-5"
          style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}
        >
          <div>
            <h2 className="text-xl font-bold font-serif" style={{ color: 'var(--c-ink)' }}>Configuração da Conta</h2>
            <p className="text-xs italic mt-0.5" style={{ color: 'var(--c-muted)' }}>Defina quem participa e o tipo de rateio.</p>
          </div>

          {/* Mode toggle */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'itemized', label: 'Por item', sub: 'cada um paga o que pediu' },
              { key: 'equal', label: 'Igualmente', sub: 'divide o total igualmente' },
            ].map((opt) => {
              const isActive = mode === opt.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setMode(opt.key as typeof mode)}
                  className="p-3 rounded-xl border text-left transition-all cursor-pointer"
                  style={
                    isActive
                      ? { backgroundColor: 'var(--c-emerald)', borderColor: 'transparent' }
                      : { backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-line)' }
                  }
                >
                  <p className="text-sm font-bold" style={{ color: isActive ? '#ffffff' : 'var(--c-ink)' }}>{opt.label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--c-muted)' }}>{opt.sub}</p>
                </button>
              )
            })}
          </div>

          {/* Guide box */}
          <div 
            className="rounded-xl border px-4 py-3 space-y-1.5"
            style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Como usar</p>
            {mode === 'itemized' ? (
              <div className="space-y-1 text-xs" style={{ color: 'var(--c-muted)' }}>
                <p>1. Adicione os nomes e clique neles para personalizar se quiser.</p>
                <p>2. Adicione os itens (bebida, prato, etc.) e seu preço em BRL.</p>
                <p>3. Selecione quem divide cada item — o rateio é feito na hora.</p>
              </div>
            ) : (
              <div className="space-y-1 text-xs" style={{ color: 'var(--c-muted)' }}>
                <p>1. Adicione os participantes da mesa.</p>
                <p>2. Digite o valor total da nota fiscal.</p>
                <p>3. A divisão igualitária é computada instantaneamente.</p>
              </div>
            )}
          </div>

          {/* People list manager */}
          <div className="space-y-3">
            <label className="text-base font-semibold flex items-center justify-between" style={{ color: 'var(--c-muted)' }}>
              <span>Quem está na conta? <span className="font-normal text-xs">({people.length} pessoas)</span></span>
              <Tip text="Clique direto na caixa com o nome para renomear. Mínimo de 2 participantes. Adicione mais abaixo." />
            </label>
            
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
              {people.map((person, i) => (
                <div
                  key={person.id}
                  className="flex items-center gap-1.5 rounded-full pl-3 pr-1.5 py-1 border"
                  style={{ backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-line)' }}
                >
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => updateName(person.id, e.target.value)}
                    placeholder={`Pessoa ${i + 1}`}
                    title="Clique para renomear"
                    className="bg-transparent text-sm outline-none w-20 min-w-0 font-semibold"
                    style={{ color: 'var(--c-ink)' }}
                  />
                  {people.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removePerson(person.id)}
                      className="transition-colors p-0.5 rounded-md flex items-center justify-center cursor-pointer"
                      style={{ color: 'var(--c-muted)' }}
                      aria-label="Remover pessoa"
                    >
                      <Trash2 size={13} className="hover:text-red-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add person input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPerson()}
                placeholder="Nome de quem entra"
                className="flex-1 border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 font-semibold"
                style={{
                  backgroundColor: 'var(--c-bg)',
                  color: 'var(--c-ink)',
                  borderColor: 'var(--c-line)'
                }}
              />
              <button
                type="button"
                onClick={addPerson}
                className="px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0"
                style={{
                  borderColor: 'var(--c-line)',
                  color: 'var(--c-ink)',
                  backgroundColor: 'var(--c-surface)'
                }}
              >
                + Entrar
              </button>
            </div>
          </div>

          {/* Equal mode Total Input */}
          {mode === 'equal' && (
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
              <label htmlFor="bill-total" className="text-base font-semibold flex justify-between" style={{ color: 'var(--c-muted)' }}>
                <span>Valor Total da Conta</span>
                <Tip text="Digite o valor total da nota fiscal de consumo (incluindo bebidas e taxas de serviço). A gorjeta extra pode ser aplicada abaixo." />
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="bill-total"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder="0,00"
                  value={equalTotal}
                  onChange={(e) => setEqualTotal(e.target.value)}
                  className="w-full border rounded-xl pl-9 pr-4 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-455 tabular-nums"
                  style={{
                    backgroundColor: 'var(--c-bg)',
                    color: 'var(--c-ink)',
                    borderColor: 'var(--c-line)'
                  }}
                />
              </div>
            </div>
          )}

          {/* Tip selection */}
          <div className="space-y-2.5 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <label className="text-base font-semibold flex justify-between" style={{ color: 'var(--c-muted)' }}>
              <span>Gorjeta Adicional</span>
              <Tip text="A gorjeta é distribuída de forma proporcional ao consumo individual de cada participante (quem consome mais, arca com maior fatia da gorjeta)." />
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 5, 10, 15].map((t) => {
                const isActive = tip === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTip(t)}
                    className="py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer"
                    style={
                      isActive
                        ? { backgroundColor: 'var(--c-emerald)', color: '#ffffff', borderColor: 'transparent' }
                        : { backgroundColor: 'var(--c-bg)', color: 'var(--c-muted)', borderColor: 'var(--c-line)' }
                    }
                  >
                    {t === 0 ? 'Sem' : `${t}%`}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── COLUMN 2: ITEMS & DETAILED RESULTS (lg:col-span-7) ── */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* Itemized bill list */}
        {mode === 'itemized' && (
          <div 
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}
          >
            
            {/* Item list wrapper */}
            {items.length > 0 && (
              <div className="divide-y max-h-96 overflow-y-auto scrollbar-thin" style={{ borderColor: 'var(--c-line)' }}>
                {items.map((item) => {
                  const payers = resolvePayers(item)
                  const isEditing = editingId === item.id

                  return (
                    <div key={item.id} className="p-4 space-y-3">
                      {isEditing ? (
                        /* Edit mode */
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              autoFocus
                              type="text"
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id)}
                              className="flex-1 min-w-0 border rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                              style={{
                                backgroundColor: 'var(--c-bg)',
                                color: 'var(--c-ink)',
                                borderColor: 'var(--c-line)'
                              }}
                            />
                            <div className="relative shrink-0 w-28">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: 'var(--c-muted)' }}>R$</span>
                              <input
                                type="number"
                                inputMode="decimal"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id)}
                                className="w-full border rounded-lg pl-7 pr-2 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-455 tabular-nums"
                                style={{
                                  backgroundColor: 'var(--c-bg)',
                                  color: 'var(--c-ink)',
                                  borderColor: 'var(--c-line)'
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => saveEdit(item.id)}
                              disabled={!editDesc.trim() || parseFloat(editPrice) <= 0}
                              className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:opacity-90 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer"
                            >
                              ✓ Salvar
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer"
                              style={{
                                borderColor: 'var(--c-line)',
                                color: 'var(--c-muted)',
                                backgroundColor: 'var(--c-surface)'
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal view */
                        <>
                          {/* Info and price */}
                          <div className="flex items-center gap-2">
                            <span className="flex-1 text-sm font-bold min-w-0 truncate" style={{ color: 'var(--c-ink)' }}>
                              {item.description}
                            </span>
                            <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: 'var(--c-ink)' }}>
                              {formatBRLDecimal(item.price)}
                            </span>
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              className="transition-colors ml-1 shrink-0 p-1 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] cursor-pointer"
                              style={{ color: 'var(--c-muted)' }}
                              aria-label="Editar item"
                              title="Editar"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="transition-colors shrink-0 p-1 rounded-lg hover:bg-red-500/10 cursor-pointer"
                              style={{ color: 'var(--c-muted)' }}
                              aria-label="Remover item"
                              title="Remover"
                            >
                              <Trash2 size={15} className="hover:text-red-500" />
                            </button>
                          </div>

                          {/* Payer chips list */}
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
                              Quem divide este item?
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {people.map((person) => (
                                <PersonChip
                                  key={person.id}
                                  personId={person.id}
                                  selected={payers.includes(person.id)}
                                  onToggle={() => toggleItemPayer(item.id, person.id)}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Price per person split summary */}
                          {payers.length > 1 && (
                            <p className="text-[10px] italic font-semibold" style={{ color: 'var(--c-muted)' }}>
                              ({formatBRLDecimal(item.price / payers.length)} por pessoa)
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Subtotal bar */}
            {items.length > 0 && (
              <div 
                className="flex items-center justify-between px-4 py-3 border-t"
                style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}
              >
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Subtotal</span>
                <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--c-ink)' }}>{formatBRLDecimal(calc.subtotal)}</span>
              </div>
            )}

            {/* Form add item */}
            <div 
              className="p-4 space-y-2.5 border-t border-dashed"
              style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Adicionar Item</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--c-muted)' }}>Digite a descrição e o preço BRL do item consumido.</p>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                  placeholder="Ex: Coca-Cola Lata"
                  className="flex-1 min-w-0 border rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-455 font-semibold"
                  style={{
                    backgroundColor: 'var(--c-bg)',
                    color: 'var(--c-ink)',
                    borderColor: 'var(--c-line)'
                  }}
                />
                <div className="relative shrink-0 w-28">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: 'var(--c-muted)' }}>R$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="0,00"
                    className="w-full border rounded-lg pl-7 pr-2 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-455 tabular-nums"
                    style={{
                      backgroundColor: 'var(--c-bg)',
                      color: 'var(--c-ink)',
                      borderColor: 'var(--c-line)'
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  disabled={!newDesc.trim() || !newPrice || parseFloat(newPrice) <= 0}
                  className="shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results layout */}
        {hasResults && (
          <div role="region" aria-live="polite" className="space-y-4">
            <SectionDivider label="Divisão da Conta" />
            
            {mode === 'equal' ? (
              <>
                {/* Equal Mode centered result hero */}
                <div
                  className="text-center py-8 px-4 rounded-2xl border"
                  style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}
                >
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--c-muted)' }}>Cada um paga</p>
                  <p className="text-5xl font-bold tabular-nums font-serif" style={{ color: 'var(--c-emerald)' }}>
                    {formatBRLDecimal(perPersonEqual)}
                  </p>
                  {tip > 0 && (
                    <p className="text-xs italic mt-2" style={{ color: 'var(--c-muted)' }}>
                      Gorjeta de {tip}% inclusa · total da nota: {formatBRLDecimal(equalWithTip)}
                    </p>
                  )}
                </div>

                {/* Participant split items list */}
                <div 
                  className="rounded-2xl border p-5 space-y-3"
                  style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}
                >
                  <p className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>Faturamento Individual</p>
                  <div className="divide-y" style={{ borderColor: 'var(--c-line)' }}>
                    {people.map((person, i) => (
                      <div key={person.id} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                        <span className="text-sm font-semibold" style={{ color: 'var(--c-ink)' }}>{displayName(person, i)}</span>
                        <span className="font-bold tabular-nums" style={{ color: 'var(--c-ink)' }}>{formatBRLDecimal(perPersonEqual)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Itemized mode results list */
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {calc.breakdown.map(({ person, index, sub, tip: t, total }) => (
                    <div 
                      key={person.id} 
                      className="rounded-2xl overflow-hidden shadow-sm border" 
                      style={{ borderColor: 'var(--c-line)' }}
                    >
                      {/* Person Card Header */}
                      <div
                        className="flex items-center justify-between px-4 py-3"
                        style={{ background: 'linear-gradient(135deg, #172030, #1A2E3E)' }}
                      >
                        <span className="text-sm font-bold text-white/90 truncate mr-2">{displayName(person, index)}</span>
                        <span className="text-base font-bold tabular-nums shrink-0" style={{ color: '#00C4BE' }}>
                          {formatBRLDecimal(total)}
                        </span>
                      </div>
                      
                      {/* Person Card Body */}
                      <div className="px-4 py-3 space-y-1.5" style={{ backgroundColor: 'var(--c-card-calm)' }}>
                        {items.map((item) => {
                          const payers = resolvePayers(item)
                          if (!payers.includes(person.id)) return null
                          const share = item.price / payers.length
                          return (
                            <div key={item.id} className="flex justify-between items-baseline gap-2 text-xs">
                              <span className="min-w-0 truncate" style={{ color: 'var(--c-muted)' }}>
                                {item.description}
                                {payers.length > 1 && (
                                  <span className="text-[9px] font-bold ml-1" style={{ color: 'var(--c-muted-2)' }}>÷{payers.length}</span>
                                )}
                              </span>
                              <span className="tabular-nums shrink-0 font-semibold" style={{ color: 'var(--c-muted)' }}>{formatBRLDecimal(share)}</span>
                            </div>
                          )
                        })}
                        {tip > 0 && t > 0 && (
                          <div className="flex justify-between items-baseline gap-2 text-xs border-t pt-1.5 mt-1" style={{ borderColor: 'var(--c-line)' }}>
                            <span style={{ color: 'var(--c-muted)' }}>Gorjeta ({tip}%)</span>
                            <span className="tabular-nums shrink-0 font-semibold" style={{ color: 'var(--c-muted)' }}>{formatBRLDecimal(t)}</span>
                          </div>
                        )}
                        {sub === 0 && (
                          <p className="text-xs italic" style={{ color: 'var(--c-muted-2)' }}>nenhum item atribuído</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Consolidation total bar */}
                <div
                  className="flex items-center justify-between px-5 py-3.5 rounded-2xl border"
                  style={{ background: 'linear-gradient(135deg, #172030, #1A2E3E)', borderColor: 'var(--c-line)' }}
                >
                  <span className="text-sm font-bold text-white/70">Total Geral da Nota</span>
                  <span className="text-base font-bold tabular-nums" style={{ color: '#00C4BE' }}>
                    {formatBRLDecimal(calc.subtotal + calc.tipAmt)}
                  </span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <button
              type="button"
              onClick={copyMarkdown}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 font-bold rounded-xl transition-colors text-sm cursor-pointer border"
              style={{
                backgroundColor: 'var(--c-surface)',
                color: 'var(--c-ink)',
                borderColor: 'var(--c-line)'
              }}
            >
              {copied ? '✓ Tabela Copiada!' : '⎘ Copiar Tabela (Markdown)'}
            </button>

            {/* Promoting Card */}
            <div
              className="rounded-2xl p-5 border space-y-2"
              style={{ background: 'linear-gradient(145deg, #0D1A2A, #122030)', borderColor: '#1E3040' }}
            >
              <p className="text-white/80 text-sm font-bold">Quer dividir tirando foto do cardápio?</p>
              <p className="text-white/50 text-sm leading-relaxed">
                O aplicativo mobile **A Ponta do Lápis** utilizará IA para escanear a foto da conta/cardápio do restaurante, atribuir itens e calcular quem deve o quê instantaneamente.
              </p>
              <p className="text-white/20 text-xs italic">Em desenvolvimento — apenas quando estiver excelente.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
