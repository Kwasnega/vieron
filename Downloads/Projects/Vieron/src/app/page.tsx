"use client";

import { useState } from 'react';
import { Header } from '@/components/page-turner/Header';
import { FileUpload, ProcessedFile } from '@/components/page-turner/FileUpload';
import { FlipbookViewer } from '@/components/page-turner/FlipbookViewer';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const handleFileProcessed = (fileData: ProcessedFile, file: File) => {
    setProcessedFile(fileData);
    setOriginalFile(file);
  };
  
  const handleReset = () => {
    setProcessedFile(null);
    setOriginalFile(null);
  };
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };
  
  // Set initial theme on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add(theme);
    }
  }, []);

  return (
    <div className={cn("flex flex-col min-h-screen")}>
      <Header onReset={handleReset} showReset={!!processedFile}>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
        </Button>
      </Header>
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 overflow-hidden">
        {processedFile ? (
          <FlipbookViewer 
            pages={processedFile.pageImages} 
            textContent={processedFile.textContent}
            pageTextContent={processedFile.pageTextContent}
            originalFile={originalFile}
            initialTheme={theme}
          />
        ) : (
          <FileUpload onFileProcessed={handleFileProcessed} />
        )}
      </main>
    </div>
  );
}
