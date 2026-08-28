import { getGallery, Gallery } from '@/lib/db';
import GalleryGrid from '@/components/GalleryGrid';

export const revalidate = 0; // Dynamic server rendering to reflect admin updates immediately

export const metadata = {
  title: 'Galeri Budaya Kalimantan Tengah',
  description: 'Kumpulan dokumentasi foto dan video upacara kematian adat Tiwah, tari tradisional Dayak, and pemandangan alam Kalimantan Tengah.',
};

export default async function GalleryPage() {
  let items: Gallery[] = [];
  try {
    items = await getGallery();
  } catch (error) {
    console.error('Failed to load gallery data:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4 pt-28">
        <span className="text-secondary font-extrabold tracking-widest text-3xs sm:text-2xs uppercase">
          ◆ DOKUMENTASI VISUAL ◆
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Galeri Kebudayaan & Keindahan Alam
        </h1>
        <p className="text-muted text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
          Saksikan keindahan upacara sakral, gerakan tari perang yang dinamis, cagar alam Sebangau, dan kebersamaan adat Kalteng melalui dokumentasi lensa foto dan rekaman video di bawah ini.
        </p>
      </div>

      {/* Grid of gallery assets */}
      <GalleryGrid items={items} />
    </div>
  );
}
