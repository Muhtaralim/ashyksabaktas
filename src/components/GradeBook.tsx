import React from 'react';
import { useLesson } from '../context/LessonContext';
import { lessonGroups } from '../data/lessonData';
import { Award, Printer, RotateCcw, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { comicScoreMaxima } from '../types/classroom';

export const GradeBook: React.FC = () => {
  const {
    studentName,
    selectedGroup,
    scores,
    totalScore,
    maxTotalScore,
    percentageScore,
    gradeString,
    resetAllProgress,
    setActiveTab
  } = useLesson();

  const groupInfo = lessonGroups.find(g => g.id === selectedGroup) || lessonGroups[0];

  const handlePrint = () => {
    window.print();
  };

  const tasksData = [
    {
      id: 'comicAccess',
      name: '1-тапсырма: Access блиці',
      score: scores.comicAccess,
      max: comicScoreMaxima.comicAccess,
      descriptor: 'Access дерекқорының негізгі нысандары мен қызметін анықтайды.'
    },
    {
      id: 'comicPixel',
      name: '2-тапсырма: Пиксель құпиясы',
      score: scores.comicPixel,
      max: comicScoreMaxima.comicPixel,
      descriptor: 'Масштабта растрлық кескіннің қасиеттерін бақылап, қорытынды жасайды.'
    },
    {
      id: 'comicVector',
      name: '3-тапсырма: Растр және вектор',
      score: scores.comicVector,
      max: comicScoreMaxima.comicVector,
      descriptor: 'Растрлық және векторлық кескіндерді салыстырып, форматты негіздейді.'
    },
    {
      id: 'comicFormats',
      name: '4-тапсырма: Файл пішімін таңдау',
      score: scores.comicFormats,
      max: comicScoreMaxima.comicFormats,
      descriptor: 'Бес жағдаятқа сәйкес графикалық файл пішімін таңдайды.'
    },
    {
      id: 'comicProject',
      name: '5-тапсырма: Жеке жоба',
      score: scores.comicProject,
      max: comicScoreMaxima.comicProject,
      descriptor: 'Он жағдаят бойынша JPEG, SVG, PNG және GIF пішімдерін таңдайды.'
    },
    {
      id: 'comicQuiz',
      name: '6-тапсырма: Қорытынды тест',
      score: scores.comicQuiz,
      max: comicScoreMaxima.comicQuiz,
      descriptor: 'Графика, түс модельдері және файл пішімдері бойынша білімін көрсетеді.'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* Grade certificate card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full mb-3 border border-amber-400/30">
              <Award className="w-4 h-4" />
              <span>Критериалды бағалау парағы</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {studentName} — Сабақ нәтижесі
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Топ: <strong className="text-white">{groupInfo.name}</strong>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-center min-w-[170px]">
            <span className="text-[11px] uppercase tracking-wider text-slate-300 block font-semibold">
              Жиынтық ұпай:
            </span>
            <div className="text-3xl sm:text-4xl font-black text-amber-300 my-1 tabular-nums">
              {totalScore} <span className="text-lg text-white font-normal">/ {maxTotalScore}</span>
            </div>
            <span className="text-xs font-bold text-emerald-400 block">
              Баға: {gradeString}
            </span>
          </div>
        </div>

        {/* Quick Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
            <span>Жалпы орындалу көрсеткіші</span>
            <span className="text-amber-300 font-bold tabular-nums">{percentageScore}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-400 transition-all duration-500"
              style={{ width: `${percentageScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Detailed rubric table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Тапсырмалар дескрипторлары мен жиналған ұпайлар тізбесі
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Басып шығару (PDF)</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">№ Тапсырма</th>
                <th className="py-3 px-4">Дескриптор мен талаптар</th>
                <th className="py-3 px-4 text-center">Макс. балл</th>
                <th className="py-3 px-4 text-right">Жиналғаны</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasksData.map((t, index) => {
                const isCompleted = t.score > 0;
                return (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span>{t.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-md">
                      {t.descriptor}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-500 tabular-nums">
                      {t.max} балл
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                      <span className={`px-2 py-0.5 rounded ${isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                        {t.score} балл
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-200 font-extrabold text-slate-900 text-sm">
                <td colSpan={2} className="py-3.5 px-4 text-right">
                  ЖИЫНТЫҚ ҚОРЫТЫНДЫ:
                </td>
                <td className="py-3.5 px-4 text-center tabular-nums">{maxTotalScore} балл</td>
                <td className="py-3.5 px-4 text-right text-blue-600 tabular-nums text-base">
                  {totalScore} балл
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Teacher feedback and reset area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm text-xs">
        <div className="text-slate-500">
          Критериалды бағалау шкаласы: <strong>90-100</strong> — «5», <strong>75-89</strong> — «4», <strong>50-74</strong> — «3».
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetAllProgress}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold border border-rose-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Барлық прогресті тазарту</span>
          </button>
        </div>
      </div>
    </div>
  );
};
