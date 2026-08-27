import { Router } from 'express';
import { dbStore } from '../services/dbStore.js';

export const webhooksRouter = Router();

// Endpoint de simulação / integração de pagamento
webhooksRouter.post('/payment', async (req, res) => {
  try {
    const { email, tier, transactionId, paymentMethod } = req.body;

    if (!email || !tier || !['basic', 'premium'].includes(tier)) {
      res.status(400).json({
        error: 'Payload inválido',
        message: 'Forneça email e tier ("basic" ou "premium").',
      });
      return;
    }

    const purchase = await dbStore.processPurchase({
      userEmail: email,
      tier,
      transactionId,
      paymentMethod,
    });

    res.json({
      success: true,
      message: `Acesso ${tier.toUpperCase()} liberado com sucesso para ${email}`,
      purchase,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao processar webhook', message: err.message });
  }
});
