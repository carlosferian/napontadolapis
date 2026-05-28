type CommentRange = [number, number, string]

function getComment(value: number, ranges: CommentRange[]): string {
  for (const [min, max, comment] of ranges) {
    if (value >= min && value < max) return comment
  }
  return ranges[ranges.length - 1][2]
}

const apostasRanges: CommentRange[] = [
  [0, 500, 'dá para fazer compras básicas de supermercado.'],
  [500, 2000, 'dá para comprar um celular intermediário.'],
  [2000, 7000, 'compra um console de última geração completo.'],
  [7000, 20000, 'deu o preço de uma moto seminova de 150cc.'],
  [20000, 60000, 'já paga um excelente carro popular usado.'],
  [60000, 99999999, 'seria a entrada de um excelente apartamento.'],
]

const fumoRanges: CommentRange[] = [
  [0, 150, 'nem parece muito. mas a conta chega.'],
  [150, 350, 'quase um plano de saúde básico.'],
  [350, 700, 'dá pra pagar um plano de saúde confortável.'],
  [700, 99999999, 'mais caro que muitos planos de saúde completos.'],
]

const investimentosRanges: CommentRange[] = [
  [0, 5000, 'a semente do seu futuro financeiro.'],
  [5000, 20000, 'já dá pra fazer uma reserva de emergência.'],
  [20000, 100000, 'equivale a um carro novo.'],
  [100000, 99999999, 'já chega perto de uma entrada de imóvel.'],
]

export const comments = {
  apostasTotal: (v: number) => getComment(v, apostasRanges),
  fumoMensal: (v: number) => getComment(v, fumoRanges),
  investimentosFuturo: (v: number) => getComment(v, investimentosRanges),
}
