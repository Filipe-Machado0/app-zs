import { Router } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { dbStore } from '../services/dbStore.js';

export const plannerRouter = Router();

// Protegido: Apenas Plano Premium e Admin
plannerRouter.use(requireAuth, requireRole(['premium']));

plannerRouter.get('/current', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const plan = await dbStore.getMealPlan(userId);
    res.json({ plan });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar planejamento semanal', message: err.message });
  }
});

plannerRouter.put('/current', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const planData = req.body;
    const updated = await dbStore.updateMealPlan(userId, planData);
    res.json({ success: true, plan: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao salvar planejamento semanal', message: err.message });
  }
});

plannerRouter.post('/generate-shopping-list', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const list = await dbStore.generateShoppingListFromPlan(userId);
    res.json({ success: true, shoppingList: list });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao gerar lista de compras', message: err.message });
  }
});
