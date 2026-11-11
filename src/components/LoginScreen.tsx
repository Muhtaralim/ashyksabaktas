import React, { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap, LockKeyhole, Users } from 'lucide-react';
import type { ClassroomSession, ClassroomStudent } from '../types/classroom';

type LoginMode = 'choose' | 'student' | 'teacher';

interface LoginScreenProps {
  onLogin: (session: ClassroomSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<LoginMode>('choose');
  const [studentName, setStudentName] = useState(() => localStorage.getItem('lesson_student_name') || '');
  const [teacherCode, setTeacherCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const studentId = localStorage.getItem('lesson_student_id') || crypto.randomUUID();
      const response = await fetch('/api/student/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: studentId, name: studentName }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Кіру мүмкін болмады.');

      const student = result.student as ClassroomStudent;
      localStorage.setItem('lesson_student_id', student.id);
      localStorage.setItem('lesson_student_name', student.name);
      onLogin({ role: 'student', student, token: result.token });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Серверге қосылу мүмкін болмады.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitTeacher = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/teacher/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: teacherCode }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Кіру мүмкін болмады.');
      onLogin({ role: 'teacher', token: result.token });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Серверге қосылу мүмкін болмады.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-slate-950 px-4 py-8 text-slate-900">
      <section className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-900 px-6 py-7 text-white sm:px-9 sm:py-9">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <BookOpen className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-200">Интерактивті сабақ</p>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">Компьютерлік графика</h1>
          <p className="mt-2 text-sm text-blue-100">Оқу комиксі және тапсырмалар</p>
        </div>

        <div className="p-5 sm:p-9">
          {mode === 'choose' && (
            <div>
              <h2 className="text-lg font-bold text-slate-900">Кіру түрін таңдаңыз</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMode('student')}
                  className="group flex min-h-28 items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-800 group-hover:bg-blue-200">
                    <GraduationCap className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block font-bold text-slate-900">Студент</span>
                    <span className="mt-1 block text-sm text-slate-600">Аты-жөніңізбен кіру</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => setMode('teacher')}
                  className="group flex min-h-28 items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200">
                    <Users className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block font-bold text-slate-900">Оқытушы</span>
                    <span className="mt-1 block text-sm text-slate-600">Сынып ұпайларын көру</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {mode === 'student' && (
            <form onSubmit={submitStudent} className="space-y-5">
              <button type="button" onClick={() => setMode('choose')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4" /> Артқа
              </button>
              <div>
                <h2 className="text-lg font-bold">Студент болып кіру</h2>
                <label htmlFor="student-name" className="mt-4 block text-sm font-semibold text-slate-700">Аты-жөніңіз</label>
                <input
                  id="student-name"
                  autoComplete="name"
                  autoFocus
                  required
                  minLength={2}
                  maxLength={80}
                  value={studentName}
                  onChange={event => setStudentName(event.target.value)}
                  placeholder="Мысалы: Айдана Әли"
                  className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button disabled={isSubmitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 font-bold text-white transition hover:bg-blue-800 disabled:opacity-60">
                {isSubmitting ? 'Кіру...' : 'Сабақты бастау'} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {mode === 'teacher' && (
            <form onSubmit={submitTeacher} className="space-y-5">
              <button type="button" onClick={() => setMode('choose')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700">
                <ArrowLeft className="h-4 w-4" /> Артқа
              </button>
              <div>
                <h2 className="text-lg font-bold">Оқытушы болып кіру</h2>
                <label htmlFor="teacher-code" className="mt-4 block text-sm font-semibold text-slate-700">Оқытушы коды</label>
                <div className="relative mt-2">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="teacher-code"
                    type="password"
                    autoComplete="current-password"
                    autoFocus
                    required
                    value={teacherCode}
                    onChange={event => setTeacherCode(event.target.value)}
                    placeholder="Кіру кодын енгізіңіз"
                    className="min-h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-base text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
              <button disabled={isSubmitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60">
                {isSubmitting ? 'Тексерілуде...' : 'Ұпайлар тақтасын ашу'} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {errorMessage && <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{errorMessage}</p>}
        </div>
      </section>
    </main>
  );
};