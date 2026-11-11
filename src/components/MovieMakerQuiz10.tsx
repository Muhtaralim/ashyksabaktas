import React, { useState } from 'react';
import { useLesson } from '../context/LessonContext';
import { movieMakerQuiz10 } from '../data/lessonData';
import { FileCheck2, CheckCircle2, RotateCcw, ArrowRight, ExternalLink, Play, Sparkles, Check } from 'lucide-react';

export const MovieMakerQuiz10: React.FC = () => {
  const { setTaskScore, setActiveTab, scores } = useLesson();

  const [activeMode, setActiveMode] = useState<'learningApps' | 'builtIn'>('learningApps');
  const [answers, setAnswers] = useState<{ [qId: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [manualScoreInput, setManualScoreInput] = useState<number>(scores.task4 || 10);
  const [scoreSaved, setScoreSaved] = useState<boolean>(false);

  const learningAppsUrl = 'https://learningapps.org/';

  const handleSelect = (qId: number, optIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmit = () => {
    let correct = 0;
    movieMakerQuiz10.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / movieMakerQuiz10.length) * 10);
    setTaskScore('task4', finalScore);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setIsSubmitted(false);
  };

  const handleSaveLearningAppsScore = () => {
    const val = Math.max(0, Math.min(10, Number(manualScoreInput) || 0));
    setTaskScore('task4', val);
    setScoreSaved(true);
    setTimeout(() => setScoreSaved(false), 2500);
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = movieMakerQuiz10.filter(q => answers[q.id] === q.correctAnswer).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md mb-2">
              <FileCheck2 className="w-3.5 h-3.5" /> 4-тапсырма · LearningApps викторинасы
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Windows Movie Maker бағдарламасы бойынша 10 сұрақ-викторина
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Дұрыс жауапты таңдап, бейнемонтаж бойынша біліміңізді тексеріңіз.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right">
            <span className="text-xs text-slate-500 font-medium block">Дискриптор балы:</span>
            <span className="text-lg font-black text-teal-600 tabular-nums">
              {scores.task4} / 10 балл
            </span>
          </div>
        </div>

        {/* Link Banner with direct open button */}
        <div className="mt-4 p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-teal-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
            <span>
              <strong>LearningApps ресми сілтемесі:</strong>{' '}
              <a
                href={learningAppsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-teal-800 underline hover:text-teal-950 break-all"
              >
                {learningAppsUrl}
              </a>
            </span>
          </div>
          <a
            href={learningAppsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <span>LearningApps сілтемесін ашу</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => setActiveMode('builtIn')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'builtIn'
                ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-400/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Интерактивті 10 викторина сұрағы</span>
          </button>
          <button
            onClick={() => setActiveMode('learningApps')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'learningApps'
                ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-400/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>LearningApps тікелей веб-платформасы</span>
          </button>
        </div>
      </div>

      {/* Mode 2: LearningApps Web Viewer */}
      {activeMode === 'learningApps' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-3 bg-slate-900 text-white text-xs flex items-center justify-between">
              <span className="font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                LearningApps интерактивті ортасы
              </span>
              <a
                href={learningAppsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-300 hover:text-teal-200 flex items-center gap-1 font-bold underline"
              >
                Жаңа терезеде ашу ↗
              </a>
            </div>

            <div className="w-full aspect-[4/3] sm:aspect-[16/10] max-h-[600px] bg-slate-950">
              <iframe
                src={learningAppsUrl}
                title="LearningApps"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          </div>

          {/* Score Sync Bar */}
          <div className="bg-white rounded-2xl border border-teal-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-700">
              <span className="font-bold text-teal-800">LearningApps нәтижесін тіркеу:</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Сілтемедегі тапсырманы орындап болған соң, жинаған ұпайыңызды енгізіңіз:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="10"
                value={manualScoreInput}
                onChange={(e) => setManualScoreInput(Number(e.target.value))}
                className="w-16 px-2 py-1.5 text-center text-sm font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-xs font-bold text-slate-500">/ 10 балл</span>
              <button
                onClick={handleSaveLearningAppsScore}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                {scoreSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{scoreSaved ? 'Бекітілді!' : 'Балды сақтау'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 1: Built-in 10 Questions Grid */}
      {activeMode === 'builtIn' && (
        <>
          <div className="space-y-4">
            {movieMakerQuiz10.map((q, idx) => {
              const userChoice = answers[q.id];
              const isCorrect = userChoice === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-rose-300 bg-rose-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                    <span>№{idx + 1} сұрақ</span>
                    {isSubmitted && (
                      <span className={isCorrect ? 'text-emerald-600' : 'text-rose-600'}>
                        {isCorrect ? '✓ Дұрыс' : '✕ Қате'}
                      </span>
                    )}
                  </div>

                  <h2 className="text-sm font-bold text-slate-900 mb-3 leading-snug">
                    {q.question}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isSelected = userChoice === oIdx;
                      const isRight = q.correctAnswer === oIdx;

                      let btnStyle = 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100';

                      if (isSubmitted) {
                        if (isRight) {
                          btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-900 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'border-rose-500 bg-rose-100 text-rose-900 font-bold';
                        } else {
                          btnStyle = 'border-slate-200 bg-slate-50 opacity-60 text-slate-400';
                        }
                      } else if (isSelected) {
                        btnStyle = 'border-teal-600 bg-teal-50 text-teal-900 font-bold ring-2 ring-teal-400/30';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelect(q.id, oIdx)}
                          disabled={isSubmitted}
                          className={`text-left p-3 rounded-xl border text-xs flex items-center gap-2.5 transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-md bg-white border border-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {letter}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && q.explanation && (
                    <div className="mt-3 p-3 rounded-lg bg-slate-100/70 border border-slate-200 text-[11px] text-slate-600">
                      <strong>Түсініктеме:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
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
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Нәтижені тексеру ({answeredCount} / 10)</span>
                </button>
              )}
            </div>

            {isSubmitted && (
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span>Дұрысы: {correctCount} / 10</span>
                <span className="px-2.5 py-1 rounded-md bg-teal-100 text-teal-900">
                  Балл: {scores.task4} / 10
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Global Next Task Navigation */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setActiveTab('task5')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
        >
          <span>5-тапсырма: Форматтарды топтауға өту</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
