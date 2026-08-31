'use client';

import { useState } from 'react';
import { Gallery } from '@/lib/db';
import DynamicImage from '@/components/DynamicImage';

interface GalleryGridProps {
  items: Gallery[];
}

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [activeItem, setActiveItem] = useState<Gallery | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // If the user selects a filter or total items decreases and currentPage is out of bounds, reset it
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  return (
    <div className="space-y-8">
      {/* Gallery Grid */}
      {currentItems.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => {
              const ytId = item.type === 'video' ? getYouTubeId(item.media_url) : null;
              const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : item.media_url;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveItem(item);
                    }
                  }}
                  className="bg-card-bg border border-card-border/60 rounded-xl overflow-hidden card-lift group cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {/* Media Thumbnail */}
                  <div className="w-full aspect-[4/3] overflow-hidden relative bg-zinc-950/10">
                    <DynamicImage src={thumbUrl} alt={item.title} className="w-full h-full rounded-none object-cover" />
                    
                    {/* Play button overlay for video */}
                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-zinc-950/20 flex items-center justify-center group-hover:bg-zinc-950/30 transition-all">
                        <div className="w-12 h-12 bg-white/90 group-hover:bg-white text-primary rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                          <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {/* Image magnify indicator for photo */}
                    {item.type === 'image' && (
                      <div className="absolute inset-0 bg-zinc-950/0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-zinc-950/20 transition-all duration-300">
                        <div className="w-10 h-10 bg-white/90 text-primary rounded-full flex items-center justify-center shadow-md">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Media Description Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-3xs font-extrabold text-secondary uppercase tracking-widest">
                        <span>{item.type === 'video' ? 'UPACARA ADAT' : 'SENI TARI'}</span>
                        <span className="text-muted font-normal normal-case">Kalimantan Tengah</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-muted line-clamp-3 leading-relaxed text-justify font-light">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Card Footer Link */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveItem(item);
                      }}
                      className="pt-2 border-t border-card-border/40 w-full text-left inline-flex items-center text-xs font-bold text-primary hover:text-primary-hover transition-all focus:outline-none cursor-pointer bg-transparent"
                    >
                      Lihat Dokumentasi Lanjutan
                      <svg className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 pt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-card-border/80 bg-card-bg hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Halaman Sebelumnya"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg font-sans font-semibold text-xs transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-primary text-white shadow-md shadow-primary/10'
                      : 'border border-card-border/80 bg-card-bg hover:border-primary hover:text-primary'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-card-border/80 bg-card-bg hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Halaman Selanjutnya"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card-bg border border-card-border/60 rounded-xl py-16 text-center text-muted">
          <svg className="w-12 h-12 mx-auto text-muted/65 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Belum ada item galeri yang ditambahkan.</p>
        </div>
      )}

      {/* Lightbox / Video Player Modal */}
      {activeItem && (
        <div className="fixed inset-0 bg-zinc-950/90 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] bg-card-bg border border-card-border/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
            {/* Modal Header */}
            <div className="p-4 border-b border-card-border/60 flex justify-between items-center bg-card-bg/95">
              <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1">{activeItem.title}</h3>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-full hover:bg-primary/10 text-muted hover:text-primary transition-all focus:outline-none"
                title="Tutup Galeri"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-grow overflow-auto p-6 flex flex-col items-center justify-center bg-zinc-950/10 min-h-[300px]">
              {activeItem.type === 'video' ? (
                (() => {
                  const activeYtId = getYouTubeId(activeItem.media_url);
                  return activeYtId ? (
                    <div className="w-full aspect-video max-w-3xl rounded-xl overflow-hidden border border-card-border/20 shadow-md">
                      <iframe
                        src={`https://www.youtube.com/embed/${activeYtId}?autoplay=1`}
                        title={activeItem.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full bg-black border-none"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video max-w-3xl rounded-xl overflow-hidden border border-card-border/20 shadow-md">
                      <video 
                        src={activeItem.media_url} 
                        controls 
                        autoPlay 
                        className="w-full h-full bg-black focus:outline-none"
                      />
                    </div>
                  );
                })()
              ) : (
                <div className="w-full max-w-3xl aspect-[4/3] relative rounded-xl overflow-hidden border border-card-border/20 shadow-md">
                  <DynamicImage 
                    src={activeItem.media_url} 
                    alt={activeItem.title} 
                    className="w-full h-full rounded-none"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer Description */}
            {activeItem.description && (
              <div className="p-5 bg-card-bg/95 border-t border-card-border/60 text-xs text-muted text-left leading-relaxed whitespace-pre-wrap max-h-[150px] overflow-y-auto font-light">
                {activeItem.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
