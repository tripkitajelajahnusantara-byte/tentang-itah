import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import Link from 'next/link';
import ClientLogoutButton from '@/components/ClientLogoutButton';

export const revalidate = 0; // Dynamic server check

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminDashboardLayout({ children }: AdminLayoutProps) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const menuItems = [
    { name: 'Dashboard Statistik', href: '/admin/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' },
    { name: 'Kelola Beranda', href: '/admin/dashboard/beranda', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Kelola Tentang Itah', href: '/admin/dashboard/tentang', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Kelola Bahasa & Kamus', href: '/admin/dashboard/bahasa', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5c.313 1.567.854 3.07 1.618 4.5h-4.544a17.915 17.915 0 011.618-4.5z' },
    { name: 'Kelola Seni & Budaya', href: '/admin/dashboard/seni-budaya', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Kelola Tradisi Adat', href: '/admin/dashboard/tradisi', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Kelola Cerita Rakyat', href: '/admin/dashboard/cerita-rakyat', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Kelola Jelajah Daerah', href: '/admin/dashboard/jelajah', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { name: 'Kelola Kata Hari Ini', href: '/admin/dashboard/kata-hari-ini', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Kelola Pertanyaan Kuis', href: '/admin/dashboard/kuis', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Verifikasi Kontribusi', href: '/admin/dashboard/kontribusi', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { name: 'Kelola Galeri Media', href: '/admin/dashboard/galeri', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Kelola Kontak & Sosial', href: '/admin/dashboard/kontak', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-300">
      
      {/* SIDEBAR NAVIGATION Panel */}
      <aside className="w-full md:w-64 bg-card-bg border-r border-card-border/60 shrink-0 flex flex-col justify-between py-6 md:sticky md:top-20 md:h-[calc(100vh-5rem)] z-40 transition-colors duration-300">
        <div className="space-y-6">
          {/* User profile identifier */}
          <div className="px-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground line-clamp-1">admin@tentangitah.id</p>
              <span className="text-3xs text-secondary font-semibold uppercase tracking-wider">Administrator</span>
            </div>
          </div>

          <div className="border-t border-card-border/40 my-2" />

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                <svg className="w-4 h-4 shrink-0 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                <span className="line-clamp-1">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer controls inside sidebar */}
        <div className="px-3 space-y-2 mt-6">
          <Link 
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary hover:text-white text-xs font-semibold transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Kunjungi Website
          </Link>
          
          <ClientLogoutButton />
        </div>
      </aside>

      {/* CORE CONTENT AREA */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-[#141211]/20 overflow-x-hidden min-h-[calc(100vh-5rem)]">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
