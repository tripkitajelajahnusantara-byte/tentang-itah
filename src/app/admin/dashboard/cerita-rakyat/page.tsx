import { getFolklore, Folklore } from '@/lib/db';
import AdminFolkloreManager from '@/components/AdminFolkloreManager';

export const revalidate = 0; // Dynamic server check

export default async function AdminFolklorePage() {
  let stories: Folklore[] = [];
  try {
    stories = await getFolklore();
  } catch (error) {
    console.error('Failed to load folklore for admin:', error);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">Kelola Cerita Rakyat & Legenda</h1>
        <p className="text-xs text-muted">Sunting cerita dongeng tradisional, mite Bukit Tangkiling, legenda Danau Malawen, dan kisah lisan Kalimantan Tengah.</p>
      </div>
      <AdminFolkloreManager initialStories={stories} />
    </div>
  );
}
