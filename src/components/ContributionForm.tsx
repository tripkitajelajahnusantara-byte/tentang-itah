'use client';

import { useState, useRef } from 'react';
import { submitContributionAction } from '@/app/actions';

export default function ContributionForm() {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [category, setCategory] = useState('Cerita Rakyat');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  
  const [isUploading, setIsUploading] = useState<'image' | 'audio' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const [audioError, setAudioError] = useState('');
  const [success, setSuccess] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size and format validation
    const MIN_SIZE = 10 * 1024; // 10KB
    const MAX_SIZE = 500 * 1024; // 500KB
    const fileName = file.name.toLowerCase();
    const isAllowedExt = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png');
    const isAllowedType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';

    if (!isAllowedExt && !isAllowedType) {
      setImageError('Format gambar harus JPG, JPEG, atau PNG');
      if (imageInputRef.current) imageInputRef.current.value = '';
      return;
    }

    if (file.size < MIN_SIZE || file.size > MAX_SIZE) {
      setImageError('Ukuran gambar minimal 10 KB dan maksimal 500 KB');
      if (imageInputRef.current) imageInputRef.current.value = '';
      return;
    }

    setIsUploading('image');
    setImageError('');
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
      } else {
        setImageError(data.error || 'Gagal mengunggah foto');
        if (imageInputRef.current) imageInputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
      setImageError('Terjadi kesalahan saat mengunggah berkas');
      if (imageInputRef.current) imageInputRef.current.value = '';
    } finally {
      setIsUploading(null);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size and format validation
    const MIN_SIZE = 10 * 1024; // 10KB
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const fileName = file.name.toLowerCase();
    const isAllowedExt = fileName.endsWith('.mp3');
    const isAllowedType = file.type === 'audio/mpeg' || file.type === 'audio/mp3';

    if (!isAllowedExt && !isAllowedType) {
      setAudioError('Format audio harus MP3');
      if (audioInputRef.current) audioInputRef.current.value = '';
      return;
    }

    if (file.size < MIN_SIZE || file.size > MAX_SIZE) {
      setAudioError('Ukuran audio minimal 10 KB dan maksimal 5 MB');
      if (audioInputRef.current) audioInputRef.current.value = '';
      return;
    }

    setIsUploading('audio');
    setAudioError('');
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
      } else {
        setAudioError(data.error || 'Gagal mengunggah audio');
        if (audioInputRef.current) audioInputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
      setAudioError('Terjadi kesalahan saat mengunggah berkas');
      if (audioInputRef.current) audioInputRef.current.value = '';
    } finally {
      setIsUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderName || !senderEmail || !title || !description) {
      setError('Semua bidang wajib diisi (kecuali lampiran foto/audio)');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await submitContributionAction({
        sender_name: senderName,
        sender_email: senderEmail,
        category,
        title,
        description,
        image_url: imageUrl || undefined,
        audio_url: audioUrl || undefined,
      });

      if (result) {
        setSuccess(true);
        // Clear fields
        setSenderName('');
        setSenderEmail('');
        setCategory('Cerita Rakyat');
        setTitle('');
        setDescription('');
        setImageUrl('');
        setAudioUrl('');
        setImageError('');
        setAudioError('');
        if (imageInputRef.current) imageInputRef.current.value = '';
        if (audioInputRef.current) audioInputRef.current.value = '';
      } else {
        setError('Gagal mengirim kontribusi');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-card-bg border border-card-border/60 rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-md">
        <div className="w-16 h-16 bg-secondary/15 rounded-full flex items-center justify-center text-secondary mx-auto">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Kontribusi Berhasil Dikirim!</h2>
          <p className="text-sm text-muted leading-relaxed">
            Terima kasih atas partisipasi Anda dalam melestarikan budaya Kalimantan Tengah. Kontribusi Anda telah berhasil dikirim ke antrean verifikasi dan akan ditinjau oleh Administrator dalam waktu 1x24 jam. Jika kontribusi Anda disetujui, kami akan mengirimkan konfirmasi ke alamat email Anda dan menerbitkannya di website utama Tentang Itah.
          </p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-sm"
        >
          Kirim Kontribusi Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg text-sm text-accent font-medium">
          {error}
        </div>
      )}

      {/* Grid Inputs: Sender Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Nama Pengirim *</label>
          <input
            type="text"
            required
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className="w-full px-4 py-2.5 rounded-lg border border-card-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Email Pengirim *</label>
          <input
            type="email"
            required
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="Contoh: budi@domain.com"
            className="w-full px-4 py-2.5 rounded-lg border border-card-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
          />
        </div>
      </div>

      {/* Category Select */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Jenis Kontribusi *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-card-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all cursor-pointer"
        >
          <option value="Cerita Rakyat">Cerita Rakyat / Dongeng Tradisional</option>
          <option value="Seni & Budaya">Seni & Budaya (Tari, Musik, Kriya, Busana)</option>
          <option value="Tradisi">Tradisi Adat / Upacara Ritual</option>
          <option value="Lainnya">Informasi Budaya Lainnya</option>
        </select>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Judul Kontribusi *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tuliskan nama tarian, judul cerita, atau nama upacara adat"
          className="w-full px-4 py-2.5 rounded-lg border border-card-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
        />
      </div>

      {/* Description / Content */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Deskripsi Detail Kontribusi *</label>
        <textarea
          required
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ceritakan sejarah, asal-usul, makna filosofis, atau isi dongeng secara lengkap..."
          className="w-full px-4 py-2.5 rounded-lg border border-card-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all resize-none"
        />
      </div>

      {/* Photo Upload */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Lampiran Foto Pendukung (Opsional)</label>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            ref={imageInputRef}
            onChange={handleImageUpload}
            disabled={isUploading !== null || isSubmitting}
            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer disabled:opacity-50"
          />
          {isUploading === 'image' && (
            <span className="text-xs text-primary font-semibold animate-pulse flex items-center gap-1">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Mengunggah...
            </span>
          )}
        </div>
        <p className="text-3xs text-muted/70 mt-1">Format yang diterima: JPG, JPEG, PNG (Maksimal 500 KB)</p>
        {imageError && (
          <p className="text-xs text-accent font-medium mt-1">{imageError}</p>
        )}
        {imageUrl && (
          <div className="mt-2 w-32 aspect-[4/3] rounded-lg overflow-hidden border border-card-border/80 shadow-sm relative">
            <img src={imageUrl} alt="Preview Unggahan" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setImageUrl('');
                setImageError('');
                if (imageInputRef.current) imageInputRef.current.value = '';
              }}
              className="absolute top-1 right-1 p-1 bg-accent hover:bg-accent-hover text-white rounded-full transition-all flex items-center justify-center"
              title="Hapus Foto"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Audio Upload */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Lampiran Audio Pendukung (Opsional)</label>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="file"
            accept="audio/mpeg,audio/mp3"
            ref={audioInputRef}
            onChange={handleAudioUpload}
            disabled={isUploading !== null || isSubmitting}
            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer disabled:opacity-50"
          />
          {isUploading === 'audio' && (
            <span className="text-xs text-primary font-semibold animate-pulse flex items-center gap-1">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Mengunggah...
            </span>
          )}
        </div>
        <p className="text-3xs text-muted/70 mt-1">Format yang diterima: MP3 saja (Maksimal 5 MB)</p>
        {audioError && (
          <p className="text-xs text-accent font-medium mt-1">{audioError}</p>
        )}
        {audioUrl && (
          <div className="mt-2 p-3 bg-background border border-card-border/80 rounded-lg flex items-center justify-between gap-4 max-w-md shadow-sm relative">
            <audio src={audioUrl} controls className="h-8 flex-1" />
            <button
              type="button"
              onClick={() => {
                setAudioUrl('');
                setAudioError('');
                if (audioInputRef.current) audioInputRef.current.value = '';
              }}
              className="p-1 bg-accent hover:bg-accent-hover text-white rounded-full transition-all flex items-center justify-center"
              title="Hapus Audio"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isUploading !== null || isSubmitting}
        className="w-full py-3.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold shadow-md transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Mengirim...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Kirim Kontribusi Budaya
          </>
        )}
      </button>
    </form>
  );
}
