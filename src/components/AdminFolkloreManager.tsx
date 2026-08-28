'use client';

import { useState } from 'react';
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

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan cerita');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (story: Folklore) => {
    setEditingId(story.id);
    setTitle(story.title);
    setContent(story.content);
    setRegion(story.region);
    setImageUrl(story.image_url || '');
    setAudioUrl(story.audio_url || '');
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
      setError(err.message || 'Gagal menghapus cerita');
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
          {editingId ? 'Sunting Cerita Rakyat' : 'Tambah Cerita Rakyat Baru'}
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
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Judul Cerita *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Legenda Bukit Tangkiling"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Asal Kabupaten/Kota *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Kota Palangka Raya"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Isi Cerita Lengkap *</label>
            <textarea
              required
              rows={8}
              placeholder="Tuliskan cerita rakyat atau dongeng..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none font-sans leading-relaxed text-xs"
            />
          </div>

          <div className="space-y-2 border-t border-card-border/40 pt-4">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Foto Ilustrasi (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'image_url')}
              disabled={isUploading !== null}
              className="w-full text-2xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
            />
            {isUploading === 'image_url' && <p className="text-3xs text-primary animate-pulse">Mengunggah gambar...</p>}
            {imageUrl && (
              <div className="flex gap-2 items-center mt-2">
                <img src={imageUrl} alt="Folk Preview" className="w-12 h-12 object-cover border border-card-border rounded" />
                <span className="text-3xs text-muted truncate max-w-[120px]">{imageUrl}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-card-border/40 pt-4">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Narasi Audio (Opsional)</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => handleFileUpload(e, 'audio_url')}
              disabled={isUploading !== null}
              className="w-full text-2xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
            />
            {isUploading === 'audio_url' && <p className="text-3xs text-primary animate-pulse">Mengunggah audio...</p>}
            {audioUrl && (
              <div className="text-3xs text-muted flex items-center gap-1 mt-1">
                <span className="font-semibold text-secondary">Audio tersedia:</span>
                <span className="truncate max-w-[120px]">{audioUrl}</span>
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
