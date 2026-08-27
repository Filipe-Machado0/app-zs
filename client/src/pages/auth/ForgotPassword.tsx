import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Não foi possível enviar o e-mail de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9EE] text-[#26332D] flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para o login</span>
        </button>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-sm space-y-6">
          <div>
            <h2 className="font-extrabold text-base text-graphite-900">Recuperar Senha</h2>
            <p className="text-xs text-graphite-500 mt-0.5">
              Informe seu e-mail para receber o link de redefinição
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-terracotta-50 border border-terracotta-100 text-xs font-bold text-terracotta-700 flex items-start gap-2">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {sent ? (
            <div className="p-6 rounded-2xl bg-forest-50 border border-forest-100 text-center space-y-3">
              <CheckCircle2 className="size-10 text-forest-700 mx-auto" />
              <h3 className="font-extrabold text-sm text-forest-900">E-mail de recuperação enviado!</h3>
              <p className="text-xs text-graphite-600 leading-relaxed">
                Verifique sua caixa de entrada (e pasta de spam) para o endereço <strong>{email}</strong> e siga as instruções para cadastrar uma nova senha.
              </p>
              <Link
                to="/login"
                className="inline-block mt-3 px-4 py-2 rounded-xl bg-forest-800 text-forest-100 text-xs font-bold"
              >
                Ir para o Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-graphite-800">E-mail cadastrado:</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-graphite-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu-email@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cream-100 border border-forest-100 text-xs sm:text-sm focus:outline-none focus:border-forest-700 focus:bg-white text-graphite-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-forest-100 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <Send className="size-3.5" />
                <span>{loading ? 'Enviando link...' : 'Enviar Link de Redefinição'}</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
