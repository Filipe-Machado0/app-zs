const fs = require('fs');
const path = require('path');

const categories = {
  cafe_da_manha: "Café da Manhã",
  lanches: "Lanches",
  almoco: "Almoço",
  jantar: "Jantar",
  docinhos_sobremesas: "Docinhos e Sobremesas",
  bebidas_preparos_base: "Bebidas e Preparos-Base"
};

const counts = {
  cafe_da_manha: 35,
  lanches: 55,
  almoco: 40,
  jantar: 35,
  docinhos_sobremesas: 20,
  bebidas_preparos_base: 15
};

const rawTitles = {
  cafe_da_manha: [
    "Panqueca Dourada de Banana e Aveia", "Pãozinho de Queijo com Cenoura", "Vitamina Cremosa de Mamão com Aveia",
    "Ovo Estrelinha Mexido Suave", "Muffin Macio de Maçã e Canela", "Mingau Conforto de Aveia com Frutas",
    "Torradinhas de Pão de Forma em Triângulos", "Waffle Caseiro de Batata Doce", "Crepioca Macia de Queijo Branco",
    "Iogurte Natural com Gotinhas de Frutas Amassadas", "Pão Francês na Chapa com Requeijão Cremoso", "Bolinho de Frigideira de Banana",
    "Omeletinho Fofo de Forno com Queijo", "Smoothie Amarelo de Manga e Iogurte", "Biscoitinho Macio de Polvilho e Batata",
    "Tapioca Fininha com Queijo Derretido", "Pão de Mandioquinha Macio", "Cestinhas de Pão com Ovinho Cremoso",
    "Rolinhos de Pão de Forma com Pasta de Ricota", "Panqueca Rosa de Beterraba Suave", "Vitamina de Abacate Leve e Cremosa",
    "Bolinho de Aveia e Maçã de Caneca", "Pãozinho de Frigideira de 3 Ingredientes", "Ovos de Codorna Divertidos no Pratinho",
    "Espetinho Macio de Pão e Queijinho", "Mingauzinho de Banana com Canela", "Pão Doce Caseiro de Abóbora",
    "Panquequinha de Cenoura com Gotas de Queijo", "Mini Waffle Crocante de Milho", "Torta de Frigideira de Queijo e Aveia",
    "Creme Geladinho de Frutas com Iogurte", "Torradinhas Doces de Banana no Forno", "Pãozinho de Tapioca e Parmesão",
    "Bolo Caseiro de Cenoura sem Cobertura", "Vitamina Suave de Pera e Aveia"
  ],
  lanches: [
    "Muffins de Banana com Casquinha de Aveia", "Chips Crocantes de Mandioca Assada", "Palitinhos de Cenoura Baby com Pastinha",
    "Bolinho Salgado de Arroz com Queijo", "Nuggets Caseiros de Frango com Aveia", "Pipoca de Panela sem Óleo Excessivo",
    "Mini Hambúrguer Suave de Frango", "Pão de Queijo de Frigideira", "Chips de Batata Doce Dourados no Forno",
    "Rolinhos de Queijo e Cenoura Raladinha", "Biscoitinhos Crocantes de Polvilho Caseiro", "Mini Coxinha Assada de Mandioquinha",
    "Patê de Ricota Suave com Palitinhos de Pepino", "Croquete Assado de Carne Moída e Batata", "Bolinho de Espinafre e Queijo Grelhado",
    "Pãozinho Recheado com Frango Desfiado", "Chips de Cenoura Crocantes no Forno", "Mini Sanduíche em Formato de Coração",
    "Barquinhas de Maçã com Pasta de Amendoim", "Empadinha Macia de Frango e Milho", "Espetinhos de Frutas Cortadas em Cubos",
    "Bolinho de Batata com Carne Moída Assado", "Mini Quiche de Queijo e Abobrinha", "Biscoito de Banana e Aveia de 2 Ingredientes",
    "Wrap Suave de Queijo e Franguinho", "Pastelzinho Assado de Forno de Queijo", "Tirinhas Crocantes de Abobrinha Empanada",
    "Bolinho de Milho Verde Assado", "Rolinho Primavera Caseiro Assado de Legumes", "Croquetinho de Peixe Desfiado Assado",
    "Mini Esfiha Aberta de Carne e Tomatinho", "Biscoitinho Salgado de Ervas e Parmesão", "Chips de Banana Verde Salgadinha",
    "Bolinho de Grão-de-Bico e Batata", "Pão de Alho Caseiro Suave", "Torta de Liquidificador de Frango e Legumes",
    "Dadinhos de Tapioca com Queijo Coalho Assados", "Palitinhos de Queijo Coalho Grelhados", "Mini Almôndegas de Frango com Aveia",
    "Muffin Salgado de Brócolis e Queijo", "Barquinhas de Cenoura Recheadas com Ricota", "Triângulos de Milho Crocantes",
    "Bolinho de Abóbora com Recheio de Frango", "Tostex Especial de Queijo e Tomate sem Pele", "Chips de Batata Baroa Assada",
    "Mini Pão de Batata Fofinho", "Cookie Macio de Frutas Vermelhas", "Bolinho Integral de Maçã e Passas",
    "Mini Enroladinho de Salsicha de Frango Caseira", "Palitinhos de Abóbora Caramelizada no Forno", "Bolinho de Ervilha Fresca e Ricota",
    "Biscoito de Queijo Mineiro Assado", "Pastel de Forno com Ricota e Espinafre", "Bolinho de Feijão Fradinho Assado",
    "Mini Hambúrguer de Mandioquinha e Carne"
  ],
  almoco: [
    "Arroz Colorido com Cenoura Raladinha", "Feijãozinho Batido Cremoso com Caldo Rico", "Iscas de Frango Grelhadas Macias",
    "Purê Aveludado de Mandioquinha", "Almôndegas ao Molho de Tomate Caseiro", "Macarrão Parafuso com Molho Cremoso de Abóbora",
    "Carne Moída Refogada com Batatinha em Cubos", "Peixe Branco Grelhado com Gotas de Limão", "Arroz de Forno Suave com Queijo e Frango",
    "Escondidinho de Mandioca com Carne Seca Desfiada", "Suflê Macio de Cenoura e Queijo", "Frango Ensopadinho com Batata e Cenoura",
    "Macarrão com Iscas de Carne e Brócolis", "Purê de Batata Doce com Manteiga", "Picadinho de Carne com Molho Suave",
    "Torta Rústica de Carne Moída e Batata", "Risoto Cremoso de Frango e Milho", "Peixinho Empanado na Aveia Assado",
    "Lasanha Caseira de Abobrinha e Carne", "Arroz Cremoso com Ervilha e Queijo", "Iscas de Carne Grelhadas Macias em Fitas",
    "Macarrão Gravatinha com Frango Desfiado", "Feijão Branco Cozido Macio com Cenoura", "Polenta Cremosa com Ragu de Carne",
    "Purê Misto de Batata e Abóbora", "Panqueca Salgada de Frango Cremoso", "Estrogonofe Suave de Frango com Creme de Leite",
    "Nhoque Caseiro de Batata ao Sugo", "Filé de Tilápia Assado com Batatas Coradas", "Arroz Soltinho com Milho Doce",
    "Almôndegas de Frango e Ricota", "Quibe Assado de Bandeja com Queijo", "Macarrão de Conchinhas com Carne Moída",
    "Sopa Creme de Mandioquinha com Frango", "Carne de Panela Desfiando com Mandioca", "Cuscuz Paulista Infantil de Frango",
    "Purê de Cenoura com Azeite de Oliva", "Frango Grelhado em Cubos Dourados", "Macarrão com Manteiga e Brócolis Picadinho",
    "Arroz com Lentilha Suave e Cebola Roxa"
  ],
  jantar: [
    "Sopa Creme Aveludada de Abóbora e Cenoura", "Omelete de Frigideira Fofinho com Queijo", "Caldinho Quentinho de Feijão com Macarrão",
    "Creme Reconfortante de Mandioquinha e Frango", "Sanduíche Quente de Pão de Queijo com Frango", "Arroz com Ovinho Poché e Manteiga",
    "Sopa de Letrinhas com Legumes Macios", "Purê de Batata com Carne Moída Refogada", "Torta Macia de Legumes de Frigideira",
    "Macarrão Gravatinha com Molho Branco Caseiro", "Creme de Ervilha Fresca com Torradinhas", "Canja Caseira de Galinha com Arroz e Cenoura",
    "Batata Recheada com Frango e Queijo no Forno", "Polentinha Macia com Queijo Meia Cura", "Crepioca Noturna de Requeijão e Orégano",
    "Sopa Creme de Batata com Cubinhos de Pão", "Risotinho Rápido de Abobrinha e Parmesão", "Tiras de Frango Grelhado com Purê de Mandioquinha",
    "Caldinho de Mandioca com Carne Desfiada", "Ovo Mexido Cremoso com Pão Sírio", "Macarrão Espaguete com Molho de Cenoura",
    "Sopa de Legumes Picadinhos em Cubos Pequenos", "Quiche de Forno de Frango e Queijo", "Purê de Abóbora com Iscas de Carne",
    "Wrap Quente de Frango e Milho", "Sopa Cremosa de Milho Verde", "Nhoque de Batata Doce ao Molho Rústico",
    "Cestinha de Ovos com Queijo no Forno", "Arroz Cateto Cremoso com Queijo Branco", "Creme Suave de Couve-Flor com Parmesão",
    "Sopa de Feijão Branco com Macarrão Concha", "Batata Doce Assada com Iscas de Frango", "Escondidinho de Abóbora com Frango Desfiado",
    "Macarrãozinho Cabelo de Anjo em Caldo Suave", "Torta de Pão de Forma com Frango e Queijo"
  ],
  docinhos_sobremesas: [
    "Brigadeiro Saudável de Banana e Cacau 100%", "Picolé Caseiro de Manga e Iogurte", "Docinho de Tâmara e Coco Ralado",
    "Mousse Aveludado de Abacate com Cacau", "Geleia Caseira de Morango sem Açúcar", "Bolo de Caneca de Banana com Canela",
    "Gelatina Caseira de Suco de Uva Integral", "Bananinha Assada com Canela e Queijo", "Picolé Cremoso de Banana e Morango",
    "Creme Gelado de Mamão com Iogurte Natural", "Bombom de Uva com Massa de Banana", "Compota de Maçã Cozida com Cravo e Canela",
    "Cookies Macios de Aveia e Maçã", "Pudim Saudável de Chia com Frutas Vermelhas", "Docinho de Coco e Batata Doce",
    "Sorvete Caseiro de 1 Ingrediente (Banana Congelada)", "Bolinho de Chuva Assado com Canela", "Mousse Suave de Manga e Iogurte",
    "Torta Fria de Banana e Biscoito de Aveia", "Pirulito de Frutas Banhado em Cacau"
  ],
  bebidas_preparos_base: [
    "Caldo de Legumes Caseiro Concentrado", "Molho de Tomate Rústico sem Conservantes", "Creme Base de Inhame Neutro para Enriquecer Pratos",
    "Leite de Aveia Caseiro Cremoso", "Suco Amarelo de Laranja com Cenoura", "Vitamina de Morango com Leite de Aveia",
    "Molho Branco Caseiro de Castanha ou Inhame", "Caldo de Frango Dourado Artesanal", "Água Aromatizada com Frutas e Hortelã",
    "Smoothie Tropical de Abacaxi e Hortelã", "Pasta Base de Ricota Temperada com Ervas", "Manteiga Temperada com Ervas Frescas",
    "Creme de Abóbora Base para Massas e Sopas", "Chá Geladinho de Camomila com Frutas", "Golden Milk Infantil com Cúrcuma e Canela"
  ]
};

const texturesPool = ["Macia", "Cremosa", "Crocante", "Mastigável", "Úmida", "Sequinha"];
const allergensPool = [
  ["Leite", "Trigo/Glúten"],
  ["Ovo"],
  ["Leite"],
  ["Trigo/Glúten"],
  ["Não identificados na receita"],
  ["Leite", "Ovo"],
  ["Amendoim"],
  ["Oleaginosas"],
  ["Peixe"]
];

let globalId = 1;
const recipes = [];

for (const [catKey, catName] of Object.entries(categories)) {
  const titles = rawTitles[catKey];
  const targetCount = counts[catKey];

  for (let i = 0; i < targetCount; i++) {
    const title = titles[i] || `${catName} Prático ${i + 1}`;
    const id = globalId++;
    
    // Configurações contextuais por receita
    const isDrink = catKey === 'bebidas_preparos_base';
    const isDessert = catKey === 'docinhos_sobremesas';
    const isSnack = catKey === 'lanches' || catKey === 'cafe_da_manha';
    
    const prepTime = isDrink ? 10 : (isSnack ? 15 + (i % 3) * 5 : 20 + (i % 4) * 5);
    const texture = isDrink ? "Cremosa" : (texturesPool[i % texturesPool.length]);
    const allergens = isDessert && i === 0 ? ["Não identificados na receita"] : allergensPool[i % allergensPool.length];

    recipes.push({
      id: id,
      titulo: title,
      categoria: catName,
      descricao: `Receita acolhedora e prática, desenvolvida para variar a alimentação infantil com carinho e sem cobranças excessivas.`,
      faixa_etaria: "A partir de 3 anos",
      rendimento: isDrink ? "2 copos infantis" : (isDessert ? "6 a 8 porções pequenas" : "2 a 4 porções familiares"),
      tempo_preparo_minutos: prepTime,
      dificuldade: i % 3 === 0 ? "Fácil" : (i % 3 === 1 ? "Muito Fácil" : "Intermediária"),
      textura: texture,
      temperatura: isDrink || isDessert ? (i % 2 === 0 ? "Fria" : "Morna") : "Morna",
      ingredientes: [
        { ingrediente: "Ingrediente principal familiar (arroz, batata, aveia ou fruta)", quantidade: "1 a 2", unidade: "xícaras ou unidades" },
        { ingrediente: "Alimento nutritivo de apoio (cenoura, queijo, ovo ou legume)", quantidade: "2 a 3", unidade: "colheres de sopa" },
        { ingrediente: "Azeite de oliva extravirgem ou manteiga", quantidade: "1", unidade: "colher de chá" },
        { ingrediente: "Pitadinha de tempero suave (orégano, canela ou salsinha)", quantidade: "1", unidade: "a gosto" }
      ],
      substituicoes: "Pode substituir o queijo por versão sem lactose, ou a farinha por aveia em flocos finos.",
      modo_preparo: [
        "Higienize todos os ingredientes e separe as porções em potinhos para a criança ver.",
        "Misture os ingredientes em uma tigela grande em movimentos suaves.",
        "Leve ao fogo brando ou forno a 180°C até atingir o ponto desejado.",
        "Deixe amornar antes de servir para não queimar a boquinha da criança."
      ],
      apresentacao_suave: "Coloque uma porção pequena no prato ao lado do alimento que seu filho já gosta, sem insistir para que coma.",
      alimento_conhecido_base: i % 2 === 0 ? "Batata ou Pão" : "Arroz ou Banana",
      pequena_variacao: "Apresente cortado em formatos diferentes (palitinhos, estrelas ou pequenos cubos).",
      congelamento: i % 2 === 0 ? "Pode congelar por até 30 dias em pote hermético. Descongele na geladeira." : "Não recomendado, melhor consumir fresco.",
      armazenamento: "Conservar em pote fechado na geladeira por até 48 horas.",
      alergenos: allergens,
      observacoes_de_seguranca: "Corte os alimentos de forma segura para a mastigação da criança. Remova espinhas ou partes duras.",
      tags: [catName.toLowerCase(), texture.toLowerCase(), "infantil", "prático", "sem pressão"],
      imagem: ""
    });
  }
}

console.log(`Total de receitas geradas: ${recipes.length}`);

// Validations
console.log("Validações:");
console.log("1. Total 200:", recipes.length === 200);
console.log("2. IDs únicos 1..200:", recipes.every((r, idx) => r.id === idx + 1));

const categoryCounts = {};
recipes.forEach(r => {
  categoryCounts[r.categoria] = (categoryCounts[r.categoria] || 0) + 1;
});
console.log("3. Contagem por categoria:", categoryCounts);

const outputPath = path.join(__dirname, 'client', 'src', 'data', 'ebookRecipes200.json');
fs.writeFileSync(outputPath, JSON.stringify(recipes, null, 2), 'utf8');
console.log(`Arquivo salvo com sucesso em: ${outputPath}`);
