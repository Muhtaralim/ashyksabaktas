import React, { useState } from 'react';
import { useLesson } from '../context/LessonContext';
import { Sparkles, CheckCircle2, Film, Type, Music, Copy, Check, ArrowRight } from 'lucide-react';

export const AIAssistedStudio: React.FC = () => {
  const { setTaskScore, setActiveTab, scores, studentName } = useLesson();

  const [topic, setTopic] = useState<string>('Менің мамандығым — Бағдарламалау және цифрлық дизайн');
  const [targetAudience, setTargetAudience] = useState<string>('Студенттер мен жастар');
  const [tone, setTone] = useState<string>('Шабыттандырушы, динамикалық');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedScript, setGeneratedScript] = useState<any | null>(() => {
    return {
      title: '«Болашақтың кілті — IT мамандығы»',
      theme: 'Бағдарламалау және цифрлық графика',
      scenes: [
        {
          shot: '1-кадр (Кіріспе)',
          visual: 'Заманауи компьютерлік зертхана, бағдарламашылардың жұмыс үстелі, код және графикалық экрандар.',
          voiceover: '«Біз цифрлық технологиялар ғасырында өмір сүріп жатырмыз. Әрбір идея бүгінде жолдардан тұратын код пен айқын пиксельдерден бастау алады...»',
          music: 'Жеңіл электронды эмбиент, біртіндеп көтерілетін ырғақ (Fade-in)',
          duration: '4 сек'
        },
        {
          shot: '2-кадр (Негізгі бөлім: Графика)',
          visual: 'Adobe Photoshop пен Illustrator-да векторлық және растрлық кескіндерді өңдеу сәті, 3D модельдің бұрылуы.',
          voiceover: '«Компьютерлік графика — қиялды шындыққа айналдыратын құрал. Біз растрдың дәлдігі мен вектордың шексіз сапасын үйлестіреміз.»',
          music: 'Қарқынды заманауи beat',
          duration: '5 сек'
        },
        {
          shot: '3-кадр (Топтық жұмыс)',
          visual: 'Студенттердің бірлесіп жоба талқылауы, Movie Maker-де бейнемонтаж жасауы, уақыт шкаласындағы жұмыс.',
          voiceover: '«Мультимедиа бізге мәтін мен дыбысты, бейне мен анимацияны біртұтас қуатты туындыға біріктіруге жол ашады.»',
          music: 'Шабыттандырушы оркестрлік электронды сарын',
          duration: '5 сек'
        },
        {
          shot: '4-кадр (Қорытынды титрлер)',
          visual: '«Мақсатымыз — ел игілігіне қызмет ететін жоғары сапалы отандық өнімдер жасау!» жазуы және авторлар тізімі.',
          voiceover: '«Менің мамандығым — менің болашағым!»',
          music: 'Музыканың баяу өшуі (Fade-out)',
          duration: '4 сек'
        }
      ],
      aiTips: [
        'Movie Maker-де кадрлар арасына «Размытие» немесе «Плавное угасание» ауысуын қою ұсынылады.',
        'Диктор дауысы анық естілуі үшін Уровень звука батырмасы арқылы музыка деңгейін 40%-ға төмендетіңіз.',
        'Суреттердің сапасы кемінде 1920x1080 (Full HD) растрлық пішімде болуы тиіс.'
      ]
    };
  });

  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedScript({
        title: `«${topic}»`,
        theme: topic,
        scenes: [
          {
            shot: '1-кадр (Бастапқы тақырып)',
            visual: `Тақырыпқа сай көркем интро: «${topic}» деген жазудың экранда жатық пайда болуы (Fade in).`,
            voiceover: `«Құрметті көрермен! Назарларыңызға ${topic.toLowerCase()} тақырыбындағы мультимедиалық бейнебаянымызды ұсынамыз.»`,
            music: 'Кіріспе тыныш сазды әуен',
            duration: '4 сек'
          },
          {
            shot: '2-кадр (Мәселе мен маңыздылық)',
            visual: 'Тақырыпқа қатысты динамикалық слайдтар мен нақты диаграммалық графиктер.',
            voiceover: `«${targetAudience} үшін бұл тақырыптың мәні ерекше зор. Әрбір қадам кәсіби ізденісті талап етеді.»`,
            music: 'Қарқынды заманауи трек',
            duration: '5 сек'
          },
          {
            shot: '3-кадр (Инновациялық шешімдер)',
            visual: 'Заманауи бағдарламалар мен графикалық құралдардың көмегімен жасалған нәтижелер.',
            voiceover: '«Біз жаңа технологиялар мен шығармашылық ойды ұштастырып, сапалы нәтижеге қол жеткіземіз.»',
            music: 'Ырғақты жігерлендіруші музыка',
            duration: '5 сек'
          },
          {
            shot: '4-кадр (Қорытынды титрлер)',
            visual: `Жоба авторы: ${studentName}. Топтың қатысушылары және пайдаланылған ресурстар титрі.`,
            voiceover: '«Назар қойып тыңдағандарыңызға үлкен рақмет!»',
            music: 'Музыканың баяу өшуі (Fade-out)',
            duration: '4 сек'
          }
        ],
        aiTips: [
          'Windows Movie Maker бағдарламасында жобаны сақтау кезінде «Для воспроизведения на компьютере» опциясын таңдаңыз.',
          'Титр шрифтін қарапайым әрі оқылуы жеңіл етіп орнатыңыз (Arial немесе Segoe UI).',
          'Фондық музыканың авторлық құқықтарын сақтаңыз немесе еркін лицензиялы тректерді қолданыңыз.'
        ]
      });
      setIsGenerating(false);

      // Save task score (10 points)
      setTaskScore('task8AI', 10);
    }, 600);
  };

  const handleCopy = () => {
    if (!generatedScript) return;
    const text = JSON.stringify(generatedScript, null, 2);
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
              <Sparkles className="w-3.5 h-3.5" /> 8-тапсырма · ЖИ (AI) көмегімен жоба сценарийін әзірлеу
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Жасанды интеллект негізінде мультимедиалық жоба сценарийін жасау
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Тақырыпты таңдаңыз немесе өз идеяңызды жазыңыз. ЖИ бейнероликке арналған кадрлар жоспарын (раскадровкасын) құрып береді.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right">
            <span className="text-xs text-slate-500 font-medium block">Дескриптор балы:</span>
            <span className="text-lg font-black text-indigo-600 tabular-nums">
              {scores.task8AI} / 10 балл
            </span>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Film className="w-4 h-4 text-indigo-600" />
          Жоба параметрлерін баптау
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Бейнероликтің тақырыбы:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Мысалы: Менің мамандығым немесе Білім ошағым..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Мақсатты аудитория:
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Стилі:</span>
            {['Шабыттандырушы', 'Ғылыми-танымдық', 'Динамикалық IT'].map(t => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  tone === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'ЖИ сценарийді құрастыруда...' : 'ЖИ сценарий генерациялау'}</span>
          </button>
        </div>
      </div>

      {/* Generated Script Showcase */}
      {generatedScript && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">
                ЖИ құрастырған сценарий жоспары
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {generatedScript.title}
              </h2>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Көшірілді' : 'Көшіру'}</span>
            </button>
          </div>

          {/* 4 Shots Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedScript.scenes.map((scene: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="text-indigo-600">{scene.shot}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">
                    {scene.duration}
                  </span>
                </div>

                <div>
                  <strong className="text-slate-700 block text-[11px]">Бейне қатары (Визуал):</strong>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{scene.visual}</p>
                </div>

                <div>
                  <strong className="text-slate-700 block text-[11px]">Диктор дауысы (Сөздер):</strong>
                  <p className="text-slate-800 font-medium italic mt-0.5 leading-relaxed bg-white p-2 rounded border border-slate-200/80">
                    {scene.voiceover}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                  <Music className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{scene.music}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI recommendations */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs">
            <h3 className="font-bold text-indigo-950 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Windows Movie Maker-де сапалы монтаждау бойынша ЖИ кеңестері:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {generatedScript.aiTips.map((tip: string, i: number) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 8-тапсырма орындалды! Балл тіркелді: 10 / 10 балл.
            </span>

            <button
              onClick={() => setActiveTab('gradebook')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Қорытынды бағалау парағына өту</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
