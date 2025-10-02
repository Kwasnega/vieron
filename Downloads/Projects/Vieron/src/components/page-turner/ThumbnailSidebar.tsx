"use client";

import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type ThumbnailSidebarProps = {
  pages: string[];
  currentPage: number;
  onPageSelect: (pageNumber: number) => void;
  isVisible: boolean;
};

export function ThumbnailSidebar({ pages, currentPage, onPageSelect, isVisible }: ThumbnailSidebarProps) {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 h-full bg-card/80 backdrop-blur-sm z-20 transition-transform duration-300 ease-in-out",
        isVisible ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <ScrollArea className="h-full w-48 border-r">
        <div className="p-2 space-y-2">
          <p className="text-sm font-semibold text-center text-foreground p-2">Pages</p>
          {pages.map((src, index) => {
             // For the cover (index 0), it's active if currentPage is 0. 
             // For other pages, we check ranges.
            const isActive = index === 0 ? currentPage === 0 : (currentPage > index -1 && currentPage <= index + 1) ;

            return (
              <button
                key={index}
                onClick={() => onPageSelect(index)}
                className={cn(
                  "w-full p-1 rounded-md block border-2 transition-all",
                  isActive ? "border-primary" : "border-transparent hover:border-primary/50"
                )}
                aria-label={`Go to page ${index + 1}`}
              >
                <div className="relative aspect-[7/10] bg-muted rounded-sm">
                  <Image
                    src={src}
                    alt={`Thumbnail of page ${index + 1}`}
                    fill
                    sizes="150px"
                    className="object-contain"
                  />
                </div>
                <p className={cn(
                    "text-xs text-center mt-1",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {index + 1}
                </p>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
