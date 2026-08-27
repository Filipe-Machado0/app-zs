import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updatePreferences } = useAuth();

  const [step, setStep] = useState(1);
  const [acceptedFoods, setAcceptedFoods] = useState<string[]>(profile?.preferences?.acceptedFoods || ['Batata', 'Banana']);
  const [challengingMeals, setChallengingMeals] = useState<string[]>(profile?.preferences?.challengingMeals || ['jantar']);
  const [preferredTextures, setPreferredTextures] = useState<string[]>(profile?.preferences?.preferredTextures || ['crocante', 'macio']);
  const [cookingTime, setCookingTime] = useState(profile?.preferences?.cookingTimeMinutes || 25);
  const [weeklyGoal, setWeeklyGoal] = useState(profile?.preferences?.weeklyGoal || 'Testar 1 variação sutil no fim de semana');

  const foodOptions = ['Batata', 'Banana', 'Pão', 'Arroz', 'Frango', 'Ovo', 'Maçã', 'Macarrão', 'Queijo', 'Cenoura'];
  const mealOptions = [
    { id: 'cafe_da_manha', label: 'Café da Manhã' },
    { id: 'lanche', label: 'Lanches / Escola' },
    { id: 'almoco', label: 'Almoço' },
    { id: 'jantar', label: 'Jantar' },
  ];
  const textureOptions = ['crocante', 'macio', 'sequinho', 'cremoso', 'aveludado'];

  const toggleItem = (list: string[], item: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinish = async () => {
    await updatePreferences({
      acceptedFoods,
      challengingMeals,
      preferredTextures,
      cookingTimeMinutes: cookingTime,
      weeklyGoal,
    });
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#FFF9EE] text-[#26332D] flex flex-col justify-center py-10 px-4 sm:px-6">
      <div className="max-w-lg w-full mx-auto space-y-6">
        
        {/* Progress Bar & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="font-extrabold text-xs text-forest-900">Personalizar Minha Experiência</span>
          </div>
          <button
            onClick={() => navigate('/app')}
            className="text-xs font-bold text-graphite-400 hover:text-graphite-700 cursor-pointer"
          >
            Pular por enquanto
          </button>
        </div>

        <div className="w-full bg-cream-300 h-2 rounded-full overflow-hidden">
          <div
            className="bg-forest-800 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-sm space-y-6">
          
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full">
                  Etapa 1 de 3
                </span>
                <h2 className="text-lg font-extrabold text-graphite-900 mt-2">
                  Quais alimentos a criança costuma aceitar com mais facilidade?
                </h2>
                <p className="text-xs text-graphite-500 mt-1">
                  Nossas receitas partem desses alimentos conhecidos para criar variações sem estresse.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {foodOptions.map((f) => {
                  const selected = acceptedFoods.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleItem(acceptedFoods, f, setAcceptedFoods)}
                      className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selected
                          ? 'bg-forest-800 text-white shadow-xs'
                          : 'bg-cream-100 text-graphite-800 hover:bg-forest-100 border border-cream-300'
                      }`}
                    >
                      {selected && <Check className="size-3.5" />}
                      <span>{f}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-4 py-3 px-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-forest-100 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Avançar</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full">
                  Etapa 2 de 3
                </span>
                <h2 className="text-lg font-extrabold text-graphite-900 mt-2">
                  Refeições e texturas preferidas
                </h2>
                <p className="text-xs text-graphite-500 mt-1">
                  Selecione as refeições que costumam ser mais desafiadoras na rotina familiar.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-graphite-800">Refeições desafiadoras:</label>
                <div className="grid grid-cols-2 gap-2">
                  {mealOptions.map((m) => {
                    const selected = challengingMeals.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleItem(challengingMeals, m.id, setChallengingMeals)}
                        className={`p-2.5 rounded-2xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                          selected
                            ? 'bg-terracotta-500 text-white shadow-xs'
                            : 'bg-cream-100 text-graphite-800 hover:bg-honey-100 border border-cream-300'
                        }`}
                      >
                        <span>{m.label}</span>
                        {selected && <Check className="size-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-graphite-800">Texturas com melhor aceitação:</label>
                <div className="flex flex-wrap gap-2">
                  {textureOptions.map((t) => {
                    const selected = preferredTextures.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleItem(preferredTextures, t, setPreferredTextures)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          selected
                            ? 'bg-forest-700 text-white shadow-xs font-bold'
                            : 'bg-cream-100 text-graphite-800 hover:bg-forest-100 border border-cream-300'
                        }`}
                      >
                        #{t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 px-3 rounded-2xl bg-cream-100 text-graphite-700 font-bold text-xs"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 py-3 px-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-forest-100 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Próximo</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full">
                  Etapa 3 de 3
                </span>
                <h2 className="text-lg font-extrabold text-graphite-900 mt-2">
                  Tempo disponível e objetivo suave
                </h2>
                <p className="text-xs text-graphite-500 mt-1">
                  O objetivo serve apenas para orientar seu aplicativo, sem pressão.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-graphite-800">
                  Tempo médio para preparar refeições: <strong>{cookingTime} minutos</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(Number(e.target.value))}
                  className="w-full accent-forest-800"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-graphite-800">Objetivo para esta semana:</label>
                <input
                  type="text"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(e.target.value)}
                  placeholder="Ex: Servir uma variação de corte no almoço de sábado"
                  className="w-full text-xs p-3 rounded-xl bg-cream-100 border border-forest-100 focus:outline-none focus:bg-white text-graphite-800"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-forest-50 border border-forest-100 text-[11px] text-forest-900 leading-relaxed">
                ✓ Você pode alterar ou apagar essas preferências a qualquer momento no seu Perfil.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 px-3 rounded-2xl bg-cream-100 text-graphite-700 font-bold text-xs"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-2/3 py-3.5 px-4 rounded-2xl bg-forest-800 hover:bg-forest-900 text-forest-100 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Concluir e Ir para o App</span>
                </button>
              </div>
            </div>
          )}

        </div>

        <p className="text-center text-[10px] text-graphite-400 flex items-center justify-center gap-1">
          <ShieldCheck className="size-3 text-forest-700" />
          <span>Privacidade total: nenhuma informação clínica ou da criança é solicitada</span>
        </p>

      </div>
    </div>
  );
};
