import { getLanguages, getVocabularies, Language, Vocabulary } from '@/lib/db';
import LanguageExplorer from '@/components/LanguageExplorer';

export const revalidate = 0; // Dynamic server rendering to reflect admin updates immediately

export const metadata = {
  title: 'Kamus Bahasa Daerah',
  description: 'Mempelajari kosakata sehari-hari berbagai bahasa daerah Kalimantan Tengah seperti Dayak Ngaju, Bakumpai, dan Ma’anyan lengkap dengan pelafalan audio.',
};

export default async function BahasaPage() {
  let languages: Language[] = [];
  let vocabularies: Vocabulary[] = [];

  try {
    languages = await getLanguages();
    vocabularies = await getVocabularies();
  } catch (error) {
    console.error('Failed to load language data:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-primary font-bold text-xs uppercase tracking-wider">Kamus Interaktif</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Bahasa Daerah Kalimantan Tengah
        </h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        <p className="text-muted text-base leading-relaxed">
          Kalimantan Tengah memiliki keragaman bahasa daerah yang dituturkan oleh berbagai sub-suku Dayak. Cari kosakata, pelajari maknanya, dan dengarkan rekaman pengucapan aslinya di bawah ini.
        </p>
      </div>

      {/* Explorer Component (Search + Tabs + Grid) */}
      <LanguageExplorer languages={languages} vocabularies={vocabularies} />
    </div>
  );
}
