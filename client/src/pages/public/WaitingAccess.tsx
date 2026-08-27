import React from 'react';
import { Clock, Sparkles, HelpCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Disclaimer } from '../../components/common/Disclaimer';

export const WaitingAccess: React.FC = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#FFF9EE] text-[#26332D] flex flex-col justify-between p-4 sm:p-6">
      
      {/* Top Bar */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <span className="font-extrabold text-sm text-forest-900">Cardápio Seletivo</span>
        </div>
        <button
          onClick={logout}
          className="text-xs font-bold text-graphite-500 hover:text-graphite-800"
        >
          Sair da Conta
        </button>
      </div>

      {/* Main Card */}
      <main className="max-w-md w-full mx-auto my-8 bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 shadow-sm text-center space-y-6">
        <div className="size-16 mx-auto rounded-3xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800">
          <Clock className="size-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded-full">
            Conta Conectada
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-graphite-900">
            Aguardando Liberação de Acesso
          </h1>
          <p className="text-xs text-graphite-600 leading-relaxed">
            Olá, <strong>{profile?.displayName || profile?.email}</strong>! Sua conta foi criada com sucesso. Para acessar a área de membros e os conteúdos educativos, é necessário vincular uma compra confirmada.
          </p>
        </div>

        {/* Info box */}
        <div className="bg-cream-100 p-4 rounded-2xl border border-cream-300 text-left text-xs text-graphite-700 space-y-2">
          <p className="font-bold text-forest-900 flex items-center gap-1.5">
            <Sparkles className="size-4 text-terracotta-500" />
            <span>Como funciona a liberação:</span>
          </p>
          <p className="text-[11px] leading-relaxed">
            Se você acabou de realizar o pagamento via Pix ou Cartão, a liberação ocorre de forma automática em poucos instantes após a confirmação bancária.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => navigate('/planos')}
            className="w-full py-3.5 px-4 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ver Planos Disponíveis (a partir de R$ 10)</span>
            <ArrowRight className="size-4" />
          </button>

          <button
            onClick={() => navigate('/contato')}
            className="w-full py-3 px-4 rounded-2xl bg-cream-100 hover:bg-cream-200 text-graphite-800 font-extrabold text-xs border border-forest-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="size-4 text-forest-700" />
            <span>Já comprei, preciso de ajuda</span>
          </button>
        </div>

        <p className="text-[10px] text-graphite-400">
          Suporte: suporte@cardapioseletivo.com.br
        </p>
      </main>

      <Disclaimer compact />
    </div>
  );
};
