import React, { useEffect, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export const FullscreenToggle: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen));
    const updateFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', updateFullscreen);
    return () => document.removeEventListener('fullscreenchange', updateFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (error) {
      console.error('Толық экран режимі іске қосылмады.', error);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      disabled={!supported}
      title={supported ? (isFullscreen ? 'Толық экраннан шығу' : 'Толық экран') : 'Бұл браузер толық экранды қолдамайды'}
      aria-label={isFullscreen ? 'Толық экраннан шығу' : 'Толық экран'}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      <span className="hidden sm:inline">{isFullscreen ? 'Шығу' : 'Толық экран'}</span>
    </button>
  );
};