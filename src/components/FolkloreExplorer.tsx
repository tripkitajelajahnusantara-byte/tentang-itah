'use client';

import { useState } from 'react';
import { Folklore } from '@/lib/db';
import DynamicImage from '@/components/DynamicImage';
import AudioPlayer from '@/components/AudioPlayer';

interface FolkloreExplorerProps {
  stories: Folklore[];
}

export default function FolkloreExplorer({ stories }: FolkloreExplorerProps) {
  const [selectedStory, setSelectedStory] = useState<Folklore | null>(null);

  return (
    <div className="space-y-8">
      {/* Grid of Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stories.map((story) => (
          <div 
            key={story.id} 
            className="bg-card-bg border border-card-border/60 rounded-xl overflow-hidden card-lift flex flex-col group cursor-pointer"
            onClick={() => setSelectedStory(story)}
          >
            <div className="w-full aspect-[16/9] overflow-hidden relative">
              <DynamicImage 
                src={story.image_url} 
                alt={story.title} 
                className="w-full h-full rounded-none"
              />
              <span className="absolute bottom-3 left-3 bg-primary/90 text-white px-2.5 py-0.5 rounded-full text-3xs font-semibold uppercase tracking-wider">
                {story.region}
              </span>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {story.title}
                </h2>
                <p className="text-sm text-muted leading-relaxed line-clamp-3">
                  {story.content}
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-primary font-bold group-hover:underline">Baca Selengkapnya</span>
                {story.audio_url && (
                  <span className="flex items-center gap-1 text-secondary font-medium">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                    Tersedia Audio
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reading Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs transition-opacity duration-300">
          <div 
            className="bg-card-bg border border-card-border/80 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col relative animate-scale-up font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Absolute Close Button (Frees up title space on mobile) */}
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label="Tutup halaman membaca"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-card-border/60 flex flex-col items-start bg-card-bg/95 z-10 shrink-0 pr-16">
              <span className="text-4xs font-bold text-secondary uppercase tracking-widest bg-secondary/15 px-2 py-0.5 rounded border border-secondary/20">
                {selectedStory.region}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-1.5 leading-snug">
                {selectedStory.title}
              </h3>
            </div>

            {/* Modal Body (Scrollable Content) */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
              
              {/* Image banner inside story */}
              <div className="w-full aspect-[21/9] rounded-xl overflow-hidden shadow-inner border border-card-border/40 shrink-0">
                <DynamicImage 
                  src={selectedStory.image_url} 
                  alt={selectedStory.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Audio player if available */}
              {selectedStory.audio_url && (
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z" />
                      </svg>
                      Dengarkan Narasi Audio
                    </h4>
                    <p className="text-xs text-muted">Dengarkan penuturan lisan cerita rakyat ini sembari membaca.</p>
                  </div>
                  <AudioPlayer 
                    src={selectedStory.audio_url} 
                    layout="full" 
                    label={selectedStory.title} 
                  />
                </div>
              )}

              {/* Story Content */}
              <article className="prose prose-stone dark:prose-invert max-w-none">
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-line text-justify font-sans font-light">
                  {selectedStory.content}
                </p>
              </article>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-card-border/60 bg-card-bg/60 text-right shrink-0">
              <button
                onClick={() => setSelectedStory(null)}
                className="px-6 py-2 rounded-full bg-[#120F0D] hover:bg-[#221A15] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Selesai Membaca
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
