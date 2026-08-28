import { getFolklore, Folklore } from '@/lib/db';
import FolkloreExplorer from '@/components/FolkloreExplorer';

export const revalidate = 0; // Dynamic server rendering to reflect admin updates immediately

export const metadata = {
  title: 'Cerita Rakyat & Legenda',
  description: 'Kumpulan cerita rakyat, fabel, legenda asal mula tempat, dan kisah kepahlawanan masyarakat pedalaman Kalimantan Tengah.',
};

export default async function FolklorePage() {
  let stories: Folklore[] = [];
  try {
    stories = await getFolklore();
  } catch (error) {
    console.error('Failed to load folklore data:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-primary font-bold text-xs uppercase tracking-wider">Tradisi Lisan</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Cerita Rakyat & Legenda Kalteng
        </h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        <p className="text-muted text-base leading-relaxed">
          Sastra lisan Kalimantan Tengah penuh dengan petuah bijak, fabel kehidupan selaras alam, serta mitos pembentukan perbukitan dan perairan eksotis. Baca kisah luhur dan dengarkan narasinya di bawah ini.
        </p>
      </div>

      {/* Explorer Grid & Reader Modal */}
      <FolkloreExplorer stories={stories} />
    </div>
  );
}
