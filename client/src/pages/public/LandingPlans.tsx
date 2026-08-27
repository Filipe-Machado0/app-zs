import React from 'react';
import { Check, Sparkles, ShieldCheck, BookOpen, Calendar, HelpCircle, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Disclaimer } from '../../components/common/Disclaimer';

export const LandingPlans: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-[#FFF9EE] text-[#26332D] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-extrabold border border-forest-200">
            🌱 Cardápio Seletivo • Acesso Vitalício
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
            Mais opções práticas para variar as refeições
          </h1>
          <p className="text-xs sm:text-sm text-graphite-600 max-w-xl mx-auto leading-relaxed">
            Parta de alimentos familiares e faça pequenas mudanças de formato, combinação, textura e cor, sem transformar a hora de comer em um confronto.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch max-w-3xl mx-auto">
          
          {/* Card: Plano Básico (R$ 10) */}
          <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 flex flex-col justify-between shadow-2xs space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-graphite-500 bg-cream-100 px-2.5 py-1 rounded-full">
                  Leitor Digital + PDF
                </span>
                <h2 className="text-xl font-extrabold text-graphite-900 mt-2">
                  Plano Básico — E-book
                </h2>
                <p className="text-xs text-graphite-600 mt-1">
                  Ideal para consultar receitas e ideias práticas no celular ou computador.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-xs text-graphite-500 font-medium">Pagamento único</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-forest-900">R$ 10</span>
                  <span className="text-xs text-graphite-500 font-bold">/ vitalício</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-forest-100/60 text-xs text-graphite-700">
                <p className="font-bold text-forest-900">O que está incluído:</p>
                <ul className="space-y-2 text-[11px]">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-forest-700 shrink-0" />
                    <span>Biblioteca do E-book completo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-forest-700 shrink-0" />
                    <span>Receitas organizadas por refeição</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-forest-700 shrink-0" />
                    <span>Ingredientes, substituições e modo de preparo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-forest-700 shrink-0" />
                    <span>Versão pronta para impressão</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => navigate('/cadastro')}
              className="w-full py-3.5 px-4 rounded-2xl bg-forest-100 hover:bg-forest-200 text-forest-900 font-extrabold text-xs transition-colors cursor-pointer text-center"
            >
              Começar com o Plano Básico
            </button>
          </div>

          {/* Card: Plano Premium (R$ 19) */}
          <div className="bg-white rounded-3xl border-2 border-terracotta-500/80 p-6 sm:p-8 flex flex-col justify-between shadow-md space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-terracotta-500 text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-2xl shadow-xs">
              Mais Recomendado
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-full">
                  Acesso Completo + Web App
                </span>
                <h2 className="text-xl font-extrabold text-graphite-900 mt-2">
                  Cardápio Seletivo Premium
                </h2>
                <p className="text-xs text-graphite-600 mt-1">
                  A ferramenta completa de organização, filtros inteligentes e planejamento.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-xs text-graphite-500 font-medium">Pagamento único</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-terracotta-600">R$ 19</span>
                  <span className="text-xs text-graphite-500 font-bold">/ vitalício</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-forest-100/60 text-xs text-graphite-700">
                <p className="font-bold text-forest-900 flex items-center gap-1.5">
                  <Sparkles className="size-4 text-terracotta-500" />
                  <span>Tudo do Básico e mais:</span>
                </p>
                <ul className="space-y-2 text-[11px]">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-forest-700 shrink-0" />
                    <span>Filtros por alimentos aceitos, textura, cor e formato</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-forest-700 shrink-0" />
                    <span>Planejador Semanal Interativo (Seg a Dom)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-forest-700 shrink-0" />
                    <span>Lista de Compras gerada automaticamente</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-forest-700 shrink-0" />
                    <span>Favoritos, lembretes e Central de Dúvidas</span>
                  </li>
                  <li className="flex items-center gap-2 font-bold text-forest-900">
                    <Check className="size-3.5 text-forest-700 shrink-0" />
                    <span>4 Bônus: Guia de Texturas, 30 Lanchinhos e mais</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => navigate('/cadastro')}
              className="w-full py-4 px-4 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Liberar Premium Completo (R$ 19)</span>
              <ArrowRight className="size-4" />
            </button>
          </div>

        </div>

        {/* Security & Access Assurance */}
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-white border border-forest-100 text-center space-y-2">
          <div className="flex items-center justify-center gap-6 text-xs text-graphite-600 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-4 text-forest-700" />
              Acesso Imediato Pós-Pagamento
            </span>
            <span>•</span>
            <span>Sem Mensalidades</span>
            <span>•</span>
            <span>7 Dias de Garantia</span>
          </div>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
};
