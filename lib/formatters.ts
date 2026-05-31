// lib/formatters.ts

/** Formata número como moeda BRL com R$ — para exibição em resultados. Ex: R$ 1.234,56 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/** Alias mantido por retrocompatibilidade */
export const formatBRLDecimal = formatBRL

/**
 * Formata número para exibição em campos de formulário.
 * Sem prefixo R$, com 2 casas decimais obrigatórias.
 * Ex: 1234 → "1.234,00" | 1234.56 → "1.234,56"
 */
export function formatBRLInput(value: number): string {
  if (value === 0) return ''
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Converte string formatada em pt-BR de volta para número.
 * Aceita qualquer combinação de formatação:
 *   "1.234,56"  → 1234.56
 *   "1.234"     → 1234
 *   "1234"      → 1234
 *   "R$ 50.000" → 50000
 *   ""          → 0
 */
export function parseBRLInput(str: string): number {
  if (!str || str.trim() === '') return 0
  const cleaned = str
    .replace(/R\$\s*/g, '')  // remove prefixo R$
    .replace(/\s/g, '')       // remove espaços
    .replace(/\./g, '')       // remove pontos de milhar (pt-BR usa ponto como milhar)
    .replace(',', '.')         // vírgula decimal → ponto decimal
    .replace(/[^\d.]/g, '')   // remove qualquer outro caractere não numérico
  return parseFloat(cleaned) || 0
}

/** Formata percentual com 1 casa decimal e vírgula brasileira. Ex: 10.5 → "10,5%" */
export function formatPct(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}%`
}
