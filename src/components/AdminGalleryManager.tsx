'use client';

import { useState } from 'react';
import { Gallery } from '@/lib/db';
import { addGalleryAction, updateGalleryAction, deleteGalleryAction } from '@/app/actions';

interface AdminGalleryManagerProps {
  initialItems: Gallery[];
}

export default function AdminGalleryManager({ initialItems }: AdminGalleryManagerProps) {
  const [items, setItems] = useState<Gallery[]>(initialItems);
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [description, setDescription] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size validation
    const MIN_SIZE = 10 * 1024; // 10KB
    const MAX_IMAGE_SIZE = 500 * 1024; // 500KB
    const MAX_VIDEO_SIZE = 4 * 1024 * 1024; // 4MB

    const isImageFile = file.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(file.name);
    const isVideoFile = file.type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(file.name);

    if (isImageFile) {
      if (file.size < MIN_SIZE || file.size > MAX_IMAGE_SIZE) {
        setError('Ukuran gambar minimal 10 KB dan maksimal 500 KB');
        return;
      }
    } else if (isVideoFile) {
      if (file.size < MIN_SIZE || file.size > MAX_VIDEO_SIZE) {
        setError('Ukuran video minimal 10 KB dan maksimal 4 MB');
        return;
      }
    } else {
      setError('Format berkas tidak didukung. Hanya gambar (JPG, JPEG, PNG) dan video (MP4, WEBM, MOV) yang diperbolehkan');
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
        setMediaUrl(data.url);
        showSuccess('File media berhasil diunggah');
      } else {
        setError(data.error || 'Gagal mengunggah berkas');
      }
    } catch (err) {
      console.error(err);
      setError('Kesalahan koneksi saat mengunggah berkas');
    } finally {
      setIsUploading(false);
    }
  };

  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !mediaUrl) {
      setError('Judul dan file/link media wajib diisi');
      return;
    }

    if (title.length > 100) {
      setError('Judul media maksimal 100 karakter');
      return;
    }

    if (description && description.length > 500) {
      setError('Keterangan media maksimal 500 karakter');
      return;
    }

    if (/[<>]/.test(title) || /[<>]/.test(description)) {
      setError('Karakter < dan > tidak diperbolehkan pada kolom input');
      return;
    }

    if (type === 'video') {
      const ytId = getYouTubeId(mediaUrl);
      if (!ytId) {
        setError('Tautan video harus berupa link YouTube yang valid (watch?v=... atau youtu.be/...)');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingId) {
        const updated = await updateGalleryAction(editingId, {
          title,
          type,
          media_url: mediaUrl,
          description: description || undefined
        });
        setItems(items.map(i => i.id === editingId ? updated : i));
        showSuccess('Item galeri berhasil diperbarui');
        setEditingId(null);
      } else {
        const newItem = await addGalleryAction({
          title,
          type,
          media_url: mediaUrl,
          description: description || undefined
        });
        setItems([...items, newItem]);
        showSuccess('Item galeri berhasil ditambahkan');
      }

      // Reset
      setTitle('');
      setType('image');
      setMediaUrl('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan item galeri');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: Gallery) => {
    setEditingId(item.id);
    setTitle(item.title);
    setType(item.type);
    setMediaUrl(item.media_url);
    setDescription(item.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setType('image');
    setMediaUrl('');
    setDescription('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item galeri ini?')) return;
    try {
      await deleteGalleryAction(id);
      setItems(items.filter(i => i.id !== id));
      showSuccess('Item galeri berhasil dihapus');
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus item galeri');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-bold text-foreground">Kelola Galeri Media</h2>
        <p className="text-xs text-muted">
          Tambahkan foto dokumentasi (JPG/PNG max 500KB) atau video dokumentasi budaya dari tautan YouTube.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Form Column */}
      <div className="lg:col-span-5 bg-card-bg border border-card-border/60 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-foreground">
          {editingId ? 'Sunting Item Galeri' : 'Tambah Item Galeri Baru'}
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
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Judul Media *</label>
              <span className="text-4xs text-muted/60">{title.length}/100</span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="Contoh: Upacara Tiwah di Kurun"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Jenis Berkas *</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as any);
                setMediaUrl(''); // Reset url on type change to avoid cross-upload pollution
              }}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            >
              <option value="image">Gambar / Foto</option>
              <option value="video">Rekaman Video</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Keterangan / Kapsi</label>
              <span className="text-4xs text-muted/60">{description.length}/500</span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              placeholder="Tuliskan keterangan detail foto/video..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2 border-t border-card-border/40 pt-4">
            {type === 'image' ? (
              <>
                <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Unggah Berkas Gambar *</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="w-full text-2xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer disabled:opacity-50"
                />
                <p className="text-4xs text-muted/70 mt-1">Format: JPG, JPEG, PNG (Maksimal 500 KB)</p>
                {isUploading && <p className="text-3xs text-primary animate-pulse">Mengunggah media...</p>}
              </>
            ) : (
              <>
                <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Tautan Video YouTube *</label>
                <input
                  type="url"
                  required
                  placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
                />
                <p className="text-4xs text-muted/70 mt-1">Masukkan tautan lengkap video YouTube (watch?v=... atau youtu.be/...)</p>
              </>
            )}

            {mediaUrl && (
              <div className="flex gap-2 items-center mt-2">
                {type === 'image' ? (
                  <img src={mediaUrl} alt="Preview" className="w-12 h-12 object-cover border border-card-border rounded" />
                ) : (
                  (() => {
                    const ytId = getYouTubeId(mediaUrl);
                    return ytId ? (
                      <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="YT Preview" className="w-12 h-12 object-cover border border-card-border rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-black rounded flex items-center justify-center text-white text-3xs font-bold">🎬 Video</div>
                    );
                  })()
                )}
                <span className="text-3xs text-muted truncate max-w-[120px]">{mediaUrl}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all"
            >
              {isSubmitting ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah Media')}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
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
          Daftar Media Galeri
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted">
            <thead className="bg-background text-foreground/80 uppercase text-3xs font-bold border-b border-card-border">
              <tr>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Jenis</th>
                <th className="px-4 py-3">File Path</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/40">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{item.title}</td>
                  <td className="px-4 py-3"><span className={`px-1.5 py-0.5 rounded text-3xs font-bold uppercase ${
                    item.type === 'video' ? 'bg-amber-500/10 text-amber-600' : 'bg-secondary/10 text-secondary'
                  }`}>{item.type === 'video' ? 'Video' : 'Foto'}</span></td>
                  <td className="px-4 py-3 truncate max-w-[120px]">{item.media_url}</td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-semibold text-3xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2.5 py-1 rounded bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all font-semibold text-3xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">Belum ada item galeri terdaftar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      </div>
    </div>
  );
}
