import React from 'react'

interface AppCTAProps {
  context?: string
}

export function AppCTA({ context }: AppCTAProps) {
  return (
    <div
      className="rounded-2xl p-6 border space-y-3"
      style={{ background: 'linear-gradient(145deg, #172030, #1A3A2A)', borderColor: '#1E3040' }}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#00C4BE' }}
        >
          App em desenvolvimento
        </span>
      </div>
      <p className="text-white/80 text-sm leading-relaxed">
        {context
          ? `No app A Ponta do Lápis você lança ${context} direto no seu orçamento mensal.`
          : 'No app A Ponta do Lápis você acompanha todos esses gastos no orçamento mensal.'}
        {' '}A mesma matemática honesta do site, agora como rotina diária.
      </p>
      <ul className="space-y-1.5">
        {[
          'Lança em segundos. Sem nuvem, sem CPF.',
          'Seus dados ficam no seu celular.',
          'Em desenvolvimento para Android.',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-white/40">
            <span style={{ color: '#00C4BE' }} className="mt-0.5 shrink-0">·</span>
            {item}
          </li>
        ))}
      </ul>
      <p className="text-white/20 text-xs italic">sem data prometida — só quando estiver bom.</p>
    </div>
  )
}
