import { getQuizzes, Quiz } from '@/lib/db';
import QuizInterface from '@/components/QuizInterface';

export const revalidate = 0; // Dynamic server rendering to reflect admin updates immediately

export const metadata = {
  title: 'Kuis Budaya Kalteng',
  description: 'Asah pengetahuan Anda mengenai budaya, sejarah, tradisi, seni pertunjukan, dan bahasa daerah Kalimantan Tengah melalui kuis pilihan ganda interaktif.',
};

export default async function KuisPage() {
  let questions: Quiz[] = [];
  try {
    questions = await getQuizzes();
  } catch (error) {
    console.error('Failed to load quizzes data:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-primary font-bold text-xs uppercase tracking-wider">Asah Wawasan</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Kuis Budaya Kalimantan Tengah
        </h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        <p className="text-muted text-base leading-relaxed">
          Uji sejauh mana pemahaman Anda tentang Bumi Tambun Bungai. Jawab setiap pertanyaan pilihan ganda dengan cermat dan kumpulkan skor tertinggi Anda!
        </p>
      </div>

      {/* Interactive Quiz Interface */}
      <QuizInterface questions={questions} />
    </div>
  );
}
