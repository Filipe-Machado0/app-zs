import { Router } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { dbStore } from '../services/dbStore.js';

export const materialsRouter = Router();

// Acesso para usuários com plano básico ou premium
materialsRouter.get('/', requireAuth, requireRole(['basic', 'premium']), async (req: AuthenticatedRequest, res) => {
  try {
    const userRole = req.user!.role;
    const assets = await dbStore.getAssets(userRole);
    res.json({ assets, userRole });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao carregar materiais', message: err.message });
  }
});
