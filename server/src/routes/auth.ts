import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { dbStore } from '../services/dbStore.js';

export const authRouter = Router();

authRouter.post('/sync', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { displayName, role } = req.body;
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const updated = await dbStore.syncUser({
      uid: req.user.uid,
      email: req.user.email,
      displayName: displayName || req.user.displayName,
      role: role || req.user.role,
    });

    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao sincronizar usuário', message: err.message });
  }
});

authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }
    const user = await dbStore.getUser(req.user.uid);
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao obter dados do usuário', message: err.message });
  }
});

authRouter.put('/preferences', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const preferences = req.body.preferences;
    const updated = await dbStore.updateUserPreferences(req.user.uid, preferences);
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao atualizar preferências', message: err.message });
  }
});
