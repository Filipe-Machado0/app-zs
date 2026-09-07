import { Recipe, MealPlan, ShoppingList, ContentAsset, SupportArticle } from '../types';

export const LOCAL_RECIPES: Recipe[] = [
  {
    id: 'rec-01',
    title: 'Batatinhas Douradas em Palitinho Macio',
    summary: 'Batata assada com corte familiar e casquinha delicada, preservando o interior bem macio.',
    mealType: 'almoco',
    baseFood: 'Batata',
    prepTimeMinutes: 25,
    difficulty: 'muito_facil',
    textures: ['sequinho', 'macio'],
    colors: ['amarelo_dourado'],
    formats: ['palitinho'],
    tier: 'basic',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Batata cozida ou frita tradicional em tiras.',
    subtleVariation: 'Assar no forno com azeite suave e cortar em palitos ligeiramente mais finos ou com cantos arredondados.',
    ingredients: [
      { id: 'i1', name: 'Batata inglesa média', amount: '2', unit: 'unidades', category: 'hortifruti' },
      { id: 'i2', name: 'Azeite de oliva suave', amount: '1', unit: 'colher de sopa', category: 'temperos_basicos' },
      { id: 'i3', name: 'Pitadinha leve de sal', amount: '1', unit: 'pitada', category: 'temperos_basicos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Higienize e descasque as batatas. Corte em formato de palitinhos uniformes para assar por igual.' },
      { stepNumber: 2, instruction: 'Seque os palitos com um pano limpo ou papel toalha (o segredo para não ficarem grudentas).' },
      { stepNumber: 3, instruction: 'Regue com azeite, misture com as mãos e distribua em assadeira sem sobrepor.' },
      { stepNumber: 4, instruction: 'Asse em forno pré-aquecido a 200°C por 20 a 25 minutos até dourar levemente por fora.', tip: 'Deixe esfriar 3 minutinhos antes de servir para a textura firmar sem queimar a boquinha.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-02',
    title: 'Panquequinha Dourada de Banana e Aveia',
    summary: 'Massa leve com sabor naturalmente docinho e formato redondo pequeno, fácil de segurar.',
    mealType: 'cafe_da_manha',
    baseFood: 'Banana',
    prepTimeMinutes: 15,
    difficulty: 'muito_facil',
    textures: ['macio', 'aveludado'],
    colors: ['amarelo_dourado'],
    formats: ['redondinho'],
    tier: 'basic',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Banana amassada pura ou banana fatiada.',
    subtleVariation: 'Misturar com aveia fina e um ovo batido, preparando pequenos discos dourados na frigideira.',
    ingredients: [
      { id: 'i4', name: 'Banana madura (nanica ou prata)', amount: '1', unit: 'unidade', category: 'hortifruti' },
      { id: 'i5', name: 'Ovo', amount: '1', unit: 'unidade', category: 'laticinios_ovos' },
      { id: 'i6', name: 'Aveia em flocos finos', amount: '2', unit: 'colheres de sopa', category: 'graos_cereais', substitutions: ['Farinha de arroz', 'Farelo de aveia'] }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Em um prato fundo, amasse a banana muito bem até virar um purê homogêneo sem grumos grandes.' },
      { stepNumber: 2, instruction: 'Adicione o ovo e bata com um garfo até incorporar. Acrescente a aveia e misture suavemente.' },
      { stepNumber: 3, instruction: 'Aqueça uma frigideira antiaderente levemente untada. Pingue 2 colheres de massa para formar pequenos círculos (tamanho moeda grande).' },
      { stepNumber: 4, instruction: 'Quando surgirem pequenas bolhinhas na superfície, vire com cuidado e deixe dourar o outro lado por 1 minuto.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-03',
    title: 'Tiras de Franguinho Crocante no Forno',
    summary: 'Peito de frango cortado em formato amigável com crostinha fina de aveia e milho.',
    mealType: 'almoco',
    baseFood: 'Frango',
    prepTimeMinutes: 30,
    difficulty: 'facil',
    textures: ['crocante', 'sequinho'],
    colors: ['amarelo_dourado'],
    formats: ['palitinho'],
    tier: 'basic',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Nugget tradicional ou bife de frango grelhado fino.',
    subtleVariation: 'Empanar tiras frescas em farinha de milho fina ou aveia e assar no forno.',
    ingredients: [
      { id: 'i7', name: 'Filé de peito de frango', amount: '250', unit: 'g', category: 'carnes_proteinas' },
      { id: 'i8', name: 'Farinha de milho flocada fina ou fubá', amount: '4', unit: 'colheres de sopa', category: 'graos_cereais' },
      { id: 'i9', name: 'Azeite para untar', amount: '1', unit: 'colher de sopa', category: 'temperos_basicos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Corte o peito de frango em tirinhas finas e uniformes (tamanho de um dedo).' },
      { stepNumber: 2, instruction: 'Tempere com uma gotinha de azeite e uma pitada de sal.' },
      { stepNumber: 3, instruction: 'Passe cada tira na farinha de milho fina, pressionando levemente para aderir apenas uma camada uniforme e sequinha.' },
      { stepNumber: 4, instruction: 'Disponha em assadeira untada e leve ao forno a 190°C por cerca de 18 a 20 minutos até ficar firme e dourado.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-04',
    title: 'Muffin Macio de Queijo e Cenoura Raladinha',
    summary: 'Bolinho salgado aerado, textura uniforme de pãozinho caseiro sem pedaços evidentes.',
    mealType: 'lanche',
    baseFood: 'Pão / Queijo',
    prepTimeMinutes: 25,
    difficulty: 'facil',
    textures: ['macio'],
    colors: ['amarelo_dourado', 'laranja_calmo'],
    formats: ['redondinho'],
    tier: 'basic',
    imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Pão de queijo tradicional ou pão francês.',
    subtleVariation: 'Ralar a cenoura na parte mais fina do ralador para dissolver na massa do bolinho.',
    ingredients: [
      { id: 'i10', name: 'Ovo', amount: '2', unit: 'unidades', category: 'laticinios_ovos' },
      { id: 'i11', name: 'Cenoura média ralada fina', amount: '0.5', unit: 'unidade', category: 'hortifruti' },
      { id: 'i12', name: 'Queijo muçarela ou minas ralado', amount: '3', unit: 'colheres de sopa', category: 'laticinios_ovos' },
      { id: 'i13', name: 'Polvilho doce ou aveia', amount: '4', unit: 'colheres de sopa', category: 'graos_cereais' },
      { id: 'i14', name: 'Fermento em pó químico', amount: '1', unit: 'colher de café', category: 'outros' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Bata os ovos com garfo em uma tigela. Junte o queijo e a cenoura bem fininha.' },
      { stepNumber: 2, instruction: 'Acrescente o polvilho e mexa até virar massa pastosa. Por último coloque o fermento.' },
      { stepNumber: 3, instruction: 'Distribua em forminhas de silicone para muffin.' },
      { stepNumber: 4, instruction: 'Asse a 180°C por 18 minutos até crescer e ficar com topo dourado.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-05',
    title: 'Purê Aveludado de Mandioquinha Suave',
    summary: 'Textura cremosa extremamente aveludada com cor suave e acolhedora.',
    mealType: 'jantar',
    baseFood: 'Batata',
    prepTimeMinutes: 20,
    difficulty: 'muito_facil',
    textures: ['aveludado', 'cremoso'],
    colors: ['amarelo_dourado'],
    formats: ['amassadinho'],
    tier: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    isDemo: false,
    published: true,
    familiarStart: 'Purê de batata tradicional.',
    subtleVariation: 'Combinar mandioquinha e batata em proporções iguais batidas até ficarem 100% lisas.',
    ingredients: [
      { id: 'i15', name: 'Mandioquinha (batata baroa)', amount: '2', unit: 'unidades', category: 'hortifruti' },
      { id: 'i16', name: 'Batata inglesa média', amount: '1', unit: 'unidade', category: 'hortifruti' },
      { id: 'i17', name: 'Manteiga sem sal ou azeite', amount: '1', unit: 'colher de chá', category: 'laticinios_ovos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Cozinhe a mandioquinha e a batata sem casca em água até ficarem macias ao toque do garfo.' },
      { stepNumber: 2, instruction: 'Passe pelo espremedor ainda quentes e adicione a manteiga.' },
      { stepNumber: 3, instruction: 'Bata com uma colher vigorosamente para que não reste nenhum pedacinho sólido.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-06',
    title: 'Mini Hambúrguer Caseiro de Carne e Aveia',
    summary: 'Textura macia que não despedaça na boca, com formato compacto e fácil de pegar.',
    mealType: 'jantar',
    baseFood: 'Hambúrguer',
    prepTimeMinutes: 20,
    difficulty: 'facil',
    textures: ['macio', 'sequinho'],
    colors: ['amarelo_dourado'],
    formats: ['redondinho'],
    tier: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    isDemo: false,
    published: true,
    familiarStart: 'Hambúrguer industrializado ou carne moída.',
    subtleVariation: 'Carne moída fresca misturada com aveia em flocos finos para dar textura fofa e leve.',
    ingredients: [
      { id: 'i18', name: 'Patinho moído fresco', amount: '300', unit: 'g', category: 'carnes_proteinas' },
      { id: 'i19', name: 'Flocos finos de aveia', amount: '3', unit: 'colheres de sopa', category: 'graos_cereais' },
      { id: 'i20', name: 'Pitada suave de orégano seco', amount: '1', unit: 'pitada', category: 'temperos_basicos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Em uma tigela, misture a carne moída, a aveia e o orégano com as pontas dos dedos.' },
      { stepNumber: 2, instruction: 'Modele pequenos discos redondos (tamanho de mini hambúrguer).' },
      { stepNumber: 3, instruction: 'Grelhe em frigideira antiaderente com um pingo de azeite por 3 minutos de cada lado em fogo médio.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DEFAULT_MEAL_PLAN: MealPlan = {
  id: 'plan-default',
  userId: 'current-user',
  weekStartDate: new Date().toISOString().split('T')[0],
  days: {
    segunda: {
      breakfast: ['rec-02'],
      lunch: ['rec-01', 'rec-03'],
      snack: ['rec-04'],
      dinner: ['rec-05'],
      notes: 'Oferecer as batatinhas assadas sem cobrança ao lado do frango.',
    },
    terca: {
      breakfast: ['rec-02'],
      lunch: ['rec-03'],
      snack: ['rec-04'],
      dinner: ['rec-06'],
      notes: 'Mini hambúrguer caseiro com formato divertido.',
    },
    quarta: {
      breakfast: ['rec-02'],
      lunch: ['rec-01', 'rec-06'],
      snack: ['rec-04'],
      dinner: ['rec-05'],
      notes: '',
    },
    quinta: {
      breakfast: ['rec-02'],
      lunch: ['rec-03'],
      snack: ['rec-04'],
      dinner: ['rec-01'],
      notes: '',
    },
    sexta: {
      breakfast: ['rec-02'],
      lunch: ['rec-06'],
      snack: ['rec-04'],
      dinner: ['rec-05'],
      notes: 'Noite de lanche em família.',
    },
    sabado: {
      breakfast: ['rec-02'],
      lunch: ['rec-01', 'rec-03'],
      snack: ['rec-04'],
      dinner: ['rec-06'],
      notes: '',
    },
    domingo: {
      breakfast: ['rec-02'],
      lunch: ['rec-05', 'rec-06'],
      snack: ['rec-04'],
      dinner: ['rec-01'],
      notes: 'Planejar as compras da próxima semana.',
    },
  },
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_SHOPPING_LIST: ShoppingList = {
  userId: 'current-user',
  items: [
    { id: 's1', name: 'Batata inglesa média', category: 'hortifruti', amount: '6 unidades', checked: false, isCustom: false },
    { id: 's2', name: 'Banana prata madura', category: 'hortifruti', amount: '1 dúzia', checked: false, isCustom: false },
    { id: 's3', name: 'Cenoura média', category: 'hortifruti', amount: '3 unidades', checked: false, isCustom: false },
    { id: 's4', name: 'Filé de peito de frango', category: 'carnes_proteinas', amount: '500g', checked: true, isCustom: false },
    { id: 's5', name: 'Patinho moído fresco', category: 'carnes_proteinas', amount: '400g', checked: false, isCustom: false },
    { id: 's6', name: 'Ovos caipiras', category: 'laticinios_ovos', amount: '1 dúzia', checked: true, isCustom: false },
    { id: 's7', name: 'Queijo muçarela ralado', category: 'laticinios_ovos', amount: '200g', checked: false, isCustom: false },
    { id: 's8', name: 'Aveia em flocos finos', category: 'graos_cereais', amount: '1 pacote', checked: true, isCustom: false },
    { id: 's9', name: 'Farinha de milho flocada', category: 'graos_cereais', amount: '1 pacote', checked: false, isCustom: false },
    { id: 's10', name: 'Azeite de oliva extravirgem', category: 'temperos_basicos', amount: '1 garrafa', checked: true, isCustom: false }
  ],
  updatedAt: new Date().toISOString()
};

export const DEFAULT_SUPPORT_ARTICLES: SupportArticle[] = [
  {
    id: 'art-01',
    category: 'metodologia',
    title: 'O que são as Pontes de Aceitação Alimentar?',
    summary: 'Entenda como construir caminhos seguros a partir do que seu filho já come hoje.',
    content: 'A ponte de aceitação é uma estratégia baseada na associação gradual de estímulos sensoriais...',
    faqOrder: 1,
  },
  {
    id: 'art-02',
    category: 'rotina',
    title: 'Como lidar quando a criança diz "eca" sem experimentar?',
    summary: 'Frases e posturas práticas para neutralizar o estresse e a recusa imediata na mesa.',
    content: 'Evite confrontos diretos ou insistências repetidas. Responda de forma neutra e acolhedora...',
    faqOrder: 2,
  },
  {
    id: 'art-03',
    category: 'planos',
    title: 'Qual a diferença entre o Plano Básico e o Plano Premium?',
    summary: 'Veja os benefícios e recursos de cada modalidade do Cardápio Seletivo.',
    content: 'O Plano Básico inclui acesso às receitas essenciais. O Plano Premium libera o acervo completo...',
    faqOrder: 3,
  }
];

export const DEFAULT_MATERIALS: ContentAsset[] = [
  {
    id: 'asset-01',
    title: 'Guia Visual das Pontes de Aceitação (PDF)',
    description: 'Manual ilustrado passo a passo com o método de transição sensorial.',
    category: 'guia_pdf',
    tier: 'basic',
    downloadUrl: '#',
    fileSizeMb: 3.5,
    pagesCount: 42,
    published: true,
  },
  {
    id: 'asset-02',
    title: 'Planejador Semanal de Mesa e Rotina (Imprimível)',
    description: 'Template de alta resolução para colar na porta da geladeira e organizar o cardápio.',
    category: 'template_imprimivel',
    tier: 'basic',
    downloadUrl: '#',
    fileSizeMb: 1.8,
    pagesCount: 2,
    published: true,
  },
  {
    id: 'asset-03',
    title: 'E-book Completo: 200 Receitas de Pontes Alimentares',
    description: 'Coleção completa de receitas classificadas por textura, formato e tempo de preparo.',
    category: 'guia_pdf',
    tier: 'premium',
    downloadUrl: '#',
    fileSizeMb: 12.4,
    pagesCount: 215,
    published: true,
  }
];