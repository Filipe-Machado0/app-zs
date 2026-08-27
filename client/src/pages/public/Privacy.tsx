import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Disclaimer } from '../../components/common/Disclaimer';

export const Privacy: React.FC = () => {
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
            <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900">Política de Privacidade</h1>
            <p className="text-xs text-graphite-500 mt-1">Proteção de dados e respeito total à privacidade da família</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-graphite-700 leading-relaxed">
            <h2 className="font-extrabold text-forest-900 text-sm sm:text-base">1. Dados dos Responsáveis</h2>
            <p>
              Coletamos apenas os dados essenciais para autenticação e prestação do serviço contratado: nome do responsável, e-mail de contato e dados necessários para a liberação do acesso seguro da compra.
            </p>

            <h2 className="font-extrabold text-forest-900 text-sm sm:text-base">2. Não Coleta de Dados de Menores</h2>
            <div className="p-4 rounded-2xl bg-forest-50 border border-forest-100 font-medium text-forest-950 text-xs sm:text-sm">
              🛡️ <strong>Compromisso fundamental:</strong> O Cardápio Seletivo <strong>NÃO</strong> solicita, não coleta e não armazena dados identificáveis de crianças (como nome, data de nascimento, laudos clínicos, diagnósticos médicos ou prontuários de saúde). As preferências de alimentos e texturas cadastradas no onboarding são preferências gerais da rotina culinária e pertencem à conta do responsável.
            </div>

            <h2 className="font-extrabold text-forest-900 text-sm sm:text-base">3. Segurança e Armazenamento</h2>
            <p>
              As informações são protegidas por protocolos modernos de criptografia, com controle de acesso rigoroso via Firebase Authentication e regras de segurança por usuário. Seus dados nunca são comercializados com terceiros.
            </p>
          </div>
        </div>

        <Disclaimer compact />
      </div>
    </div>
  );
};
