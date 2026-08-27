import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Disclaimer } from '../../components/common/Disclaimer';

export const Refund: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF9EE] text-[#26332D] py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar</span>
        </button>

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-forest-100 shadow-2xs space-y-6">
          <div className="border-b border-forest-100 pb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900">Política de Reembolso e Garantia</h1>
            <p className="text-xs text-graphite-500 mt-1">Garantia incondicional de 7 dias</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-graphite-700 leading-relaxed">
            <p>
              Prezamos pela sua tranquilidade e confiança. Ao adquirir qualquer um dos planos (Básico ou Premium) do <strong>Cardápio Seletivo</strong>, você conta com <strong>7 (sete) dias corridos de garantia incondicional</strong> a partir da data de confirmação do pagamento, em conformidade com o Código de Defesa do Consumidor.
            </p>

            <h2 className="font-extrabold text-forest-900 text-sm sm:text-base">Como solicitar o reembolso:</h2>
            <p>
              Caso sinta que o material não atendeu às expectativas da sua rotina prática, basta enviar um e-mail para <a href="mailto:suporte@cardapioseletivo.com.br" className="font-bold text-forest-800 underline">suporte@cardapioseletivo.com.br</a> com o e-mail utilizado na compra ou o número do pedido.
            </p>

            <div className="p-4 rounded-2xl bg-forest-50 border border-forest-100 text-xs text-forest-900">
              ✓ O estorno é realizado integralmente na mesma forma de pagamento utilizada (Pix ou Cartão) sem burocracia.
            </div>
          </div>
        </div>

        <Disclaimer compact />
      </div>
    </div>
  );
};
