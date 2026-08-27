import React from 'react';
import { Search, Filter, Lock, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface FilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedMeal: string;
  onMealChange: (meal: string) => void;
  selectedBaseFood: string;
  onBaseFoodChange: (food: string) => void;
  selectedTexture: string;
  onTextureChange: (tex: string) => void;
  onReset: () => void;
}

export const RecipeFilters: React.FC<FilterProps> = ({
  search,
  onSearchChange,
  selectedMeal,
  onMealChange,
  selectedBaseFood,
  onBaseFoodChange,
  selectedTexture,
  onTextureChange,
  onReset,
}) => {
  const { isBasic, isPremium } = useAuth();

  const meals = [
    { id: '', label: 'Todas' },
    { id: 'cafe_da_manha', label: 'Café da Manhã' },
    { id: 'lanche', label: 'Lanches' },
    { id: 'almoco', label: 'Almoço' },
    { id: 'jantar', label: 'Jantar' },
  ];

  const baseFoods = ['Batata', 'Banana', 'Frango', 'Pão', 'Arroz', 'Ovo', 'Maçã', 'Cenoura'];
  const textures = ['crocante', 'macio', 'sequinho', 'cremoso', 'aveludado'];

  const hasActiveFilters = search || selectedMeal || selectedBaseFood || selectedTexture;

  return (
    <div className="space-y-4 bg-white p-4 sm:p-5 rounded-3xl border border-forest-100 shadow-2xs">
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-graphite-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por receita ou alimento (ex: batata, frango, banana)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-100 border border-forest-100 text-xs sm:text-sm focus:outline-none focus:border-forest-700 focus:bg-white transition-all text-graphite-900 placeholder:text-graphite-400"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-graphite-400 hover:text-graphite-600"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Meal Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {meals.map((m) => {
          const isSelected = selectedMeal === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onMealChange(m.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-forest-800 text-forest-100 shadow-2xs'
                  : 'bg-cream-100 text-graphite-700 hover:bg-forest-100/70 border border-forest-100/50'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Advanced Premium Filters */}
      <div className="pt-3 border-t border-forest-100/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-forest-900">
            <Filter className="size-3.5 text-forest-700" />
            <span>Filtros Especiais por Alimento e Textura</span>
          </div>

          {isBasic && (
            <span className="flex items-center gap-1 text-[10px] font-extrabold text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full">
              <Lock className="size-2.5" />
              <span>Recurso Premium</span>
            </span>
          )}

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-[11px] font-semibold text-terracotta-600 hover:underline cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Base Foods Selector */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-graphite-600">Partir de um alimento que a criança já aceita:</label>
          <div className="flex flex-wrap gap-1.5">
            {baseFoods.map((food) => {
              const isSelected = selectedBaseFood === food;
              return (
                <button
                  key={food}
                  disabled={isBasic}
                  onClick={() => onBaseFoodChange(isSelected ? '' : food)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-terracotta-500 text-white shadow-2xs font-extrabold'
                      : isBasic
                      ? 'bg-cream-200 text-graphite-400 cursor-not-allowed opacity-60'
                      : 'bg-cream-100 text-graphite-800 hover:bg-honey-100 border border-cream-300'
                  }`}
                >
                  {food}
                </button>
              );
            })}
          </div>
        </div>

        {/* Textures Selector */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-graphite-600">Textura de preferência:</label>
          <div className="flex flex-wrap gap-1.5">
            {textures.map((tex) => {
              const isSelected = selectedTexture === tex;
              return (
                <button
                  key={tex}
                  disabled={isBasic}
                  onClick={() => onTextureChange(isSelected ? '' : tex)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-forest-700 text-white shadow-2xs font-extrabold'
                      : isBasic
                      ? 'bg-cream-200 text-graphite-400 cursor-not-allowed opacity-60'
                      : 'bg-cream-100 text-graphite-800 hover:bg-forest-100 border border-cream-300'
                  }`}
                >
                  #{tex}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
