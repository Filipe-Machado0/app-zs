import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isFirebaseConfigured } from '../../services/firebase';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9EE] text-[#26332D] flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex size-12 rounded-3xl bg-forest-800 text-forest-100 items-center justify-center shadow-md">
            <span className="text-2xl">🌱</span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-900 tracking-tight">
            Cardápio Seletivo
          </h1>
          <p className="text-xs text-graphite-600">
            Acesse a área de membros exclusiva para responsáveis
          </p>
        </div>

        {/* Development Notice if Firebase is not yet configured */}
        {!isFirebaseConfigured && (
          <div className="p-3.5 rounded-2xl bg-honey-100/90 border border-honey-300 text-xs text-graphite-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-forest-900">
              <Sparkles className="size-4 text-terracotta-500" />
              <span>Modo Demonstração Ativo (Dev)</span>
            </div>
            <p className="text-[11px] text-graphite-600 leading-relaxed">
              Você pode entrar com qualquer e-mail para testar. Dica: use <code>admin@...</code> para ver como Admin, <code>basico@...</code> para Plano Básico, ou qualquer outro para Premium.
            </p>
          </div>
        )}

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-sm space-y-6">
          <div className="border-b border-forest-100 pb-3">
            <h2 className="font-extrabold text-base text-graphite-900">Entrar na sua conta</h2>
            <p className="text-xs text-graphite-500 mt-0.5">Preencha seus dados de acesso</p>
          </div>

          {(error || authError) && (
            <div className="p-3.5 rounded-2xl bg-terracotta-50 border border-terracotta-100 text-xs font-bold text-terracotta-700 flex items-start gap-2">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>{error || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-graphite-800">E-mail do responsável:</label>
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-graphite-800">Senha:</label>
                <Link
                  to="/recuperar-senha"
                  className="text-[11px] font-bold text-forest-800 hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-graphite-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-cream-100 border border-forest-100 text-xs sm:text-sm focus:outline-none focus:border-forest-700 focus:bg-white text-graphite-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-forest-100 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Entrando...' : 'Entrar no Aplicativo'}</span>
              <ArrowRight className="size-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-forest-100 text-xs text-graphite-600">
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro" className="font-extrabold text-forest-800 hover:underline">
              Criar conta agora
            </Link>
          </div>
        </div>

        <p className="text-center text-[10px] text-graphite-400 flex items-center justify-center gap-1">
          <ShieldCheck className="size-3 text-forest-700" />
          <span>Ambiente seguro e criptografado</span>
        </p>

      </div>
    </div>
  );
};
