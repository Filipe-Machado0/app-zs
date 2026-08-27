import React, { useState } from 'react';
import { Plus, X, Sparkles, Utensils, MessageSquare, Check, RefreshCw } from 'lucide-react';
import { MealPlan, Recipe } from '../../types';

interface PlannerGridProps {
  plan: MealPlan;
  recipes: Recipe[];
  onUpdatePlan: (updated: MealPlan) => void;
  onOpenRecipeSelect: (day: string, slot: 'breakfast' | 'snack' | 'lunch' | 'dinner') => void;
}

export const WeeklyPlannerGrid: React.FC<PlannerGridProps> = ({
  plan,
  recipes,
  onUpdatePlan,
  onOpenRecipeSelect,
}) => {
  const days = [
    { key: 'segunda', label: 'Segunda-feira', short: 'Seg' },
    { key: 'terca', label: 'Terça-feira', short: 'Ter' },
    { key: 'quarta', label: 'Quarta-feira', short: 'Qua' },
    { key: 'quinta', label: 'Quinta-feira', short: 'Qui' },
    { key: 'sexta', label: 'Sexta-feira', short: 'Sex' },
    { key: 'sabado', label: 'Sábado', short: 'Sáb' },
    { key: 'domingo', label: 'Domingo', short: 'Dom' },
  ];

  const slots = [
    { key: 'breakfast', label: 'Café da Manhã', color: 'bg-honey-100/60 text-graphite-800' },
    { key: 'snack', label: 'Lanchinho', color: 'bg-terracotta-50 text-terracotta-800' },
    { key: 'lunch', label: 'Almoço', color: 'bg-forest-50 text-forest-900' },
    { key: 'dinner', label: 'Jantar', color: 'bg-forest-100/50 text-forest-900' },
  ];

  const [activeDayTab, setActiveDayTab] = useState('segunda');

  const getRecipeTitle = (id: string) => {
    return recipes.find((r) => r.id === id)?.title || 'Receita Selecionada';
  };

  const handleRemoveRecipe = (dayKey: string, slotKey: 'breakfast' | 'snack' | 'lunch' | 'dinner', recipeId: string) => {
    const dayData = plan.days[dayKey as keyof typeof plan.days];
    const currentList = dayData[slotKey] || [];
    const updatedList = currentList.filter((id) => id !== recipeId);

    const updatedPlan: MealPlan = {
      ...plan,
      days: {
        ...plan.days,
        [dayKey]: {
          ...dayData,
          [slotKey]: updatedList,
        },
      },
    };
    onUpdatePlan(updatedPlan);
  };

  const handleNotesChange = (dayKey: string, notes: string) => {
    const dayData = plan.days[dayKey as keyof typeof plan.days];
    const updatedPlan: MealPlan = {
      ...plan,
      days: {
        ...plan.days,
        [dayKey]: {
          ...dayData,
          notes,
        },
      },
    };
    onUpdatePlan(updatedPlan);
  };

  return (
    <div className="space-y-6">
      
      {/* Gentle Reminder Banner */}
      <div className="p-4 rounded-2xl bg-forest-100/80 border border-forest-200 text-xs text-forest-900 flex items-start gap-2.5 shadow-2xs">
        <Sparkles className="size-4 text-terracotta-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          <strong>Lembrete acolhedor:</strong> “Seu planejamento pode mudar. Ele existe para facilitar a sua rotina, não para cobrar ou gerar expectativas rígidas.”
        </p>
      </div>

      {/* Mobile Day Selector Tabs */}
      <div className="sm:hidden flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {days.map((d) => (
          <button
            key={d.key}
            onClick={() => setActiveDayTab(d.key)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeDayTab === d.key
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-white text-graphite-700 border border-forest-100'
            }`}
          >
            {d.short}
          </button>
        ))}
      </div>

      {/* Grid: Responsive (Mobile shows activeDayTab, Desktop shows all) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {days
          .filter((d) => window.innerWidth >= 640 || d.key === activeDayTab)
          .map((day) => {
            const dayData = plan.days[day.key as keyof typeof plan.days];

            return (
              <div
                key={day.key}
                className="bg-white rounded-3xl border border-forest-100 p-5 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-forest-100/60 pb-2.5">
                    <h3 className="font-extrabold text-sm text-forest-900">{day.label}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-graphite-400">
                      Refeições
                    </span>
                  </div>

                  {/* Meal Slots */}
                  <div className="space-y-3 mt-3">
                    {slots.map((slot) => {
                      const recipeIds = (dayData[slot.key as keyof typeof dayData] as string[]) || [];

                      return (
                        <div key={slot.key} className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-graphite-700">{slot.label}</span>
                            <button
                              onClick={() => onOpenRecipeSelect(day.key, slot.key as any)}
                              className="text-[10px] font-extrabold text-forest-800 hover:text-forest-900 flex items-center gap-0.5 cursor-pointer bg-cream-100 px-2 py-0.5 rounded-lg border border-forest-100/60 hover:bg-forest-100 transition-colors"
                            >
                              <Plus className="size-3" />
                              <span>Adicionar</span>
                            </button>
                          </div>

                          {/* Selected recipes in this slot */}
                          {recipeIds.length === 0 ? (
                            <div className="p-2 rounded-xl bg-cream-100/50 border border-dashed border-forest-100 text-[10px] text-graphite-400 text-center">
                              Nenhuma receita programada
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {recipeIds.map((rid) => (
                                <div
                                  key={rid}
                                  className="flex items-center justify-between p-2 rounded-xl bg-forest-50 border border-forest-100 text-xs font-bold text-forest-900"
                                >
                                  <span className="truncate text-[11px] max-w-[180px]">
                                    {getRecipeTitle(rid)}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveRecipe(day.key, slot.key as any, rid)}
                                    className="p-0.5 text-graphite-400 hover:text-terracotta-600 rounded-md transition-colors"
                                  >
                                    <X className="size-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Day Personal Note */}
                <div className="pt-2 border-t border-forest-100/60">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-graphite-500 mb-1">
                    <MessageSquare className="size-3 text-forest-700" />
                    <span>Anotação da família (opcional):</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Ex: testar a batatinha com calma no almoço..."
                    value={dayData.notes || ''}
                    onChange={(e) => handleNotesChange(day.key, e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-800 placeholder:text-graphite-400"
                  />
                </div>

              </div>
            );
          })}
      </div>

    </div>
  );
};
