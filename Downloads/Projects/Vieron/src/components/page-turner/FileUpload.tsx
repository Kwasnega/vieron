"use client";

import { useState, useRef, useCallback } from 'react';
import { UploadCloud, File as FileIcon, Loader2, AlertCircle, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import * as pdfjsLib from 'pdfjs-dist';
import { cn } from '@/lib/utils';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

export type ProcessedFile = {
  pageImages: string[];
  textContent: string;
  pageTextContent: string[];
}

type FileUploadProps = {
  onFileProcessed: (processedFile: ProcessedFile, originalFile: File) => void;
};

export function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = useCallback(async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('System Error: Invalid file format. Only PDF is supported.');
      return;
    }
    setError(null);
    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const numPages = pdf.numPages;
      const pageImages: string[] = [];
      const pageTextContent: string[] = [];
      let fullText = '';

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          pageImages.push(canvas.toDataURL());
        }

        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
        pageTextContent.push(pageText);
        fullText += pageText + '\n\n';

        setProgress(Math.round((i / numPages) * 100));
      }
      onFileProcessed({ pageImages, textContent: fullText, pageTextContent }, file);
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError('System Failure: Could not process the document. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  }, [onFileProcessed]);

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }
  
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }

  return (
    <div 
      className="w-full max-w-2xl text-center p-8 flex flex-col items-center justify-center animate-fade-in"
      onDragOver={onDragOver} 
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="text-center mb-8 animate-fade-in [animation-delay:0.2s]">
        <h1 className="text-5xl font-bold font-headline glow-primary">
          Vieron Reader
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Upload a document to initialize the holographic interface.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4 text-left max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className={cn(
        "relative w-80 h-80 rounded-full flex items-center justify-center transition-all duration-300",
        {"scale-105": isDragging}
      )}>
        <div className={cn(
            "absolute inset-0 rounded-full border-2 border-dashed border-primary/30 bg-card/50 transition-all duration-300",
            {"border-primary shadow-2xl shadow-primary/40": isDragging}
        )}></div>
        
        <div className="absolute inset-0 rounded-full bg-primary/5 animate-glow"></div>
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow"></div>
        <div className="absolute inset-4 rounded-full border border-accent/20 animate-spin-reverse-slow"></div>

        <div className="absolute inset-4 rounded-full bg-background"></div>
        
        <div className="z-10 flex flex-col items-center space-y-4 p-4">
          {isProcessing ? (
             <>
                <Loader2 className="h-20 w-20 text-primary glow-primary animate-spin" />
                <p className="text-primary font-semibold">Processing...</p>
                <Progress value={progress} className="w-48" />
                <p className="text-sm text-muted-foreground">{progress}%</p>
            </>
          ) : (
            <>
              <Cpu className="w-20 h-20 text-primary glow-primary animate-float" />
              <p className="text-muted-foreground text-base">
                Drag & Drop Document
              </p>
              <div className='flex items-center gap-2'>
                <div className='h-px w-10 bg-border'/>
                <span className='text-xs text-muted-foreground'>OR</span>
                <div className='h-px w-10 bg-border'/>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" className="hidden" />
              <Button onClick={onButtonClick} disabled={isProcessing} size="lg" variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary-foreground">
                  Select Document
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
