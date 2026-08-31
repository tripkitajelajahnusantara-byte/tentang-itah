'use client';

import { useState } from 'react';
import { Tradition } from '@/lib/db';
import DynamicImage from '@/components/DynamicImage';

interface TraditionsListProps {
  traditions: Tradition[];
}

export default function TraditionsList({ traditions }: TraditionsListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(traditions.length / itemsPerPage);
  const currentItems = traditions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  return (
    <div className="space-y-12">
      {currentItems.length > 0 ? (
        <div className="space-y-12">
          <div className="space-y-12">
            {currentItems.map((trad, index) => (
              <div 
                key={trad.id} 
                className={`bg-card-bg border border-card-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0`}
              >
                {/* Image Column */}
                <div className={`lg:col-span-5 relative min-h-[250px] lg:min-h-[400px] overflow-hidden ${
                  index % 2 === 1 ? 'lg:order-last' : ''
                }`}>
                  <DynamicImage 
                    src={trad.image_url} 
                    alt={trad.name} 
                    className="w-full h-full rounded-none"
                  />
                </div>

                {/* Content Column */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground hover:text-primary transition-colors">
                      {trad.name}
                    </h2>
                    <p className="text-sm sm:text-base text-muted leading-relaxed">
                      {trad.description}
                    </p>
                  </div>

                  {/* Structured Metadata Badges Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-card-border/50">
                    <div className="space-y-1">
                      <span className="text-3xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Lokasi:
                      </span>
                      <p className="text-xs text-foreground/80 font-medium">{trad.location}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-3xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Tujuan:
                      </span>
                      <p className="text-xs text-foreground/80 font-medium">{trad.purpose}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-3xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Makna Filosofis:
                      </span>
                      <p className="text-xs text-foreground/80 font-medium italic">"{trad.meaning}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
          <svg className="w-12 h-12 mx-auto text-muted/60 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-sm">Belum ada tradisi yang ditambahkan.</p>
        </div>
      )}
    </div>
  );
}
