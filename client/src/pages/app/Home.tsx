import React, { useEffect, useState } from 'react';
import { Sparkles, Utensils, CalendarDays, ShoppingBag, BookOpen, ArrowRight, Clock, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api/client';
import { Recipe } from '../../types';
import { RecipeCard } from '../../components/recipes/RecipeCard';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isBasic, isPremium, role } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

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

  const featuredRecipe = recipes[0];
  const quickRecipes = recipes.slice(1, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Greeting & Core Mindset */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-0.5 rounded-full inline-block">
              {role === 'basic' ? 'Plano Básico Ativo' : 'Plano Premium Vitalício'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900 mt-2">
              Olá, {profile?.displayName?.split(' ')[0] || 'família'}! 🌱
            </h1>
            <p className="text-xs text-graphite-600 mt-0.5">
              Vamos partir do que já funciona na sua casa, sem pressa.
            </p>
          </div>

          {profile?.preferences?.weeklyGoal && (
            <div className="p-3 bg-cream-100 rounded-2xl border border-forest-100/70 text-xs text-graphite-800 sm:max-w-xs space-y-0.5">
              <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider">🎯 Seu objetivo da semana:</span>
              <p className="text-[11px] font-semibold text-graphite-700 italic">
                "{profile.preferences.weeklyGoal}"
              </p>
            </div>
          )}
        </div>

        {/* Central Card Motto */}
        <div className="p-4 rounded-2xl bg-forest-800 text-forest-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-forest-700 flex items-center justify-center text-honey-300 shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-white">
                “Comece pelo conhecido e mude apenas um detalhe.”
              </p>
              <p className="text-[11px] text-forest-200 mt-0.5">
                Uma pequena mudança de formato ou temperatura já é uma grande conquista.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => navigate('/app/receitas')}
          className="bg-white p-4 rounded-3xl border border-forest-100 hover:border-forest-300 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="size-10 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Utensils className="size-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-graphite-900">Biblioteca</h3>
            <p className="text-[10px] text-graphite-500">200+ receitas</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/app/planejar')}
          className="bg-white p-4 rounded-3xl border border-forest-100 hover:border-forest-300 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="size-10 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CalendarDays className="size-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-graphite-900">Planejamento</h3>
            <p className="text-[10px] text-graphite-500">Segunda a Domingo</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/app/compras')}
          className="bg-white p-4 rounded-3xl border border-forest-100 hover:border-forest-300 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="size-10 rounded-2xl bg-honey-100 text-graphite-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-graphite-900">Lista Compras</h3>
            <p className="text-[10px] text-graphite-500">Auto consolidada</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/app/materiais')}
          className="bg-white p-4 rounded-3xl border border-forest-100 hover:border-forest-300 hover:shadow-xs transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="size-10 rounded-2xl bg-forest-100 text-forest-900 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-graphite-900">E-book & Bônus</h3>
            <p className="text-[10px] text-graphite-500">Leitor e PDFs</p>
          </div>
        </button>
      </div>

      {/* Featured Recipe / Daily Gentle Variation */}
      {featuredRecipe && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-forest-100/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <h2 className="font-extrabold text-sm sm:text-base text-forest-900">
                O que podemos testar hoje?
              </h2>
            </div>
            <span className="text-[10px] font-bold text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full">
              Sugestão Acolhedora
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-12 items-center">
            <div className="md:col-span-5 aspect-[16/10] rounded-2xl overflow-hidden bg-cream-200">
              <img
                src={featuredRecipe.imageUrl}
                alt={featuredRecipe.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-7 space-y-3">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-graphite-900">
                  {featuredRecipe.title}
                </h3>
                <p className="text-xs text-graphite-600 mt-1 leading-relaxed">
                  {featuredRecipe.summary}
                </p>
              </div>

              {/* Familiar Start vs Subtle Variation Pill */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-cream-100 border border-forest-100 text-xs">
                <p className="text-[11px] font-bold text-graphite-700">
                  🔹 <strong>Ponto de partida conhecido:</strong> {featuredRecipe.familiarStart}
                </p>
                <p className="text-[11px] font-bold text-forest-800">
                  🔸 <strong>Pequena variação sutil:</strong> {featuredRecipe.subtleVariation}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => navigate(`/app/receitas/${featuredRecipe.id}`)}
                  className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-forest-100 text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Ver Modo de Preparo</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Basic Plan Invitation Banner if role is basic */}
      {isBasic && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-forest-800 to-forest-900 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-honey-300 bg-white/10 px-2.5 py-0.5 rounded-full">
              Upgrade de Praticidade
            </span>
            <h3 className="font-extrabold text-base sm:text-lg">
              Quer liberar o Planejador Semanal e os Filtros Inteligentes?
            </h3>
            <p className="text-xs text-forest-100 leading-relaxed max-w-md">
              Com o Cardápio Seletivo Premium por apenas R$ 19 vitalício, você ganha acesso a todas as ferramentas interativas.
            </p>
          </div>

          <button
            onClick={() => navigate('/planos')}
            className="shrink-0 px-5 py-3 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Conhecer o Premium</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}

      {/* Suggested Recipes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-sm sm:text-base text-forest-900">
            Mais Ideias Práticas
          </h2>
          <button
            onClick={() => navigate('/app/receitas')}
            className="text-xs font-bold text-forest-800 hover:underline flex items-center gap-1 cursor-pointer"
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

    </div>
  );
};
