import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política Editorial — A Ponta do Lápis',
  description: 'Conheça nossos compromissos com a transparência, precisão matemática, privacidade e fontes oficiais nas nossas calculadoras financeiras.',
  alternates: { canonical: 'https://apontadolapis.com.br/politica-editorial' },
}

export default function PoliticaEditorialPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-10">

      {/* Header */}
      <div className="calm-header" style={{ paddingBottom: 24, borderBottom: '1px solid var(--c-line)' }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          TRANSPARÊNCIA
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Política Editorial
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Nossos compromissos com a precisão dos dados, a independência editorial e a privacidade.
        </p>
      </div>

      {/* 1. Propósito Educativo e Isenção */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>1. Propósito Educativo e Isenção</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          O site <strong>A Ponta do Lápis</strong> é uma plataforma exclusivamente informativa e de simulação matemática educativa. Nenhuma de nossas ferramentas ou conteúdos constitui conselho de investimento, recomendação de compra ou venda de ativos, parecer contábil, jurídico, tributário ou assessoria financeira regulamentada.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          As simulações servem apenas como referência aproximada baseada nos inputs fornecidos pelo próprio usuário. Para decisões de alta complexidade ou que envolvam riscos significativos ao seu patrimônio (como financiamento imobiliário ou investimentos de longo prazo), recomendamos a consulta a profissionais certificados (planejadores CFP, contadores registrados ou advogados).
        </p>
      </div>

      {/* 2. Exatidão Matemática e Atualização */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>2. Exatidão Matemática e Atualização</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Nos esforçamos para manter todas as fórmulas matemáticas alinhadas com as metodologias oficiais e de mercado adotadas no Brasil (como regras do Banco Central, Receita Federal e tabelas da CLT).
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Os parâmetros dinâmicos (como a taxa Selic e o CDI) são atualizados diariamente por scripts automáticos que buscam os dados da API pública do Banco Central do Brasil. Outros parâmetros, como tabelas de Imposto de Renda (IRPF 2026), contribuição de INSS e limites legais de benefícios são atualizados manualmente conforme a legislação é publicada no Diário Oficial da União.
        </p>
      </div>

      {/* 3. Fontes de Dados Utilizadas */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>3. Fontes de Dados Utilizadas</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Privilegiamos sempre as bases de dados e informações fornecidas por órgãos públicos e reguladores oficiais do Brasil. Nossas fontes primárias de referência incluem:
        </p>
        <ul className="text-sm list-disc pl-5 space-y-1" style={{ color: 'var(--c-muted)' }}>
          <li><strong>Banco Central do Brasil (BCB):</strong> para taxas de juros, inflação histórica, regras de consórcio e portabilidade de crédito.</li>
          <li><strong>Receita Federal do Brasil (RFB):</strong> para tabelas progressivas mensais e anuais de IRPF.</li>
          <li><strong>Ministério do Trabalho e Emprego / Planalto:</strong> para regras CLT de rescisão trabalhista e seguro-desemprego.</li>
          <li><strong>Instituto Brasileiro de Geografia e Estatística (IBGE):</strong> para reajustes de inflação oficial (IPCA).</li>
        </ul>
      </div>

      {/* 4. Privacidade de Dados Absoluta */}
      <div className="space-y-4">
        <h2 className="text-lg font-black" style={{ color: 'var(--c-ink)' }}>4. Privacidade de Dados Absoluta</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Diferente de simuladores comerciais que coletam informações de contato (leads) para vender produtos financeiros, <strong>A Ponta do Lápis é 100% client-side</strong>. Toda a lógica de cálculo roda exclusivamente no navegador do seu computador ou celular.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Nós não temos servidores que armazenam seus dados financeiros digitados (como salários, parcelas ou valores poupados), nem exigimos logins, CPF ou e-mail. Seus dados permanecem apenas na sua tela e são descartados assim que a página é fechada.
        </p>
      </div>

      {/* Footer links */}
      <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--c-line)' }}>
        <Link href="/" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--c-muted)' }}>
          ← Voltar ao início
        </Link>
        <Link href="/termos-de-uso" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--c-emerald)' }}>
          Termos de Uso →
        </Link>
      </div>

    </div>
  )
}
