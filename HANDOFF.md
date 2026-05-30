# Handoff — A Ponta do Lápis

**Última atualização:** 2026-05-30  
**Branch de desenvolvimento:** `claude/friendly-hypatia-HwfUk`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Netlify (deploy contínuo ativo)  
**Domínio registrado:** `apontadolapis.com.br`

---

## Estado atual

O projeto está completo, compilando com **sucesso absoluto** (todas as 44 páginas estáticas geradas sem avisos ou erros) e **100% monetizado e integrado** com as campanhas oficiais do proprietário (Google AdSense e Programa de Afiliados da Wise).

Toda a infraestrutura do site roda de forma **100% independente, autônoma e com custo zero vitalício**, eliminando qualquer dependência de chaves de API externas de terceiros instáveis de aviação (Amadeus/Kiwi.com), o que garante imunidade contra o encerramento do portal Amadeus em julho de 2026.

---

## O que foi feito — Sessão Atual (2026-05-30)

### 1. Nova Calculadora de Milhas ou Dinheiro (Inteligência em Milhas)
Desenvolvemos uma calculadora de conversão baseada em uma metodologia séria e unânime no mercado de fidelidade para orientar o usuário sobre viagens e promoções:
* **Matemática Fiel baseada no CPP (`config/miles.ts`)**:
  * Implementação da lógica de **Custo por Mil Milhas (CPP)** como métrica definitiva de comparação.
  * Cadastramento de taxas médias comerciais de mercado para os 5 maiores programas brasileiros: LATAM Pass, Smiles, TudoAzul, Livelo e Esfera.
  * Aba **Milhas vs Dinheiro**: Calcula o custo da emissão considerando o valor de mercado dos pontos e a taxa de embarque, comparando contra a passagem em dinheiro e entregando o CPP da passagem para julgar a vantajosidade.
  * Aba **Comprar Milhas (Promoção)**: Calcula o custo real do milhar cobrado na oferta e compara com o preço médio de resgate, gerando alertas didáticos contra o **"Desconto Fantasma"** (promoções de alto percentual mas com preço base superfaturado).
* **Interface Premium (`components/calculators/MilesCalculator.tsx`)**:
  * Abas dinâmicas deslizantes, métricas claras e cards informativos explicativos.
  * Suporte ao novo sistema de embeds modulares, permitindo que blogs de viagem parceiros incorporem a ferramenta em seus artigos em um clique como um **widget de fundo transparente**.

### 2. Nova Calculadora de ITBI e Custos de Cartório
Desenvolvemos uma calculadora imobiliária de altíssimo apelo para corretores de imóveis e compradores de moradia, estimando todas as despesas adicionais de transferência:
* **Matemática Fiel de Tributos e Cartórios (`config/itbi.ts`)**:
  * Cadastramento de alíquotas oficiais de ITBI de capitais brasileiras importantes (com alíquota personalizada para outras cidades).
  * Regra de alíquota reduzida de ITBI para parte financiada (SFH/Minha Casa Minha Vida) a **0,5%**.
  * Fórmulas de estimativas nacionais de emolumentos para Registro de Imóvel e Escritura Pública.
* **Isenções e Descontos por Lei Integrados (`components/calculators/ItbiCalculator.tsx`)**:
  * **Isenção de Escritura Pública**: Se for financiado, o contrato bancário tem força de escritura (Lei nº 4.380/64). O sistema zera automaticamente esse custo, informando a economia gerada.
  * **Art. 290 da Lei Federal 6.015/73**: Se for o primeiro imóvel residencial financiado, o sistema calcula e aplica **50% de desconto** nas taxas de cartório de Registro.

### 3. Refatoração de Experiência do Usuário (Realidade Brasileira)
* **Dropdown Simplificado e Natural**: Seletor de estados mais limpo em `BrazilianRealidadeCalculator.tsx` (ex: `Acre (AC)` em vez da estrutura poluída anterior).
* **Consistência de Linguagem**: Em `config/realidade.ts`, remoção do sufixo ` (Estado)` nos nomes de `São Paulo` e `Rio de Janeiro`.
* **Indicador de Classe Social (IBGE/FGV)**: Adicionamos um painel dinâmico que calcula e exibe de forma premium a classe social estimada (Classes A, B, C, D e E) com base em múltiplos de salário mínimo.
* **Guias de Ação Personalizados**: Exibição de cards explicativos baseados em estatísticas reais (ensino técnico e estanque de dívidas de consumo para estratos baixos D/E; alocação em investimentos e proteção cambial global com Wise para estratos altos A/B/C), com ganchos nativos para o afiliado Wise do portal.
* **Card de Compartilhamento**: Integração da Classe Social nos dados visuais gerados na imagem para compartilhamento.

### 4. Correção Crítica de SEO Técnico (Sitemap XML)
* **Sitemap Completo (`app/sitemap.ts`)**: Mapeamento de 100% das 44 páginas estáticas e parametrizadas do projeto com a priorização estratégica correta para acelerar o ranqueamento orgânico no Google.

### 5. Mecanismo de Widgetização Dinâmica (Embed Limpo & Transparente)
* **EmbedHandler (`components/EmbedHandler.tsx`)**: Detector client-side que monitora se a URL contém `?embed=true`.
* **CSS de Modo Embed (`app/globals.css`)**: Ocultação automática de Nav, Footer, publicidades e CTAs, e background 100% transparente para fundir o widget ao layout do blog parceiro.
* **Botão Modular de Embed (`components/ui/ShareButtons.tsx`)**: Botão de `</> Incorporar no seu site` na base de compartilhamento de **todas as 11 calculadoras** do portal.

---

## Estrutura de pastas atualizada

```
napontadolapis/
├── .env.local                            ← Variáveis locais do AdSense
├── app/
│   ├── layout.tsx                        ← GA4 + AdSense meta tag + EmbedHandler
│   ├── page.tsx                          ← Registrada calculadora de Milhas e ITBI!
│   ├── sitemap.ts                        ← Sitemap dinâmico 100% completo! (44 rotas)
│   ├── investimentos/
│   │   ├── amortizacao/page.tsx
│   │   ├── viver-de-renda/page.tsx
│   │   └── itbi-e-cartorio/page.tsx
│   ├── trabalho/
│   │   ├── realidade-brasileira/page.tsx
│   │   ├── rescisao/page.tsx
│   │   └── seguro-desemprego/page.tsx
│   └── viagens/
│       ├── custo-de-vida/page.tsx
│       ├── planejar/page.tsx
│       └── milhas-ou-dinheiro/page.tsx   ← Nova! Rota da calculadora de Milhas
├── components/
│   ├── EmbedHandler.tsx                  ← Detector de iframe (?embed=true)
│   ├── AdBanner.tsx                      ← Componente modular do AdSense
│   ├── Nav.tsx                           ← Registrados novos links no menu
│   ├── ui/
│   │   └── ShareButtons.tsx              ← Botão "</> Incorporar" de Widget em todas
│   └── calculators/
│       ├── MilesCalculator.tsx           ← Nova! Componente da calculadora de Milhas
│       ├── ItbiCalculator.tsx            ← Componente da calculadora de ITBI
│       ├── BrazilianRealidadeCalculator.tsx ← Suporte a classes e guias estatísticos
│       └── TravelCalculator.tsx          ← Botão de Afiliado Wise integrado
├── config/
│   ├── miles.ts                          ← Nova! Configurações de milhas e CPP
│   ├── itbi.ts                           ← Configurações de alíquotas e cartórios
│   ├── realidade.ts                      ← Dados da pirâmide de renda
│   ├── travel.ts
│   └── flight-prices.json
├── public/
│   ├── ads.txt                           ← Arquivo de autorização do AdSense
│   └── logo.png
└── README.md                             ← Documentação técnica premium
```

---

## Próximos passos

1. **Promover links de Embeds (Widgetização)**: Fazer contato com portais imobiliários/corretores (para os widgets de *Amortização* e *ITBI*) e blogs de viagem/milhas (para o widget de *Milhas ou Dinheiro*) oferecendo as ferramentas de graça para indexação de backlinks de alta autoridade.
2. **Divulgação Orgânica em Fóruns**: Realizar publicações sobre "Privacidade Radical" no `r/investimentos` (Reddit) apresentando o projeto.
3. **Monitorar a revisão do Google AdSense**: Aguardar o prazo padrão de aprovação do site.
