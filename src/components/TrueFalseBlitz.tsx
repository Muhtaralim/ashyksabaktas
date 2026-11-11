import React, { useState } from 'react';
import { useLesson } from '../context/LessonContext';
import { trueFalseQuestions } from '../data/lessonData';
import { Zap, CheckCircle2, XCircle, RotateCcw, ArrowRight, ShieldCheck, ExternalLink, Play, Sparkles, Check } from 'lucide-react';

export const TrueFalseBlitz: React.FC = () => {
  const { setTaskScore, setActiveTab, scores } = useLesson();

  const [activeMode, setActiveMode] = useState<'wordwall' | 'builtIn'>('wordwall');
  const [answers, setAnswers] = useState<{ [id: number]: boolean | null }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [manualScoreInput, setManualScoreInput] = useState<number>(scores.task3 || 10);
  const [scoreSaved, setScoreSaved] = useState<boolean>(false);

  const wordwallDirectUrl = 'https://wordwall.net/ru/resource/101712152';
  const wordwallEmbedUrl = 'https://wordwall.net/ru/embed/d14c57d5201b4b5dacf5d7d53f37ddd2?themeId=1';

  const handleChoose = (id: number, val: boolean) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [id]: val
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    trueFalseQuestions.forEach(q => {
      if (answers[q.id] === q.isTrue) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / trueFalseQuestions.length) * 10);
    setTaskScore('task3', finalScore);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setIsSubmitted(false);
  };

  const handleSaveWordwallScore = () => {
    const val = Math.max(0, Math.min(10, Number(manualScoreInput) || 0));
    setTaskScore('task3', val);
    setScoreSaved(true);
    setTimeout(() => setScoreSaved(false), 2500);
  };

  const answeredCount = Object.values(answers).filter(v => v !== null && v !== undefined).length;
  const correctCount = trueFalseQuestions.filter(q => answers[q.id] === q.isTrue).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 px-4">

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-600" /> 3-тапсырма · Wordwall (101712152) сұраққа жауап
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              «Ақиқат немесе Жалған» (Иә / Жоқ) блиц-тесті
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Берілген Wordwall ойынын ойнап, негізгі ұғымдар бойынша сұрақтарға жауап беріңіз.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right">
            <span className="text-xs text-slate-500 font-medium block">Дискриптор балы:</span>
            <span className="text-lg font-black text-amber-600 tabular-nums">
              {scores.task3} / 10 балл
            </span>
          </div>
        </div>

        {/* Link Banner with direct open button */}
        <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span>
              <strong>Тапсырма сілтемесі:</strong>{' '}
              <a
                href={wordwallDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-amber-800 underline hover:text-amber-950 break-all"
              >
                {wordwallDirectUrl}
              </a>
            </span>
          </div>
          <a
            href={wordwallDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <span>Wordwall ойынын жаңа терезеде ашу</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => setActiveMode('wordwall')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'wordwall'
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Wordwall интерактивті ойнатқышы (Сілтеме арқылы)</span>
          </button>
          <button
            onClick={() => setActiveMode('builtIn')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'builtIn'
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ішкі жаттығу нұсқасы (Иә/Жоқ 10 сұрақ)</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Live Wordwall Embed */}
      {activeMode === 'wordwall' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-3 bg-slate-900 text-white text-xs flex items-center justify-between">
              <span className="font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Wordwall тікелей плеері (Ресурс: 101712152)
              </span>
              <a
                href={wordwallDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold underline"
              >
                Толық экранда ашу ↗
              </a>
            </div>

            <div className="w-full h-[520px] sm:h-[620px] bg-slate-900 rounded-b-2xl overflow-hidden shadow-md">
              <iframe
                src={wordwallEmbedUrl}
                title="Wordwall 101712152"
                className="w-full h-full border-0"
                allowFullScreen
                allow="fullscreen; autoplay"
              />
            </div>
          </div>

          {/* Score Sync Bar */}
          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-700">
              <span className="font-bold text-amber-800">Wordwall ойынын аяқтадыңыз ба?</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Wordwall-да жинаған ұпайыңызды енгізіңіз немесе бағалау парағына 10 балдық шкаламен бекітіңіз:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="10"
                value={manualScoreInput}
                onChange={(e) => setManualScoreInput(Number(e.target.value))}
                className="w-16 px-2 py-1.5 text-center text-sm font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-500">/ 10 балл</span>
              <button
                onClick={handleSaveWordwallScore}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                {scoreSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{scoreSaved ? 'Бекітілді!' : 'Балды сақтау'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Built-in 10 Questions Grid */}
      {activeMode === 'builtIn' && (
        <>
          <div className="space-y-3">
            {trueFalseQuestions.map((q) => {
              const userVal = answers[q.id];
              const isAnswered = userVal !== undefined && userVal !== null;
              const isRight = userVal === q.isTrue;

              let cardStyle = 'border-slate-200 bg-white';
              if (isSubmitted) {
                cardStyle = isRight
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : 'border-rose-300 bg-rose-50/40';
              }

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${cardStyle}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {q.id}
                      </span>
                      <div>
                        <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {q.statement}
                        </h2>
                        {isSubmitted && (
                          <p className="text-[11px] text-slate-600 mt-1 font-medium">
                            {isRight ? '✓ Дұрыс: ' : '✕ Қате: '}
                            {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Yes / No buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleChoose(q.id, true)}
                        disabled={isSubmitted}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          userVal === true
                            ? isSubmitted
                              ? q.isTrue
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                              : 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Иә (Ақиқат)
                      </button>
                      <button
                        onClick={() => handleChoose(q.id, false)}
                        disabled={isSubmitted}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          userVal === false
                            ? isSubmitted
                              ? !q.isTrue
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                              : 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Жоқ (Жалған)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action footer for built-in */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Қайта бастау</span>
              </button>
              {!isSubmitted && (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount < 10}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Тексеру ({answeredCount} / 10)</span>
                </button>
              )}
            </div>

            {isSubmitted && (
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span>Нәтиже: {correctCount} / 10 дұрыс</span>
                <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">
                  Балл: {scores.task3} / 10
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Global Next Task Navigation */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setActiveTab('gradebook')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
        >
          <span>Бағалау парағына өту</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
