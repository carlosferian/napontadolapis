# A Ponta do Lápis — Calculadoras Financeiras Gratuitas

Plataforma de calculadoras financeiras minimalistas de alta utilidade e educação financeira para o brasileiro. Sem cadastro, sem recolhimento de dados pessoais (sem CPF/nuvem), rodando 100% no navegador do usuário de forma privada.

## 🚀 Diferenciais do Projeto
* **Arquitetura 100% Estática e Autônoma (Custo Zero)**: Removidas dependências instáveis de APIs de aviação de terceiros (Amadeus/Kiwi). A aplicação roda exclusivamente com bancos de dados de preços locais estáveis (`flight-prices.json`, `cities-cost.ts` e `realidade.ts`), garantindo imunidade contra desligamento de serviços, tempo de build ultrarrápido (46 rotas estáticas geradas em menos de 6s) e custo vitalício zero de infraestrutura.
* **UX Premium de Entrada de Dados (Bidirecionalidade)**: Sliders de alta amplitude em calculadoras críticas (como Milhas e Viver de Renda) foram equipados com **campos numéricos formatados em tempo real (`pt-BR`)**. O usuário ganha a flexibilidade de arrastar o controle para estimar rapidamente ou digitar com precisão matemática o valor exato no teclado.
* **Sincronização Perfeita de Cores (Hotfix Tailwind v4)**: Implementado mapeamento global customizado para a variante `dark:` no Tailwind v4 sincronizada diretamente com o atributo de tema (`data-theme="dark"`), eliminando conflitos de cores brancas sobre fundo claro quando a preferência do sistema operacional diverge do tema selecionado no site.
* **Monetização Otimizada**:
  * **Google AdSense**: Banners manuais modularizados e sutis (`AdBanner.tsx`) integrados no final das calculadoras de maior engajamento, com suporte nativo a tags globais de verificação no `<head>` (`google-adsense-account`) e arquivo de compliance `ads.txt` na raiz pública.
  * **Programa de Afiliados Wise**: Botão de conversão direta integrado contextualmente na calculadora de viagem ao lado das métricas de economia, otimizando cliques com o link de afiliado oficial.
* **Estética Premium**: Desenvolvido sob um sistema visual moderno, com modo claro e escuro dinâmicos, paleta sutil baseada em tons de pedra/areia (`var(--c-ink)`, `var(--c-bg)`), tipografia moderna e responsividade absoluta.

## 🛠️ Stack Tecnológica
* **Core**: Next.js 16.2 (estático com Turbopack) & React 19
* **Tipagem**: TypeScript
* **Estilização**: Tailwind CSS v4 (Vanilla CSS + CSS custom @variants para sincronização de temas e design tokens)
* **Build & Hosting**: Netlify (Continuous Deployment via Git)

## 📁 Principais Calculadoras e Ferramentas

1. **Realidade Brasileira e Pirâmide Social (`/trabalho/realidade-brasileira`)**: Simulação de renda individual comparada com o percentil de rendimento nacional, estadual e polos econômicos regionais específicos com base no IBGE/PNAD e cesta básica do DIEESE. Inclui um **Gráfico de Pirâmide Social interativo** destacado com efeito de marcação e dicas didáticas personalizadas de aceleração patrimonial baseada no estrato socioeconômico.
2. **Planejador de Viagens Integrado (`/viagens`)**: Planejador completo com custos diários estimados para 22 destinos nacionais e internacionais com plano de poupança automatizado usando fórmula de anuidade (PMT) indexada à taxa Selic e ganho real de mercado.
3. **Milhas ou Dinheiro? (`/viagens/milhas-ou-dinheiro`)**: Inteligência baseada na metodologia do **Custo por Mil Milhas (CPP)**. Compara tarifas de passagem em milhas vs. dinheiro e audita promoções de compra de pontos alertando contra o "Desconto Fantasma" (preços de tabela inflados).
4. **ITBI e Custos de Cartório (`/investimentos/itbi-e-cartorio`)**: Estimador de taxas de transferência de imóveis, aplicando automaticamente a isenção de Escritura Pública para contratos financiados (Lei nº 4.380/64) e os **50% de desconto nas taxas de Cartório de Registro** para o primeiro imóvel financiado (Art. 290 da Lei de Registros Públicos nº 6.015/73).
5. **Parcelado ou À Vista? (`/investimentos/parcelado-ou-a-vista`)**: Solver financeiro de juros embutidos que utiliza o **método numérico da Bissecção** para encontrar a Taxa Interna de Retorno (TIR) real cobrada no parcelamento "sem juros" do varejo em relação ao Pix.
6. **Fuga do Rotativo (`/investimentos/fuga-do-rotativo`)**: Simulador pedagógico que projeta a espiral infinita de juros do rotativo do cartão de crédito (~15% a.m.) contra a amortização de empréstimos saudáveis de substituição (~3% a.m.), com **gráficos comparativos do Recharts** e alertas didáticos de dívida impagável.
7. **Simulador e Calculadora de Apostas (`/apostas`)**: Uma ferramenta gamificada projetada especialmente para fins pedagógicos de conscientização. Inclui o **"Simulador da Ilusão"** (um lobby completo de cassino imitando slots como o Tigrinho, crash/foguetinho, roletas e múltiplas com picos de dopamina iniciais e quebra forçada) e o **"Piloto Automático de Rodadas"** demonstrando a ruína matemática do jogador a longo prazo de forma ultra veloz. Conta com uma aba paralela para mensuração de custos reais e painel de acolhimento gratuito do SUS (CAPS) e Jogadores Anônimos no rodapé.
8. **Outras Calculadoras**: Amortização de financiamento (SAC vs Price), Juros Compostos, Viver de Renda (renda passiva perpetuidade vs desgaste), Cigarro/Vape (vícios), Divisão de Contas, Seguro-Desemprego e Rescisão Trabalhista CLT.

## 💻 Desenvolvimento Local

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie um arquivo `.env.local` na raiz com as suas variáveis de ambiente:
   ```env
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1917277909427173
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Faça o build de produção estática local:
   ```bash
   npm run build
   ```
