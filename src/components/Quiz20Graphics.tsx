import React, { useState } from 'react';
import { useLesson } from '../context/LessonContext';
import { graphics20Questions } from '../data/lessonData';
import { HelpCircle, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Award, ExternalLink, Play } from 'lucide-react';

export const Quiz20Graphics: React.FC = () => {
  const { setTaskScore, setActiveTab, scores } = useLesson();

  const waygroundUrl = "https://wayground.com/join/quiz/6913456a4f4f20e0d5898c4b/start?studentShare=true";

  // Mode: 'wayground' (live link & embed open by default) vs 'interactive' (built-in 20 questions)
  const [viewMode, setViewMode] = useState<'wayground' | 'interactive'>('wayground');
  const [waygroundScore, setWaygroundScore] = useState<number>(10);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = graphics20Questions[currentIndex];

  const handleSelectOption = (qId: number, optIndex: number) => {
    if (isCompleted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optIndex
    }));
  };

  const handleFinish = () => {
    let correctCount = 0;
    graphics20Questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / graphics20Questions.length) * 10);
    setTaskScore('task2', finalScore);
    setIsCompleted(true);
  };

  const handleSaveWaygroundScore = () => {
    setTaskScore('task2', waygroundScore);
    setIsCompleted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsCompleted(false);
    setCurrentIndex(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = graphics20Questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* Header banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
              <HelpCircle className="w-3.5 h-3.5" /> 2-тапсырма · Wayground тесті
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Растрлық және векторлық графика бойынша 20 сұрақтық тест
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Ресми сілтеме: <a href={waygroundUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold underline inline-flex items-center gap-1 truncate max-w-md">{waygroundUrl} <ExternalLink className="w-3 h-3 shrink-0" /></a>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right">
            <span className="text-xs text-slate-500 font-medium block">Дискриптор балы:</span>
            <span className="text-lg font-black text-indigo-600 tabular-nums">
              {scores.task2} / 10 балл
            </span>
          </div>
        </div>

        {/* View Switcher: Wayground Link vs Built-in */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('wayground')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'wayground'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Wayground сілтемесі арқылы ашу</span>
            </button>
            <button
              onClick={() => setViewMode('interactive')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Қосымшадағы 20 сұрақты шешу</span>
            </button>
          </div>

          <a
            href={waygroundUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
          >
            <span>Wayground тестін жаңа терезеде ашу</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* VIEW 1: WAYGROUND DIRECT EMBED & SCORE LOGGER */}
      {viewMode === 'wayground' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-slate-800">
              <span className="font-bold">Wayground платформасы:</span>
              <span className="text-slate-600">Тестті орындап, жинаған нәтижеңізді төмендегі бағалау журналына тіркеңіз.</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Жинаған балыңыз:</span>
              <select
                value={waygroundScore}
                onChange={(e) => setWaygroundScore(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg p-1 text-xs font-bold text-indigo-600"
              >
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(n => (
                  <option key={n} value={n}>{n} балл</option>
                ))}
              </select>
              <button
                onClick={handleSaveWaygroundScore}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Баллды тіркеу
              </button>
            </div>
          </div>

          <div className="w-full aspect-video sm:h-[600px] rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900 relative">
            <iframe
              src={waygroundUrl}
              title="Wayground 6913456a4f4f20e0d5898c4b"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* VIEW 2: BUILT-IN 20 QUESTIONS QUIZ */}
      {viewMode === 'interactive' && (
        <div className="space-y-6">
          {/* Question Index Progress Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
              <span>Сұрақтар қатары: {answeredCount} / 20 жауап берілді</span>
              <span className="font-bold text-slate-700">№{currentIndex + 1} сұрақ</span>
            </div>
            <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
              {graphics20Questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCurrent = currentIndex === idx;
                const isRight = selectedAnswers[q.id] === q.correctAnswer;

                let btnClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                if (isCompleted) {
                  btnClass = isRight ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white';
                } else if (isAnswered) {
                  btnClass = 'bg-indigo-600 text-white font-bold';
                }

                if (isCurrent) {
                  btnClass += ' ring-2 ring-indigo-400 ring-offset-1 font-extrabold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-7 rounded-md text-xs transition-all flex items-center justify-center cursor-pointer ${btnClass}`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main question card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
              <span>Сұрақ {currentIndex + 1} / 20</span>
              {isCompleted && (
                <span className={selectedAnswers[currentQ.id] === currentQ.correctAnswer ? 'text-emerald-600' : 'text-rose-600'}>
                  {selectedAnswers[currentQ.id] === currentQ.correctAnswer ? '✓ Дұрыс жауап' : '✕ Қате жауап'}
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-6 leading-snug">
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx);
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                const isRight = currentQ.correctAnswer === optIdx;

                let optStyle = 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-800';

                if (isCompleted) {
                  if (isRight) {
                    optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-400/30';
                  } else if (isSelected && !isRight) {
                    optStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                  } else {
                    optStyle = 'border-slate-200 bg-slate-50 opacity-60 text-slate-500';
                  }
                } else if (isSelected) {
                  optStyle = 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold ring-2 ring-indigo-500/30';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    disabled={isCompleted}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center gap-3.5 cursor-pointer ${optStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : isCompleted && isRight
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm">{option}</span>
                  </button>
                );
              })}
            </div>

            {isCompleted && currentQ.explanation && (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <strong className="text-indigo-600 block mb-1">Түсініктеме:</strong>
                {currentQ.explanation}
              </div>
            )}

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Алдыңғы</span>
              </button>

              {currentIndex < graphics20Questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(prev => Math.min(graphics20Questions.length - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  <span>Келесі сұрақ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                !isCompleted && (
                  <button
                    onClick={handleFinish}
                    disabled={answeredCount === 0}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Тестті аяқтау және бағалау</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Completion Summary */}
      {isCompleted && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 bg-white/10 px-3 py-1 rounded-full mb-3">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>2-тапсырманың нәтижесі тіркелді</span>
              </div>
              <h2 className="text-2xl font-black mb-1">
                Нәтиже: {viewMode === 'interactive' ? `${correctCount} / 20 сұрақ дұрыс` : 'Wayground бойынша балл тіркелді'}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">
                Дескриптор балы: <span className="font-bold text-amber-300 text-base">{scores.task2} / 10 балл</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Қайта тапсыру</span>
              </button>
              <button
                onClick={() => setActiveTab('task3')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-colors shadow-lg cursor-pointer"
              >
                <span>3-тапсырмаға өту (Иә/Жоқ)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
