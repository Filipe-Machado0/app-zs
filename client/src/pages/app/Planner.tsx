import React, { useEffect, useState } from 'react';
import { CalendarDays, Sparkles, RefreshCw, Plus, X, Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import { MealPlan, Recipe } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { WeeklyPlannerGrid } from '../../components/planner/WeeklyPlannerGrid';
import { LockedFeatureNotice } from '../../components/paywall/LockedFeatureNotice';

export const Planner: React.FC = () => {
  const { isBasic, isPremium } = useAuth();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal de seleção de receita para adicionar em slot específico
  const [selectModal, setSelectModal] = useState<{
    open: boolean;
    dayKey: string;
    slotKey: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  } | null>(null);
  const [searchRecipe, setSearchRecipe] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [planRes, recipesRes] = await Promise.all([
        api.getMealPlan(),
        api.getRecipes(),
      ]);
      setPlan(planRes.plan);
      setRecipes(recipesRes.recipes);
    } catch (err) {
      console.error('Erro ao carregar dados do planejador:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPremium) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isPremium]);

  const handleUpdatePlan = async (updatedPlan: MealPlan) => {
    setPlan(updatedPlan);
    setSaving(true);
    try {
      await api.updateMealPlan(updatedPlan);
    } catch (err) {
      console.error('Erro ao salvar planejamento:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddRecipeFromModal = (recipeId: string) => {
    if (!plan || !selectModal) return;

    const dayData = plan.days[selectModal.dayKey as keyof typeof plan.days];
    const currentList = dayData[selectModal.slotKey] || [];

    if (!currentList.includes(recipeId)) {
      const updatedPlan: MealPlan = {
        ...plan,
        days: {
          ...plan.days,
          [selectModal.dayKey]: {
            ...dayData,
            [selectModal.slotKey]: [...currentList, recipeId],
          },
        },
      };
      handleUpdatePlan(updatedPlan);
    }

    setSelectModal(null);
    setSearchRecipe('');
  };

  const handleClearWeek = () => {
    if (!plan) return;
    if (!window.confirm('Deseja limpar todo o planejamento da semana?')) return;

    const cleanPlan: MealPlan = {
      ...plan,
      days: {
        segunda: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
        terca: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
        quarta: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
        quinta: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
        sexta: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
        sabado: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
        domingo: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
      },
    };
    handleUpdatePlan(cleanPlan);
  };

  if (isBasic) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-0.5 rounded-full">
            Organização Semanal
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900 mt-2">
            Planejador Semanal de Refeições
          </h1>
        </div>
        <LockedFeatureNotice
          title="Planejador Semanal Interativo"
          description="Monte a grade da semana de segunda a domingo, adicione anotações por refeição e gere automaticamente sua lista de compras."
        />
      </div>
    );
  }

  if (loading || !plan) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="size-8 text-forest-700 animate-spin mx-auto" />
        <p className="text-xs font-bold text-graphite-600">Carregando seu planejamento...</p>
      </div>
    );
  }

  const filteredModalRecipes = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(searchRecipe.toLowerCase()) ||
      r.baseFood.toLowerCase().includes(searchRecipe.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-0.5 rounded-full">
            Organização Semanal
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900 mt-2">
            Planejador Semanal de Refeições
          </h1>
          <p className="text-xs text-graphite-600 mt-1">
            Organize as ideias para cada refeição de forma leve e flexível.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saving && (
            <span className="text-[11px] font-bold text-forest-700 animate-pulse flex items-center gap-1">
              <Loader2 className="size-3 animate-spin" />
              <span>Salvando...</span>
            </span>
          )}
          <button
            onClick={handleClearWeek}
            className="px-3 py-1.5 rounded-xl bg-white border border-forest-100 text-graphite-600 hover:text-terracotta-600 text-xs font-bold transition-colors cursor-pointer"
          >
            Limpar semana
          </button>
        </div>
      </div>

      {/* Grid Component */}
      <WeeklyPlannerGrid
        plan={plan}
        recipes={recipes}
        onUpdatePlan={handleUpdatePlan}
        onOpenRecipeSelect={(dayKey, slotKey) => setSelectModal({ open: true, dayKey, slotKey })}
      />

      {/* Modal de Seleção de Receita */}
      {selectModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-forest-100 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-forest-100 pb-3">
              <h3 className="font-extrabold text-base text-forest-900">
                Selecionar Receita
              </h3>
              <button
                onClick={() => {
                  setSelectModal(null);
                  setSearchRecipe('');
                }}
                className="p-1 rounded-full text-graphite-400 hover:text-graphite-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Buscar por nome ou alimento base..."
              value={searchRecipe}
              onChange={(e) => setSearchRecipe(e.target.value)}
              className="w-full text-xs p-3 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-900"
            />

            <div className="flex-1 overflow-y-auto divide-y divide-forest-100/60 pr-1 space-y-1">
              {filteredModalRecipes.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleAddRecipeFromModal(r.id)}
                  className="py-2.5 px-3 rounded-2xl hover:bg-forest-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-graphite-900 group-hover:text-forest-900">
                      {r.title}
                    </p>
                    <p className="text-[10px] text-graphite-500">
                      Base: {r.baseFood} • {r.prepTimeMinutes} min
                    </p>
                  </div>
                  <span className="text-xs font-bold text-forest-700 group-hover:underline">
                    Adicionar +
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
