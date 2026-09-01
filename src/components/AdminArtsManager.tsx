'use client';

import { useState, useRef } from 'react';
import { ArtsCulture } from '@/lib/db';
import { addArtsCultureAction, updateArtsCultureAction, deleteArtsCultureAction } from '@/app/actions';

interface AdminArtsManagerProps {
  initialArts: ArtsCulture[];
}

export default function AdminArtsManager({ initialArts }: AdminArtsManagerProps) {
  const [arts, setArts] = useState<ArtsCulture[]>(initialArts);
  
  // Form State
  const [category, setCategory] = useState('Tari');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [originRegion, setOriginRegion] = useState('');
  const [meaning, setMeaning] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size validation
    const MIN_SIZE = 10 * 1024; // 10KB
    const MAX_SIZE = 500 * 1024; // 500KB

    if (file.size < MIN_SIZE || file.size > MAX_SIZE) {
      setError('Ukuran gambar minimal 10 KB dan maksimal 500 KB');
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
        setImageUrl(data.url);
        showSuccess('Foto berhasil diunggah');
      } else {
        setError(data.error || 'Gagal mengunggah foto');
      }
    } catch (err) {
      console.error(err);
      setError('Kesalahan koneksi saat mengunggah foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !originRegion || !meaning) {
      setError('Semua kolom bertanda bintang (*) wajib diisi');
      return;
    }

    if (name.length > 100) {
      setError('Nama kesenian maksimal 100 karakter');
      return;
    }

    if (originRegion.length > 100) {
      setError('Asal daerah maksimal 100 karakter');
      return;
    }

    if (meaning.length > 500) {
      setError('Makna filosofis maksimal 500 karakter');
      return;
    }

    if (description.length > 1000) {
      setError('Deskripsi kesenian maksimal 1000 karakter');
      return;
    }

    if (/[<>]/.test(name) || /[<>]/.test(description) || /[<>]/.test(originRegion) || /[<>]/.test(meaning)) {
      setError('Karakter < dan > tidak diperbolehkan pada kolom input');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingId) {
        const updated = await updateArtsCultureAction(editingId, {
          category,
          name,
          description,
          origin_region: originRegion,
          meaning,
          image_url: imageUrl || undefined
        });
        setArts(arts.map(a => a.id === editingId ? updated : a));
        showSuccess('Data kesenian berhasil diperbarui');
        setEditingId(null);
      } else {
        const newArt = await addArtsCultureAction({
          category,
          name,
          description,
          origin_region: originRegion,
          meaning,
          image_url: imageUrl || undefined
        });
        setArts([...arts, newArt]);
        showSuccess('Data kesenian berhasil ditambahkan');
      }

      // Reset
      setName('');
      setDescription('');
      setOriginRegion('');
      setMeaning('');
      setImageUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (art: ArtsCulture) => {
    setEditingId(art.id);
    setCategory(art.category);
    setName(art.name);
    setDescription(art.description);
    setOriginRegion(art.origin_region);
    setMeaning(art.meaning);
    setImageUrl(art.image_url || '');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kesenian ini?')) return;
    try {
      const ok = await deleteArtsCultureAction(id);
      if (ok) {
        setArts(arts.filter(a => a.id !== id));
        showSuccess('Kesenian berhasil dihapus');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus data');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setOriginRegion('');
    setMeaning('');
    setImageUrl('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Form Column */}
      <div className="lg:col-span-5 bg-card-bg border border-card-border/60 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-foreground">
          {editingId ? 'Sunting Kesenian' : 'Tambah Kesenian Baru'}
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
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Kategori Seni *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            >
              <option value="Tari">Seni Tari</option>
              <option value="Musik">Seni Musik / Lagu</option>
              <option value="Alat Musik">Alat Musik Tradisional</option>
              <option value="Pakaian Adat">Busana / Pakaian Adat</option>
              <option value="Kerajinan">Seni Kriya / Ukir / Anyam / Kerajinan</option>
              <option value="Kesenian Lainnya">Kesenian Lainnya</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Nama Karya Seni *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Tari Mandau"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Asal Wilayah/Kabupaten *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Barito Selatan"
              value={originRegion}
              onChange={(e) => setOriginRegion(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Nama Karya Seni / Tarian *</label>
              <span className="text-4xs text-muted/60">{name.length}/100</span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="Contoh: Tari Mandau, Garantung"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Asal Wilayah/Kabupaten *</label>
              <span className="text-4xs text-muted/60">{originRegion.length}/100</span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="Contoh: Barito Selatan"
              value={originRegion}
              onChange={(e) => setOriginRegion(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Filosofi & Makna Kebudayaan *</label>
              <span className="text-4xs text-muted/60">{meaning.length}/500</span>
            </div>
            <input
              type="text"
              required
              maxLength={500}
              placeholder="Jelaskan secara singkat makna dibalik kesenian ini..."
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Deskripsi Lengkap Kesenian *</label>
              <span className="text-4xs text-muted/60">{description.length}/1000</span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={1000}
              placeholder="Tuliskan latar belakang sejarah, alat/bahan yang digunakan, tata cara pertunjukan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2 border-t border-card-border/40 pt-4">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Foto Karya Seni (Opsional)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="w-full text-2xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
            />
            <p className="text-4xs text-muted/70 mt-1">Format: JPG, JPEG, PNG (Maksimal 500 KB)</p>
            {isUploading && <p className="text-3xs text-primary animate-pulse">Mengunggah gambar...</p>}
            {imageUrl && (
              <div className="flex gap-2 items-center justify-between bg-card-border/20 p-2 rounded-lg mt-2">
                <div className="flex gap-2 items-center">
                  <img src={imageUrl} alt="Art Preview" className="w-10 h-10 object-cover border border-card-border rounded" />
                  <span className="text-3xs text-muted truncate max-w-[140px]">{imageUrl.startsWith('data:') ? 'Foto Terunggah (Data)' : imageUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
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
              disabled={isSubmitting || isUploading}
              className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all"
            >
              {isSubmitting ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah Kesenian')}
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
          Daftar Seni & Kebudayaan
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted">
            <thead className="bg-background text-foreground/80 uppercase text-3xs font-bold border-b border-card-border">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Asal</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/40">
              {arts.map((art) => (
                <tr key={art.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{art.name}</td>
                  <td className="px-4 py-3"><span className="bg-secondary/10 text-secondary px-1.5 py-0.5 rounded text-3xs font-semibold">{art.category}</span></td>
                  <td className="px-4 py-3">{art.origin_region}</td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(art)}
                      className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-semibold text-3xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="px-2.5 py-1 rounded bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all font-semibold text-3xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {arts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">Belum ada kesenian terdaftar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
