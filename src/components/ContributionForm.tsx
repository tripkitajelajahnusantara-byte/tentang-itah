'use client';

import { useState } from 'react';
import { submitContributionAction } from '@/app/actions';

export default function ContributionForm() {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [category, setCategory] = useState('Cerita Rakyat');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      } else {
        setError(data.error || 'Gagal mengunggah foto');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat mengunggah berkas');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderName || !senderEmail || !title || !description) {
      setError('Semua bidang wajib diisi (kecuali lampiran foto)');
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
            Terima kasih atas partisipasi Anda dalam melestarikan budaya Kalimantan Tengah. Kontribusi Anda telah masuk antrean verifikasi dan akan segera ditinjau oleh Administrator sebelum diterbitkan di website utama Tentang Itah.
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
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading || isSubmitting}
            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer disabled:opacity-50"
          />
          {isUploading && (
            <span className="text-xs text-primary font-semibold animate-pulse flex items-center gap-1">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Mengunggah...
            </span>
          )}
        </div>
        {imageUrl && (
          <div className="mt-2 w-32 aspect-[4/3] rounded-lg overflow-hidden border border-card-border/80 shadow-sm relative">
            <img src={imageUrl} alt="Preview Unggahan" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="absolute top-1 right-1 p-1 bg-accent hover:bg-accent-hover text-white rounded-full transition-all"
              title="Hapus Foto"
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
        disabled={isUploading || isSubmitting}
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
