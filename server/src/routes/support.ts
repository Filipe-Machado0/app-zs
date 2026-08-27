import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { dbStore } from '../services/dbStore.js';

export const supportRouter = Router();

supportRouter.get('/articles', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const articles = await dbStore.getSupportArticles();
    res.json({
      articles,
      disclaimer: 'Esta ferramenta oferece apoio educativo e não substitui orientação profissional. Situações de dor, engasgo, alergia ou perda de peso devem ser avaliadas por pediatras e profissionais de saúde.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao carregar artigos de apoio', message: err.message });
  }
});

supportRouter.get('/my-requests', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const requests = await dbStore.getSupportRequests(userId);
    res.json({ requests });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar chamados', message: err.message });
  }
});

supportRouter.post('/requests', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      res.status(400).json({ error: 'Assunto e mensagem são obrigatórios' });
      return;
    }

    const request = await dbStore.createSupportRequest({
      userId: req.user!.uid,
      userEmail: req.user!.email,
      userName: req.user!.displayName,
      subject,
      message,
    });

    res.status(201).json({ success: true, request });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao enviar chamado de suporte', message: err.message });
  }
});
