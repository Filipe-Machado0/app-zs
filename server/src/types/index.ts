export type UserRole = 'none' | 'basic' | 'premium' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  preferences?: {
    acceptedFoods?: string[];
    challengingMeals?: string[];
    preferredTextures?: string[];
    avoidedTextures?: string[];
    cookingTimeMinutes?: number;
    weeklyGoal?: string;
  };
}

export type MealCategory = 'cafe_da_manha' | 'lanche' | 'almoco' | 'jantar';
export type TextureTag = 'crocante' | 'macio' | 'cremoso' | 'sequinho' | 'aveludado' | 'liso';
export type ColorTag = 'amarelo_dourado' | 'vermelho_suave' | 'verde_claro' | 'laranja_calmo' | 'neutro_claro';
export type FormatTag = 'palitinho' | 'redondinho' | 'desfiado' | 'cubinhos' | 'estelar' | 'amassadinho';
export type DifficultyLevel = 'muito_facil' | 'facil' | 'moderado';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  category: 'hortifruti' | 'graos_cereais' | 'laticinios_ovos' | 'carnes_proteinas' | 'temperos_basicos' | 'outros';
  substitutions?: string[];
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  summary: string;
  mealType: MealCategory;
  baseFood: string; // Ex: Batata, Maçã, Frango, Banana, Arroz, Pão
  prepTimeMinutes: number;
  difficulty: DifficultyLevel;
  textures: TextureTag[];
  colors: ColorTag[];
  formats: FormatTag[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
  familiarStart: string; // "Ponto de partida conhecido"
  subtleVariation: string; // "Pequena variação sugerida"
  tier: 'basic' | 'premium';
  imageUrl: string;
  isDemo: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlanSlot {
  breakfast?: string[];
  snack?: string[];
  lunch?: string[];
  dinner?: string[];
  notes?: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  weekStartDate: string; // YYYY-MM-DD
  days: {
    segunda: MealPlanSlot;
    terca: MealPlanSlot;
    quarta: MealPlanSlot;
    quinta: MealPlanSlot;
    sexta: MealPlanSlot;
    sabado: MealPlanSlot;
    domingo: MealPlanSlot;
  };
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  category: 'hortifruti' | 'graos_cereais' | 'laticinios_ovos' | 'carnes_proteinas' | 'temperos_basicos' | 'outros';
  amount?: string;
  checked: boolean;
  isCustom: boolean;
  recipeSource?: string;
}

export interface ShoppingList {
  userId: string;
  items: ShoppingListItem[];
  updatedAt: string;
}

export interface SupportArticle {
  id: string;
  category: 'comecar_pelo_conhecido' | 'textura_apresentacao' | 'rotina' | 'planejamento' | 'quando_procurar_ajuda';
  title: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface SupportRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  message: string;
  status: 'aberto' | 'em_analise' | 'respondido' | 'fechado';
  adminReply?: string;
  createdAt: string;
  repliedAt?: string;
}

export interface ContentAsset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  requiredTier: 'basic' | 'premium';
  type: 'ebook' | 'planner' | 'guide' | 'bonus';
  downloadUrl?: string;
  fileSize: string;
  format: 'PDF' | 'Digital Interativo';
  coverImage: string;
}

export interface PurchaseRecord {
  id: string;
  userId: string;
  userEmail: string;
  tier: 'basic' | 'premium';
  amount: number; // Ex: 10.00 ou 19.00
  currency: string;
  status: 'approved' | 'refunded' | 'pending';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: 'grant_access' | 'revoke_access' | 'create_recipe' | 'update_recipe' | 'delete_recipe' | 'reply_support' | 'system_seed';
  targetUserId?: string;
  details: string;
  timestamp: string;
}

export interface NotificationPreferences {
  userId: string;
  planWeeklyReminder: boolean;
  planWeeklyDay: 'domingo' | 'segunda' | 'sexta';
  prepReminder: boolean;
  gentleVariationReminder: boolean;
  allMuted: boolean;
}
