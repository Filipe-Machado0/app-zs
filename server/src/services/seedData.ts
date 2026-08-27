import { Recipe, ContentAsset, SupportArticle } from '../types/index.js';

export const SEED_RECIPES: Recipe[] = [
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
    textures: ['macio', 'aveludado'],
    colors: ['amarelo_dourado', 'laranja_calmo'],
    formats: ['redondinho'],
    tier: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Pão de queijo ou pão francês com queijo derretido.',
    subtleVariation: 'Incorporar cenoura finamente ralada e batida na massa de polvilho e queijo antes de assar.',
    ingredients: [
      { id: 'i10', name: 'Polvilho doce', amount: '1', unit: 'xícara', category: 'graos_cereais' },
      { id: 'i11', name: 'Queijo minas padrão ou muçarela ralada', amount: '1/2', unit: 'xícara', category: 'laticinios_ovos' },
      { id: 'i12', name: 'Cenoura média ralada bem fina', amount: '1/4', unit: 'unidade', category: 'hortifruti' },
      { id: 'i13', name: 'Ovo', amount: '1', unit: 'unidade', category: 'laticinios_ovos' },
      { id: 'i14', name: 'Azeite', amount: '2', unit: 'colheres de sopa', category: 'temperos_basicos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'No liquidificador ou mixer, bata o ovo, o azeite e a cenoura até formar um líquido liso e alaranjado.' },
      { stepNumber: 2, instruction: 'Misture esse líquido em uma tigela com o polvilho e o queijo ralado até formar uma massa cremosa e homogênea.' },
      { stepNumber: 3, instruction: 'Distribua em forminhas de cupcake untadas ou de silicone.' },
      { stepNumber: 4, instruction: 'Asse a 180°C por 20 minutos até estufar e dourar a superfície.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-05',
    title: 'Arroz Amarelinho com Toque Suave de Cúrcuma',
    summary: 'O arroz branco do dia a dia com uma tonalidade dourada aconchegante e aroma bem sutil.',
    mealType: 'almoco',
    baseFood: 'Arroz',
    prepTimeMinutes: 20,
    difficulty: 'muito_facil',
    textures: ['macio', 'soltinho' as any],
    colors: ['amarelo_dourado'],
    formats: ['amassadinho'],
    tier: 'basic',
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Arroz branco tradicional soltinho.',
    subtleVariation: 'Adicionar uma pontinha de colher de cúrcuma na água do cozimento para criar cor dourada uniforme.',
    ingredients: [
      { id: 'i15', name: 'Arroz agulhinha', amount: '1', unit: 'xícara', category: 'graos_cereais' },
      { id: 'i16', name: 'Água fervente', amount: '2', unit: 'xícaras', category: 'outros' },
      { id: 'i17', name: 'Cúrcuma (açafrão-da-terra) em pó', amount: '1/4', unit: 'colher de café', category: 'temperos_basicos' },
      { id: 'i18', name: 'Azeite', amount: '1', unit: 'colher de sopa', category: 'temperos_basicos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Aqueça o azeite na panela em fogo baixo.' },
      { stepNumber: 2, instruction: 'Adicione o arroz e a cúrcuma, mexendo por 30 segundos para o grão absorver o tom dourado por igual.' },
      { stepNumber: 3, instruction: 'Despeje a água quente com cuidado, tampe parcialmente e cozinhe em fogo brando até secar.' },
      { stepNumber: 4, instruction: 'Desligue e mantenha a panela tampada por 5 minutos antes de soltar com o garfo.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-06',
    title: 'Chips Crocantes de Maçã com Canela Leve',
    summary: 'Fatias finíssimas desidratadas no forno, crocantes e naturalmente doces sem adição de açúcar.',
    mealType: 'lanche',
    baseFood: 'Maçã',
    prepTimeMinutes: 40,
    difficulty: 'facil',
    textures: ['crocante', 'sequinho'],
    colors: ['amarelo_dourado', 'vermelho_suave'],
    formats: ['redondinho'],
    tier: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Biscoitinho crocante ou maçã crua fatiada.',
    subtleVariation: 'Transformar a fruta fresca em formato fino tipo chips crocante assado lentamente.',
    ingredients: [
      { id: 'i19', name: 'Maçã fuji ou gala firme', amount: '2', unit: 'unidades', category: 'hortifruti' },
      { id: 'i20', name: 'Canela em pó (opcional)', amount: '1', unit: 'pitadinha', category: 'temperos_basicos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Lave as maçãs e fatie em lâminas bem finas com uma faca afiada ou mandolim.' },
      { stepNumber: 2, instruction: 'Retire as sementinhas centrais.' },
      { stepNumber: 3, instruction: 'Disponha as fatias em assadeira forrada com papel manteiga sem sobrepor.' },
      { stepNumber: 4, instruction: 'Leve ao forno baixo (150°C) por cerca de 35 a 40 minutos virando na metade do tempo até secar e ficar crocante ao esfriar.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-07',
    title: 'Creme de Mandioquinha Aveludado com Franguinho Desfiado',
    summary: 'Caldo quentinho de textura lisa e homogênea, perfeito para noites frias.',
    mealType: 'jantar',
    baseFood: 'Batata / Mandioquinha',
    prepTimeMinutes: 25,
    difficulty: 'muito_facil',
    textures: ['cremoso', 'aveludado', 'liso'],
    colors: ['amarelo_dourado'],
    formats: ['amassadinho'],
    tier: 'basic',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Purê de batata tradicional ou sopa batida.',
    subtleVariation: 'Apresentar a mandioquinha 100% batida e aveludada, permitindo o frango ao lado ou misturado.',
    ingredients: [
      { id: 'i21', name: 'Mandioquinha (batata-baroa)', amount: '3', unit: 'médias', category: 'hortifruti' },
      { id: 'i22', name: 'Peito de frango cozido e desfiado fino', amount: '1/2', unit: 'xícara', category: 'carnes_proteinas' },
      { id: 'i23', name: 'Azeite de oliva', amount: '1', unit: 'colher de sopa', category: 'temperos_basicos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Cozinhe a mandioquinha descascada até ficar extremamente macia ao toque do garfo.' },
      { stepNumber: 2, instruction: 'Bata com mixer ou liquidificador com um pouco da água do cozimento e o azeite até atingir textura cremosa sem pedaços.' },
      { stepNumber: 3, instruction: 'Sirva em uma tigelinha acolhedora morna, com o franguinho desfiado fino servido em ilha ou ao lado.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-08',
    title: 'Espetinho Suave de Pãozinho e Queijo em Cubos',
    summary: 'Cubinhos de pão levemente tostado com queijo macio em palitinho sem ponta.',
    mealType: 'lanche',
    baseFood: 'Pão',
    prepTimeMinutes: 10,
    difficulty: 'muito_facil',
    textures: ['macio', 'sequinho'],
    colors: ['neutro_claro', 'amarelo_dourado'],
    formats: ['cubinhos'],
    tier: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Sanduíche de queijo cortado tradicional.',
    subtleVariation: 'Mudar a geometria: cubinhos alternados em espetinho lúdico de ponta arredondada.',
    ingredients: [
      { id: 'i24', name: 'Pão de forma sem casca', amount: '2', unit: 'fatias', category: 'graos_cereais' },
      { id: 'i25', name: 'Queijo prato ou muçarela em pedaço', amount: '60', unit: 'g', category: 'laticinios_ovos' },
      { id: 'i26', name: 'Palitinhos de bambu sem ponta ou canudos de papel', amount: '3', unit: 'unidades', category: 'outros' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Corte as fatias de pão em cubos de aproximadamente 2x2 cm e toste levemente na frigideira seca para firmar.' },
      { stepNumber: 2, instruction: 'Corte o queijo no mesmo tamanho dos cubinhos de pão.' },
      { stepNumber: 3, instruction: 'Monte alternando pão e queijo no palito.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-09',
    title: 'Macarrão Gravatinha com Molho Cremoso Dourado',
    summary: 'Massa com formato divertido envolvida em creme de abóbora cabotiá suave e queijo.',
    mealType: 'almoco',
    baseFood: 'Macarrão',
    prepTimeMinutes: 20,
    difficulty: 'facil',
    textures: ['macio', 'cremoso'],
    colors: ['amarelo_dourado', 'laranja_calmo'],
    formats: ['estelar'],
    tier: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281146?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Macarrão na manteiga ou macarrão com queijo (mac and cheese).',
    subtleVariation: 'Manter a cor amarela e textura aveludada do molho de queijo, incorporando purê de abóbora batido.',
    ingredients: [
      { id: 'i27', name: 'Massa tipo gravatinha (farfalle)', amount: '150', unit: 'g', category: 'graos_cereais' },
      { id: 'i28', name: 'Abóbora cabotiá cozida', amount: '1/2', unit: 'xícara', category: 'hortifruti' },
      { id: 'i29', name: 'Requeijão cremoso ou creme de ricota', amount: '2', unit: 'colheres de sopa', category: 'laticinios_ovos' },
      { id: 'i30', name: 'Queijo parmesão ralado fino', amount: '1', unit: 'colher de sopa', category: 'laticinios_ovos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Cozinhe o macarrão em água fervente com uma pitadinha de sal até o ponto macio.' },
      { stepNumber: 2, instruction: 'No mixer, bata a abóbora cozida com o requeijão e 3 colheres da água do cozimento do macarrão até ficar 100% liso.' },
      { stepNumber: 3, instruction: 'Misture o molho aveludado na massa escorrida e finalize com parmesão suave.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-10',
    title: 'Hambúrguer Caseiro Suave em Minidisco',
    summary: 'Carne bovina macia e suculenta moldada em porções pequenas que cabem na mãozinha.',
    mealType: 'jantar',
    baseFood: 'Carne Moída',
    prepTimeMinutes: 20,
    difficulty: 'muito_facil',
    textures: ['macio', 'sequinho'],
    colors: ['neutro_claro'],
    formats: ['redondinho'],
    tier: 'basic',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Hambúrguer tradicional ou almôndega.',
    subtleVariation: 'Preparar minidiscos finos e bem macios com tempero muito sutil (apenas sal e azeite).',
    ingredients: [
      { id: 'i31', name: 'Carne moída magra (patinho)', amount: '250', unit: 'g', category: 'carnes_proteinas' },
      { id: 'i32', name: 'Farinha de aveia ou de rosca fina', amount: '1', unit: 'colher de sopa', category: 'graos_cereais' },
      { id: 'i33', name: 'Azeite', amount: '1', unit: 'fio', category: 'temperos_basicos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Em uma tigela, misture a carne moída, a farinha de aveia e a pitada de sal com as mãos até dar liga uniforme.' },
      { stepNumber: 2, instruction: 'Molde pequenos discos finos (cerca de 5 a 6 cm de diâmetro).' },
      { stepNumber: 3, instruction: 'Aqueça uma frigideira com um fio de azeite e doure os minidiscos por 3 a 4 minutos de cada lado em fogo médio.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-11',
    title: 'Picolé Cremoso de Iogurte com Manga Dourada',
    summary: 'Apenas fruta e iogurte natural batidos e congelados no formato preferido.',
    mealType: 'lanche',
    baseFood: 'Manga / Iogurte',
    prepTimeMinutes: 10,
    difficulty: 'muito_facil',
    textures: ['cremoso', 'liso'],
    colors: ['amarelo_dourado'],
    formats: ['palitinho'],
    tier: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Iogurte tradicional de potinho ou sorvete de palito.',
    subtleVariation: 'Congelar o iogurte batido com fruta doce e amarela em forminhas alegres de picolé.',
    ingredients: [
      { id: 'i34', name: 'Manga tommy ou palmer madura picada', amount: '1', unit: 'xícara', category: 'hortifruti' },
      { id: 'i35', name: 'Iogurte natural integral sem açúcar', amount: '1', unit: 'pote (170g)', category: 'laticinios_ovos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Bata no liquidificador a manga picada com o iogurte até ficar um creme amarelo espesso e sem pedaços.' },
      { stepNumber: 2, instruction: 'Despeje nas forminhas de picolé e insira os palitos.' },
      { stepNumber: 3, instruction: 'Leve ao congelador por pelo menos 4 horas antes de servir.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-12',
    title: 'Omeletinho Fino Dobrado em Triângulo Amarelo',
    summary: 'Textura macia, fina como um crepe, sem textura pegajosa de gema mole.',
    mealType: 'jantar',
    baseFood: 'Ovo',
    prepTimeMinutes: 10,
    difficulty: 'muito_facil',
    textures: ['macio', 'aveludado'],
    colors: ['amarelo_dourado'],
    formats: ['redondinho'],
    tier: 'basic',
    imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Ovo cozido ou ovo frito com queijo.',
    subtleVariation: 'Bater muito bem e fazer lâmina fina na frigideira dobrando em formato geométrico.',
    ingredients: [
      { id: 'i36', name: 'Ovos caipiras', amount: '2', unit: 'unidades', category: 'laticinios_ovos' },
      { id: 'i37', name: 'Água mineral ou leite', amount: '1', unit: 'colher de sopa', category: 'outros' },
      { id: 'i38', name: 'Manteiga ou azeite para untar', amount: '1/2', unit: 'colher de café', category: 'temperos_basicos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Bata os ovos com a água e uma pitada de sal com garfo até espumar levemente.' },
      { stepNumber: 2, instruction: 'Despeje em frigideira antiaderente morna e untada, espalhando para ficar fino.' },
      { stepNumber: 3, instruction: 'Cozinhe em fogo bem baixinho tampado por 2 minutos até firmar sem queimar a base.' },
      { stepNumber: 4, instruction: 'Dobre ao meio e depois em quatro formando um leque/triângulo macio.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-13',
    title: 'Torradinhas Estreladas com Pasta de Ricota Suave',
    summary: 'Pão de forma cortado com cortador de biscoito e levemente dourado no forno.',
    mealType: 'lanche',
    baseFood: 'Pão / Ricota',
    prepTimeMinutes: 15,
    difficulty: 'muito_facil',
    textures: ['crocante', 'cremoso'],
    colors: ['amarelo_dourado', 'neutro_claro'],
    formats: ['estelar'],
    tier: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1484723091739-004a8b75f7da?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Biscoito de água e sal ou torrada quadrada tradicional.',
    subtleVariation: 'Usar cortador lúdico de estrelinha no pão de forma antes de levar ao forno.',
    ingredients: [
      { id: 'i39', name: 'Pão de forma integral ou branco', amount: '4', unit: 'fatias', category: 'graos_cereais' },
      { id: 'i40', name: 'Ricota fresca amassada com azeite e sal', amount: '1/2', unit: 'xícara', category: 'laticinios_ovos' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Com cortador de biscoito, pressione o pão de forma para recortar formas de estrelas.' },
      { stepNumber: 2, instruction: 'Asse no forno a 180°C por 8 minutos até ficarem crocantes e clarinhas.' },
      { stepNumber: 3, instruction: 'Sirva com a pastinha de ricota cremosa em um potinho ao lado.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rec-14',
    title: 'Arroz Doce Cremoso Tradicional com Canela',
    summary: 'Sobremesa ou lanche acolhedor com textura macia e gostinho caseiro.',
    mealType: 'lanche',
    baseFood: 'Arroz',
    prepTimeMinutes: 30,
    difficulty: 'facil',
    textures: ['cremoso', 'macio'],
    colors: ['neutro_claro'],
    formats: ['amassadinho'],
    tier: 'basic',
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    published: true,
    familiarStart: 'Mingau de aveia ou arroz branco.',
    subtleVariation: 'Cozinhar o arroz com leite e toque suave de baunilha até virar uma consistência aveludada.',
    ingredients: [
      { id: 'i41', name: 'Arroz', amount: '1/2', unit: 'xícara', category: 'graos_cereais' },
      { id: 'i42', name: 'Leite integral', amount: '2', unit: 'xícaras', category: 'laticinios_ovos' },
      { id: 'i43', name: 'Açúcar demerara ou mel', amount: '2', unit: 'colheres de sopa', category: 'outros' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Cozinhe o arroz em 1 xícara de água até quase secar.' },
      { stepNumber: 2, instruction: 'Adicione o leite e o açúcar em fogo baixo mexendo sempre até encorpar.' },
      { stepNumber: 3, instruction: 'Sirva morno ou frio.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const SEED_ASSETS: ContentAsset[] = [
  {
    id: 'asset-ebook-01',
    title: 'E-book Cardápio Seletivo — Guia Completo',
    subtitle: 'Mais de 200 variações práticas a partir do conhecido',
    description: 'Acesso completo ao e-book em versão digital para leitura no navegador ou download em PDF para impressão.',
    requiredTier: 'basic',
    type: 'ebook',
    fileSize: '14.2 MB',
    format: 'PDF',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'asset-bonus-01',
    title: 'Bônus 1: Planejador Semanal Interativo',
    subtitle: 'Grade e templates para organizar as refeições da família',
    description: 'Guia visual e planilhas práticas para estruturar a rotina de compras e cardápio sem sobrecarga.',
    requiredTier: 'premium',
    type: 'planner',
    fileSize: '4.8 MB',
    format: 'PDF',
    coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'asset-bonus-02',
    title: 'Bônus 2: Guia Prático de Texturas e Apresentação Suave',
    subtitle: 'Como pequenas mudanças visuais facilitam a curiosidade',
    description: 'Passo a passo visual para transição de formatos (palitinhos, estrelas, lâminas finas) e cores.',
    requiredTier: 'premium',
    type: 'guide',
    fileSize: '6.1 MB',
    format: 'PDF',
    coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'asset-bonus-03',
    title: 'Bônus 3: 30 Ideias de Lanchinhos Acolhedores',
    subtitle: 'Ideias simples para a lancheira da escola e fins de semana',
    description: 'Combinações rápidas com alimentos seguros para levar a qualquer lugar sem estresse.',
    requiredTier: 'premium',
    type: 'bonus',
    fileSize: '5.5 MB',
    format: 'PDF',
    coverImage: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'asset-bonus-04',
    title: 'Bônus 4: Central de Dúvidas & Respostas Guiadas',
    subtitle: 'Artigos e respostas para as situações mais comuns do dia a dia',
    description: 'Orientação organizacional para lidar com dias difíceis, viagens e recusas sem transformar a mesa em batalha.',
    requiredTier: 'premium',
    type: 'bonus',
    fileSize: '3.9 MB',
    format: 'Digital Interativo',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80'
  }
];

export const SEED_SUPPORT_ARTICLES: SupportArticle[] = [
  {
    id: 'art-01',
    category: 'comecar_pelo_conhecido',
    title: 'O princípio da "Ponte Alimentar": mudando só um detalhe',
    summary: 'Como partir do alimento que já é aceito com segurança para propor pequenas variações confortáveis.',
    tags: ['começo', 'rotina', 'segurança'],
    content: `Quando uma criança aceita poucos alimentos, a melhor estratégia nunca é substituir tudo de uma vez. A abordagem da ponte alimentar propõe manter o alimento familiar na mesa e mudar apenas uma característica sutil por vez:\n\n1. O Formato: se ela gosta de batata em palito, experimente rodelas muito finas assadas com a mesma crocância.\n2. A Temperatura: servir o mesmo alimento um pouco mais morno ou em temperatura ambiente.\n3. O Acompanhamento: colocar um molhinho suave em um potinho separado ao lado, sem encostar no prato principal.\n\nLembre-se: o objetivo não é que a criança coma tudo no primeiro dia, mas que ela se sinta segura ao olhar e explorar sem pressão.`
  },
  {
    id: 'art-02',
    category: 'textura_apresentacao',
    title: 'Por que a textura importa tanto e como trabalhar suavemente',
    summary: 'Entenda a sensibilidade tátil e visual na alimentação infantil de 3 a 6 anos.',
    tags: ['textura', 'crocante', 'macio', 'sensorial'],
    content: `Crianças nessa faixa etária são muito atentas à previsibilidade do alimento. Um alimento crocante (como um biscoito ou batatinha) sempre quebra do mesmo jeito na boca, gerando sensação de controle e segurança. Alimentos com texturas misturadas (como arroz com pedacinhos de legumes ou molhos com grumos) podem gerar desconfiança sensorial.\n\nDica prática: Comece oferecendo variações com textura uniforme (100% lisas ou 100% crocantes e secas), mantendo os itens visualmente separados no prato.`
  },
  {
    id: 'art-03',
    category: 'rotina',
    title: 'Mesa tranquila: como tirar a pressão das refeições',
    summary: 'Frases que ajudam e atitudes que reduzem a tensão na hora de comer.',
    tags: ['ambiente', 'diálogo', 'estresse'],
    content: `A hora de comer deve ser um momento de convivência e acolhimento familiar.\n\nSubstituições de frases no dia a dia:\n- Em vez de: "Você tem que comer pelo menos 3 colheres"\n- Experimente: "Você pode colocar no seu prato o quanto quiser experimentar hoje."\n- Em vez de: "Se não comer não tem sobremesa"\n- Experimente: "Tudo bem se hoje você só quiser olhar ou cheirar o alimento novo."\n\nQuando a criança percebe que não há insistência forçada, a curiosidade natural tem mais espaço para surgir.`
  },
  {
    id: 'art-04',
    category: 'planejamento',
    title: 'Organizando o cardápio da semana sem culpa',
    summary: 'Como usar o planejador do Cardápio Seletivo para facilitar a sua vida, não para criar cobranças.',
    tags: ['planejador', 'compras', 'praticidade'],
    content: `O planejamento semanal não é uma obrigação rígida. Ele existe para que você não precise pensar no cardápio na correria do fim do dia.\n\nSe na terça-feira você planejou uma receita diferente e o dia foi cansativo, repita o prato seguro com tranquilidade. O Cardápio Seletivo foi feito para servir a sua família com leveza e praticidade.`
  },
  {
    id: 'art-05',
    category: 'quando_procurar_ajuda',
    title: 'Quando procurar avaliação com profissionais especializados',
    summary: 'Orientações claras sobre sinais que exigem acompanhamento com pediatra, fonoaudiólogo ou nutricionista.',
    tags: ['saude', 'orientacao', 'profissionais'],
    content: `O Cardápio Seletivo é uma ferramenta exclusivamente educativa e de organização culinária familiar. Ele NÃO substitui avaliação médica ou clínica.\n\nProcure sempre um profissional (Pediatra, Nutricionista Pediátrico, Fonoaudiólogo especialista em disfagia/motricidade orofacial ou Terapeuta Ocupacional em Integração Sensorial) se você observar:\n- Engasgos frequentes, tosse ou desconforto ao engolir;\n- Perda de peso, estagnação na curva de crescimento ou queixas de dor;\n- Aceitação de menos de 10 a 15 alimentos no total;\n- Ansiedade extrema, vômitos ou crises de choro apenas ao ver a comida;\n- Recusa completa de grupos alimentares inteiros que dure meses.\n\nO acompanhamento multidisciplinar humanizado é fundamental para o desenvolvimento saudável da criança.`
  }
];
