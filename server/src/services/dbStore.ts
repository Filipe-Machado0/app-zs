import { v4 as uuidv4 } from 'uuid';
import { firestoreDb, isFirebaseConnected } from '../config/firebase.js';
import {
  UserProfile,
  UserRole,
  Recipe,
  MealPlan,
  ShoppingList,
  ShoppingListItem,
  SupportArticle,
  SupportRequest,
  ContentAsset,
  PurchaseRecord,
  AuditLog,
  NotificationPreferences,
} from '../types/index.js';
import { SEED_RECIPES, SEED_ASSETS, SEED_SUPPORT_ARTICLES } from './seedData.js';

class DatabaseStore {
  private users: Map<string, UserProfile> = new Map();
  private recipes: Map<string, Recipe> = new Map();
  private mealPlans: Map<string, MealPlan> = new Map(); // key: userId
  private shoppingLists: Map<string, ShoppingList> = new Map(); // key: userId
  private supportArticles: Map<string, SupportArticle> = new Map();
  private supportRequests: Map<string, SupportRequest> = new Map();
  private assets: Map<string, ContentAsset> = new Map();
  private purchases: Map<string, PurchaseRecord> = new Map();
  private auditLogs: AuditLog[] = [];
  private notificationPreferences: Map<string, NotificationPreferences> = new Map();

  constructor() {
    this.initSeeds();
  }

  private initSeeds() {
    // Carrega dados iniciais
    SEED_RECIPES.forEach((r) => this.recipes.set(r.id, { ...r }));
    SEED_ASSETS.forEach((a) => this.assets.set(a.id, { ...a }));
    SEED_SUPPORT_ARTICLES.forEach((sa) => this.supportArticles.set(sa.id, { ...sa }));

    // Usuário admin inicial demonstrativo
    this.users.set('admin-demo-uid', {
      uid: 'admin-demo-uid',
      email: 'admin@cardapioseletivo.com.br',
      displayName: 'Administrador Cardápio Seletivo',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Usuário Premium demonstrativo
    this.users.set('premium-demo-uid', {
      uid: 'premium-demo-uid',
      email: 'responsavel.premium@exemplo.com',
      displayName: 'Mariana Silva',
      role: 'premium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        acceptedFoods: ['Batata', 'Banana', 'Pão', 'Arroz', 'Frango'],
        challengingMeals: ['jantar', 'almoco'],
        preferredTextures: ['crocante', 'sequinho', 'macio'],
        avoidedTextures: ['cremoso', 'aveludado'],
        cookingTimeMinutes: 25,
        weeklyGoal: 'Apresentar 1 variação de formato no almoço de sábado sem pressão.',
      },
    });

    // Usuário Básico demonstrativo
    this.users.set('basic-demo-uid', {
      uid: 'basic-demo-uid',
      email: 'responsavel.basico@exemplo.com',
      displayName: 'Carlos Eduardo',
      role: 'basic',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Log inicial de sistema
    this.auditLogs.push({
      id: uuidv4(),
      adminId: 'system',
      adminEmail: 'system@cardapioseletivo.com.br',
      action: 'system_seed',
      details: 'Base de dados inicializada com 14 receitas demonstrativas e 5 materiais educativos.',
      timestamp: new Date().toISOString(),
    });
  }

  // --- Usuários e Sessão ---
  async getUser(uid: string): Promise<UserProfile | null> {
    if (isFirebaseConnected && firestoreDb) {
      try {
        const doc = await firestoreDb.collection('users').doc(uid).get();
        if (doc.exists) {
          const data = doc.data() as UserProfile;
          this.users.set(uid, data);
          return data;
        }
      } catch (err) {
        console.warn('Erro ao consultar usuário no Firestore, usando cache local:', err);
      }
    }
    return this.users.get(uid) || null;
  }

  async syncUser(data: { uid: string; email: string; displayName?: string; role?: UserRole }): Promise<UserProfile> {
    let existing = await this.getUser(data.uid);
    if (!existing) {
      existing = {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName || data.email.split('@')[0],
        role: data.role || 'none', // Padrão 'none' até confirmação de compra
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      existing.displayName = data.displayName || existing.displayName;
      if (data.role) existing.role = data.role;
      existing.updatedAt = new Date().toISOString();
    }

    this.users.set(data.uid, existing);

    if (isFirebaseConnected && firestoreDb) {
      try {
        await firestoreDb.collection('users').doc(data.uid).set(existing, { merge: true });
        await firestoreDb.collection('user_roles').doc(data.uid).set({ role: existing.role, updatedAt: existing.updatedAt }, { merge: true });
      } catch (err) {
        console.warn('Erro ao persistir usuário no Firestore:', err);
      }
    }

    return existing;
  }

  async updateUserPreferences(uid: string, preferences: UserProfile['preferences']): Promise<UserProfile | null> {
    const user = await this.getUser(uid);
    if (!user) return null;

    user.preferences = preferences;
    user.updatedAt = new Date().toISOString();
    this.users.set(uid, user);

    if (isFirebaseConnected && firestoreDb) {
      try {
        await firestoreDb.collection('users').doc(uid).update({ preferences, updatedAt: user.updatedAt });
      } catch (err) {
        console.warn('Erro ao atualizar preferências no Firestore:', err);
      }
    }

    return user;
  }

  async getAllUsers(): Promise<UserProfile[]> {
    return Array.from(this.users.values());
  }

  async updateUserRole(uid: string, newRole: UserRole, adminId: string, adminEmail: string, reason: string): Promise<UserProfile | null> {
    const user = await this.getUser(uid);
    if (!user) return null;

    const oldRole = user.role;
    user.role = newRole;
    user.updatedAt = new Date().toISOString();
    this.users.set(uid, user);

    if (isFirebaseConnected && firestoreDb) {
      try {
        await firestoreDb.collection('users').doc(uid).update({ role: newRole, updatedAt: user.updatedAt });
        await firestoreDb.collection('user_roles').doc(uid).set({ role: newRole, updatedAt: user.updatedAt }, { merge: true });
      } catch (err) {
        console.warn('Erro ao atualizar papel no Firestore:', err);
      }
    }

    await this.addAuditLog({
      adminId,
      adminEmail,
      action: 'grant_access',
      targetUserId: uid,
      details: `Papel alterado de "${oldRole}" para "${newRole}". Motivo: ${reason}`,
    });

    return user;
  }

  // --- Receitas ---
  async getRecipes(userRole: UserRole, search?: string, mealType?: string, baseFood?: string, texture?: string): Promise<Recipe[]> {
    let list = Array.from(this.recipes.values()).filter((r) => r.published);

    if (userRole === 'basic') {
      // Usuário básico só recebe conteúdo básico liberado
      list = list.filter((r) => r.tier === 'basic');
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.baseFood.toLowerCase().includes(q));
    }

    if (mealType) {
      list = list.filter((r) => r.mealType === mealType);
    }

    if (baseFood) {
      list = list.filter((r) => r.baseFood.toLowerCase().includes(baseFood.toLowerCase()));
    }

    if (texture) {
      list = list.filter((r) => r.textures.includes(texture as any));
    }

    return list;
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    return this.recipes.get(id) || null;
  }

  async saveRecipe(recipe: Partial<Recipe>, adminId: string, adminEmail: string): Promise<Recipe> {
    const isEdit = !!recipe.id && this.recipes.has(recipe.id);
    const id = recipe.id || `rec-${uuidv4().slice(0, 8)}`;
    const now = new Date().toISOString();

    const fullRecipe: Recipe = {
      id,
      title: recipe.title || 'Nova Receita',
      summary: recipe.summary || '',
      mealType: recipe.mealType || 'almoco',
      baseFood: recipe.baseFood || 'Alimento Base',
      prepTimeMinutes: recipe.prepTimeMinutes || 20,
      difficulty: recipe.difficulty || 'muito_facil',
      textures: recipe.textures || ['macio'],
      colors: recipe.colors || ['amarelo_dourado'],
      formats: recipe.formats || ['palitinho'],
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
      familiarStart: recipe.familiarStart || 'Alimento familiar conhecido.',
      subtleVariation: recipe.subtleVariation || 'Pequena variação suave sugerida.',
      tier: recipe.tier || 'basic',
      imageUrl: recipe.imageUrl || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
      isDemo: recipe.isDemo ?? false,
      published: recipe.published ?? true,
      createdAt: recipe.createdAt || now,
      updatedAt: now,
    };

    this.recipes.set(id, fullRecipe);

    if (isFirebaseConnected && firestoreDb) {
      try {
        await firestoreDb.collection('recipes').doc(id).set(fullRecipe, { merge: true });
      } catch (err) {
        console.warn('Erro ao salvar receita no Firestore:', err);
      }
    }

    await this.addAuditLog({
      adminId,
      adminEmail,
      action: isEdit ? 'update_recipe' : 'create_recipe',
      details: `${isEdit ? 'Atualizada' : 'Criada'} receita: "${fullRecipe.title}" (${id})`,
    });

    return fullRecipe;
  }

  async deleteRecipe(id: string, adminId: string, adminEmail: string): Promise<boolean> {
    const recipe = this.recipes.get(id);
    if (!recipe) return false;

    this.recipes.delete(id);

    if (isFirebaseConnected && firestoreDb) {
      try {
        await firestoreDb.collection('recipes').doc(id).delete();
      } catch (err) {
        console.warn('Erro ao deletar receita no Firestore:', err);
      }
    }

    await this.addAuditLog({
      adminId,
      adminEmail,
      action: 'delete_recipe',
      details: `Excluída receita: "${recipe.title}" (${id})`,
    });

    return true;
  }

  // --- Planejador Semanal (Premium) ---
  async getMealPlan(userId: string): Promise<MealPlan> {
    let plan = this.mealPlans.get(userId);
    if (!plan) {
      plan = {
        id: `plan-${userId}`,
        userId,
        weekStartDate: new Date().toISOString().split('T')[0],
        days: {
          segunda: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
          terca: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
          quarta: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
          quinta: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
          sexta: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
          sabado: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
          domingo: { breakfast: [], snack: [], lunch: [], dinner: [], notes: '' },
        },
        updatedAt: new Date().toISOString(),
      };
      this.mealPlans.set(userId, plan);
    }
    return plan;
  }

  async updateMealPlan(userId: string, planData: Partial<MealPlan>): Promise<MealPlan> {
    const current = await this.getMealPlan(userId);
    const updated: MealPlan = {
      ...current,
      ...planData,
      updatedAt: new Date().toISOString(),
    };
    this.mealPlans.set(userId, updated);

    if (isFirebaseConnected && firestoreDb) {
      try {
        await firestoreDb.collection('meal_plans').doc(userId).set(updated, { merge: true });
      } catch (err) {
        console.warn('Erro ao salvar planejamento no Firestore:', err);
      }
    }

    return updated;
  }

  // --- Lista de Compras (Premium) ---
  async getShoppingList(userId: string): Promise<ShoppingList> {
    let list = this.shoppingLists.get(userId);
    if (!list) {
      list = {
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
      };
      this.shoppingLists.set(userId, list);
    }
    return list;
  }

  async updateShoppingList(userId: string, items: ShoppingListItem[]): Promise<ShoppingList> {
    const list: ShoppingList = {
      userId,
      items,
      updatedAt: new Date().toISOString(),
    };
    this.shoppingLists.set(userId, list);

    if (isFirebaseConnected && firestoreDb) {
      try {
        await firestoreDb.collection('shopping_lists').doc(userId).set(list, { merge: true });
      } catch (err) {
        console.warn('Erro ao salvar lista de compras no Firestore:', err);
      }
    }

    return list;
  }

  async generateShoppingListFromPlan(userId: string): Promise<ShoppingList> {
    const plan = await this.getMealPlan(userId);
    const existingList = await this.getShoppingList(userId);
    const customItems = existingList.items.filter((i) => i.isCustom);

    const recipeIds = new Set<string>();
    Object.values(plan.days).forEach((day) => {
      day.breakfast?.forEach((id) => recipeIds.add(id));
      day.snack?.forEach((id) => recipeIds.add(id));
      day.lunch?.forEach((id) => recipeIds.add(id));
      day.dinner?.forEach((id) => recipeIds.add(id));
    });

    const newItems: ShoppingListItem[] = [];
    const itemMap = new Map<string, ShoppingListItem>();

    recipeIds.forEach((rid) => {
      const recipe = this.recipes.get(rid);
      if (recipe) {
        recipe.ingredients.forEach((ing) => {
          const key = `${ing.name.toLowerCase()}_${ing.unit}`;
          if (itemMap.has(key)) {
            const current = itemMap.get(key)!;
            current.amount = `${current.amount} + ${ing.amount}`;
            if (current.recipeSource && !current.recipeSource.includes(recipe.title)) {
              current.recipeSource += `, ${recipe.title}`;
            }
          } else {
            const newItem: ShoppingListItem = {
              id: uuidv4(),
              name: ing.name,
              category: ing.category,
              amount: `${ing.amount} ${ing.unit}`,
              checked: false,
              isCustom: false,
              recipeSource: recipe.title,
            };
            itemMap.set(key, newItem);
          }
        });
      }
    });

    const consolidatedItems = [...customItems, ...Array.from(itemMap.values())];
    return this.updateShoppingList(userId, consolidatedItems);
  }

  // --- Materiais e E-books ---
  async getAssets(userRole: UserRole): Promise<ContentAsset[]> {
    const all = Array.from(this.assets.values());
    if (userRole === 'basic') {
      return all.filter((a) => a.requiredTier === 'basic');
    }
    if (userRole === 'premium' || userRole === 'admin') {
      return all;
    }
    return [];
  }

  // --- Central de Dúvidas e Suporte ---
  async getSupportArticles(): Promise<SupportArticle[]> {
    return Array.from(this.supportArticles.values());
  }

  async getSupportRequests(userId?: string): Promise<SupportRequest[]> {
    const list = Array.from(this.supportRequests.values());
    if (userId) {
      return list.filter((r) => r.userId === userId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createSupportRequest(data: { userId: string; userEmail: string; userName: string; subject: string; message: string }): Promise<SupportRequest> {
    const req: SupportRequest = {
      id: `sup-${uuidv4().slice(0, 8)}`,
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName,
      subject: data.subject,
      message: data.message,
      status: 'aberto',
      createdAt: new Date().toISOString(),
    };
    this.supportRequests.set(req.id, req);

    if (isFirebaseConnected && firestoreDb) {
      try {
        await firestoreDb.collection('support_requests').doc(req.id).set(req);
      } catch (err) {
        console.warn('Erro ao salvar chamado no Firestore:', err);
      }
    }

    return req;
  }

  async replySupportRequest(requestId: string, reply: string, adminId: string, adminEmail: string): Promise<SupportRequest | null> {
    const req = this.supportRequests.get(requestId);
    if (!req) return null;

    req.adminReply = reply;
    req.status = 'respondido';
    req.repliedAt = new Date().toISOString();
    this.supportRequests.set(requestId, req);

    if (isFirebaseConnected && firestoreDb) {
      try {
        await firestoreDb.collection('support_requests').doc(requestId).update({
          adminReply: reply,
          status: 'respondido',
          repliedAt: req.repliedAt,
        });
      } catch (err) {
        console.warn('Erro ao responder chamado no Firestore:', err);
      }
    }

    await this.addAuditLog({
      adminId,
      adminEmail,
      action: 'reply_support',
      details: `Chamado respondido: "${req.subject}" (${requestId}) para ${req.userEmail}`,
    });

    return req;
  }

  // --- Compras e Simulação de Webhook ---
  async processPurchase(data: { userEmail: string; tier: 'basic' | 'premium'; transactionId?: string; paymentMethod?: string }): Promise<PurchaseRecord> {
    // Procura usuário por email ou cria novo
    let targetUser: UserProfile | undefined = Array.from(this.users.values()).find((u) => u.email.toLowerCase() === data.userEmail.toLowerCase());

    const userId = targetUser ? targetUser.uid : `user-${uuidv4().slice(0, 8)}`;

    if (!targetUser) {
      targetUser = await this.syncUser({
        uid: userId,
        email: data.userEmail,
        role: data.tier,
      });
    } else {
      // Atualiza papel apenas para igual ou superior
      if (data.tier === 'premium' || targetUser.role === 'none') {
        await this.updateUserRole(userId, data.tier, 'system_webhook', 'gateway@pagamentos.com', 'Compra confirmada via webhook');
      }
    }

    const purchase: PurchaseRecord = {
      id: `pur-${uuidv4().slice(0, 8)}`,
      userId,
      userEmail: data.userEmail,
      tier: data.tier,
      amount: data.tier === 'basic' ? 10.0 : 19.0,
      currency: 'BRL',
      status: 'approved',
      paymentMethod: data.paymentMethod || 'Cartão de Crédito / Pix',
      transactionId: data.transactionId || `TX-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.purchases.set(purchase.id, purchase);

    if (isFirebaseConnected && firestoreDb) {
      try {
        await firestoreDb.collection('purchases').doc(purchase.id).set(purchase);
      } catch (err) {
        console.warn('Erro ao salvar compra no Firestore:', err);
      }
    }

    return purchase;
  }

  async getPurchases(): Promise<PurchaseRecord[]> {
    return Array.from(this.purchases.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // --- Auditoria ---
  async addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const entry: AuditLog = {
      id: uuidv4(),
      ...log,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);

    if (isFirebaseConnected && firestoreDb) {
      try {
        await firestoreDb.collection('audit_logs').doc(entry.id).set(entry);
      } catch (err) {
        console.warn('Erro ao salvar log de auditoria no Firestore:', err);
      }
    }

    return entry;
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.auditLogs.slice(0, 100);
  }

  // --- Métricas do Painel Admin ---
  async getAdminMetrics() {
    const allUsers = Array.from(this.users.values());
    const basicUsers = allUsers.filter((u) => u.role === 'basic').length;
    const premiumUsers = allUsers.filter((u) => u.role === 'premium').length;
    const pendingUsers = allUsers.filter((u) => u.role === 'none').length;
    const totalRecipes = this.recipes.size;
    const openSupport = Array.from(this.supportRequests.values()).filter((s) => s.status === 'aberto').length;
    const totalPlansCreated = this.mealPlans.size;

    return {
      totalUsers: allUsers.length,
      basicUsers,
      premiumUsers,
      pendingUsers,
      totalRecipes,
      openSupport,
      totalPlansCreated,
    };
  }
}

export const dbStore = new DatabaseStore();
