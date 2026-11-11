import React, { useState, useRef, useEffect } from 'react';
import { useLesson } from '../context/LessonContext';
import {
  BookOpen,
  Sliders,
  Maximize2,
  Palette,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  Download,
  RotateCcw
} from 'lucide-react';

export const ComicAndLabs: React.FC = () => {
  const { setActiveTab } = useLesson();

  // Lab 1: Pixel Zoom State
  const [zoomLevel, setZoomLevel] = useState<number>(4);

  // Lab 2: RGB / CMYK Color Mixer
  const [red, setRed] = useState<number>(33);
  const [green, setGreen] = useState<number>(106);
  const [blue, setBlue] = useState<number>(194);

  // Lab 3: Raster vs Vector Zoom comparison
  const [comparisonScale, setComparisonScale] = useState<number>(400);

  // Lab 4: Photo Studio Canvas state
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [filterMode, setFilterMode] = useState<string>('normal');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw on Canvas for Photo Studio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw an artistic graphic demo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#0f2027');
    grad.addColorStop(0.5, '#203a43');
    grad.addColorStop(1, '#2c5364');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stylized mountains/geometric landscape
    ctx.fillStyle = '#0575E6';
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(150, 120);
    ctx.lineTo(300, 300);
    ctx.fill();

    ctx.fillStyle = '#00F260';
    ctx.beginPath();
    ctx.moveTo(180, 300);
    ctx.lineTo(320, 160);
    ctx.lineTo(480, 300);
    ctx.fill();

    // Sun / Moon vector circle
    ctx.fillStyle = '#FFD200';
    ctx.beginPath();
    ctx.arc(380, 90, 45, 0, Math.PI * 2);
    ctx.fill();

    // Text on canvas
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Manrope, sans-serif';
    ctx.fillText('Компьютерлік графика', 30, 50);
    ctx.font = '14px Manrope, sans-serif';
    ctx.fillText('Растрлық және Векторлық шеберхана', 30, 78);
  }, []);

  // Compute CMYK from RGB
  const rNorm = red / 255;
  const gNorm = green / 255;
  const bNorm = blue / 255;
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  const c = k === 1 ? 0 : Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = k === 1 ? 0 : Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = k === 1 ? 0 : Math.round(((1 - bNorm - k) / (1 - k)) * 100);
  const kPerc = Math.round(k * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 px-4">
      {/* Comic Hero Cover Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              КМ 1. Бағдарламалық қамтамасыздандыруды жобалау
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              ОН 1.3. Қолданбалы пакеттерді өңдеу
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Компьютерлік графика негіздері — интерактивті оқу-комикс
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Компьютерлік графиканың түрлері: растрлық, векторлық, түстер синтезі және фотоөңдеу зертханалары. Төмендегі тәжірибелік зертханаларды сынап көріп, сабақ тапсырмаларына өтіңіз!
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('teams')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              <span>Сабақ тапсырмаларын орындауға өту</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lab 1 & Lab 2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lab 1: Pixel Zoom Sandbox */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
              <Sliders className="w-3.5 h-3.5" /> 1-зертхана · Растрлық пиксель торы
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Пиксельді масштабтау зертханасы
            </h2>
            <p className="text-xs text-slate-600 mt-1 mb-4">
              Кескінді үлкейткен сайын растрдың пиксельдерден тұратын матрицалық торы анық көрінеді.
            </p>

            {/* Interactive Pixel Matrix Canvas */}
            <div className="p-4 bg-slate-900 rounded-xl flex flex-col items-center justify-center">
              <div
                className="grid gap-1 transition-all duration-200"
                style={{
                  gridTemplateColumns: `repeat(${zoomLevel * 2}, minmax(0, 1fr))`,
                  width: 'min(100%, 260px)',
                  aspectRatio: '1/1'
                }}
              >
                {Array.from({ length: zoomLevel * zoomLevel * 4 }).map((_, i) => {
                  const hue = 200 + (i % 6) * 15;
                  const lightness = 35 + ((i * 7) % 40);
                  return (
                    <div
                      key={i}
                      className="rounded-[2px] transition-all hover:scale-110"
                      style={{
                        backgroundColor: `hsl(${hue}, 85%, ${lightness}%)`,
                        border: zoomLevel >= 4 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                      }}
                      title={`Пиксель #${i + 1}`}
                    />
                  );
                })}
              </div>

              <div className="mt-3 text-[11px] font-mono text-slate-400">
                Масштаб: {zoomLevel}x | Пиксельдер саны: {zoomLevel * 2} × {zoomLevel * 2}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Масштаб деңгейі (Zoom):</span>
              <span className="font-bold text-blue-600">{zoomLevel}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Lab 2: RGB & CMYK Color Synthesis */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
              <Palette className="w-3.5 h-3.5" /> 2-зертхана · Түстер синтезі
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              RGB (Экран) және CMYK (Баспа) зертханасы
            </h2>
            <p className="text-xs text-slate-600 mt-1 mb-4">
              Қызыл, жасыл және көк сәулелерді қосып, түс синтезін және оның баспалық CMYK сәйкестігін бақылаңыз.
            </p>

            {/* Color swatch & formulas */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div
                className="aspect-square rounded-2xl shadow-inner border border-slate-200 flex flex-col items-center justify-center text-center p-3 transition-colors"
                style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
              >
                <span
                  className="font-mono font-black text-sm px-2 py-1 rounded bg-black/40 text-white backdrop-blur-xs"
                >
                  RGB({red}, {green}, {blue})
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">RGB Түс үлгісі (Аддитивті):</span>
                  <span className="font-mono font-bold text-slate-800">
                    R: {red} · G: {green} · B: {blue}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">CMYK Түс үлгісі (Субтрактивті):</span>
                  <span className="font-mono font-bold text-slate-800">
                    C: {c}% · M: {m}% · Y: {y}% · K: {kPerc}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="w-16 font-bold text-rose-600">R (Қызыл):</span>
              <input
                type="range"
                min={0}
                max={255}
                value={red}
                onChange={(e) => setRed(Number(e.target.value))}
                className="flex-1 accent-rose-600"
              />
              <span className="w-8 text-right font-mono font-bold">{red}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-16 font-bold text-emerald-600">G (Жасыл):</span>
              <input
                type="range"
                min={0}
                max={255}
                value={green}
                onChange={(e) => setGreen(Number(e.target.value))}
                className="flex-1 accent-emerald-600"
              />
              <span className="w-8 text-right font-mono font-bold">{green}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-16 font-bold text-blue-600">B (Көк):</span>
              <input
                type="range"
                min={0}
                max={255}
                value={blue}
                onChange={(e) => setBlue(Number(e.target.value))}
                className="flex-1 accent-blue-600"
              />
              <span className="w-8 text-right font-mono font-bold">{blue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lab 3: Raster vs Vector Direct Visual Comparison Slider */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md mb-1">
              <Maximize2 className="w-3.5 h-3.5" /> 3-зертхана · Масштабтау сапасы
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Растр және Вектор кескіндерін салыстыру
            </h2>
            <p className="text-xs text-slate-500">
              Масштабты 800%-ға дейін арттырып, растрдың қалай бұзылатынын және вектордың қалай мінсіз қалатынын көріңіз.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Масштаб: {comparisonScale}%</span>
            <input
              type="range"
              min={100}
              max={800}
              step={50}
              value={comparisonScale}
              onChange={(e) => setComparisonScale(Number(e.target.value))}
              className="w-36 accent-teal-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Raster side */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center">
            <span className="text-xs font-bold text-rose-600 mb-2 uppercase tracking-wider">
              Растрлық кескін (.JPG / .PNG)
            </span>
            <div className="w-full h-52 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden relative">
              <div
                className="transition-all duration-200 flex flex-col items-center justify-center"
                style={{
                  transform: `scale(${comparisonScale / 100})`,
                  filter: comparisonScale > 200 ? `blur(${((comparisonScale - 200) / 600) * 2.5}px)` : 'none',
                  imageRendering: 'pixelated'
                }}
              >
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                  R
                </div>
                <span className="text-[10px] font-bold text-slate-700 mt-1">Растр</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              {comparisonScale > 250
                ? '⚠️ Сапасы төмендеді: пиксельдер созылып, кескін бұлыңғырланды!'
                : 'Қалыпты көрініс'}
            </p>
          </div>

          {/* Vector side */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center">
            <span className="text-xs font-bold text-teal-600 mb-2 uppercase tracking-wider">
              Векторлық кескін (.SVG / .CDR)
            </span>
            <div className="w-full h-52 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden relative">
              <div
                className="transition-all duration-200 flex flex-col items-center justify-center"
                style={{
                  transform: `scale(${comparisonScale / 100})`,
                  imageRendering: 'auto'
                }}
              >
                <svg width="64" height="64" viewBox="0 0 64 64" className="drop-shadow-md">
                  <circle cx="32" cy="32" r="30" fill="#0d9488" stroke="#042f2e" strokeWidth="2" />
                  <text x="32" y="38" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="20" fontFamily="sans-serif">
                    V
                  </text>
                </svg>
                <span className="text-[10px] font-bold text-slate-700 mt-1">Вектор</span>
              </div>
            </div>
            <p className="text-[11px] text-teal-700 font-semibold mt-2 text-center">
              ✓ Сапасы өзгермейді: жиектері кез келген үлкейтуде мінсіз анық!
            </p>
          </div>
        </div>
      </div>

      {/* Lab 4: Virtual Photo Editor Studio */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md mb-1">
              <ImageIcon className="w-3.5 h-3.5" /> 4-зертхана · Виртуалды фотоөңдеу студиясы
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Графикалық сүзгілер мен параметрлерді реттеу
            </h2>
            <p className="text-xs text-slate-500">
              Жарықтықты, контрасты және түс қанықтығын реттеп, растрлық фотоөңдеу принциптерін үйреніңіз.
            </p>
          </div>

          <button
            onClick={() => {
              setBrightness(100);
              setContrast(100);
              setSaturation(100);
              setFilterMode('normal');
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Бастапқы күйі</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-8 flex items-center justify-center bg-slate-900 rounded-2xl p-4 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={500}
              height={320}
              className="max-w-full h-auto rounded-xl shadow-md transition-all"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${
                  filterMode === 'sepia'
                    ? 'sepia(100%)'
                    : filterMode === 'grayscale'
                    ? 'grayscale(100%)'
                    : filterMode === 'invert'
                    ? 'invert(100%)'
                    : ''
                }`
              }}
            />
          </div>

          <div className="lg:col-span-4 space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                <span>Жарықтық (Brightness):</span>
                <span className="font-mono font-bold text-blue-600">{brightness}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={200}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                <span>Контраст (Contrast):</span>
                <span className="font-mono font-bold text-blue-600">{contrast}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={200}
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                <span>Қанықтылық (Saturation):</span>
                <span className="font-mono font-bold text-blue-600">{saturation}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={250}
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <span className="block font-semibold text-slate-700 mb-1.5">Түстік сүзгілер:</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'normal', label: 'Қалыпты' },
                  { id: 'sepia', label: 'Сепия' },
                  { id: 'grayscale', label: 'Ақ-қара' },
                  { id: 'invert', label: 'Инверсия' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterMode(f.id)}
                    className={`py-1.5 px-2.5 rounded-lg border font-bold text-[11px] transition-colors cursor-pointer ${
                      filterMode === f.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
