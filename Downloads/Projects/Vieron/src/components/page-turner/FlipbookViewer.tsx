
"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FlipbookControls } from './FlipbookControls';
import { ThumbnailSidebar } from './ThumbnailSidebar';
import { cn } from '@/lib/utils';
import './Flipbook.css';
import { summarizeText } from '@/ai/flows/summarize-text-flow';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet as SummarySheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from '@/components/ui/scroll-area';

type SheetData = {
  front: { src: string, hint: string };
  back: { src: string, hint: string };
}

type FlipbookViewerProps = {
  pages: string[];
  textContent: string;
  pageTextContent: string[];
  originalFile: File | null;
  initialTheme: 'light' | 'dark';
};

export function FlipbookViewer({ pages, textContent, pageTextContent, originalFile, initialTheme }: FlipbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [targetPage, setTargetPage] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDuration] = useState(800);
  const [fullscreen, setFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarySheetOpen, setIsSummarySheetOpen] = useState(false);
  
  const [isThumbnailsVisible, setIsThumbnailsVisible] = useState(true);

  const [isNarrating, setIsNarrating] = useState(false);
  const [isNarrationLoading, setIsNarrationLoading] = useState(false);
  const narrationAudioRef = useRef<HTMLAudioElement | null>(null);
  
  const [theme, setTheme] = useState(initialTheme);
  
  const { toast } = useToast();

  const viewerRef = useRef<HTMLDivElement>(null);
  const flipAudioRef = useRef<HTMLAudioElement | null>(null);
  const touchStartX = useRef(0);

  const totalPages = pages.length;
  
  const sheets = useMemo<SheetData[]>(() => {
    const result: SheetData[] = [];
    // The first sheet is special: its back is the cover.
    result.push({
      back: { src: pages[0], hint: 'cover page' },
      front: { src: pages[1] || '', hint: 'page content' },
    });
    
    // Subsequent sheets
    for (let i = 1; i < Math.ceil(pages.length / 2); i++) {
        const backIndex = i * 2;
        const frontIndex = i * 2 + 1;

        result.push({
            back: { src: pages[backIndex], hint: `page content` },
            front: { src: pages[frontIndex] || '', hint: `page content` },
        });
    }
    return result;
  }, [pages]);
  
  useEffect(() => {
    // Create a simple page flip sound using Web Audio API
    const createFlipSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const duration = 0.3;
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        // Create a swoosh sound with decreasing frequency
        const freq = 800 - (t * 1500);
        data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 8) * 0.3;
      }
      
      return { audioContext, buffer };
    };
    
    const soundData = createFlipSound();
    
    // Store the sound data for playback
    (flipAudioRef as any).current = soundData;
  }, []);

  const playFlipSound = useCallback(() => {
    if (soundEnabled && flipAudioRef.current) {
      const soundData = (flipAudioRef as any).current;
      if (soundData?.audioContext && soundData?.buffer) {
        try {
          const source = soundData.audioContext.createBufferSource();
          source.buffer = soundData.buffer;
          source.connect(soundData.audioContext.destination);
          source.start(0);
        } catch (err) {
          console.error("Audio play failed:", err);
        }
      }
    }
  }, [soundEnabled]);

  const handleFlip = useCallback((direction: 'next' | 'prev') => {
    if (isFlipping) return;
  
    const pageIncrement = 2;
  
    const nextPage = direction === 'next'
      ? Math.min(currentPage + pageIncrement, totalPages)
      : Math.max(currentPage - pageIncrement, 0);
  
    if (nextPage !== currentPage) {
      playFlipSound();
      setIsFlipping(true);
      setTargetPage(nextPage);
    }
  }, [currentPage, totalPages, isFlipping, playFlipSound]);
  
  const handleJumpToPage = (pageIndex: number) => {
    if (isFlipping) return;
    
    const targetSpreadStart = pageIndex === 0 ? 0 : pageIndex % 2 === 0 ? pageIndex : pageIndex - 1;


    if (targetSpreadStart !== currentPage) {
        playFlipSound();
        setIsFlipping(true);
        setTargetPage(targetSpreadStart);
    }
  };


  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => direction === 'in' ? Math.min(prev * 1.2, 3) : Math.max(prev / 1.2, 0.5));
  };
  
  const handleToggleFullscreen = () => {
    const elem = viewerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleSummarize = async () => {
    if (isSummarizing) return;
    setIsSummarizing(true);
    try {
      const result = await summarizeText({ text: textContent });
      setSummary(result.summary);
      setIsSummarySheetOpen(true);
    } catch (error) {
      console.error("Summarization error:", error);
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: "Could not generate a summary for this PDF. Please try again.",
      });
    } finally {
      setIsSummarizing(false);
    }
  };
  
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  const handleDownload = () => {
    if (!originalFile) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Original file not found.",
      });
      return;
    }
    const flipbookHTML = generateFlipbookHTML();
    const blob = new Blob([flipbookHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalFile.name.replace(/\.pdf$/i, '')}-flipbook.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleToggleNarration = () => {
    if (isNarrationLoading) return;

    if (isNarrating && narrationAudioRef.current) {
        narrationAudioRef.current.pause();
        setIsNarrating(false);
    } else {
        setIsNarrating(true);
    }
  };
  
  useEffect(() => {
    if(targetPage !== null){
      setTimeout(() => {
        setCurrentPage(targetPage);
        setIsFlipping(false);
        setTargetPage(null);
      }, flipDuration);
    }
  }, [targetPage, flipDuration])

  useEffect(() => {
    const narrate = async () => {
        if (!isNarrating || isNarrationLoading || isFlipping || !pageTextContent || currentPage > pageTextContent.length) {
            return;
        }

        setIsNarrationLoading(true);
        try {
            let textToRead = '';
            if (currentPage === 0) {
                textToRead = pageTextContent[0] || '';
            } else if (pageTextContent.length >= currentPage) {
                const leftPageIndex = currentPage;
                const rightPageIndex = currentPage + 1;
                const leftText = pageTextContent[leftPageIndex] || '';
                const rightText = pageTextContent.length > rightPageIndex ? pageTextContent[rightPageIndex] || '' : '';
                textToRead = `${leftText} ${rightText}`;
            }

            if (!textToRead.trim()) {
                if(currentPage < totalPages - 2) handleFlip('next');
                return;
            }

            const result = await textToSpeech({ text: textToRead });
            
            if (result.audio && isNarrating) {
                if (!narrationAudioRef.current) {
                    narrationAudioRef.current = new Audio();
                }
                narrationAudioRef.current.src = result.audio;
                narrationAudioRef.current.play().catch(e => console.error("Audio playback error:", e));
                narrationAudioRef.current.onended = () => {
                    if (currentPage < totalPages - 2) {
                        handleFlip('next');
                    } else {
                        setIsNarrating(false);
                    }
                };
            } else {
                if (currentPage < totalPages - 2) {
                  handleFlip('next');
                } else {
                  setIsNarrating(false);
                }
            }
        } catch (error) {
            console.error("Narration error:", error);
            toast({
                variant: "destructive",
                title: "Narration Failed",
                description: "Could not generate audio for this page.",
            });
            setIsNarrating(false);
        } finally {
            setIsNarrationLoading(false);
        }
    };
    
    narrate();

  }, [isNarrating, currentPage, isFlipping, pageTextContent, handleFlip, toast, totalPages]);
  
  useEffect(() => {
    if(isFlipping && isNarrating) {
      if(narrationAudioRef.current) {
        narrationAudioRef.current.pause();
      }
    }
  }, [isFlipping, isNarrating])

  useEffect(() => {
    return () => {
      if (narrationAudioRef.current) {
        narrationAudioRef.current.pause();
        narrationAudioRef.current = null;
      }
    };
  }, []);

  const generateFlipbookHTML = () => {
    const sheetElements = sheets.map((sheet, index) => {
        const pageBackNum = index * 2;
        const pageFrontNum = index * 2 + 1;
        
        // The first sheet's back is the cover page (page 1 content)
        const backContent = index === 0 
            ? `<div class="page page-back page-cover"><img src="${sheet.back.src}" alt="Cover" /></div>`
            : `<div class="page page-back"><img src="${sheet.back.src}" alt="Page ${pageBackNum + 1}" /></div>`;

        const frontContent = sheet.front.src 
            ? `<div class="page page-front"><img src="${sheet.front.src}" alt="Page ${pageFrontNum + 1}" /></div>`
            : '<div class="page page-front"></div>';
        
        return `
            <div class="sheet" style="z-index: ${sheets.length - index};">
                ${backContent}
                ${frontContent}
            </div>`;
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${originalFile?.name.replace(/\.pdf$/i, '') || 'Flipbook'}</title>
        <style>
          :root {
            --background: 222 83% 4%;
            --foreground: 210 20% 98%;
            --card: 222 83% 8%;
            --border: 215 28% 17%;
            --primary: 180 100% 50%;
            --accent: 260 100% 60%;
            --muted-foreground: 216 12% 47%;
            --secondary: 215 28% 17%;
          }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            min-height: 100vh; 
            margin: 0; 
            background-color: hsl(var(--background)); 
            color: hsl(var(--foreground));
            overflow: hidden;
          }
          .flipbook-container {
            width: 90vw;
            height: 80vh;
            max-width: 1131px;
            max-height: 800px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease-in-out;
          }
          .flipbook {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            perspective: 2500px;
            filter: drop-shadow(0 20px 25px hsla(var(--primary) / 0.2)) drop-shadow(0 0 8px hsla(var(--accent) / 0.1));
          }
          .sheet {
            position: absolute;
            width: 50%;
            height: 100%;
            top: 0;
            right: 0;
            transform-style: preserve-3d;
            transform-origin: left;
            transition: transform 0.8s cubic-bezier(0.17, 0.82, 0.26, 0.99);
            border-radius: 8px;
            will-change: transform;
          }
          .sheet.turned {
            transform: rotateY(-180deg);
          }
          .page {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            background-color: hsl(var(--card));
            border: 1px solid hsl(var(--border));
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .page img {
            width: 100%; height: 100%; object-fit: contain; user-select: none; -webkit-user-drag: none;
          }
          .page-front {
            border-radius: 0 8px 8px 0;
          }
          .page-back {
            transform: rotateY(180deg);
            border-radius: 8px 0 0 8px;
          }
          .sheet:first-child .page-back.page-cover {
            border-radius: 8px;
          }
          .sheet:first-child.turned .page-back.page-cover {
            border-radius: 8px 0 0 8px;
          }
          .sheet:last-child.turned .page-back {
            border-radius: 8px;
          }
          .page-front::after, .page-back::after {
            content: '';
            position: absolute;
            top: 0;
            width: 100px;
            height: 100%;
            pointer-events: none;
            transition: opacity 0.5s;
          }
          .page-front::after {
            left: 0;
            background: linear-gradient(to right, hsla(0, 0%, 0%, 0.2) 0%, hsla(0, 0%, 0%, 0) 100%);
            opacity: 0;
          }
          .sheet.turned .page-front::after {
            opacity: 1;
          }
          .page-back::after {
            right: 0;
            background: linear-gradient(to left, hsla(0, 0%, 0%, 0.2) 0%, hsla(0, 0%, 0%, 0) 100%);
            opacity: 1;
          }
          .sheet.turned .page-back::after {
            opacity: 0;
          }
          .controls { 
            position: fixed;
            bottom: 20px;
            display: flex; 
            gap: 8px; 
            align-items: center;
            padding: 8px;
            background-color: hsla(var(--card) / 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid hsla(var(--primary) / 0.2);
            border-radius: 9999px;
            box-shadow: 0 4px 6px hsla(var(--primary) / 0.1);
            filter: drop-shadow(0 0 8px hsl(var(--accent) / 0.6)) drop-shadow(0 0 15px hsl(var(--accent) / 0.3));
          }
          .controls button { 
            font-size: 14px; 
            padding: 10px; 
            cursor: pointer; 
            border: none;
            background-color: transparent;
            color: hsl(var(--foreground));
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
          }
          .controls button:hover {
             background-color: hsl(var(--secondary));
          }
          .controls button:disabled { 
            opacity: 0.5; cursor: not-allowed; 
          }
          #page-label {
            font-family: monospace;
            font-size: 14px;
            color: hsl(var(--muted-foreground));
            width: 110px;
            text-align: center;
          }
        </style>
      </head>
      <body>
         <div class="flipbook-container">
            <div class="flipbook" id="flipbook">
                ${sheetElements}
            </div>
        </div>
        <div class="controls">
          <button id="prevBtn" title="Previous Page">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span id="page-label">Cover</span>
          <button id="nextBtn" title="Next Page">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
        <script>
          document.addEventListener('DOMContentLoaded', () => {
            const flipbook = document.getElementById('flipbook');
            const sheets = Array.from(flipbook.querySelectorAll('.sheet'));
            const totalPages = ${sheets.length * 2};
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const pageLabel = document.getElementById('page-label');
            let currentPage = 0;

            function updateControls() {
              prevBtn.disabled = currentPage === 0;
              nextBtn.disabled = currentPage >= totalPages - 2;

              if (currentPage === 0) {
                pageLabel.textContent = 'Cover';
              } else if (currentPage >= totalPages -2) {
                  pageLabel.textContent = \`${totalPages - 1}\`;
              } else {
                pageLabel.textContent = \`${currentPage + 1}-${currentPage + 2}\`;
              }
            }

            function flip(direction) {
                const isNext = direction === 'next';

                if (isNext && !nextBtn.disabled) {
                    const sheetIndex = currentPage / 2;
                    if (sheets[sheetIndex]) {
                       sheets[sheetIndex].classList.add('turned');
                       sheets[sheetIndex].style.zIndex = sheets.length + sheetIndex;
                    }
                    currentPage = Math.min(currentPage + 2, totalPages);

                } else if (!isNext && !prevBtn.disabled) {
                    const newCurrentPage = Math.max(currentPage - 2, 0);
                    const sheetIndex = newCurrentPage / 2;
                    if (sheets[sheetIndex]) {
                      sheets[sheetIndex].classList.remove('turned');
                      sheets[sheetIndex].style.zIndex = sheets.length - sheetIndex;
                    }
                    currentPage = newCurrentPage;
                }
                updateControls();
            }

            prevBtn.addEventListener('click', () => flip('prev'));
            nextBtn.addEventListener('click', () => flip('next'));
            
            window.addEventListener('keydown', (e) => {
              if (e.key === 'ArrowLeft') flip('prev');
              if (e.key === 'ArrowRight') flip('next');
            });
            
            updateControls();
          });
        <\/script>
      </body>
      </html>
    `;
  };

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleFlip('prev');
      } else if (e.key === 'ArrowRight') {
        handleFlip('next');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip]);
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isFlipping || !touchStartX.current) return;
    const touchEndX = e.touches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    
    if (deltaX < -50) {
      handleFlip('next');
      touchStartX.current = 0;
    }
    
    if (deltaX > 50) {
      handleFlip('prev');
      touchStartX.current = 0;
    }
  };
  
  const sheetCount = sheets.length;

  return (
    <div
      ref={viewerRef}
      className={cn(
        "w-full h-full flex flex-col items-center justify-center gap-4 transition-colors duration-300",
        theme
      )}
      style={{ backgroundColor: fullscreen ? 'hsl(var(--background))' : 'transparent' }}
    >
      <div className="flex-grow w-full flex items-center justify-center overflow-hidden relative">
          <ThumbnailSidebar 
            pages={pages}
            currentPage={currentPage}
            onPageSelect={handleJumpToPage}
            isVisible={isThumbnailsVisible}
          />
        <div 
          className="flipbook-container"
          style={{ transform: `scale(${zoom})` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="flipbook">
            {sheets.map((sheet, index) => {
                const sheetNumber = index + 1;
                const isTurned = targetPage !== null 
                    ? targetPage >= sheetNumber * 2 
                    : currentPage >= sheetNumber * 2;
                
                let zIndex = sheetCount - index;
                if (isFlipping && targetPage !== null) {
                    const flippingToNext = targetPage > currentPage;
                    const pageBeingFlipped = Math.floor(currentPage / 2);
                    const targetPageSheet = Math.floor((targetPage-1) / 2);

                    if (flippingToNext && index === pageBeingFlipped) {
                        zIndex = sheetCount + 99;
                    } else if (!flippingToNext && index === targetPageSheet) {
                        zIndex = sheetCount + 99;
                    }
                }

              return (
                <div 
                  key={index} 
                  className={cn("sheet", { 'turned': isTurned })} 
                  style={{ zIndex, transitionDuration: `${flipDuration}ms` }}
                >
                  <div className={cn("page page-back", {'page-cover': index === 0})}>
                    {sheet.back.src && <Image
                      src={sheet.back.src}
                      alt={`Page ${index * 2}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index < 2}
                      className="object-contain"
                      data-ai-hint={sheet.back.hint}
                    />}
                  </div>
                  <div className={cn("page page-front")}>
                    {sheet.front.src && (
                       <Image
                        src={sheet.front.src}
                        alt={`Page ${index * 2 + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index < 2}
                        className="object-contain"
                        data-ai-hint={sheet.front.hint}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 p-2">
        <FlipbookControls
          currentPage={currentPage}
          totalPages={totalPages}
          onFlip={handleFlip}
          onZoom={handleZoom}
          zoomLevel={zoom}
          onThemeChange={handleThemeChange}
          currentTheme={theme}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={fullscreen}
          isFlipping={isFlipping}
          onToggleSound={() => setSoundEnabled(prev => !prev)}
          isSoundEnabled={soundEnabled}
          onSummarize={handleSummarize}
          isSummarizing={isSummarizing}
          onDownload={handleDownload}
          onToggleThumbnails={() => setIsThumbnailsVisible(v => !v)}
          isThumbnailsVisible={isThumbnailsVisible}
          onToggleNarration={handleToggleNarration}
          isNarrating={isNarrating}
          isNarrationLoading={isNarrationLoading}
        />
      </div>
      <SummarySheet open={isSummarySheetOpen} onOpenChange={setIsSummarySheetOpen}>
        <SheetContent className="w-full sm:max-w-lg" style={{zIndex: 10000}}>
          <SheetHeader>
            <SheetTitle>PDF Summary</SheetTitle>
            <SheetDescription>
              Here is an AI-generated summary of the document.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-4rem)] mt-4">
            <p className="text-sm text-foreground whitespace-pre-wrap p-4">
              {summary}
            </p>
          </ScrollArea>
        </SheetContent>
      </SummarySheet>
    </div>
  );
}