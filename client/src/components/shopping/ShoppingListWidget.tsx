import React, { useState } from 'react';
import { Check, Plus, Trash2, ShoppingBag, Sparkles, RefreshCw } from 'lucide-react';
import { ShoppingList, ShoppingListItem } from '../../types';

interface ShoppingProps {
  list: ShoppingList;
  onUpdateList: (items: ShoppingListItem[]) => void;
  onSyncFromPlanner: () => Promise<void>;
  isSyncing: boolean;
}

export const ShoppingListWidget: React.FC<ShoppingProps> = ({
  list,
  onUpdateList,
  onSyncFromPlanner,
  isSyncing,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ShoppingListItem['category']>('hortifruti');

  const categories = [
    { id: 'hortifruti', label: '🥦 Hortifruti (Frutas e Vegetais)' },
    { id: 'graos_cereais', label: '🌾 Grãos, Farinhas e Cereais' },
    { id: 'laticinios_ovos', label: '🧀 Laticínios e Ovos' },
    { id: 'carnes_proteinas', label: '🍗 Proteínas e Carnes' },
    { id: 'temperos_basicos', label: '🧂 Azeites e Temperos Suaves' },
    { id: 'outros', label: '📦 Outros Ingredientes' },
  ];

  const handleToggle = (id: string) => {
    const updated = list.items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    onUpdateList(updated);
  };

  const handleRemove = (id: string) => {
    const updated = list.items.filter((item) => item.id !== id);
    onUpdateList(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ShoppingListItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      amount: newItemAmount.trim() || undefined,
      category: newItemCategory,
      checked: false,
      isCustom: true,
    };

    onUpdateList([...list.items, newItem]);
    setNewItemName('');
    setNewItemAmount('');
  };

  const completedCount = list.items.filter((i) => i.checked).length;
  const totalCount = list.items.length;

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-3xl border border-forest-100 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base text-forest-900 flex items-center gap-2">
            <ShoppingBag className="size-5 text-terracotta-500" />
            <span>Lista de Compras Consolidada</span>
          </h3>
          <p className="text-xs text-graphite-600 mt-0.5">
            {totalCount === 0
              ? 'Sua lista está vazia no momento.'
              : `${completedCount} de ${totalCount} itens marcados no carrinho.`}
          </p>
        </div>

        <button
          onClick={onSyncFromPlanner}
          disabled={isSyncing}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-forest-100 text-xs font-extrabold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Gerar do Planejamento Semanal</span>
        </button>
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="bg-white p-4 rounded-3xl border border-forest-100 shadow-2xs space-y-3">
        <p className="text-xs font-extrabold text-forest-900">Adicionar item avulso à lista:</p>
        <div className="grid gap-2 sm:grid-cols-12">
          <input
            type="text"
            placeholder="Nome do item (ex: Banana prata)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="sm:col-span-5 text-xs p-2.5 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-800"
          />
          <input
            type="text"
            placeholder="Qtd (ex: 6 un)"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            className="sm:col-span-3 text-xs p-2.5 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-800"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as any)}
            className="sm:col-span-3 text-xs p-2.5 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-800"
          >
            <option value="hortifruti">Hortifruti</option>
            <option value="graos_cereais">Grãos / Farinhas</option>
            <option value="laticinios_ovos">Laticínios / Ovos</option>
            <option value="carnes_proteinas">Carnes / Proteínas</option>
            <option value="temperos_basicos">Temperos / Azeite</option>
            <option value="outros">Outros</option>
          </select>
          <button
            type="submit"
            className="sm:col-span-1 p-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-extrabold text-xs flex items-center justify-center cursor-pointer transition-colors"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </form>

      {/* Categorized List */}
      {totalCount === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-forest-100 p-6 space-y-3">
          <div className="size-12 mx-auto rounded-full bg-cream-100 flex items-center justify-center text-forest-700">
            <ShoppingBag className="size-6" />
          </div>
          <h4 className="font-extrabold text-sm text-graphite-800">Nenhum ingrediente na lista</h4>
          <p className="text-xs text-graphite-500 max-w-sm mx-auto">
            Adicione receitas ao seu Planejador Semanal e clique em "Gerar do Planejamento" para organizar suas compras automaticamente.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => {
            const itemsInCat = list.items.filter((i) => i.category === cat.id);
            if (itemsInCat.length === 0) return null;

            return (
              <div key={cat.id} className="bg-white rounded-3xl border border-forest-100 p-5 shadow-2xs space-y-3">
                <h4 className="font-extrabold text-xs text-forest-900 border-b border-forest-100/60 pb-2">
                  {cat.label} ({itemsInCat.length})
                </h4>

                <div className="divide-y divide-forest-100/50">
                  {itemsInCat.map((item) => (
                    <div
                      key={item.id}
                      className="py-2.5 flex items-center justify-between gap-3 group"
                    >
                      <div
                        onClick={() => handleToggle(item.id)}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <div
                          className={`size-5 rounded-lg border flex items-center justify-center transition-all ${
                            item.checked
                              ? 'bg-forest-700 border-forest-700 text-white'
                              : 'border-forest-200 bg-cream-100 group-hover:border-forest-500'
                          }`}
                        >
                          {item.checked && <Check className="size-3.5 stroke-[3]" />}
                        </div>
                        <div className={item.checked ? 'line-through opacity-50' : ''}>
                          <p className="text-xs font-bold text-graphite-900">{item.name}</p>
                          {item.amount && (
                            <p className="text-[10px] text-forest-800 font-semibold">{item.amount}</p>
                          )}
                          {item.recipeSource && (
                            <p className="text-[9px] text-graphite-400">Receita: {item.recipeSource}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 text-graphite-300 hover:text-terracotta-600 rounded-lg transition-colors cursor-pointer"
                        title="Remover item"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
