'use client';

import { useState, useRef } from 'react';
import { Tradition } from '@/lib/db';
import { addTraditionAction, updateTraditionAction, deleteTraditionAction } from '@/app/actions';

interface AdminTraditionsManagerProps {
  initialTraditions: Tradition[];
}

export default function AdminTraditionsManager({ initialTraditions }: AdminTraditionsManagerProps) {
  const [trads, setTrads] = useState<Tradition[]>(initialTraditions);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [purpose, setPurpose] = useState('');
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
    if (!name || !description || !location || !purpose || !meaning) {
      setError('Semua kolom bertanda bintang (*) wajib diisi');
      return;
    }

    if (name.length > 100) {
      setError('Nama upacara/tradisi maksimal 100 karakter');
      return;
    }

    if (location.length > 100) {
      setError('Lokasi pelaksanaan maksimal 100 karakter');
      return;
    }

    if (purpose.length > 300) {
      setError('Tujuan & fungsi ritual maksimal 300 karakter');
      return;
    }

    if (meaning.length > 500) {
      setError('Makna filosofis tradisi maksimal 500 karakter');
      return;
    }

    if (description.length > 1000) {
      setError('Deskripsi detail kegiatan maksimal 1000 karakter');
      return;
    }

    if (/[<>]/.test(name) || /[<>]/.test(description) || /[<>]/.test(location) || /[<>]/.test(purpose) || /[<>]/.test(meaning)) {
      setError('Karakter < dan > tidak diperbolehkan pada kolom input');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingId) {
        const updated = await updateTraditionAction(editingId, {
          name,
          description,
          location,
          purpose,
          meaning,
          image_url: imageUrl || undefined
        });
        setTrads(trads.map(t => t.id === editingId ? updated : t));
        showSuccess('Data tradisi berhasil diperbarui');
        setEditingId(null);
      } else {
        const newTrad = await addTraditionAction({
          name,
          description,
          location,
          purpose,
          meaning,
          image_url: imageUrl || undefined
        });
        setTrads([...trads, newTrad]);
        showSuccess('Data tradisi baru berhasil ditambahkan');
      }

      // Reset
      setName('');
      setDescription('');
      setLocation('');
      setPurpose('');
      setMeaning('');
      setImageUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan tradisi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (trad: Tradition) => {
    setEditingId(trad.id);
    setName(trad.name);
    setDescription(trad.description);
    setLocation(trad.location);
    setPurpose(trad.purpose);
    setMeaning(trad.meaning);
    setImageUrl(trad.image_url || '');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tradisi adat ini?')) return;
    try {
      const ok = await deleteTraditionAction(id);
      if (ok) {
        setTrads(trads.filter(t => t.id !== id));
        showSuccess('Tradisi adat berhasil dihapus');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus tradisi');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setLocation('');
    setPurpose('');
    setMeaning('');
    setImageUrl('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Form Column */}
      <div className="lg:col-span-5 bg-card-bg border border-card-border/60 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-foreground">
          {editingId ? 'Sunting Tradisi Adat' : 'Tambah Tradisi Baru'}
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
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Nama Tradisi Upacara *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Upacara Tiwah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Lokasi Pelaksanaan *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Kabupaten Katingan"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Tujuan & Fungsi Ritual *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Mengantarkan arwah leluhur menuju Lewu Tatau..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Nama Upacara / Tradisi *</label>
              <span className="text-4xs text-muted/60">{name.length}/100</span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="Contoh: Upacara Tiwah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Lokasi Pelaksanaan *</label>
              <span className="text-4xs text-muted/60">{location.length}/100</span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="Contoh: Kabupaten Katingan"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Tujuan & Fungsi Ritual *</label>
              <span className="text-4xs text-muted/60">{purpose.length}/300</span>
            </div>
            <input
              type="text"
              required
              maxLength={300}
              placeholder="Contoh: Mengantarkan arwah leluhur menuju Lewu Tatau..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Makna Filosofis Tradisi *</label>
              <span className="text-4xs text-muted/60">{meaning.length}/500</span>
            </div>
            <input
              type="text"
              required
              maxLength={500}
              placeholder="Makna adat atau nilai kebersamaan..."
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Deskripsi Detail Kegiatan *</label>
              <span className="text-4xs text-muted/60">{description.length}/1000</span>
            </div>
            <textarea
              required
              rows={5}
              maxLength={1000}
              placeholder="Jelaskan proses pelaksanaan adat dari awal hingga akhir..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none text-xs"
            />
          </div>

          <div className="space-y-2 border-t border-card-border/40 pt-4">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Foto Dokumentasi (Opsional)</label>
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
                  <img src={imageUrl} alt="Trad Preview" className="w-10 h-10 object-cover border border-card-border rounded" />
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
              {isSubmitting ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah Tradisi')}
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
          Daftar Tradisi & Upacara Adat
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted">
            <thead className="bg-background text-foreground/80 uppercase text-3xs font-bold border-b border-card-border">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3">Foto</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/40">
              {trads.map((trad) => (
                <tr key={trad.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{trad.name}</td>
                  <td className="px-4 py-3">{trad.location}</td>
                  <td className="px-4 py-3">
                    {trad.image_url ? (
                      <span className="text-secondary font-bold text-3xs">Ya</span>
                    ) : (
                      <span className="text-muted text-3xs">Tidak</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(trad)}
                      className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-semibold text-3xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(trad.id)}
                      className="px-2.5 py-1 rounded bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all font-semibold text-3xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {trads.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">Belum ada tradisi adat terdaftar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
