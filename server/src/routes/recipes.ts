import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { dbStore } from '../services/dbStore.js';

export const recipesRouter = Router();

recipesRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userRole = req.user?.role || 'none';
    const { search, mealType, baseFood, texture } = req.query;

    const recipes = await dbStore.getRecipes(
      userRole,
      search ? String(search) : undefined,
      mealType ? String(mealType) : undefined,
      baseFood ? String(baseFood) : undefined,
      texture ? String(texture) : undefined
    );

    res.json({
      recipes,
      userRole,
      disclaimer: 'Este conteúdo oferece ideias culinárias e práticas de organização alimentar. Não substitui acompanhamento médico, pediátrico ou nutricional.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar receitas', message: err.message });
  }
});

recipesRouter.get('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userRole = req.user?.role || 'none';
    const recipe = await dbStore.getRecipeById(req.params.id);

    if (!recipe) {
      res.status(404).json({ error: 'Receita não encontrada' });
      return;
    }

    // Validação de acesso por plano
    if (recipe.tier === 'premium' && userRole === 'basic') {
      res.status(403).json({
        error: 'Receita exclusiva do Cardápio Seletivo Premium',
        message: 'Faça upgrade para liberar o acervo completo, planejador e lista de compras.',
        recipeSummary: {
          id: recipe.id,
          title: recipe.title,
          mealType: recipe.mealType,
          tier: recipe.tier,
          imageUrl: recipe.imageUrl,
        },
      });
      return;
    }

    res.json({
      recipe,
      disclaimer: 'Cada criança possui seu próprio ritmo. Respeite as preferências e consulte profissionais de saúde em caso de dúvidas clínicas.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao carregar receita', message: err.message });
  }
});
