import { auth } from '../services/firebase';
import {
  UserProfile,
  Recipe,
  MealPlan,
  ShoppingList,
  ShoppingListItem,
  SupportArticle,
  SupportRequest,
  ContentAsset,
} from '../types';

const API_BASE = '/api';

async function getHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('Erro ao obter token do Firebase:', err);
  }

  // Fallback demo user ID if in local demo mode without active Firebase token
  const localDemoUid = localStorage.getItem('demo_user_uid');
  if (localDemoUid && !headers['Authorization']) {
    headers['x-demo-user-id'] = localDemoUid;
  }

  return headers;
}

export const api = {
  // --- Auth & Profile ---
  async getProfile(): Promise<{ profile: UserProfile | null }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/auth/me`, { headers });
    if (!res.ok) throw new Error('Erro ao buscar perfil');
    return res.json();
  },

  async syncProfile(data: { uid: string; email: string; displayName?: string }): Promise<{ profile: UserProfile }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/auth/sync`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao sincronizar perfil');
    return res.json();
  },

  async updatePreferences(preferences: UserProfile['preferences']): Promise<{ profile: UserProfile }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/auth/preferences`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ preferences }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar preferências');
    return res.json();
  },

  // --- Recipes ---
  async getRecipes(params?: { search?: string; mealType?: string; baseFood?: string; texture?: string }): Promise<{ recipes: Recipe[]; userRole: string }> {
    const headers = await getHeaders();
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.mealType) query.set('mealType', params.mealType);
    if (params?.baseFood) query.set('baseFood', params.baseFood);
    if (params?.texture) query.set('texture', params.texture);

    const res = await fetch(`${API_BASE}/recipes?${query.toString()}`, { headers });
    if (!res.ok) throw new Error('Erro ao carregar receitas');
    return res.json();
  },

  async getRecipeById(id: string): Promise<{ recipe: Recipe; isLocked: boolean; reason?: string }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/recipes/${id}`, { headers });
    if (!res.ok) throw new Error('Erro ao carregar detalhes da receita');
    return res.json();
  },

  // --- Planner (Premium) ---
  async getMealPlan(): Promise<{ plan: MealPlan }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/planner`, { headers });
    if (!res.ok) throw new Error('Erro ao carregar planejamento');
    return res.json();
  },

  async updateMealPlan(planData: Partial<MealPlan>): Promise<{ plan: MealPlan }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/planner`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(planData),
    });
    if (!res.ok) throw new Error('Erro ao atualizar planejamento');
    return res.json();
  },

  // --- Shopping List (Premium) ---
  async getShoppingList(): Promise<{ list: ShoppingList }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/shopping`, { headers });
    if (!res.ok) throw new Error('Erro ao carregar lista de compras');
    return res.json();
  },

  async updateShoppingList(items: ShoppingListItem[]): Promise<{ list: ShoppingList }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/shopping`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error('Erro ao salvar lista de compras');
    return res.json();
  },

  async syncShoppingFromPlan(): Promise<{ list: ShoppingList; message: string }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/shopping/sync-from-plan`, {
      method: 'POST',
      headers,
    });
    if (!res.ok) throw new Error('Erro ao sincronizar lista com o planejamento');
    return res.json();
  },

  // --- Materials & Assets ---
  async getMaterials(): Promise<{ assets: ContentAsset[]; userRole: string }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/materials`, { headers });
    if (!res.ok) throw new Error('Erro ao carregar materiais');
    return res.json();
  },

  async getMaterialDownloadUrl(assetId: string): Promise<{ downloadUrl: string; asset: ContentAsset }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/materials/${assetId}/download`, { headers });
    if (!res.ok) throw new Error('Acesso não autorizado ao material ou erro no servidor');
    return res.json();
  },

  // --- Support & FAQ ---
  async getSupportArticles(): Promise<{ articles: SupportArticle[] }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/support/articles`, { headers });
    if (!res.ok) throw new Error('Erro ao buscar artigos de suporte');
    return res.json();
  },

  async createSupportRequest(data: { subject: string; message: string }): Promise<{ request: SupportRequest }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/support/requests`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao enviar mensagem de suporte');
    return res.json();
  },

  async getUserSupportRequests(): Promise<{ requests: SupportRequest[] }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/support/my-requests`, { headers });
    if (!res.ok) throw new Error('Erro ao carregar chamados');
    return res.json();
  },

  // --- Admin ---
  async getAdminStats(): Promise<any> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/admin/stats`, { headers });
    if (!res.ok) throw new Error('Erro ao carregar métricas administrativas');
    return res.json();
  },

  async getAdminUsers(): Promise<{ users: UserProfile[] }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/admin/users`, { headers });
    if (!res.ok) throw new Error('Erro ao carregar usuários');
    return res.json();
  },

  async grantUserAccess(data: { targetUserId: string; role: 'none' | 'basic' | 'premium'; reason: string }): Promise<{ user: UserProfile }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/admin/users/grant-access`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao atualizar permissão de acesso');
    return res.json();
  },

  async saveRecipe(recipe: Partial<Recipe>): Promise<{ recipe: Recipe }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/admin/recipes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(recipe),
    });
    if (!res.ok) throw new Error('Erro ao salvar receita');
    return res.json();
  },

  async deleteRecipe(id: string): Promise<{ success: boolean }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/admin/recipes/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error('Erro ao excluir receita');
    return res.json();
  },

  async getAdminSupportRequests(): Promise<{ requests: SupportRequest[] }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/admin/support`, { headers });
    if (!res.ok) throw new Error('Erro ao carregar fila de suporte');
    return res.json();
  },

  async replySupportRequest(requestId: string, reply: string): Promise<{ request: SupportRequest }> {
    const headers = await getHeaders();
    const res = await fetch(`${API_BASE}/admin/support/${requestId}/reply`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reply }),
    });
    if (!res.ok) throw new Error('Erro ao responder solicitação');
    return res.json();
  },
};
