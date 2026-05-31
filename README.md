# A Ponta do Lápis — Calculadoras Financeiras Gratuitas

Plataforma de calculadoras financeiras minimalistas de alta utilidade e educação financeira para o brasileiro. Sem cadastro, sem recolhimento de dados pessoais (sem CPF/nuvem), rodando 100% no navegador do usuário de forma privada.

## 🚀 Diferenciais do Projeto

- **Arquitetura 100% Estática e Autônoma (Custo Zero)**: Roda exclusivamente com bancos de dados locais estáveis, garantindo imunidade contra desligamento de serviços de terceiros e custo vitalício zero.
- **Correção Inflacionária Real**: Todas as calculadoras financeiras de longo prazo (Viver de Renda, Juros Compostos, Custo do Fumo) usam **taxa real = Selic − IPCA** para projeções honestas.
- **Tabela IRPF 2026 Atualizada**: Calculadora de Viver de Renda inclui o IR progressivo com a **Lei dos 5 Mil (Lei 15.270/2025)** — isenção total até R$5.000, redutor parcial até R$7.350.
- **Taxas Automáticas via BCB**: Selic, CDI, IPCA e câmbio são buscados diariamente pela API oficial do Banco Central via GitHub Actions (`npm run update-rates`).
- **UX Premium**: Inputs numéricos formatados em pt-BR com 2 casas decimais, sliders sincronizados, dark/light mode, responsividade mobile avançada com gerenciamento inteligente de espaço de tela (instruções colapsáveis) e botões de compartilhamento rápido.
- **Privacidade by Design**: Nenhum dado financeiro sai do navegador. Calculadoras rodam 100% client-side.

## 🛠️ Stack Tecnológica

- **Core**: Next.js 16.2 (estático/Turbopack) · React 19 · TypeScript
- **Estilização**: Tailwind CSS v4 · CSS custom properties · design tokens
- **Gráficos**: Recharts
- **Build & Hosting**: Netlify (Continuous Deployment via Git)
- **Automação**: GitHub Actions (atualização diária de taxas via BCB SGS)

## 📁 Calculadoras

### 🎰 Apostas & Hábitos
| Rota | Calculadora |
|------|-------------|
| `/apostas` | **Simulador da Ilusão das Apostas** — cassino imersivo com decadência progressiva (5 estágios visuais), jornada 3 fases (cassino → ruptura split-screen → narrativa educativa de 5 capítulos), sistema de créditos reais (cinema, tênis, celular...), sessões sortudas (12% de chance) com análise estatística |
| `/fumo` | Custo do Fumo (cigarro/vape) — projeção 10/30 anos em valores reais |

### 💰 Investimentos
| Rota | Calculadora |
|------|-------------|
| `/investimentos` | E se tivesse investido? |
| `/juros-compostos` | Juros Compostos — com inflação e linha de valor real no gráfico |
| `/investimentos/viver-de-renda` | **Viver de Renda** — aba Rápido (perpétuo e vitalício simples) + aba Completo (solver 4 variáveis, IR progressivo Lei 15.270/2025, expectativa de vida, tetos máximos de retirada, gráfico 3 linhas) |
| `/investimentos/amortizacao` | Amortizar Financiamento (SAC vs Price) |
| `/investimentos/financiamento-ou-consorcio` | **Financiamento vs. Consórcio** — aba "Quem Vence?" (duelo dinâmico com scorecard) + aba Análise Completa (tabela 4 modalidades × 8 critérios, gráficos, antecipação) |
| `/investimentos/itbi-e-cartorio` | ITBI e Custos de Cartório |
| `/investimentos/parcelado-ou-a-vista` | Parcelado ou À Vista? (solver TIR) |
| `/investimentos/fuga-do-rotativo` | Fuga do Rotativo |

### ✈️ Viagens
| Rota | Calculadora |
|------|-------------|
| `/viagens/milhas-ou-dinheiro` | Milhas ou Dinheiro? (CPP, emissão, promoções) |
| `/viagens/planejar` | Planejador de Viagem |
| `/viagens/custo-de-vida` | Custo de Vida entre Cidades |

### 💼 Trabalho
| Rota | Calculadora |
|------|-------------|
| `/trabalho/realidade-brasileira` | Realidade Brasileira (pirâmide social, percentis IBGE) |
| `/trabalho/rescisao` | Rescisão CLT |
| `/trabalho/seguro-desemprego` | Seguro-Desemprego |
| `/trabalho/uber-vs-carro` | **Uber vs. Carro Próprio** — TCO completo (11 fatores, custo de oportunidade, break-even, projeção 5 anos) |

### Outros
| Rota | Calculadora |
|------|-------------|
| `/dividir` | Dividir Conta |
| `/privacidade` | Política de Privacidade (site + app Android/iOS Dividir Conta) |

## ⚙️ Desenvolvimento

```bash
npm run dev          # servidor local
npm run build        # build de produção
npm run update-rates # atualiza Selic/CDI/IPCA do BCB (também roda diariamente via GitHub Actions)
```

## 📦 Arquitetura de Cálculo

```
lib/calculations/
  income.ts      — Viver de Renda (solver real + IR + expectativa de vida)
  compound.ts    — Juros compostos (nominal + real)
  financing.ts   — SAC, Price, Empréstimo, Consórcio
  uber-car.ts    — TCO do carro (11 fatores)
  probability.ts — Odds e probabilidade (apostas)
  ...

config/
  rates.ts       — Selic, CDI, poupança (gerado automaticamente via BCB)
  tax.ts         — Tabela IRPF 2026 + Lei dos 5 Mil (Lei 15.270/2025)
  uber-car.ts    — Defaults por segmento de veículo
  financing.ts   — Defaults de financiamento e consórcio
```
