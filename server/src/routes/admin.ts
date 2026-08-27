import { Router } from 'express';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';
import { dbStore } from '../services/dbStore.js';
import { UserRole } from '../types/index.js';

export const adminRouter = Router();

// Protegido: Apenas Administrador
adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/overview', async (req: AuthenticatedRequest, res) => {
  try {
    const metrics = await dbStore.getAdminMetrics();
    res.json({ metrics });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar métricas', message: err.message });
  }
});

adminRouter.get('/users', async (req: AuthenticatedRequest, res) => {
  try {
    const users = await dbStore.getAllUsers();
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao listar usuários', message: err.message });
  }
});

adminRouter.post('/users/:uid/role', async (req: AuthenticatedRequest, res) => {
  try {
    const { uid } = req.params;
    const { role, reason } = req.body;

    if (!['none', 'basic', 'premium', 'admin'].includes(role)) {
      res.status(400).json({ error: 'Papel inválido' });
      return;
    }

    const updated = await dbStore.updateUserRole(
      uid,
      role as UserRole,
      req.user!.uid,
      req.user!.email,
      reason || 'Alteração manual no painel administrativo'
    );

    if (!updated) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao atualizar papel do usuário', message: err.message });
  }
});

adminRouter.get('/recipes', async (req: AuthenticatedRequest, res) => {
  try {
    const recipes = await dbStore.getRecipes('admin');
    res.json({ recipes });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao listar receitas', message: err.message });
  }
});

adminRouter.post('/recipes', async (req: AuthenticatedRequest, res) => {
  try {
    const recipeData = req.body;
    const saved = await dbStore.saveRecipe(recipeData, req.user!.uid, req.user!.email);
    res.json({ success: true, recipe: saved });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao salvar receita', message: err.message });
  }
});

adminRouter.delete('/recipes/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const success = await dbStore.deleteRecipe(req.params.id, req.user!.uid, req.user!.email);
    if (!success) {
      res.status(404).json({ error: 'Receita não encontrada' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao excluir receita', message: err.message });
  }
});

adminRouter.get('/support', async (req: AuthenticatedRequest, res) => {
  try {
    const requests = await dbStore.getSupportRequests();
    res.json({ requests });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar chamados', message: err.message });
  }
});

adminRouter.post('/support/:id/reply', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply) {
      res.status(400).json({ error: 'A resposta não pode ser vazia' });
      return;
    }

    const updated = await dbStore.replySupportRequest(id, reply, req.user!.uid, req.user!.email);
    if (!updated) {
      res.status(404).json({ error: 'Chamado não encontrado' });
      return;
    }

    res.json({ success: true, request: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao responder chamado', message: err.message });
  }
});

adminRouter.get('/purchases', async (req: AuthenticatedRequest, res) => {
  try {
    const purchases = await dbStore.getPurchases();
    res.json({ purchases });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar compras', message: err.message });
  }
});

adminRouter.get('/audit-logs', async (req: AuthenticatedRequest, res) => {
  try {
    const logs = await dbStore.getAuditLogs();
    res.json({ logs });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao carregar logs de auditoria', message: err.message });
  }
});
