import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import Link from 'next/link';
import ClientLogoutButton from '@/components/ClientLogoutButton';
import AdminSidebarNav from '@/components/AdminSidebarNav';

export const revalidate = 0; // Dynamic server check

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminDashboardLayout({ children }: AdminLayoutProps) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin/login');
  }

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

          {/* Navigation Links with Active Highlighting */}
          <AdminSidebarNav />
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
