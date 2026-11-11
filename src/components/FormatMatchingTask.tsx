import React, { useState } from 'react';
import { useLesson } from '../context/LessonContext';
import { multimediaCategories, multimediaFileItems, MatchItem } from '../data/lessonData';
import { FolderArchive, CheckCircle2, RotateCcw, ArrowRight, ExternalLink } from 'lucide-react';

export const FormatMatchingTask: React.FC = () => {
  const { setTaskScore, setActiveTab, scores } = useLesson();

  const [matches, setMatches] = useState<{ [id: string]: string }>({});
  const [selectedItem, setSelectedItem] = useState<MatchItem | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const waygroundUrl = 'https://wayground.com';

  const handleSelectCategory = (catId: string) => {
    if (!selectedItem) return;
    setMatches(prev => ({
      ...prev,
      [selectedItem.id]: catId
    }));
    setSelectedItem(null);
  };

  const handleReset = () => {
    setMatches({});
    setSelectedItem(null);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    let correct = 0;
    multimediaFileItems.forEach(item => {
      if (matches[item.id] === item.category) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / multimediaFileItems.length) * 10);
    setTaskScore('task5', finalScore);
    setIsSubmitted(true);
  };

  const unassigned = multimediaFileItems.filter(item => !matches[item.id]);
  const correctCount = multimediaFileItems.filter(item => matches[item.id] === item.category).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md mb-2">
              <FolderArchive className="w-3.5 h-3.5" /> 5-тапсырма · Wayground форматы
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Мультимедиа файл пішімдерін топтастыру
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Төмендегі кеңейтілімдерді (форматтарды) өздерінің медиа түрлеріне (Аудио, Бейне, Графика, Мәтін) топтаңыз.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right">
            <span className="text-xs text-slate-500 font-medium block">Дискриптор балы:</span>
            <span className="text-lg font-black text-purple-600 tabular-nums">
              {scores.task5} / 10 балл
            </span>
          </div>
        </div>

        {/* Link Banner with direct open button */}
        <div className="mt-4 p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-purple-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
            <span>
              <strong>Wayground платформасы:</strong>{' '}
              <a
                href={waygroundUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-purple-800 underline hover:text-purple-950 break-all"
              >
                {waygroundUrl}
              </a>
            </span>
          </div>
          <a
            href={waygroundUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <span>Wayground сілтемесін ашу</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Live Wayground Player */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-purple-200 shadow-sm bg-slate-900">
          <div className="p-2.5 bg-purple-900 text-white text-xs flex items-center justify-between">
            <span className="font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Wayground онлайн ойын платформасы (Ашық тұр)
            </span>
            <a
              href={waygroundUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-200 hover:text-white font-bold text-[11px] underline"
            >
              Толық экранда ашу ↗
            </a>
          </div>
          <iframe
            src={waygroundUrl}
            title="Wayground"
            className="w-full h-[450px] border-0 bg-white"
            allowFullScreen
          />
        </div>
      </div>

      {/* 4 Category Buckets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {multimediaCategories.map(cat => {
          const here = multimediaFileItems.filter(item => matches[item.id] === cat.id);

          return (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`rounded-2xl border p-4 transition-all min-h-[260px] flex flex-col justify-between ${
                selectedItem
                  ? 'border-purple-400 bg-purple-50/30 ring-2 ring-purple-300/30 cursor-pointer hover:bg-purple-50/60'
                  : 'border-slate-200 bg-white shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xs font-extrabold text-slate-900">{cat.name}</h2>
                  <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md">
                    {here.length}
                  </span>
                </div>

                {selectedItem && (
                  <div className="text-[10px] font-bold text-purple-700 bg-purple-100 p-1.5 rounded-lg text-center mb-2 animate-pulse">
                    «{selectedItem.name}» осында салу
                  </div>
                )}

                <div className="space-y-1.5">
                  {here.length === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400">
                      Бос ұяшық
                    </div>
                  ) : (
                    here.map(item => {
                      const isCorrect = item.category === cat.id;
                      return (
                        <div
                          key={item.id}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between font-mono font-bold ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                : 'bg-rose-50 border-rose-300 text-rose-900'
                              : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div>
                            <span>{item.name}</span>
                            <div className="text-[9px] font-sans font-normal text-slate-500">{item.desc}</div>
                          </div>
                          {!isSubmitted ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMatches(prev => {
                                  const copy = { ...prev };
                                  delete copy[item.id];
                                  return copy;
                                });
                              }}
                              className="text-slate-400 hover:text-rose-600 px-1 font-bold text-xs"
                            >
                              ✕
                            </button>
                          ) : (
                            <span>{isCorrect ? '✓' : '✕'}</span>
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

      {/* Unassigned Formats */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-700">
            Орналастыруға арналған файл форматтары ({unassigned.length}):
          </h2>
          {selectedItem && (
            <span className="text-xs text-purple-600 font-semibold">
              Таңдалды: <strong>{selectedItem.name}</strong>. Тиісті санатты басыңыз.
            </span>
          )}
        </div>

        {unassigned.length === 0 ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800">
            Барлық 12 формат тиісті санаттарға орналастырылды!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {unassigned.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                  selectedItem?.id === item.id
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Қайта бастау</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={unassigned.length > 0}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Тексеру</span>
            </button>
          </div>

          {isSubmitted && (
            <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span>Дұрысы: {correctCount} / 12</span>
              <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-900">
                Балл: {scores.task5} / 10
              </span>
            </div>
          )}

          <button
            onClick={() => setActiveTab('task6')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors ml-auto"
          >
            <span>6-тапсырма: Movie Maker студиясына өту</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
