'use client';

import { useState } from 'react';
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
      setError('Seluruh kolom wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingId) {
        const updated = await updateTransition(editingId);
        setTrads(trads.map(t => t.id === editingId ? updated : t));
        showSuccess('Tradisi adat berhasil diperbarui');
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
        showSuccess('Tradisi adat berhasil ditambahkan');
      }

      // Reset
      setName('');
      setDescription('');
      setLocation('');
      setPurpose('');
      setMeaning('');
      setImageUrl('');
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan tradisi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTransition = async (id: string) => {
    return await updateTraditionAction(id, {
      name,
      description,
      location,
      purpose,
      meaning,
      image_url: imageUrl || undefined
    });
  };

  const handleEdit = (trad: Tradition) => {
    setEditingId(trad.id);
    setName(trad.name);
    setDescription(trad.description);
    setLocation(trad.location);
    setPurpose(trad.purpose);
    setMeaning(trad.meaning);
    setImageUrl(trad.image_url || '');
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
          {editingId ? 'Sunting Tradisi Adat' : 'Tambah Tradisi Adat Baru'}
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
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Nama Upacara/Tradisi *</label>
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
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Lokasi Penyelenggaraan *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Kabupaten Gunung Mas"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Tujuan Utama Tradisi *</label>
            <textarea
              required
              rows={2}
              placeholder="Tujuan upacara..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Deskripsi Lengkap *</label>
            <textarea
              required
              rows={4}
              placeholder="Uraikan prosesi adat secara lengkap..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Makna Filosofis *</label>
            <textarea
              required
              rows={3}
              placeholder="Nilai moral/filosofis adat..."
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-2 border-t border-card-border/40 pt-4">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Foto Pendukung (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="w-full text-2xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
            />
            {isUploading && <p className="text-3xs text-primary animate-pulse">Mengunggah gambar...</p>}
            {imageUrl && (
              <div className="flex gap-2 items-center mt-2">
                <img src={imageUrl} alt="Trad Preview" className="w-12 h-12 object-cover border border-card-border rounded" />
                <span className="text-3xs text-muted truncate max-w-[120px]">{imageUrl}</span>
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
