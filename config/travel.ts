import flightPricesData from './flight-prices.json'

export type TravelStyle = 'budget' | 'mid' | 'premium'
export type Region = 'europa' | 'america_norte' | 'america_sul' | 'asia_oceania' | 'caribe' | 'brasil'

export interface Destination {
  id: string
  name: string
  country: string
  flag: string
  region: Region
  flightFromGRU: { min: number; typical: number }
  dailyCostUSD: { budget: number; mid: number; premium: number }
  typicalDays: { min: number; recommended: number; extended: number }
  visa: { required: boolean; costUSD?: number; notes?: string }
  highlight: string
}

const livePrices = flightPricesData.prices as Record<string, { min: number; typical: number }>

export const TRAVEL_CONFIG = {
  defaultUSDtoBRL: 5.75,
  iofCreditCard: 0.0438,
  bankSpreadEstimate: 0.04,
  fintechFeeEstimate: 0.015,
  selicAnnual: 0.1375,
  safetyMargin: 0.15,
  defaultStyle: 'mid' as TravelStyle,
  defaultTravelers: 2,
  defaultMonthsToSave: 18,
  lastUpdated: '2026-05',
}

const rawDestinations: Destination[] = [
  {
    id: 'lisboa', name: 'Lisboa', country: 'Portugal', flag: '🇵🇹', region: 'europa',
    flightFromGRU: { min: 2800, typical: 4500 },
    dailyCostUSD: { budget: 60, mid: 120, premium: 250 },
    typicalDays: { min: 5, recommended: 8, extended: 12 },
    visa: { required: false },
    highlight: 'pastel de nata incluso no roteiro',
  },
  {
    id: 'paris', name: 'Paris', country: 'França', flag: '🇫🇷', region: 'europa',
    flightFromGRU: { min: 3500, typical: 5500 },
    dailyCostUSD: { budget: 90, mid: 180, premium: 380 },
    typicalDays: { min: 4, recommended: 7, extended: 12 },
    visa: { required: false },
    highlight: 'torre Eiffel é de graça por fora',
  },
  {
    id: 'roma', name: 'Roma', country: 'Itália', flag: '🇮🇹', region: 'europa',
    flightFromGRU: { min: 3200, typical: 5000 },
    dailyCostUSD: { budget: 75, mid: 150, premium: 320 },
    typicalDays: { min: 4, recommended: 7, extended: 10 },
    visa: { required: false },
    highlight: 'jogar moeda na Fontana di Trevi não conta no orçamento',
  },
  {
    id: 'barcelona', name: 'Barcelona', country: 'Espanha', flag: '🇪🇸', region: 'europa',
    flightFromGRU: { min: 3200, typical: 5200 },
    dailyCostUSD: { budget: 70, mid: 140, premium: 300 },
    typicalDays: { min: 4, recommended: 7, extended: 10 },
    visa: { required: false },
    highlight: 'tapas + Gaudí + praia. difícil errar.',
  },
  {
    id: 'amsterdam', name: 'Amsterdã', country: 'Holanda', flag: '🇳🇱', region: 'europa',
    flightFromGRU: { min: 3800, typical: 5800 },
    dailyCostUSD: { budget: 85, mid: 170, premium: 360 },
    typicalDays: { min: 3, recommended: 5, extended: 8 },
    visa: { required: false },
    highlight: 'de bicicleta, tudo fica mais barato',
  },
  {
    id: 'londres', name: 'Londres', country: 'Reino Unido', flag: '🇬🇧', region: 'europa',
    flightFromGRU: { min: 3500, typical: 6000 },
    dailyCostUSD: { budget: 100, mid: 200, premium: 420 },
    typicalDays: { min: 4, recommended: 7, extended: 10 },
    visa: { required: true, costUSD: 115, notes: 'ETA obrigatório desde 2024' },
    highlight: 'museus gratuitos compensam a libra cara',
  },
  {
    id: 'praga', name: 'Praga', country: 'República Tcheca', flag: '🇨🇿', region: 'europa',
    flightFromGRU: { min: 4000, typical: 6000 },
    dailyCostUSD: { budget: 50, mid: 100, premium: 200 },
    typicalDays: { min: 3, recommended: 5, extended: 7 },
    visa: { required: false },
    highlight: 'Europa linda com preço de pré-euro',
  },
  {
    id: 'miami', name: 'Miami', country: 'EUA', flag: '🇺🇸', region: 'america_norte',
    flightFromGRU: { min: 1800, typical: 3200 },
    dailyCostUSD: { budget: 100, mid: 200, premium: 450 },
    typicalDays: { min: 4, recommended: 7, extended: 12 },
    visa: { required: true, costUSD: 160, notes: 'visto americano — agendar com antecedência' },
    highlight: 'outlet + praia + nightlife. o clássico brasileiro.',
  },
  {
    id: 'nova-york', name: 'Nova York', country: 'EUA', flag: '🇺🇸', region: 'america_norte',
    flightFromGRU: { min: 2200, typical: 3800 },
    dailyCostUSD: { budget: 120, mid: 250, premium: 550 },
    typicalDays: { min: 5, recommended: 8, extended: 12 },
    visa: { required: true, costUSD: 160, notes: 'mesmo visto do Miami' },
    highlight: 'Central Park é grátis. o resto, nem tanto.',
  },
  {
    id: 'orlando', name: 'Orlando', country: 'EUA', flag: '🇺🇸', region: 'america_norte',
    flightFromGRU: { min: 1800, typical: 3200 },
    dailyCostUSD: { budget: 130, mid: 220, premium: 400 },
    typicalDays: { min: 7, recommended: 10, extended: 14 },
    visa: { required: true, costUSD: 160, notes: 'parques consomem boa parte do orçamento' },
    highlight: 'conta os parques antes de comprar o pacote',
  },
  {
    id: 'cancun', name: 'Cancún', country: 'México', flag: '🇲🇽', region: 'caribe',
    flightFromGRU: { min: 2000, typical: 3500 },
    dailyCostUSD: { budget: 70, mid: 140, premium: 350 },
    typicalDays: { min: 5, recommended: 8, extended: 12 },
    visa: { required: false },
    highlight: 'all-inclusive pode valer a pena. calcule antes.',
  },
  {
    id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷', region: 'america_sul',
    flightFromGRU: { min: 800, typical: 1600 },
    dailyCostUSD: { budget: 35, mid: 70, premium: 160 },
    typicalDays: { min: 4, recommended: 7, extended: 10 },
    visa: { required: false },
    highlight: 'bife de chorizo + tango. câmbio favorece o brasileiro.',
  },
  {
    id: 'santiago', name: 'Santiago', country: 'Chile', flag: '🇨🇱', region: 'america_sul',
    flightFromGRU: { min: 900, typical: 1800 },
    dailyCostUSD: { budget: 55, mid: 110, premium: 240 },
    typicalDays: { min: 4, recommended: 7, extended: 12 },
    visa: { required: false },
    highlight: 'porta de entrada para a Patagônia',
  },
  {
    id: 'machu-picchu', name: 'Machu Picchu / Cusco', country: 'Peru', flag: '🇵🇪', region: 'america_sul',
    flightFromGRU: { min: 1500, typical: 2800 },
    dailyCostUSD: { budget: 50, mid: 100, premium: 220 },
    typicalDays: { min: 5, recommended: 8, extended: 12 },
    visa: { required: false },
    highlight: 'ingresso Machu Picchu: US$ 45–60. reservar com antecedência.',
  },
  {
    id: 'cartagena', name: 'Cartagena', country: 'Colômbia', flag: '🇨🇴', region: 'america_sul',
    flightFromGRU: { min: 1400, typical: 2600 },
    dailyCostUSD: { budget: 55, mid: 110, premium: 230 },
    typicalDays: { min: 4, recommended: 7, extended: 10 },
    visa: { required: false },
    highlight: 'cidade murada + praias + culinária. ótimo custo-benefício.',
  },
  {
    id: 'bali', name: 'Bali', country: 'Indonésia', flag: '🇮🇩', region: 'asia_oceania',
    flightFromGRU: { min: 4500, typical: 7000 },
    dailyCostUSD: { budget: 45, mid: 90, premium: 220 },
    typicalDays: { min: 7, recommended: 12, extended: 21 },
    visa: { required: false, notes: 'visto na chegada — grátis até 30 dias' },
    highlight: 'quanto mais barato o estilo, mais autêntico fica',
  },
  {
    id: 'toquio', name: 'Tóquio', country: 'Japão', flag: '🇯🇵', region: 'asia_oceania',
    flightFromGRU: { min: 4800, typical: 7500 },
    dailyCostUSD: { budget: 80, mid: 160, premium: 380 },
    typicalDays: { min: 7, recommended: 12, extended: 21 },
    visa: { required: false, notes: 'sem visto até 90 dias' },
    highlight: 'metro eficiente. JR Pass pode compensar.',
  },
  {
    id: 'dubai', name: 'Dubai', country: 'Emirados Árabes', flag: '🇦🇪', region: 'asia_oceania',
    flightFromGRU: { min: 3800, typical: 6000 },
    dailyCostUSD: { budget: 100, mid: 220, premium: 600 },
    typicalDays: { min: 4, recommended: 6, extended: 10 },
    visa: { required: false, notes: 'sem visto para brasileiros até 30 dias' },
    highlight: 'atrações gratuitas existem. poucas, mas existem.',
  },
  {
    id: 'bangkok', name: 'Bangkok', country: 'Tailândia', flag: '🇹🇭', region: 'asia_oceania',
    flightFromGRU: { min: 4000, typical: 6500 },
    dailyCostUSD: { budget: 40, mid: 80, premium: 200 },
    typicalDays: { min: 5, recommended: 10, extended: 21 },
    visa: { required: false, notes: 'sem visto até 30 dias' },
    highlight: 'street food de verdade. barato e delicioso.',
  },
  {
    id: 'fernando-de-noronha', name: 'Fernando de Noronha', country: 'Brasil', flag: '🇧🇷', region: 'brasil',
    flightFromGRU: { min: 1200, typical: 2200 },
    dailyCostUSD: { budget: 80, mid: 140, premium: 280 },
    typicalDays: { min: 5, recommended: 7, extended: 10 },
    visa: { required: false },
    highlight: 'TPA + taxa ambiental: ~R$900 por pessoa. já conta no budget.',
  },
  {
    id: 'gramado', name: 'Gramado', country: 'Brasil', flag: '🇧🇷', region: 'brasil',
    flightFromGRU: { min: 400, typical: 900 },
    dailyCostUSD: { budget: 40, mid: 80, premium: 180 },
    typicalDays: { min: 3, recommended: 5, extended: 7 },
    visa: { required: false },
    highlight: 'chocolate + fondue + frio. destino parcelável.',
  },
]

export const destinations: Destination[] = rawDestinations.map((d) => ({
  ...d,
  flightFromGRU: livePrices[d.id] ?? d.flightFromGRU,
}))

export const flightPricesMeta = flightPricesData._meta

export const regionLabels: Record<Region | 'africa', string> = {
  europa: 'Europa',
  america_norte: 'América do Norte',
  america_sul: 'América do Sul',
  asia_oceania: 'Ásia / Oceania',
  caribe: 'Caribe',
  africa: 'África',
  brasil: 'Brasil',
}
