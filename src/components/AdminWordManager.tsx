'use client';

import { useState } from 'react';
import { WordOfTheDay } from '@/lib/db';
import { addWordOfTheDayAction, updateWordOfTheDayAction, deleteWordOfTheDayAction } from '@/app/actions';

interface AdminWordManagerProps {
  initialWords: WordOfTheDay[];
}

export default function AdminWordManager({ initialWords }: AdminWordManagerProps) {
  const [words, setWords] = useState<WordOfTheDay[]>(initialWords);
  
  // Form State
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [languageName, setLanguageName] = useState('Dayak Ngaju');
  const [audioUrl, setAudioUrl] = useState('');
  const [displayDate, setDisplayDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size validation
    const MIN_SIZE = 10 * 1024; // 10KB
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size < MIN_SIZE || file.size > MAX_SIZE) {
      setError('Ukuran audio minimal 10 KB dan maksimal 5 MB');
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
        setAudioUrl(data.url);
        showSuccess('Audio pelafalan berhasil diunggah');
      } else {
        setError(data.error || 'Gagal mengunggah audio');
      }
    } catch (err) {
      console.error(err);
      setError('Kesalahan koneksi saat mengunggah file audio');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !meaning || !languageName || !displayDate) {
      setError('Kata, arti, rumpun bahasa, dan tanggal wajib diisi');
      return;
    }

    const wordRegex = /^[a-zA-Z\s'-]+$/;
    if (!wordRegex.test(word)) {
      setError('Kata hanya boleh berisi huruf, spasi, tanda hubung (-), dan tanda petik (\')');
      return;
    }

    if (/[<>]/.test(meaning) || /[<>]/.test(languageName)) {
      setError('Karakter < dan > tidak diperbolehkan pada kolom input');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingId) {
        const updated = await updateWordOfTheDayAction(editingId, {
          word,
          meaning,
          language_name: languageName,
          audio_url: audioUrl || undefined,
          display_date: displayDate
        });
        setWords(words.map(w => w.id === editingId ? updated : w));
        showSuccess('Kosakata harian berhasil diperbarui');
        setEditingId(null);
      } else {
        const newWotd = await addWordOfTheDayAction({
          word,
          meaning,
          language_name: languageName,
          audio_url: audioUrl || undefined,
          display_date: displayDate
        });
        setWords([...words, newWotd]);
        showSuccess('Kosakata harian berhasil ditambahkan');
      }

      // Reset
      setWord('');
      setMeaning('');
      setLanguageName('Dayak Ngaju');
      setAudioUrl('');
      setDisplayDate(new Date().toISOString().split('T')[0]);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan kosakata');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (wotd: WordOfTheDay) => {
    setEditingId(wotd.id);
    setWord(wotd.word);
    setMeaning(wotd.meaning);
    setLanguageName(wotd.language_name);
    setAudioUrl(wotd.audio_url || '');
    setDisplayDate(wotd.display_date);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kosakata harian ini?')) return;
    try {
      const ok = await deleteWordOfTheDayAction(id);
      if (ok) {
        setWords(words.filter(w => w.id !== id));
        showSuccess('Kosakata harian berhasil dihapus');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus data');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setWord('');
    setMeaning('');
    setAudioUrl('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Form Column */}
      <div className="lg:col-span-5 bg-card-bg border border-card-border/60 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-foreground">
          {editingId ? 'Sunting Kosakata Harian' : 'Jadwalkan Kosakata Harian'}
        </h3>

        {success && (
          <div className="bg-secondary/10 border-l-4 border-secondary p-3 rounded-r-lg text-xs text-secondary font-semibold animate-pulse">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-accent/10 border-l-4 border-accent p-3 rounded-r-lg text-xs text-accent font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Tanggal Tayang *</label>
            <input
              type="date"
              required
              value={displayDate}
              onChange={(e) => setDisplayDate(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Kosakata Asli *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Danum"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Rumpun Bahasa / Dialek *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Dayak Ngaju, Dayak Bakumpai"
              value={languageName}
              onChange={(e) => setLanguageName(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Arti Terjemahan *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Air"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-2 border-t border-card-border/40 pt-4">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Unggah Audio Pelafalan (Opsional)</label>
            <input
              type="file"
              accept="audio/mpeg,audio/mp3"
              onChange={handleAudioUpload}
              disabled={isUploading}
              className="w-full text-2xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
            />
            <p className="text-4xs text-muted/70 mt-1">Format: MP3 saja (Maksimal 5 MB)</p>
            {isUploading && <p className="text-3xs text-primary animate-pulse">Mengunggah audio...</p>}
            {audioUrl && (
              <div className="text-3xs text-muted flex items-center gap-1 mt-1">
                <span className="font-semibold text-secondary">Audio aktif:</span>
                <span className="truncate max-w-[120px]">{audioUrl}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all"
            >
              {isSubmitting ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Jadwalkan Kata')}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-3 py-2 rounded-lg border border-card-border hover:bg-accent/10 hover:text-accent hover:border-accent text-xs text-muted font-semibold transition-all"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Column */}
      <div className="lg:col-span-7 bg-card-bg border border-card-border/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-card-border/40 font-bold text-sm text-foreground">
          Daftar Jadwal Kosakata Harian
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted">
            <thead className="bg-background text-foreground/80 uppercase text-3xs font-bold border-b border-card-border">
              <tr>
                <th className="px-4 py-3">Tanggal Tampil</th>
                <th className="px-4 py-3">Kata</th>
                <th className="px-4 py-3">Arti</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/40">
              {[...words].sort((a, b) => new Date(b.display_date).getTime() - new Date(a.display_date).getTime()).map((wotd) => (
                <tr key={wotd.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{wotd.display_date}</td>
                  <td className="px-4 py-3 text-primary font-bold">{wotd.word} <span className="text-3xs text-muted font-normal">({wotd.language_name})</span></td>
                  <td className="px-4 py-3">{wotd.meaning}</td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(wotd)}
                      className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-semibold text-3xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(wotd.id)}
                      className="px-2.5 py-1 rounded bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all font-semibold text-3xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {words.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">Belum ada kosakata harian dijadwalkan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
