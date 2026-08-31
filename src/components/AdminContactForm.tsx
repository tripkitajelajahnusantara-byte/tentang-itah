'use client';

import { useState } from 'react';
import { Contact } from '@/lib/db';
import { updateContactAction } from '@/app/actions';

interface AdminContactFormProps {
  initialData: Contact;
}

export default function AdminContactForm({ initialData }: AdminContactFormProps) {
  const [email, setEmail] = useState(initialData.email);
  const [phone, setPhone] = useState(initialData.phone || '');
  const [instagram, setInstagram] = useState(initialData.instagram || '');
  const [facebook, setFacebook] = useState(initialData.facebook || '');
  const [twitter, setTwitter] = useState(initialData.twitter || '');
  const [dekranasda, setDekranasda] = useState(initialData.dekranasda_kalteng || '');
  const [aboutUs, setAboutUs] = useState(initialData.about_us || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email wajib diisi');
      return;
    }

    if (/[<>]/.test(email) || /[<>]/.test(phone) || /[<>]/.test(instagram) || /[<>]/.test(facebook) || /[<>]/.test(twitter) || /[<>]/.test(dekranasda) || /[<>]/.test(aboutUs)) {
      setError('Karakter < dan > tidak diperbolehkan pada kolom input');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await updateContactAction({
        email,
        phone: phone || undefined,
        address: '',
        instagram: instagram || undefined,
        facebook: facebook || undefined,
        twitter: twitter || undefined,
        dekranasda_kalteng: dekranasda || undefined,
        about_us: aboutUs || undefined
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan perubahan kontak');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card-bg border border-card-border/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      
      <div className="flex justify-between items-center border-b border-card-border/40 pb-4">
        <h2 className="font-serif text-lg font-bold text-foreground">Sunting Informasi Hubungan & Kontak</h2>
        {success && (
          <span className="text-xs font-semibold text-secondary animate-pulse">✓ Berhasil Disimpan</span>
        )}
      </div>

      {error && (
        <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg text-xs text-accent font-semibold">
          {error}
        </div>
      )}

      {/* Grid: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Surel Kontak (Email) *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Nomor Telepon / WhatsApp</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
          />
        </div>
      </div>


      {/* Grid: Social media */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-card-border/40 pt-4">
        <div className="space-y-1.5">
          <label className="text-2xs font-bold text-foreground/80 uppercase tracking-wider block">Instagram Handle</label>
          <input
            type="text"
            placeholder="@nama.akun"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-card-border bg-background text-foreground text-sm focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-2xs font-bold text-foreground/80 uppercase tracking-wider block">Facebook Page</label>
          <input
            type="text"
            placeholder="Contoh: Tentang Itah Kalteng"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-card-border bg-background text-foreground text-sm focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-2xs font-bold text-foreground/80 uppercase tracking-wider block">Twitter Handle</label>
          <input
            type="text"
            placeholder="@nama.akun"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-card-border bg-background text-foreground text-sm focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-2xs font-bold text-foreground/80 uppercase tracking-wider block">Dekranasda Kalteng IG</label>
          <input
            type="text"
            placeholder="@nama.akun"
            value={dekranasda}
            onChange={(e) => setDekranasda(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-card-border bg-background text-foreground text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* About Us Footer Text */}
      <div className="space-y-1.5 border-t border-card-border/40 pt-4">
        <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Deskripsi Singkat Pengelola (Tampil di Footer)</label>
        <textarea
          rows={3}
          value={aboutUs}
          onChange={(e) => setAboutUs(e.target.value)}
          placeholder="Jelaskan misi kepengelolaan secara singkat..."
          className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm resize-none transition-all"
        />
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-md transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Menyimpan Perubahan...' : 'Simpan Informasi Kontak'}
      </button>

    </form>
  );
}
