import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Palette,
  Volume2,
  VolumeX,
  FileText,
  Loader2,
  Download,
  PanelLeft,
  Play,
  Pause,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type FlipbookControlsProps = {
  currentPage: number;
  totalPages: number;
  onFlip: (direction: 'next' | 'prev') => void;
  onZoom: (direction: 'in' | 'out') => void;
  zoomLevel: number;
  onThemeChange: (theme: 'light' | 'dark') => void;
  currentTheme: 'light' | 'dark';
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  isFlipping: boolean;
  onToggleSound: () => void;
  isSoundEnabled: boolean;
  onSummarize: () => void;
  isSummarizing: boolean;
  onDownload: () => void;
  onToggleThumbnails: () => void;
  isThumbnailsVisible: boolean;
  onToggleNarration: () => void;
  isNarrating: boolean;
  isNarrationLoading: boolean;
};

export function FlipbookControls({
  currentPage,
  totalPages,
  onFlip,
  onZoom,
  zoomLevel,
  onThemeChange,
  currentTheme,
  onToggleFullscreen,
  isFullscreen,
  isFlipping,
  onToggleSound,
  isSoundEnabled,
  onSummarize,
  isSummarizing,
  onDownload,
  onToggleThumbnails,
  isThumbnailsVisible,
  onToggleNarration,
  isNarrating,
  isNarrationLoading,
}: FlipbookControlsProps) {
  const pageLabel = currentPage === 0 ? 'Cover' : currentPage >= totalPages ? `${totalPages}` : `${currentPage}-${currentPage+1}`;

  const handleThemeToggle = () => {
    onThemeChange(currentTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-2 p-2 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-full shadow-lg glow-accent">
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant={isThumbnailsVisible ? "secondary" : "ghost"} size="icon" onClick={onToggleThumbnails}>
                    <PanelLeft className="h-5 w-5" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Toggle Thumbnails</p>
            </TooltipContent>
        </Tooltip>

        <div className="h-6 w-px bg-border mx-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => onFlip('prev')} disabled={currentPage === 0 || isFlipping}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Previous Page</p>
          </TooltipContent>
        </Tooltip>
        
        <span className="text-sm text-muted-foreground font-mono w-28 text-center">
          Page {pageLabel}
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => onFlip('next')} disabled={currentPage >= totalPages -1 || isFlipping}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Next Page</p>
          </TooltipContent>
        </Tooltip>

        <div className="h-6 w-px bg-border mx-2" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onSummarize} disabled={isSummarizing}>
              {isSummarizing ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Summarize PDF</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onToggleNarration} disabled={isNarrationLoading}>
                    {isNarrationLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isNarrating ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />)}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{isNarrating ? 'Pause Narration' : 'Read Aloud'}</p>
            </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onDownload}>
              <Download className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download Flipbook</p>
          </TooltipContent>
        </Tooltip>
        
        <div className="h-6 w-px bg-border mx-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => onZoom('out')} disabled={zoomLevel <= 0.5}>
              <ZoomOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>

        <span className="text-sm text-muted-foreground font-mono w-16 text-center">
          {Math.round(zoomLevel * 100)}%
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => onZoom('in')} disabled={zoomLevel >= 3}>
              <ZoomIn className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>
        
        <div className="h-6 w-px bg-border mx-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onToggleSound}>
              {isSoundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSoundEnabled ? 'Mute' : 'Unmute'}</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleThemeToggle}>
                    {currentTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Toggle {currentTheme === 'light' ? 'Dark' : 'Light'} Mode</p>
            </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</p>
          </TooltipContent>
        </Tooltip>

      </div>
    </TooltipProvider>
  );
}
