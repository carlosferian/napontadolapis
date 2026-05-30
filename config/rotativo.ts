/**
 * Configurações e Cálculos para a Calculadora Fuga do Rotativo
 */

export interface RotativoInput {
  debtValue: number;
  cardRate: number;      // Taxa do cartão (% a.m.) - padrão nacional ~15%
  monthlyPayment: number; // Pagamento mensal pretendido
  loanRate: number;      // Taxa do empréstimo alternativo (% a.m.) - padrão ~3%
}

export interface TimelinePoint {
  month: number;
  cardBalance: number;
  loanBalance: number;
}

export interface RotativoResult {
  debtValue: number;
  cardRate: number;
  monthlyPayment: number;
  loanRate: number;
  cardTimeline: TimelinePoint[];
  cardTotalPaid: number;
  cardMonthsToQuit: number; // -1 se for infinito
  loanTotalPaid: number;
  loanMonthsToQuit: number;
  savingsMoney: number;
  savingsMonths: number;
  isCardInfinite: boolean;
}

export const ROTATIVO_DEFAULTS = {
  CARD_RATE_DEFAULT: 14.8, // Média do rotativo no Brasil (~15% a.m.)
  LOAN_RATE_DEFAULT: 3.2,   // Empréstimo consignado ou com garantia médio (~3.2% a.m.)
};

/**
 * Projeta a evolução de ambas as dívidas
 */
export function calculateRotativo(input: RotativoInput): RotativoResult {
  const { debtValue, cardRate, monthlyPayment, loanRate } = input;
  
  const rCard = cardRate / 100;
  const rLoan = loanRate / 100;
  
  const timeline: TimelinePoint[] = [];
  
  // 1. Projeção do Empréstimo Saudável (Amortização Padrão)
  let loanBalance = debtValue;
  let loanTotalPaid = 0;
  let loanMonths = 0;
  
  // 2. Projeção do Cartão de Crédito
  let cardBalance = debtValue;
  let cardTotalPaid = 0;
  let cardMonths = 0;
  let isCardInfinite = false;
  
  // Limite de simulação de 60 meses (5 anos)
  const maxMonths = 60;
  
  // Ponto inicial
  timeline.push({
    month: 0,
    cardBalance: Math.round(cardBalance),
    loanBalance: Math.round(loanBalance)
  });
  
  // Loop mês a mês
  for (let m = 1; m <= maxMonths; m++) {
    // Cálculo do Empréstimo Saudável
    if (loanBalance > 0) {
      const interest = loanBalance * rLoan;
      const payment = Math.min(monthlyPayment, loanBalance + interest);
      
      loanBalance = loanBalance + interest - payment;
      loanTotalPaid += payment;
      loanMonths = m;
    }
    
    // Cálculo do Cartão de Crédito
    if (cardBalance > 0) {
      const interest = cardBalance * rCard;
      
      // Se os juros mensais forem maiores ou iguais ao pagamento, a dívida nunca diminui!
      if (interest >= monthlyPayment && monthlyPayment > 0) {
        isCardInfinite = true;
      }
      
      const payment = Math.min(monthlyPayment, cardBalance + interest);
      cardBalance = cardBalance + interest - payment;
      cardTotalPaid += payment;
      cardMonths = m;
    }
    
    // Salva o ponto na linha do tempo
    timeline.push({
      month: m,
      cardBalance: Math.round(cardBalance),
      loanBalance: Math.round(loanBalance)
    });
  }
  
  // Se no final dos 60 meses a dívida do cartão ainda existir e não tiver reduzido, é considerada infinita/espiral
  if (cardBalance >= debtValue) {
    isCardInfinite = true;
  }
  
  const cardMonthsToQuit = isCardInfinite ? -1 : cardMonths;
  
  // Economias geradas pelo plano de fuga
  const savingsMoney = isCardInfinite 
    ? (cardTotalPaid - loanTotalPaid) // Mostra a economia acumulada na janela de 5 anos
    : Math.max(0, cardTotalPaid - loanTotalPaid);
    
  const savingsMonths = isCardInfinite 
    ? -1 
    : Math.max(0, cardMonthsToQuit - loanMonths);
  
  return {
    debtValue,
    cardRate,
    monthlyPayment,
    loanRate,
    cardTimeline: timeline,
    cardTotalPaid: Math.round(cardTotalPaid),
    cardMonthsToQuit,
    loanTotalPaid: Math.round(loanTotalPaid),
    loanMonthsToQuit: loanMonths,
    savingsMoney: Math.round(savingsMoney),
    savingsMonths,
    isCardInfinite
  };
}
