import { getLanguages, getVocabularies, Language, Vocabulary } from '@/lib/db';
import AdminLanguageManager from '@/components/AdminLanguageManager';

export const revalidate = 0; // Dynamic server check

export default async function AdminLanguagePage() {
  let languages: Language[] = [];
  let vocabularies: Vocabulary[] = [];

  try {
    languages = await getLanguages();
    vocabularies = await getVocabularies();
  } catch (error) {
    console.error('Failed to load language structures for admin:', error);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">Kelola Bahasa & Kamus Kosakata</h1>
        <p className="text-xs text-muted">Sunting rumpun bahasa daerah, kosakata, arti bahasa Indonesia, dan rekaman audio pelafalannya.</p>
      </div>
      <AdminLanguageManager initialLanguages={languages} initialVocabularies={vocabularies} />
    </div>
  );
}
