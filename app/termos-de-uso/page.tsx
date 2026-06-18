import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos de Uso — A Ponta do Lápis',
  description: 'Leia os Termos de Uso das nossas calculadoras financeiras. Entenda as condições, limites e isenções de responsabilidade matemática.',
  alternates: { canonical: 'https://apontadolapis.com.br/termos-de-uso' },
}

export default function TermosDeUsoPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-10">

      {/* Header */}
      <div className="calm-header" style={{ paddingBottom: 24, borderBottom: '1px solid var(--c-line)' }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          CONTRATO
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Termos de Uso
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Condições e isenções de responsabilidade ao utilizar nossas ferramentas.
        </p>
      </div>

      {/* 1. Aceitação dos Termos */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>1. Aceitação dos Termos</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Ao acessar e utilizar as calculadoras, simuladores ou qualquer conteúdo disponibilizado no site <strong>A Ponta do Lápis</strong> (apontadolapis.com.br), você concorda integralmente com estes Termos de Uso. Caso não concorde com qualquer uma das condições estabelecidas, solicitamos que não utilize nossas ferramentas.
        </p>
      </div>

      {/* 2. Natureza Informativa e Isenção de Garantia */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>2. Natureza Informativa e Isenção de Garantia</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Nossas calculadoras são ferramentas de simulação matemática desenvolvidas para fins exclusivamente educativos e de orientação inicial de cenário. Nós nos esforçamos ao máximo para assegurar a correção das fórmulas matemáticas, alíquotas de impostos e simulações de rendimentos.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Entretanto, o site e seu autor não oferecem qualquer garantia, expressa ou implícita, de que as simulações refletirão perfeitamente as condições reais oferecidas por bancos, financeiras, órgãos públicos ou corretoras de valores no momento do seu fechamento de contrato. As condições de mercado, taxas específicas de cada perfil de cliente (score de crédito, impostos locais, taxas ocultas) variam e podem alterar significativamente os números finais.
        </p>
      </div>

      {/* 3. Limitação de Responsabilidade */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>3. Limitação de Responsabilidade</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          O site <strong>A Ponta do Lápis</strong> e seu criador não serão responsáveis por quaisquer danos diretos, indiretos, incidentais, consequentes ou perdas financeiras decorrentes do uso das informações ou dos cálculos simulados aqui presentes.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          O usuário assume total e integral responsabilidade por qualquer decisão tomada com base nos resultados das nossas calculadoras. Reiteramos a recomendação de validar qualquer compromisso financeiro significativo junto a profissionais qualificados e credenciados do setor financeiro ou contábil.
        </p>
      </div>

      {/* 4. Propriedade Intelectual e Uso Permitido */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>4. Propriedade Intelectual e Uso Permitido</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Todo o conteúdo textual, design visual, identidade gráfica e códigos originais de lógica das calculadoras são protegidos por leis de direitos autorais. O uso pessoal e não comercial do site é livre e gratuito.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          É estritamente proibido copiar, republicar, extrair dados ou embutir as ferramentas deste site (via iframe ou scraping de API) em outras páginas comerciais ou de captação de leads sem autorização prévia por escrito.
        </p>
      </div>

      {/* 5. Alterações nos Termos e Serviços */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>5. Alterações nos Termos e Serviços</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Reservamos o direito de atualizar, modificar ou descontinuar qualquer calculadora ou conteúdo do site a qualquer momento, bem como alterar estes Termos de Uso sem aviso prévio. A versão vigente e atualizada sempre estará acessível através deste endereço.
        </p>
      </div>

      {/* Footer links */}
      <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--c-line)' }}>
        <Link href="/" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--c-muted)' }}>
          ← Voltar ao início
        </Link>
        <Link href="/politica-editorial" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--c-emerald)' }}>
          Política Editorial →
        </Link>
      </div>

    </div>
  )
}
