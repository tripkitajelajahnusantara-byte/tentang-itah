import { getGallery, Gallery } from '@/lib/db';
import AdminGalleryManager from '@/components/AdminGalleryManager';

export const revalidate = 0; // Dynamic server check

export default async function AdminGalleryPage() {
  let items: Gallery[] = [];
  try {
    items = await getGallery();
  } catch (error) {
    console.error('Failed to load gallery for admin:', error);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">Kelola Galeri Media</h1>
        <p className="text-xs text-muted">Sunting dokumentasi foto kegiatan adat, pemandangan alam, and unggah rekaman video kebudayaan Kalimantan Tengah.</p>
      </div>
      <AdminGalleryManager initialItems={items} />
    </div>
  );
}
