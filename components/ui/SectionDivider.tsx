import React from 'react'

interface SectionDividerProps {
  label: string
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-stone-100" />
      <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-px bg-stone-100" />
    </div>
  )
}
