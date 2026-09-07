import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Utensils,
  CalendarDays,
  ShoppingBag,
  BookOpen,
  ArrowRight,
  Star,
  Search,
  CheckCircle2,
  BookmarkCheck,
  ChefHat,
  Lightbulb,
  Clock,
  RotateCw,
  Flame,
  Layers,
  Heart,
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api/client';
import { Recipe } from '../../types';
import { RecipeCard } from '../../components/recipes/RecipeCard';

interface AcceptanceBridge {
  foodId: string;
  foodName: string;
  emoji: string;
  level1: {
    title: string;
    description: string;
    prepTime: string;
    texture: string;
    tip: string;
  };
  level2: {
    title: string;
    description: string;
    prepTime: string;
    association: string;
    tip: string;
  };
  level3: {
    title: string;
    description: string;
    prepTime: string;
    format: string;
    speechScript: string;
  };
}

const BRIDGES_DATA: Record<string, AcceptanceBridge> = {
  brocolis: {
    foodId: 'brocolis',
    foodName: 'Brócolis',
    emoji: '🥦',
    level1: {
      title: 'Nível 1: Camuflagem em Textura Conhecida (10 min)',
      description: 'Misturado finamente ralado ou processado em bolinho de arroz/queijo ou nugget caseiro.',
      prepTime: '10-12 min',
      texture: 'Textura homogênea e macia, sem pedaços crocantes aparentes.',
      tip: 'Processe apenas as copinhas verdes (sem os talos grossos) e misture na massa do bolinho de batata ou pão de queijo.'
    },
    level2: {
      title: 'Nível 2: Associação com Alimento Amigo (12 min)',
      description: 'Cremoso no macarrão com queijo favorito ou polvilhado com queijo parmesão crocante.',
      prepTime: '12-15 min',
      association: 'Servido junto com o molho branco ou queijo que ele já ama.',
      tip: 'Corte as arvorezinhas bem pequenas e doure na frigideira com uma pitadinha de manteiga e parmesão.'
    },
    level3: {
      title: 'Nível 3: Apresentação Divertida In Natura (5 min)',
      description: 'Mini arvorezinhas da floresta dos dinossauros para "plantar" no purê ou no arroz.',
      prepTime: '5 min',
      format: 'Cozido no vapor por 3 min (verde vivo) com pontinhas tostadinhas.',
      speechScript: '"Hoje nosso prato virou uma floresta encantada! Você pode ser o dinossauro gigante e morder uma mini árvore se quiser, ou só tocar nela com o garfinho."'
    }
  },
  cenoura: {
    foodId: 'cenoura',
    foodName: 'Cenoura',
    emoji: '🥕',
    level1: {
      title: 'Nível 1: Camuflagem em Textura Conhecida (12 min)',
      description: 'Ralada finíssima na massa de muffin de queijo ou dissolvida no molho de tomate caseiro.',
      prepTime: '12-15 min',
      texture: 'Textura uniforme e suave de pãozinho ou purê.',
      tip: 'Rale no ralador mais fino. Na massa assada ela desaparece completamente mantendo apenas a cor dourada acolhedora.'
    },
    level2: {
      title: 'Nível 2: Associação com Alimento Amigo (10 min)',
      description: 'Palitinhos finos assados no azeite com formato de "batata frita" servidos com molhinho que ele gosta.',
      prepTime: '15-20 min',
      association: 'Formato idêntico à batata palito que ele já reconhece.',
      tip: 'Corte do tamanho exato da batata frita e asse a 200°C com um fio de azeite até as pontinhas dourarem.'
    },
    level3: {
      title: 'Nível 3: Apresentação Divertida In Natura (5 min)',
      description: 'Fatias fininhas crocantes cortadas em formato de estrelinhas ou moedas do tesouro.',
      prepTime: '5 min',
      format: 'Lâminas quase transparentes como chips ou estrelinhas cortadas com forminha.',
      speechScript: '"Olha essas moedas do tesouro! Vamos ver quem consegue fazer o barulho de \'CROC\' mais alto sem engolir?"'
    }
  },
  frango: {
    foodId: 'frango',
    foodName: 'Frango',
    emoji: '🍗',
    level1: {
      title: 'Nível 1: Camuflagem em Textura Conhecida (15 min)',
      description: 'Processado bem lisinho e misturado com batata amassada em mini bolinhos dourados.',
      prepTime: '15 min',
      texture: 'Massa homogênea sem fios ou fibras que possam incomodar o dente.',
      tip: 'Triture o peito de frango cozido no processador até virar uma farinha úmida e junte ao purê de batata.'
    },
    level2: {
      title: 'Nível 2: Associação com Alimento Amigo (15 min)',
      description: 'Tirinhas empanadas em farinha de milho fina ou fubá, assadas bem crocantes como nugget.',
      prepTime: '15-18 min',
      association: 'Crostinha dourada e sequinha que lembra salgadinho familiar.',
      tip: 'Passe apenas no azeite e na farinha de milho fina. Fica super sequinho e com barulhinho crocante.'
    },
    level3: {
      title: 'Nível 3: Apresentação Divertida In Natura (10 min)',
      description: 'Espetinho divertido em palito sem ponta intercalado com batatinha ou queijo.',
      prepTime: '10 min',
      format: 'Cubinhos macios e dourados no espeto de madeira.',
      speechScript: '"Hoje tem espetinho de astronauta! O franguinho está dormindo na nave. Quer dar uma cheiradinha ou lamber a pontinha?"'
    }
  },
  tomate: {
    foodId: 'tomate',
    foodName: 'Tomate',
    emoji: '🍅',
    level1: {
      title: 'Nível 1: Camuflagem em Textura Conhecida (10 min)',
      description: 'Molho de tomate caseiro 100% batido e peneirado (sem sementes nem pedaços de pele).',
      prepTime: '10 min',
      texture: 'Textura totalmente lisa e aveludada.',
      tip: 'Bata no liquidificador e passe na peneira fina antes de colocar no macarrão que a criança já come.'
    },
    level2: {
      title: 'Nível 2: Associação com Alimento Amigo (8 min)',
      description: 'Fatias finíssimas de tomate cereja derretidas no meio do queijo quente / misto.',
      prepTime: '8 min',
      association: 'Camada fina no meio do pãozinho com queijo bem derretido.',
      tip: 'Corte quase transparente e grelhe junto na frigideira para que o queijo abrace o tomatinho.'
    },
    level3: {
      title: 'Nível 3: Apresentação Divertida In Natura (3 min)',
      description: 'Tomate cereja cortado em formato de coração ou "joaninha" para decorar o prato.',
      prepTime: '3 min',
      format: 'Tomatinho doce pequeno cortado ao meio em diagonal.',
      speechScript: '"Olha que joaninha vermelha fofa veio visitar o seu prato! Você pode segurar ela na mão e fazer voar até a sua boca."'
    }
  },
  ovo: {
    foodId: 'ovo',
    foodName: 'Ovo',
    emoji: '🥚',
    level1: {
      title: 'Nível 1: Camuflagem em Textura Conhecida (8 min)',
      description: 'Panquequinha de banana e ovo batido (massa doce e macia, sabor imperceptível de ovo).',
      prepTime: '8-10 min',
      texture: 'Massa aveludada e macia como bolo de frigideira.',
      tip: '1 banana bem madura amassada + 1 ovo batido + 2 colheres de aveia. Doure mini discos na frigideira.'
    },
    level2: {
      title: 'Nível 2: Associação com Alimento Amigo (10 min)',
      description: 'Omelete de queijo enroladinho cortado em rodelas ("rolinhos de sushi").',
      prepTime: '10 min',
      association: 'Recheado com queijo derretido em formato divertido.',
      tip: 'Bata os ovos com uma gotinha de leite ou creme para ficar bem fofinho e não ressecar.'
    },
    level3: {
      title: 'Nível 3: Apresentação Divertida In Natura (10 min)',
      description: 'Ovo cozido cortado com forminha em formato de estrelinha ou com olhinhos de gergelim.',
      prepTime: '10 min',
      format: 'Ovo cozido no ponto firme com gema clarinha cortado decorativamente.',
      speechScript: '"Esse ovinho tem um chapéu de mágico! Quer ver se ele cabe no seu garfinho?"'
    }
  },
  banana: {
    foodId: 'banana',
    foodName: 'Banana',
    emoji: '🍌',
    level1: {
      title: 'Nível 1: Camuflagem em Textura Conhecida (5 min)',
      description: 'Batida com leite vegetal ou integral bem gelado virando um "milkshake cremoso" sem pedaços.',
      prepTime: '5 min',
      texture: 'Líquido cremoso e docinho para tomar no canudinho.',
      tip: 'Bata com uma pitada de cacau em pó 50% ou canela para criar sabor de chocolate da tarde.'
    },
    level2: {
      title: 'Nível 2: Associação com Alimento Amigo (8 min)',
      description: 'Rodelinhas tostadas na frigideira com uma pontinha de manteiga e canela em cima da torradinha.',
      prepTime: '8 min',
      association: 'Servida em cima do pãozinho tostado crocante.',
      tip: 'Aqueça na frigideira antiaderente até caramelizar levemente a superfície sem desmanchar.'
    },
    level3: {
      title: 'Nível 3: Apresentação Divertida In Natura (3 min)',
      description: 'Banana em formato de golfinho ou pirulito espetada no palito com um toque de aveia.',
      prepTime: '3 min',
      format: 'Corte a pontinha da casca imitando a boquinha de um golfinho segurando uma uva.',
      speechScript: '"O golfinho da banana trouxe uma surpresa para você! Quer ajudar ele a nadar no seu pratinho?"'
    }
  }
};

const QUICK_CHIPS = [
  { id: 'brocolis', label: 'Brócolis', emoji: '🥦' },
  { id: 'cenoura', label: 'Cenoura', emoji: '🥕' },
  { id: 'frango', label: 'Frango', emoji: '🍗' },
  { id: 'tomate', label: 'Tomate', emoji: '🍅' },
  { id: 'ovo', label: 'Ovo', emoji: '🥚' },
  { id: 'banana', label: 'Banana', emoji: '🍌' }
];

const FOODS_GAMES = [
  {
    id: 'cenoura',
    name: 'Cenoura Mágica',
    emoji: '🥕',
    category: 'Legume dos Heróis',
    colorName: 'Laranja Solar',
    colorCode: '#FF7A00',
    curiosity: 'Coelhos e super-heróis adoram para ter visão de raio laser!',
    tipForMom: 'Corte em formato de estrelinhas ou palitinhos finos assados no azeite.'
  },
  {
    id: 'brocolis',
    name: 'Mini Árvore (Brócolis)',
    emoji: '🥦',
    category: 'Floresta Encantada',
    colorName: 'Verde Floresta',
    colorCode: '#2D6A4F',
    curiosity: 'São pequenas árvores da floresta mágica dos dinossauros!',
    tipForMom: 'Grelhe na frigideira com uma pitadinha de queijo ralado crocante.'
  },
  {
    id: 'banana',
    name: 'Banana Astronauta',
    emoji: '🍌',
    category: 'Fruta Espacial',
    colorName: 'Amarelo Estrela',
    colorCode: '#FFB703',
    curiosity: 'Vem com sua própria capinha espacial que a gente descasca!',
    tipForMom: 'Corte em rodelas e faça espetinhos divertidos com cacau em pó.'
  },
  {
    id: 'maca',
    name: 'Maçã Croc-Croc',
    emoji: '🍎',
    category: 'Fruta Encantada',
    colorName: 'Vermelho Rubi',
    colorCode: '#E63946',
    curiosity: 'Faz um barulho de "CROC" bem alto quando a gente morde!',
    tipForMom: 'Corte em lâminas fininhas quase transparentes como batata chips.'
  },
  {
    id: 'milho',
    name: 'Pérolas de Ouro (Milho)',
    emoji: '🌽',
    category: 'Grãos Dourados',
    colorName: 'Amarelo Ouro',
    colorCode: '#FB8500',
    curiosity: 'Pequenos grãos de ouro que dão super energia para brincar!',
    tipForMom: 'Deixe a criança segurar e debulhar a espiga cozida com as mãos.'
  }
];

const SENSORY_STEPS = [
  { id: 'eye', label: 'Olhos de Águia', desc: 'Examinar a cor e formato', icon: '👁️' },
  { id: 'hand', label: 'Toque de Mestre', desc: 'Tocar com o dedinho', icon: '🖐️' },
  { id: 'nose', label: 'Faro Fino', desc: 'Sentir o cheirinho mágico', icon: '👃' },
  { id: 'lip', label: 'Beijinho Amigo', desc: 'Dar um beijinho no alimento', icon: '💋' },
  { id: 'tongue', label: 'Mini Lambidinha', desc: 'Sentir na ponta da língua', icon: '👅' },
  { id: 'bite', label: 'Mordida do Leão', desc: 'Morder e ouvir o croc!', icon: '🦁' }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isBasic, role } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca e Ponte de Aceitação Imediata
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoodKey, setSelectedFoodKey] = useState<string>('brocolis');
  const [savedBridges, setSavedBridges] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('zs_saved_bridges');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [preparedBridges, setPreparedBridges] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('zs_prepared_bridges');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Estados dos Jogos Lúdicos de Apoio
  const [selectedFoodGame, setSelectedFoodGame] = useState(FOODS_GAMES[0]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [stars, setStars] = useState(14);
  const [showCelebration, setShowCelebration] = useState(false);

  // Roleta
  const [plateFriend, setPlateFriend] = useState<typeof FOODS_GAMES[0] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const res = await api.getRecipes();
        setRecipes(res.recipes);
      } catch (err) {
        console.error('Erro ao buscar receitas:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  const handleSaveBridge = (foodId: string) => {
    let next: string[];
    if (savedBridges.includes(foodId)) {
      next = savedBridges.filter(id => id !== foodId);
      setFeedbackToast('Ponte removida dos seus salvos.');
    } else {
      next = [...savedBridges, foodId];
      setFeedbackToast('Ponte salva com sucesso no seu perfil!');
    }
    setSavedBridges(next);
    localStorage.setItem('zs_saved_bridges', JSON.stringify(next));
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleMarkPrepared = (foodId: string) => {
    let next: string[];
    if (preparedBridges.includes(foodId)) {
      next = preparedBridges.filter(id => id !== foodId);
      setFeedbackToast('Marcada como não preparada.');
    } else {
      next = [...preparedBridges, foodId];
      setFeedbackToast('🎉 Parabéns! Refeição registrada com sucesso.');
      setStars(prev => prev + 2);
    }
    setPreparedBridges(next);
    localStorage.setItem('zs_prepared_bridges', JSON.stringify(next));
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleToggleStep = (stepId: string) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      const next = [...completedSteps, stepId];
      setCompletedSteps(next);
      setStars(prev => prev + 1);
      if (next.length === 6) {
        setShowCelebration(true);
      }
    }
  };

  const handleSpinPlate = () => {
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * FOODS_GAMES.length);
      setPlateFriend(FOODS_GAMES[randomIdx]);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const currentBridge = BRIDGES_DATA[selectedFoodKey] || BRIDGES_DATA['brocolis'];
  const isBridgeSaved = savedBridges.includes(currentBridge.foodId);
  const isBridgePrepared = preparedBridges.includes(currentBridge.foodId);

  // Filtragem preditiva de chips baseada na busca
  const filteredChips = QUICK_CHIPS.filter(chip =>
    chip.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickRecipes = recipes.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* Toast de Feedback */}
      {feedbackToast && (
        <div className="fixed top-18 right-4 z-50 bg-[#116B4C] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="size-4 text-honey-300" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. HERO RESOLUÇÃO IMEDIATA EM 10 SEGUNDOS (CORE DO APP)      */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-br from-[#FFF9EE] via-[#F2FAF6] to-[#E8F5EE] p-5 sm:p-7 rounded-3xl border-2 border-[#B5DFC7] shadow-sm space-y-5">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-0.5 rounded-full inline-flex items-center gap-1">
                ⚡ Resolução Prática de Refeição
              </span>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Sem estresse à mesa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#116B4C] tracking-tight">
              O que seu pequeno recusou hoje?
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5B53] font-semibold mt-0.5">
              Escolha o alimento abaixo e veja a <strong>Ponte de Aceitação em 3 passos simples</strong> para servir hoje sem briga.
            </p>
          </div>

          {/* Placar de Conquistas */}
          <div className="flex items-center gap-2.5 bg-white border border-[#F4D68A] px-3.5 py-2 rounded-2xl shadow-2xs self-start sm:self-auto shrink-0">
            <Star className="size-5 text-amber-500 fill-amber-400" />
            <div>
              <span className="text-[9px] font-black text-[#8A6318] uppercase block leading-none">Estrelas</span>
              <span className="text-base sm:text-lg font-black text-[#6B4B0A] leading-none">{stars} ★</span>
            </div>
          </div>
        </div>

        {/* Barra de Busca Preditiva */}
        <div className="relative">
          <Search className="size-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#116B4C]" />
          <input
            type="text"
            placeholder="Digite o alimento recusado (ex: brócolis, cenoura, ovo, carne...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-11 pr-4 py-3 rounded-2xl border-2 border-[#DCEFE4] focus:border-[#116B4C] focus:outline-hidden text-xs sm:text-sm font-bold text-[#26332D] placeholder-[#8A9B93] shadow-inner transition-colors"
          />
        </div>

        {/* Chips de Atalho Rápido */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-black text-[#52635B] uppercase tracking-wider block">
            Alimentos mais frequentes de recusa:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {(filteredChips.length > 0 ? filteredChips : QUICK_CHIPS).map((chip) => {
              const isSelected = selectedFoodKey === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setSelectedFoodKey(chip.id)}
                  className={`cursor-pointer shrink-0 rounded-2xl px-3.5 py-2 border-2 transition-all flex items-center gap-2 text-xs font-black ${
                    isSelected
                      ? 'bg-[#116B4C] border-[#116B4C] text-white shadow-sm scale-102'
                      : 'bg-white border-[#DCEFE4] text-[#26332D] hover:border-emerald-300'
                  }`}
                >
                  <span className="text-base">{chip.emoji}</span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* CARD DA PONTE DE ACEITAÇÃO EM 3 NÍVEIS                       */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl border-2 border-[#116B4C]/30 p-5 sm:p-6 shadow-md space-y-5">
          
          {/* Header do Card com Alimento Ativo e Ações */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCEFE4] pb-4">
            <div className="flex items-center gap-3">
              <div className="size-14 rounded-2xl bg-[#FFF9EE] border-2 border-[#F4D68A] flex items-center justify-center text-3xl shadow-xs">
                {currentBridge.emoji}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Ponte Estratégica
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#116B4C] mt-0.5">
                  Como oferecer {currentBridge.foodName} sem rejeição
                </h2>
                <p className="text-xs text-[#52635B] font-semibold">
                  Transição gradual da camuflagem até o alimento in natura.
                </p>
              </div>
            </div>

            {/* Ações: Salvar Ponte e Marcar como Preparada */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => handleSaveBridge(currentBridge.foodId)}
                className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
                  isBridgeSaved
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-[#FFF9EE] border-[#F4D68A] text-[#7A550A] hover:bg-amber-100'
                }`}
              >
                <BookmarkCheck className={`size-4 ${isBridgeSaved ? 'text-amber-600 fill-amber-500' : ''}`} />
                <span>{isBridgeSaved ? 'Ponte Salva' : 'Salvar Ponte'}</span>
              </button>

              <button
                onClick={() => handleMarkPrepared(currentBridge.foodId)}
                className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-black text-white transition-all flex items-center gap-1.5 shadow-xs ${
                  isBridgePrepared
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-[#116B4C] hover:bg-[#0e543b]'
                }`}
              >
                <CheckCircle2 className="size-4" />
                <span>{isBridgePrepared ? 'Preparada ✓' : 'Marcar como Preparada'}</span>
              </button>
            </div>
          </div>

          {/* OS 3 NÍVEIS EM CARDS DETALHADOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* NÍVEL 1: CAMUFLAGEM */}
            <div className="bg-[#FFFDF8] rounded-2xl p-4 border-2 border-emerald-200/80 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Passo 1 • Textura Segura
                  </span>
                  <span className="text-[11px] font-bold text-[#52635B] flex items-center gap-1">
                    <Clock className="size-3 text-emerald-700" />
                    {currentBridge.level1.prepTime}
                  </span>
                </div>
                <h3 className="text-sm font-black text-[#116B4C] leading-snug">
                  {currentBridge.level1.title}
                </h3>
                <p className="text-xs text-[#33443D] leading-relaxed font-medium">
                  {currentBridge.level1.description}
                </p>
              </div>

              <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100 text-[11px] text-emerald-900">
                <strong>💡 Segredo do preparo:</strong> {currentBridge.level1.tip}
              </div>
            </div>

            {/* NÍVEL 2: ASSOCIAÇÃO */}
            <div className="bg-[#FFFDF8] rounded-2xl p-4 border-2 border-amber-200/80 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Passo 2 • Alimento Amigo
                  </span>
                  <span className="text-[11px] font-bold text-[#52635B] flex items-center gap-1">
                    <Clock className="size-3 text-amber-700" />
                    {currentBridge.level2.prepTime}
                  </span>
                </div>
                <h3 className="text-sm font-black text-[#92400E] leading-snug">
                  {currentBridge.level2.title}
                </h3>
                <p className="text-xs text-[#33443D] leading-relaxed font-medium">
                  {currentBridge.level2.description}
                </p>
              </div>

              <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-100 text-[11px] text-amber-900">
                <strong>🤝 Parceria no prato:</strong> {currentBridge.level2.tip}
              </div>
            </div>

            {/* NÍVEL 3: IN NATURA / LÚDICO */}
            <div className="bg-[#FFFDF8] rounded-2xl p-4 border-2 border-purple-200/80 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
                    Passo 3 • In Natura Sem Pressão
                  </span>
                  <span className="text-[11px] font-bold text-[#52635B] flex items-center gap-1">
                    <Clock className="size-3 text-purple-700" />
                    {currentBridge.level3.prepTime}
                  </span>
                </div>
                <h3 className="text-sm font-black text-[#6B21A8] leading-snug">
                  {currentBridge.level3.title}
                </h3>
                <p className="text-xs text-[#33443D] leading-relaxed font-medium">
                  {currentBridge.level3.description}
                </p>
              </div>

              <div className="bg-purple-50/80 p-2.5 rounded-xl border border-purple-100 text-[11px] text-purple-950">
                <strong>💬 O que falar para a criança:</strong>
                <p className="italic mt-0.5 text-purple-900">{currentBridge.level3.speechScript}</p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* 2. ATALHOS RÁPIDOS DO APLICATIVO                            */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => navigate('/app/receitas')}
          className="bg-white p-4 rounded-3xl border-2 border-[#DCEFE4] hover:border-emerald-400 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Utensils className="size-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-[#26332D]">Biblioteca</h3>
            <p className="text-[10px] text-muted-foreground">+200 receitas práticas</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/app/planejar')}
          className="bg-white p-4 rounded-3xl border-2 border-[#DCEFE4] hover:border-emerald-400 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="size-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CalendarDays className="size-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-[#26332D]">Planejador Semanal</h3>
            <p className="text-[10px] text-muted-foreground">Segunda a Domingo</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/app/compras')}
          className="bg-white p-4 rounded-3xl border-2 border-[#DCEFE4] hover:border-emerald-400 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="size-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-[#26332D]">Lista Compras</h3>
            <p className="text-[10px] text-muted-foreground">Auto consolidada</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/app/materiais')}
          className="bg-white p-4 rounded-3xl border-2 border-[#DCEFE4] hover:border-emerald-400 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="size-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-[#26332D]">E-book & Bônus</h3>
            <p className="text-[10px] text-muted-foreground">Leitor e PDFs</p>
          </div>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 3. RECEITAS RECOMENDADAS EM DESTAQUE                        */}
      {/* ============================================================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-sm sm:text-base text-[#116B4C]">
              📖 Sugestões Rápidas de Preparo (Menos de 20 min)
            </h2>
            <p className="text-xs text-[#52635B]">
              Ideias testadas que não exigem ingredientes caros nem técnicas complicadas.
            </p>
          </div>
          <button
            onClick={() => navigate('/app/receitas')}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Ver acervo</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {quickRecipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. SEÇÃO SECUNDÁRIA: JOGOS LÚDICOS & SUPORTE PÓS-REFEIÇÃO    */}
      {/* ============================================================ */}
      <div className="border-t-2 border-[#DCEFE4] pt-8 space-y-8">
        
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            🎲 Atividades Lúdicas em Família
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#116B4C]">
            Brincadeiras para Reduzir a Ansiedade da Mesa
          </h2>
          <p className="text-xs text-[#52635B]">
            Ferramentas extras para transformar a hora do almoço e do jantar em momentos leves e acolhedores.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ROLETA DO PRATO MÁGICO */}
          <section className="bg-white rounded-3xl border-2 border-[#DCEFE4] p-6 shadow-sm space-y-5 text-center flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-3xl">🎡</span>
              <h3 className="text-lg sm:text-xl font-black text-[#E66B2E]">
                Roleta do Prato Amigo
              </h3>
              <p className="text-xs text-[#52635B] leading-relaxed">
                <strong>1 Alimento Seguro</strong> + <strong>1 Amiguinho Sorteado</strong> para fazer companhia!
              </p>
            </div>

            {/* Prato Visual */}
            <div className="relative mx-auto size-48 sm:size-52 rounded-full bg-[#FFF9EE] border-6 border-[#F4D68A] shadow-md flex items-center justify-center p-2.5">
              <div className="grid grid-cols-2 gap-2 w-full h-full items-center justify-center text-center">
                {/* Seguro */}
                <div className="flex flex-col items-center justify-center bg-white/90 rounded-2xl p-2 border border-emerald-200">
                  <span className="text-2xl">🍚</span>
                  <span className="text-[8px] font-bold text-emerald-800 uppercase mt-0.5">Seguro</span>
                  <span className="text-[10px] font-black text-[#26332D]">Arroz / Batata</span>
                </div>

                {/* Sorteado */}
                <div className="flex flex-col items-center justify-center bg-white/90 rounded-2xl p-2 border border-amber-200">
                  {plateFriend ? (
                    <>
                      <span className="text-2xl">{plateFriend.emoji}</span>
                      <span className="text-[8px] font-bold text-amber-800 uppercase mt-0.5">Sorteado</span>
                      <span className="text-[10px] font-black text-[#26332D]">{plateFriend.name.split(' ')[0]}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">❓</span>
                      <span className="text-[8px] font-bold text-amber-800 uppercase mt-0.5">Girar</span>
                      <span className="text-[10px] font-black text-[#26332D]">Quem vem?</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handleSpinPlate}
                disabled={isSpinning}
                className="cursor-pointer py-3 px-6 rounded-2xl bg-[#E66B2E] hover:bg-[#d55e24] text-white font-black text-xs shadow-md uppercase tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSpinning ? 'Girando a Roleta...' : '🎲 GIRAR ROLETA DO PRATO'}
              </button>
            </div>
          </section>

          {/* O DETETIVE DOS SENTIDOS */}
          <section className="bg-white rounded-3xl border-2 border-[#DCEFE4] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCEFE4] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🕵️‍♂️</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#116B4C]">
                    Detetive dos 5 Sentidos
                  </h3>
                  <p className="text-[11px] text-[#52635B]">Explore sem a obrigação de engolir.</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {completedSteps.length}/6
              </span>
            </div>

            {/* Checklist dos 6 Passos */}
            <div className="grid grid-cols-2 gap-2">
              {SENSORY_STEPS.map((step) => {
                const isDone = completedSteps.includes(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => handleToggleStep(step.id)}
                    className={`cursor-pointer text-left rounded-xl p-2.5 border transition-all flex items-start gap-2 ${
                      isDone
                        ? 'bg-emerald-50 border-[#116B4C] text-[#116B4C]'
                        : 'bg-[#FAFCFA] border-[#DCEFE4] hover:bg-[#F2FAF6] text-[#52635B]'
                    }`}
                  >
                    <span className="text-lg shrink-0">{step.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black truncate">{step.label}</span>
                        <span className="text-[10px]">{isDone ? '✅' : '⭕'}</span>
                      </div>
                      <p className="text-[9px] opacity-80 leading-tight mt-0.5 truncate">{step.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#EBF7F0] rounded-xl p-3 border border-[#B5DFC7] text-[11px] text-[#2A4D3B]">
              <strong>💡 Dica:</strong> Elogie a coragem de olhar ou cheirar, mesmo se ele não colocar na boca.
            </div>
          </section>

        </div>

      </div>

      {/* Modal de Comemoração */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-amber-400 p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in">
            <div className="size-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
              👑
            </div>
            <h3 className="text-2xl font-black text-[#116B4C]">
              PARABÉNS, PEQUENO DETETIVE!
            </h3>
            <p className="text-xs sm:text-sm text-[#4A5B53] leading-relaxed">
              Você completou a exploração sensorial! Toda a família está muito orgulhosa do seu progresso.
            </p>
            <div className="text-3xl">🎉 🌟 🍓 🥕 🎈</div>
            <button
              onClick={() => setShowCelebration(false)}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#116B4C] hover:bg-[#0d543b] text-white font-black text-sm uppercase tracking-wide cursor-pointer shadow-md"
            >
              Pegar Minha Recompensa!
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
