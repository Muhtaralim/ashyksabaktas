import React, { useCallback, useEffect, useState } from 'react';
import { FullscreenToggle } from './FullscreenToggle';
import { BookOpen, LogOut, RefreshCw, Trash2, Users } from 'lucide-react';
import type { ClassroomStudent } from '../types/classroom';
import { comicScoreMaxima } from '../types/classroom';

interface TeacherDashboardProps {
  token: string;
  onLogout: () => void;
  onOpenProject: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ token, onLogout, onOpenProject }) => {
  const [students, setStudents] = useState<ClassroomStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const loadStudents = useCallback(async () => {
    try {
      const response = await fetch('/api/teacher/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Ұпайларды жүктеу мүмкін болмады.');
      setStudents((result.students as ClassroomStudent[]).sort((a, b) => a.name.localeCompare(b.name, 'kk')));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Серверге қосылу мүмкін болмады.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadStudents();
    const interval = window.setInterval(() => void loadStudents(), 5000);
    return () => window.clearInterval(interval);
  }, [loadStudents]);

  const deleteStudent = async (student: ClassroomStudent) => {
    if (!window.confirm(`${student.name} оқушысын және оның ұпайларын өшіресіз бе?`)) return;

    setDeletingStudentId(student.id);
    try {
      const response = await fetch(`/api/teacher/students/${encodeURIComponent(student.id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Оқушыны өшіру мүмкін болмады.');
      setStudents(currentStudents => currentStudents.filter(current => current.id !== student.id));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Серверге қосылу мүмкін болмады.');
    } finally {
      setDeletingStudentId(null);
    }
  };

  const totalPoints = students.reduce((sum, student) => sum + student.scores.comicAccess + student.scores.comicPixel + student.scores.comicVector + student.scores.comicFormats + student.scores.comicProject + student.scores.comicQuiz, 0);

  return (
    <main className="min-h-[100svh] bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-800"><Users className="h-5 w-5" /></span>
            <div>
              <h1 className="text-base font-extrabold sm:text-lg">Оқушы нәтижелері</h1>
              <p className="text-xs text-slate-500">Компьютерлік графика · 100 балл</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FullscreenToggle />
            <button type="button" onClick={onOpenProject} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-700 px-3 text-xs font-semibold text-white hover:bg-emerald-800" title="Оқу жобасын ашу">
              <BookOpen className="h-4 w-4" /><span>Оқу жобасы</span>
            </button>
            <button type="button" onClick={() => void loadStudents()} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50" title="Қазір жаңарту">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">Жаңарту</span>
            </button>
            <button type="button" onClick={onLogout} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-800">
              <LogOut className="h-4 w-4" /><span className="hidden sm:inline">Шығу</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        <section className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">Тіркелген студент</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums">{students.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">Жалпы жиналған ұпай</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums">{totalPoints}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">Синхрондау</p>
            <p className="mt-1 text-sm font-bold text-emerald-700">Әр 5 секунд сайын</p>
          </div>
        </section>

        {errorMessage && <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{errorMessage}</p>}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-extrabold">Сынып тізімі</h2>
            <span className="text-xs text-slate-500">Комикс тапсырмалары: 100 балл</span>
          </div>
          {students.length === 0 && !isLoading ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">Әзірге студент тіркелмеген.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {students.map(student => {
                const total = student.scores.comicAccess + student.scores.comicPixel + student.scores.comicVector + student.scores.comicFormats + student.scores.comicProject + student.scores.comicQuiz;
                return (
                  <article key={student.id} className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1.2fr)_repeat(6,minmax(3.5rem,0.5fr))_minmax(4rem,0.6fr)_2.5rem] sm:items-center sm:px-5">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold">{student.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">Соңғы әрекет: {new Date(student.updatedAt).toLocaleString('kk-KZ')}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center sm:contents">
                      <span className="rounded-md bg-slate-50 px-2 py-2 text-xs text-slate-600 sm:bg-transparent">Access <b className="block text-sm text-slate-900">{student.scores.comicAccess}/{comicScoreMaxima.comicAccess}</b></span>
                      <span className="rounded-md bg-slate-50 px-2 py-2 text-xs text-slate-600 sm:bg-transparent">Пиксель <b className="block text-sm text-slate-900">{student.scores.comicPixel}/{comicScoreMaxima.comicPixel}</b></span>
                      <span className="rounded-md bg-slate-50 px-2 py-2 text-xs text-slate-600 sm:bg-transparent">Вектор <b className="block text-sm text-slate-900">{student.scores.comicVector}/{comicScoreMaxima.comicVector}</b></span>
                      <span className="rounded-md bg-slate-50 px-2 py-2 text-xs text-slate-600 sm:bg-transparent">Пішім <b className="block text-sm text-slate-900">{student.scores.comicFormats}/{comicScoreMaxima.comicFormats}</b></span>
                      <span className="rounded-md bg-slate-50 px-2 py-2 text-xs text-slate-600 sm:bg-transparent">Жоба <b className="block text-sm text-slate-900">{student.scores.comicProject}/{comicScoreMaxima.comicProject}</b></span>
                      <span className="rounded-md bg-slate-50 px-2 py-2 text-xs text-slate-600 sm:bg-transparent">Тест <b className="block text-sm text-slate-900">{student.scores.comicQuiz}/{comicScoreMaxima.comicQuiz}</b></span>
                      <span className="rounded-md bg-blue-50 px-2 py-2 text-xs font-semibold text-blue-800 sm:bg-transparent">Барлығы <b className="block text-base">{total}/100</b></span>
                      <button
                        type="button"
                        onClick={() => void deleteStudent(student)}
                        disabled={deletingStudentId === student.id}
                        className="inline-flex min-h-9 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                        title={`${student.name} оқушысын өшіру`}
                        aria-label={`${student.name} оқушысын өшіру`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};