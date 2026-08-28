'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Nama, email, dan pesan wajib diisi!');
      return;
    }
    setIsSent(true);
    alert('Pesan berhasil terkirim. Terima kasih atas masukan Anda!');
    // Clear inputs
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsSent(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-3xs font-bold text-foreground/75 uppercase tracking-wider">Nama Lengkap</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-3xs font-bold text-foreground/75 uppercase tracking-wider">Alamat Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Anda"
            className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-3xs font-bold text-foreground/75 uppercase tracking-wider">Judul Pesan</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subjek pertanyaan..."
          className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-3xs font-bold text-foreground/75 uppercase tracking-wider">Isi Pesan</label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan lengkap Anda di sini..."
          className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none font-light"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Kirim Masukan Anda
      </button>
    </form>
  );
}
