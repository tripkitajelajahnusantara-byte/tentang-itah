import { getAbout } from '@/lib/db';
import AdminAboutForm from '@/components/AdminAboutForm';

export const revalidate = 0; // Dynamic server check

export default async function AdminAboutPage() {
  let about;
  try {
    about = await getAbout();
  } catch (error) {
    console.error('Failed to load about for admin:', error);
  }

  if (!about) {
    return <div className="text-sm text-muted">Gagal memuat konfigurasi halaman Tentang.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">Kelola Tentang Itah</h1>
        <p className="text-xs text-muted">Sunting isi teks deskripsi, latar belakang, visi misi, dan foto di halaman Tentang.</p>
      </div>
      <AdminAboutForm initialData={about} />
    </div>
  );
}
