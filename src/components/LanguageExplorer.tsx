'use client';

import { useState } from 'react';
import { Language, Vocabulary } from '@/lib/db';
import AudioPlayer from '@/components/AudioPlayer';

interface LanguageExplorerProps {
  languages: Language[];
  vocabularies: Vocabulary[];
}

export default function LanguageExplorer({ languages, vocabularies }: LanguageExplorerProps) {
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter vocabularies based on selected tab and search query
  const filteredVocabularies = vocabularies.filter((vocab) => {
    const matchesLanguage = selectedLanguageId === 'all' || vocab.language_id === selectedLanguageId;
    const matchesSearch = 
      vocab.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
      vocab.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLanguage && matchesSearch;
  });

  const getLanguageName = (langId: string) => {
    const lang = languages.find(l => l.id === langId);
    return lang ? lang.name : 'Bahasa Daerah';
  };

  const selectedLanguage = languages.find(l => l.id === selectedLanguageId);

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari kosakata atau arti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-xl border border-card-border/80 bg-card-bg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
          />
          <svg className="absolute left-3.5 top-3.5 w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-card-border/40 pb-4">
        <button
          onClick={() => setSelectedLanguageId('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            selectedLanguageId === 'all'
              ? 'bg-primary text-white shadow-md shadow-primary/10'
              : 'bg-card-bg text-foreground/80 border border-card-border hover:border-primary hover:text-primary'
          }`}
        >
          Semua Bahasa
        </button>
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setSelectedLanguageId(lang.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              selectedLanguageId === lang.id
                ? 'bg-primary text-white shadow-md shadow-primary/10'
                : 'bg-card-bg text-foreground/80 border border-card-border hover:border-primary hover:text-primary'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>

      {/* Language Information Panel (if specific language selected) */}
      {selectedLanguage && (
        <div className="bg-card-bg/40 border border-card-border/60 rounded-xl p-6 transition-colors duration-300 space-y-3">
          <h2 className="font-serif text-2xl font-bold text-primary">{selectedLanguage.name}</h2>
          <p className="text-sm text-muted leading-relaxed">{selectedLanguage.description}</p>
          <div className="text-xs text-muted flex gap-1">
            <span className="font-semibold text-primary/80">Wilayah Tutur:</span>
            <span>{selectedLanguage.region}</span>
          </div>
        </div>
      )}

      {/* Vocabularies Grid */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-foreground">
          Daftar Kosakata ({filteredVocabularies.length})
        </h3>
        
        {filteredVocabularies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVocabularies.map((vocab) => (
              <div 
                key={vocab.id} 
                className="bg-card-bg border border-card-border/80 rounded-xl p-5 card-lift flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-3xs font-semibold">
                      {getLanguageName(vocab.language_id)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="font-serif text-2xl font-bold text-foreground tracking-wide">
                      {vocab.word}
                    </div>
                    <div className="text-sm text-muted font-light">
                      artinya: <span className="font-semibold text-foreground/90">{vocab.meaning}</span>
                    </div>
                  </div>
                </div>

                {vocab.audio_url && (
                  <div className="pt-2 border-t border-card-border/40 flex justify-start">
                    <AudioPlayer src={vocab.audio_url} label="Dengar Pelafalan" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card-bg border border-card-border/60 rounded-xl py-12 text-center text-muted">
            <svg className="w-12 h-12 mx-auto text-muted/60 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">Tidak ada kosakata yang cocok dengan pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
