import { getDashboardStatsAction } from '@/app/actions';
import Link from 'next/link';

export const revalidate = 0; // Dynamic server check

export default async function AdminDashboardOverview() {
  let stats;
  try {
    stats = await getDashboardStatsAction();
  } catch (error) {
    console.error('Failed to load dashboard stats:', error);
    stats = {
      languagesCount: 0,
      vocabulariesCount: 0,
      artsCount: 0,
      traditionsCount: 0,
      folkloreCount: 0,
      regionsCount: 0,
      galleryCount: 0,
      quizzesCount: 0,
      pendingContributions: 0,
      approvedContributions: 0,
      totalContentActive: 0,
    };
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard Statistik</h1>
        <p className="text-xs text-muted">Ringkasan aktivitas data dan konten portal kebudayaan Tentang Itah.</p>
      </div>

      {/* Main stats card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Card 1: Total Active Content */}
        <div className="bg-card-bg border border-card-border/60 p-6 rounded-2xl shadow-sm space-y-2 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-2xs font-bold text-muted uppercase tracking-wider">Konten Aktif</span>
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-foreground">{stats.totalContentActive}</p>
            <p className="text-3xs text-muted leading-tight">Total seluruh item bahasa, kesenian, tradisi, wilayah, kriya, and kuis yang tayang.</p>
          </div>
        </div>

        {/* Card 2: Pending Contributions */}
        <Link 
          href="/admin/dashboard/kontribusi"
          className="bg-card-bg border border-card-border/60 p-6 rounded-2xl shadow-sm space-y-2 flex flex-col justify-between hover:border-accent group transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <span className="text-2xs font-bold text-muted uppercase tracking-wider">Kontribusi Pending</span>
            <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center group-hover:scale-105 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="space-y-1">
            <p className={`text-3xl font-extrabold transition-colors ${stats.pendingContributions > 0 ? 'text-accent' : 'text-foreground'}`}>
              {stats.pendingContributions}
            </p>
            <p className="text-3xs text-muted leading-tight group-hover:text-accent/80 transition-colors">
              {stats.pendingContributions > 0 ? '⚠️ Membutuhkan persetujuan verifikasi konten segera!' : 'Tidak ada kontribusi masuk yang tertunda saat ini.'}
            </p>
          </div>
        </Link>

        {/* Card 3: Approved Contributions */}
        <div className="bg-card-bg border border-card-border/60 p-6 rounded-2xl shadow-sm space-y-2 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-2xs font-bold text-muted uppercase tracking-wider">Kontribusi Disetujui</span>
            <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-foreground">{stats.approvedContributions}</p>
            <p className="text-3xs text-muted leading-tight">Kiriman kebudayaan masyarakat yang telah sukses diverifikasi dan ditayangkan.</p>
          </div>
        </div>

      </div>

      {/* Detailed Content Counters */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-foreground">Statistik Rincian Konten Aktif</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="bg-card-bg border border-card-border/60 p-4 rounded-xl shadow-xs">
            <span className="text-3xs text-muted font-bold uppercase tracking-wider block">Bahasa Daerah</span>
            <p className="text-xl font-bold text-primary mt-1">{stats.languagesCount} Bahasa</p>
            <span className="text-4xs text-muted">({stats.vocabulariesCount} kosakata terdaftar)</span>
          </div>

          <div className="bg-card-bg border border-card-border/60 p-4 rounded-xl shadow-xs">
            <span className="text-3xs text-muted font-bold uppercase tracking-wider block">Seni & Budaya</span>
            <p className="text-xl font-bold text-primary mt-1">{stats.artsCount} Ragam Kesenian</p>
            <span className="text-4xs text-muted">(tari, musik, pakaian, kriya)</span>
          </div>

          <div className="bg-card-bg border border-card-border/60 p-4 rounded-xl shadow-xs">
            <span className="text-3xs text-muted font-bold uppercase tracking-wider block">Tradisi Adat</span>
            <p className="text-xl font-bold text-primary mt-1">{stats.traditionsCount} Upacara</p>
            <span className="text-4xs text-muted">(dan ritus leluhur pedalaman)</span>
          </div>

          <div className="bg-card-bg border border-card-border/60 p-4 rounded-xl shadow-xs">
            <span className="text-3xs text-muted font-bold uppercase tracking-wider block">Cerita Rakyat</span>
            <p className="text-xl font-bold text-primary mt-1">{stats.folkloreCount} Legenda</p>
            <span className="text-4xs text-muted">(dengan lampiran rekaman audio)</span>
          </div>

          <div className="bg-card-bg border border-card-border/60 p-4 rounded-xl shadow-xs">
            <span className="text-3xs text-muted font-bold uppercase tracking-wider block">Jelajah Kabupaten</span>
            <p className="text-xl font-bold text-primary mt-1">{stats.regionsCount} Wilayah</p>
            <span className="text-4xs text-muted">(13 kabupaten dan 1 kota)</span>
          </div>

          <div className="bg-card-bg border border-card-border/60 p-4 rounded-xl shadow-xs">
            <span className="text-3xs text-muted font-bold uppercase tracking-wider block">Galeri Media</span>
            <p className="text-xl font-bold text-primary mt-1">{stats.galleryCount} Dokumentasi</p>
            <span className="text-4xs text-muted">(berkas foto dan cuplikan video)</span>
          </div>

          <div className="bg-card-bg border border-card-border/60 p-4 rounded-xl shadow-xs">
            <span className="text-3xs text-muted font-bold uppercase tracking-wider block">Pertanyaan Kuis</span>
            <p className="text-xl font-bold text-primary mt-1">{stats.quizzesCount} Soal</p>
            <span className="text-4xs text-muted">(kuis wawasan budaya Kalteng)</span>
          </div>

          <div className="bg-card-bg border border-card-border/60 p-4 rounded-xl shadow-xs">
            <span className="text-3xs text-muted font-bold uppercase tracking-wider block">Kredensial Admin</span>
            <p className="text-xl font-bold text-primary mt-1">1 Akun Aktif</p>
            <span className="text-4xs text-muted">(admin@tentangitah.id)</span>
          </div>

        </div>
      </div>
    </div>
  );
}
