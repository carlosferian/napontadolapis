// config/realidade.ts

export interface StateData {
  code: string
  name: string
  cestaBasica: number // Preço médio da cesta básica (DIEESE 2024-2025)
  // Valores salariais para os percentis: [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 99.9]
  percentileValues: number[]
}

export const MINIMUM_WAGE = 1512 // Salário mínimo vigente (2025/2026)

export interface Profession {
  name: string
  salary: number
  category: 'base' | 'media' | 'elite'
  emoji: string
}

export const PROFESSIONS: Profession[] = [
  { name: 'Gari / Auxiliar de Limpeza', salary: 1700, category: 'base', emoji: '🧹' },
  { name: 'Pedreiro / Construção Civil', salary: 2600, category: 'base', emoji: '🧱' },
  { name: 'Professor da Rede Básica', salary: 3500, category: 'media', emoji: '🏫' },
  { name: 'Enfermeiro Pleno', salary: 4800, category: 'media', emoji: '🩺' },
  { name: 'Programador Software Pleno', salary: 8500, category: 'media', emoji: '💻' },
  { name: 'Médico Generalista', salary: 15000, category: 'elite', emoji: '🥼' },
  { name: 'Juiz de Direito', salary: 39717, category: 'elite', emoji: '⚖️' },
  { name: 'Deputado Federal', salary: 44008, category: 'elite', emoji: '🏛️' },
]

export const REALIDADE_STATES: StateData[] = [
  {
    code: 'BR',
    name: 'Brasil (Média Nacional)',
    cestaBasica: 750,
    percentileValues: [350, 700, 1000, 1300, 1600, 2000, 2600, 3700, 6000, 9500, 22000, 65000],
  },
  {
    code: 'SP',
    name: 'São Paulo',
    cestaBasica: 820,
    percentileValues: [500, 950, 1300, 1600, 2100, 2700, 3500, 5000, 8000, 12000, 28000, 80000],
  },
  {
    code: 'RJ',
    name: 'Rio de Janeiro',
    cestaBasica: 790,
    percentileValues: [450, 850, 1200, 1500, 1900, 2400, 3200, 4500, 7000, 11000, 25000, 75000],
  },
  {
    code: 'DF',
    name: 'Distrito Federal',
    cestaBasica: 760,
    percentileValues: [600, 1100, 1600, 2200, 3000, 4000, 5500, 8000, 12000, 18000, 38000, 95000],
  },
  {
    code: 'MG',
    name: 'Minas Gerais',
    cestaBasica: 720,
    percentileValues: [380, 720, 1050, 1350, 1700, 2100, 2700, 3800, 6000, 9000, 20000, 60000],
  },
  {
    code: 'RS',
    name: 'Rio Grande do Sul',
    cestaBasica: 810,
    percentileValues: [480, 900, 1250, 1550, 1950, 2500, 3200, 4400, 6800, 10000, 22000, 68000],
  },
  {
    code: 'PR',
    name: 'Paraná',
    cestaBasica: 780,
    percentileValues: [460, 880, 1200, 1500, 1900, 2400, 3100, 4200, 6500, 9500, 21000, 65000],
  },
  {
    code: 'SC',
    name: 'Santa Catarina',
    cestaBasica: 800,
    percentileValues: [520, 1000, 1350, 1650, 2150, 2700, 3500, 4700, 7200, 10500, 23000, 70000],
  },
  {
    code: 'BA',
    name: 'Bahia',
    cestaBasica: 640,
    percentileValues: [250, 500, 750, 1000, 1200, 1500, 1900, 2700, 4200, 6800, 16000, 45000],
  },
  {
    code: 'PE',
    name: 'Pernambuco',
    cestaBasica: 660,
    percentileValues: [260, 520, 780, 1000, 1250, 1550, 2000, 2800, 4500, 7200, 17000, 48000],
  },
  {
    code: 'CE',
    name: 'Ceará',
    cestaBasica: 650,
    percentileValues: [240, 480, 720, 950, 1180, 1450, 1850, 2600, 4000, 6500, 15000, 42000],
  },
  {
    code: 'MA',
    name: 'Maranhão',
    cestaBasica: 610,
    percentileValues: [180, 360, 550, 750, 950, 1200, 1500, 2100, 3300, 5200, 12000, 35000],
  },
  {
    code: 'PI',
    name: 'Piauí',
    cestaBasica: 620,
    percentileValues: [200, 400, 600, 800, 1000, 1300, 1600, 2200, 3500, 5500, 13000, 38000],
  },
  {
    code: 'AL',
    name: 'Alagoas',
    cestaBasica: 630,
    percentileValues: [210, 420, 630, 850, 1050, 1350, 1700, 2300, 3700, 5800, 14000, 40000],
  },
  {
    code: 'SE',
    name: 'Sergipe',
    cestaBasica: 640,
    percentileValues: [230, 460, 690, 900, 1150, 1400, 1800, 2500, 3900, 6200, 14500, 41000],
  },
  {
    code: 'PB',
    name: 'Paraíba',
    cestaBasica: 645,
    percentileValues: [220, 440, 660, 880, 1100, 1380, 1750, 2400, 3800, 6000, 14000, 40000],
  },
  {
    code: 'RN',
    name: 'Rio Grande do Norte',
    cestaBasica: 655,
    percentileValues: [250, 500, 750, 1000, 1200, 1500, 1900, 2600, 4100, 6600, 15500, 44000],
  },
  {
    code: 'PA',
    name: 'Pará',
    cestaBasica: 690,
    percentileValues: [280, 560, 840, 1100, 1350, 1650, 2100, 3000, 4700, 7500, 18000, 50000],
  },
  {
    code: 'AM',
    name: 'Amazonas',
    cestaBasica: 700,
    percentileValues: [290, 580, 860, 1150, 1400, 1700, 2150, 3100, 4900, 7800, 18500, 52000],
  },
  {
    code: 'RO',
    name: 'Rondônia',
    cestaBasica: 710,
    percentileValues: [350, 700, 1000, 1300, 1600, 2000, 2550, 3500, 5500, 8500, 19000, 55000],
  },
  {
    code: 'AC',
    name: 'Acre',
    cestaBasica: 720,
    percentileValues: [270, 540, 800, 1050, 1300, 1600, 2050, 2900, 4500, 7200, 17500, 49000],
  },
  {
    code: 'AP',
    name: 'Amapá',
    cestaBasica: 715,
    percentileValues: [280, 560, 820, 1080, 1320, 1620, 2080, 2950, 4600, 7400, 18000, 50000],
  },
  {
    code: 'RR',
    name: 'Roraima',
    cestaBasica: 730,
    percentileValues: [300, 600, 900, 1200, 1450, 1800, 2300, 3200, 5000, 8000, 19000, 53000],
  },
  {
    code: 'TO',
    name: 'Tocantins',
    cestaBasica: 680,
    percentileValues: [310, 620, 920, 1220, 1500, 1850, 2400, 3300, 5100, 8200, 19500, 54000],
  },
  {
    code: 'GO',
    name: 'Goiás',
    cestaBasica: 700,
    percentileValues: [400, 780, 1100, 1400, 1750, 2200, 2800, 3900, 6000, 9000, 20000, 60000],
  },
  {
    code: 'MT',
    name: 'Mato Grosso',
    cestaBasica: 735,
    percentileValues: [420, 820, 1150, 1450, 1850, 2350, 3000, 4150, 6400, 9500, 21000, 63000],
  },
  {
    code: 'MS',
    name: 'Mato Grosso do Sul',
    cestaBasica: 740,
    percentileValues: [410, 800, 1120, 1420, 1800, 2300, 2900, 4000, 6200, 9200, 20500, 62000],
  },
  {
    code: 'ES',
    name: 'Espírito Santo',
    cestaBasica: 730,
    percentileValues: [390, 750, 1080, 1380, 1750, 2200, 2800, 3900, 6000, 9000, 20000, 60000],
  },
]
