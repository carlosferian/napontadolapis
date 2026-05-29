import type { Metadata } from 'next'
import { BrazilianRealidadeCalculator } from '@/components/calculators/BrazilianRealidadeCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Calculadora de Realidade Brasileira — Onde você está na pirâmide de renda?',
  description: 'Compare seu salário líquido com a realidade brasileira e estadual. Veja em qual percentil da população você se enquadra de acordo com dados do IBGE. Sem cadastro.',
  openGraph: {
    title: 'Simulador de Renda vs. Realidade Brasileira — A Ponta do Lápis',
    description: 'Você sabe onde seu salário realmente te posiciona na pirâmide social? Descubra o tamanho real da desigualdade.',
    url: 'https://apontadolapis.com.br/trabalho/realidade-brasileira',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/trabalho/realidade-brasileira' },
}

export default function RealidadeBrasileiraPage() {
  return (
    <div className="space-y-6">
      
      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          TRABALHO · DESIGUALDADE REAL
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Seu salário diante da<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>realidade brasileira.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Existe um abismo entre o que consideramos "classe média" nas grandes bolhas e a realidade matemática do país.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Insira sua renda mensal líquida e descubra exatamente qual porcentagem da população brasileira e do seu próprio estado você supera.</strong>{' '}
          Sem julgamento moral, sem discursos — apenas dados oficiais e matemática crua.
        </p>
      </div>

      <BrazilianRealidadeCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-4">
        <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">O choque estatístico e a bolha social</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Para a maioria dos profissionais com nível superior ou atuando no setor de tecnologia, serviços corporativos e cargos públicos, é comum sentir que a renda individual é apenas mediana. No entanto, no contexto macroeconômico do Brasil, **ganhar mais de R$ 5.000,00 por mês coloca o cidadão no topo dos 10% mais ricos do país**.
        </p>
        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Essa distorção ocorre porque vivemos em bolhas sociais segregadas. O Brasil é uma das nações mais desiguais do planeta, com um dos índices de Gini mais concentrados do mundo. De acordo com o IBGE, metade dos trabalhadores brasileiros sobrevive com menos de um salário mínimo por mês, e a maior fatia da massa de rendimentos está extremamente concentrada no topo da pirâmide (os 1% e 0,1% mais ricos).
        </p>
      </div>

      <SourcesFooter sources={[
        { label: 'IBGE — PNAD Contínua (Pesquisa Nacional por Amostra de Domicílios Contínua) sobre rendimentos', url: 'https://www.ibge.gov.br/estatisticas/sociais/trabalho/17270-pnad-continua.html' },
        { label: 'DIEESE — Preço Médio e Pesquisa Nacional da Cesta Básica de Alimentos por capital', url: 'https://www.dieese.org.br/analisecestabasica/cestaBasica.html' },
        { label: 'Portal da Transparência — Remuneração de cargos e carreiras do funcionalismo federal', url: 'https://portaldatransparencia.gov.br/servidores' },
      ]} />
      
      <AppCTA context="seu posicionamento na realidade brasileira e planejamento de carreira" />
    </div>
  )
}
