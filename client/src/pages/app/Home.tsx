import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Utensils,
  CalendarDays,
  ShoppingBag,
  BookOpen,
  ArrowRight,
  Star,
  Gamepad2,
  Trophy,
  Lightbulb,
  Heart,
  ChefHat,
  RotateCw,
  Search,
  CheckCircle2,
  Flame,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api/client';
import { Recipe } from '../../types';
import { RecipeCard } from '../../components/recipes/RecipeCard';

interface FoodGameItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  colorName: string;
  colorCode: string;
  texture: string;
  curiosity: string;
  tipForMom: string;
}

const FOODS_GAMES: FoodGameItem[] = [
  {
    id: 'cenoura',
    name: 'Cenoura Mágica',
    emoji: '🥕',
    category: 'Legume dos Heróis',
    colorName: 'Laranja Solar',
    colorCode: '#FF7A00',
    texture: 'Super Crocante ou Macia',
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
    texture: 'Copinha fofinha',
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
    texture: 'Cremosa e docinha',
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
    texture: 'Muito crocante e suculenta',
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
    texture: 'Explode docinho na boca',
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
  { id: 'bite', label: 'Mordida do Leão', desc: 'Morder e ouvir o croc!', icon: '🦁' },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isBasic, isPremium, role } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Jogos Lúdicos
  const [selectedFood, setSelectedFood] = useState<FoodGameItem>(FOODS_GAMES[0]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [stars, setStars] = useState(14);
  const [showCelebration, setShowCelebration] = useState(false);

  // Roleta
  const [plateFriend, setPlateFriend] = useState<FoodGameItem | null>(null);
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

  const featuredRecipe = recipes[0];
  const quickRecipes = recipes.slice(1, 4);

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* ============================================================ */}
      {/* 1. TOPO DE BOAS-VINDAS LÚDICO COM PLACAR DE ESTRELAS         */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-[#DCEFE4] via-[#F2FAF6] to-[#FFF3D6] p-6 sm:p-8 rounded-3xl border-2 border-[#B5DFC7] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full inline-block">
                🌱 {role === 'basic' ? 'Plano Básico Ativo' : 'Plano Premium Vitalício'}
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Área Infantil & Família
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#116B4C] mt-1 tracking-tight">
              Olá, {profile?.displayName?.split(' ')[0] || 'Família'}! ✨
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5B53] font-bold">
              Bem-vindos à nossa aventura de sabores sem pressão e com muita diversão!
            </p>
          </div>

          {/* Placar de Estrelas */}
          <div className="flex items-center gap-3 bg-white border-2 border-[#F4D68A] px-4 py-2.5 rounded-2xl shadow-sm self-start sm:self-auto">
            <Star className="size-6 text-amber-500 fill-amber-400 animate-bounce" />
            <div>
              <span className="text-[10px] font-black text-[#8A6318] uppercase block leading-none">Estrelas do Pequeno</span>
              <span className="text-lg sm:text-xl font-black text-[#6B4B0A] leading-none">{stars} ★</span>
            </div>
          </div>
        </div>

        {/* Lema Central Acolhedor */}
        <div className="p-4 rounded-2xl bg-[#116B4C] text-white flex items-center gap-3.5 shadow-md">
          <div className="size-11 rounded-2xl bg-[#0e543b] flex items-center justify-center text-2xl shrink-0">
            🪄
          </div>
          <div>
            <p className="text-xs sm:text-sm font-black text-white">
              “Comece pelo que a criança já ama e mude apenas um pequeno detalhe.”
            </p>
            <p className="text-[11px] text-emerald-100 mt-0.5 font-medium">
              Apresentar um novo alimento é como fazer um novo amigo: primeiro a gente olha, toca e brinca!
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. JOGO 1: O DETETIVE DOS ALIMENTOS (MÃE + FILHO)            */}
      {/* ============================================================ */}
      <section className="bg-white rounded-3xl border-2 border-[#DCEFE4] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#DCEFE4]/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🕵️‍♂️</span>
            <div>
              <div className="inline-block text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full mb-0.5">
                Jogo de Exploração Sensorial
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#116B4C]">
                Missão: O Detetive dos Alimentos
              </h2>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-700 bg-[#DCEFE4] px-3 py-1 rounded-full self-start sm:self-auto">
            {completedSteps.length} de 6 missões concluídas
          </span>
        </div>

        {/* Escolha do Alimento do Dia */}
        <div className="space-y-2">
          <p className="text-xs font-black text-[#26332D] uppercase tracking-wide">
            1. Escolha o alimento que vocês vão investigar hoje:
          </p>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {FOODS_GAMES.map((food) => {
              const isSelected = selectedFood.id === food.id;
              return (
                <button
                  key={food.id}
                  onClick={() => {
                    setSelectedFood(food);
                    setCompletedSteps([]);
                  }}
                  className={`cursor-pointer shrink-0 rounded-2xl p-3 border-2 transition-all flex flex-col items-center gap-1 min-w-[105px] ${
                    isSelected
                      ? 'bg-[#FFF9EE] border-[#116B4C] shadow-md scale-105'
                      : 'bg-white border-[#DCEFE4] hover:border-emerald-300 opacity-80'
                  }`}
                >
                  <span className="text-3xl">{food.emoji}</span>
                  <span className="text-xs font-black text-[#26332D] text-center">{food.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card do Alimento Escolhido */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9EE] border-2 border-[#F4D68A] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-white border-2 border-[#F4D68A] flex items-center justify-center text-4xl shadow-xs shrink-0">
              {selectedFood.emoji}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                {selectedFood.category}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#116B4C] mt-0.5">
                {selectedFood.name}
              </h3>
              <p className="text-xs text-[#52635B] font-bold">
                Cor: <span style={{ color: selectedFood.colorCode }}>● {selectedFood.colorName}</span>
              </p>
            </div>
          </div>

          <div className="bg-white/90 border border-[#F4D68A] rounded-xl p-3 text-xs max-w-sm">
            <strong className="text-[#7A550A] block">✨ Curiosidade para contar ao seu filho:</strong>
            <p className="text-[#5A4310] italic mt-0.5">"{selectedFood.curiosity}"</p>
          </div>
        </div>

        {/* Checklist dos 6 Passos Sensoriais */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-black text-[#116B4C]">
            📋 Marque os passos conforme a criança for brincando (sem obrigar a engolir!):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {SENSORY_STEPS.map((step) => {
              const isDone = completedSteps.includes(step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => handleToggleStep(step.id)}
                  className={`cursor-pointer text-left rounded-2xl p-3.5 border-2 transition-all flex items-start gap-3 ${
                    isDone
                      ? 'bg-emerald-50 border-[#116B4C] text-[#116B4C] shadow-xs scale-[1.01]'
                      : 'bg-[#FAFCFA] border-[#DCEFE4] hover:bg-[#F2FAF6] text-[#52635B]'
                  }`}
                >
                  <span className="text-2xl shrink-0 mt-0.5">{step.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black truncate">{step.label}</h5>
                      <span className="text-xs font-bold">{isDone ? '✅' : '⭕'}</span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-tight mt-0.5">{step.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dica para a Mãe */}
        <div className="bg-[#EBF7F0] rounded-2xl p-4 border border-[#B5DFC7] flex items-start gap-3">
          <Lightbulb className="size-5 text-[#116B4C] shrink-0 mt-0.5" />
          <div className="text-xs text-[#2A4D3B]">
            <strong className="font-extrabold text-[#116B4C] block">
              💡 Dica de Apresentação para a Mamãe:
            </strong>
            <p className="leading-relaxed mt-0.5">{selectedFood.tipForMom}</p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. JOGO 2: ROLETA DO PRATO MÁGICO                            */}
      {/* ============================================================ */}
      <section className="bg-white rounded-3xl border-2 border-[#DCEFE4] p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <div className="max-w-md mx-auto space-y-1.5">
          <span className="text-3xl">🎡</span>
          <h2 className="text-xl sm:text-2xl font-black text-[#E66B2E]">
            Roleta do Prato Mágico
          </h2>
          <p className="text-xs text-[#52635B] leading-relaxed">
            A regra de ouro: <strong>1 Alimento que a criança já ama</strong> + <strong>1 Amiguinho Sorteado</strong> para fazer companhia no pratinho!
          </p>
        </div>

        {/* Prato Visual */}
        <div className="relative mx-auto size-56 sm:size-64 rounded-full bg-[#FFF9EE] border-8 border-[#F4D68A] shadow-lg flex items-center justify-center p-3">
          <div className="grid grid-cols-2 gap-3 w-full h-full items-center justify-center text-center">
            {/* Seguro */}
            <div className="flex flex-col items-center justify-center bg-white/90 rounded-2xl p-2 border border-emerald-200 shadow-2xs">
              <span className="text-2xl sm:text-3xl">🍚</span>
              <span className="text-[9px] font-bold text-emerald-800 uppercase mt-0.5">Alimento Seguro</span>
              <span className="text-[11px] font-black text-[#26332D]">Arroz / Batata</span>
            </div>

            {/* Sorteado */}
            <div className="flex flex-col items-center justify-center bg-white/90 rounded-2xl p-2 border border-amber-200 shadow-2xs">
              {plateFriend ? (
                <>
                  <span className="text-2xl sm:text-3xl">{plateFriend.emoji}</span>
                  <span className="text-[9px] font-bold text-amber-800 uppercase mt-0.5">Novo Amigo</span>
                  <span className="text-[11px] font-black text-[#26332D]">{plateFriend.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <span className="text-2xl sm:text-3xl">❓</span>
                  <span className="text-[9px] font-bold text-amber-800 uppercase mt-0.5">Girar Roleta</span>
                  <span className="text-[11px] font-black text-[#26332D]">Quem virá?</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={handleSpinPlate}
            disabled={isSpinning}
            className="cursor-pointer py-3.5 px-7 rounded-2xl bg-[#E66B2E] hover:bg-[#d55e24] active:bg-[#bf511c] text-white font-black text-xs sm:text-sm shadow-md uppercase tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isSpinning ? 'Girando a Roleta...' : '🎲 GIRAR ROLETA DO PRATO'}
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. ATALHOS RÁPIDOS DO APLICATIVO                            */}
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
            <p className="text-[10px] text-muted-foreground">+200 receitas</p>
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
            <h3 className="font-extrabold text-xs text-[#26332D]">Planejamento</h3>
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

      {/* Sugestão de Receitas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-sm sm:text-base text-[#116B4C]">
            📖 Ideias Práticas da Semana
          </h2>
          <button
            onClick={() => navigate('/app/receitas')}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todas</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {quickRecipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
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
              Você completou a investigação de todos os 5 sentidos! A mamãe e toda a família estão muito orgulhosas.
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

