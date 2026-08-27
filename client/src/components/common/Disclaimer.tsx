import React from 'react';
import { Info } from 'lucide-react';

export const Disclaimer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-start gap-2 p-3 bg-honey-100/60 rounded-xl border border-honey-300/60 text-xs text-graphite-800">
        <Info className="size-4 text-forest-800 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Aviso educativo:</strong> Este material oferece sugestões práticas de organização. Não substitui acompanhamento individual de médicos, pediatras, nutricionistas ou fonoaudiólogos.
        </p>
      </div>
    );
  }

  return (
    <footer className="mt-12 pt-8 pb-16 sm:pb-8 border-t border-forest-100 text-center text-xs text-graphite-600 space-y-3 px-4">
      <div className="max-w-2xl mx-auto bg-cream-100 p-4 rounded-2xl border border-forest-100/80 shadow-2xs">
        <p className="font-semibold text-forest-900 mb-1">
          🌱 Apoio Educacional e Prático para Famílias
        </p>
        <p className="leading-relaxed text-[11px] text-graphite-600">
          O <strong>Cardápio Seletivo</strong> é uma ferramenta prática de rotina para ajudar responsáveis a variar refeições a partir de alimentos familiares com calma e respeito ao tempo da criança. Não fazemos promessas de cura, diagnóstico ou intervenção clínica. Em caso de dúvidas sobre crescimento, alergias ou deglutição, consulte sempre profissionais de saúde habilitados.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-[11px] font-medium text-forest-800">
        <a href="/termos" className="hover:underline">Termos de Uso</a>
        <span>•</span>
        <a href="/privacidade" className="hover:underline">Privacidade</a>
        <span>•</span>
        <a href="/reembolso" className="hover:underline">Política de Reembolso</a>
        <span>•</span>
        <a href="/contato" className="hover:underline">Contato & Suporte</a>
      </div>
      <p className="text-[10px] text-graphite-400">
        © {new Date().getFullYear()} Cardápio Seletivo • Todos os direitos reservados.
      </p>
    </footer>
  );
};
