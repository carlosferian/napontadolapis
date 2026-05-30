import type { Metadata } from 'next'
import { GameLauncher } from '@/components/GameLauncher'
import { AppCTA }       from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'A Ilusão das Apostas — Jogue, perca e entenda a matemática',
  description: 'Um cassino virtual que revela a matemática real das bets. Jogue, experimente a decadência, e descubra quanto você realmente perde.',
  openGraph: {
    title: 'A Ilusão das Apostas — A Ponta do Lápis',
    description: 'Jogue. Perca. Entenda. A matemática das bets nunca mente.',
    url: 'https://apontadolapis.com.br/apostas',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/apostas' },
}

export default function ApostasPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)' }}>
        <span className="c-pill c-pill-copper" style={{ marginBottom: 16, display: 'inline-flex' }}>
          APOSTAS · SIMULAÇÃO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(28px, 5vw, 52px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          A casa não é burra.<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>Mas você pode ser mais esperto.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Em 2024, os brasileiros transferiram{' '}
          <strong style={{ color: 'var(--c-ink)' }}>R$ 130 bilhões para bancas de apostas</strong>.
          Antes de qualquer texto, jogue o simulador abaixo. Você vai sentir na pele o que os números tentam te dizer.
        </p>
      </div>

      {/* O que você vai viver */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { n: '01', title: 'Jogue', desc: 'Escolha um bem real para depositar e jogue o cassino. Vitórias no início. Sempre.' },
          { n: '02', title: 'Perca', desc: 'Assista o saldo derreter. O cassino foi projetado para isso. Sem exceção.' },
          { n: '03', title: 'Entenda', desc: '5 capítulos de dados, psicologia e matemática. O que ninguém te conta sobre bets.' },
        ].map(s => (
          <div key={s.n} className="rounded-2xl p-5 border" style={{ background: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
            <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--c-muted)' }}>{s.n}</div>
            <div className="text-base font-black mb-1" style={{ color: 'var(--c-ink)' }}>{s.title}</div>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Botão de entrada */}
      <GameLauncher />

      <SourcesFooter sources={[
        { label: 'Banco Central do Brasil — Apostas Esportivas e impacto no orçamento das famílias', url: 'https://www.bcb.gov.br/estabilidadefinanceira/apostasesportivas' },
        { label: 'BCB — Sistema de Metas de Inflação e taxa Selic vigente', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
        { label: 'Instituto de Psiquiatria da USP — Ludomania no Brasil', url: 'https://www.ipq.hc.fm.usp.br' },
      ]} />

      <AppCTA context="esse gasto" />
    </div>
  )
}
