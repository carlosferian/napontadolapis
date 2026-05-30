/**
 * Configurações e Cálculos para a Calculadora Parcelado ou À Vista
 */

export interface ParceladoInput {
  priceVista: number;
  priceParcelado: number;
  installments: number;
}

export interface ParceladoResult {
  priceVista: number;
  priceParcelado: number;
  installments: number;
  pmtValue: number;
  discountValue: number;
  discountPct: number;
  implicitRateMonthly: number;
  implicitRateAnnual: number;
  verdict: 'parcelar' | 'alerta' | 'vista';
  verdictTitle: string;
  verdictDesc: string;
  equivalentCDI: number; // Porcentagem do CDI equivalente (ex: 250% do CDI)
}

/**
 * Resolve a taxa de juros implícita mensal no parcelamento baseado no preço à vista
 * f(i) = pmt * (1 - (1+i)^-n) / i - priceVista = 0
 */
export function solveImplicitRate(priceVista: number, priceParcelado: number, n: number): number {
  if (priceVista >= priceParcelado || priceVista <= 0 || priceParcelado <= 0 || n <= 1) return 0;
  
  const pmt = priceParcelado / n;
  
  // Método da Bissecção
  let low = 0.00001; // Taxa mínima (>0%)
  let high = 2.0;    // Taxa máxima (200% ao mês)
  let iterations = 0;
  
  while (iterations < 100) {
    const mid = (low + high) / 2;
    const pv = pmt * (1 - Math.pow(1 + mid, -n)) / mid;
    
    if (Math.abs(pv - priceVista) < 0.0001) {
      return mid * 100; // Retorna em porcentagem
    }
    
    if (pv > priceVista) {
      low = mid;
    } else {
      high = mid;
    }
    iterations++;
  }
  
  return low * 100;
}

/**
 * Calcula os resultados para comparação
 */
export function calculateParcelado(input: ParceladoInput): ParceladoResult {
  const { priceVista, priceParcelado, installments } = input;
  
  const pmtValue = priceParcelado / installments;
  const discountValue = priceParcelado - priceVista;
  const discountPct = priceParcelado > 0 ? (discountValue / priceParcelado) * 100 : 0;
  
  const implicitRateMonthly = solveImplicitRate(priceVista, priceParcelado, installments);
  
  // Taxa anualizada equivalente: (1 + i)^12 - 1
  const iDecimal = implicitRateMonthly / 100;
  const implicitRateAnnual = (Math.pow(1 + iDecimal, 12) - 1) * 100;
  
  // CDI Equivalente (Assumindo CDI médio atual de ~10.5% a.a., ou 0.83% a.m.)
  const CDI_MONTHLY = 0.83;
  const equivalentCDI = implicitRateMonthly > 0 ? (implicitRateMonthly / CDI_MONTHLY) * 100 : 0;
  
  // Determinação do veredito prático
  let verdict: 'parcelar' | 'alerta' | 'vista' = 'vista';
  let verdictTitle = '';
  let verdictDesc = '';
  
  if (implicitRateMonthly <= 0.5) {
    verdict = 'parcelar';
    verdictTitle = '👍 Compre Parcelado!';
    verdictDesc = `A taxa de juros embutida (${implicitRateMonthly.toFixed(2).replace('.', ',')}% a.m.) é extremamente baixa. O desconto para pagamento à vista é irrelevante e não compensa a perda de liquidez do seu caixa.`;
  } else if (implicitRateMonthly <= 1.5) {
    verdict = 'alerta';
    verdictTitle = '⚠️ Atenção / Alerta!';
    verdictDesc = `A taxa de juros embutida (${implicitRateMonthly.toFixed(2).replace('.', ',')}% a.m.) está em nível intermediário. Se você tiver o dinheiro livre e sem destino melhor, pagar à vista é a opção mais segura.`;
  } else {
    verdict = 'vista';
    verdictTitle = '🛑 Compre À Vista no Pix!';
    verdictDesc = `A taxa de juros embutida (${implicitRateMonthly.toFixed(2).replace('.', ',')}% a.m.) é abusiva! É equivalente a pagar ${implicitRateAnnual.toFixed(1).replace('.', ',')}% ao ano. Pagar parcelado neste caso é queimar dinheiro. Exija o desconto à vista.`;
  }
  
  return {
    priceVista,
    priceParcelado,
    installments,
    pmtValue,
    discountValue,
    discountPct,
    implicitRateMonthly,
    implicitRateAnnual,
    verdict,
    verdictTitle,
    verdictDesc,
    equivalentCDI
  };
}
