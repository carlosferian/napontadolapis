import type { Metadata } from 'next'
import { GameLauncher } from '@/components/GameLauncher'
import { AppCTA }       from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { FAQ } from '@/components/ui/FAQ'

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

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">A matemática por trás das odds</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Toda casa de apostas calcula a <strong>probabilidade implícita</strong> de cada resultado a partir
          da odd oferecida (probabilidade ≈ 1 ÷ odd) e soma uma margem — a chamada "vigorish" ou "overround" —
          que garante o lucro da casa independentemente de quem ganhe. Some as probabilidades implícitas de
          todos os resultados de um evento e o total quase sempre passa de 100%: essa diferença é a fatia
          que a casa já embolsou antes mesmo de a partida começar. É por isso que, no longo prazo, mesmo
          apostadores com bom conhecimento técnico tendem a perder dinheiro — a estrutura do jogo é
          matematicamente desfavorável para quem aposta.
        </p>
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Por que "quase ganhei" não é quase nada</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Estudos de psicologia do jogo mostram que apostas com resultado "quase certo" (como perder uma
          aposta esportiva no último minuto) ativam no cérebro os mesmos circuitos de recompensa de uma
          vitória real — o chamado <strong>"near-miss effect"</strong>. As plataformas de apostas são
          desenhadas para gerar esses momentos com frequência, reforçando a sensação de que "a próxima vai
          dar". Esse mecanismo, somado à facilidade de depósito via Pix e à disponibilidade 24 horas,
          contribui para o ciclo de apostas repetidas que caracteriza a ludopatia.
        </p>
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">O tamanho do problema no Brasil</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Segundo dados do Banco Central, em 2024 famílias brasileiras de baixa renda destinaram parcela
          significativa do orçamento mensal a apostas esportivas online, em muitos casos superando gastos
          com itens básicos. O simulador acima existe para tornar essa matemática tangível: em vez de
          explicar com gráficos, ele deixa você experimentar — em poucos minutos — a curva de perdas que,
          na vida real, se estende por meses ou anos.
        </p>
      </div>

      <FAQ items={[
        {
          question: 'É possível ganhar dinheiro consistentemente apostando em casas de apostas?',
          answer: 'No longo prazo, não. A margem (overround) embutida nas odds garante que a soma das probabilidades implícitas passe de 100%, ou seja, a casa já tem uma vantagem matemática antes mesmo do evento começar. Apostadores podem ter sequências de sorte, mas a expectativa matemática de quem aposta repetidamente é negativa.',
        },
        {
          question: 'Por que sinto que "quase ganhei" em apostas que perdi?',
          answer: 'É o chamado "near-miss effect": resultados quase certos (como perder no último minuto) ativam circuitos de recompensa parecidos com os de uma vitória real. As plataformas são desenhadas para gerar esses momentos com frequência, o que reforça a vontade de apostar de novo.',
        },
        {
          question: 'O simulador desta página usa dinheiro real?',
          answer: 'Não. É um simulador 100% fictício, sem cadastro, sem dinheiro real e sem coleta de dados — criado apenas para demonstrar, na prática, a matemática que sustenta as casas de apostas.',
        },
      ]} />

      <SourcesFooter sources={[
        { label: 'Banco Central do Brasil — Apostas Esportivas e impacto no orçamento das famílias', url: 'https://www.bcb.gov.br/estabilidadefinanceira/apostasesportivas' },
        { label: 'BCB — Sistema de Metas de Inflação e taxa Selic vigente', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
        { label: 'Instituto de Psiquiatria da USP — Ludomania no Brasil', url: 'https://www.ipq.hc.fm.usp.br' },
      ]} />

      <AppCTA context="esse gasto" />
    </div>
  )
}
