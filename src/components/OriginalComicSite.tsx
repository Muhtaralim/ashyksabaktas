import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, Maximize2, Minimize2, ArrowDown, BookOpen } from 'lucide-react';
import { comicScoreMaxima, type ComicScoreKey } from '../types/classroom';

interface OriginalComicSiteProps {
  onScrollToTasks?: () => void;
  initialComicScores: Record<ComicScoreKey, number>;
  onComicScore: (taskKey: ComicScoreKey, score: number) => void;
}

export const OriginalComicSite: React.FC<OriginalComicSiteProps> = ({ onScrollToTasks, initialComicScores, onComicScore }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(1200);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const handleComicScore = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      if (typeof event.data !== 'object' || event.data === null) return;
      const message = event.data as { type?: unknown; taskKey?: unknown; score?: unknown };
      if (message.type !== 'comic-score' || typeof message.taskKey !== 'string'
        || !Object.hasOwn(comicScoreMaxima, message.taskKey) || typeof message.score !== 'number'
        || !Number.isFinite(message.score)) return;
      onComicScore(message.taskKey as ComicScoreKey, message.score);
    };

    window.addEventListener('message', handleComicScore);
    return () => window.removeEventListener('message', handleComicScore);
  }, [onComicScore]);

  // Auto-fit height when iframe loads
  const handleIframeLoad = () => {
    setIsLoaded(true);
    iframeRef.current?.contentWindow?.postMessage({ type: 'comic-scores-init', scores: initialComicScores }, window.location.origin);
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
        const doc = iframe.contentWindow.document;
        const bodyHeight = Math.max(
          doc.body.scrollHeight,
          doc.documentElement.scrollHeight,
          doc.body.offsetHeight
        );
        if (bodyHeight > 500) {
          setIframeHeight(bodyHeight + 40);
        }
      }
    } catch {
      // Fallback height
      setIframeHeight(2800);
    }
  };

  useEffect(() => {
    // Check height periodically in case images finish loading inside iframe
    const interval = setInterval(() => {
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
          const doc = iframe.contentWindow.document;
          const bodyHeight = Math.max(
            doc.body.scrollHeight,
            doc.documentElement.scrollHeight
          );
          if (bodyHeight > 500 && Math.abs(bodyHeight - iframeHeight) > 100) {
            setIframeHeight(bodyHeight + 40);
          }
        }
      } catch {
        // ignore
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [iframeHeight]);

  return (
    <div className={`relative transition-all ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-2' : 'w-full'}`}>
      {/* Top quick-bar above the original site */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>ТҮПНҰСҚА САЙТ: Компьютерлік графика негіздері — интерактивті оқу-комикс</span>
        </div>

        <div className="flex items-center gap-3">
          {onScrollToTasks && (
            <button
              onClick={onScrollToTasks}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition-colors"
            >
              <span>Тапсырмаларға төмен түсу</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
            title={isFullscreen ? 'Шығу' : 'Толық экран'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Қалыпты көрініс' : 'Толық экран'}</span>
          </button>

          <a
            href="/assets/aistudio/computer_graphics_two_images_updated_2026__1__65bb107e.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1"
            title="Жаңа терезеде ашу"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded 100% original HTML site */}
      <div className="w-full bg-white overflow-hidden">
        <iframe
          ref={iframeRef}
          src="/assets/aistudio/computer_graphics_two_images_updated_2026__1__65bb107e.html"
          title="Компьютерлік графика негіздері"
          onLoad={handleIframeLoad}
          className="w-full border-0 transition-all"
          style={{
            height: isFullscreen ? 'calc(100vh - 45px)' : `${iframeHeight}px`,
            minHeight: '700px',
            display: 'block'
          }}
        />
      </div>
    </div>
  );
};
