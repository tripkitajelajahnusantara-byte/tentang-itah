'use client';

import { useState, useRef } from 'react';
import { Folklore } from '@/lib/db';
import { addFolkloreAction, updateFolkloreAction, deleteFolkloreAction } from '@/app/actions';

interface AdminFolkloreManagerProps {
  initialStories: Folklore[];
}

export default function AdminFolkloreManager({ initialStories }: AdminFolkloreManagerProps) {
  const [stories, setStories] = useState<Folklore[]>(initialStories);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [region, setRegion] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size validation
    const MIN_SIZE = 10 * 1024; // 10KB
    const MAX_IMAGE_SIZE = 500 * 1024; // 500KB
    const MAX_AUDIO_SIZE = 5 * 1024 * 1024; // 5MB

    if (fieldName === 'image_url') {
      if (file.size < MIN_SIZE || file.size > MAX_IMAGE_SIZE) {
        setError('Ukuran gambar minimal 10 KB dan maksimal 500 KB');
        return;
      }
    } else if (fieldName === 'audio_url') {
      if (file.size < MIN_SIZE || file.size > MAX_AUDIO_SIZE) {
        setError('Ukuran audio minimal 10 KB dan maksimal 5 MB');
        return;
      }
    }

    setIsUploading(fieldName);
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
        if (fieldName === 'image_url') setImageUrl(data.url);
        if (fieldName === 'audio_url') setAudioUrl(data.url);
        showSuccess(`${fieldName === 'image_url' ? 'Gambar' : 'Audio'} berhasil diunggah`);
      } else {
        setError(data.error || 'Gagal mengunggah berkas');
      }
    } catch (err) {
      console.error(err);
      setError('Kesalahan koneksi saat mengunggah berkas');
    } finally {
      setIsUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !region) {
      setError('Judul, isi cerita, dan asal daerah wajib diisi');
      return;
    }

    if (title.length > 100) {
      setError('Judul cerita maksimal 100 karakter');
      return;
    }

    if (region.length > 100) {
      setError('Asal daerah maksimal 100 karakter');
      return;
    }

    if (content.length > 2000) {
      setError('Isi narasi cerita maksimal 2000 karakter');
      return;
    }

    if (/[<>]/.test(title) || /[<>]/.test(content) || /[<>]/.test(region)) {
      setError('Karakter < dan > tidak diperbolehkan pada kolom input');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingId) {
        const updated = await updateFolkloreAction(editingId, {
          title,
          content,
          region,
          image_url: imageUrl || undefined,
          audio_url: audioUrl || undefined
        });
        setStories(stories.map(s => s.id === editingId ? updated : s));
        showSuccess('Cerita rakyat berhasil diperbarui');
        setEditingId(null);
      } else {
        const newStory = await addFolkloreAction({
          title,
          content,
          region,
          image_url: imageUrl || undefined,
          audio_url: audioUrl || undefined
        });
        setStories([...stories, newStory]);
        showSuccess('Cerita rakyat berhasil ditambahkan');
      }

      // Reset
      setTitle('');
      setContent('');
      setRegion('');
      setImageUrl('');
      setAudioUrl('');
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (audioInputRef.current) audioInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan cerita rakyat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (folk: Folklore) => {
    setEditingId(folk.id);
    setTitle(folk.title);
    setContent(folk.content);
    setRegion(folk.region);
    setImageUrl(folk.image_url || '');
    setAudioUrl(folk.audio_url || '');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus cerita rakyat ini?')) return;
    try {
      const ok = await deleteFolkloreAction(id);
      if (ok) {
        setStories(stories.filter(s => s.id !== id));
        showSuccess('Cerita rakyat berhasil dihapus');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus data');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setRegion('');
    setImageUrl('');
    setAudioUrl('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Form Column */}
      <div className="lg:col-span-5 bg-card-bg border border-card-border/60 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-foreground">
          {editingId ? 'Sunting Cerita Rakyat' : 'Tambah Cerita Baru'}
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
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Judul Dongeng *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Asal Usul Danau Malawen"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Asal Daerah Cerita *</label>
              <span className="text-4xs text-muted/60">{region.length}/100</span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="Contoh: Barito Selatan"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Isi Narasi Cerita *</label>
              <span className="text-4xs text-muted/60">{content.length}/2000</span>
            </div>
            <textarea
              required
              rows={6}
              maxLength={2000}
              placeholder="Tuliskan kisah lengkap dongeng di sini..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none text-xs"
            />
          </div>

          <div className="space-y-2 border-t border-card-border/40 pt-4">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Foto Ilustrasi Cerita (Opsional)</label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) => handleFileUpload(e, 'image_url')}
              disabled={isUploading !== null}
              className="w-full text-2xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
            />
            <p className="text-4xs text-muted/70 mt-1">Format: JPG, JPEG, PNG (Maksimal 500 KB)</p>
            {isUploading === 'image_url' && <p className="text-3xs text-primary animate-pulse">Mengunggah gambar...</p>}
            {imageUrl && (
              <div className="flex gap-2 items-center justify-between bg-card-border/20 p-2 rounded-lg mt-2">
                <div className="flex gap-2 items-center">
                  <img src={imageUrl} alt="Preview" className="w-10 h-10 object-cover border border-card-border rounded" />
                  <span className="text-3xs text-muted truncate max-w-[140px]">{imageUrl.startsWith('data:') ? 'Foto Terunggah (Data)' : imageUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    if (imageInputRef.current) imageInputRef.current.value = '';
                  }}
                  className="px-2 py-1 text-3xs font-semibold rounded bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all cursor-pointer"
                >
                  Hapus / Batal
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-card-border/40 pt-2">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Audio Narasi Dongeng (Opsional)</label>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/mpeg,audio/mp3"
              onChange={(e) => handleFileUpload(e, 'audio_url')}
              disabled={isUploading !== null}
              className="w-full text-2xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
            />
            <p className="text-4xs text-muted/70 mt-1">Format: MP3 (Maksimal 5 MB)</p>
            {isUploading === 'audio_url' && <p className="text-3xs text-primary animate-pulse">Mengunggah audio...</p>}
            {audioUrl && (
              <div className="flex gap-2 items-center justify-between bg-card-border/20 p-2 rounded-lg mt-2">
                <div className="text-3xs text-muted flex items-center gap-1">
                  <span className="font-semibold text-secondary">Audio:</span>
                  <span className="truncate max-w-[140px]">{audioUrl.startsWith('data:') ? 'Audio Terunggah (Data)' : audioUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAudioUrl('');
                    if (audioInputRef.current) audioInputRef.current.value = '';
                  }}
                  className="px-2 py-1 text-3xs font-semibold rounded bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all cursor-pointer"
                >
                  Hapus / Batal
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isUploading !== null}
              className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all"
            >
              {isSubmitting ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah Cerita')}
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
          Daftar Cerita Rakyat & Legenda
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted">
            <thead className="bg-background text-foreground/80 uppercase text-3xs font-bold border-b border-card-border">
              <tr>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Daerah</th>
                <th className="px-4 py-3">Audio</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/40">
              {stories.map((story) => (
                <tr key={story.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{story.title}</td>
                  <td className="px-4 py-3">{story.region}</td>
                  <td className="px-4 py-3">
                    {story.audio_url ? (
                      <span className="text-secondary font-bold text-3xs">🔊 Ya</span>
                    ) : (
                      <span className="text-muted text-3xs">Tidak</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(story)}
                      className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-semibold text-3xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="px-2.5 py-1 rounded bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all font-semibold text-3xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {stories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">Belum ada cerita rakyat terdaftar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
