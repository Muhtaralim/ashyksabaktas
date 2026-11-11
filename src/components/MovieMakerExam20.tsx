import React, { useState } from 'react';
import { useLesson } from '../context/LessonContext';
import { movieMakerExam20 } from '../data/lessonData';
import { BarChart3, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Award } from 'lucide-react';

export const MovieMakerExam20: React.FC = () => {
  const { setTaskScore, setActiveTab, scores } = useLesson();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [qId: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = movieMakerExam20[currentIndex];

  const handleSelect = (qId: number, optIdx: number) => {
    if (isCompleted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleFinish = () => {
    let correct = 0;
    movieMakerExam20.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / movieMakerExam20.length) * 10);
    setTaskScore('task7', finalScore);
    setIsCompleted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setIsCompleted(false);
    setCurrentIndex(0);
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = movieMakerExam20.filter(q => answers[q.id] === q.correctAnswer).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
              <BarChart3 className="w-3.5 h-3.5" /> 7-тапсырма · Сабақты бекіту емтиханы
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Windows Movie Maker бойынша 20 сұрақтық қорытынды тест
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Бейнемонтаж бағдарламасының құралдары мен ұғымдары бойынша толық қорытынды бақылау тесті.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right">
            <span className="text-xs text-slate-500 font-medium block">Дискриптор балы:</span>
            <span className="text-lg font-black text-blue-600 tabular-nums">
              {scores.task7} / 10 балл
            </span>
          </div>
        </div>

        {/* 20 Questions Quick Switch Grid */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Сұрақтар: {answeredCount} / 20 жауап берілді</span>
            <span className="font-bold text-slate-700">№{currentIndex + 1} сұрақ</span>
          </div>
          <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
            {movieMakerExam20.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentIndex === idx;
              const isRight = answers[q.id] === q.correctAnswer;

              let btnClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
              if (isCompleted) {
                btnClass = isRight ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white';
              } else if (isAnswered) {
                btnClass = 'bg-blue-600 text-white font-bold';
              }

              if (isCurrent) {
                btnClass += ' ring-2 ring-blue-400 font-extrabold';
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
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
          <span>Сұрақ {currentIndex + 1} / 20</span>
          {isCompleted && (
            <span className={answers[currentQ.id] === currentQ.correctAnswer ? 'text-emerald-600' : 'text-rose-600'}>
              {answers[currentQ.id] === currentQ.correctAnswer ? '✓ Дұрыс жауап' : '✕ Қате жауап'}
            </span>
          )}
        </div>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-6 leading-snug">
          {currentQ.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            const isSelected = answers[currentQ.id] === optIdx;
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
              optStyle = 'border-blue-600 bg-blue-50/80 text-blue-950 font-semibold ring-2 ring-blue-500/30';
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelect(currentQ.id, optIdx)}
                disabled={isCompleted}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center gap-3.5 cursor-pointer ${optStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white'
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
            <strong className="text-blue-600 block mb-1">Түсініктеме:</strong>
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

          {currentIndex < movieMakerExam20.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(movieMakerExam20.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
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

      {/* Completion Summary */}
      {isCompleted && (
        <div className="bg-gradient-to-br from-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 bg-white/10 px-3 py-1 rounded-full mb-3">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>7-тапсырманың нәтижесі сақталды</span>
              </div>
              <h2 className="text-2xl font-black mb-1">
                Нәтиже: {correctCount} / 20 сұрақ дұрыс ({Math.round((correctCount / 20) * 100)}%)
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">
                Дескриптор балы: <span className="font-bold text-amber-300 text-base">{scores.task7} / 10 балл</span>
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
                onClick={() => setActiveTab('task8')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-lg cursor-pointer"
              >
                <span>8-тапсырма: ЖИ көмегімен жоба әзірлеуге өту</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
