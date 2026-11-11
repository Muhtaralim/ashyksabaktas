import React, { useState } from 'react';
import { useLesson } from '../context/LessonContext';
import { Film, Type, Image as ImageIcon, Volume2, Video, Sparkles, CheckCircle2, BookOpen, Edit3, ArrowRight } from 'lucide-react';

export const LectureMultimedia: React.FC = () => {
  const { setTaskScore, setActiveTab, scores } = useLesson();

  const [studentNotes, setStudentNotes] = useState<string>(() => {
    return localStorage.getItem('lesson_student_notes') || '';
  });

  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    item1: false,
    item2: false,
    item3: false,
    item4: false,
  });

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const toggleCheck = (k: string) => {
    setChecklist(prev => ({ ...prev, [k]: !prev[k] }));
  };

  const handleSaveNotes = () => {
    localStorage.setItem('lesson_student_notes', studentNotes);
    
    // Check points based on notes content + checklist
    const checkCount = Object.values(checklist).filter(Boolean).length;
    let earned = checkCount * 3; // up to 12
    if (studentNotes.trim().length > 30) earned += 8;
    else if (studentNotes.trim().length > 10) earned += 4;

    const finalScore = Math.min(20, earned);
    setTaskScore('lectureNotes', finalScore);
    setIsSaved(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
          <Film className="w-3.5 h-3.5" />
          <span>Сабақтың ортасы (60 мин) · Жаңа сабақты меңгеру</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black mb-2">
          Мультимедиалық ақпарат және Windows Movie Maker бағдарламасы
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Мультимедиа технологиялары адамның ақпаратты бірнеше сезім мүшесі арқылы қабылдауына мүмкіндік береді. Windows Movie Maker — осы деректерді біріктіріп, фильмге айналдыратын құрал.
        </p>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-300">Критерий: Дәптерге конспект жазу және негізгі ұғымдарды бекіту</span>
          <span className="font-bold text-amber-300 tabular-nums">Балл: {scores.lectureNotes} / 20 балл</span>
        </div>
      </div>

      {/* 5 Components of Multimedia */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Мультимедианың 5 негізгі құрамдас бөлігі
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          «Мультимедиа» сөзі латынның <em>multum</em> (көп) және <em>medium</em> (орта, тәсіл) сөздерінен құралған:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-2 shadow-sm">
              <Type className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">1. Мәтін (Text)</h3>
            <p className="text-[11px] text-slate-600 leading-snug">
              Тақырыптар, субтитрлер, авторлық титрлер мен түсіндірмелер.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">2. Графика</h3>
            <p className="text-[11px] text-slate-600 leading-snug">
              Фотосуреттер, диаграммалар, слайдтар (.jpg, .png, .bmp).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center mb-2 shadow-sm">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">3. Аудио (Дыбыс)</h3>
            <p className="text-[11px] text-slate-600 leading-snug">
              Дикторлық дауыс, фондық музыка, дыбыстық эффектілер (.mp3, .wav).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center mb-2 shadow-sm">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">4. Бейне (Видео)</h3>
            <p className="text-[11px] text-slate-600 leading-snug">
              Динамикалық бейнежазбалар, сұхбаттар, сюжеттер (.mp4, .wmv, .avi).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/40 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center mb-2 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">5. Анимация</h3>
            <p className="text-[11px] text-slate-600 leading-snug">
              Қозғалыстағы графиктер, мультипликация, 3D анимация (.gif).
            </p>
          </div>
        </div>
      </div>

      {/* Windows Movie Maker Interface Tour */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Film className="w-5 h-5 text-blue-600" />
            Windows Movie Maker бағдарламасының интерфейсі мен жұмыс аймағы
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Бағдарлама терезесі 4 басты аймақтан тұрады:
          </p>
        </div>

        {/* Visual schematic of Movie Maker */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 text-white p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-bold text-slate-200">Windows Movie Maker - [Жоба1.mswmm]</span>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 py-3">
            {/* Left tasks panel */}
            <div className="md:col-span-3 bg-slate-800/80 rounded-lg p-3 text-[11px] space-y-2 border border-slate-700">
              <span className="text-blue-400 font-bold block uppercase tracking-wider text-[10px]">
                1. Операции (Тапсырмалар)
              </span>
              <div className="text-slate-300 space-y-1">
                <div>• Запись видео (Импорт)</div>
                <div>• Монтаж фильма (Эффектілер)</div>
                <div>• Видеопереходы (Ауысулар)</div>
                <div>• Титры и названия</div>
                <div>• Завершение фильма</div>
              </div>
            </div>

            {/* Center collections */}
            <div className="md:col-span-5 bg-slate-800/80 rounded-lg p-3 text-[11px] border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-emerald-400 font-bold block uppercase tracking-wider text-[10px] mb-2">
                  2. Сборники (Жинақтар)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-300">
                  <div className="p-2 bg-slate-700/60 rounded border border-slate-600">Клип 1</div>
                  <div className="p-2 bg-slate-700/60 rounded border border-slate-600">Сурет 2</div>
                  <div className="p-2 bg-slate-700/60 rounded border border-slate-600">Әуен 3</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                Файлдарды шкалаға сүйреп апарыңыз
              </div>
            </div>

            {/* Right monitor */}
            <div className="md:col-span-4 bg-slate-800/80 rounded-lg p-3 text-[11px] border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 font-bold block uppercase tracking-wider text-[10px] mb-1">
                  3. Монитор (Алдын ала қарау)
                </span>
                <div className="aspect-video bg-black rounded flex items-center justify-center text-xs text-slate-500 font-mono">
                  [ 00:01:24 / 00:03:00 ]
                </div>
              </div>
              <div className="flex justify-center gap-2 pt-2 text-xs">
                <button className="px-2 py-0.5 bg-slate-700 rounded text-slate-200">◀◀</button>
                <button className="px-3 py-0.5 bg-blue-600 rounded text-white font-bold">▶ Ойнату</button>
                <button className="px-2 py-0.5 bg-slate-700 rounded text-slate-200">▶▶</button>
                <button className="px-2 py-0.5 bg-slate-700 rounded text-slate-200" title="Суретке түсіру">📷</button>
              </div>
            </div>
          </div>

          {/* Bottom timeline */}
          <div className="bg-slate-800/90 rounded-lg p-3 text-[11px] border border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-bold text-purple-400 uppercase tracking-wider">
                4. Шкала времени / Раскадровка (Уақыт шкаласы)
              </span>
              <span>Режим: Шкала времени</span>
            </div>
            <div className="space-y-1 text-[10px] text-slate-300 font-mono pt-1">
              <div className="flex items-center gap-2">
                <span className="w-16 text-slate-400">Видео:</span>
                <div className="flex-1 bg-blue-950/80 border border-blue-600 rounded p-1">Кадр 1 [00:00 - 00:05] | Ауысу | Кадр 2 [00:05 - 00:12]</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 text-slate-400">Дыбыс:</span>
                <div className="flex-1 bg-emerald-950/80 border border-emerald-600 rounded p-1">Фондық музыка (.mp3) ~ баяу өшу</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 text-slate-400">Титрлер:</span>
                <div className="flex-1 bg-amber-950/80 border border-amber-600 rounded p-1">«Менің мамандығым — Бағдарламашы»</div>
              </div>
            </div>
          </div>
        </div>

        {/* Essential Operations Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 mb-1 text-xs">1. Бөлу (Разделить / Split)</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Монитор терезесіндегі бөлгіш түймесі арқылы үлкен бейнені қажетті уақытында 2 дербес клипке кеседі.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 mb-1 text-xs">2. Бейне ауысулар (Transitions)</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Кадрлар арасындағы өткірлікті жойып, жатық ауысу (еріту, оңға сырғу, диагональ, шахмат) береді.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 mb-1 text-xs">3. Фильмді сақтау (Экспорт)</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              .mswmm жоба файлын соңында кез келген телефон мен компьютер ойната алатын дайын бейне файлға экспорттайды.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Notebook & Notes Submission (20 points) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-indigo-600" />
            Интерактивті дәптер конспектісі (20 балл)
          </h2>
          <span className="text-xs text-slate-500">
            Критерий бойынша толық конспект түсіріп, сақтаңыз
          </span>
        </div>

        {/* Verification Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-slate-50/60 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.item1}
              onChange={() => toggleCheck('item1')}
              className="rounded text-blue-600"
            />
            <span>Мультимедианың 5 құрамдас бөлігін жаздым (Мәтін, Сурет, Дыбыс, Видео, Анимация)</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-slate-50/60 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.item2}
              onChange={() => toggleCheck('item2')}
              className="rounded text-blue-600"
            />
            <span>Movie Maker-дегі 4 негізгі терезе аймағын белгіледім (Тапсырма, Жинақ, Монитор, Шкала)</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-slate-50/60 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.item3}
              onChange={() => toggleCheck('item3')}
              className="rounded text-blue-600"
            />
            <span>«Разделить (Split)» және ауысулардың (Transitions) маңызын дәптерге түсірдім</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-slate-50/60 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.item4}
              onChange={() => toggleCheck('item4')}
              className="rounded text-blue-600"
            />
            <span>Жобаның (.mswmm) мен дайын бейненің (.wmv/.mp4) айырмашылығын жаздым</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Студенттің жеке конспектісі немесе түйінді сұрақтар бойынша жазбалары:
          </label>
          <textarea
            rows={4}
            value={studentNotes}
            onChange={(e) => setStudentNotes(e.target.value)}
            placeholder="Осы жерге жаңа тақырып бойынша негізгі түйіндемелер мен терминдерді жазыңыз..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/40"
          />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveNotes}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Конспектіні сақтау және бағалау</span>
            </button>
            {isSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                ✓ Тіркелді: {scores.lectureNotes} / 20 балл
              </span>
            )}
          </div>

          <button
            onClick={() => setActiveTab('task4')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors ml-auto"
          >
            <span>4-тапсырмаға өту: Movie Maker викторинасы</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
