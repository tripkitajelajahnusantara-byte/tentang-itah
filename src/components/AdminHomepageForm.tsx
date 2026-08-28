'use client';

import { useState } from 'react';
import { Homepage } from '@/lib/db';
import { updateHomepageAction } from '@/app/actions';

interface AdminHomepageFormProps {
  initialData: Homepage;
}

export default function AdminHomepageForm({ initialData }: AdminHomepageFormProps) {
  const [heroTitle, setHeroTitle] = useState(initialData.hero_title);
  const [heroSubtitle, setHeroSubtitle] = useState(initialData.hero_subtitle);
  const [heroImage, setHeroImage] = useState(initialData.hero_image);
  const [logo1, setLogo1] = useState(initialData.logo_1);
  const [logo2, setLogo2] = useState(initialData.logo_2);
  const [logo3, setLogo3] = useState(initialData.logo_3);
  const [ctaText, setCtaText] = useState(initialData.cta_text);

  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
        if (fieldName === 'hero_image') setHeroImage(data.url);
        if (fieldName === 'logo_1') setLogo1(data.url);
        if (fieldName === 'logo_2') setLogo2(data.url);
        if (fieldName === 'logo_3') setLogo3(data.url);
      } else {
        setError(data.error || `Gagal mengunggah ${fieldName}`);
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
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await updateHomepageAction({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_image: heroImage,
        logo_1: logo1,
        logo_2: logo2,
        logo_3: logo3,
        cta_text: ctaText,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui beranda');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card-bg border border-card-border/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      
      <div className="flex justify-between items-center border-b border-card-border/40 pb-4">
        <h2 className="font-serif text-lg font-bold text-foreground">Sunting Beranda Utama</h2>
        {success && (
          <span className="text-xs font-semibold text-secondary animate-pulse">✓ Berhasil Disimpan</span>
        )}
      </div>

      {error && (
        <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg text-xs text-accent font-semibold">
          {error}
        </div>
      )}

      {/* Hero Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Headline Banner Utama</label>
        <input
          type="text"
          required
          value={heroTitle}
          onChange={(e) => setHeroTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
        />
      </div>

      {/* Hero Subtitle */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Deskripsi Headline (Sub-Headline)</label>
        <textarea
          required
          rows={3}
          value={heroSubtitle}
          onChange={(e) => setHeroSubtitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all resize-none"
        />
      </div>

      {/* CTA Text */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Teks Tombol / CTA (Call to Action)</label>
        <input
          type="text"
          required
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
        />
      </div>

      {/* Banner File Upload */}
      <div className="space-y-2 border-t border-card-border/40 pt-4">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Gambar Banner Hero</label>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'hero_image')}
            className="text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-2xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
          />
          {isUploading === 'hero_image' && <span className="text-2xs text-primary animate-pulse">Mengunggah...</span>}
        </div>
        <div className="text-xs text-muted">URL Aktif: <code className="bg-background px-1.5 py-0.5 rounded text-primary text-2xs">{heroImage}</code></div>
      </div>

      {/* Logos grid section */}
      <div className="border-t border-card-border/40 pt-4 space-y-4">
        <h3 className="text-xs font-bold text-foreground/80 uppercase tracking-wider">Tiga Logo Pendukung (Beranda)</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Logo 1 */}
          <div className="space-y-2 p-4 border border-card-border rounded-xl bg-background/50">
            <span className="text-3xs font-semibold text-muted uppercase">Logo 1 (Pemprov)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'logo_1')}
              className="w-full text-2xs"
            />
            <div className="w-12 h-12 p-1 border border-card-border rounded bg-white mt-1">
              <img src={logo1} alt="Logo 1 Preview" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Logo 2 */}
          <div className="space-y-2 p-4 border border-card-border rounded-xl bg-background/50">
            <span className="text-3xs font-semibold text-muted uppercase">Logo 2 (Tentang Itah)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'logo_2')}
              className="w-full text-2xs"
            />
            <div className="w-12 h-12 p-1 border border-card-border rounded bg-white mt-1">
              <img src={logo2} alt="Logo 2 Preview" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Logo 3 */}
          <div className="space-y-2 p-4 border border-card-border rounded-xl bg-background/50">
            <span className="text-3xs font-semibold text-muted uppercase">Logo 3 (Pendidikan)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'logo_3')}
              className="w-full text-2xs"
            />
            <div className="w-12 h-12 p-1 border border-card-border rounded bg-white mt-1">
              <img src={logo3} alt="Logo 3 Preview" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={isSubmitting || isUploading !== null}
        className="w-full py-3.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-md transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Menyimpan Perubahan...' : 'Simpan Konfigurasi Beranda'}
      </button>

    </form>
  );
}
