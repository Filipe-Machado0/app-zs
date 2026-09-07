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
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getShoppingList();
      setList(res.list);
    } catch (err: any) {
      console.error('Erro ao carregar lista de compras:', err);
      setError(err?.message || 'Não foi possível carregar a lista de compras.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

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

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="size-8 text-forest-700 animate-spin mx-auto" />
        <p className="text-xs font-bold text-graphite-600">Carregando sua lista de compras...</p>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="bg-white rounded-3xl border border-forest-100 p-8 text-center max-w-md mx-auto my-12 space-y-4 shadow-sm">
        <div className="size-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
          ⚠️
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-forest-900">Não foi possível carregar a Lista de Compras</h3>
          <p className="text-xs text-graphite-600">
            {error || 'Houve uma instabilidade temporária na conexão.'}
          </p>
        </div>
        <button
          onClick={loadList}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer"
        >
          <span>Tentar Novamente</span>
        </button>
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
