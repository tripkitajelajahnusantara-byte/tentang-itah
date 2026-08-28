import { getArtsCulture, ArtsCulture } from '@/lib/db';
import AdminArtsManager from '@/components/AdminArtsManager';

export const revalidate = 0; // Dynamic server check

export default async function AdminArtsPage() {
  let arts: ArtsCulture[] = [];
  try {
    arts = await getArtsCulture();
  } catch (error) {
    console.error('Failed to load arts culture for admin:', error);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">Kelola Seni & Kebudayaan</h1>
        <p className="text-xs text-muted">Sunting ragam seni pertunjukan tari, alat musik tradisional, pakaian adat, dan kerajinan tangan suku Dayak.</p>
      </div>
      <AdminArtsManager initialArts={arts} />
    </div>
  );
}
