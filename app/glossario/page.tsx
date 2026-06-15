import type { Metadata } from 'next'
import Link from 'next/link'
import { RATES } from '@/config/rates'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Glossário Financeiro — termos explicados em português simples',
  description: 'Selic, CDI, IPCA, IOF, INSS, FGTS, SAC, Price e outros termos financeiros explicados em português simples, com exemplos do dia a dia do brasileiro.',
  openGraph: {
    title: 'Glossário Financeiro — A Ponta do Lápis',
    description: 'Termos financeiros explicados em português simples, sem economês.',
    url: 'https://apontadolapis.com.br/glossario',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/glossario' },
}

const pct = (v: number) => `${(v * 100).toFixed(2).replace('.', ',')}%`

const terms: { term: string; def: string; link?: { href: string; label: string } }[] = [
  {
    term: 'Selic',
    def: `É a taxa básica de juros da economia brasileira, definida pelo Banco Central. Ela serve de referência para quase todas as outras taxas: empréstimos, financiamentos, poupança e títulos públicos. Hoje a Selic está em ${pct(RATES.selic)} ao ano. Quando a Selic sobe, o crédito fica mais caro e o rendimento de aplicações de renda fixa aumenta.`,
    link: { href: '/investimentos', label: 'Comparar investimentos com a Selic' },
  },
  {
    term: 'CDI',
    def: `O Certificado de Depósito Interbancário é a taxa que os bancos usam para emprestar dinheiro entre si por um dia. Na prática, anda quase colado à Selic (hoje em ${pct(RATES.cdi)} ao ano) e é a referência mais comum para CDBs, fundos e LCIs/LCAs — por isso é comum ver investimentos anunciados como "100% do CDI" ou "120% do CDI".`,
  },
  {
    term: 'IPCA',
    def: 'É o índice oficial de inflação do Brasil, medido pelo IBGE. Mostra quanto os preços de uma cesta de produtos e serviços (alimentação, transporte, moradia etc.) subiram em um período. O Tesouro IPCA+ paga esse índice mais uma taxa fixa, protegendo o poder de compra do investidor.',
  },
  {
    term: 'IOF',
    def: 'Imposto sobre Operações Financeiras. Aparece em diversas operações do dia a dia: compras com cartão internacional (3,38%), empréstimos, seguros e câmbio. É cobrado automaticamente pela instituição financeira e não é negociável.',
    link: { href: '/viagens/planejar', label: 'Calcular o IOF de uma viagem' },
  },
  {
    term: 'INSS',
    def: 'É a contribuição obrigatória ao Instituto Nacional do Seguro Social, descontada do salário de quem trabalha com carteira assinada. Em troca, o trabalhador tem direito a benefícios como aposentadoria, auxílio-doença e licença maternidade. A alíquota é progressiva: quanto maior o salário, maior o percentual descontado em cada faixa.',
    link: { href: '/trabalho/realidade-brasileira', label: 'Ver quanto sobra do seu salário' },
  },
  {
    term: 'FGTS',
    def: 'O Fundo de Garantia do Tempo de Serviço é um valor (8% do salário bruto) que o empregador deposita mensalmente em uma conta vinculada ao trabalhador, na Caixa Econômica Federal. Pode ser sacado em situações como demissão sem justa causa, compra de imóvel ou aposentadoria.',
    link: { href: '/trabalho/rescisao', label: 'Simular uma rescisão com FGTS' },
  },
  {
    term: 'IRPF (Imposto de Renda Pessoa Física)',
    def: 'É o imposto cobrado sobre os rendimentos de pessoas físicas — salário, aluguel, aplicações financeiras etc. No Brasil, a tabela é progressiva: faixas de renda maiores pagam alíquotas maiores. Desde 2026, a Lei nº 15.270/2025 (conhecida como "Lei dos 5 Mil") isenta integralmente quem ganha até R$ 5.000 por mês, com isenção parcial decrescente até R$ 7.350.',
    link: { href: '/trabalho/imposto-de-renda', label: 'Calcular seu IRPF 2026' },
  },
  {
    term: 'SAC (Sistema de Amortização Constante)',
    def: 'Forma de pagamento de financiamentos em que a parcela de amortização (o valor que reduz a dívida) é sempre a mesma. Como os juros incidem sobre o saldo devedor — que vai diminuindo — a parcela total começa mais alta e cai mês a mês. No total, costuma ser mais barato que o sistema Price.',
    link: { href: '/investimentos/financiamento-ou-consorcio', label: 'Comparar SAC e Price' },
  },
  {
    term: 'Tabela Price',
    def: 'Forma de pagamento de financiamentos em que a parcela total é fixa do início ao fim do contrato. No começo, a maior parte da parcela é juros; no final, a maior parte é amortização. Facilita o planejamento mensal, mas o custo total tende a ser maior que no SAC.',
    link: { href: '/investimentos/financiamento-ou-consorcio', label: 'Comparar SAC e Price' },
  },
  {
    term: 'CET (Custo Efetivo Total)',
    def: 'É o indicador que resume, em uma única taxa anual, todos os custos de um empréstimo ou financiamento: juros, IOF, seguros e taxas administrativas. Por lei, os bancos são obrigados a informar o CET — é o número que realmente importa para comparar propostas, não a "taxa de juros" anunciada isoladamente.',
  },
  {
    term: 'Poupança',
    def: `É a aplicação mais popular e mais simples do Brasil, com isenção de Imposto de Renda. Quando a Selic está acima de 8,5% ao ano, a poupança rende 0,5% ao mês mais a TR (Taxa Referencial) — hoje algo em torno de ${pct(RATES.poupanca)} ao ano. Apesar da isenção de IR, costuma perder para CDBs e Tesouro Selic em rentabilidade líquida.`,
  },
  {
    term: 'Tesouro Direto',
    def: `Programa do governo federal que permite a qualquer pessoa comprar títulos públicos a partir de poucos reais. O Tesouro Selic acompanha a taxa básica de juros (hoje rendendo perto de ${pct(RATES.tesouroDireto)} ao ano antes de IR) e é considerado o investimento de menor risco do país, sendo a referência para montar uma reserva de emergência.`,
    link: { href: '/investimentos/reserva-de-emergencia', label: 'Calcular sua reserva de emergência' },
  },
  {
    term: 'Spread cambial',
    def: 'É a diferença entre a cotação "real" de uma moeda (a que aparece no Google ou no mercado interbancário) e o preço que o banco ou casa de câmbio efetivamente cobra de você. Em cartões de crédito internacionais, esse spread costuma variar entre 3% e 6% acima da cotação comercial, somado ao IOF.',
    link: { href: '/viagens/planejar', label: 'Ver o impacto do spread em uma viagem' },
  },
  {
    term: 'Liquidez',
    def: 'É a facilidade (e velocidade) de transformar um investimento em dinheiro disponível, sem perder valor. Dinheiro em conta corrente tem liquidez total; um imóvel tem liquidez baixa, pois pode levar meses para ser vendido. Para a reserva de emergência, liquidez diária é essencial.',
  },
  {
    term: 'Renda fixa vs. renda variável',
    def: 'Renda fixa são investimentos cuja regra de rentabilidade é conhecida no momento da aplicação (CDBs, Tesouro Direto, LCIs) — o risco é menor e mais previsível. Renda variável (ações, fundos imobiliários, criptomoedas) não tem retorno garantido e pode oscilar bastante no curto prazo, mas historicamente tende a render mais no longo prazo.',
  },
  {
    term: 'Overround (ou "vigorish")',
    def: 'É a margem de lucro que as casas de apostas embutem nas odds. Somando as probabilidades implícitas de todos os resultados possíveis de um jogo, o total passa de 100% — essa diferença é o overround, e garante o lucro da casa independentemente de quem ganhar.',
    link: { href: '/apostas', label: 'Entender a matemática das apostas' },
  },
]

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'Glossário Financeiro — A Ponta do Lápis',
  description: 'Termos financeiros explicados em português simples.',
  hasDefinedTerm: terms.map(t => ({
    '@type': 'DefinedTerm',
    name: t.term,
    description: t.def,
  })),
}

export default function GlossarioPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Header */}
      <div className="calm-header" style={{ paddingBottom: 24, borderBottom: '1px solid var(--c-line)' }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
          EDUCAÇÃO FINANCEIRA
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Glossário Financeiro
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
          Os termos que aparecem nas nossas calculadoras — e em qualquer extrato de banco —
          explicados em português simples, sem economês.
        </p>
      </div>

      {/* Termos */}
      <div className="space-y-5">
        {terms.map(t => (
          <div key={t.term} className="rounded-2xl border p-4" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
            <h2 className="text-sm font-bold" style={{ color: 'var(--c-ink)' }}>{t.term}</h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-muted)' }}>{t.def}</p>
            {t.link && (
              <Link href={t.link.href} className="text-xs font-semibold mt-2 inline-block hover:opacity-70 transition-opacity" style={{ color: 'var(--c-emerald)' }}>
                {t.link.label} →
              </Link>
            )}
          </div>
        ))}
      </div>

      <SourcesFooter sources={[
        { label: 'BCB — Taxa Selic e CDI vigentes', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' },
        { label: 'IBGE — Índice de Preços ao Consumidor Amplo (IPCA)', url: 'https://www.ibge.gov.br/explica/inflacao.php' },
        { label: 'Receita Federal — Tabela do IRPF 2026 e Lei nº 15.270/2025', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026' },
        { label: 'Caixa Econômica Federal — FGTS', url: 'https://www.caixa.gov.br/beneficios-trabalhador/fgts/' },
      ]} />

      {/* Footer links */}
      <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--c-line)' }}>
        <Link href="/" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--c-muted)' }}>
          ← Voltar ao início
        </Link>
        <Link href="/sobre" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--c-emerald)' }}>
          Sobre o autor →
        </Link>
      </div>

    </div>
  )
}
