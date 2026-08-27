import React, { useState } from 'react';
import { User, Sparkles, Bell, Shield, LogOut, CheckCircle2, Lock, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, role, isBasic, isPremium, logout, updatePreferences } = useAuth();

  const [name, setName] = useState(profile?.displayName || '');
  const [weeklyGoal, setWeeklyGoal] = useState(profile?.preferences?.weeklyGoal || '');
  const [cookingTime, setCookingTime] = useState(profile?.preferences?.cookingTimeMinutes || 25);
  const [savedToast, setSavedToast] = useState(false);

  // Reminders states
  const [remindPlanning, setRemindPlanning] = useState(true);
  const [remindPreps, setRemindPreps] = useState(true);
  const [muteAll, setMuteAll] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePreferences({
      ...profile?.preferences,
      weeklyGoal,
      cookingTimeMinutes: cookingTime,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-0.5 rounded-full">
          Conta do Responsável
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900 mt-2">
          Meu Perfil e Preferências
        </h1>
        <p className="text-xs text-graphite-600 mt-1">
          Gerencie seus dados, preferências de rotina e configurações de acesso.
        </p>
      </div>

      {savedToast && (
        <div className="p-3 bg-forest-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md animate-fade-in">
          <CheckCircle2 className="size-4 text-honey-300" />
          <span>Preferências salvas com sucesso!</span>
        </div>
      )}

      {/* Plan Status Banner */}
      <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded-full">
            Status da Licença
          </span>
          <h3 className="font-extrabold text-base text-graphite-900">
            {role === 'basic' ? 'Plano Básico (E-book Digital)' : 'Acesso Premium Vitalício'}
          </h3>
          <p className="text-xs text-graphite-600">
            Vinculado ao e-mail: <strong>{profile?.email}</strong>
          </p>
        </div>

        {isBasic && (
          <button
            onClick={() => navigate('/planos')}
            className="px-4 py-2.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="size-3.5" />
            <span>Fazer Upgrade para Premium (R$ 19)</span>
          </button>
        )}
      </div>

      {/* Edit Profile & Cooking Preferences */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-2xs space-y-5">
        <div className="border-b border-forest-100/60 pb-3">
          <h2 className="font-extrabold text-sm sm:text-base text-forest-900">
            Preferências da Rotina Culinária
          </h2>
          <p className="text-xs text-graphite-500 mt-0.5">
            Essas opções ajudam o app a sugerir receitas de forma mais assertiva.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-graphite-800">Nome do responsável:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-3 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-graphite-800">
              Tempo médio disponível para cozinhar: <strong>{cookingTime} minutos</strong>
            </label>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={cookingTime}
              onChange={(e) => setCookingTime(Number(e.target.value))}
              className="w-full accent-forest-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-graphite-800">Objetivo suave da semana:</label>
            <input
              type="text"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(e.target.value)}
              placeholder="Ex: Oferecer uma pequena variação de formato no almoço..."
              className="w-full text-xs p-3 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-800"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-3 rounded-2xl bg-forest-800 hover:bg-forest-900 text-forest-100 font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
        >
          Salvar Alterações
        </button>
      </form>

      {/* In-App Reminders Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-2xs space-y-4">
        <div className="border-b border-forest-100/60 pb-3">
          <h2 className="font-extrabold text-sm sm:text-base text-forest-900 flex items-center gap-2">
            <Bell className="size-4 text-forest-700" />
            <span>Lembretes Internos do Aplicativo</span>
          </h2>
          <p className="text-xs text-graphite-500 mt-0.5">
            Ajuda a manter a tranquilidade sem cobranças ou notificações invasivas.
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-cream-100 border border-forest-100/60 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-graphite-900">Lembrete para planejar a semana com calma</p>
              <p className="text-[10px] text-graphite-500">Sugestão sutil para organizar as refeições no domingo ou segunda</p>
            </div>
            <input
              type="checkbox"
              checked={remindPlanning && !muteAll}
              disabled={muteAll}
              onChange={(e) => setRemindPlanning(e.target.checked)}
              className="size-4 accent-forest-800 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-cream-100 border border-forest-100/60 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-graphite-900">Lembrete “Mude apenas um detalhe”</p>
              <p className="text-[10px] text-graphite-500">Dica acolhedora no início do dia</p>
            </div>
            <input
              type="checkbox"
              checked={remindPreps && !muteAll}
              disabled={muteAll}
              onChange={(e) => setRemindPreps(e.target.checked)}
              className="size-4 accent-forest-800 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-terracotta-50/50 border border-terracotta-100/60 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-terracotta-800">Desativar todos os lembretes</p>
              <p className="text-[10px] text-graphite-500">Nenhum aviso será exibido no app</p>
            </div>
            <input
              type="checkbox"
              checked={muteAll}
              onChange={(e) => setMuteAll(e.target.checked)}
              className="size-4 accent-terracotta-600 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Legal & Support Links */}
      <div className="bg-white p-5 rounded-3xl border border-forest-100 shadow-2xs space-y-2">
        <h3 className="font-extrabold text-xs text-graphite-800 px-1">Links e Políticas da Plataforma:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-forest-800">
          <Link to="/termos" className="p-2.5 rounded-xl bg-cream-100 hover:bg-forest-100 text-center">
            Termos de Uso
          </Link>
          <Link to="/privacidade" className="p-2.5 rounded-xl bg-cream-100 hover:bg-forest-100 text-center">
            Privacidade
          </Link>
          <Link to="/reembolso" className="p-2.5 rounded-xl bg-cream-100 hover:bg-forest-100 text-center">
            Reembolso
          </Link>
          <Link to="/contato" className="p-2.5 rounded-xl bg-cream-100 hover:bg-forest-100 text-center">
            Suporte
          </Link>
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full py-3.5 px-4 rounded-2xl bg-cream-100 hover:bg-red-50 hover:text-red-700 text-graphite-700 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-forest-100"
        >
          <LogOut className="size-4" />
          <span>Sair da Minha Conta</span>
        </button>
      </div>

    </div>
  );
};
