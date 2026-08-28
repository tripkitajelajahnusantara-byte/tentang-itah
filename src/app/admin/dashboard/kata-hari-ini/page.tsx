import { getWordOfTheDays, WordOfTheDay } from '@/lib/db';
import AdminWordManager from '@/components/AdminWordManager';

export const revalidate = 0; // Dynamic server check

export default async function AdminWordOfTheDayPage() {
  let words: WordOfTheDay[] = [];
  try {
    words = await getWordOfTheDays();
  } catch (error) {
    console.error('Failed to load word of the day list for admin:', error);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">Kelola Kata Hari Ini</h1>
        <p className="text-xs text-muted">Sunting kosakata harian, jadwalkan tanggal tampil, dan unggah rekaman audio pengucapan di halaman utama.</p>
      </div>
      <AdminWordManager initialWords={words} />
    </div>
  );
}
