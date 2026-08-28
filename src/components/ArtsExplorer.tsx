'use client';

import { useState } from 'react';
import { ArtsCulture } from '@/lib/db';
import DynamicImage from '@/components/DynamicImage';

interface ArtsExplorerProps {
  arts: ArtsCulture[];
}

export default function ArtsExplorer({ arts }: ArtsExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedArt, setSelectedArt] = useState<ArtsCulture | null>(null);

  const categories = ['Semua', 'Tari', 'Musik', 'Alat Musik', 'Pakaian Adat', 'Kerajinan', 'Kesenian Lainnya'];

  const filteredArts = selectedCategory === 'Semua'
    ? arts
    : arts.filter(art => art.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-card-border/40 pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-md shadow-primary/10'
                : 'bg-card-bg text-foreground/80 border border-card-border hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredArts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArts.map((art) => (
            <div 
              key={art.id} 
              className="bg-card-bg border border-card-border/60 rounded-xl overflow-hidden card-lift flex flex-col group"
            >
              {/* Image Section */}
              <div className="w-full aspect-[16/10] overflow-hidden relative">
                <DynamicImage 
                  src={art.image_url} 
                  alt={art.name} 
                  className="w-full h-full rounded-none object-cover"
                />
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-3xs font-extrabold text-secondary uppercase tracking-widest">
                    <span>{art.category}</span>
                    <span className="text-muted font-normal normal-case">{art.origin_region}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-all duration-300">
                    {art.name}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed line-clamp-4 text-justify">
                    {art.description}
                  </p>
                </div>

                {/* Cultural Meaning Section */}
                <div className="bg-primary/5 border-l-2 border-primary p-3 rounded-r-lg space-y-1">
                  <span className="text-3xs font-bold text-primary uppercase tracking-wider block">Makna Filosofis:</span>
                  <p className="text-xs text-foreground/90 leading-relaxed italic text-justify">
                    "{art.meaning}"
                  </p>
                </div>

                {/* Card Footer Link - Triggering Modal */}
                <div className="pt-2 border-t border-card-border/40">
                  <button 
                    onClick={() => setSelectedArt(art)}
                    className="inline-flex items-center text-xs font-bold text-primary hover:text-primary-hover transition-all cursor-pointer outline-none"
                  >
                    Pelajari Selengkapnya
                    <svg className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card-bg border border-card-border/60 rounded-xl py-16 text-center text-muted">
          <svg className="w-12 h-12 mx-auto text-muted/60 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-sm">Belum ada seni & budaya di kategori ini.</p>
        </div>
      )}

      {/* Premium Detail Modal for Arts */}
      {selectedArt && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs transition-opacity duration-300">
          <div 
            className="bg-card-bg border border-card-border/80 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] relative animate-scale-up font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedArt(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label="Tutup detail"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Image */}
            <div className="w-full aspect-[16/9] relative overflow-hidden shrink-0 border-b border-card-border/40">
              <DynamicImage
                src={selectedArt.image_url}
                alt={selectedArt.name}
                className="w-full h-full rounded-none object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-16">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-4xs font-bold text-secondary uppercase tracking-widest bg-secondary/15 px-2 py-0.5 rounded border border-secondary/20">
                      {selectedArt.category}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                      {selectedArt.name}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm leading-relaxed text-justify">
              <div className="flex justify-between items-center text-3xs font-extrabold text-muted uppercase tracking-wider border-b border-card-border/30 pb-3">
                <span>Daerah Asal:</span>
                <span className="text-foreground">{selectedArt.origin_region}</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-base font-bold text-foreground">Deskripsi Kesenian</h4>
                <p className="text-muted text-xs leading-relaxed font-light">
                  {selectedArt.description}
                </p>
              </div>

              {/* Philosophical Meaning Panel */}
              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-xl space-y-1.5">
                <span className="text-3xs font-bold text-primary uppercase tracking-wider block">Makna Filosofis & Nilai Budaya</span>
                <p className="text-xs text-foreground/90 font-medium italic leading-relaxed">
                  "{selectedArt.meaning}"
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-card-border/40 bg-card-bg/60 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedArt(null)}
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
