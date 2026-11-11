import React, { useState, useEffect, useRef } from 'react';
import { useLesson } from '../context/LessonContext';
import { lessonGroups } from '../data/lessonData';
import {
  Video,
  Play,
  Pause,
  Plus,
  Trash2,
  Music,
  Type,
  Sparkles,
  Download,
  CheckCircle2,
  Layers,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  duration: number; // in seconds
  bgGradient: string;
  effect: 'none' | 'sepia' | 'grayscale' | 'blur' | 'vibrant';
  transition: 'cut' | 'fade' | 'slide' | 'zoom';
  imageUrl?: string;
}

export const MovieMakerProjectStudio: React.FC = () => {
  const { selectedGroup, setSelectedGroup, setTaskScore, setActiveTab, scores } = useLesson();

  const currentGroupInfo = lessonGroups.find(g => g.id === selectedGroup) || lessonGroups[0];

  // Default project slides for current group
  const getInitialSlides = (groupId: number): SlideItem[] => {
    if (groupId === 1) {
      return [
        {
          id: 's1',
          title: 'МЕНІҢ МАМАНДЫҒЫМ — БАҒДАРЛАМАШЫ',
          subtitle: 'Цифрлық дәуірдің сұранысқа ие заманауи мамандығы',
          duration: 4,
          bgGradient: 'from-blue-900 to-indigo-950',
          effect: 'none',
          transition: 'fade'
        },
        {
          id: 's2',
          title: 'Компьютерлік графика және дизайн',
          subtitle: 'UI/UX дизайн, веб-қосымшалар және мультимедиа жасау',
          duration: 4,
          bgGradient: 'from-indigo-900 to-purple-950',
          effect: 'vibrant',
          transition: 'slide'
        },
        {
          id: 's3',
          title: 'Бағдарламалау тілдері мен құралдар',
          subtitle: 'Python, TypeScript, React және жасанды интеллект модельдері',
          duration: 4,
          bgGradient: 'from-slate-900 to-blue-950',
          effect: 'none',
          transition: 'zoom'
        },
        {
          id: 's4',
          title: 'Болашаққа көзқарас',
          subtitle: 'Қоғамды цифрландыру және жаңа инновациялық өнімдер ұсыну',
          duration: 4,
          bgGradient: 'from-blue-950 to-teal-950',
          effect: 'none',
          transition: 'fade'
        }
      ];
    } else if (groupId === 2) {
      return [
        {
          id: 's1',
          title: 'МЕН ОҚИТЫН БІЛІМ ОШАҒЫ',
          subtitle: 'Сапалы білім, заманауи зертханалар мен өршіл жастар ордасы',
          duration: 4,
          bgGradient: 'from-teal-900 to-emerald-950',
          effect: 'none',
          transition: 'fade'
        },
        {
          id: 's2',
          title: 'Білікті ұстаздар қауымы',
          subtitle: 'Тәжірибе мен инновацияны ұштастырған жетекші мамандар',
          duration: 4,
          bgGradient: 'from-emerald-900 to-slate-950',
          effect: 'vibrant',
          transition: 'slide'
        },
        {
          id: 's3',
          title: 'Цифрлық IT шеберханалар',
          subtitle: 'Соңғы үлгідегі компьютерлер мен шығармашылық студиялар',
          duration: 4,
          bgGradient: 'from-cyan-950 to-blue-950',
          effect: 'none',
          transition: 'zoom'
        },
        {
          id: 's4',
          title: 'Біздің мақтанышымыз — жетістіктер',
          subtitle: 'Халықаралық олимпиадалар мен кәсіби чемпионат жүлдегерлері',
          duration: 4,
          bgGradient: 'from-teal-950 to-indigo-950',
          effect: 'none',
          transition: 'fade'
        }
      ];
    } else {
      return [
        {
          id: 's1',
          title: 'МЕНІҢ КӘСІБИ МАҚСАТЫМ',
          subtitle: 'Үлкен армандардан — нақты кәсіби жетістіктерге дейін',
          duration: 4,
          bgGradient: 'from-amber-900 to-rose-950',
          effect: 'none',
          transition: 'fade'
        },
        {
          id: 's2',
          title: 'Кәсіби құзыреттіліктерді дамыту',
          subtitle: 'Мультимедиа, мобильді қосымшалар және жүйелік сәулет',
          duration: 4,
          bgGradient: 'from-rose-900 to-purple-950',
          effect: 'vibrant',
          transition: 'slide'
        },
        {
          id: 's3',
          title: 'IT Стартап жобалар құру',
          subtitle: 'Еліміздің экономикасын өркендететін пайдалы шешімдер',
          duration: 4,
          bgGradient: 'from-purple-950 to-slate-950',
          effect: 'none',
          transition: 'zoom'
        },
        {
          id: 's4',
          title: 'Ұдайы ізденіс пен өсу',
          subtitle: 'Өз саласының ең үздік сарапшысы атану жолында',
          duration: 4,
          bgGradient: 'from-amber-950 to-orange-950',
          effect: 'none',
          transition: 'fade'
        }
      ];
    }
  };

  const [slides, setSlides] = useState<SlideItem[]>(() => getInitialSlides(selectedGroup));
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0); // in seconds
  const [bgMusic, setBgMusic] = useState<string>('inspiring'); // 'inspiring' | 'electronic' | 'calm'
  const [audioVolume, setAudioVolume] = useState<number>(80);
  const [isExported, setIsExported] = useState<boolean>(false);

  // When group switches, load group's template
  useEffect(() => {
    setSlides(getInitialSlides(selectedGroup));
    setActiveSlideIndex(0);
    setPlaybackTime(0);
    setIsPlaying(false);
  }, [selectedGroup]);

  const totalDuration = slides.reduce((acc, s) => acc + s.duration, 0);

  // Playback timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime(prev => {
          const next = prev + 0.2;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          // Determine which slide we are on
          let accumulated = 0;
          for (let i = 0; i < slides.length; i++) {
            accumulated += slides[i].duration;
            if (next <= accumulated) {
              setActiveSlideIndex(i);
              break;
            }
          }
          return next;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration, slides]);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleUpdateCurrentSlide = (field: keyof SlideItem, value: any) => {
    setSlides(prev => {
      const copy = [...prev];
      copy[activeSlideIndex] = {
        ...copy[activeSlideIndex],
        [field]: value
      };
      return copy;
    });
  };

  const handleAddSlide = () => {
    const newSlide: SlideItem = {
      id: 's_' + Date.now(),
      title: 'ЖАҢА КАДР / БӨЛІМ',
      subtitle: 'Мәтінді осы жерге енгізіңіз...',
      duration: 3,
      bgGradient: 'from-blue-900 to-indigo-900',
      effect: 'none',
      transition: 'fade'
    };
    setSlides(prev => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, i) => i !== idx));
    setActiveSlideIndex(Math.max(0, idx - 1));
  };

  const handleExportProject = () => {
    setTaskScore('task6', 20); // 20 балл толық есептеледі
    setIsExported(true);
  };

  const currentSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6 px-4">
      {/* Studio Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md mb-2">
              <Video className="w-3.5 h-3.5" /> 6-тапсырма · Топтық жобалық жұмыс (Movie Maker студиясы)
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Windows Movie Maker виртуалды бейнемонтаж студиясы
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              3 топ өз тақырыбы бойынша кадрларды жинақтап, мәтін, ауысу және музыка қосып толық жоба жасайды.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right">
            <span className="text-xs text-slate-500 font-medium block">Дескриптор балы:</span>
            <span className="text-lg font-black text-rose-600 tabular-nums">
              {scores.task6} / 20 балл
            </span>
          </div>
        </div>

        {/* 3 Group selector tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {lessonGroups.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedGroup === g.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{g.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Monitor / Video Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-lg border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Алдын ала қарау мониторы [Шолу]</span>
              </span>
              <span>
                {Math.floor(playbackTime)}с / {totalDuration}с (Кадр {activeSlideIndex + 1}/{slides.length})
              </span>
            </div>

            {/* Simulated Video Canvas */}
            <div
              className={`aspect-video w-full rounded-xl bg-gradient-to-br ${currentSlide.bgGradient} p-6 sm:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 ${
                currentSlide.effect === 'sepia'
                  ? 'sepia'
                  : currentSlide.effect === 'grayscale'
                  ? 'grayscale'
                  : currentSlide.effect === 'blur'
                  ? 'blur-[1px]'
                  : currentSlide.effect === 'vibrant'
                  ? 'contrast-125 saturate-150'
                  : ''
              }`}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10 max-w-lg space-y-3">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-black text-blue-300 drop-shadow-md">
                  {currentGroupInfo.badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow-lg uppercase">
                  {currentSlide.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 font-medium drop-shadow-md">
                  {currentSlide.subtitle}
                </p>
              </div>

              {/* Transition watermark indicator */}
              <div className="absolute bottom-3 right-3 text-[10px] text-white/60 font-mono bg-black/40 px-2 py-0.5 rounded">
                Ауысу: {currentSlide.transition}
              </div>
            </div>

            {/* Playback Controls Bar */}
            <div className="mt-4 flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> <span>Үзіліс</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> <span>Ойнату</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setPlaybackTime(0);
                    setActiveSlideIndex(0);
                    setIsPlaying(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Басына
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Music className="w-3.5 h-3.5 text-emerald-400" />
                <select
                  value={bgMusic}
                  onChange={(e) => setBgMusic(e.target.value)}
                  className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-1.5 text-xs focus:outline-none"
                >
                  <option value="inspiring">Шабыттандырушы әуен (Inspiring IT)</option>
                  <option value="electronic">Динамикалық электронды ритм</option>
                  <option value="calm">Лирикалық сабырлы классика</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline / Storyboard representation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Раскадровка / Уақыт шкаласы ({slides.length} кадр):
              </h2>
              <button
                onClick={handleAddSlide}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Жаңа кадр қосу</span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {slides.map((s, idx) => {
                const isActive = activeSlideIndex === idx;
                return (
                  <div key={s.id} className="flex items-center shrink-0">
                    <div
                      onClick={() => {
                        setActiveSlideIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`w-32 rounded-xl border p-2 cursor-pointer transition-all ${
                        isActive
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center justify-between">
                        <span>Кадр {idx + 1}</span>
                        <span>{s.duration}с</span>
                      </div>
                      <div className={`h-12 rounded-lg bg-gradient-to-r ${s.bgGradient} p-1 text-white text-[9px] font-bold flex items-center justify-center text-center truncate`}>
                        {s.title}
                      </div>
                    </div>

                    {/* Transition badge between slides */}
                    {idx < slides.length - 1 && (
                      <div className="px-1 text-[10px] text-slate-400 font-bold">
                        ▶
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Editor Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-600" />
                №{activeSlideIndex + 1} кадр параметрлерін өңдеу
              </h2>
              {slides.length > 1 && (
                <button
                  onClick={() => handleDeleteSlide(activeSlideIndex)}
                  className="text-slate-400 hover:text-rose-600 p-1 text-xs"
                  title="Кадрды өшіру"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Кадр тақырыбы (Title):
              </label>
              <input
                type="text"
                value={currentSlide.title}
                onChange={(e) => handleUpdateCurrentSlide('title', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Түсіндірме мәтін / Субтитр (Subtitle):
              </label>
              <textarea
                rows={2}
                value={currentSlide.subtitle}
                onChange={(e) => handleUpdateCurrentSlide('subtitle', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ұзақтығы (секунд):
                </label>
                <select
                  value={currentSlide.duration}
                  onChange={(e) => handleUpdateCurrentSlide('duration', Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none"
                >
                  <option value={2}>2 секунд</option>
                  <option value={3}>3 секунд</option>
                  <option value={4}>4 секунд</option>
                  <option value={5}>5 секунд</option>
                  <option value={7}>7 секунд</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ауысу (Transition):
                </label>
                <select
                  value={currentSlide.transition}
                  onChange={(e) => handleUpdateCurrentSlide('transition', e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none"
                >
                  <option value="fade">Жатық еру (Fade)</option>
                  <option value="slide">Оңға сырғу (Slide)</option>
                  <option value="zoom">Үлкею (Zoom in)</option>
                  <option value="cut">Тікелей кесу (Cut)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Видеоэффект (Filter / Effect):
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'none', label: 'Қалыпты' },
                  { id: 'sepia', label: 'Сепия (Ретро)' },
                  { id: 'grayscale', label: 'Ақ-қара' },
                  { id: 'blur', label: 'Жұмсақ фон' },
                  { id: 'vibrant', label: 'Ашық түс' },
                ].map(eff => (
                  <button
                    key={eff.id}
                    onClick={() => handleUpdateCurrentSlide('effect', eff.id)}
                    className={`p-2 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                      currentSlide.effect === eff.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {eff.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Фон градиенті (Background style):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  'from-blue-900 to-indigo-950',
                  'from-teal-900 to-emerald-950',
                  'from-amber-900 to-rose-950',
                  'from-purple-900 to-slate-950',
                ].map((grad, i) => (
                  <button
                    key={i}
                    onClick={() => handleUpdateCurrentSlide('bgGradient', grad)}
                    className={`h-8 rounded-lg bg-gradient-to-r ${grad} border transition-all ${
                      currentSlide.bgGradient === grad ? 'ring-2 ring-blue-500 scale-105' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Save / Export Project to evaluate (20 points) */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={handleExportProject}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Фильмді сақтау және 20 балл алу</span>
              </button>

              {isExported && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-bold">
                  ✓ Жоба сәтті құрастырылды! Дескриптор балы: 20 / 20 балл.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab('task7')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>7-тапсырма: Movie Maker қорытынды тесті</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
