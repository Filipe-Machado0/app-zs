import React from 'react';
import { Lock, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LockedFeatureProps {
  title?: string;
  description?: string;
  featureName?: string;
  compact?: boolean;
}

export const LockedFeatureNotice: React.FC<LockedFeatureProps> = ({
  title = "Recurso Exclusivo do Plano Premium",
  description = "Organize a rotina alimentar da semana com ferramentas inteligentes e práticas.",
  featureName = "este recurso",
  compact = false,
}) => {
  const navigate = useNavigate();
  const { isBasic, role } = useAuth();

  if (compact) {
    return (
      <div className="rounded-2xl border border-forest-100 bg-cream-100 p-4 text-center space-y-2">
        <div className="inline-flex size-9 items-center justify-center rounded-full bg-forest-100 text-forest-800">
          <Lock className="size-4" />
        </div>
        <h4 className="text-xs font-bold text-graphite-900">{title}</h4>
        <p className="text-[11px] text-graphite-600 max-w-xs mx-auto">{description}</p>
        <button
          onClick={() => navigate('/planos')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold transition-all shadow-xs"
        >
          <Sparkles className="size-3.5" />
          <span>Liberar no Premium</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-3xl border border-forest-100 shadow-sm text-center space-y-5 animate-fade-in">
      <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-forest-50 text-forest-800 border border-forest-100">
        <Lock className="size-7 text-forest-800" />
      </div>

      <div className="space-y-1.5">
        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full">
          Upgrade de Conveniência
        </span>
        <h3 className="text-lg sm:text-xl font-extrabold text-graphite-900">
          {title}
        </h3>
        <p className="text-xs text-graphite-600 leading-relaxed max-w-sm mx-auto">
          {description}
        </p>
      </div>

      <div className="bg-cream-100 rounded-2xl p-4 text-left space-y-2 border border-cream-300/60 text-xs">
        <p className="font-bold text-forest-900 flex items-center gap-1.5">
          <Sparkles className="size-4 text-terracotta-500" />
          O que você libera no Cardápio Seletivo Premium:
        </p>
        <ul className="space-y-1.5 text-[11px] text-graphite-800">
          <li className="flex items-center gap-2">
            <Check className="size-3.5 text-forest-700 shrink-0" />
            <span>Filtros inteligentes por alimento aceito, textura, cor e formato</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-3.5 text-forest-700 shrink-0" />
            <span>Planejador semanal interativo (segunda a domingo)</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-3.5 text-forest-700 shrink-0" />
            <span>Lista de compras consolidada automática</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-3.5 text-forest-700 shrink-0" />
            <span>Acesso completo aos 4 bônus digitais e Central de Dúvidas</span>
          </li>
        </ul>
      </div>

      <div className="pt-2">
        <button
          onClick={() => navigate('/planos')}
          className="w-full cursor-pointer py-3.5 px-6 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Quero liberar o Premium (R$ 19 vitalício)</span>
          <ArrowRight className="size-4" />
        </button>
        <p className="text-[10px] text-graphite-400 mt-2 flex items-center justify-center gap-1">
          <ShieldCheck className="size-3 text-forest-700" />
          <span>Pagamento único sem mensalidades • Acesso imediato</span>
        </p>
      </div>
    </div>
  );
};
