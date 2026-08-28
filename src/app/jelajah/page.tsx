import { getRegions, Region } from '@/lib/db';
import RegionExplorer from '@/components/RegionExplorer';

export const revalidate = 0; // Dynamic server rendering to reflect admin updates immediately

export const metadata = {
  title: 'Jelajah Daerah Kalimantan Tengah',
  description: 'Telusuri peta interaktif kebudayaan Kalimantan Tengah. Jelajahi keunikan budaya lokal di 13 kabupaten dan 1 kota.',
};

export default async function JelajahPage() {
  let regions: Region[] = [];
  try {
    regions = await getRegions();
  } catch (error) {
    console.error('Failed to load regions data:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-primary font-bold text-xs uppercase tracking-wider">Eksplorasi Wilayah</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Jelajah Daerah Kalimantan Tengah
        </h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        <p className="text-muted text-base leading-relaxed">
          Kalimantan Tengah terdiri dari 13 Kabupaten dan 1 Kota Administrasi. Setiap wilayah dialiri sungai-sungai besar dan menyimpan adat khas masing-masing. Pilih daerah pada peta atau daftar untuk memulai penelusuran.
        </p>
      </div>

      {/* Region Explorer (Map + Cards Panel) */}
      <RegionExplorer regions={regions} />
    </div>
  );
}
