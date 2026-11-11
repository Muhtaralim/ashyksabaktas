import React, { useState } from 'react';
import { useLesson } from '../context/LessonContext';
import { lessonGroups, initialStudentsList } from '../data/lessonData';
import { Users, Shuffle, CheckCircle2, Crown, Sparkles, BookCheck, MonitorCheck, ArrowRight } from 'lucide-react';

export const TeamGenerator: React.FC = () => {
  const { groups, canManageGroups, divideIntoGroups, selectedGroup, setSelectedGroup, setActiveTab } = useLesson();
  const [studentsInput, setStudentsInput] = useState<string>(initialStudentsList.join('\n'));
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [groupSaveError, setGroupSaveError] = useState(false);
  const [attendance, setAttendance] = useState<{ [name: string]: boolean }>(() => {
    const init: { [name: string]: boolean } = {};
    initialStudentsList.forEach(name => { init[name] = true; });
    return init;
  });

  const handleShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      void divideIntoGroups(presentStudents).then(saved => {
        setHasGenerated(true);
        setGroupSaveError(!saved);
        setIsShuffling(false);
      });
    }, 400);
  };

  const toggleAttendance = (name: string) => {
    setAttendance(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const presentStudents = studentsInput
    .split('\n')
    .map(name => name.trim())
    .filter(name => name.length > 0 && attendance[name] !== false);
  const totalPresent = presentStudents.length;
  const assignedStudentCount = groups.group1.length + groups.group2.length + groups.group3.length;
  const hasAssignedGroups = assignedStudentCount > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4">
      {/* Lesson intro & readiness card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
            <BookCheck className="w-3.5 h-3.5" />
            <span>Ұйымдастыру кезеңі (5 мин) · Сабақтың басы (20 мин)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Компьютерлік графика және Windows Movie Maker мультимедиасы
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            <strong>Сабақтың мақсаты:</strong> Растрлық және векторлық графиканың қасиеттерін, пішімдерін (DPI, пиксель, формула) талдау; мультимедиалық технологиялар мен Windows Movie Maker бағдарламасында жоба құрастыруды үйрену.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-white/10">
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Амандасу және қатысым тексеру</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <MonitorCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Компьютерлер дайындығын бақылау</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <Users className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Студенттерді 3 топқа бөлу</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team divider interactive studio */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Студенттерді 3 топқа бөлу
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {canManageGroups ? 'Қатысып отырған студенттер:' : 'Бөлінген студенттер:'}{' '}
              <span className="font-semibold text-slate-800">{canManageGroups ? totalPresent : assignedStudentCount}</span> оқушы
            </p>
          </div>

          {canManageGroups && (
            <button
              onClick={handleShuffle}
              disabled={isShuffling || totalPresent === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
              <span>{isShuffling ? 'Топтарға бөлінуде...' : hasGenerated ? 'Қайта бөлу' : 'Топтарға бөлу'}</span>
            </button>
          )}
        </div>

        {(hasGenerated || hasAssignedGroups) && (
          <div role="status" aria-live="polite" className="mt-5 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-emerald-950">{hasGenerated ? `${totalPresent} студент 3 топқа бөлінді` : 'Оқытушы бекіткен топтар'}</p>
                <p className="text-xs text-emerald-800">Топ құрамы төменде көрсетілген</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              {lessonGroups.map(group => {
                const members = group.id === 1 ? groups.group1 : group.id === 2 ? groups.group2 : groups.group3;
                return <span key={group.id} className="rounded-md border border-white bg-white px-2.5 py-1.5">{group.name}: {members.length}</span>;
              })}
            </div>
          </div>
        )}
        {groupSaveError && <p role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">Топтар сақталмады. Интернет байланысын тексеріп, қайта бөліңіз.</p>}

        {/* 3 Groups Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {lessonGroups.map((g) => {
            const memberList =
              g.id === 1 ? groups.group1 : g.id === 2 ? groups.group2 : groups.group3;
            const isMyGroup = selectedGroup === g.id;

            return (
              <div
                key={g.id}
                className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                  isMyGroup
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20 bg-blue-50/20'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className={`p-4 bg-gradient-to-r ${g.color} text-white`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider font-bold opacity-90">
                        {g.badge}
                      </span>
                      {memberList.length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-bold">
                          {memberList.length} студент
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold mt-1">{g.name}</h3>
                    <p className="text-xs text-white/80 mt-1 line-clamp-2">{g.theme}</p>
                  </div>

                  {/* Member list */}
                  <div className="p-4 space-y-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Топ құрамы:
                    </div>
                    {memberList.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">
                        {hasAssignedGroups ? 'Бұл топқа студент бөлінбеді' : canManageGroups ? 'Топқа бөлуді бастаңыз' : 'Оқытушы топтарды әлі бөлмеген'}
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {memberList.map((member, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between text-xs font-medium text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60 shadow-xs"
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-[10px]">
                                {idx + 1}
                              </span>
                              <span>{member}</span>
                            </span>
                            {idx === 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md font-semibold">
                                <Crown className="w-3 h-3" /> Топ басшысы
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => setSelectedGroup(g.id)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                      isMyGroup
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isMyGroup ? '✓ Мен осы топтамын' : 'Осы топқа қосылу'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Student attendance & list editor (collapsible) */}
        {canManageGroups && <div className="mt-8 pt-6 border-t border-slate-100">
          <details className="group">
            <summary className="cursor-pointer text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center justify-between">
              <span>Студенттер тізімін тексеру немесе жаңадан қосу (Қатысымды белгілеу)</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Студенттер тізімі (әр жолға бір аты-жөні):
                </label>
                <textarea
                  rows={6}
                  value={studentsInput}
                  onChange={(e) => setStudentsInput(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Қатысымды тексеру (Сабақта жоқ болса құсбелгіні алып тастаңыз):
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-2">
                  {studentsInput
                    .split('\n')
                    .map(n => n.trim())
                    .filter(Boolean)
                    .map((name, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 text-xs text-slate-700 hover:bg-white p-1 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={attendance[name] !== false}
                          onChange={() => toggleAttendance(name)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{name}</span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          </details>
        </div>}

        {/* Call to Next Activity */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setActiveTab('task1')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
          >
            <span>1-тапсырмаға өту: Бағдарламаларды сәйкестендіру</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
