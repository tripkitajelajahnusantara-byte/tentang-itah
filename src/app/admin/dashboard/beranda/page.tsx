import { getHomepage } from '@/lib/db';
import AdminHomepageForm from '@/components/AdminHomepageForm';

export const revalidate = 0; // Dynamic server check

export default async function AdminHomepagePage() {
  let homepage;
  try {
    homepage = await getHomepage();
  } catch (error) {
    console.error('Failed to load homepage for admin:', error);
  }

  if (!homepage) {
    return <div className="text-sm text-muted">Gagal memuat konfigurasi beranda.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">Kelola Beranda Utama</h1>
        <p className="text-xs text-muted">Sunting teks headline, banner hero, CTA button, dan tiga logo pendukung di halaman utama.</p>
      </div>
      <AdminHomepageForm initialData={homepage} />
    </div>
  );
}
