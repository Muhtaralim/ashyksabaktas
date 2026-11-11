import React, { useState } from 'react';
import { useLesson } from '../context/LessonContext';
import { graphicCategories, graphicSoftwareItems, MatchItem } from '../data/lessonData';
import { Layers, CheckCircle2, RotateCcw, ExternalLink, ArrowRight, Play, Maximize2 } from 'lucide-react';

export const MatchingGraphicTask: React.FC = () => {
  const { setTaskScore, setActiveTab, scores } = useLesson();

  const originalLink = "https://wordwall.net/ru/resource/36565861";
  const embedLink = "https://wordwall.net/ru/embed/a5a847b1630a476e9c93d8caba4330c9?themeId=1";

  // Mode: 'wordwall' (open live embed by default) vs 'interactive' (built-in)
  const [viewMode, setViewMode] = useState<'wordwall' | 'interactive'>('wordwall');

  // Stores mapped category for each software ID in built-in mode
  const [userMatches, setUserMatches] = useState<{ [id: string]: string }>({});
  const [selectedSoftware, setSelectedSoftware] = useState<MatchItem | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [manualScore, setManualScore] = useState<number>(10);

  const handleSelectCategory = (categoryId: string) => {
    if (!selectedSoftware) return;
    setUserMatches(prev => ({
      ...prev,
      [selectedSoftware.id]: categoryId
    }));
    setSelectedSoftware(null);
  };

  const handleReset = () => {
    setUserMatches({});
    setSelectedSoftware(null);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    let correct = 0;
    graphicSoftwareItems.forEach(item => {
      if (userMatches[item.id] === item.category) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / graphicSoftwareItems.length) * 10);
    setTaskScore('task1', calculatedScore);
    setIsSubmitted(true);
  };

  const handleSaveWordwallScore = () => {
    setTaskScore('task1', manualScore);
    setIsSubmitted(true);
  };

  const unassignedItems = graphicSoftwareItems.filter(item => !userMatches[item.id]);
  const correctCount = graphicSoftwareItems.filter(item => userMatches[item.id] === item.category).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6 px-4">
      {/* Task header and rubrics banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
              <Layers className="w-3.5 h-3.5" /> 1-тапсырма · Wordwall ойыны
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Графика түрлері мен бағдарламаларды топтастыру
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Ресми Wordwall сілтемесі: <a href={originalLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold underline inline-flex items-center gap-1">{originalLink} <ExternalLink className="w-3 h-3" /></a>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right">
            <span className="text-xs text-slate-500 font-medium block">Дескриптор балы:</span>
            <span className="text-lg font-black text-blue-600 tabular-nums">
              {scores.task1} / 10 балл
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('wordwall')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'wordwall'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Wordwall тікелей терезесі (Ашық)</span>
            </button>
            <button
              onClick={() => setViewMode('interactive')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Қосымшадағы сәйкестендіру студиясы</span>
            </button>
          </div>

          <a
            href={originalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
          >
            <span>Wordwall сайтын толық экранда ашу</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* VIEW 1: WORDWALL DIRECT EMBED & SCORE LOGGER */}
      {viewMode === 'wordwall' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold">Wordwall ресми ойын терезесі ашық тұр:</span>
              <span className="text-slate-600">Ойынды тікелей төменде ойнап, жинаған ұпайыңызды сақтаңыз.</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-slate-700">Жинаған балыңыз:</span>
              <select
                value={manualScore}
                onChange={(e) => setManualScore(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-blue-600"
              >
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(n => (
                  <option key={n} value={n}>{n} балл</option>
                ))}
              </select>
              <button
                onClick={handleSaveWordwallScore}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer text-xs"
              >
                Баллды тіркеу
              </button>
            </div>
          </div>

          {/* Wordwall iframe */}
          <div className="w-full h-[520px] sm:h-[620px] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 relative">
            <iframe
              src={embedLink}
              title="Wordwall 36565861"
              allowFullScreen
              allow="fullscreen; autoplay"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* VIEW 2: BUILT-IN INTERACTIVE MATCHING STUDIO */}
      {viewMode === 'interactive' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {graphicCategories.map(cat => {
              const matchedHere = graphicSoftwareItems.filter(item => userMatches[item.id] === cat.id);

              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`rounded-2xl border p-4 transition-all flex flex-col justify-between min-h-[300px] ${
                    selectedSoftware
                      ? 'border-blue-400 bg-blue-50/30 ring-2 ring-blue-400/20 cursor-pointer hover:bg-blue-50/60'
                      : 'border-slate-200 bg-white shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-sm font-extrabold text-slate-900">{cat.title}</h2>
                      <span className="text-[11px] font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md">
                        {matchedHere.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">{cat.desc}</p>

                    {selectedSoftware && (
                      <div className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 p-2 rounded-lg text-center mb-3 animate-pulse">
                        «{selectedSoftware.name}» осында қосу
                      </div>
                    )}

                    <div className="space-y-2">
                      {matchedHere.length === 0 ? (
                        <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400">
                          Бағдарлама таңдап осында басыңыз
                        </div>
                      ) : (
                        matchedHere.map(item => {
                          const isCorrect = item.category === cat.id;
                          return (
                            <div
                              key={item.id}
                              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                                isSubmitted
                                  ? isCorrect
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                    : 'bg-rose-50 border-rose-300 text-rose-900'
                                  : 'bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                            >
                              <div>
                                <div className="font-bold">{item.name}</div>
                                <div className="text-[10px] text-slate-500 font-normal">{item.desc}</div>
                              </div>
                              {!isSubmitted ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUserMatches(prev => {
                                      const copy = { ...prev };
                                      delete copy[item.id];
                                      return copy;
                                    });
                                  }}
                                  className="text-slate-400 hover:text-rose-600 px-1 text-sm font-bold"
                                  title="Қайтару"
                                >
                                  ✕
                                </button>
                              ) : (
                                <span className="shrink-0 text-sm">
                                  {isCorrect ? '✅' : '❌'}
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold text-slate-800">
                Орналастырылмаған бағдарламалар ({unassignedItems.length}):
              </h2>
              {selectedSoftware && (
                <span className="text-xs font-medium text-blue-600">
                  Таңдалды: <strong>{selectedSoftware.name}</strong>. Жоғарыдағы топты басыңыз.
                </span>
              )}
            </div>

            {unassignedItems.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800">
                Барлық 10 бағдарлама топтарға бөлінді! «Тексеру» батырмасын басыңыз.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {unassignedItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSoftware(item)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedSoftware?.id === item.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Қайта бастау</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={unassignedItems.length > 0}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Нәтижені тексеру</span>
                </button>
              </div>

              {isSubmitted && (
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span>Дұрысы: {correctCount} / 10</span>
                  <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
                    Балл: {scores.task1} / 10
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Next step button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setActiveTab('task2')}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
        >
          <span>2-тапсырмаға өту: Wayground тесті</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
