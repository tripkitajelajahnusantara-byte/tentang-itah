'use client';

import { useState, useRef } from 'react';
import { Region } from '@/lib/db';
import { addRegionAction, updateRegionAction, deleteRegionAction } from '@/app/actions';

interface AdminRegionManagerProps {
  initialRegions: Region[];
}

export default function AdminRegionManager({ initialRegions }: AdminRegionManagerProps) {
  const [regions, setRegions] = useState<Region[]>(initialRegions);
  
  // Form State
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [locationInfo, setLocationInfo] = useState('');
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
    if (!id || !name || !description || !locationInfo) {
      setError('ID, nama, deskripsi, dan info lokasi wajib diisi');
      return;
    }

    if (name.length > 100) {
      setError('Nama kabupaten/kota maksimal 100 karakter');
      return;
    }

    if (locationInfo.length > 100) {
      setError('Lokasi/bagian provinsi maksimal 100 karakter');
      return;
    }

    if (description.length > 1000) {
      setError('Deskripsi kebudayaan & geografis maksimal 1000 karakter');
      return;
    }

    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(id)) {
      setError('ID Slug Daerah hanya boleh berisi huruf kecil, angka, dan tanda hubung (-). Tanpa spasi atau karakter spesial.');
      return;
    }

    if (/[<>]/.test(name) || /[<>]/.test(description) || /[<>]/.test(locationInfo)) {
      setError('Karakter < dan > tidak diperbolehkan pada kolom input');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingId) {
        const updated = await updateRegionAction(editingId, {
          id: id.toLowerCase().trim(),
          name,
          description,
          location_info: locationInfo,
          image_url: imageUrl || undefined
        });
        setRegions(regions.map(r => r.id === editingId ? updated : r));
        showSuccess('Informasi wilayah berhasil diperbarui');
        setEditingId(null);
      } else {
        const newReg = await addRegionAction({
          id: id.toLowerCase().trim(),
          name,
          description,
          location_info: locationInfo,
          image_url: imageUrl || undefined
        });
        setRegions([...regions, newReg]);
        showSuccess('Wilayah baru berhasil ditambahkan');
      }

      // Reset
      setId('');
      setName('');
      setDescription('');
      setLocationInfo('');
      setImageUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan wilayah');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (reg: Region) => {
    setEditingId(reg.id);
    setId(reg.id);
    setName(reg.name);
    setDescription(reg.description);
    setLocationInfo(reg.location_info);
    setImageUrl(reg.image_url || '');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus wilayah ini?')) return;
    try {
      await deleteRegionAction(id);
      setRegions(regions.filter(r => r.id !== id));
      showSuccess('Wilayah berhasil dihapus');
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus wilayah');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setId('');
    setName('');
    setDescription('');
    setLocationInfo('');
    setImageUrl('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-bold text-foreground">Kelola Jelajah Daerah</h2>
        <p className="text-xs text-muted">
          Sunting deskripsi kebudayaan, potensi kerajinan, dan foto cagar alam untuk 13 kabupaten dan 1 kota di Kalimantan Tengah.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Form Column */}
      <div className="lg:col-span-5 bg-card-bg border border-card-border/60 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-foreground">
          {editingId ? 'Sunting Data Wilayah' : 'Tambah Daerah Baru'}
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
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">ID Slug Daerah *</label>
              <span className="text-4xs text-muted/60">{id.length}/50</span>
            </div>
            <input
              type="text"
              required
              maxLength={50}
              placeholder="Contoh: baritoutara, kotawaringinbarat"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Nama Lengkap Kabupaten/Kota *</label>
              <span className="text-4xs text-muted/60">{name.length}/100</span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="Contoh: Kabupaten Barito Utara"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Lokasi / Bagian Provinsi *</label>
              <span className="text-4xs text-muted/60">{locationInfo.length}/100</span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="Contoh: Bagian Timur Kalteng"
              value={locationInfo}
              onChange={(e) => setLocationInfo(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Deskripsi Kebudayaan & Geografis *</label>
              <span className="text-4xs text-muted/60">{description.length}/1000</span>
            </div>
            <textarea
              required
              rows={6}
              maxLength={1000}
              placeholder="Jelaskan karakteristik cagar alam, industri kerajinan khas, atau jejak kebudayaan daerah..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none text-xs"
            />
          </div>

          <div className="space-y-2 border-t border-card-border/40 pt-4">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Foto Daerah (Opsional)</label>
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
                  <img src={imageUrl} alt="Reg Preview" className="w-10 h-10 object-cover border border-card-border rounded" />
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
              {isSubmitting ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah Daerah')}
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
          Daftar Kabupaten & Kota
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted">
            <thead className="bg-background text-foreground/80 uppercase text-3xs font-bold border-b border-card-border">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3">ID Slug</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/40">
              {regions.map((reg) => (
                <tr key={reg.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{reg.name}</td>
                  <td className="px-4 py-3">{reg.location_info}</td>
                  <td className="px-4 py-3"><code className="bg-background text-primary px-1 rounded text-3xs font-mono">{reg.id}</code></td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(reg)}
                      className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-semibold text-3xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reg.id)}
                      className="px-2.5 py-1 rounded bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all font-semibold text-3xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {regions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">Belum ada wilayah terdaftar.</td>
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
