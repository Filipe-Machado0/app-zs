import React, { useEffect, useState } from 'react';
import { Utensils, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import { Recipe } from '../../types';
import { RecipeCard } from '../../components/recipes/RecipeCard';
import { RecipeFilters } from '../../components/recipes/RecipeFilters';

export const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [selectedBaseFood, setSelectedBaseFood] = useState('');
  const [selectedTexture, setSelectedTexture] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await api.getRecipes({
        search,
        mealType: selectedMeal,
        baseFood: selectedBaseFood,
        texture: selectedTexture,
      });
      setRecipes(res.recipes);
    } catch (err) {
      console.error('Erro ao carregar receitas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [search, selectedMeal, selectedBaseFood, selectedTexture]);

  const handleReset = () => {
    setSearch('');
    setSelectedMeal('');
    setSelectedBaseFood('');
    setSelectedTexture('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-0.5 rounded-full">
          Biblioteca de Ideias
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900 mt-2">
          Receitas e Variações Práticas
        </h1>
        <p className="text-xs text-graphite-600 mt-1">
          Explore receitas formuladas para partir de alimentos familiares com preparo simples.
        </p>
      </div>

      {/* Filters Component */}
      <RecipeFilters
        search={search}
        onSearchChange={setSearch}
        selectedMeal={selectedMeal}
        onMealChange={setSelectedMeal}
        selectedBaseFood={selectedBaseFood}
        onBaseFoodChange={setSelectedBaseFood}
        selectedTexture={selectedTexture}
        onTextureChange={setSelectedTexture}
        onReset={handleReset}
      />

      {/* Recipe List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="size-8 text-forest-700 animate-spin mx-auto" />
          <p className="text-xs font-bold text-graphite-600">Buscando receitas...</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-forest-100 p-6 space-y-3">
          <div className="size-12 mx-auto rounded-full bg-cream-100 flex items-center justify-center text-forest-700">
            <Utensils className="size-6" />
          </div>
          <h3 className="font-extrabold text-sm text-graphite-900">Nenhuma receita encontrada</h3>
          <p className="text-xs text-graphite-500 max-w-sm mx-auto">
            Tente remover alguns filtros ou buscar por outro termo.
          </p>
          <button
            onClick={handleReset}
            className="text-xs font-bold text-terracotta-600 hover:underline cursor-pointer pt-2"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-graphite-500 px-1">
            Exibindo {recipes.length} receitas disponíveis
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
