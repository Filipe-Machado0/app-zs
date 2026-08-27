import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Disclaimer } from '../../components/common/Disclaimer';

export const Terms: React.FC = () => {
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
            <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900">Termos de Uso</h1>
            <p className="text-xs text-graphite-500 mt-1">Última atualização: Janeiro de 2026</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-graphite-700 leading-relaxed">
            <h2 className="font-extrabold text-forest-900 text-sm sm:text-base">1. Natureza Educativa e Organizacional</h2>
            <p>
              O <strong>Cardápio Seletivo</strong> é uma plataforma exclusivamente informativa, educacional e de apoio à organização doméstica de refeições. Nossos materiais, receitas e recursos de planejamento não constituem consulta médica, diagnóstico, prescrição dietética ou tratamento fonoaudiológico e nutricional.
            </p>

            <h2 className="font-extrabold text-forest-900 text-sm sm:text-base">2. Responsabilidade dos Pais e Responsáveis</h2>
            <p>
              A conta e o uso do aplicativo são de inteira responsabilidade dos adultos responsáveis. Cabe exclusivamente à família avaliar os ingredientes utilizados, eventuais alergias, intolerâncias alimentares conhecidas e a adequação das texturas à maturidade de mastigação de cada criança.
            </p>

            <h2 className="font-extrabold text-forest-900 text-sm sm:text-base">3. Propriedade Intelectual e Acesso Individual</h2>
            <p>
              O acesso aos materiais, e-books e recursos do aplicativo é pessoal, intransferível e licenciado para uso privado da família compradora. É proibida a redistribuição comercial, rateio, cópia pública ou revenda do conteúdo.
            </p>
          </div>
        </div>

        <Disclaimer compact />
      </div>
    </div>
  );
};
