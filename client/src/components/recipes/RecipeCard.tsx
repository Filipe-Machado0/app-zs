import React from 'react';
import { Clock, ChefHat, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const navigate = useNavigate();
  const { isBasic } = useAuth();
  const isLocked = isBasic && recipe.tier === 'premium';

  const mealLabels: Record<string, string> = {
    cafe_da_manha: 'Café da Manhã',
    lanche: 'Lanche',
    almoco: 'Almoço',
    jantar: 'Jantar',
  };

  const difficultyLabels: Record<string, string> = {
    muito_facil: 'Muito Fácil',
    facil: 'Fácil',
    moderado: 'Moderado',
  };

  return (
    <div
      onClick={() => navigate(`/app/receitas/${recipe.id}`)}
      className="group bg-white rounded-3xl border border-forest-100/90 hover:border-forest-300 hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col relative"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-cream-200">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FFF9EE]/90 backdrop-blur-xs text-forest-900 border border-forest-100 shadow-2xs">
            {mealLabels[recipe.mealType] || recipe.mealType}
          </span>
          {recipe.baseFood && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-honey-100/90 text-graphite-800 border border-honey-300/40">
              Base: {recipe.baseFood}
            </span>
          )}
        </div>

        {/* Locked Badge if premium and basic user */}
        {isLocked && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-graphite-900/80 backdrop-blur-xs text-honey-300 text-[10px] font-extrabold shadow-sm">
            <Lock className="size-3" />
            <span>Premium</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-sm sm:text-base text-graphite-900 leading-snug group-hover:text-forest-800 transition-colors line-clamp-2">
            {recipe.title}
          </h3>
          <p className="text-xs text-graphite-600 line-clamp-2 leading-relaxed">
            {recipe.summary}
          </p>
        </div>

        {/* Tags de textura e formato */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {recipe.textures.slice(0, 2).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-lg bg-forest-50 text-forest-800 text-[10px] font-semibold">
              #{t}
            </span>
          ))}
          {recipe.formats.slice(0, 1).map((f) => (
            <span key={f} className="px-2 py-0.5 rounded-lg bg-terracotta-50 text-terracotta-700 text-[10px] font-semibold">
              {f}
            </span>
          ))}
        </div>

        {/* Footer info: time & difficulty */}
        <div className="pt-2 border-t border-forest-100/60 flex items-center justify-between text-[11px] text-graphite-500 font-semibold">
          <div className="flex items-center gap-1">
            <Clock className="size-3.5 text-forest-700" />
            <span>{recipe.prepTimeMinutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="size-3.5 text-forest-700" />
            <span>{difficultyLabels[recipe.difficulty] || recipe.difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
