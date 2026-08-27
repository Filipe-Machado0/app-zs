import React from 'react';
import { Home, Utensils, CalendarDays, ShoppingBag, BookOpen, User, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isBasic, isPremium } = useAuth();

  const isActive = (path: string) => {
    if (path === '/app' && location.pathname === '/app') return true;
    if (path !== '/app' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = isBasic
    ? [
        { label: 'Início', path: '/app', icon: Home },
        { label: 'Receitas', path: '/app/receitas', icon: Utensils },
        { label: 'E-book', path: '/app/materiais', icon: BookOpen },
        { label: 'Planejar', path: '/app/planejar', icon: CalendarDays, locked: true },
        { label: 'Perfil', path: '/app/perfil', icon: User },
      ]
    : [
        { label: 'Início', path: '/app', icon: Home },
        { label: 'Receitas', path: '/app/receitas', icon: Utensils },
        { label: 'Planejar', path: '/app/planejar', icon: CalendarDays },
        { label: 'Compras', path: '/app/compras', icon: ShoppingBag },
        { label: 'Perfil', path: '/app/perfil', icon: User },
      ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF9EE]/95 backdrop-blur-lg border-t border-forest-100/90 py-1.5 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer relative ${
                active
                  ? 'text-forest-800 font-extrabold bg-forest-100/70 scale-105'
                  : 'text-graphite-600 font-medium hover:text-forest-800'
              }`}
            >
              <div className="relative">
                <Icon className={`size-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.locked && (
                  <span className="absolute -top-1 -right-1.5 size-3 bg-terracotta-500 rounded-full flex items-center justify-center text-white text-[8px]">
                    <Lock className="size-2" />
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
