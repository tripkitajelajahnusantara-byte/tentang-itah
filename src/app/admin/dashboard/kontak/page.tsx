import { getContact } from '@/lib/db';
import AdminContactForm from '@/components/AdminContactForm';

export const revalidate = 0; // Dynamic server check

export default async function AdminContactPage() {
  let contact;
  try {
    contact = await getContact();
  } catch (error) {
    console.error('Failed to load contact data for admin:', error);
  }

  if (!contact) {
    return <div className="text-sm text-muted">Gagal memuat konfigurasi kontak pengelola.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">Kelola Informasi Kontak & Pengelola</h1>
        <p className="text-xs text-muted">Sunting email resmi, telepon call center, alamat sekretariat redaksi, dan tautan akun media sosial pengelola website.</p>
      </div>
      <AdminContactForm initialData={contact} />
    </div>
  );
}
