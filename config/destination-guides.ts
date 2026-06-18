// Guias editoriais por destino — conteúdo original e específico de cada cidade.
// Renderizado em app/viagens/[destino]/page.tsx abaixo da calculadora, para dar
// profundidade real a cada página (em vez de texto-modelo com a cidade trocada).
//
// Regra de ouro: cada campo deve ser ESPECÍFICO do destino. Nada de frase genérica
// que serviria para qualquer cidade — é exatamente isso que caracteriza "conteúdo
// de baixo valor". Valores de custo/voo são estimativas e convivem com a calculadora.

export interface DestinationGuide {
  /** 2-3 frases de abertura, específicas do destino. */
  intro: string
  bestTime: {
    summary: string
    high: string
    low: string
    avoid?: string
  }
  /** O que o orçamento compra naquele destino, em termos concretos. */
  costContext: string
  flight: {
    /** Duração e conexões típicas saindo de Guarulhos (GRU). */
    duration: string
    tip: string
  }
  money: {
    /** Moeda local + como costuma funcionar o pagamento. */
    currency: string
    tip: string
  }
  /** 3 regiões/bairros para se hospedar, com o perfil de cada um. */
  neighborhoods: { name: string; desc: string }[]
  /** Uma dica concreta de economia específica do destino. */
  savingTip: string
  /** Uma armadilha/erro comum específico do destino. */
  watchOut: string
  faq: { question: string; answer: string }[]
}

export const destinationGuides: Record<string, DestinationGuide> = {
  lisboa: {
    intro:
      'Lisboa é, para a maioria dos brasileiros, a porta de entrada mais barata e tranquila da Europa: voo direto de pouco mais de nove horas, sem barreira de idioma e com euro que rende mais que em Paris ou Londres. A capital portuguesa mistura miradouros, bondinhos amarelos, fado e uma gastronomia honesta a preços que ainda cabem no bolso.',
    bestTime: {
      summary:
        'As melhores janelas são a primavera (abril a junho) e o início do outono (setembro e outubro): clima ameno, dias longos e bem menos turistas que o auge do verão. O sol aparece em quase todos os meses, mas o inverno é chuvoso.',
      high: 'Julho e agosto (verão europeu) — calor, cidade cheia e hotéis nas máximas.',
      low: 'Novembro a fevereiro — chuvoso e mais frio, porém com as melhores tarifas de hospedagem.',
      avoid: 'Agosto, quando Lisboa fica lotada e muitos comércios locais fecham para férias.',
    },
    costContext:
      'Lisboa é uma das capitais mais acessíveis da Europa Ocidental. Uma refeição numa tasca de bairro sai por € 10 a € 15, o transporte público é integrado e barato, e boa parte das atrações — miradouros, igrejas e o charme das ruas da Alfama — é de graça.',
    flight: {
      duration: 'Voo direto GRU → Lisboa em torno de 9h30 (TAP e LATAM operam a rota).',
      tip: 'Passagens caem fora do verão; voar em terça ou quarta e evitar julho/agosto costuma derrubar bastante o preço.',
    },
    money: {
      currency: 'Euro (€).',
      tip: 'Pague sempre em euro no cartão e recuse a opção de "cobrar em reais" na maquininha — o câmbio embutido (DCC) é muito pior que o do seu banco. Cartão é aceito em quase tudo; leve pouco dinheiro vivo.',
    },
    neighborhoods: [
      { name: 'Baixa e Chiado', desc: 'Coração turístico, plano e bem servido de metrô — prático, porém o mais caro.' },
      { name: 'Alfama', desc: 'O bairro mais antigo, de ruelas e fado; charmoso, mas cheio de ladeiras e escadas.' },
      { name: 'Príncipe Real / Santos', desc: 'Descolados, com bons restaurantes e diárias mais em conta que o centro histórico.' },
    ],
    savingTip:
      'O Lisboa Card (24/48/72h) inclui transporte público ilimitado e entrada em vários museus e no Mosteiro dos Jerónimos — compensa se você pretende visitar duas ou mais atrações pagas por dia.',
    watchOut:
      'Em muitos restaurantes, o "couvert" (pães, azeitonas, patês que chegam sem pedir) NÃO é cortesia: vem na conta. Recuse ou pergunte o preço se não quiser pagar.',
    faq: [
      {
        question: 'Preciso de visto para viajar a Portugal?',
        answer:
          'Não. Brasileiros entram no Espaço Schengen sem visto por até 90 dias a cada 180. Leve passaporte com validade de pelo menos 3 meses após a data de retorno e tenha em mãos comprovantes de hospedagem e da passagem de volta, que podem ser solicitados na imigração.',
      },
      {
        question: 'Qual a melhor época para conhecer Lisboa?',
        answer:
          'Primavera (abril a junho) e começo do outono (setembro e outubro): clima ameno, dias longos e menos turistas que o pico de julho e agosto, quando os preços disparam.',
      },
      {
        question: 'Dá para usar reais ou só euro?',
        answer:
          'Só euro. Pague sempre na moeda local no cartão e recuse a opção de "cobrar em reais" na maquininha — o câmbio dessa conversão automática costuma ser bem pior que o do seu banco ou conta internacional.',
      },
    ],
  },

  paris: {
    intro:
      'Paris cobra caro pelo mito, mas entrega: a Torre Eiffel iluminada, o Louvre, os cafés de calçada e os bairros que parecem cenário de cinema. O segredo para não estourar o orçamento é equilibrar o que custa (atrações, restaurantes) com o muito que a cidade oferece de graça — começando por simplesmente caminhar por ela.',
    bestTime: {
      summary:
        'Primavera (abril a junho) e outono (setembro a outubro) reúnem clima agradável e multidões menores. O verão tem dias longos, mas é a alta estação cheia e cara; o inverno é cinzento, porém barato e com a cidade decorada no fim de ano.',
      high: 'Junho a agosto — verão, férias e preços no topo.',
      low: 'Novembro a março (fora do Natal) — frio e cinza, com as melhores tarifas.',
      avoid: 'Agosto, quando muitos parisienses viajam e parte do comércio de bairro fecha.',
    },
    costContext:
      'Comida e hospedagem pesam em Paris. Mas dá para economizar muito: uma baguete recheada ou quiche de padaria resolve o almoço por poucos euros, e atrações como Notre-Dame (por fora), o Sacré-Cœur e a vista da Torre Eiffel não custam nada.',
    flight: {
      duration: 'Voo direto GRU → Paris (Charles de Gaulle) em cerca de 11h30 (Air France e LATAM).',
      tip: 'Os bilhetes mais baratos costumam aparecer fora do verão e das férias de julho; compre com antecedência para datas de alta estação.',
    },
    money: {
      currency: 'Euro (€).',
      tip: 'Cartão internacional é aceito em quase todo lugar, inclusive no metrô. Pague em euro e recuse a conversão em reais na maquininha. Leve algum troco para mercados de rua e gorjetas.',
    },
    neighborhoods: [
      { name: 'Le Marais (3e/4e)', desc: 'Central, histórico e cheio de vida — ótimo para andar a pé, embora não seja barato.' },
      { name: 'Saint-Germain-des-Prés (6e)', desc: 'Clássico e elegante, perto do Louvre e do Jardim de Luxemburgo.' },
      { name: 'Montmartre (18e)', desc: 'Boêmio, com o Sacré-Cœur e diárias mais em conta que a margem do Sena.' },
    ],
    savingTip:
      'Vários museus nacionais têm entrada gratuita no primeiro domingo de cada mês (sobretudo na baixa temporada). Se for visitar muitos, o Paris Museum Pass dilui o custo e ainda fura filas.',
    watchOut:
      'Golpes de rua são comuns perto da Torre Eiffel e do Sacré-Cœur: o do "anel achado", o da pulseira amarrada no pulso e o da petição. E fique de olho nos bolsos no metrô, alvo clássico de batedores de carteira.',
    faq: [
      {
        question: 'Preciso de visto para a França?',
        answer:
          'Não. A França integra o Espaço Schengen, e brasileiros podem ficar até 90 dias a cada 180 sem visto. Tenha passaporte válido (mínimo 3 meses após o retorno) e comprovantes de estadia e volta.',
      },
      {
        question: 'Paris é muito cara? Dá para viajar com orçamento controlado?',
        answer:
          'Dá. Os maiores gastos são hospedagem e restaurantes, mas padarias resolvem refeições por poucos euros, o transporte público é eficiente e muitas das atrações mais famosas (vistas, igrejas por fora, parques) são gratuitas.',
      },
      {
        question: 'Qual a melhor época para ir a Paris?',
        answer:
          'Primavera (abril a junho) e outono (setembro e outubro): clima agradável, menos turistas e preços mais civilizados que no verão (junho a agosto).',
      },
    ],
  },

  roma: {
    intro:
      'Roma é um museu a céu aberto onde 2.500 anos de história dividem a esquina com cafés e cantinas. Coliseu, Fórum, Vaticano e Fontana di Trevi cabem a pé, e a comida — da carbonara à gelateria — é parte essencial do passeio. É caótica, barulhenta e apaixonante.',
    bestTime: {
      summary:
        'Primavera (abril a junho) e outono (setembro e outubro) têm o melhor clima e filas menores. O verão romano é escaldante e lotado; o inverno é ameno, mais barato e com a cidade vazia.',
      high: 'Junho a agosto e a Páscoa — calor forte e multidões.',
      low: 'Novembro a fevereiro (fora do Natal) — frio leve e tarifas baixas.',
      avoid: 'Agosto, com calor intenso e muitos comércios locais fechados para férias.',
    },
    costContext:
      'Roma é mais barata que Paris ou Londres. Um prato de massa numa cantina sai por € 10 a € 14, a água é de graça nos bebedouros públicos ("nasoni") e dezenas de igrejas guardam obras-primas (Caravaggio, Bernini) sem cobrar nada.',
    flight: {
      duration: 'Voo direto GRU → Roma (Fiumicino) em torno de 11h45 (ITA Airways); também há rotas com uma conexão.',
      tip: 'Compre o ingresso do Coliseu/Fórum e dos Museus Vaticanos online com antecedência — além de economizar tempo, evita os cambistas e filas de horas.',
    },
    money: {
      currency: 'Euro (€).',
      tip: 'Cartão é amplamente aceito; pague em euro e recuse a conversão em reais. Tenha algum dinheiro para pequenos cafés e para a gelateria de bairro.',
    },
    neighborhoods: [
      { name: 'Centro Storico', desc: 'Em torno do Pantheon e da Piazza Navona — tudo a pé, porém o mais disputado e caro.' },
      { name: 'Trastevere', desc: 'Bairro de ruelas, trattorias e vida noturna; charmoso e um pouco mais em conta.' },
      { name: 'Monti', desc: 'Descolado e central, ao lado do Coliseu, com boa relação custo-charme.' },
    ],
    savingTip:
      'Encha a garrafa nos "nasoni" (as bicas públicas espalhadas pela cidade) e troque o jantar caro pelo "aperitivo": um drink no fim de tarde que costuma vir acompanhado de petiscos.',
    watchOut:
      'Restaurantes turísticos ao redor do Coliseu e da Fontana di Trevi costumam cobrar caro por comida mediana e ainda somam o "coperto" (taxa por pessoa à mesa). Caminhe duas ou três quadras para fugir das armadilhas.',
    faq: [
      {
        question: 'Preciso de visto para a Itália?',
        answer:
          'Não. A Itália faz parte do Espaço Schengen; brasileiros ficam até 90 dias a cada 180 sem visto, com passaporte válido por pelo menos 3 meses após o retorno.',
      },
      {
        question: 'Quantos dias bastam para conhecer Roma?',
        answer:
          'De 3 a 4 dias cobrem os clássicos (Coliseu, Fórum, Vaticano, centro histórico) sem correria. Uma semana permite incluir bate-voltas como Pompeia, Florença ou Nápoles.',
      },
      {
        question: 'O ingresso do Vaticano e do Coliseu precisa ser comprado antes?',
        answer:
          'Sim, é altamente recomendável. Os Museus Vaticanos e o Coliseu trabalham com horário marcado e esgotam nos dias cheios; comprando online você garante a entrada e pula as filas.',
      },
    ],
  },

  barcelona: {
    intro:
      'Barcelona junta o que a maioria dos destinos europeus oferece separado: praia urbana, a arquitetura delirante de Gaudí, tapas a qualquer hora e uma vida noturna que vai até o amanhecer. É mediterrânea no ritmo e na temperatura, o que torna difícil não gostar.',
    bestTime: {
      summary:
        'Maio, junho, setembro e outubro são o ponto ideal: calor de praia sem o aperto do verão. Julho e agosto enchem a cidade e o litoral; o inverno é ameno e barato, embora o mar fique frio.',
      high: 'Junho a agosto — temporada de praia, preços altos e multidões.',
      low: 'Novembro a março — ameno e econômico, fora da época de banho de mar.',
    },
    costContext:
      'Barcelona é mais em conta que o norte da Europa. O "menú del día" no almoço (três pratos por € 12 a € 16) é a melhor pechincha gastronômica, as praias são públicas e gratuitas, e muito do charme de Gaudí pode ser visto por fora, sem ingresso.',
    flight: {
      duration: 'Voo direto GRU → Barcelona em cerca de 10h45 (LATAM, sazonal); fora disso, com uma conexão na Europa.',
      tip: 'Reserve a entrada da Sagrada Família online com antecedência: é a atração mais procurada e os horários esgotam, sobretudo no verão.',
    },
    money: {
      currency: 'Euro (€).',
      tip: 'Cartão aceito em quase tudo. Pague em euro, recuse a conversão em reais e mantenha o celular e a carteira guardados — La Rambla e o metrô são alvos de batedores.',
    },
    neighborhoods: [
      { name: 'Eixample', desc: 'Quadras planas e elegantes, com as casas de Gaudí e ótima localização central.' },
      { name: 'Gòtic e Born', desc: 'O casco antigo, de ruelas medievais, bares e museus — vibrante, mas movimentado à noite.' },
      { name: 'Gràcia', desc: 'Bairro de ar de vila, com praças e restaurantes locais e diárias mais amigáveis.' },
    ],
    savingTip:
      'Almoce no "menú del día": por € 12 a € 16 você come entrada, prato principal, sobremesa e bebida — a mesma refeição custaria o dobro à noite, à la carte.',
    watchOut:
      'Barcelona tem fama mundial de batedores de carteira. La Rambla, o metrô e a praia da Barceloneta são os pontos mais visados — use bolsa cruzada e nunca deixe o celular sobre a mesa.',
    faq: [
      {
        question: 'Preciso de visto para a Espanha?',
        answer:
          'Não. A Espanha está no Espaço Schengen, e brasileiros podem ficar até 90 dias a cada 180 sem visto, com passaporte válido por no mínimo 3 meses após o retorno.',
      },
      {
        question: 'Vale a pena visitar a Sagrada Família por dentro?',
        answer:
          'Vale — o interior, com as colunas em forma de árvore e os vitrais, é o ponto alto. Mas é preciso comprar o ingresso com data e horário online antes; no portão, costuma estar esgotado.',
      },
      {
        question: 'Qual a melhor época para Barcelona?',
        answer:
          'Maio, junho, setembro e outubro: calor suficiente para a praia, sem a lotação e os preços do auge do verão (julho e agosto).',
      },
    ],
  },

  amsterdam: {
    intro:
      'Amsterdã é feita para ser explorada devagar: canais que viram cartão-postal, museus de Van Gogh a Rembrandt, e uma cultura de bicicleta que organiza a cidade inteira. Compacta e plana, ela recompensa quem larga o táxi e pedala — ou simplesmente caminha pelas pontes.',
    bestTime: {
      summary:
        'De abril a maio, os campos de tulipas florescem e o clima melhora; o verão (junho a agosto) é animado, porém o mais caro e cheio. O inverno é frio e curto de luz, mas barato e aconchegante.',
      high: 'Abril (tulipas) e junho a agosto — alta procura e preços elevados.',
      low: 'Novembro a fevereiro — frio e dias curtos, com tarifas mais baixas.',
    },
    costContext:
      'A Holanda é cara em hospedagem, mas a cidade se anda inteira de bicicleta ou a pé, cortando gastos de transporte. Comer em mercados e padarias e usar o supermercado Albert Heijn segura bem o orçamento diário.',
    flight: {
      duration: 'Voo direto GRU → Amsterdã (Schiphol) em torno de 11h30 (KLM).',
      tip: 'Schiphol é um dos maiores hubs da Europa: muitas vezes vale chegar por Amsterdã e seguir de trem barato para outras cidades do continente.',
    },
    money: {
      currency: 'Euro (€).',
      tip: 'Cartão (de preferência por aproximação) é o meio dominante — vários lugares nem aceitam dinheiro. Pague em euro e recuse a conversão automática em reais.',
    },
    neighborhoods: [
      { name: 'Jordaan', desc: 'O bairro mais charmoso, de canais tranquilos, galerias e cafés — central e fotogênico.' },
      { name: 'Centrum / Canal Ring', desc: 'No meio de tudo, prático para andar a pé; também o mais caro e movimentado.' },
      { name: 'De Pijp', desc: 'Jovem e multicultural, com o mercado Albert Cuyp e diárias mais em conta.' },
    ],
    savingTip:
      'Alugue uma bicicleta: além de ser a forma mais autêntica de circular, sai muito mais barato que táxis e ainda dá acesso a cantos que o transporte público não alcança.',
    watchOut:
      'As ciclovias (vermelhas) são sagradas — andar nelas a pé rende buzinadas e quase atropelamentos. E "coffee shop" na Holanda não vende café: é onde se vende cannabis. Para um cafezinho, procure um "café" ou "koffiehuis".',
    faq: [
      {
        question: 'Preciso de visto para a Holanda?',
        answer:
          'Não. A Holanda (Países Baixos) integra o Espaço Schengen; brasileiros ficam até 90 dias a cada 180 sem visto, com passaporte válido por pelo menos 3 meses após o retorno.',
      },
      {
        question: 'Quantos dias bastam em Amsterdã?',
        answer:
          'De 3 a 4 dias cobrem com folga os principais museus e bairros. Como a cidade é um excelente hub, muita gente usa esses dias e estende a viagem para outras cidades europeias de trem.',
      },
      {
        question: 'Preciso alugar bicicleta para conhecer a cidade?',
        answer:
          'Não é obrigatório — o centro se faz a pé —, mas pedalar é a forma mais barata, rápida e típica de circular. Quem prefere evitar o trânsito de bikes pode usar bondes (trams) e barcos pelos canais.',
      },
    ],
  },

  londres: {
    intro:
      'Londres é cara, mas tem um trunfo imbatível: seus grandes museus são gratuitos. British Museum, Tate, National Gallery, Natural History — tudo de graça. Some isso a parques enormes, mercados de comida e uma rede de metrô que leva a qualquer canto, e a libra forte dói um pouco menos.',
    bestTime: {
      summary:
        'De maio a setembro estão os dias mais longos e quentes (relativamente). A primavera e o início do outono equilibram clima e preço; o inverno é frio e escuro, porém mais barato, com a cidade enfeitada no fim de ano.',
      high: 'Junho a agosto e a época de Natal — alta procura e preços elevados.',
      low: 'Janeiro a março e novembro — frio e cinza, com as menores tarifas.',
    },
    costContext:
      'A libra é a vilã do orçamento, mas Londres compensa com gratuidades: os museus nacionais não cobram entrada, há parques imensos (Hyde Park, Regent’s) e mercados como o Borough para comer bem sem sentar em restaurante caro.',
    flight: {
      duration: 'Voo direto GRU → Londres (Heathrow) em torno de 11h30 (British Airways e LATAM).',
      tip: 'Use cartão por aproximação (contactless) direto nas catracas do metrô e ônibus: a tarifa diária é automaticamente "capeada", então você nunca paga mais que o teto do dia.',
    },
    money: {
      currency: 'Libra esterlina (£) — não euro.',
      tip: 'Pagamento por aproximação é onipresente, inclusive no transporte. Pague em libra e recuse a conversão em reais. Praticamente não é preciso andar com dinheiro vivo.',
    },
    neighborhoods: [
      { name: 'Westminster / South Kensington', desc: 'Central e turístico, perto dos museus e dos cartões-postais; salgado no preço.' },
      { name: 'Shoreditch', desc: 'Descolado, com arte de rua, bares e gastronomia — vibrante e jovem.' },
      { name: 'King’s Cross / Camden', desc: 'Bem conectados por metrô e com melhor relação custo-benefício de hospedagem.' },
    ],
    savingTip:
      'Monte o roteiro em torno dos museus gratuitos e dos parques: é possível encher dias inteiros sem gastar com ingressos. Para comer, os mercados (Borough, Camden, Brick Lane) saem muito mais em conta que restaurantes.',
    watchOut:
      'Atenção redobrada ao atravessar a rua: o trânsito vem pela mão inversa (olhe para a direita primeiro). E cuidado com "resort fees" e taxas extras em hotéis — confira o valor final antes de fechar.',
    faq: [
      {
        question: 'Preciso de visto ou autorização para o Reino Unido?',
        answer:
          'Visto turístico não, mas desde 2025 brasileiros precisam da ETA (Electronic Travel Authorisation), uma autorização eletrônica paga e solicitada online antes da viagem. O Reino Unido não faz parte do Schengen, então é um processo à parte da Europa continental.',
      },
      {
        question: 'É verdade que os museus de Londres são de graça?',
        answer:
          'Sim. Os grandes museus nacionais — British Museum, National Gallery, Tate Modern, Natural History, Science Museum, entre outros — têm entrada gratuita à coleção permanente. Exposições temporárias específicas podem ser pagas.',
      },
      {
        question: 'Como funciona o transporte público e o pagamento?',
        answer:
          'Basta encostar o cartão por aproximação (ou o celular) nas catracas do metrô e ônibus — não precisa comprar bilhete. O sistema soma suas viagens do dia e aplica um teto diário, então você nunca paga acima desse limite.',
      },
    ],
  },

  praga: {
    intro:
      'Praga entrega a Europa de conto de fadas — castelo, ponte medieval, torres góticas — por uma fração do preço de Paris ou Londres. Como a República Tcheca não adotou o euro, o poder de compra do viajante aumenta: a cerveja local chega a custar menos que a água.',
    bestTime: {
      summary:
        'Primavera (abril a junho) e outono (setembro e outubro) têm clima ameno e a cidade menos cheia. O verão é alto e movimentado; o inverno é gelado, mas os mercados de Natal compensam o frio.',
      high: 'Junho a agosto e o Natal — alta procura e preços (relativamente) elevados.',
      low: 'Janeiro a março — muito frio, com as melhores tarifas.',
    },
    costContext:
      'Praga é das capitais europeias de melhor custo-benefício. Refeições fartas e cerveja saem baratas, o transporte público integrado é quase simbólico no preço e caminhar pelo centro histórico — o maior atrativo — não custa nada.',
    flight: {
      duration: 'Não há voo direto: de GRU à Praga são cerca de 15 a 17 horas no total, com uma conexão (geralmente Lisboa, Madri, Frankfurt ou Paris).',
      tip: 'Como você vai conectar na Europa de qualquer forma, vale comparar emendar Praga a outra cidade do roteiro em vez de tratá-la como destino isolado.',
    },
    money: {
      currency: 'Coroa tcheca (CZK, "Kč") — a Tchéquia NÃO usa euro.',
      tip: 'Pague no cartão em coroas e evite trocar dinheiro nas casas de câmbio do centro, que anunciam "0% de comissão" mas embutem um spread péssimo. Saques em caixas eletrônicos confiáveis dão melhor taxa.',
    },
    neighborhoods: [
      { name: 'Staré Město (Cidade Velha)', desc: 'Onde está o relógio astronômico e a praça principal — central, lindo e o mais caro.' },
      { name: 'Malá Strana', desc: 'Aos pés do castelo, do outro lado da Ponte Carlos; histórico e fotogênico.' },
      { name: 'Vinohrady', desc: 'Bairro residencial elegante, com cafés e parques, diárias melhores e a poucos minutos de metrô do centro.' },
    ],
    savingTip:
      'Aproveite o "menu de almoço" (polední menu) que os restaurantes oferecem em dias de semana: um prato do dia com preço bem menor que o cardápio normal. E ande de transporte público — um bilhete cobre todo o centro por muito pouco.',
    watchOut:
      'Dois golpes clássicos: táxis que enrolam o trajeto de turistas (prefira aplicativos como Bolt/Uber) e casas de câmbio com taxas abusivas. Troque o mínimo possível em dinheiro e priorize o cartão.',
    faq: [
      {
        question: 'Preciso de visto para a República Tcheca?',
        answer:
          'Não. A Tchéquia integra o Espaço Schengen; brasileiros ficam até 90 dias a cada 180 sem visto, com passaporte válido por pelo menos 3 meses após o retorno.',
      },
      {
        question: 'Posso pagar em euro em Praga?',
        answer:
          'Alguns pontos turísticos aceitam euro, mas com câmbio desfavorável. A moeda oficial é a coroa tcheca (CZK); o ideal é pagar no cartão em coroas ou sacar a moeda local em caixas eletrônicos confiáveis.',
      },
      {
        question: 'Praga é um destino barato?',
        answer:
          'Para os padrões europeus, sim. Comida, bebida e transporte custam bem menos que na Europa Ocidental, e o principal atrativo — o centro histórico — se explora a pé, de graça.',
      },
    ],
  },

  miami: {
    intro:
      'Miami é o destino brasileiro por excelência: praia, outlets, gastronomia latina e voo direto relativamente curto. A cidade funciona como mistura de balneário e shopping a céu aberto — e quem planeja bem as compras e os passeios consegue equilibrar o gasto forte em dólar.',
    bestTime: {
      summary:
        'De novembro a abril o clima é seco e ameno — a melhor época, que coincide com a fuga do inverno americano. De junho a outubro vêm o calor úmido, as pancadas de chuva e a temporada de furacões.',
      high: 'Dezembro a março — pico de turismo e preços altos.',
      low: 'Maio a setembro — mais quente e abafado, com tarifas menores.',
      avoid: 'Setembro e outubro, auge da temporada de furacões no Caribe e na Flórida.',
    },
    costContext:
      'Hospedagem e restaurantes em dólar pesam, mas as praias públicas (incluindo South Beach) são gratuitas, os outlets oferecem descontos reais e supermercados como o Publix permitem montar refeições baratas em quartos com cozinha.',
    flight: {
      duration: 'Voo direto GRU → Miami em torno de 8h30 (LATAM e American).',
      tip: 'Carro alugado costuma valer a pena para circular entre praias, outlets e atrações — mas cheque as regras de pedágio (SunPass) e o seguro antes de pegar o veículo.',
    },
    money: {
      currency: 'Dólar americano (US$).',
      tip: 'Use cartão internacional ou conta global e pague em dólar. Reserve algum dinheiro para gorjetas, que nos EUA são praticamente obrigatórias (18% a 20% em restaurantes).',
    },
    neighborhoods: [
      { name: 'South Beach', desc: 'A praia mais famosa, com vida noturna e o art déco de Ocean Drive — animado e caro.' },
      { name: 'Brickell', desc: 'O centro financeiro moderno, com arranha-céus, bons restaurantes e ar urbano.' },
      { name: 'Downtown / Wynwood', desc: 'Wynwood reúne os murais de arte de rua; bom para hospedar com preço melhor que a praia.' },
    ],
    savingTip:
      'Antes de ir aos outlets (Sawgrass Mills, Dolphin Mall), cadastre-se no site/app de cada um para baixar cupons e o "VIP coupon book" — os descontos extras são reais e somam bastante.',
    watchOut:
      'O preço na etiqueta NÃO inclui imposto (sales tax), somado só no caixa, nem a gorjeta. Conte de 25% a 30% a mais sobre o valor anunciado ao orçar refeições e compras.',
    faq: [
      {
        question: 'Preciso de visto para ir a Miami?',
        answer:
          'Sim. Os Estados Unidos exigem visto de turista (B1/B2) para brasileiros, solicitado no consulado com agendamento que pode demorar meses. Planeje a obtenção do visto com bastante antecedência da viagem.',
      },
      {
        question: 'Qual a melhor época para ir a Miami?',
        answer:
          'De novembro a abril, quando o clima é seco e agradável. Evite setembro e outubro, auge da temporada de furacões, e saiba que dezembro a março é a alta estação, com os maiores preços.',
      },
      {
        question: 'Por que a conta vem sempre maior que o preço anunciado?',
        answer:
          'Porque nos EUA o imposto sobre vendas não está embutido na etiqueta — ele é somado no caixa — e a gorjeta (18% a 20%) é esperada em restaurantes. Sempre orce 25% a 30% acima do valor de vitrine.',
      },
    ],
  },

  'nova-york': {
    intro:
      'Nova York é cara, intensa e inesgotável — e ainda assim cabe em muitos orçamentos porque parte da experiência é simplesmente estar nas ruas. Times Square, o Brooklyn Bridge, o Central Park e a vista do Staten Island Ferry não custam nada; o desafio é escolher onde gastar o dólar.',
    bestTime: {
      summary:
        'Abril a junho e setembro a novembro têm o melhor clima. Dezembro encanta com a decoração de Natal (mas é frio e caro), enquanto o pico do verão é quente e úmido e o auge do inverno, congelante.',
      high: 'Dezembro (Natal) e o verão (julho/agosto) — alta procura e preços elevados.',
      low: 'Janeiro a março — muito frio, com as menores tarifas de hotel.',
    },
    costContext:
      'Manhattan é dos lugares mais caros do mundo em hospedagem, mas a cidade oferece muito de graça: o Central Park, a High Line, a balsa de Staten Island (que passa pela Estátua da Liberdade) e museus com entrada "pague quanto quiser" em certos horários.',
    flight: {
      duration: 'Voo direto GRU → Nova York (JFK ou Newark) em torno de 9h45 (LATAM, United, American).',
      tip: 'Hospedar-se no Brooklyn ou em Nova Jersey, perto de uma estação de metrô/trem, costuma sair bem mais barato que Manhattan, com poucos minutos de diferença até o centro.',
    },
    money: {
      currency: 'Dólar americano (US$).',
      tip: 'Cartão é aceito em quase tudo, inclusive no metrô (sistema OMNY, por aproximação). Pague em dólar e reserve troco para gorjetas, esperadas em restaurantes e táxis.',
    },
    neighborhoods: [
      { name: 'Midtown Manhattan', desc: 'No meio das atrações (Times Square, Central Park, museus); prático e o mais caro.' },
      { name: 'Williamsburg (Brooklyn)', desc: 'Descolado, com bares e vista de Manhattan, a poucas estações de metrô e mais em conta.' },
      { name: 'Upper West Side', desc: 'Residencial e tranquilo, ao lado do Central Park — boa base para famílias.' },
    ],
    savingTip:
      'Vários museus têm horários "pay what you wish" (você paga o quanto quiser) ou entrada gratuita em dias específicos. A balsa de Staten Island é de graça e passa pertinho da Estátua da Liberdade — o melhor passeio sem custo da cidade.',
    watchOut:
      'Como no resto dos EUA, o preço de etiqueta não inclui imposto nem gorjeta, e muitos hotéis cobram uma "destination/resort fee" diária à parte. Some tudo antes de fechar a hospedagem e ao orçar refeições.',
    faq: [
      {
        question: 'Preciso de visto para Nova York?',
        answer:
          'Sim, o mesmo visto de turista americano (B1/B2) exigido para qualquer parte dos EUA. O agendamento no consulado pode levar meses, então providencie com bastante antecedência.',
      },
      {
        question: 'Vale a pena ficar em Manhattan ou é melhor no Brooklyn?',
        answer:
          'Depende do orçamento. Manhattan é mais prático e mais caro; o Brooklyn (como Williamsburg) ou Nova Jersey, perto do metrô, reduzem bastante a diária com poucos minutos a mais de deslocamento.',
      },
      {
        question: 'Dá para aproveitar Nova York gastando pouco?',
        answer:
          'Sim. Boa parte das atrações icônicas é gratuita — Central Park, High Line, Brooklyn Bridge, a balsa de Staten Island — e há museus com entrada "pague quanto quiser". O peso maior fica na hospedagem.',
      },
    ],
  },

  orlando: {
    intro:
      'Orlando é a capital mundial dos parques temáticos: Walt Disney World, Universal e companhia transformam a cidade num destino de família por excelência. O segredo do orçamento aqui não é a hospedagem nem o voo — são os ingressos dos parques, que costumam ser o maior gasto da viagem.',
    bestTime: {
      summary:
        'Setembro a novembro e janeiro a março trazem clima ameno e parques menos lotados. O verão é quente, chuvoso e cheio (férias americanas); as épocas de feriado nos EUA lotam tudo e elevam os preços.',
      high: 'Junho a agosto e feriados americanos (Thanksgiving, Natal) — parques lotados e diárias altas.',
      low: 'Setembro, início de novembro e fim de janeiro/fevereiro — menos filas e melhores tarifas.',
    },
    costContext:
      'Voo e hotel em Orlando até são razoáveis; o que pesa são os ingressos — um dia de parque passa fácil de US$ 120 a US$ 170 por pessoa. Hospedar-se fora dos complexos, com cozinha, e comprar ingressos de vários dias dilui bastante o custo.',
    flight: {
      duration: 'Voo direto GRU → Orlando em torno de 8h30 (LATAM e Azul).',
      tip: 'Ingressos de múltiplos dias têm o preço diário muito menor que os de um dia avulso. Compre com antecedência e planeje quantos parques realmente vai visitar antes de fechar o pacote.',
    },
    money: {
      currency: 'Dólar americano (US$).',
      tip: 'Cartão internacional resolve tudo. Pague em dólar e separe troco para gorjetas. Carro alugado é praticamente indispensável para circular entre parques e outlets.',
    },
    neighborhoods: [
      { name: 'International Drive (I-Drive)', desc: 'Cheio de hotéis, restaurantes e outlets, ao lado da Universal — central e prático.' },
      { name: 'Lake Buena Vista', desc: 'Coladinho à Disney, ideal para quem vai focar nos parques dela.' },
      { name: 'Kissimmee', desc: 'Mais afastado, porém com casas e hotéis de melhor preço — bom para famílias com carro.' },
    ],
    savingTip:
      'Alugue uma casa ou um quarto com cozinha e faça compras em supermercados (Walmart, Publix): comer dentro dos parques é caríssimo, e preparar parte das refeições corta um gasto enorme em viagens de uma semana ou mais.',
    watchOut:
      'O erro clássico é subestimar o custo dos ingressos. Antes de comprar o pacote, some quantos dias de parque você realmente quer — essa conta costuma ser maior que a do voo e da hospedagem juntos.',
    faq: [
      {
        question: 'Preciso de visto para Orlando?',
        answer:
          'Sim, o visto de turista americano (B1/B2). Como o agendamento no consulado pode demorar meses, providencie com antecedência — especialmente em viagens de família, com vários vistos a obter.',
      },
      {
        question: 'Quantos dias preciso para os parques de Orlando?',
        answer:
          'Depende de quantos complexos você quer visitar. Só a Disney tem quatro parques; a Universal, dois ou três. Um roteiro confortável costuma ter de 7 a 10 dias, reservando ao menos um dia por parque mais descanso.',
      },
      {
        question: 'Qual o maior gasto de uma viagem a Orlando?',
        answer:
          'Os ingressos dos parques. Cada dia passa fácil de US$ 120 a US$ 170 por pessoa, e o total costuma superar voo e hospedagem somados. Comprar ingressos de múltiplos dias reduz bastante o custo diário.',
      },
    ],
  },

  cancun: {
    intro:
      'Cancún é o Caribe mexicano de mar azul-turquesa e resorts all-inclusive, mas é também a porta para cenotes, ruínas maias e a vibe mais econômica de Playa del Carmen e Tulum. Sem visto e com voo razoável, virou um dos destinos de praia internacional favoritos do brasileiro.',
    bestTime: {
      summary:
        'De dezembro a abril é a estação seca, com sol e mar calmo — a melhor época. De junho a novembro vêm o calor úmido, as chuvas e o risco de furacões; março traz o "spring break" americano, que lota a região.',
      high: 'Dezembro a abril (e o spring break em março) — alta procura e preços.',
      low: 'Maio, setembro e outubro — mais barato, com risco de chuva e furacão.',
      avoid: 'Setembro e outubro, auge da temporada de furacões no Caribe.',
    },
    costContext:
      'Dá para gastar muito (resort all-inclusive na Zona Hotelera) ou pouco (hotéis e comida no centro). Os cenotes públicos cobram entradas modestas, e comer onde o mexicano come — fora da faixa de hotéis — sai por uma fração do preço da orla.',
    flight: {
      duration: 'Voo direto GRU → Cancún em torno de 9 horas (sazonal); fora disso, com uma conexão (Cidade do Panamá ou Cidade do México).',
      tip: 'Compare o all-inclusive com a opção de hotel + refeições avulsas: para quem pretende sair, conhecer cenotes e ruínas, o pacote fechado pode não compensar.',
    },
    money: {
      currency: 'Peso mexicano (MXN). Muitos lugares na Zona Hotelera aceitam dólar, mas com câmbio ruim.',
      tip: 'Pague em pesos, sempre que possível, no cartão — aceitar a cobrança em dólar ou em reais embute um câmbio desfavorável. Tenha algum dinheiro para colectivos e barracas.',
    },
    neighborhoods: [
      { name: 'Zona Hotelera', desc: 'A faixa de praia com os resorts e a vida noturna; lindo e o mais caro.' },
      { name: 'Centro (Downtown)', desc: 'Onde mora o cancunense — comida e hospedagem bem mais baratas e autênticas.' },
      { name: 'Playa del Carmen', desc: 'A uma hora dali, mais charmosa e descolada, boa base para cenotes e Tulum.' },
    ],
    savingTip:
      'Coma no Centro, não na Zona Hotelera, e use os "colectivos" (vans compartilhadas) em vez de táxis para circular pela Riviera Maya — a economia em transporte e comida ao longo da viagem é enorme.',
    watchOut:
      'Pagar em dólar quase sempre dá câmbio pior que pagar em pesos. E, nos resorts all-inclusive, confira o que realmente está incluso: certos restaurantes, passeios e bebidas premium são cobrados à parte.',
    faq: [
      {
        question: 'Preciso de visto para Cancún?',
        answer:
          'Não. Brasileiros não precisam de visto para turismo no México por até 180 dias. Na chegada, é preciso preencher o formulário de imigração e comprovar hospedagem e meios de subsistência.',
      },
      {
        question: 'Vale a pena o resort all-inclusive em Cancún?',
        answer:
          'Depende do seu estilo. Para quem quer relaxar na praia e comer no hotel, pode valer. Para quem pretende explorar cenotes, ruínas maias e Playa del Carmen/Tulum, hospedar avulso costuma sair melhor — você não paga por refeições que não vai fazer.',
      },
      {
        question: 'Qual a melhor época para ir a Cancún?',
        answer:
          'De dezembro a abril, na estação seca, com sol e mar calmo. Evite setembro e outubro (temporada de furacões) e, se quiser fugir da multidão, evite também o spring break de março.',
      },
    ],
  },

  'buenos-aires': {
    intro:
      'Buenos Aires é a Europa da América do Sul a três horas de voo: avenidas largas, cafés centenários, livrarias monumentais, parrillas e tango. O câmbio costuma favorecer o brasileiro, o que faz da capital argentina um dos destinos internacionais com melhor custo-benefício a partir do Brasil.',
    bestTime: {
      summary:
        'Primavera (setembro a novembro) e outono (março a maio) têm o clima mais agradável. Como é hemisfério sul, as estações acompanham as do Brasil: o verão (dezembro a fevereiro) é quente e esvazia a cidade, e o inverno é frio, porém ameno.',
      high: 'Verão (dezembro a fevereiro) e julho (férias) — maior procura.',
      low: 'Outono e fim de inverno — clima bom e menos turistas.',
    },
    costContext:
      'Com o câmbio a favor, comer bem em Buenos Aires é acessível: uma parrilla de bairro serve carne excelente por um valor que surpreende o brasileiro. Muita cultura é gratuita — feiras de San Telmo e Recoleta, o Caminito, livrarias e parques.',
    flight: {
      duration: 'Voo direto GRU → Buenos Aires (Ezeiza ou Aeroparque) em cerca de 3 horas.',
      tip: 'É um dos voos internacionais mais curtos e baratos do Brasil — ótimo para viagens de bate-volta longo ou fim de semana estendido.',
    },
    money: {
      currency: 'Peso argentino (ARS).',
      tip: 'A economia argentina muda rápido; hoje pagar no cartão internacional costuma render uma taxa de câmbio competitiva (o chamado "dólar tarjeta/MEP"). Confirme a situação antes de viajar e evite trocar dinheiro com cambistas de rua ("arbolitos") por segurança.',
    },
    neighborhoods: [
      { name: 'Palermo', desc: 'O bairro mais descolado, de bares, restaurantes e lojas de design — ótimo para hospedar.' },
      { name: 'Recoleta', desc: 'Elegante e arborizado, com o famoso cemitério e museus; mais sofisticado.' },
      { name: 'San Telmo', desc: 'O coração histórico, de ruas de paralelepípedo, tango e a feira de domingo.' },
    ],
    savingTip:
      'Aproveite o câmbio favorável nas parrillas de bairro (fora das áreas mais turísticas) e a enorme oferta de cultura gratuita: feiras de rua, o Caminito, o Ateneo Grand Splendid e os parques de Palermo.',
    watchOut:
      'As regras de câmbio na Argentina vivem mudando. Não troque dinheiro na rua por questão de segurança e golpes de notas falsas; confirme antes da viagem qual a melhor forma de pagar — cartão, conta internacional ou dinheiro — porque isso muda de ano para ano.',
    faq: [
      {
        question: 'Preciso de visto ou passaporte para a Argentina?',
        answer:
          'Não precisa de visto, e brasileiros podem entrar apenas com o RG (carteira de identidade) em bom estado e dentro da validade, por ser um país do Mercosul. Ainda assim, muitos preferem levar o passaporte.',
      },
      {
        question: 'Qual a melhor forma de levar dinheiro para Buenos Aires?',
        answer:
          'Isso muda com frequência por causa da economia argentina. Em geral, pagar no cartão internacional tem rendido uma taxa competitiva nos últimos tempos, mas confirme a situação atual antes de viajar e evite os câmbios informais de rua.',
      },
      {
        question: 'Buenos Aires é um destino barato para brasileiros?',
        answer:
          'Costuma ser um dos melhores custo-benefício da América do Sul: voo curto e barato, câmbio que tende a favorecer o real e muita cultura gratuita. O maior prazer acessível é comer — as parrillas oferecem carne excelente a preços convidativos.',
      },
    ],
  },

  santiago: {
    intro:
      'Santiago é cosmopolita e organizada, encravada entre a Cordilheira dos Andes e o Pacífico. Funciona tanto como destino em si — bons restaurantes, vinhos, museus — quanto como base para esquiar no inverno, conhecer Valparaíso ou partir rumo à Patagônia e ao deserto do Atacama.',
    bestTime: {
      summary:
        'Primavera (setembro a novembro) e outono (março a maio) têm o clima mais equilibrado. Por ser hemisfério sul, o inverno (junho a agosto) é a temporada de esqui nos centros próximos, como Valle Nevado; o verão é quente e seco.',
      high: 'Inverno (esqui) e verão — conforme o objetivo da viagem.',
      low: 'Meia-estação (primavera/outono) — clima agradável e menos procura.',
      avoid: 'Dias de forte smog no auge do inverno, quando a poluição se concentra no vale.',
    },
    costContext:
      'O Chile é um dos países mais caros da América do Sul, mas ainda acessível para o brasileiro. Comer no Mercado Central ou na Vega, usar o metrô e fazer bate-voltas de ônibus (a Valparaíso, a vinícolas) segura bem o orçamento.',
    flight: {
      duration: 'Voo direto GRU → Santiago em cerca de 4 horas — atravessando os Andes.',
      tip: 'Procure assento do lado esquerdo na ida (e direito na volta) para ver a Cordilheira dos Andes do alto: é um dos pousos mais bonitos do continente.',
    },
    money: {
      currency: 'Peso chileno (CLP).',
      tip: 'Cartão é amplamente aceito. Pague em pesos e recuse a conversão em reais. Para o metrô e ônibus, vale carregar uma tarjeta Bip!, que integra todo o transporte público.',
    },
    neighborhoods: [
      { name: 'Providencia', desc: 'Central, seguro e bem servido de metrô — ótima base para o turista.' },
      { name: 'Las Condes', desc: 'Moderno e empresarial, com shoppings e o bairro de arranha-céus "Sanhattan".' },
      { name: 'Lastarria / Bellavista', desc: 'Boêmios e culturais, com museus, bares e a subida ao Cerro San Cristóbal.' },
    ],
    savingTip:
      'Coma no Mercado Central (peixes e frutos do mar) e faça bate-voltas de ônibus, baratos e confortáveis: Valparaíso e Viña del Mar ficam a cerca de 1h30, e várias vinícolas do Valle do Maipo estão pertinho.',
    watchOut:
      'A altitude da cidade (cerca de 520 m) não é problema, mas passeios na cordilheira sobem rápido e podem causar mal-estar em quem não está acostumado. No inverno, o smog se acumula no vale em alguns dias e piora a qualidade do ar.',
    faq: [
      {
        question: 'Preciso de visto ou passaporte para o Chile?',
        answer:
          'Não precisa de visto, e brasileiros podem entrar com o RG dentro da validade e em bom estado, por acordo do Mercosul. O passaporte também é aceito e preferido por muitos viajantes.',
      },
      {
        question: 'Dá para esquiar perto de Santiago?',
        answer:
          'Sim. Centros como Valle Nevado, Farellones e El Colorado ficam a cerca de uma a duas horas da cidade e funcionam no inverno (junho a setembro), o que torna Santiago um destino raro: capital com esqui a um bate-volta.',
      },
      {
        question: 'Santiago é cara?',
        answer:
          'É das capitais mais caras da América do Sul, mas continua acessível ao brasileiro. Comer em mercados, usar o metrô e fazer passeios de ônibus para Valparaíso e vinícolas ajuda a manter o orçamento sob controle.',
      },
    ],
  },

  'machu-picchu': {
    intro:
      'Cusco e Machu Picchu são uma viagem no tempo ao coração do Império Inca. A cidade colonial de Cusco, o Vale Sagrado e a cidadela de pedra encravada nos Andes formam um dos roteiros mais impressionantes do mundo — desde que você respeite a altitude e reserve os ingressos com antecedência.',
    bestTime: {
      summary:
        'A estação seca (maio a setembro) é a melhor para visitar: céu limpo e trilhas firmes, especialmente entre junho e agosto. A estação chuvosa (novembro a março) traz lama e neblina, e a Trilha Inca fecha em fevereiro para manutenção.',
      high: 'Junho a agosto — tempo firme, porém mais cheio e caro.',
      low: 'Novembro a março — chuvoso, com menos gente e preços menores.',
      avoid: 'Fevereiro, mês de mais chuva e em que a Trilha Inca clássica fica fechada.',
    },
    costContext:
      'A região é barata em comida e hospedagem, mas tem custos fixos que pesam: o ingresso de Machu Picchu (cerca de US$ 45 a US$ 60), o trem até Aguas Calientes e os passeios pelo Vale Sagrado. Os "menús turísticos" de almoço, fartos e baratos, ajudam no dia a dia.',
    flight: {
      duration: 'Não há voo direto a Cusco: o trajeto passa por Lima (cerca de 5h de GRU) e segue de avião a Cusco (mais 1h20).',
      tip: 'Reserve o ingresso de Machu Picchu e o trem com semanas de antecedência — as vagas são limitadas por horário e esgotam na alta temporada.',
    },
    money: {
      currency: 'Sol peruano (PEN).',
      tip: 'Tenha dinheiro vivo para feiras, táxis e cidades pequenas do Vale Sagrado, onde nem todo lugar aceita cartão. Pague em soles; o dólar é aceito em alguns pontos turísticos, mas com câmbio pior.',
    },
    neighborhoods: [
      { name: 'Centro Histórico de Cusco', desc: 'Ao redor da Plaza de Armas — tudo a pé, com a maior oferta de hotéis e restaurantes.' },
      { name: 'San Blas', desc: 'O bairro dos artistas, de ruelas de pedra e ateliês; charmoso, embora cheio de ladeiras.' },
      { name: 'Vale Sagrado (Ollantaytambo / Urubamba)', desc: 'Mais baixo que Cusco, ótimo para aclimatar e mais perto do trem a Machu Picchu.' },
    ],
    savingTip:
      'Se for visitar vários sítios arqueológicos (Sacsayhuamán, Pisac, Ollantaytambo, Moray), o Boleto Turístico do Cusco dá acesso conjunto e sai muito mais barato que pagar entrada avulsa em cada um.',
    watchOut:
      'O mal de altitude (soroche) é real — Cusco está a 3.400 m. Passe um ou dois dias se aclimatando (de preferência começando pelo Vale Sagrado, mais baixo) antes de qualquer trilha pesada, beba bastante água e vá com calma nas primeiras horas.',
    faq: [
      {
        question: 'Preciso de visto para o Peru?',
        answer:
          'Não. Brasileiros não precisam de visto para turismo no Peru e podem entrar com o RG válido (acordo do Mercosul) ou passaporte, por até 90 dias na maioria dos casos.',
      },
      {
        question: 'Como lidar com a altitude em Cusco e Machu Picchu?',
        answer:
          'Cusco fica a cerca de 3.400 m. Reserve um ou dois dias para aclimatar antes de trilhas, hidrate-se bastante, evite álcool e refeições pesadas nas primeiras horas e considere começar pelo Vale Sagrado, que é mais baixo. O chá de coca local ajuda muita gente.',
      },
      {
        question: 'Preciso comprar o ingresso de Machu Picchu antes?',
        answer:
          'Sim, e com antecedência. A cidadela trabalha com entrada por horário e número limitado de visitantes; na alta temporada (junho a agosto), os ingressos e os trens até Aguas Calientes esgotam com semanas de antecedência.',
      },
    ],
  },

  cartagena: {
    intro:
      'Cartagena das Índias é o Caribe colombiano em sua forma mais fotogênica: uma cidade murada de casarões coloridos, sacadas floridas e praças onde a noite nunca esfria. Some praias próximas, culinária caribenha e um custo-benefício excelente, e você tem um dos destinos mais charmosos da América do Sul.',
    bestTime: {
      summary:
        'A estação seca (dezembro a abril) é a melhor, com sol firme e menos umidade. O clima é quente o ano todo; entre maio e novembro chove mais, com picos em outubro.',
      high: 'Dezembro a abril e o fim de ano — alta procura e preços.',
      low: 'Maio a novembro — mais chuva e calor úmido, com tarifas menores.',
      avoid: 'Outubro, normalmente o mês mais chuvoso.',
    },
    costContext:
      'Cartagena tem ótimo custo-benefício. Comer fora da cidade murada — em Getsemaní ou no mercado de Bazurto — é barato e autêntico, as praias urbanas são gratuitas e caminhar pelas muralhas ao pôr do sol, o melhor programa, não custa nada.',
    flight: {
      duration: 'Geralmente com uma conexão (Bogotá ou Cidade do Panamá): cerca de 7 a 8 horas no total a partir de GRU.',
      tip: 'Como quase sempre há conexão em Bogotá, alguns viajantes aproveitam para emendar uns dias na capital colombiana antes ou depois de Cartagena.',
    },
    money: {
      currency: 'Peso colombiano (COP).',
      tip: 'Pague em pesos no cartão e tenha dinheiro para feiras, praias e táxis. O dólar circula em alguns pontos turísticos, mas com câmbio desfavorável.',
    },
    neighborhoods: [
      { name: 'Ciudad Amurallada (Centro Histórico)', desc: 'Dentro das muralhas, o coração colonial e fotogênico; lindo e o mais caro.' },
      { name: 'Getsemaní', desc: 'Coladinho ao centro, mais descolado e barato, com arte de rua e vida noturna.' },
      { name: 'Bocagrande', desc: 'A faixa moderna de arranha-céus e praia urbana, com ar de balneário.' },
    ],
    savingTip:
      'Coma onde o cartagenero come — Getsemaní e o caótico mercado de Bazurto — e pechinche sempre, dos táxis às lanchas para as Islas del Rosario. Regatear é parte da cultura local e os primeiros preços ao turista vêm inflados.',
    watchOut:
      'Vendedores ambulantes nas praias e no centro são insistentes, e muitos táxis não têm taxímetro: combine o valor antes de entrar. Para as Islas del Rosario, feche o passeio com operadores confiáveis, não com qualquer um na beira do cais.',
    faq: [
      {
        question: 'Preciso de visto para a Colômbia?',
        answer:
          'Não. Brasileiros não precisam de visto para turismo na Colômbia por até 90 dias. A entrada é feita com passaporte; tenha em mãos comprovante de hospedagem e da passagem de retorno.',
      },
      {
        question: 'Cartagena é um destino seguro e barato?',
        answer:
          'É um dos melhores custo-benefício do Caribe. As áreas turísticas (cidade murada, Getsemaní, Bocagrande) são tranquilas com os cuidados habituais de qualquer cidade grande. Comida e hospedagem fora da muralha saem bem em conta.',
      },
      {
        question: 'Qual a melhor época para ir a Cartagena?',
        answer:
          'A estação seca, de dezembro a abril, com sol firme. Faz calor o ano inteiro; entre maio e novembro chove mais, com pico em outubro, mas os preços caem nessa baixa temporada.',
      },
    ],
  },

  bali: {
    intro:
      'Bali condensa muitos mundos numa ilha só: praias de surfe, arrozais em terraços, templos sobre falésias e uma das culturas mais hospitaleiras do mundo. É um destino onde, curiosamente, o estilo mais econômico — comer em warungs locais, andar de scooter — costuma render a experiência mais autêntica.',
    bestTime: {
      summary:
        'A estação seca (abril a outubro) é a ideal, com destaque para maio a setembro: sol, menos umidade e mar bom para surfe. A estação chuvosa (novembro a março) é abafada e tem pancadas diárias, mas fica mais barata e verde.',
      high: 'Julho, agosto e o fim de ano — alta procura internacional e preços.',
      low: 'Novembro a março — chuvoso e úmido, com as melhores tarifas.',
    },
    costContext:
      'Bali é barata para o viajante que adota o ritmo local. Refeições em warungs custam poucos dólares, hospedagem tem opções para todos os bolsos e alugar uma scooter sai muito mais em conta que depender de carros com motorista.',
    flight: {
      duration: 'Viagem longa: de 26 a 32 horas no total a partir de GRU, com uma ou duas conexões (geralmente Oriente Médio ou Ásia).',
      tip: 'Por ser uma viagem longa e cara em tempo, vale ficar pelo menos 10 a 14 dias para compensar o deslocamento — e considerar emendar outro destino asiático na mesma viagem.',
    },
    money: {
      currency: 'Rupia indonésia (IDR).',
      tip: 'Tenha dinheiro vivo para warungs, mercados e o interior, onde nem tudo aceita cartão. Saque em caixas de bancos confiáveis e pague em rupias; cuidado com ATMs que cobram taxas altas.',
    },
    neighborhoods: [
      { name: 'Seminyak / Canggu', desc: 'Praia, surfe e a cena descolada de cafés e beach clubs — animado e mais turístico.' },
      { name: 'Ubud', desc: 'O coração cultural, entre arrozais, templos e ioga; tranquilo e cheio de charme.' },
      { name: 'Uluwatu', desc: 'Falésias, ondas fortes e pôr do sol espetacular — para surfistas e quem busca vistas.' },
    ],
    savingTip:
      'Coma nos warungs (restaurantes locais) e alugue uma scooter para circular: as duas coisas cortam drasticamente o gasto diário e ainda aproximam você da Bali real, longe dos resorts.',
    watchOut:
      'O trânsito é caótico e só dirija scooter se tiver experiência e habilitação adequada. Em Ubud e Uluwatu, macacos são espertos e roubam óculos, celulares e comida — não os alimente nem deixe objetos à mão.',
    faq: [
      {
        question: 'Preciso de visto para a Indonésia (Bali)?',
        answer:
          'Brasileiros recebem visto na chegada (Visa on Arrival), pago e válido por 30 dias, prorrogável uma vez. Há também a opção de e-VOA, solicitada online antes do embarque. O passaporte precisa ter pelo menos 6 meses de validade.',
      },
      {
        question: 'Quantos dias vale a pena ficar em Bali?',
        answer:
          'Pela distância (mais de um dia só de deslocamento), o ideal é ficar de 10 a 14 dias, ou mais. Isso permite combinar praia (Seminyak/Uluwatu), cultura (Ubud) e até ilhas vizinhas, como Nusa Penida e as Gili.',
      },
      {
        question: 'Bali é um destino caro?',
        answer:
          'A passagem é o maior custo. Já no destino, Bali é barata para quem vive como local: comida em warungs por poucos dólares, hospedagem variada e scooter de aluguel. O gasto sobe se você ficar só em resorts e restaurantes ocidentais.',
      },
    ],
  },

  toquio: {
    intro:
      'Tóquio é o futuro e a tradição lado a lado: arranha-céus de neon em Shibuya, templos silenciosos em Asakusa, trens pontuais ao segundo e a melhor comida de rua e de restaurante do mundo. É enorme, ordeira e surpreendentemente navegável — desde que você entenda o metrô.',
    bestTime: {
      summary:
        'Primavera (fim de março a abril, das cerejeiras) e outono (outubro a novembro, da folhagem) são as épocas mais bonitas e disputadas. O verão é quente e úmido com chuvas em junho/julho; o inverno é frio, seco e ensolarado.',
      high: 'Cerejeiras (fim de março/abril) e folhagem de outono (novembro) — alta procura e preços.',
      low: 'Janeiro a fevereiro e o início do verão — menos turistas.',
      avoid: 'Junho e início de julho (estação das chuvas) e o auge de agosto, abafado.',
    },
    costContext:
      'Tóquio é mais acessível do que se imagina para comer: tigelas de ramen, gyudon e refeições em konbini (lojas de conveniência) custam pouco e são ótimas. Templos costumam ser gratuitos; o que pesa é hospedagem e deslocamentos de trem entre cidades.',
    flight: {
      duration: 'Não há voo direto: de 24 a 28 horas no total a partir de GRU, com uma conexão (EUA, Oriente Médio ou Europa).',
      tip: 'O JR Pass só compensa se você for viajar entre cidades (Tóquio–Kyoto–Osaka, por exemplo). Para ficar só em Tóquio, use o cartão Suica/Pasmo no metrô — é mais barato.',
    },
    money: {
      currency: 'Iene japonês (¥, JPY).',
      tip: 'Apesar da tecnologia, o Japão ainda valoriza dinheiro vivo — leve ienes para templos, pequenos restaurantes e mercados. Cartões por aproximação e o Suica/Pasmo cobrem transporte e konbinis.',
    },
    neighborhoods: [
      { name: 'Shinjuku', desc: 'Central e conectadíssimo (maior estação do mundo), com hotéis para todos os bolsos.' },
      { name: 'Shibuya', desc: 'Jovem e elétrico, do famoso cruzamento; ótimo para vida noturna e compras.' },
      { name: 'Asakusa', desc: 'O lado tradicional, com o templo Senso-ji e diárias mais em conta.' },
    ],
    savingTip:
      'Coma em konbinis (7-Eleven, Lawson, FamilyMart) e em redes de ramen/gyudon: refeições deliciosas por muito pouco. E use o Suica/Pasmo no transporte urbano em vez do JR Pass, que só vale a pena se você for sair de Tóquio.',
    watchOut:
      'Fora das áreas turísticas, pouca gente fala inglês — baixe um app de tradução e mapas offline. E respeite a etiqueta local: não se come andando, fala-se baixo no trem e a gorjeta não é praticada (pode até ofender).',
    faq: [
      {
        question: 'Preciso de visto para o Japão?',
        answer:
          'Não. Brasileiros podem entrar no Japão sem visto para turismo por até 90 dias. O passaporte deve estar válido para o período da estadia; na imigração, podem ser pedidos comprovantes de hospedagem e da passagem de volta.',
      },
      {
        question: 'Vale a pena comprar o JR Pass?',
        answer:
          'Só se você for se deslocar entre cidades (por exemplo, Tóquio–Kyoto–Osaka) usando os trens-bala. Para quem fica apenas em Tóquio, sai mais barato usar o cartão Suica ou Pasmo no metrô e nos trens urbanos.',
      },
      {
        question: 'Preciso levar dinheiro vivo ao Japão?',
        answer:
          'Sim, é recomendável. Apesar de moderno, o Japão ainda usa muito dinheiro em templos, pequenos restaurantes e mercados. Os cartões por aproximação e o Suica/Pasmo funcionam bem no transporte e em lojas de conveniência.',
      },
    ],
  },

  dubai: {
    intro:
      'Dubai é o exagero feito destino: o prédio mais alto do mundo, ilhas artificiais, pista de esqui dentro do shopping e luxo em cada esquina. Mas há um lado acessível — praias públicas gratuitas, o metrô moderno e a Dubai antiga dos souks — para quem não quer só gastar.',
    bestTime: {
      summary:
        'De novembro a março o clima é ameno e perfeito para a praia e passeios ao ar livre — a alta temporada. De junho a setembro o calor é extremo (passa dos 40 °C) e a vida se concentra em ambientes climatizados.',
      high: 'Novembro a março — clima ideal, alta procura e preços elevados.',
      low: 'Junho a setembro — calor extremo, com as menores tarifas de hotel.',
      avoid: 'Julho e agosto, quando o calor torna desconfortável qualquer atividade ao ar livre.',
    },
    costContext:
      'Dá para gastar fortunas, mas também economizar: as praias públicas (como a JBR e a Kite Beach) são gratuitas, o metrô é barato e eficiente, e comer nos food courts ou na região de Deira sai por uma fração dos restaurantes de hotel.',
    flight: {
      duration: 'Voo direto GRU → Dubai em torno de 14h30 (Emirates).',
      tip: 'Dubai é um grande hub de conexões: muitas vezes vale usá-la como parada técnica a caminho da Ásia, ficando alguns dias antes de seguir viagem.',
    },
    money: {
      currency: 'Dirham dos Emirados (AED).',
      tip: 'Cartão é aceito em quase tudo. Pague em dirhams e recuse a conversão em reais. Tenha algum dinheiro para os souks (mercados), onde pechinchar é esperado.',
    },
    neighborhoods: [
      { name: 'Downtown Dubai', desc: 'Aos pés do Burj Khalifa e do Dubai Mall — central e premium.' },
      { name: 'Dubai Marina / JBR', desc: 'Moderno, à beira-mar, com praia, restaurantes e clima de balneário urbano.' },
      { name: 'Deira', desc: 'A Dubai antiga, dos souks de ouro e especiarias; autêntica e com hospedagem mais barata.' },
    ],
    savingTip:
      'Troque os passeios pagos caros por programas gratuitos: praias públicas, a fonte dançante do Dubai Mall, a travessia de "abra" (barquinho) por poucos centavos no Creek e os souks de Deira. O metrô substitui táxis com folga.',
    watchOut:
      'Dubai segue leis locais rígidas: álcool só é permitido em locais licenciados (hotéis e bares específicos), e há regras de comportamento e vestuário em público. Informe-se antes para não cometer gafes — e jamais subestime o calor do verão, que é perigoso.',
    faq: [
      {
        question: 'Preciso de visto para Dubai?',
        answer:
          'Não. Brasileiros recebem entrada sem visto nos Emirados Árabes Unidos por até 90 dias dentro de um período de 180 dias. O passaporte precisa ter pelo menos 6 meses de validade a partir da entrada.',
      },
      {
        question: 'Dá para conhecer Dubai gastando pouco?',
        answer:
          'Em parte, sim. Praias públicas, a fonte do Dubai Mall, os souks de Deira e o metrô moderno custam pouco ou nada. O que encarece são os passeios exclusivos (safári, observatórios, parques) e os restaurantes de luxo.',
      },
      {
        question: 'Qual a melhor época para ir a Dubai?',
        answer:
          'De novembro a março, quando o clima é ameno e agradável para praia e passeios. Evite o verão (junho a setembro), quando a temperatura passa dos 40 °C e quase tudo se faz em ambientes fechados.',
      },
    ],
  },

  bangkok: {
    intro:
      'Bangkok é intensa em todos os sentidos: templos dourados, mercados que não terminam, o trânsito caótico e uma das melhores comidas de rua do planeta — barata e deliciosa. É a porta de entrada da Tailândia e um dos destinos de melhor custo-benefício para quem cruza meio mundo até a Ásia.',
    bestTime: {
      summary:
        'A estação fresca e seca (novembro a fevereiro) é a melhor para visitar. De março a maio o calor é extremo, e de junho a outubro vêm as monções, com chuvas fortes — embora curtas e, em geral, no fim do dia.',
      high: 'Novembro a fevereiro — clima agradável, alta procura.',
      low: 'Março a outubro — calor e chuva, com as menores tarifas.',
      avoid: 'Abril (o mês mais quente, com o festival Songkran) e o auge das monções.',
    },
    costContext:
      'Bangkok é baratíssima para o viajante: pratos de street food saem por um ou dois dólares, o transporte sobre trilhos (BTS/MRT) é eficiente e em conta, e muitos templos cobram entradas modestas. Dá para comer e se divertir muito gastando pouco.',
    flight: {
      duration: 'Viagem longa: de 24 a 27 horas no total a partir de GRU, com uma conexão (Oriente Médio ou Europa).',
      tip: 'Como o deslocamento é grande, vale ficar pelo menos uma a duas semanas na Tailândia, usando Bangkok como base para emendar Chiang Mai (norte) ou as praias do sul (Phuket, Krabi).',
    },
    money: {
      currency: 'Baht tailandês (THB).',
      tip: 'Tenha dinheiro vivo para street food, mercados e táxis — muita coisa não aceita cartão. Pague em bahts e saque em caixas confiáveis; cuidado com as taxas altas de alguns ATMs para estrangeiros.',
    },
    neighborhoods: [
      { name: 'Sukhumvit', desc: 'Moderno, com shoppings, restaurantes e fácil acesso ao BTS (metrô elevado).' },
      { name: 'Riverside / Old City', desc: 'Perto dos grandes templos (Grand Palace, Wat Pho) e do rio Chao Phraya.' },
      { name: 'Khao San / Rambuttri', desc: 'A área mochileira, animada e barata, com vida noturna e hostels.' },
    ],
    savingTip:
      'Coma na rua e nos mercados — é onde está a melhor comida e o melhor preço — e circule de BTS, MRT e dos barcos públicos no rio, fugindo do trânsito. O Chatuchak (mercado de fim de semana) é um programa à parte, com tudo barato.',
    watchOut:
      'Cuidado com o golpe do "templo/atração fechada hoje": um desconhecido (às vezes em tuk-tuk) avisa que o ponto está fechado e se oferece para levar a "outro lugar imperdível" — quase sempre uma loja de gemas ou alfaiate que paga comissão. Confirme os horários por conta própria.',
    faq: [
      {
        question: 'Preciso de visto para a Tailândia?',
        answer:
          'Não para turismo de curta duração: brasileiros entram sem visto e podem ficar até 30 dias (prorrogáveis). O passaporte deve ter pelo menos 6 meses de validade, e podem ser pedidos comprovantes de hospedagem e da passagem de saída.',
      },
      {
        question: 'Bangkok é um destino barato?',
        answer:
          'Muito. A passagem é o maior custo; no destino, comida de rua, transporte sobre trilhos e hospedagem são baratíssimos. É possível comer excepcionalmente bem gastando poucos dólares por dia.',
      },
      {
        question: 'Qual a melhor época para ir a Bangkok?',
        answer:
          'A estação fresca e seca, de novembro a fevereiro. Evite abril (o mês mais quente, com o festival da água Songkran) e o auge das monções, embora as chuvas costumem ser fortes mas rápidas.',
      },
    ],
  },

  'fernando-de-noronha': {
    intro:
      'Fernando de Noronha é o paraíso brasileiro mais cobiçado: um arquipélago de águas cristalinas, golfinhos, mergulho de tirar o fôlego e praias que figuram entre as mais bonitas do mundo. É também um destino de logística e custo altos — preservação tem preço — que recompensa quem planeja com antecedência.',
    bestTime: {
      summary:
        'A estação seca (agosto a janeiro) tem mar calmo e visibilidade ideal para mergulho. De março a julho chove mais e a piscina natural fica menos translúcida, mas o surfe ganha ondas. A alta temporada concentra-se nas férias.',
      high: 'Dezembro a fevereiro e julho — férias, com lotação e preços nas máximas.',
      low: 'Março a junho — mais chuva e menos gente, com tarifas menores.',
    },
    costContext:
      'Noronha é caro: por ser uma ilha isolada e protegida, tudo é mais salgado — hospedagem, comida e passeios. Some-se a Taxa de Preservação Ambiental (TPA), cobrada por dia de permanência, e o ingresso do Parque Nacional Marinho, pagos à parte.',
    flight: {
      duration: 'Não há voo direto de GRU: conecta-se em Recife (cerca de 3h) ou Natal, de onde partem voos de pouco mais de 1h à ilha.',
      tip: 'As passagens à ilha são caras e os voos, limitados. Compre com bastante antecedência e já inclua no orçamento a TPA e o ingresso do parque marinho.',
    },
    money: {
      currency: 'Real (R$).',
      tip: 'Leve o que puder do continente (protetor solar, remédios, itens de higiene): tudo na ilha custa bem mais caro. Há caixas eletrônicos, mas é prudente não depender só deles.',
    },
    neighborhoods: [
      { name: 'Vila dos Remédios', desc: 'O centrinho histórico, com pousadas, restaurantes e a igreja — prático para se hospedar.' },
      { name: 'Floresta Nova / Floresta Velha', desc: 'Áreas residenciais com boa parte das pousadas, próximas ao centro.' },
      { name: 'Praias do "mar de dentro"', desc: 'Sueste, Boldró e Cacimba do Padre estão entre as mais procuradas para o dia a dia.' },
    ],
    savingTip:
      'Compre o ingresso do Parque Nacional Marinho online com antecedência (vale 10 dias) e leve do continente tudo o que conseguir. Refeições no centro e o aluguel de buggy compartilhado entre o grupo ajudam a diluir os custos altos da ilha.',
    watchOut:
      'Dois custos fixos surpreendem quem não planeja: a TPA (Taxa de Preservação Ambiental), cobrada por dia e que cresce a cada diária, e o ingresso do Parque Nacional Marinho, à parte. Juntos, podem passar de R$ 900 por pessoa numa estadia típica — inclua-os no orçamento desde o início.',
    faq: [
      {
        question: 'Preciso pagar alguma taxa para entrar em Fernando de Noronha?',
        answer:
          'Sim, duas. A Taxa de Preservação Ambiental (TPA) é cobrada por dia de permanência e aumenta conforme o número de diárias. Separadamente, há o ingresso do Parque Nacional Marinho, que dá acesso às principais praias e vale por alguns dias. Ambos entram no orçamento à parte da hospedagem.',
      },
      {
        question: 'Qual a melhor época para ir a Noronha?',
        answer:
          'A estação seca, de agosto a janeiro, tem mar calmo e a melhor visibilidade para mergulho e para a piscina natural. De março a julho chove mais, mas há menos gente e preços menores — e é a temporada de surfe.',
      },
      {
        question: 'Por que Fernando de Noronha é tão caro?',
        answer:
          'Por ser uma ilha isolada e uma área de preservação ambiental, com limite de visitantes. Quase tudo chega de barco ou avião, encarecendo comida, hospedagem e passeios, e há as taxas ambientais obrigatórias. Planejar e comprar com antecedência é o que mais economiza.',
      },
    ],
  },

  gramado: {
    intro:
      'Gramado é o destino de serra mais querido do Brasil: clima frio, arquitetura de inspiração europeia, chocolate caseiro, fondue e um Natal que vira espetáculo. Fica na Serra Gaúcha, coladinha a Canela, e é um daqueles lugares que se planeja e parcela com meses de antecedência.',
    bestTime: {
      summary:
        'O inverno (junho a agosto) é a alta estação clássica, com frio de verdade e clima de Europa. De novembro a janeiro acontece o Natal Luz, o maior evento da cidade. A primavera, das hortênsias, e o verão ameno também são ótimos e menos cheios.',
      high: 'Inverno (junho a agosto) e Natal Luz (novembro a janeiro) — lotação e preços nas máximas.',
      low: 'Março a maio e setembro — clima agradável, com menos gente e tarifas melhores.',
    },
    costContext:
      'Gramado tem opções para todos os bolsos, mas a alta temporada encarece tudo. Muitos dos melhores programas são baratos ou gratuitos — o Lago Negro, as ruas decoradas, as fábricas de chocolate com degustação — e a vizinha Canela costuma ter hospedagem mais em conta.',
    flight: {
      duration: 'Não há aeroporto em Gramado: voa-se a Porto Alegre (cerca de 1h50 de GRU) e segue-se de carro por cerca de 2 horas (130 km) até a serra.',
      tip: 'Considere também o aeroporto de Caxias do Sul, mais perto da serra. Alugar carro vale a pena para circular entre Gramado, Canela e o Vale dos Vinhedos.',
    },
    money: {
      currency: 'Real (R$).',
      tip: 'Destino nacional, sem câmbio nem IOF. Como muita gente parcela a viagem, vale usar as próprias calculadoras de planejamento do site para organizar as parcelas sem juros e o gasto do mês.',
    },
    neighborhoods: [
      { name: 'Centro de Gramado', desc: 'Perto da Rua Coberta e da Borges de Medeiros — tudo a pé, no coração do agito; o mais caro.' },
      { name: 'Bairro Planalto / arredores', desc: 'Pousadas e hotéis um pouco afastados do centro, com bom custo-benefício.' },
      { name: 'Canela', desc: 'A cidade vizinha (a 10 minutos), geralmente mais barata e com atrativos próprios, como a Catedral de Pedra.' },
    ],
    savingTip:
      'Hospede-se em Canela ou nos arredores e priorize as atrações gratuitas (Lago Negro, ruas e praças decoradas, degustações nas fábricas de chocolate). Fora da alta temporada, os mesmos passeios custam bem menos e sem multidão.',
    watchOut:
      'Na alta temporada (Natal Luz e inverno), Gramado lota e os preços de hospedagem disparam — reserve com meses de antecedência. Os shows do Natal Luz mais concorridos têm ingressos pagos que esgotam cedo; planeje com tempo.',
    faq: [
      {
        question: 'Qual a melhor época para ir a Gramado?',
        answer:
          'Depende do que você busca. O inverno (junho a agosto) tem o frio e o clima europeu mais marcantes; de novembro a janeiro acontece o Natal Luz. Para fugir da multidão e dos preços altos, a primavera e o outono são excelentes e mais tranquilos.',
      },
      {
        question: 'Como se chega a Gramado?',
        answer:
          'Pelo aeroporto de Porto Alegre (cerca de 1h50 de São Paulo) e mais cerca de 2 horas de carro até a serra; ou pelo aeroporto de Caxias do Sul, mais próximo. Ter um carro facilita muito circular entre Gramado, Canela e a região.',
      },
      {
        question: 'Dá para conhecer Gramado gastando pouco?',
        answer:
          'Dá. Muitos dos melhores programas — o Lago Negro, as ruas decoradas, as degustações de chocolate — são baratos ou gratuitos. Hospedar-se em Canela ou fora da alta temporada reduz bastante o custo da viagem.',
      },
    ],
  },

  curitiba: {
    intro:
      'Curitiba é a capital verde do Brasil: parques impecáveis, o Jardim Botânico de estufa icônica, a Ópera de Arame e um dos sistemas de transporte mais elogiados do país. De clima ameno e ar europeu, é um destino de fim de semana barato e civilizado, fácil de percorrer.',
    bestTime: {
      summary:
        'A primavera (setembro a novembro) enche a cidade de flores e tem clima agradável; o outono é igualmente ameno. O inverno é frio para os padrões brasileiros, e o verão é a estação mais quente, porém raramente abafada.',
      high: 'Férias e feriados prolongados — maior procura.',
      low: 'Meio de semana e fora de feriados — tarifas menores e atrações vazias.',
    },
    costContext:
      'Curitiba é um destino econômico: a maioria dos parques é gratuita, o transporte público é eficiente e a cena gastronômica do Batel e de Santa Felicidade atende de bares baratos a restaurantes refinados. Dá para fazer um ótimo fim de semana gastando pouco.',
    flight: {
      duration: 'Voo direto GRU → Curitiba em cerca de 1h05 — uma das pontes aéreas mais rápidas do país.',
      tip: 'Por ser pertinho de São Paulo, é um destino ideal para fim de semana prolongado, com passagens que costumam ser baratas se compradas com antecedência.',
    },
    money: {
      currency: 'Real (R$).',
      tip: 'Destino nacional, sem câmbio nem IOF. O transporte público integrado é barato e cobre os principais pontos turísticos da cidade.',
    },
    neighborhoods: [
      { name: 'Centro / Centro Cívico', desc: 'Perto dos prédios históricos e de vários parques; prático e bem servido de ônibus.' },
      { name: 'Batel', desc: 'O bairro da gastronomia e da vida noturna, com bons restaurantes e bares.' },
      { name: 'Água Verde / Rebouças', desc: 'Residenciais e centrais, com boa relação custo-benefício de hospedagem.' },
    ],
    savingTip:
      'Use a Linha Turismo (ônibus especial que para nos principais pontos turísticos com bilhete que permite reembarques) e aproveite que quase todos os parques — Jardim Botânico, Tanguá, Barigui, Ópera de Arame — têm entrada gratuita.',
    watchOut:
      'O clima curitibano é famoso por mudar rápido — pode-se ter "quatro estações num dia". Mesmo no verão, leve um agasalho e um guarda-chuva; a temperatura cai bastante à noite e as pancadas de chuva chegam de surpresa.',
    faq: [
      {
        question: 'Quantos dias bastam para conhecer Curitiba?',
        answer:
          'De 2 a 4 dias dão conta dos principais pontos — Jardim Botânico, Ópera de Arame, Bosque do Papa, Santa Felicidade e os parques. Com mais tempo, dá para incluir o passeio de trem pela Serra do Mar até Morretes.',
      },
      {
        question: 'Vale a pena o passeio de trem da Serra do Mar?',
        answer:
          'Para muitos visitantes, é o ponto alto. O trem desce de Curitiba a Morretes por uma das ferrovias mais bonitas do Brasil, atravessando a Mata Atlântica. Reserve com antecedência e escolha o lado esquerdo na descida para as melhores vistas.',
      },
      {
        question: 'Curitiba é um destino barato?',
        answer:
          'Sim. A maioria dos parques é gratuita, o voo de São Paulo é curto e barato, e o transporte público cobre bem a cidade. É um dos destinos de fim de semana com melhor custo-benefício do Sul e Sudeste.',
      },
    ],
  },
}
