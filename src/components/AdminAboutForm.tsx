'use client';

import { useState } from 'react';
import { About } from '@/lib/db';
import { updateAboutAction } from '@/app/actions';

interface AdminAboutFormProps {
  initialData: About;
}

export default function AdminAboutForm({ initialData }: AdminAboutFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [imageUrl, setImageUrl] = useState(initialData.image_url);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      } else {
        setError(data.error || 'Gagal mengunggah gambar');
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
    if (/[<>]/.test(title) || /[<>]/.test(content)) {
      setError('Karakter < dan > tidak diperbolehkan pada kolom input');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await updateAboutAction({
        title,
        content,
        image_url: imageUrl,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal diperbarui');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card-bg border border-card-border/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      
      <div className="flex justify-between items-center border-b border-card-border/40 pb-4">
        <h2 className="font-serif text-lg font-bold text-foreground">Sunting Halaman Tentang</h2>
        {success && (
          <span className="text-xs font-semibold text-secondary animate-pulse">✓ Berhasil Disimpan</span>
        )}
      </div>

      {error && (
        <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg text-xs text-accent font-semibold">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Judul Halaman</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
        />
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Konten Halaman Tentang</label>
        <textarea
          required
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all resize-none font-sans leading-relaxed text-xs"
        />
      </div>

      {/* Banner Image Upload */}
      <div className="space-y-2 border-t border-card-border/40 pt-4">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Foto Sampul / Banner</label>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="w-full text-2xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
          />
          {isUploading && <span className="text-2xs text-primary animate-pulse">Mengunggah...</span>}
        </div>
        <p className="text-4xs text-muted/70 mt-1">Format: JPG, JPEG, PNG (Maksimal 500 KB)</p>
        
        <div className="flex gap-4 items-center mt-2">
          <div className="w-24 aspect-[4/3] border border-card-border rounded overflow-hidden">
            <img src={imageUrl} alt="About Preview" className="w-full h-full object-cover" />
          </div>
          <div className="text-xs text-muted">URL Aktif: <code className="bg-background px-1.5 py-0.5 rounded text-primary text-2xs">{imageUrl}</code></div>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="w-full py-3.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-md transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Menyimpan Perubahan...' : 'Simpan Konfigurasi Tentang'}
      </button>

    </form>
  );
}
