import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChefHat, Sparkles, Printer, CalendarPlus, Heart, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../api/client';
import { Recipe } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { LockedFeatureNotice } from '../../components/paywall/LockedFeatureNotice';
import { Disclaimer } from '../../components/common/Disclaimer';

export const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isBasic, isPremium } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAddPlannerModal, setShowAddPlannerModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('segunda');
  const [selectedSlot, setSelectedSlot] = useState<'breakfast' | 'snack' | 'lunch' | 'dinner'>('lunch');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadRecipe = async () => {
      setLoading(true);
      try {
        const res = await api.getRecipeById(id);
        setRecipe(res.recipe);
        setIsLocked(res.isLocked);
      } catch (err) {
        console.error('Erro ao carregar receita:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRecipe();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleAddToPlanner = async () => {
    if (!recipe) return;
    if (isBasic) {
      navigate('/planos');
      return;
    }

    try {
      const { plan } = await api.getMealPlan();
      const dayData = plan.days[selectedDay as keyof typeof plan.days];
      const currentList = dayData[selectedSlot] || [];

      if (!currentList.includes(recipe.id)) {
        dayData[selectedSlot] = [...currentList, recipe.id];
        await api.updateMealPlan(plan);
      }

      setShowAddPlannerModal(false);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 3000);
    } catch (err) {
      console.error('Erro ao adicionar ao planejamento:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-graphite-500 space-y-2">
        <p className="text-sm font-bold">Carregando detalhes da receita...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-forest-100 p-6 space-y-4">
        <AlertCircle className="size-10 text-terracotta-600 mx-auto" />
        <h2 className="text-lg font-extrabold text-graphite-900">Receita não encontrada</h2>
        <button
          onClick={() => navigate('/app/receitas')}
          className="px-4 py-2 rounded-xl bg-forest-800 text-forest-100 text-xs font-bold"
        >
          Voltar para a biblioteca
        </button>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/app/receitas')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para as receitas</span>
        </button>
        <LockedFeatureNotice
          title={`Receita Exclusiva do Plano Premium`}
          description={`A receita "${recipe.title}" faz parte do acervo expandido do Cardápio Seletivo Premium.`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Back & Action Buttons */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => navigate('/app/receitas')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para as receitas</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-terracotta-50 border-terracotta-200 text-terracotta-600'
                : 'bg-white border-forest-100 text-graphite-500 hover:text-terracotta-600'
            }`}
            title="Favoritar receita"
          >
            <Heart className={`size-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handlePrint}
            className="p-2.5 rounded-2xl bg-white border border-forest-100 text-graphite-600 hover:text-forest-800 transition-colors cursor-pointer"
            title="Imprimir receita"
          >
            <Printer className="size-4" />
          </button>

          <button
            onClick={() => setShowAddPlannerModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-forest-800 hover:bg-forest-900 text-forest-100 text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
          >
            <CalendarPlus className="size-4" />
            <span className="hidden sm:inline">Adicionar ao Planejamento</span>
            <span className="sm:hidden">Planejar</span>
          </button>
        </div>
      </div>

      {addedToast && (
        <div className="p-3 bg-forest-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md animate-fade-in">
          <CheckCircle2 className="size-4 text-honey-300" />
          <span>Receita adicionada ao seu Planejador Semanal com sucesso!</span>
        </div>
      )}

      {/* Main Recipe Header Card */}
      <div className="bg-white rounded-3xl border border-forest-100 overflow-hidden shadow-2xs">
        
        {/* Cover Image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-cream-200 overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header Details */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-forest-100 text-forest-900">
              {recipe.mealType.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-honey-100 text-graphite-800">
              Base: {recipe.baseFood}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-terracotta-50 text-terracotta-800">
              #{recipe.textures.join(', #')}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-graphite-900">
            {recipe.title}
          </h1>

          <p className="text-xs sm:text-sm text-graphite-600 leading-relaxed max-w-2xl">
            {recipe.summary}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-forest-100/60 text-xs">
            <div className="p-3 rounded-2xl bg-cream-100 border border-forest-100/50 flex items-center gap-2.5">
              <Clock className="size-4 text-forest-700" />
              <div>
                <p className="text-[10px] text-graphite-400 font-bold">Tempo</p>
                <p className="font-extrabold text-graphite-800">{recipe.prepTimeMinutes} minutos</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-cream-100 border border-forest-100/50 flex items-center gap-2.5">
              <ChefHat className="size-4 text-forest-700" />
              <div>
                <p className="text-[10px] text-graphite-400 font-bold">Dificuldade</p>
                <p className="font-extrabold text-graphite-800 capitalize">{recipe.difficulty.replace('_', ' ')}</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-cream-100 border border-forest-100/50 flex items-center gap-2.5">
              <Sparkles className="size-4 text-terracotta-500" />
              <div>
                <p className="text-[10px] text-graphite-400 font-bold">Formatos</p>
                <p className="font-extrabold text-graphite-800 capitalize">{recipe.formats.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mindset Pillars: Ponto de partida vs Pequena variação */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-5 rounded-3xl bg-forest-50 border border-forest-100 space-y-1.5">
          <div className="flex items-center gap-1.5 text-forest-900 text-xs font-extrabold">
            <CheckCircle2 className="size-4 text-forest-700" />
            <span>Ponto de partida conhecido:</span>
          </div>
          <p className="text-xs text-graphite-700 leading-relaxed">
            {recipe.familiarStart}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-terracotta-50 border border-terracotta-100 space-y-1.5">
          <div className="flex items-center gap-1.5 text-terracotta-800 text-xs font-extrabold">
            <Sparkles className="size-4 text-terracotta-600" />
            <span>Pequena variação sugerida:</span>
          </div>
          <p className="text-xs text-graphite-700 leading-relaxed">
            {recipe.subtleVariation}
          </p>
        </div>
      </div>

      {/* Ingredients & Substitutions */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-2xs space-y-4">
        <h2 className="text-base sm:text-lg font-extrabold text-forest-900">
          Ingredientes Necessários
        </h2>

        <div className="divide-y divide-forest-100/60">
          {recipe.ingredients.map((ing) => (
            <div key={ing.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-graphite-900">{ing.name}</p>
                {ing.substitutions && ing.substitutions.length > 0 && (
                  <p className="text-[10px] text-graphite-500 mt-0.5">
                    Substituições possíveis: {ing.substitutions.join(', ')}
                  </p>
                )}
              </div>
              <span className="font-extrabold text-forest-800 shrink-0">
                {ing.amount} {ing.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step by Step Preparation */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-2xs space-y-6">
        <h2 className="text-base sm:text-lg font-extrabold text-forest-900">
          Modo de Preparo Passo a Passo
        </h2>

        <div className="space-y-4">
          {recipe.steps.map((st) => (
            <div key={st.stepNumber} className="flex items-start gap-4">
              <div className="size-7 rounded-full bg-forest-800 text-forest-100 flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
                {st.stepNumber}
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-xs sm:text-sm text-graphite-800 leading-relaxed">
                  {st.instruction}
                </p>
                {st.tip && (
                  <p className="text-[11px] text-terracotta-700 bg-terracotta-50 p-2.5 rounded-xl border border-terracotta-100/60 leading-relaxed">
                    💡 <strong>Dica da rotina:</strong> {st.tip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discrete Educational Note */}
      <Disclaimer compact />

      {/* Modal: Add to Planner */}
      {showAddPlannerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-xl border border-forest-100">
            <h3 className="font-extrabold text-base text-forest-900">
              Adicionar ao Planejamento Semanal
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-graphite-700">Escolha o dia da semana:</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-cream-100 border border-forest-100 font-semibold"
                >
                  <option value="segunda">Segunda-feira</option>
                  <option value="terca">Terça-feira</option>
                  <option value="quarta">Quarta-feira</option>
                  <option value="quinta">Quinta-feira</option>
                  <option value="sexta">Sexta-feira</option>
                  <option value="sabado">Sábado</option>
                  <option value="domingo">Domingo</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-graphite-700">Escolha a refeição:</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value as any)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-cream-100 border border-forest-100 font-semibold"
                >
                  <option value="breakfast">Café da Manhã</option>
                  <option value="snack">Lanchinho</option>
                  <option value="lunch">Almoço</option>
                  <option value="dinner">Jantar</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddPlannerModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-cream-100 text-graphite-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddToPlanner}
                className="w-1/2 py-2.5 rounded-xl bg-forest-800 text-white font-extrabold text-xs shadow-xs"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
