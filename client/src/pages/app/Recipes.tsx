import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Clock,
  ChefHat,
  Heart,
  CheckCircle2,
  CalendarDays,
  ShoppingBag,
  Sparkles,
  Utensils,
  ChevronRight,
  X,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ebookRecipesData from '../../data/ebookRecipes200.json';

interface RecipeEbook {
  id: number;
  titulo: string;
  categoria: string;
  descricao: string;
  faixa_etaria: string;
  rendimento: string;
  tempo_preparo_minutos: number;
  dificuldade: string;
  textura: string;
  temperatura: string;
  ingredientes: Array<{ ingrediente: string; quantidade: string; unidade: string }>;
  substituicoes: string;
  modo_preparo: string[];
  apresentacao_suave: string;
  alimento_conhecido_base: string;
  pequena_variacao: string;
  congelamento: string;
  armazenamento: string;
  alergenos: string[];
  observacoes_de_seguranca: string;
  tags: string[];
}

const CATEGORIES_LIST = [
  "Todas",
  "Café da Manhã",
  "Lanches",
  "Almoço",
  "Jantar",
  "Docinhos e Sobremesas",
  "Bebidas e Preparos-Base"
];

export const Recipes: React.FC = () => {
  const navigate = useNavigate();
  const { isBasic, isPremium, role } = useAuth();

  const [activeCategory, setActiveCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const [selectedTexture, setSelectedTexture] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeEbook | null>(null);

  // Estados locais sincronizados
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('ebook_favorites') || '[]');
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('ebook_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredRecipes = useMemo(() => {
    return (ebookRecipesData as RecipeEbook[]).filter(recipe => {
      if (activeCategory !== "Todas" && recipe.categoria !== activeCategory) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = recipe.titulo.toLowerCase().includes(q);
        const matchDesc = recipe.descricao.toLowerCase().includes(q);
        const matchIng = recipe.ingredientes.some(i => i.ingrediente.toLowerCase().includes(q));
        const matchBase = recipe.alimento_conhecido_base.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchIng && !matchBase) return false;
      }

      if (selectedTexture && recipe.textura !== selectedTexture) return false;
      if (selectedDifficulty && recipe.dificuldade !== selectedDifficulty) return false;

      return true;
    });
  }, [activeCategory, search, selectedTexture, selectedDifficulty]);

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border-2 border-[#DCEFE4] p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-xs">
            <Utensils className="size-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full inline-block">
              Biblioteca de Receitas • Vitalício
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#116B4C] mt-1">
              Catálogo Completo das 200 Receitas
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-graphite-600 leading-relaxed max-w-2xl">
          Explore todas as 200 opções acolhedoras para café da manhã, lanches, almoço, jantar, docinhos saudáveis e preparos-base.
        </p>
      </div>

      {/* Busca e Filtros */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-emerald-700" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por ingrediente ou nome (ex: banana, mandioca, frango, aveia)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-2 border-[#DCEFE4] focus:border-[#116B4C] outline-none text-xs sm:text-sm font-bold shadow-xs transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES_LIST.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer shrink-0 px-3.5 py-2 rounded-2xl text-xs font-black transition-all ${
                activeCategory === cat
                  ? "bg-[#116B4C] text-white shadow-xs"
                  : "bg-white border border-[#DCEFE4] text-[#4A5B53] hover:bg-[#F2FAF6]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grade de Receitas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-graphite-600 font-bold px-1">
          <span>Exibindo <strong>{filteredRecipes.length}</strong> de 200 receitas</span>
          {search && (
            <button onClick={() => setSearch("")} className="text-red-500 hover:underline cursor-pointer">
              Limpar busca
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map(recipe => {
            const isFav = favorites.includes(recipe.id);
            return (
              <div
                key={recipe.id}
                className="bg-white rounded-3xl border-2 border-[#DCEFE4] p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-400 hover:shadow-md transition-all group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {recipe.categoria}
                    </span>
                    <button
                      onClick={() => toggleFavorite(recipe.id)}
                      className={`cursor-pointer p-1.5 rounded-full transition-colors ${
                        isFav ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`size-4 ${isFav ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#116B4C] leading-snug group-hover:text-emerald-800 transition-colors">
                      {recipe.titulo}
                    </h3>
                    <p className="text-xs text-graphite-600 mt-1 line-clamp-2 leading-relaxed">
                      {recipe.descricao}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-[#4A5B53]">
                    <span className="bg-[#FFF9EE] border border-[#F4D68A] px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="size-3 text-amber-600" />
                      {recipe.tempo_preparo_minutos} min
                    </span>
                    <span className="bg-[#F2FAF6] border border-[#DCEFE4] px-2 py-0.5 rounded-md">
                      {recipe.textura}
                    </span>
                  </div>

                  <div className="bg-[#FFFDF9] rounded-xl p-2.5 border border-dashed border-[#B5DFC7] text-[11px]">
                    <p className="text-graphite-700 font-medium">
                      🌱 <strong>Alimento base:</strong> {recipe.alimento_conhecido_base}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#DCEFE4]/60">
                  <button
                    onClick={() => setSelectedRecipe(recipe)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#116B4C] hover:bg-[#0e543b] text-white text-xs font-black uppercase tracking-wider text-center cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Ver Modo de Preparo</span>
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Completo de Detalhe */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-2 border-[#DCEFE4] max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in">
            <div className="flex items-start justify-between gap-4 border-b border-[#DCEFE4] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {selectedRecipe.categoria} • {selectedRecipe.faixa_etaria}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#116B4C] mt-1">
                  {selectedRecipe.titulo}
                </h2>
                <p className="text-xs sm:text-sm text-graphite-600 mt-1">
                  {selectedRecipe.descricao}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#FFF9EE] p-2.5 rounded-2xl border border-[#F4D68A]">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Tempo</span>
                <strong className="text-graphite-900">{selectedRecipe.tempo_preparo_minutos} min</strong>
              </div>
              <div className="bg-[#F2FAF6] p-2.5 rounded-2xl border border-[#DCEFE4]">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Rendimento</span>
                <strong className="text-graphite-900">{selectedRecipe.rendimento}</strong>
              </div>
              <div className="bg-[#FFFDF9] p-2.5 rounded-2xl border border-[#EADFCB]">
                <span className="text-[10px] font-bold text-purple-800 uppercase block">Textura</span>
                <strong className="text-graphite-900">{selectedRecipe.textura}</strong>
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-black text-[#116B4C] uppercase tracking-wide">
                🛒 Ingredientes:
              </h3>
              <div className="bg-[#FAFCFA] rounded-2xl border border-[#DCEFE4] p-4 space-y-2 text-xs">
                {selectedRecipe.ingredientes.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-graphite-800 font-bold">
                    <span className="size-1.5 rounded-full bg-emerald-600" />
                    <span>{ing.quantidade} {ing.unidade} de {ing.ingrediente}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-black text-[#116B4C] uppercase tracking-wide">
                👩‍🍳 Modo de Preparo:
              </h3>
              <div className="space-y-2">
                {selectedRecipe.modo_preparo.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-graphite-800 bg-[#FFFDF9] p-3 rounded-2xl border border-[#EADFCB]">
                    <span className="size-6 rounded-full bg-[#116B4C] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="font-medium pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#EBF7F0] rounded-2xl p-4 border border-[#B5DFC7] space-y-1 text-xs">
              <strong className="font-black text-[#116B4C] block">
                ✨ Variação sem pressão:
              </strong>
              <p className="text-[#2A4D3B]">{selectedRecipe.apresentacao_suave}</p>
            </div>

            <div className="pt-3 border-t border-[#DCEFE4] flex justify-end">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="py-2.5 px-6 rounded-xl bg-[#116B4C] text-white font-black text-xs uppercase tracking-wider cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

