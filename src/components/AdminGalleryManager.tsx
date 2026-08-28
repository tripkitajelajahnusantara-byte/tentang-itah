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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !mediaUrl) {
      setError('Judul dan file media wajib diisi');
      return;
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
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item galeri ini?')) return;
    try {
      const ok = await deleteGalleryAction(id);
      if (ok) {
        setItems(items.filter(i => i.id !== id));
        showSuccess('Item galeri berhasil dihapus');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus data');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setType('image');
    setMediaUrl('');
    setDescription('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
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
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Judul Media *</label>
            <input
              type="text"
              required
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
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            >
              <option value="image">Gambar / Foto</option>
              <option value="video">Rekaman Video</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Keterangan / Kapsi</label>
            <textarea
              rows={3}
              placeholder="Tuliskan keterangan detail foto/video..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2 border-t border-card-border/40 pt-4">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Unggah Berkas Media *</label>
            <input
              type="file"
              accept={type === 'image' ? 'image/*' : 'video/*'}
              onChange={handleFileUpload}
              disabled={isUploading}
              className="w-full text-2xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
            />
            {isUploading && <p className="text-3xs text-primary animate-pulse">Mengunggah media...</p>}
            {mediaUrl && (
              <div className="flex gap-2 items-center mt-2">
                {type === 'image' ? (
                  <img src={mediaUrl} alt="Preview" className="w-12 h-12 object-cover border border-card-border rounded" />
                ) : (
                  <div className="w-12 h-12 bg-black rounded flex items-center justify-center text-white text-3xs font-bold">🎬 Video</div>
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
  );
}
