'use client';

import { useState } from 'react';
import { loginAdminAction } from '@/app/actions';

export default function AdminLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username dan password wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const result = await loginAdminAction(null, formData);

      if (result.success) {
        // Direct browser redirect to reload layout and pick up new session cookies
        window.location.href = '/admin/dashboard';
      } else {
        setError(result.error || 'Autentikasi gagal');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 bg-card-bg border border-card-border/80 p-8 rounded-2xl shadow-xl">
        
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <span className="font-serif text-3xl font-bold tracking-wide text-primary flex items-center justify-center gap-1.5">
            <svg className="w-8 h-8 fill-current text-primary" viewBox="0 0 24 24">
              <path d="M12 2C10 6 7 9 4 10c0 4.5 1.5 8.5 8 12 6.5-3.5 8-7.5 8-12-3-1-6-4-8-8zM12 4.5c1.2 2.5 3.2 4.6 5.8 5.4-1.2 3-2.8 5.7-5.8 8.6-3-2.9-4.6-5.6-5.8-8.6 2.6-.8 4.6-2.9 5.8-5.4z"/>
            </svg>
            Tentang Itah
          </span>
          <h2 className="text-xl font-bold text-foreground">Portal Kredensial Admin</h2>
          <p className="text-xs text-muted">Akses panel kontrol untuk pengelolaan konten kebudayaan.</p>
        </div>

        {error && (
          <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg text-xs text-accent font-semibold animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-foreground/85 uppercase tracking-wider block">Username / Email</label>
              <input
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username atau email"
                className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-foreground/85 uppercase tracking-wider block">Kata Sandi (Password)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
              />
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-md transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Memverifikasi...
              </>
            ) : (
              'Masuk Panel Admin'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
