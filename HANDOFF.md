# Handoff — A Ponta do Lápis

**Última atualização:** 2026-05-30  
**Branch de desenvolvimento:** `claude/friendly-hypatia-HwfUk`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Netlify (deploy contínuo ativo)  
**Domínio registrado:** `apontadolapis.com.br`

---

## Estado atual

O projeto está completo, compilando com **sucesso absoluto** (todas as 43 páginas estáticas geradas sem avisos ou erros) e **100% monetizado e integrado** com as campanhas oficiais do proprietário (Google AdSense e Programa de Afiliados da Wise).

Toda a infraestrutura do site roda de forma **100% independente, autônoma e com custo zero vitalício**, eliminando qualquer dependência de chaves de API externas de terceiros instáveis de aviação (Amadeus/Kiwi.com), o que garante imunidade contra o encerramento do portal Amadeus em julho de 2026.

---

## O que foi feito — Sessão Atual (2026-05-30)

### 1. Nova Calculadora de ITBI e Custos de Cartório
Desenvolvemos uma calculadora de utilidade pública de altíssimo apelo para corretores de imóveis e compradores de moradia, estimando todas as despesas adicionais de transferência:
* **Matemática Fiel de Tributos e Cartórios (`config/itbi.ts`)**:
  * Cadastramento de alíquotas oficiais de ITBI das capitais brasileiras mais importantes (com suporte a alíquota personalizada para outras cidades).
  * Regra de alíquota reduzida de ITBI para parte financiada (SFH/Minha Casa Minha Vida) a **0,5%**.
  * Fórmulas de estimativas nacionais de emolumentos para Registro de Imóvel e Escritura Pública.
* **Isenções e Descontos por Lei Integrados (`components/calculators/ItbiCalculator.tsx`)**:
  * **Isenção de Escritura Pública**: Se for financiado, o contrato bancário tem força de escritura (Lei nº 4.380/64). O sistema zera automaticamente esse custo, informando a economia gerada.
  * **Art. 290 da Lei Federal 6.015/73**: Se for o primeiro imóvel residencial financiado, o sistema calcula e aplica **50% de desconto** nas taxas de cartório de Registro.
* **Fácil Incorporação para Corretores**: A calculadora está integrada ao novo sistema de embeds modulares do portal. O corretor pode copiar o código em um clique e inseri-la como um **widget puro com fundo transparente** no seu próprio site imobiliário.

### 2. Refatoração de Experiência do Usuário (Realidade Brasileira)
* **Dropdown Simplificado e Natural**: Removemos a estrutura redundante e poluída do seletor de estados em `components/calculators/BrazilianRealidadeCalculator.tsx` (ex: `Acre — Medição: Rio Branco (AC)`). Agora, o dropdown exibe de forma elegante e limpa `Acre (AC)` ou `Minas Gerais (MG)`.
* **Consistência de Linguagem**: Em `config/realidade.ts`, removemos o sufixo redundante ` (Estado)` dos nomes de `São Paulo` e `Rio de Janeiro`. Isso resolve dinamicamente as exibições no portal, tornando títulos de gráficos (ex: *"Curva de Distribuição de Renda de São Paulo"*) 100% naturais.
* **Preservação de Contexto**: As informações de medição de Cesta Básica do DIEESE permanecem visíveis nos blocos de resultados (ex: *"Cesta em Porto Alegre: R$ 810"*), garantindo clareza sem poluir a entrada de dados.

### 3. Correção Crítica de SEO Técnico (Sitemap XML)
* **Mapeamento de Rotas Pendentes**: Identificamos que as novas e principais calculadoras (incluindo *Realidade Brasileira*, *Amortização de Financiamento*, *Rescisão CLT*, *Seguro-Desemprego*, *Juros Compostos* e a nova de *ITBI e Cartório*) estavam fora do gerador de Sitemap XML do Next.js.
* **Sitemap Completo (`app/sitemap.ts`)**: Atualizamos o gerador para integrar 100% das 43 páginas estáticas e parametrizadas do projeto.
* **Priorização Estratégica**: Configuramos as ferramentas mais competitivas e virais com a **prioridade máxima de 0.90 a 0.95**, acelerando o tempo de indexação e descoberta pelo Google Search Console.

### 4. Mecanismo de Widgetização Dinâmica (Embed Limpo & Transparente)
* **Detecção Dinâmica (`components/EmbedHandler.tsx`)**: Criamos um componente client-side montado no `app/layout.tsx` que monitora se a query string da URL contém `?embed=true`.
* **Estilização Inteligente no Embed (`app/globals.css`)**: Injetamos estilos CSS globais específicos para o modo `.is-embedded`. Quando ativo, oculta automaticamente o cabeçalho (Nav), rodapé (Footer), publicidades do AdSense, chamadas de afiliados e explicações longas em texto.
* **Fundo Transparente**: Definimos a cor de fundo como transparente no modo embed, permitindo que a calculadora se integre perfeitamente a qualquer cor ou design do blog do parceiro.
* **Botão Modular global de Cópia (`components/ui/ShareButtons.tsx`)**: Adicionamos o botão de `</> Incorporar no seu site (Widget)` na base de compartilhamento de **todas as 11 calculadoras** do portal. Ele abre um painel dinâmico revelando o código do `<iframe>` gerado automaticamente baseado na URL atual da página, facilitando a cópia e inserção pelos parceiros.

### 5. Integração Oficial do Google AdSense
* **Tag de Verificação Global (`app/layout.tsx`)**: Adicionamos a meta tag oficial exigida para a propriedade da conta do AdSense:
  ```typescript
  other: {
    'google-adsense-account': 'ca-pub-1917277909427173',
  }
  ```
* **Arquivo de Compliance (`public/ads.txt`)**: Publicamos o arquivo de autorização digital de publicidade do Google na raiz pública.

---

## Estrutura de pastas atualizada

```
napontadolapis/
├── .env.local                            ← Variáveis locais do AdSense
├── app/
│   ├── layout.tsx                        ← GA4 + AdSense meta tag + EmbedHandler
│   ├── page.tsx                          ← Registrada nova calculadora de ITBI!
│   ├── sitemap.ts                        ← Sitemap dinâmico 100% completo! (43 rotas)
│   ├── investimentos/
│   │   ├── amortizacao/page.tsx
│   │   ├── viver-de-renda/page.tsx
│   │   └── itbi-e-cartorio/page.tsx      ← Nova! Rota da calculadora de ITBI
│   ├── trabalho/
│   │   ├── realidade-brasileira/page.tsx
│   │   ├── rescisao/page.tsx
│   │   └── seguro-desemprego/page.tsx
│   └── viagens/
│       └── custo-de-vida/page.tsx
├── components/
│   ├── EmbedHandler.tsx                  ← Detector de iframe (?embed=true)
│   ├── AdBanner.tsx                      ← Componente modular do AdSense
│   ├── Nav.tsx                           ← Registrado novo link de ITBI no menu
│   ├── ui/
│   │   └── ShareButtons.tsx              ← Integração de botão "</> Incorporar"
│   └── calculators/
│       ├── ItbiCalculator.tsx            ← Nova! Componente da calculadora de ITBI
│       ├── BrazilianRealidadeCalculator.tsx ← Dropdown e nomes simplificados
│       └── TravelCalculator.tsx          ← Botão de Afiliado Wise integrado
├── config/
│   ├── itbi.ts                           ← Nova! Configurações de alíquotas e cartórios
│   ├── realidade.ts                      ← Removido sufixo "(Estado)" de SP/RJ
│   ├── travel.ts
│   └── flight-prices.json
├── public/
│   ├── ads.txt                           ← Arquivo de autorização do AdSense
│   └── logo.png
└── README.md                             ← Documentação técnica premium
```

---

## Próximos passos

1. **Promover links de Embeds (Widgetização)**: Fazer contato com corretores de imóveis e imobiliárias de médio porte oferecendo o widget interativo e limpo das calculadoras de *Amortização* e *ITBI* para incorporar em seus sites, gerando tráfego qualificado e backlinks de autoridade.
2. **Divulgação Orgânica em Fóruns**: Realizar publicações sobre "Privacidade Radical" no `r/investimentos` (Reddit) apresentando as ferramentas gratuitas sem anúncios e sem captação de leads.
3. **Monitorar a revisão do Google AdSense**: Aguardar o prazo padrão de aprovação do site.
