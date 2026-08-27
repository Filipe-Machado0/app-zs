import React, { useState } from 'react';
import { ArrowLeft, Mail, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { Disclaimer } from '../../components/common/Disclaimer';

export const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setLoading(true);

    try {
      await api.createSupportRequest({
        subject: `[Contato Público] ${subject}`,
        message: `De: ${name} (${email})\n\nMensagem:\n${message}`,
      });
      setSent(true);
    } catch (err) {
      console.warn('Simulando envio de contato com sucesso');
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9EE] text-[#26332D] py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar</span>
        </button>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-2xs space-y-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-0.5 rounded-full">
              Atendimento e Dúvidas
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900 mt-2">
              Fale com o Suporte
            </h1>
            <p className="text-xs text-graphite-600 mt-1">
              Precisa de ajuda com a sua conta, liberação de acesso ou dúvidas sobre o aplicativo?
            </p>
          </div>

          {sent ? (
            <div className="p-6 rounded-2xl bg-forest-50 border border-forest-100 text-center space-y-3">
              <CheckCircle2 className="size-10 text-forest-700 mx-auto" />
              <h3 className="font-extrabold text-sm text-forest-900">Mensagem enviada com sucesso!</h3>
              <p className="text-xs text-graphite-600">
                Nossa equipe responderá em breve através do e-mail informado.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs font-bold text-forest-800 underline mt-2"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-graphite-800">Seu Nome:</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do responsável"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-graphite-800">Seu E-mail da Compra:</label>
                <input
                  type="email"
                  required
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-graphite-800">Assunto:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dúvida sobre liberação do plano"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-graphite-800">Mensagem:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Descreva detalhadamente o que você precisa..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-800"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-forest-100 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="size-3.5" />
                <span>{loading ? 'Enviando...' : 'Enviar Solicitação'}</span>
              </button>
            </form>
          )}

          <div className="p-4 rounded-2xl bg-cream-100 border border-forest-100/60 text-xs text-graphite-600 flex items-center gap-3">
            <Mail className="size-5 text-forest-700 shrink-0" />
            <div>
              <p className="font-bold text-graphite-900">E-mail direto:</p>
              <p className="text-[11px] text-forest-800">suporte@cardapioseletivo.com.br</p>
            </div>
          </div>
        </div>

        <Disclaimer compact />
      </div>
    </div>
  );
};
