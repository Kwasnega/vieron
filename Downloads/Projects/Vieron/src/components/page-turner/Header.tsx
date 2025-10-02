import { Cpu, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  onReset: () => void;
  showReset: boolean;
  children?: React.ReactNode;
};

export function Header({ onReset, showReset, children }: HeaderProps) {
  return (
    <header className="w-full p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Cpu className="h-8 w-8 text-primary glow-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            Vieron Reader
          </h1>
        </div>
        <div className='flex items-center gap-2'>
            {children}
            {showReset && (
            <Button variant="ghost" size="icon" onClick={onReset} aria-label="Upload another PDF">
                <UploadCloud className="h-6 w-6" />
            </Button>
            )}
        </div>
      </div>
    </header>
  );
}
