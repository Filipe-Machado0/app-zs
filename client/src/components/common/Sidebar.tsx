import React from 'react';
import { Home, Utensils, CalendarDays, ShoppingBag, BookOpen, HelpCircle, User, Lock, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isBasic, isPremium, role } = useAuth();

  const isActive = (path: string) => {
    if (path === '/app' && location.pathname === '/app') return true;
    if (path !== '/app' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Início', path: '/app', icon: Home },
    { label: 'Biblioteca de Receitas', path: '/app/receitas', icon: Utensils },
    { label: 'Planejador Semanal', path: '/app/planejar', icon: CalendarDays, locked: isBasic },
    { label: 'Lista de Compras', path: '/app/compras', icon: ShoppingBag, locked: isBasic },
    { label: 'E-book e Bônus', path: '/app/materiais', icon: BookOpen },
    { label: 'Central de Dúvidas', path: '/app/ajuda', icon: HelpCircle },
    { label: 'Meu Perfil', path: '/app/perfil', icon: User },
  ];

  return (
    <aside className="hidden sm:flex flex-col w-64 shrink-0 bg-[#FFF9EE] border-r border-forest-100 p-4 space-y-6">
      
      {/* User greeting pill */}
      <div className="p-3 bg-cream-100 rounded-2xl border border-forest-100/70 space-y-1">
        <p className="text-[11px] font-semibold text-graphite-600">Espaço do Responsável</p>
        <p className="text-xs font-extrabold text-forest-900 truncate">
          {role === 'basic' ? 'Plano Básico' : role === 'premium' ? 'Plano Premium' : 'Conta Conectada'}
        </p>
      </div>

      {/* Navigation items */}
      <nav className="space-y-1.5 flex-1">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                active
                  ? 'bg-forest-800 text-forest-100 shadow-xs'
                  : 'text-graphite-800 hover:bg-forest-100/70 hover:text-forest-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`size-4.5 ${active ? 'text-honey-300' : 'text-forest-700'}`} />
                <span>{item.label}</span>
              </div>
              {item.locked && (
                <span className="flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-honey-200 text-graphite-800">
                  <Lock className="size-2.5 text-terracotta-600" />
                  <span>Premium</span>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade Callout for Basic Users */}
      {isBasic && (
        <div className="p-4 rounded-2xl bg-terracotta-50 border border-terracotta-100 text-left space-y-2">
          <div className="flex items-center gap-1.5 text-terracotta-700 text-xs font-extrabold">
            <Sparkles className="size-4" />
            <span>Liberar Recursos</span>
          </div>
          <p className="text-[11px] text-graphite-600 leading-relaxed">
            Tenha filtros inteligentes, planejador semanal e lista de compras com o upgrade Premium.
          </p>
          <button
            onClick={() => navigate('/planos')}
            className="w-full py-2 px-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-extrabold text-xs shadow-xs transition-colors"
          >
            Ver Upgrade (R$ 19)
          </button>
        </div>
      )}

    </aside>
  );
};
