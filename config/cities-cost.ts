// config/cities-cost.ts

export interface CityCostData {
  name: string
  state: string
  category: 'capital' | 'hub' | 'interior'
  // Índices de custo relativos a São Paulo (SP = 100)
  housingIndex: number  // Moradia, aluguel, condomínio, IPTU
  foodIndex: number     // Supermercado, feira, restaurantes
  servicesIndex: number // Transporte, lazer, academia, serviços gerais
}

export const CITIES_COST_DATABASE: CityCostData[] = [
  // --- CAPITAIS ---
  { name: 'São Paulo', state: 'SP', category: 'capital', housingIndex: 100, foodIndex: 100, servicesIndex: 100 },
  { name: 'Rio de Janeiro', state: 'RJ', category: 'capital', housingIndex: 90, foodIndex: 98, servicesIndex: 95 },
  { name: 'Brasília', state: 'DF', category: 'capital', housingIndex: 85, foodIndex: 96, servicesIndex: 98 },
  { name: 'Belo Horizonte', state: 'MG', category: 'capital', housingIndex: 68, foodIndex: 86, servicesIndex: 80 },
  { name: 'Curitiba', state: 'PR', category: 'capital', housingIndex: 66, foodIndex: 85, servicesIndex: 80 },
  { name: 'Florianópolis', state: 'SC', category: 'capital', housingIndex: 78, foodIndex: 89, servicesIndex: 86 },
  { name: 'Porto Alegre', state: 'RS', category: 'capital', housingIndex: 64, foodIndex: 88, servicesIndex: 82 },
  { name: 'Vitória', state: 'ES', category: 'capital', housingIndex: 64, foodIndex: 84, servicesIndex: 80 },
  { name: 'Salvador', state: 'BA', category: 'capital', housingIndex: 58, foodIndex: 80, servicesIndex: 74 },
  { name: 'Recife', state: 'PE', category: 'capital', housingIndex: 60, foodIndex: 82, servicesIndex: 76 },
  { name: 'Fortaleza', state: 'CE', category: 'capital', housingIndex: 54, foodIndex: 78, servicesIndex: 72 },
  { name: 'Goiânia', state: 'GO', category: 'capital', housingIndex: 56, foodIndex: 80, servicesIndex: 74 },
  { name: 'Cuiabá', state: 'MT', category: 'capital', housingIndex: 54, foodIndex: 84, servicesIndex: 76 },
  { name: 'Campo Grande', state: 'MS', category: 'capital', housingIndex: 50, foodIndex: 80, servicesIndex: 72 },
  { name: 'Manaus', state: 'AM', category: 'capital', housingIndex: 52, foodIndex: 85, servicesIndex: 75 },
  { name: 'Belém', state: 'PA', category: 'capital', housingIndex: 50, foodIndex: 82, servicesIndex: 72 },
  { name: 'Natal', state: 'RN', category: 'capital', housingIndex: 48, foodIndex: 76, servicesIndex: 70 },
  { name: 'Maceió', state: 'AL', category: 'capital', housingIndex: 48, foodIndex: 76, servicesIndex: 70 },
  { name: 'João Pessoa', state: 'PB', category: 'capital', housingIndex: 45, foodIndex: 74, servicesIndex: 68 },
  { name: 'Aracaju', state: 'SE', category: 'capital', housingIndex: 44, foodIndex: 72, servicesIndex: 66 },
  { name: 'São Luís', state: 'MA', category: 'capital', housingIndex: 44, foodIndex: 75, servicesIndex: 68 },
  { name: 'Teresina', state: 'PI', category: 'capital', housingIndex: 42, foodIndex: 72, servicesIndex: 65 },
  { name: 'Palmas', state: 'TO', category: 'capital', housingIndex: 46, foodIndex: 78, servicesIndex: 70 },
  { name: 'Porto Velho', state: 'RO', category: 'capital', housingIndex: 48, foodIndex: 82, servicesIndex: 72 },
  { name: 'Boa Vista', state: 'RR', category: 'capital', housingIndex: 45, foodIndex: 80, servicesIndex: 70 },
  { name: 'Macapá', state: 'AP', category: 'capital', housingIndex: 44, foodIndex: 78, servicesIndex: 68 },
  { name: 'Rio Branco', state: 'AC', category: 'capital', housingIndex: 43, foodIndex: 78, servicesIndex: 68 },

  // --- POLOS REGIONAIS / HUBS ---
  { name: 'Campinas', state: 'SP', category: 'hub', housingIndex: 72, foodIndex: 92, servicesIndex: 86 },
  { name: 'Santos', state: 'SP', category: 'hub', housingIndex: 74, foodIndex: 94, servicesIndex: 88 },
  { name: 'Ribeirão Preto', state: 'SP', category: 'hub', housingIndex: 54, foodIndex: 82, servicesIndex: 76 },
  { name: 'São José dos Campos', state: 'SP', category: 'hub', housingIndex: 60, foodIndex: 86, servicesIndex: 80 },
  { name: 'Sorocaba', state: 'SP', category: 'hub', housingIndex: 50, foodIndex: 80, servicesIndex: 74 },
  { name: 'Niterói', state: 'RJ', category: 'hub', housingIndex: 75, foodIndex: 94, servicesIndex: 88 },
  { name: 'Joinville', state: 'SC', category: 'hub', housingIndex: 55, foodIndex: 82, servicesIndex: 76 },
  { name: 'Londrina', state: 'PR', category: 'hub', housingIndex: 48, foodIndex: 78, servicesIndex: 72 },
  { name: 'Maringá', state: 'PR', category: 'hub', housingIndex: 50, foodIndex: 80, servicesIndex: 74 },
  { name: 'Uberlândia', state: 'MG', category: 'hub', housingIndex: 46, foodIndex: 76, servicesIndex: 70 },
  { name: 'Juiz de Fora', state: 'MG', category: 'hub', housingIndex: 45, foodIndex: 75, servicesIndex: 68 },
  { name: 'Caxias do Sul', state: 'RS', category: 'hub', housingIndex: 48, foodIndex: 80, servicesIndex: 74 },

  // --- INTERIORES GENÉRICOS (COBERTURA COMPLETA) ---
  { name: 'Interior de São Paulo', state: 'SP', category: 'interior', housingIndex: 42, foodIndex: 78, servicesIndex: 70 },
  { name: 'Interior do Rio de Janeiro', state: 'RJ', category: 'interior', housingIndex: 38, foodIndex: 75, servicesIndex: 68 },
  { name: 'Interior de Minas Gerais', state: 'MG', category: 'interior', housingIndex: 30, foodIndex: 68, servicesIndex: 60 },
  { name: 'Interior do Rio Grande do Sul', state: 'RS', category: 'interior', housingIndex: 32, foodIndex: 72, servicesIndex: 62 },
  { name: 'Interior de Santa Catarina', state: 'SC', category: 'interior', housingIndex: 34, foodIndex: 74, servicesIndex: 64 },
  { name: 'Interior do Paraná', state: 'PR', category: 'interior', housingIndex: 30, foodIndex: 70, servicesIndex: 60 },
  { name: 'Interior do Espírito Santo', state: 'ES', category: 'interior', housingIndex: 32, foodIndex: 70, servicesIndex: 62 },
  { name: 'Interior da Bahia', state: 'BA', category: 'interior', housingIndex: 22, foodIndex: 62, servicesIndex: 52 },
  { name: 'Interior de Pernambuco', state: 'PE', category: 'interior', housingIndex: 23, foodIndex: 64, servicesIndex: 54 },
  { name: 'Interior do Ceará', state: 'CE', category: 'interior', housingIndex: 20, foodIndex: 60, servicesIndex: 50 },
  { name: 'Interior do Rio Grande do Norte', state: 'RN', category: 'interior', housingIndex: 20, foodIndex: 62, servicesIndex: 50 },
  { name: 'Interior da Paraíba', state: 'PB', category: 'interior', housingIndex: 18, foodIndex: 60, servicesIndex: 48 },
  { name: 'Interior de Alagoas', state: 'AL', category: 'interior', housingIndex: 18, foodIndex: 60, servicesIndex: 48 },
  { name: 'Interior de Sergipe', state: 'SE', category: 'interior', housingIndex: 18, foodIndex: 60, servicesIndex: 48 },
  { name: 'Interior do Maranhão', state: 'MA', category: 'interior', housingIndex: 15, foodIndex: 55, servicesIndex: 42 },
  { name: 'Interior do Piauí', state: 'PI', category: 'interior', housingIndex: 15, foodIndex: 55, servicesIndex: 42 },
  { name: 'Interior de Goiás', state: 'GO', category: 'interior', housingIndex: 26, foodIndex: 68, servicesIndex: 58 },
  { name: 'Interior do Mato Grosso', state: 'MT', category: 'interior', housingIndex: 28, foodIndex: 72, servicesIndex: 62 },
  { name: 'Interior do Mato Grosso do Sul', state: 'MS', category: 'interior', housingIndex: 26, foodIndex: 70, servicesIndex: 60 },
  { name: 'Interior do Pará', state: 'PA', category: 'interior', housingIndex: 22, foodIndex: 65, servicesIndex: 52 },
  { name: 'Interior do Amazonas', state: 'AM', category: 'interior', housingIndex: 20, foodIndex: 68, servicesIndex: 52 },
  { name: 'Interior de Rondônia', state: 'RO', category: 'interior', housingIndex: 24, foodIndex: 70, servicesIndex: 58 },
  { name: 'Interior do Acre', state: 'AC', category: 'interior', housingIndex: 20, foodIndex: 65, servicesIndex: 50 },
  { name: 'Interior do Amapá', state: 'AP', category: 'interior', housingIndex: 20, foodIndex: 65, servicesIndex: 50 },
  { name: 'Interior de Roraima', state: 'RR', category: 'interior', housingIndex: 20, foodIndex: 68, servicesIndex: 52 },
  { name: 'Interior do Tocantins', state: 'TO', category: 'interior', housingIndex: 22, foodIndex: 66, servicesIndex: 52 },
]
