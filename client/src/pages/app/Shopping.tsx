import React, { useEffect, useState } from 'react';
import { ShoppingBag, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import { ShoppingList, ShoppingListItem } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingListWidget } from '../../components/shopping/ShoppingListWidget';
import { LockedFeatureNotice } from '../../components/paywall/LockedFeatureNotice';

export const Shopping: React.FC = () => {
  const { isBasic, isPremium } = useAuth();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadList = async () => {
    setLoading(true);
    try {
      const res = await api.getShoppingList();
      setList(res.list);
    } catch (err) {
      console.error('Erro ao carregar lista de compras:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPremium) {
      loadList();
    } else {
      setLoading(false);
    }
  }, [isPremium]);

  const handleUpdateList = async (items: ShoppingListItem[]) => {
    if (!list) return;
    const updated: ShoppingList = { ...list, items, updatedAt: new Date().toISOString() };
    setList(updated);
    try {
      await api.updateShoppingList(items);
    } catch (err) {
      console.error('Erro ao salvar lista no servidor:', err);
    }
  };

  const handleSyncFromPlanner = async () => {
    setIsSyncing(true);
    try {
      const res = await api.syncShoppingFromPlan();
      setList(res.list);
    } catch (err) {
      console.error('Erro ao sincronizar do planejador:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isBasic) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-0.5 rounded-full">
            Praticidade no Supermercado
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900 mt-2">
            Lista de Compras Inteligente
          </h1>
        </div>
        <LockedFeatureNotice
          title="Lista de Compras Automática"
          description="Gere sua lista organizada por categorias (hortifruti, grãos, laticínios) automaticamente a partir das receitas programadas na semana."
        />
      </div>
    );
  }

  if (loading || !list) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="size-8 text-forest-700 animate-spin mx-auto" />
        <p className="text-xs font-bold text-graphite-600">Carregando sua lista de compras...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-0.5 rounded-full">
          Praticidade no Supermercado
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900 mt-2">
          Lista de Compras da Família
        </h1>
        <p className="text-xs text-graphite-600 mt-1">
          Ingredientes consolidados para facilitar suas compras da semana.
        </p>
      </div>

      <ShoppingListWidget
        list={list}
        onUpdateList={handleUpdateList}
        onSyncFromPlanner={handleSyncFromPlanner}
        isSyncing={isSyncing}
      />
    </div>
  );
};
