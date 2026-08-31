'use client';

import { useState } from 'react';
import { Language, Vocabulary } from '@/lib/db';
import { 
  addLanguageAction, updateLanguageAction, deleteLanguageAction,
  addVocabularyAction, updateVocabularyAction, deleteVocabularyAction 
} from '@/app/actions';

interface AdminLanguageManagerProps {
  initialLanguages: Language[];
  initialVocabularies: Vocabulary[];
}

export default function AdminLanguageManager({
  initialLanguages,
  initialVocabularies
}: AdminLanguageManagerProps) {
  const [languages, setLanguages] = useState<Language[]>(initialLanguages);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>(initialVocabularies);
  
  // Active tab: 'languages' or 'vocabularies'
  const [activeTab, setActiveTab] = useState<'languages' | 'vocabularies'>('languages');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('all');

  // Error/Success state
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // --- LANGUAGE STATE ---
  const [langId, setLangId] = useState('');
  const [langName, setLangName] = useState('');
  const [langDesc, setLangDesc] = useState('');
  const [langRegion, setLangRegion] = useState('');
  const [editingLangId, setEditingLangId] = useState<string | null>(null);

  // --- VOCABULARY STATE ---
  const [vocabId, setVocabId] = useState('');
  const [vocabLangId, setVocabLangId] = useState(languages[0]?.id || '');
  const [vocabWord, setVocabWord] = useState('');
  const [vocabMeaning, setVocabMeaning] = useState('');
  const [vocabAudio, setVocabAudio] = useState('');
  const [editingVocabId, setEditingVocabId] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // --- LANGUAGE ACTIONS ---
  const handleLangSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!langId || !langName || !langDesc || !langRegion) {
      setError('Semua kolom bahasa wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingLangId) {
        // Edit language
        const updated = await updateLanguageAction(editingLangId, {
          name: langName,
          description: langDesc,
          region: langRegion
        });
        setLanguages(languages.map(l => l.id === editingLangId ? updated : l));
        showSuccess('Bahasa daerah berhasil diperbarui');
        setEditingLangId(null);
      } else {
        // Add language
        const newLang = await addLanguageAction({
          id: langId.toLowerCase().trim(),
          name: langName,
          description: langDesc,
          region: langRegion
        });
        setLanguages([...languages, newLang]);
        showSuccess('Bahasa daerah berhasil ditambahkan');
      }

      // Reset Form
      setLangId('');
      setLangName('');
      setLangDesc('');
      setLangRegion('');
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan bahasa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditLang = (lang: Language) => {
    setEditingLangId(lang.id);
    setLangId(lang.id);
    setLangName(lang.name);
    setLangDesc(lang.description);
    setLangRegion(lang.region);
  };

  const handleDeleteLang = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus bahasa ini? Seluruh kosakata terkait juga akan terhapus secara otomatis!')) return;
    try {
      const ok = await deleteLanguageAction(id);
      if (ok) {
        setLanguages(languages.filter(l => l.id !== id));
        setVocabularies(vocabularies.filter(v => v.language_id !== id));
        showSuccess('Bahasa daerah berhasil dihapus');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus bahasa');
    }
  };

  const cancelLangEdit = () => {
    setEditingLangId(null);
    setLangId('');
    setLangName('');
    setLangDesc('');
    setLangRegion('');
  };

  // --- VOCABULARY ACTIONS ---
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size validation
    const MIN_SIZE = 10 * 1024; // 10KB
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    if (file.size < MIN_SIZE || file.size > MAX_SIZE) {
      setError('Ukuran audio minimal 10 KB dan maksimal 10 MB');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.url) {
        setVocabAudio(data.url);
        showSuccess('Audio pengucapan berhasil diunggah');
      } else {
        setError(data.error || 'Gagal mengunggah audio');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat mengunggah file audio');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVocabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vocabLangId || !vocabWord || !vocabMeaning) {
      setError('Bahasa, kosakata, dan arti wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingVocabId) {
        // Edit vocab
        const updated = await updateVocabularyAction(editingVocabId, {
          language_id: vocabLangId,
          word: vocabWord,
          meaning: vocabMeaning,
          audio_url: vocabAudio || undefined
        });
        setVocabularies(vocabularies.map(v => v.id === editingVocabId ? updated : v));
        showSuccess('Kosakata berhasil diperbarui');
        setEditingVocabId(null);
      } else {
        // Add vocab
        const newVocab = await addVocabularyAction({
          language_id: vocabLangId,
          word: vocabWord,
          meaning: vocabMeaning,
          audio_url: vocabAudio || undefined
        });
        setVocabularies([...vocabularies, newVocab]);
        showSuccess('Kosakata berhasil ditambahkan');
      }

      // Reset
      setVocabId('');
      setVocabWord('');
      setVocabMeaning('');
      setVocabAudio('');
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan kosakata');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVocab = (vocab: Vocabulary) => {
    setEditingVocabId(vocab.id);
    setVocabLangId(vocab.language_id);
    setVocabWord(vocab.word);
    setVocabMeaning(vocab.meaning);
    setVocabAudio(vocab.audio_url || '');
  };

  const handleDeleteVocab = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kosakata ini?')) return;
    try {
      const ok = await deleteVocabularyAction(id);
      if (ok) {
        setVocabularies(vocabularies.filter(v => v.id !== id));
        showSuccess('Kosakata berhasil dihapus');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus kosakata');
    }
  };

  const cancelVocabEdit = () => {
    setEditingVocabId(null);
    setVocabWord('');
    setVocabMeaning('');
    setVocabAudio('');
  };

  // Filter vocabularies table view
  const filteredVocabs = selectedLanguageFilter === 'all'
    ? vocabularies
    : vocabularies.filter(v => v.language_id === selectedLanguageFilter);

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="flex gap-4 border-b border-card-border/40 pb-4">
        <button
          onClick={() => { setActiveTab('languages'); setError(''); }}
          className={`pb-2 px-1 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'languages'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          Kelola Bahasa Daerah ({languages.length})
        </button>
        <button
          onClick={() => { setActiveTab('vocabularies'); setError(''); }}
          className={`pb-2 px-1 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'vocabularies'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          Kelola Kamus Kosakata ({vocabularies.length})
        </button>
      </div>

      {successMessage && (
        <div className="bg-secondary/10 border-l-4 border-secondary p-3 rounded-r-lg text-xs text-secondary font-semibold animate-pulse">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-accent/10 border-l-4 border-accent p-3 rounded-r-lg text-xs text-accent font-semibold">
          {error}
        </div>
      )}

      {/* --- SUB PANEL 1: LANGUAGES --- */}
      {activeTab === 'languages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Form Language Add/Edit */}
          <div className="lg:col-span-5 bg-card-bg border border-card-border/60 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-foreground">
              {editingLangId ? 'Sunting Bahasa Daerah' : 'Tambah Bahasa Daerah Baru'}
            </h3>
            
            <form onSubmit={handleLangSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-3xs font-bold text-muted uppercase tracking-wider">ID Bahasa *</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingLangId)}
                  placeholder="Contoh: ngaju, bakumpai, maanyan"
                  value={langId}
                  onChange={(e) => setLangId(e.target.value)}
                  className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none disabled:opacity-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-3xs font-bold text-muted uppercase tracking-wider">Nama Bahasa *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dayak Ngaju"
                  value={langName}
                  onChange={(e) => setLangName(e.target.value)}
                  className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-3xs font-bold text-muted uppercase tracking-wider">Wilayah Penuturan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sepanjang aliran sungai Kahayan"
                  value={langRegion}
                  onChange={(e) => setLangRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-3xs font-bold text-muted uppercase tracking-wider">Deskripsi Bahasa *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Jelaskan sejarah singkat, dialek, atau persebaran bahasa..."
                  value={langDesc}
                  onChange={(e) => setLangDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all"
                >
                  {isSubmitting ? 'Proses...' : (editingLangId ? 'Simpan Perubahan' : 'Tambah Bahasa')}
                </button>
                {editingLangId && (
                  <button
                    type="button"
                    onClick={cancelLangEdit}
                    className="px-3 py-2 rounded-lg border border-card-border hover:bg-accent/10 hover:text-accent hover:border-accent text-xs text-muted font-semibold transition-all"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Languages Table List */}
          <div className="lg:col-span-7 bg-card-bg border border-card-border/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-card-border/40 font-bold text-sm text-foreground">
              Daftar Bahasa Daerah
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-muted">
                <thead className="bg-background text-foreground/80 uppercase text-3xs font-bold border-b border-card-border">
                  <tr>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Wilayah</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/40">
                  {languages.map((lang) => (
                    <tr key={lang.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">{lang.name} <code className="bg-background text-primary px-1 rounded text-3xs font-mono">{lang.id}</code></td>
                      <td className="px-4 py-3 max-w-[150px] truncate">{lang.region}</td>
                      <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleEditLang(lang)}
                          className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLang(lang.id)}
                          className="px-2.5 py-1 rounded bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all font-semibold"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {languages.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-muted">Belum ada bahasa terdaftar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* --- SUB PANEL 2: VOCABULARIES --- */}
      {activeTab === 'vocabularies' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Vocabulary Add/Edit */}
          <div className="lg:col-span-5 bg-card-bg border border-card-border/60 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-foreground">
              {editingVocabId ? 'Sunting Kosakata Kamus' : 'Tambah Kosakata Baru'}
            </h3>
            
            <form onSubmit={handleVocabSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Bahasa Daerah *</label>
                <select
                  value={vocabLangId}
                  onChange={(e) => setVocabLangId(e.target.value)}
                  className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
                >
                  {languages.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                  {languages.length === 0 && <option value="">(Belum Ada Bahasa)</option>}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Kosakata Asli *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Itah"
                  value={vocabWord}
                  onChange={(e) => setVocabWord(e.target.value)}
                  className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Arti Bahasa Indonesia *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kita"
                  value={vocabMeaning}
                  onChange={(e) => setVocabMeaning(e.target.value)}
                  className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-2 border-t border-card-border/40 pt-4">
                <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Audio Pengucapan (Opsional)</label>
                <input
                  type="file"
                  accept="audio/mpeg,audio/mp3"
                  onChange={handleAudioUpload}
                  disabled={isUploading}
                  className="w-full text-2xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
                />
                <p className="text-4xs text-muted/70 mt-1">Format: MP3 saja (Maksimal 5 MB)</p>
                {isUploading && <p className="text-3xs text-primary animate-pulse">Mengunggah file audio...</p>}
                {vocabAudio && (
                  <div className="text-3xs text-muted flex items-center gap-1 mt-1">
                    <span className="font-semibold text-secondary">Audio tersedia:</span>
                    <span className="truncate max-w-[150px]">{vocabAudio}</span>
                    <button 
                      type="button" 
                      onClick={() => setVocabAudio('')}
                      className="text-accent hover:underline font-bold ml-2"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading || languages.length === 0}
                  className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Proses...' : (editingVocabId ? 'Simpan Perubahan' : 'Tambah Kosakata')}
                </button>
                {editingVocabId && (
                  <button
                    type="button"
                    onClick={cancelVocabEdit}
                    className="px-3 py-2 rounded-lg border border-card-border hover:bg-accent/10 hover:text-accent hover:border-accent text-xs text-muted font-semibold transition-all"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Vocabularies Table List */}
          <div className="lg:col-span-7 bg-card-bg border border-card-border/60 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-4 border-b border-card-border/40 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <span className="font-bold text-sm text-foreground">Daftar Kosakata Kamus</span>
                <select
                  value={selectedLanguageFilter}
                  onChange={(e) => setSelectedLanguageFilter(e.target.value)}
                  className="px-2 py-1 border border-card-border rounded bg-background text-3xs font-bold text-foreground focus:outline-none"
                >
                  <option value="all">Semua Bahasa</option>
                  {languages.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-muted">
                  <thead className="bg-background text-foreground/80 uppercase text-3xs font-bold border-b border-card-border">
                    <tr>
                      <th className="px-4 py-3">Kata</th>
                      <th className="px-4 py-3">Arti</th>
                      <th className="px-4 py-3">Bahasa</th>
                      <th className="px-4 py-3">Audio</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/40">
                    {filteredVocabs.map((vocab) => {
                      const lang = languages.find(l => l.id === vocab.language_id);
                      return (
                        <tr key={vocab.id} className="hover:bg-primary/5 transition-colors">
                          <td className="px-4 py-3 font-semibold text-foreground">{vocab.word}</td>
                          <td className="px-4 py-3">{vocab.meaning}</td>
                          <td className="px-4 py-3"><span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-3xs font-semibold">{lang ? lang.name : vocab.language_id}</span></td>
                          <td className="px-4 py-3">
                            {vocab.audio_url ? (
                              <span className="text-secondary font-bold text-3xs flex items-center gap-0.5">
                                🔊 Ya
                              </span>
                            ) : (
                              <span className="text-muted font-normal text-3xs">Tidak</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleEditVocab(vocab)}
                              className="px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-semibold text-3xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVocab(vocab.id)}
                              className="px-2 py-1 rounded bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all font-semibold text-3xs"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredVocabs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted">Belum ada kosakata di filter ini.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
