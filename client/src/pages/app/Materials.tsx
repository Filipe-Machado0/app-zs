import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Heart,
  CheckCircle2,
  CalendarDays,
  ShoppingBag,
  Sparkles,
  Utensils,
  Clock,
  Flame,
  AlertTriangle,
  Info,
  ChevronRight,
  X,
  Plus,
  Trash2,
  Lock,
  ArrowRight,
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

export const Materials: React.FC = () => {
  const navigate = useNavigate();
  const { isBasic, isPremium, role } = useAuth();

  // Estados principais
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const [selectedTexture, setSelectedTexture] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedAllergenFree, setSelectedAllergenFree] = useState("");
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Estados de Interação do E-book
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('ebook_favorites') || '[]');
    } catch {
      return [];
    }
  });

  const [preparedList, setPreparedList] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('ebook_prepared') || '[]');
    } catch {
      return [];
    }
  });

  const [weeklyPlan, setWeeklyPlan] = useState<Record<string, number[]>>(() => {
    try {
      return JSON.parse(localStorage.getItem('ebook_weekly_plan') || '{"segunda":[],"terca":[],"quarta":[],"quinta":[],"sexta":[],"sabado":[],"domingo":[]}');
    } catch {
      return { segunda: [], terca: [], quarta: [], quinta: [], sexta: [], sabado: [], domingo: [] };
    }
  });

  const [shoppingList, setShoppingList] = useState<Array<{ id: string; name: string; checked: boolean }>>(() => {
    try {
      return JSON.parse(localStorage.getItem('ebook_shopping_list') || '[]');
    } catch {
      return [];
    }
  });

  // Modal de Detalhe da Receita
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeEbook | null>(null);

  // Abas de visualização rápida
  const [viewMode, setViewMode] = useState<"catalogo" | "favoritos" | "preparadas" | "planejamento" | "compras">("catalogo");

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem('ebook_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ebook_prepared', JSON.stringify(preparedList));
  }, [preparedList]);

  useEffect(() => {
    localStorage.setItem('ebook_weekly_plan', JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  useEffect(() => {
    localStorage.setItem('ebook_shopping_list', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const togglePrepared = (id: number) => {
    setPreparedList(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const addToShoppingList = (recipe: RecipeEbook) => {
    const newItems = recipe.ingredientes.map((ing, idx) => ({
      id: `${recipe.id}-${idx}-${Date.now()}`,
      name: `${ing.quantidade} ${ing.unidade} de ${ing.ingrediente}`,
      checked: false
    }));
    setShoppingList(prev => [...prev, ...newItems]);
    alert(`Ingredientes de "${recipe.titulo}" adicionados à sua Lista de Compras!`);
  };

  // Filtragem de receitas
  const filteredRecipes = useMemo(() => {
    return (ebookRecipesData as RecipeEbook[]).filter(recipe => {
      // Filtro de aba
      if (viewMode === "favoritos" && !favorites.includes(recipe.id)) return false;
      if (viewMode === "preparadas" && !preparedList.includes(recipe.id)) return false;

      // Filtro de Categoria
      if (activeCategory !== "Todas" && recipe.categoria !== activeCategory) return false;

      // Filtro de Busca
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = recipe.titulo.toLowerCase().includes(query);
        const matchDesc = recipe.descricao.toLowerCase().includes(query);
        const matchIng = recipe.ingredientes.some(i => i.ingrediente.toLowerCase().includes(query));
        const matchTag = recipe.tags.some(t => t.toLowerCase().includes(query));
        const matchBase = recipe.alimento_conhecido_base.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchIng && !matchTag && !matchBase) return false;
      }

      // Filtro de Textura
      if (selectedTexture && recipe.textura !== selectedTexture) return false;

      // Filtro de Dificuldade
      if (selectedDifficulty && recipe.dificuldade !== selectedDifficulty) return false;

      return true;
    });
  }, [activeCategory, search, selectedTexture, selectedDifficulty, viewMode, favorites, preparedList]);

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      
      {/* ============================================================ */}
      {/* 1. CABEÇALHO DO E-BOOK DIGITAL INTERATIVO                    */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl border-2 border-[#DCEFE4] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="size-16 sm:size-20 rounded-3xl bg-[#FFF9EE] border-2 border-[#F4D68A] flex items-center justify-center text-4xl shadow-inner shrink-0">
            📖
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full inline-block">
                E-book Digital Interativo
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                200 Receitas Oficiais
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#116B4C] font-display">
              Cardápio Seletivo — 200 Receitas Práticas
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5B53] font-bold">
              Ideias simples a partir dos alimentos que a criança já conhece para variar sem pressão 🌱
            </p>
          </div>
        </div>

        {/* AVISO DE SEGURANÇA E ALERGIAS OBRIGATÓRIO */}
        <div className="bg-[#FFFDF4] border-2 border-[#F4D68A] rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="size-5 text-[#8A6318] shrink-0 mt-0.5" />
          <div className="text-xs text-[#5A4310] leading-relaxed">
            <strong className="font-black text-[#7A550A] block mb-0.5">
              ⚠️ Orientações Importantes de Segurança e Alergias:
            </strong>
            Este material oferece ideias culinárias gerais e <strong>não substitui orientação de pediatra, nutricionista ou fonoaudiólogo</strong>. Verifique alergias, intolerâncias e corte os alimentos de forma segura para evitar engasgos. Experimentar deve ser sempre um convite gentil, nunca uma obrigação.
          </div>
        </div>

        {/* Barra de Menus do E-book */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#DCEFE4]/60">
          <button
            onClick={() => setViewMode("catalogo")}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black transition-all ${
              viewMode === "catalogo"
                ? "bg-[#116B4C] text-white shadow-xs"
                : "bg-cream-100 text-forest-800 hover:bg-forest-100"
            }`}
          >
            📚 Todas as 200 Receitas
          </button>

          <button
            onClick={() => setViewMode("favoritos")}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              viewMode === "favoritos"
                ? "bg-red-500 text-white shadow-xs"
                : "bg-cream-100 text-forest-800 hover:bg-red-50"
            }`}
          >
            <Heart className="size-3.5 fill-current" />
            <span>Favoritas ({favorites.length})</span>
          </button>

          <button
            onClick={() => setViewMode("preparadas")}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              viewMode === "preparadas"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-cream-100 text-forest-800 hover:bg-emerald-50"
            }`}
          >
            <CheckCircle2 className="size-3.5" />
            <span>Já Preparei ({preparedList.length})</span>
          </button>

          <button
            onClick={() => setViewMode("planejamento")}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              viewMode === "planejamento"
                ? "bg-[#E66B2E] text-white shadow-xs"
                : "bg-cream-100 text-forest-800 hover:bg-orange-50"
            }`}
          >
            <CalendarDays className="size-3.5" />
            <span>Meu Planejamento Semanal</span>
          </button>

          <button
            onClick={() => setViewMode("compras")}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              viewMode === "compras"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-cream-100 text-forest-800 hover:bg-purple-50"
            }`}
          >
            <ShoppingBag className="size-3.5" />
            <span>Lista de Compras ({shoppingList.length})</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. VISUALIZAÇÃO: PLANEJAMENTO SEMANAL                         */}
      {/* ============================================================ */}
      {viewMode === "planejamento" && (
        <div className="bg-white rounded-3xl border-2 border-[#DCEFE4] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCEFE4] pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#116B4C]">
                🗓️ Planejador de Refeições da Semana
              </h2>
              <p className="text-xs text-graphite-600">
                Selecione as receitas que deseja preparar para cada dia da semana.
              </p>
            </div>
            <button
              onClick={() => setViewMode("catalogo")}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              + Adicionar Receitas do E-book
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"].map(dia => {
              const ids = weeklyPlan[dia] || [];
              const dayRecipes = (ebookRecipesData as RecipeEbook[]).filter(r => ids.includes(r.id));

              return (
                <div key={dia} className="bg-[#FFFDF9] rounded-2xl border-2 border-[#EADFCB] p-3 space-y-2">
                  <span className="text-xs font-black uppercase text-[#116B4C] block text-center border-b border-border pb-1">
                    {dia}
                  </span>

                  {dayRecipes.length === 0 ? (
                    <p className="text-[10px] text-muted-foreground text-center py-4 italic">
                      Nenhuma receita
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {dayRecipes.map(r => (
                        <div key={r.id} className="bg-white p-2 rounded-xl border text-[11px] font-bold text-[#26332D] relative group">
                          <p className="truncate pr-4">{r.titulo}</p>
                          <button
                            onClick={() => {
                              setWeeklyPlan(prev => ({
                                ...prev,
                                [dia]: prev[dia].filter(id => id !== r.id)
                              }));
                            }}
                            className="absolute right-1 top-1 text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <X className="size-3" />
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
      )}

      {/* ============================================================ */}
      {/* 3. VISUALIZAÇÃO: LISTA DE COMPRAS                             */}
      {/* ============================================================ */}
      {viewMode === "compras" && (
        <div className="bg-white rounded-3xl border-2 border-[#DCEFE4] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCEFE4] pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#116B4C]">
                🛒 Minha Lista de Compras do E-book
              </h2>
              <p className="text-xs text-graphite-600">
                Itens reunidos a partir das receitas que você selecionou.
              </p>
            </div>
            {shoppingList.length > 0 && (
              <button
                onClick={() => setShoppingList([])}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="size-3.5" />
                <span>Limpar Lista</span>
              </button>
            )}
          </div>

          {shoppingList.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <span className="text-4xl">🧺</span>
              <p className="text-xs sm:text-sm font-bold text-graphite-600">
                Sua lista de compras está vazia.
              </p>
              <button
                onClick={() => setViewMode("catalogo")}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Navegar pelas receitas e adicionar ingredientes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {shoppingList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setShoppingList(prev => prev.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i));
                  }}
                  className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    item.checked
                      ? "bg-gray-50 border-gray-200 text-gray-400 line-through"
                      : "bg-[#FFFDF9] border-[#DCEFE4] text-[#26332D] font-bold"
                  }`}
                >
                  <span className="text-xs">{item.name}</span>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="rounded text-emerald-600 focus:ring-0 size-4"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. BARRA DE BUSCA E FILTROS DE CATEGORIA                     */}
      {/* ============================================================ */}
      {(viewMode === "catalogo" || viewMode === "favoritos" || viewMode === "preparadas") && (
        <>
          <div className="space-y-3">
            {/* Barra de Busca */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-emerald-700" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por alimento (ex: banana, arroz, frango, batata)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-2 border-[#DCEFE4] focus:border-[#116B4C] outline-none text-xs sm:text-sm font-bold shadow-xs transition-all"
              />
            </div>

            {/* Categorias em Pílulas */}
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

          {/* ============================================================ */}
          {/* 5. GRADE DE CARDS DAS RECEITAS                               */}
          {/* ============================================================ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-graphite-600 font-bold px-1">
              <span>Mostrando <strong>{filteredRecipes.length}</strong> receitas</span>
              {(selectedTexture || selectedDifficulty) && (
                <button
                  onClick={() => { setSelectedTexture(""); setSelectedDifficulty(""); }}
                  className="text-red-500 hover:underline cursor-pointer"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => {
                const isFav = favorites.includes(recipe.id);
                const isPrep = preparedList.includes(recipe.id);

                return (
                  <div
                    key={recipe.id}
                    className="bg-white rounded-3xl border-2 border-[#DCEFE4] p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-400 hover:shadow-md transition-all group"
                  >
                    <div className="space-y-2.5">
                      {/* Categoria + Dificuldade */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          {recipe.categoria}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleFavorite(recipe.id)}
                            title="Favoritar receita"
                            className={`cursor-pointer p-1.5 rounded-full transition-colors ${
                              isFav ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500"
                            }`}
                          >
                            <Heart className={`size-4 ${isFav ? "fill-current" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Título & Descrição */}
                      <div>
                        <h3 className="text-base font-black text-[#116B4C] leading-snug group-hover:text-emerald-800 transition-colors">
                          {recipe.titulo}
                        </h3>
                        <p className="text-xs text-graphite-600 mt-1 line-clamp-2 leading-relaxed">
                          {recipe.descricao}
                        </p>
                      </div>

                      {/* Badges de Atributos */}
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-[#4A5B53]">
                        <span className="bg-[#FFF9EE] border border-[#F4D68A] px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="size-3 text-amber-600" />
                          {recipe.tempo_preparo_minutos} min
                        </span>
                        <span className="bg-[#F2FAF6] border border-[#DCEFE4] px-2 py-0.5 rounded-md">
                          Textura: {recipe.textura}
                        </span>
                      </div>

                      {/* Alimento Seguro x Variação */}
                      <div className="bg-[#FFFDF9] rounded-xl p-2.5 border border-dashed border-[#B5DFC7] text-[11px] space-y-0.5">
                        <p className="text-graphite-700">
                          🌱 <strong>Ponto de partida:</strong> {recipe.alimento_conhecido_base}
                        </p>
                      </div>
                    </div>

                    {/* Botão de Ver Detalhes */}
                    <div className="pt-2 border-t border-[#DCEFE4]/60 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRecipe(recipe)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#116B4C] hover:bg-[#0e543b] text-white text-xs font-black uppercase tracking-wider text-center cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Ver Receita Completa</span>
                        <ChevronRight className="size-3.5" />
                      </button>

                      <button
                        onClick={() => togglePrepared(recipe.id)}
                        title={isPrep ? "Receita já preparada" : "Marcar como preparada"}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${
                          isPrep
                            ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                            : "bg-gray-50 border-gray-200 text-gray-400 hover:text-emerald-700"
                        }`}
                      >
                        <CheckCircle2 className="size-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* 6. MODAL DETALHE COMPLETO DA RECEITA                         */}
      {/* ============================================================ */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-2 border-[#DCEFE4] max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in">
            
            {/* Topo do Modal */}
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

            {/* Informações Rápidas */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#FFF9EE] p-2.5 rounded-2xl border border-[#F4D68A]">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Tempo</span>
                <strong className="text-graphite-900">{selectedRecipe.tempo_preparo_minutos} minutos</strong>
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

            {/* Ingredientes */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-black text-[#116B4C] uppercase tracking-wide">
                🛒 Ingredientes Necessários:
              </h3>
              <div className="bg-[#FAFCFA] rounded-2xl border border-[#DCEFE4] p-4 space-y-2 text-xs">
                {selectedRecipe.ingredientes.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-graphite-800 font-bold">
                    <span className="size-1.5 rounded-full bg-emerald-600" />
                    <span>{ing.quantidade} {ing.unidade} de {ing.ingrediente}</span>
                  </div>
                ))}
              </div>
              {selectedRecipe.substituicoes && (
                <p className="text-[11px] text-graphite-600 italic">
                  💡 <strong>Substituição sugerida:</strong> {selectedRecipe.substituicoes}
                </p>
              )}
            </div>

            {/* Modo de Preparo */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-black text-[#116B4C] uppercase tracking-wide">
                👩‍🍳 Modo de Preparo Passo a Passo:
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

            {/* Seção Sem Pressão: Experimente uma pequena mudança */}
            <div className="bg-[#EBF7F0] rounded-2xl p-4 border border-[#B5DFC7] space-y-1 text-xs">
              <strong className="font-black text-[#116B4C] block flex items-center gap-1.5">
                ✨ Experimente uma Pequena Mudança (Sem Pressão):
              </strong>
              <p className="text-[#2A4D3B] leading-relaxed">
                {selectedRecipe.apresentacao_suave}
              </p>
              <p className="text-[11px] text-emerald-800 font-bold pt-1">
                👉 Variação recomendada: {selectedRecipe.pequena_variacao}
              </p>
            </div>

            {/* Alergênicos e Armazenamento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-graphite-700">
              <div className="bg-[#FFF8E7] p-3 rounded-2xl border border-[#F4D68A] space-y-0.5">
                <span className="font-bold text-[#7A550A] block">⚠️ Alergênicos:</span>
                <p>{selectedRecipe.alergenos.join(', ')}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 space-y-0.5">
                <span className="font-bold text-gray-800 block">🧊 Congelamento e Conservação:</span>
                <p>{selectedRecipe.congelamento}</p>
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="pt-3 border-t border-[#DCEFE4] flex flex-wrap gap-2.5">
              <button
                onClick={() => addToShoppingList(selectedRecipe)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#E66B2E] hover:bg-[#d55e24] text-white font-black text-xs uppercase tracking-wide cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="size-4" />
                <span>Adicionar à Lista de Compras</span>
              </button>

              <button
                onClick={() => {
                  const dia = prompt("Para qual dia da semana deseja adicionar? (segunda, terca, quarta, quinta, sexta, sabado, domingo)")?.toLowerCase();
                  if (dia && weeklyPlan[dia] !== undefined) {
                    setWeeklyPlan(prev => ({
                      ...prev,
                      [dia]: [...(prev[dia] || []), selectedRecipe.id]
                    }));
                    alert(`Receita adicionada para ${dia}!`);
                  }
                }}
                className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wide cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CalendarDays className="size-4" />
                <span>Planejar</span>
              </button>

              <button
                onClick={() => toggleFavorite(selectedRecipe.id)}
                className={`py-3 px-4 rounded-xl border font-black text-xs cursor-pointer transition-colors flex items-center gap-1.5 ${
                  favorites.includes(selectedRecipe.id)
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <Heart className={`size-4 ${favorites.includes(selectedRecipe.id) ? "fill-current text-red-500" : ""}`} />
                <span>{favorites.includes(selectedRecipe.id) ? "Favoritada" : "Favoritar"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

