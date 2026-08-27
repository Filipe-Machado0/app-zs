import React, { useEffect, useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, Send, CheckCircle2, AlertTriangle, ShieldCheck, Mail } from 'lucide-react';
import { api } from '../../api/client';
import { SupportArticle, SupportRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Disclaimer } from '../../components/common/Disclaimer';

export const Support: React.FC = () => {
  const { profile } = useAuth();
  const [articles, setArticles] = useState<SupportArticle[]>([]);
  const [myRequests, setMyRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form states
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'todos', label: 'Todos os Artigos' },
    { id: 'comecar_pelo_conhecido', label: '1. Começar pelo Conhecido' },
    { id: 'textura_apresentacao', label: '2. Textura e Apresentação' },
    { id: 'rotina', label: '3. Rotina e Ambiente' },
    { id: 'planejamento', label: '4. Planejamento Prático' },
    { id: 'quando_procurar_ajuda', label: '5. Quando Procurar Ajuda' },
  ];

  useEffect(() => {
    const loadSupport = async () => {
      try {
        const [articlesRes, requestsRes] = await Promise.all([
          api.getSupportArticles(),
          api.getUserSupportRequests().catch(() => ({ requests: [] })),
        ]);
        setArticles(articlesRes.articles);
        setMyRequests(requestsRes.requests || []);
      } catch (err) {
        console.error('Erro ao buscar suporte:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSupport();
  }, []);

  const handleSendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.createSupportRequest({
        subject: subject.trim(),
        message: message.trim(),
      });
      setMyRequests([res.request, ...myRequests]);
      setSubmitted(true);
      setSubject('');
      setMessage('');
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar mensagem de suporte.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesCat = selectedCategory === 'todos' || a.category === selectedCategory;
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-0.5 rounded-full">
          Autoajuda e Orientação
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900 mt-2">
          Central de Dúvidas da Família
        </h1>
        <p className="text-xs text-graphite-600 mt-1">
          Artigos práticos de apoio para os desafios mais comuns na hora das refeições.
        </p>
      </div>

      {/* Health & Clinical Boundaries Disclaimer Box */}
      <div className="p-4 rounded-3xl bg-honey-100/70 border border-honey-300 text-xs text-graphite-800 space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-forest-900">
          <ShieldCheck className="size-4 text-forest-800" />
          <span>Apoio Educativo e Prático</span>
        </div>
        <p className="text-[11px] leading-relaxed text-graphite-700">
          Esta ferramenta oferece apoio educativo sobre organização e apresentação de alimentos. Ela <strong>não substitui orientação médica ou nutricional individual</strong>. Em casos de perda de peso, estagnação de crescimento, dor, engasgos frequentes ou recusa de líquidos, procure imediatamente o pediatra ou especialista.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-graphite-400" />
          <input
            type="text"
            placeholder="Buscar por dúvida (ex: textura, pressão na mesa, pequenas variações)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-forest-100 text-xs sm:text-sm focus:outline-none focus:border-forest-700 text-graphite-900 shadow-2xs"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-forest-800 text-white shadow-2xs'
                  : 'bg-white text-graphite-700 border border-forest-100 hover:bg-forest-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {filteredArticles.map((art) => {
          const isExpanded = expandedId === art.id;

          return (
            <div
              key={art.id}
              className="bg-white rounded-3xl border border-forest-100 shadow-2xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : art.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-cream-100/50 transition-colors"
              >
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-graphite-900">
                    {art.title}
                  </h3>
                  <p className="text-xs text-graphite-500">
                    {art.summary}
                  </p>
                </div>
                <div className="size-8 rounded-full bg-cream-100 flex items-center justify-center text-forest-800 shrink-0">
                  {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-forest-100/60 text-xs sm:text-sm text-graphite-700 leading-relaxed whitespace-pre-line space-y-3">
                  <p>{art.content}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {art.tags.map((t) => (
                      <span key={t} className="px-2.5 py-0.5 rounded-lg bg-forest-50 text-forest-800 text-[10px] font-semibold">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Form: "Ainda precisa de ajuda?" */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-2xs space-y-5">
        <div className="border-b border-forest-100/60 pb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full">
            Suporte Direto
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-forest-900 mt-2">
            Ainda precisa de ajuda?
          </h2>
          <p className="text-xs text-graphite-600 mt-0.5">
            Envie sua dúvida ou solicitação diretamente para o suporte do aplicativo.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-forest-50 border border-forest-100 text-center space-y-3">
            <CheckCircle2 className="size-10 text-forest-700 mx-auto" />
            <h3 className="font-extrabold text-sm text-forest-900">Mensagem enviada com sucesso!</h3>
            <p className="text-xs text-graphite-600">
              Sua solicitação foi registrada. Responderemos o mais breve possível no seu e-mail ({profile?.email}).
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-bold text-forest-800 underline mt-2"
            >
              Enviar nova mensagem
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendTicket} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-graphite-800">Assunto:</label>
              <input
                type="text"
                required
                placeholder="Ex: Dúvida sobre como adaptar textura de receita"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-graphite-800">Sua Mensagem:</label>
              <textarea
                rows={4}
                required
                placeholder="Explique como podemos ajudar com seu acesso ou receitas..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-900"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-forest-100 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="size-3.5" />
              <span>{submitting ? 'Enviando...' : 'Enviar Solicitação de Suporte'}</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
