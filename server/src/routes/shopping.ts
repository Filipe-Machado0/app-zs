import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { dbStore } from '../services/dbStore.js';
import { ShoppingListItem } from '../types/index.js';

export const shoppingRouter = Router();

// Protegido: Apenas Plano Premium e Admin
shoppingRouter.use(requireAuth, requireRole(['premium']));

shoppingRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const list = await dbStore.getShoppingList(userId);
    res.json({ shoppingList: list });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar lista de compras', message: err.message });
  }
});

shoppingRouter.put('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const { items } = req.body;
    const updated = await dbStore.updateShoppingList(userId, items || []);
    res.json({ success: true, shoppingList: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao atualizar lista de compras', message: err.message });
  }
});

shoppingRouter.patch('/item/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const itemId = req.params.id;
    const updates = req.body;

    const list = await dbStore.getShoppingList(userId);
    const itemIndex = list.items.findIndex((i) => i.id === itemId);

    if (itemIndex === -1) {
      res.status(404).json({ error: 'Item não encontrado na lista de compras' });
      return;
    }

    list.items[itemIndex] = { ...list.items[itemIndex], ...updates };
    const updated = await dbStore.updateShoppingList(userId, list.items);

    res.json({ success: true, item: list.items[itemIndex], shoppingList: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao atualizar item', message: err.message });
  }
});

shoppingRouter.post('/custom-item', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const { name, category, amount } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Nome do item é obrigatório' });
      return;
    }

    const newItem: ShoppingListItem = {
      id: uuidv4(),
      name,
      category: category || 'outros',
      amount: amount || '1 un',
      checked: false,
      isCustom: true,
    };

    const list = await dbStore.getShoppingList(userId);
    list.items.push(newItem);
    const updated = await dbStore.updateShoppingList(userId, list.items);

    res.json({ success: true, item: newItem, shoppingList: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao adicionar item customizado', message: err.message });
  }
});

shoppingRouter.delete('/item/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const itemId = req.params.id;

    const list = await dbStore.getShoppingList(userId);
    const filtered = list.items.filter((i) => i.id !== itemId);
    const updated = await dbStore.updateShoppingList(userId, filtered);

    res.json({ success: true, shoppingList: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao remover item', message: err.message });
  }
});
