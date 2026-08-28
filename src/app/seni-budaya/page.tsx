import { getArtsCulture, ArtsCulture } from '@/lib/db';
import ArtsExplorer from '@/components/ArtsExplorer';

export const revalidate = 0; // Dynamic server rendering to reflect admin updates immediately

export const metadata = {
  title: 'Seni & Budaya Kalimantan Tengah',
  description: 'Eksplorasi ragam seni pertunjukan tari, alat musik tradisional Garantung, pakaian adat Sangkarut, dan kerajinan anyaman rotan suku Dayak.',
};

export default async function ArtsPage() {
  let arts: ArtsCulture[] = [];
  try {
    arts = await getArtsCulture();
  } catch (error) {
    console.error('Failed to load arts culture data:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4 pt-28">
        <span className="text-secondary font-extrabold tracking-widest text-3xs sm:text-2xs uppercase">
          ◆ WARISAN LELUHUR ◆
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Seni & Kebudayaan Kalimantan Tengah
        </h1>
        <p className="text-muted text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
          Setiap aliran, ketukan garantung, dan ayunan mandau menceritakan hubungan batin yang harmonis antara manusia dengan kemegahan hutan belantara Kalimantan.
        </p>
      </div>

      {/* Explorer Component (Tabs + Grid) */}
      <ArtsExplorer arts={arts} />
    </div>
  );
}
