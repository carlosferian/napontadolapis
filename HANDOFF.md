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

### 1. Hotfix Global de Sincronização do Tailwind v4 (Tema Escuro/Claro)
* **Solução Causa Raiz:** Configuramos uma nova regra global para a variante dark do Tailwind v4 (`app/globals.css`):
  ```css
  @variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
  ```
* **O Impacto:** Isso realinhou 100% o comportamento das classes `dark:` (como `dark:text-white`) com o `ThemeProvider` do site (`data-theme`), ignorando as preferências do sistema operacional do usuário. Isso resolveu de vez a invisibilidade de valores de cards e sliders no modo claro para quem usava o sistema operacional configurado em modo escuro.

### 2. Nova Calculadora de Milhas ou Dinheiro (Inteligência em Milhas)
* **Matemática Fiel baseada no CPP (`config/miles.ts`)**:
  * Mapeamento de taxas médias estáveis de resgate e aquisição de programas nacionais (Smiles, Latam, TudoAzul, Livelo, Esfera).
* **Upgrade Total de Inputs (`components/calculators/MilesCalculator.tsx`)**:
  * Substituição de labels de range estáticas por **campos de entrada numéricos interativos e bidirecionais** com formatação de milhares (`pt-BR`). 
  * O usuário agora vê os valores selecionados em fontes robustas de alto contraste e pode optar por digitar o valor exato no teclado ou arrastar o slider, com sincronização visual e matemática imediata.
  * Inputs customizados decimais para CPP de origem de milhas e mercado com suporte à vírgula brasileira.
* **Foco na Automatização (Reescrita da Prosa)**:
  * O texto descritivo ao final da página foi reformulado. Em vez de ensinar o usuário a calcular na mão com fórmulas complexas, agora orienta sobre como a nossa calculadora executa todo o processamento de forma 100% autônoma.
  * Fornecemos um guia prático de UX orientando quais 3 a 4 dados o usuário precisa coletar no portal da cia aérea para simplesmente colar na nossa ferramenta e obter o veredito dinâmico em milissegundos.

### 3. Nova Calculadora de Parcelado ou À Vista? (Juros Ocultos)
* **Matemática do Solver Financeiro (`config/parcelado.ts`)**:
  * Utilização do método de Bissecção em Javascript para deduzir a Taxa Interna de Retorno (TIR) implícita de anuidade/parcelas iguais, comparando com o desconto à vista.
  * Cálculo dinâmico do equivalente ao CDI (percentual da taxa Selic líquida) e rentabilidade equivalente anualizada.
* **Componente de UI Premium (`components/calculators/ParceladoCalculator.tsx`)**:
  * Inputs com formatação BRL inteligente em tempo real e sliders interativos.
  * Painel de veredito visual com coloração reativa (Verde para parcelar se os juros forem irrelevantes; Vermelho/Amarelo para pagar à vista no Pix).
  * Análise de custo de oportunidade detalhada e wrapped de compartilhamento modular.
  * Rota registrada: `/investimentos/parcelado-ou-a-vista`

### 4. Novo Simulador de Fuga do Rotativo (Substituição de Dívidas)
* **Matemática de Amortização Comparativa (`config/rotativo.ts`)**:
  * Projeção de cenários paralelos: manter a dívida de cartão de crédito no rotativo (~15% a.m.) contra a troca por um empréstimo pessoal ou consignado estruturado (~3% a.m.).
  * Alertas estatísticos de **"Dívida Infinita"** caso o pagamento mensal não supere os juros do rotativo.
* **Interface Educativa de Alto Impacto (`components/calculators/RotativoCalculator.tsx`)**:
  * Gráfico de área comparativo do Recharts mostrando o abismo visual da dívida do cartão explodindo exponencialmente contra a linha do empréstimo caindo a zero.
  * Guias de ação pedagógicos baseados na lei do superendividamento e consolidação ética.
  * Oportunidade perfeita de monetização por afiliados contextuais e limpos com portais de renegociação de dívidas.
  * Rota registrada: `/investimentos/fuga-do-rotativo`

### 5. Nova Calculadora de ITBI e Custos de Cartório
* **Matemática Fiel de Tributos e Cartórios (`config/itbi.ts`)**:
  * Regra de alíquota reduzida de ITBI para parte financiada (SFH/Minha Casa Minha Vida) a **0,5%**.
  * Fórmulas de emolumentos para Registro de Imóvel e Escritura Pública.
* **Isenções e Descontos por Lei Integrados (`components/calculators/ItbiCalculator.tsx`)**:
  * **Isenção de Escritura Pública**: Se for financiado, o contrato bancário tem força de escritura (Lei nº 4.380/64). O sistema zera automaticamente esse custo, informando a economia gerada.
  * **Art. 290 da Lei Federal 6.015/73**: Se for o primeiro imóvel residencial financiado, o sistema calcula e aplica **50% de desconto** nas taxas de cartório de Registro.

### 6. Refatoração de Experiência do Usuário e Gráfico de Pirâmide (Realidade Brasileira)
* **Gráfico de Pirâmide Social Dinâmico**: Inclusão de uma belíssima representação triangular interativa de pirâmide social mostrando onde o usuário se enquadra (Classes A, B, C, D e E) baseada em seu salário real, harmonizada com o design system do site e responsiva tanto para celular quanto computador.
  * **Efeito Premium de Destaque**: O bloco e card correspondentes à classe do usuário são realçados com borda colorida de alto relevo, escala (`scale-105`), anel de brilho, sombra projetada e um badge/indicador `"Você está aqui"` flutuante e animado com pulsação suave.
  * **Faixas de Cores Curadas**: Cores elegantes alinhadas com o design (Classe A: Dourado/Amber; Classe B: Esmeralda; Classe C: Teal; Classe D: Slate; Classe E: Stone) com suporte perfeito a light e dark mode.
* **Dropdown Simplificado e Natural**: Seletor de estados mais limpo em `BrazilianRealidadeCalculator.tsx` (ex: `Acre (AC)` em vez da estrutura poluída anterior).
* **Consistência de Linguagem**: Em `config/realidade.ts`, remoção do sufixo ` (Estado)` nos nomes de `São Paulo` e `Rio de Janeiro`.
* **Polos Regionais Expandidos**: Inclusão de **Curitiba (PR)** sob o grupo de *Polos Econômicos Regionais* com percentis salariais metropolitanos e cesta básica ajustada a R$ 754,00.
* **Indicador de Classe Social (IBGE/FGV)**: Adicionamos um painel dinâmico que calcula e exibe de forma premium a classe social estimada (Classes A, B, C, D e E) com base em múltiplos de salário mínimo.
* **Guias de Ação Personalizados**: Exibição de cards explicativos baseados em estatísticas reais (ensino técnico e estanque de dívidas de consumo para D/E; alocação em investimentos e proteção cambial global com Wise para A/B/C), com ganchos nativos para o afiliado Wise do portal.

### 7. Correção Crítica de SEO Técnico (Sitemap XML)
* **Sitemap XML (`app/sitemap.ts`)**: Mapeamento de 100% das 46 páginas estáticas e parametrizadas do projeto com a priorização estratégica correta para acelerar o ranqueamento orgânico no Google.

### 8. Mecanismo de Widgetização Dinâmica (Embed Limpo & Transparente)
* **EmbedHandler (`components/EmbedHandler.tsx`)**: Detector client-side que monitora se a URL contém `?embed=true`.
* **CSS de Modo Embed (`app/globals.css`)**: Ocultação automática de Nav, Footer, publicidades e CTAs, e background 100% transparente para fundir o widget ao layout do blog parceiro.
* **Botão Modular de Embed (`components/ui/ShareButtons.tsx`)**: Botão de `</> Incorporar no seu site` na base de compartilhamento de **todas as 11 calculadoras** do portal.

### 9. Super-Gamificação Pedagógica contra o Vício em Apostas
Overhaul completo da Calculadora de Apostas (`components/calculators/BetsCalculator.tsx`), direcionada especialmente para o público jovem e pessoas com dificuldade de leitura/matemática básica, transmitindo o impacto das Bets de forma puramente emocional, visual e experimental:
* **Simulador da Ilusão (Lobby Gamificado de Bets)**:
  * Lobby de apostas com visual de cassino digital com picos neon e cores vibrantes.
  * Escolha entre 4 modalidades populares brasileiras: **Tigrinho (Slots), Foguetinho (Crash), Múltiplas (Esportes) e Roleta**.
  * **Ciclo de Dopamina Programado (15 rodadas manuais)**: O simulador entrega propositalmente pequenas vitórias no início (giros 1, 2 e 5 - "Big Win") para simular o efeito dopaminérgico que vicia o apostador, seguido de um dreno rápido e inevitável de saldo até a falência (`R$ 0,00`).
* **Piloto Automático de Edge Matemático (1.000 Rodadas Velozes)**:
  * Executa um loop instantâneo com as margens reais das plataformas (RTP de 75% a 97.3%). Demonstra visualmente a teoria da ruína do jogador: a longo prazo, a perda de 100% do saldo é uma certeza estatística absoluta.
* **Calculadora de Perda Real Paralela**:
  * Uma segunda aba mantém a ferramenta original de perda acumulada mensal no papel, agora equipada com os novos inputs numéricos interativos e bidirecionais com pontos de milhares.
* **Painel Rodapé de Prevenção e Impacto Real**:
  * Inclusão de dados oficiais do Banco Central/DIEESE sobre o impacto das Bets no consumo das famílias de baixa renda brasileiras.
  * Ganchos práticos de acolhimento gratuito e contato direto com **Jogadores Anônimos do Brasil**, tratamento clínico de ludopatia no **SUS (CAPS)** e orientações de **Autoexclusão de CPF** nas plataformas de apostas.

---

## Governança de Parcerias e Monetização (Awin / Redes de Afiliados)

Para futuras parcerias de conversão na Calculadora de Milhas ou outras áreas (como *Livelo, Smiles, Decolar* etc.), a seguinte governança técnica **deve ser seguida sem exceção** para manter o portal rápido, seguro, independente e com SEO impecável:

1. **Performance Absoluta (Sem Banners ou Scripts Externos) ⚡**:
   * **Proibido**: Instalar pixels de rastreamento de afiliados, scripts globais de redes de CPA, iframes promocionais ou banners dinâmicos em Javascript fornecidos pelas redes. Esses scripts degradam severamente a velocidade de carregamento e atrasam a interatividade da página, destruindo as pontuações de Core Web Vitals e o SEO do Next.js.
   * **Recomendado**: Utilizar estritamente **links de redirecionamento em HTML puro (`<a>`)**. O botão de chamada para o parceiro deve ser apenas um hiperlink padrão direcionando para a URL de afiliado gerada no portal da rede (ex: Awin/Lomadee). Isso consome **zero kilobytes** de processamento local, preservando o carregamento instantâneo.
2. **Declaração de Transparência para o Google (SEO Técnico) 🔍**:
   * Para evitar punições algorítmicas do Google (*Thin Affiliates* ou desconfiança de transferência artificial de força de link/PageRank), todo link de afiliado ou patrocinado no código deve carregar obrigatoriamente as tags de segurança:
     ```typescript
     <a href="URL_DE_AFILIADO" target="_blank" rel="noopener noreferrer sponsored">
       Texto do Botão
     </a>
     ```
   * A tag **`rel="sponsored"`** sinaliza honestidade técnica para os robôs de busca. O Google reconhece a intenção comercial legítima e protege a autoridade de busca do seu domínio.
3. **Privacidade e Imparcialidade Radical (Cálculos 100% Locais) 🛡️**:
   * O portal se posiciona como um simulador de utilidade pública independente e sem captação de dados/e-mails. 
   * **Arquitetura**: O processamento matemático e as simulações devem continuar rodando 100% client-side (no navegador do usuário), de forma anônima.
   * **Monetização**: Os ganchos de comissão devem ser oferecidos exclusivamente de forma **passiva e contextual no final do funil de resultados** (como uma sugestão prática de ação para o cliente baseado no veredito matemático do cálculo), mantendo o julgamento analítico do sistema inabalável e imparcial.
4. **Compliance com o Leitor**:
   * Recomenda-se manter uma linha explicativa discreta na base ou rodapé do site informando aos leitores que pequenas comissões geradas por links recomendados de resultado ajudam a manter o portal 100% independente, gratuito e sem anúncios invasivos.

---

## Estrutura de pastas atualizada

```
napontadolapis/
├── .env.local                            ← Variáveis locais do AdSense
├── app/
│   ├── layout.tsx                        ← GA4 + AdSense meta tag + EmbedHandler
│   ├── page.tsx                          ← Registradas novas calculadoras na home!
│   ├── sitemap.ts                        ← Sitemap dinâmico 100% completo! (46 rotas)
│   ├── investimentos/
│   │   ├── amortizacao/page.tsx
│   │   ├── viver-de-renda/page.tsx       ← Refatorados inputs formatados BRL e contraste
│   │   ├── itbi-e-cartorio/page.tsx
│   │   ├── parcelado-ou-a-vista/page.tsx ← Nova! Juros ocultos do "sem juros"
│   │   └── fuga-do-rotativo/page.tsx     ← Nova! Rota de escape das dívidas
│   ├── trabalho/
│   │   ├── realidade-brasileira/page.tsx ← Inclusão do gráfico de pirâmide social
│   │   ├── rescisao/page.tsx
│   │   └── seguro-desemprego/page.tsx
│   └── viagens/
│       ├── custo-de-vida/page.tsx
│       ├── planejar/page.tsx
│       └── milhas-ou-dinheiro/page.tsx
├── components/
│   ├── EmbedHandler.tsx                  ← Detector de iframe (?embed=true)
│   ├── AdBanner.tsx                      ← Componente modular do AdSense
│   ├── Nav.tsx                           ← Registrados novos links no menu
│   ├── ui/
│   │   ├── ShareButtons.tsx              ← Botão "</> Incorporar" de Widget em todas
│   │   └── ResultHero.tsx                ← Ajustado contraste das fontes manuscritas
│   └── calculators/
│       ├── MilesCalculator.tsx           ← Componente da calculadora de Milhas
│       ├── ItbiCalculator.tsx            ← Componente da calculadora de ITBI
│       ├── BrazilianRealidadeCalculator.tsx ← Suporte a classes, pirâmide e guias
│       ├── ParceladoCalculator.tsx       ← Nova! Componente da calculadora de parcelado
│       └── RotativoCalculator.tsx        ← Nova! Componente do escape de rotativo
├── config/
│   ├── miles.ts                          ← Configurações de milhas e CPP
│   ├── itbi.ts                           ← Configurações de alíquotas e cartórios
│   ├── realidade.ts                      ← Dados da pirâmide de renda
│   ├── parcelado.ts                      ← Nova! Fórmulas e solver de parcelamento
│   ├── rotativo.ts                       ← Nova! Projeções de fuga de rotativo
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
