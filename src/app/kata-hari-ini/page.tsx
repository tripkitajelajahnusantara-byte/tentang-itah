import { getWordOfTheDays, getVocabularies, getLanguages } from '@/lib/db';
import AudioPlayer from '@/components/AudioPlayer';

export const revalidate = 0; // Dynamic server rendering to reflect date changes and admin updates

export const metadata = {
  title: 'Kata Hari Ini (Word of the Day)',
  description: 'Pelajari satu kosakata bahasa daerah Kalimantan Tengah setiap hari, lengkap dengan arti dan pelafalan audio.',
};

export default async function WordOfTheDayPage() {
  let todayWord = null;
  let historyWords: any[] = [];
  
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const wotds = await getWordOfTheDays();
    const vocabularies = await getVocabularies();
    const languages = await getLanguages();

    // 1. Try to find an admin-scheduled word for today
    todayWord = wotds.find(w => w.display_date === todayStr);

    // 2. Fallback: If no word is scheduled for today, dynamically pick one from vocabularies based on the date hash
    if (!todayWord && vocabularies.length > 0) {
      const todayTimestamp = new Date(todayStr).getTime();
      const index = Math.abs(Math.floor(todayTimestamp / (1000 * 60 * 60 * 24))) % vocabularies.length;
      const vocab = vocabularies[index];
      const lang = languages.find(l => l.id === vocab.language_id);
      
      todayWord = {
        id: vocab.id,
        word: vocab.word,
        meaning: vocab.meaning,
        language_name: lang ? lang.name : 'Bahasa Daerah',
        audio_url: vocab.audio_url,
        display_date: todayStr,
      };
    }

    // 3. Collect historical words (past dates)
    const todayTime = new Date(todayStr).getTime();
    historyWords = wotds
      .filter(w => new Date(w.display_date).getTime() < todayTime)
      .sort((a, b) => new Date(b.display_date).getTime() - new Date(a.display_date).getTime())
      .slice(0, 5); // Show last 5 words
  } catch (error) {
    console.error('Failed to load word of the day:', error);
  }

  // Format date to Indonesian style (e.g. Kamis, 27 Agustus 2026)
  const formatIndoDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-primary font-bold text-xs uppercase tracking-wider">Pembelajaran Harian</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Kata Hari Ini
        </h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        <p className="text-muted text-base">
          Tingkatkan kosakata bahasa daerah Anda setiap hari. Satu kata per hari untuk mengenal kekayaan bahasa lokal Kalimantan Tengah.
        </p>
      </div>

      {/* Main Word Card */}
      {todayWord ? (
        <div className="max-w-md mx-auto">
          <div className="bg-card-bg border border-card-border/80 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            {/* Red accent calendar header */}
            <div className="bg-accent px-6 py-4 text-center text-white">
              <span className="text-xs font-bold tracking-widest uppercase">KATA HARI INI</span>
              <p className="text-sm font-light mt-0.5 opacity-90">{formatIndoDate(todayWord.display_date)}</p>
            </div>
            
            {/* Word details body */}
            <div className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <h2 className="font-serif text-5xl font-extrabold text-primary tracking-wide">
                  {todayWord.word}
                </h2>
                <p className="text-sm text-muted font-medium italic">
                  Dialek: {todayWord.language_name}
                </p>
              </div>

              <div className="py-4 border-y border-card-border/40 space-y-1">
                <span className="text-3xs font-bold text-muted uppercase tracking-wider block">Artinya dalam Bahasa Indonesia:</span>
                <p className="text-xl font-bold text-foreground">{todayWord.meaning}</p>
              </div>

              {/* Audio player */}
              {todayWord.audio_url && (
                <div className="flex justify-center pt-2">
                  <AudioPlayer src={todayWord.audio_url} label="Dengar Pengucapan" />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-card-bg border border-card-border/60 rounded-2xl p-8 text-center text-muted">
          Belum ada data kosakata hari ini. Silakan tambahkan kosakata di dashboard admin.
        </div>
      )}

      {/* Historic Logs Section */}
      {historyWords.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-4 pt-6 border-t border-card-border/40">
          <h3 className="font-serif text-xl font-bold text-foreground text-center">
            Kosakata Hari-Hari Sebelumnya
          </h3>
          <div className="bg-card-bg border border-card-border/60 rounded-xl divide-y divide-card-border/40 shadow-sm overflow-hidden">
            {historyWords.map((word) => (
              <div key={word.id} className="p-4 flex items-center justify-between gap-4 hover:bg-primary/5 transition-colors">
                <div className="space-y-1">
                  <span className="text-3xs text-muted block">{formatIndoDate(word.display_date)}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-lg font-bold text-primary">{word.word}</span>
                    <span className="text-xs text-muted">({word.language_name})</span>
                  </div>
                  <p className="text-sm text-foreground/80"><span className="text-xs text-muted">arti:</span> {word.meaning}</p>
                </div>
                {word.audio_url && (
                  <AudioPlayer src={word.audio_url} label="Putar" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
