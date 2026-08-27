import React, { useEffect, useState } from 'react';
import { BookOpen, Download, Lock, Sparkles, FileText, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { ContentAsset } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const Materials: React.FC = () => {
  const navigate = useNavigate();
  const { isBasic, isPremium, role } = useAuth();
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const res = await api.getMaterials();
        setAssets(res.assets);
      } catch (err) {
        console.error('Erro ao buscar materiais:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAssets();
  }, []);

  const handleDownload = async (asset: ContentAsset) => {
    if (asset.requiredTier === 'premium' && isBasic) {
      navigate('/planos');
      return;
    }

    setDownloadingId(asset.id);
    try {
      const res = await api.getMaterialDownloadUrl(asset.id);
      if (res.downloadUrl) {
        window.open(res.downloadUrl, '_blank');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao gerar link de download seguro.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-0.5 rounded-full">
          Biblioteca Digital
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900 mt-2">
          E-books e Materiais Educativos
        </h1>
        <p className="text-xs text-graphite-600 mt-1">
          Acesse e baixe os arquivos em PDF protegidos do seu plano para consultar a qualquer momento.
        </p>
      </div>

      {/* Basic Callout for Premium Assets */}
      {isBasic && (
        <div className="p-5 rounded-3xl bg-terracotta-50 border border-terracotta-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-terracotta-800 text-xs font-extrabold">
              <Sparkles className="size-4 text-terracotta-600" />
              <span>4 Bônus Digitais Exclusivos</span>
            </div>
            <p className="text-xs text-graphite-600 leading-relaxed max-w-md">
              Os Guias Práticos de Texturas, 30 Lanchinhos e Planejador Interativo estão disponíveis no Plano Premium.
            </p>
          </div>
          <button
            onClick={() => navigate('/planos')}
            className="px-4 py-2.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-extrabold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Liberar Todos os Bônus (R$ 19)
          </button>
        </div>
      )}

      {/* Grid of Materials */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="size-8 text-forest-700 animate-spin mx-auto" />
          <p className="text-xs font-bold text-graphite-600">Carregando seus materiais...</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {assets.map((asset) => {
            const isLocked = isBasic && asset.requiredTier === 'premium';
            const isProcessing = downloadingId === asset.id;

            return (
              <div
                key={asset.id}
                className="bg-white rounded-3xl border border-forest-100 p-5 shadow-2xs flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-graphite-400 bg-cream-100 px-2.5 py-0.5 rounded-full">
                      {asset.format} • {asset.fileSize}
                    </span>
                    {isLocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full">
                        <Lock className="size-2.5" />
                        <span>Premium</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="size-3" />
                        <span>Liberado</span>
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="size-14 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 shrink-0">
                      <FileText className="size-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-graphite-900 leading-snug">
                        {asset.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-forest-800">
                        {asset.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-graphite-600 leading-relaxed">
                    {asset.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-forest-100/60">
                  {isLocked ? (
                    <button
                      onClick={() => navigate('/planos')}
                      className="w-full py-2.5 px-3 rounded-xl bg-cream-100 hover:bg-honey-100 text-graphite-800 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="size-3 text-terracotta-600" />
                      <span>Fazer Upgrade para Baixar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownload(asset)}
                      disabled={isProcessing}
                      className="w-full py-2.5 px-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-forest-100 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Gerando link seguro...</span>
                        </>
                      ) : (
                        <>
                          <Download className="size-3.5" />
                          <span>Baixar Arquivo PDF</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
