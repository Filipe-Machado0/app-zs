import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Users,
  Utensils,
  MessageSquare,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Search,
  KeyRound,
  Send,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { Recipe, UserProfile, SupportRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'metrics' | 'recipes' | 'users' | 'support'>('metrics');
  const [stats, setStats] = useState<any>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [recipeSearch, setRecipeSearch] = useState('');

  // Manual Grant Modal
  const [grantModal, setGrantModal] = useState<{ open: boolean; targetUser: UserProfile | null }>({
    open: false,
    targetUser: null,
  });
  const [grantRole, setGrantRole] = useState<'basic' | 'premium' | 'none'>('premium');
  const [grantReason, setGrantReason] = useState('');

  // Support Reply Modal
  const [replyModal, setReplyModal] = useState<{ open: boolean; request: SupportRequest | null }>({
    open: false,
    request: null,
  });
  const [adminReplyText, setAdminReplyText] = useState('');

  // Recipe Edit Modal
  const [recipeModal, setRecipeModal] = useState<{ open: boolean; recipe: Partial<Recipe> | null }>({
    open: false,
    recipe: null,
  });

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, recipesRes, usersRes, supportRes] = await Promise.all([
        api.getAdminStats(),
        api.getRecipes(),
        api.getAdminUsers(),
        api.getAdminSupportRequests(),
      ]);
      setStats(statsRes);
      setRecipes(recipesRes.recipes);
      setUsers(usersRes.users);
      setSupportRequests(supportRes.requests);
    } catch (err) {
      console.error('Erro ao carregar dados do admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantModal.targetUser) return;

    try {
      await api.grantUserAccess({
        targetUserId: grantModal.targetUser.uid,
        role: grantRole,
        reason: grantReason || 'Liberação manual pelo painel administrativo',
      });
      alert('Acesso atualizado com sucesso!');
      setGrantModal({ open: false, targetUser: null });
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar permissão.');
    }
  };

  const handleReplySupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModal.request || !adminReplyText.trim()) return;

    try {
      await api.replySupportRequest(replyModal.request.id, adminReplyText.trim());
      alert('Resposta enviada com sucesso!');
      setReplyModal({ open: false, request: null });
      setAdminReplyText('');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Erro ao responder solicitação.');
    }
  };

  const handleSaveRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeModal.recipe?.title) return;

    try {
      await api.saveRecipe(recipeModal.recipe);
      alert('Receita salva com sucesso!');
      setRecipeModal({ open: false, recipe: null });
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar receita.');
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!window.confirm('Deseja realmente excluir esta receita?')) return;
    try {
      await api.deleteRecipe(id);
      setRecipes(recipes.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir receita.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="py-20 text-center space-y-4">
        <ShieldAlert className="size-12 text-terracotta-600 mx-auto" />
        <h2 className="text-xl font-extrabold text-graphite-900">Acesso Restrito ao Administrador</h2>
        <p className="text-xs text-graphite-600 max-w-sm mx-auto">
          Esta área é restrita a administradores autenticados com credenciais do sistema.
        </p>
        <button
          onClick={() => navigate('/app')}
          className="px-4 py-2 rounded-xl bg-forest-800 text-forest-100 text-xs font-bold"
        >
          Voltar para o App
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="size-8 text-forest-700 animate-spin mx-auto" />
        <p className="text-xs font-bold text-graphite-600">Carregando painel de administração...</p>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.uid.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredRecipes = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.baseFood.toLowerCase().includes(recipeSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-graphite-900 text-honey-300">
              <ShieldAlert className="size-5" />
            </span>
            <h1 className="text-xl font-extrabold text-graphite-900">Painel Administrativo</h1>
          </div>
          <p className="text-xs text-graphite-500 mt-1">
            Gestão de receitas, usuários, liberações de compra e atendimento ao suporte.
          </p>
        </div>

        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 border border-forest-100 text-graphite-700 hover:bg-forest-100 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Ver App como Usuário</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 border-b border-forest-100 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'metrics' ? 'bg-forest-800 text-white' : 'bg-white text-graphite-700 hover:bg-forest-50'
          }`}
        >
          📊 Métricas & Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('recipes')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'recipes' ? 'bg-forest-800 text-white' : 'bg-white text-graphite-700 hover:bg-forest-50'
          }`}
        >
          🍲 Gerenciar Receitas ({recipes.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'users' ? 'bg-forest-800 text-white' : 'bg-white text-graphite-700 hover:bg-forest-50'
          }`}
        >
          👥 Usuários & Compras ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'support' ? 'bg-forest-800 text-white' : 'bg-white text-graphite-700 hover:bg-forest-50'
          }`}
        >
          💬 Chamados de Suporte ({supportRequests.length})
        </button>
      </div>

      {/* TAB 1: METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-forest-100 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-graphite-400 uppercase">Total de Usuários</span>
              <p className="text-2xl font-extrabold text-forest-900">{stats?.totalUsers || users.length}</p>
            </div>
            <div className="p-5 bg-white rounded-3xl border border-forest-100 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-forest-700 uppercase">Plano Premium (R$19)</span>
              <p className="text-2xl font-extrabold text-forest-800">{stats?.premiumUsers || 0}</p>
            </div>
            <div className="p-5 bg-white rounded-3xl border border-forest-100 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-terracotta-600 uppercase">Plano Básico (R$10)</span>
              <p className="text-2xl font-extrabold text-terracotta-600">{stats?.basicUsers || 0}</p>
            </div>
            <div className="p-5 bg-white rounded-3xl border border-forest-100 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-graphite-400 uppercase">Chamados Abertos</span>
              <p className="text-2xl font-extrabold text-graphite-800">{stats?.openSupport || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECIPES CRUD */}
      {activeTab === 'recipes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Buscar receita por título ou base..."
              value={recipeSearch}
              onChange={(e) => setRecipeSearch(e.target.value)}
              className="text-xs p-2.5 rounded-xl bg-white border border-forest-100 focus:outline-none max-w-sm w-full"
            />
            <button
              onClick={() =>
                setRecipeModal({
                  open: true,
                  recipe: {
                    title: '',
                    summary: '',
                    mealType: 'almoco',
                    baseFood: 'Batata',
                    prepTimeMinutes: 20,
                    difficulty: 'facil',
                    textures: ['macio'],
                    formats: ['palitinho'],
                    familiarStart: '',
                    subtleVariation: '',
                    tier: 'basic',
                    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
                    ingredients: [],
                    steps: [],
                  },
                })
              }
              className="px-4 py-2 rounded-xl bg-forest-800 text-forest-100 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Nova Receita</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-forest-100 shadow-2xs overflow-hidden divide-y divide-forest-100/60">
            {filteredRecipes.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={r.imageUrl} alt={r.title} className="size-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-extrabold text-xs text-graphite-900">{r.title}</h4>
                    <p className="text-[10px] text-graphite-500">
                      Plano: <strong>{r.tier}</strong> • Base: {r.baseFood} • {r.prepTimeMinutes} min
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRecipeModal({ open: true, recipe: r })}
                    className="p-2 rounded-lg bg-cream-100 hover:bg-forest-100 text-forest-800 text-xs font-bold transition-colors"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteRecipe(r.id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USERS & PERMISSIONS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Buscar por e-mail, nome ou UID..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="text-xs p-2.5 rounded-xl bg-white border border-forest-100 focus:outline-none max-w-sm w-full"
          />

          <div className="bg-white rounded-3xl border border-forest-100 shadow-2xs overflow-hidden divide-y divide-forest-100/60">
            {filteredUsers.map((u) => (
              <div key={u.uid} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-xs text-graphite-900">{u.displayName}</p>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        u.role === 'premium'
                          ? 'bg-forest-100 text-forest-900'
                          : u.role === 'basic'
                          ? 'bg-honey-100 text-graphite-800'
                          : u.role === 'admin'
                          ? 'bg-graphite-900 text-white'
                          : 'bg-cream-200 text-graphite-500'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-graphite-500 mt-0.5">{u.email}</p>
                </div>

                <button
                  onClick={() => {
                    setGrantModal({ open: true, targetUser: u });
                    setGrantRole(u.role === 'admin' ? 'premium' : (u.role as any));
                  }}
                  className="px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <KeyRound className="size-3.5" />
                  <span>Alterar Acesso</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPORT TICKETS */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-forest-100 shadow-2xs divide-y divide-forest-100/60 overflow-hidden">
            {supportRequests.map((req) => (
              <div key={req.id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        req.status === 'respondido'
                          ? 'bg-forest-100 text-forest-900'
                          : 'bg-terracotta-50 text-terracotta-700'
                      }`}
                    >
                      {req.status}
                    </span>
                    <h3 className="font-extrabold text-sm text-graphite-900 mt-1">{req.subject}</h3>
                    <p className="text-[11px] text-graphite-500">
                      De: {req.userName} ({req.userEmail}) • {new Date(req.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setReplyModal({ open: true, request: req });
                      setAdminReplyText(req.adminReply || '');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-forest-800 text-forest-100 text-xs font-bold"
                  >
                    Responder
                  </button>
                </div>

                <div className="p-3 bg-cream-100 rounded-2xl text-xs text-graphite-800 whitespace-pre-line">
                  {req.message}
                </div>

                {req.adminReply && (
                  <div className="p-3 bg-forest-50 rounded-2xl text-xs text-forest-950 border border-forest-100">
                    <p className="font-bold text-[10px] text-forest-800 uppercase">Resposta do Administrador:</p>
                    <p className="mt-1">{req.adminReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grant Modal */}
      {grantModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleGrantAccess} className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-forest-100">
            <h3 className="font-extrabold text-base text-forest-900">Alterar Papel de Acesso</h3>
            <p className="text-xs text-graphite-500">
              Usuário: <strong>{grantModal.targetUser?.email}</strong>
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-graphite-800">Novo Papel:</label>
              <select
                value={grantRole}
                onChange={(e) => setGrantRole(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-cream-100 border border-forest-100 text-xs font-bold"
              >
                <option value="none">Nenhum (Pendente)</option>
                <option value="basic">Plano Básico (R$ 10)</option>
                <option value="premium">Plano Premium (R$ 19)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-graphite-800">Motivo (para auditoria):</label>
              <input
                type="text"
                required
                placeholder="Ex: Liberação manual comprovante PIX"
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-cream-100 border border-forest-100 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGrantModal({ open: false, targetUser: null })}
                className="w-1/2 py-2.5 rounded-xl bg-cream-100 text-xs font-bold text-graphite-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-forest-800 text-white text-xs font-extrabold shadow-xs"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Support Reply Modal */}
      {replyModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleReplySupport} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-forest-100">
            <h3 className="font-extrabold text-base text-forest-900">Responder Chamado</h3>
            <p className="text-xs text-graphite-500">
              Assunto: <strong>{replyModal.request?.subject}</strong>
            </p>

            <textarea
              rows={5}
              required
              placeholder="Digite a resposta que será enviada ao responsável..."
              value={adminReplyText}
              onChange={(e) => setAdminReplyText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none"
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReplyModal({ open: false, request: null })}
                className="w-1/2 py-2.5 rounded-xl bg-cream-100 text-xs font-bold text-graphite-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-forest-800 text-white text-xs font-extrabold shadow-xs"
              >
                Enviar Resposta
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recipe Modal */}
      {recipeModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveRecipe} className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-forest-100 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-forest-900">
              {recipeModal.recipe?.id ? 'Editar Receita' : 'Nova Receita'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-graphite-800">Título da Receita:</label>
                <input
                  type="text"
                  required
                  value={recipeModal.recipe?.title || ''}
                  onChange={(e) => setRecipeModal({ ...recipeModal, recipe: { ...recipeModal.recipe, title: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-cream-100 border border-forest-100 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-graphite-800">Resumo Acolhedor:</label>
                <textarea
                  rows={2}
                  value={recipeModal.recipe?.summary || ''}
                  onChange={(e) => setRecipeModal({ ...recipeModal, recipe: { ...recipeModal.recipe, summary: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-cream-100 border border-forest-100 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-graphite-800">Plano Necessário:</label>
                  <select
                    value={recipeModal.recipe?.tier || 'basic'}
                    onChange={(e) => setRecipeModal({ ...recipeModal, recipe: { ...recipeModal.recipe, tier: e.target.value as any } })}
                    className="w-full p-2.5 rounded-xl bg-cream-100 border border-forest-100 mt-1 font-bold"
                  >
                    <option value="basic">Plano Básico</option>
                    <option value="premium">Plano Premium</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-graphite-800">Alimento Base:</label>
                  <input
                    type="text"
                    value={recipeModal.recipe?.baseFood || ''}
                    onChange={(e) => setRecipeModal({ ...recipeModal, recipe: { ...recipeModal.recipe, baseFood: e.target.value } })}
                    className="w-full p-2.5 rounded-xl bg-cream-100 border border-forest-100 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-graphite-800">URL da Foto:</label>
                <input
                  type="text"
                  value={recipeModal.recipe?.imageUrl || ''}
                  onChange={(e) => setRecipeModal({ ...recipeModal, recipe: { ...recipeModal.recipe, imageUrl: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-cream-100 border border-forest-100 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-graphite-800">Ponto de Partida Conhecido:</label>
                <input
                  type="text"
                  value={recipeModal.recipe?.familiarStart || ''}
                  onChange={(e) => setRecipeModal({ ...recipeModal, recipe: { ...recipeModal.recipe, familiarStart: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-cream-100 border border-forest-100 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-graphite-800">Pequena Variação Sugerida:</label>
                <input
                  type="text"
                  value={recipeModal.recipe?.subtleVariation || ''}
                  onChange={(e) => setRecipeModal({ ...recipeModal, recipe: { ...recipeModal.recipe, subtleVariation: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-cream-100 border border-forest-100 mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRecipeModal({ open: false, recipe: null })}
                className="w-1/2 py-2.5 rounded-xl bg-cream-100 text-xs font-bold text-graphite-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-forest-800 text-white text-xs font-extrabold shadow-xs"
              >
                Salvar Receita
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
