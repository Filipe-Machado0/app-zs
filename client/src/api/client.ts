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
import {
  LOCAL_RECIPES,
  DEFAULT_MEAL_PLAN,
  DEFAULT_SHOPPING_LIST,
  DEFAULT_SUPPORT_ARTICLES,
  DEFAULT_MATERIALS,
} from '../data/localData';

const API_BASE = '/api';

async function getHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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

/**
 * Safe fetch helper that verifies response.ok and application/json headers
 * preventing HTML 200 rewrites from breaking JSON parsing
 */
async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = await getHeaders();
  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Erro na requisição: status ${res.status}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('A resposta do servidor não é um JSON válido (caiu em rewrite HTML).');
  }

  return res.json();
}

export const api = {
  // --- Auth & Profile ---
  async getProfile(): Promise<{ profile: UserProfile | null }> {
    try {
      return await safeFetch<{ profile: UserProfile | null }>(`${API_BASE}/auth/me`);
    } catch {
      const saved = localStorage.getItem('demo_user_profile');
      if (saved) return { profile: JSON.parse(saved) };
      return { profile: null };
    }
  },

  async syncProfile(data: { uid: string; email: string; displayName?: string }): Promise<{ profile: UserProfile }> {
    try {
      return await safeFetch<{ profile: UserProfile }>(`${API_BASE}/auth/sync`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const mockProfile: UserProfile = {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName || 'Família',
        role: 'premium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('demo_user_profile', JSON.stringify(mockProfile));
      return { profile: mockProfile };
    }
  },

  async updatePreferences(preferences: UserProfile['preferences']): Promise<{ profile: UserProfile }> {
    try {
      return await safeFetch<{ profile: UserProfile }>(`${API_BASE}/auth/preferences`, {
        method: 'PUT',
        body: JSON.stringify({ preferences }),
      });
    } catch {
      const saved = localStorage.getItem('demo_user_profile');
      const profile = saved ? JSON.parse(saved) : { uid: 'demo', email: 'user@exemplo.com', displayName: 'Família', role: 'premium' };
      profile.preferences = preferences;
      localStorage.setItem('demo_user_profile', JSON.stringify(profile));
      return { profile };
    }
  },

  // --- Recipes ---
  async getRecipes(params?: { search?: string; mealType?: string; baseFood?: string; texture?: string }): Promise<{ recipes: Recipe[]; userRole: string }> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.mealType) query.set('mealType', params.mealType);
      if (params?.baseFood) query.set('baseFood', params.baseFood);
      if (params?.texture) query.set('texture', params.texture);

      return await safeFetch<{ recipes: Recipe[]; userRole: string }>(`${API_BASE}/recipes?${query.toString()}`);
    } catch (err) {
      console.warn('Usando base local de receitas (fallback):', err);
      let list = [...LOCAL_RECIPES];
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(r => r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q));
      }
      if (params?.mealType) {
        list = list.filter(r => r.mealType === params.mealType);
      }
      if (params?.baseFood) {
        list = list.filter(r => r.baseFood.toLowerCase() === params.baseFood!.toLowerCase());
      }
      if (params?.texture) {
        list = list.filter(r => r.textures.includes(params.texture as any));
      }
      return { recipes: list, userRole: 'premium' };
    }
  },

  async getRecipeById(id: string): Promise<{ recipe: Recipe; isLocked: boolean; reason?: string }> {
    try {
      return await safeFetch<{ recipe: Recipe; isLocked: boolean; reason?: string }>(`${API_BASE}/recipes/${id}`);
    } catch {
      const found = LOCAL_RECIPES.find(r => r.id === id) || LOCAL_RECIPES[0];
      return { recipe: found, isLocked: false };
    }
  },

  // --- Planner (Premium) ---
  async getMealPlan(): Promise<{ plan: MealPlan }> {
    try {
      return await safeFetch<{ plan: MealPlan }>(`${API_BASE}/planner`);
    } catch (err) {
      console.warn('Usando planejador semanal local (fallback):', err);
      const saved = localStorage.getItem('local_meal_plan');
      if (saved) {
        try { return { plan: JSON.parse(saved) }; } catch {}
      }
      return { plan: DEFAULT_MEAL_PLAN };
    }
  },

  async updateMealPlan(planData: Partial<MealPlan>): Promise<{ plan: MealPlan }> {
    try {
      return await safeFetch<{ plan: MealPlan }>(`${API_BASE}/planner`, {
        method: 'PUT',
        body: JSON.stringify(planData),
      });
    } catch {
      const current = localStorage.getItem('local_meal_plan');
      const base = current ? JSON.parse(current) : DEFAULT_MEAL_PLAN;
      const updated = { ...base, ...planData, updatedAt: new Date().toISOString() };
      localStorage.setItem('local_meal_plan', JSON.stringify(updated));
      return { plan: updated };
    }
  },

  // --- Shopping List (Premium) ---
  async getShoppingList(): Promise<{ list: ShoppingList }> {
    try {
      return await safeFetch<{ list: ShoppingList }>(`${API_BASE}/shopping`);
    } catch (err) {
      console.warn('Usando lista de compras local (fallback):', err);
      const saved = localStorage.getItem('local_shopping_list');
      if (saved) {
        try { return { list: JSON.parse(saved) }; } catch {}
      }
      return { list: DEFAULT_SHOPPING_LIST };
    }
  },

  async updateShoppingList(items: ShoppingListItem[]): Promise<{ list: ShoppingList }> {
    try {
      return await safeFetch<{ list: ShoppingList }>(`${API_BASE}/shopping`, {
        method: 'PUT',
        body: JSON.stringify({ items }),
      });
    } catch {
      const current = localStorage.getItem('local_shopping_list');
      const base = current ? JSON.parse(current) : DEFAULT_SHOPPING_LIST;
      const updated: ShoppingList = { ...base, items, updatedAt: new Date().toISOString() };
      localStorage.setItem('local_shopping_list', JSON.stringify(updated));
      return { list: updated };
    }
  },

  async syncShoppingFromPlan(): Promise<{ list: ShoppingList; message: string }> {
    try {
      return await safeFetch<{ list: ShoppingList; message: string }>(`${API_BASE}/shopping/sync-from-plan`, {
        method: 'POST',
      });
    } catch {
      const { plan } = await this.getMealPlan();
      const recipeIds = new Set<string>();
      Object.values(plan.days).forEach(day => {
        (day.breakfast || []).forEach(id => recipeIds.add(id));
        (day.lunch || []).forEach(id => recipeIds.add(id));
        (day.snack || []).forEach(id => recipeIds.add(id));
        (day.dinner || []).forEach(id => recipeIds.add(id));
      });

      const newItems: ShoppingListItem[] = [];
      recipeIds.forEach(rId => {
        const recipe = LOCAL_RECIPES.find(r => r.id === rId);
        if (recipe) {
          recipe.ingredients.forEach(ing => {
            newItems.push({
              id: `sync-${ing.id}-${Date.now()}`,
              name: ing.name,
              amount: `${ing.amount} ${ing.unit}`,
              category: ing.category,
              checked: false,
              isCustom: false,
              recipeSource: recipe.title,
            });
          });
        }
      });

      const list: ShoppingList = {
        userId: 'current-user',
        items: newItems.length > 0 ? newItems : DEFAULT_SHOPPING_LIST.items,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('local_shopping_list', JSON.stringify(list));
      return { list, message: 'Lista sincronizada com sucesso!' };
    }
  },

  // --- Materials & Assets ---
  async getMaterials(): Promise<{ assets: ContentAsset[]; userRole: string }> {
    try {
      return await safeFetch<{ assets: ContentAsset[]; userRole: string }>(`${API_BASE}/materials`);
    } catch {
      return { assets: DEFAULT_MATERIALS, userRole: 'premium' };
    }
  },

  async getMaterialDownloadUrl(assetId: string): Promise<{ downloadUrl: string; asset: ContentAsset }> {
    try {
      return await safeFetch<{ downloadUrl: string; asset: ContentAsset }>(`${API_BASE}/materials/${assetId}/download`);
    } catch {
      const asset = DEFAULT_MATERIALS.find(a => a.id === assetId) || DEFAULT_MATERIALS[0];
      return { downloadUrl: '#', asset };
    }
  },

  // --- Support & FAQ ---
  async getSupportArticles(): Promise<{ articles: SupportArticle[] }> {
    try {
      return await safeFetch<{ articles: SupportArticle[] }>(`${API_BASE}/support/articles`);
    } catch {
      return { articles: DEFAULT_SUPPORT_ARTICLES };
    }
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
