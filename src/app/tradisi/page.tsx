import { getTraditions, Tradition } from '@/lib/db';
import TraditionsList from '@/components/TraditionsList';

export const revalidate = 0; // Dynamic server rendering to reflect admin updates immediately

export const metadata = {
  title: 'Tradisi & Upacara Adat',
  description: 'Mengenal ritual adat sakral Tiwah suku Dayak Kaharingan, keahlian Manyipet, serta berbagai tradisi adat luhur di Kalimantan Tengah.',
};

export default async function TraditionsPage() {
  let traditions: Tradition[] = [];
  try {
    traditions = await getTraditions();
  } catch (error) {
    console.error('Failed to load traditions data:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-primary font-bold text-xs uppercase tracking-wider">Upacara & Adat Istiadat</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Tradisi Masyarakat Kalimantan Tengah
        </h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        <p className="text-muted text-base leading-relaxed">
          Suku Dayak memelihara ikatan yang kuat dengan dunia spiritual melalui rangkaian upacara adat daur hidup (life cycle) serta tradisi ketangkasan berburu yang diwariskan turun-temurun.
        </p>
      </div>

      {/* Grid of Traditions with Pagination */}
      <TraditionsList traditions={traditions} />
    </div>
  );
}
