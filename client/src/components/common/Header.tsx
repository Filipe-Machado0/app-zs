import React from 'react';
import { Sparkles, User, ShieldAlert, LogOut, BookOpen, Layers } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { profile, role, isBasic, isPremium, isAdmin, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-[#FFF9EE]/90 backdrop-blur-md border-b border-forest-100/80 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo / Brand */}
        <div
          onClick={() => navigate('/app')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <img
              src="/logo.png"
              alt="Zero Seletividade"
              className="size-11 sm:size-12 object-contain group-hover:scale-105 transition-transform drop-shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white font-black">
              ★
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-[#116B4C] leading-none uppercase">
                ZERO SELETIVIDADE
              </h1>
              <span className="bg-[#E66B2E] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                Kids
              </span>
            </div>
            <p className="text-[10px] font-bold text-emerald-800 tracking-wide mt-0.5">
              Aventura Alimentar em Família 🌱
            </p>
          </div>
        </div>

        {/* Right side actions / badges */}
        <div className="flex items-center gap-2.5">
          {/* Badge do Plano */}
          {role === 'basic' && (
            <button
              onClick={() => navigate('/planos')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-extrabold border border-forest-200 hover:bg-forest-200 transition-colors"
            >
              <BookOpen className="size-3.5" />
              <span>Plano Básico • Upgrade</span>
            </button>
          )}

          {role === 'premium' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800 text-forest-100 text-xs font-extrabold shadow-2xs">
              <Sparkles className="size-3.5 text-honey-300" />
              <span>Premium Vitalício</span>
            </span>
          )}

          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-graphite-800 text-white text-xs font-bold hover:bg-graphite-900 transition-colors"
            >
              <ShieldAlert className="size-3.5 text-honey-300" />
              <span>Painel Admin</span>
            </button>
          )}

          {/* Seletor de Role Demo (Ambiente de desenvolvimento/testes rápidos) */}
          <div className="relative group">
            <button
              title="Alternar Papel para Teste"
              className="p-2 rounded-xl bg-cream-100 border border-forest-100 text-graphite-600 hover:text-forest-800 hover:border-forest-200 transition-all text-xs flex items-center gap-1"
            >
              <Layers className="size-4" />
              <span className="hidden md:inline font-semibold text-[11px] capitalize">{role}</span>
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:block bg-white border border-forest-100 shadow-lg rounded-2xl p-2 w-48 z-50 text-xs space-y-1">
              <p className="text-[10px] font-bold text-graphite-400 px-2 py-1 uppercase tracking-wider">Testar visualização como:</p>
              <button
                onClick={() => switchDemoRole('none')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-cream-100 transition-colors ${role === 'none' ? 'font-extrabold text-terracotta-600 bg-terracotta-50' : 'text-graphite-800'}`}
              >
                1. Sem Compra (Pendente)
              </button>
              <button
                onClick={() => switchDemoRole('basic')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-cream-100 transition-colors ${role === 'basic' ? 'font-extrabold text-forest-800 bg-forest-50' : 'text-graphite-800'}`}
              >
                2. Comprador Básico (R$ 10)
              </button>
              <button
                onClick={() => switchDemoRole('premium')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-cream-100 transition-colors ${role === 'premium' ? 'font-extrabold text-forest-800 bg-forest-50' : 'text-graphite-800'}`}
              >
                3. Comprador Premium (R$ 19)
              </button>
              <button
                onClick={() => switchDemoRole('admin')}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-cream-100 transition-colors ${role === 'admin' ? 'font-extrabold text-graphite-900 bg-gray-100' : 'text-graphite-800'}`}
              >
                4. Administrador
              </button>
            </div>
          </div>

          {/* Perfil Button */}
          <button
            onClick={() => navigate('/app/perfil')}
            className="p-2 rounded-xl bg-forest-100 text-forest-800 hover:bg-forest-200 transition-colors"
            title="Meu Perfil"
          >
            <User className="size-4.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
