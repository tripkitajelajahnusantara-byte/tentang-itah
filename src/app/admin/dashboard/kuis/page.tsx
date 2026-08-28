import { getQuizzes, Quiz } from '@/lib/db';
import AdminQuizManager from '@/components/AdminQuizManager';

export const revalidate = 0; // Dynamic server check

export default async function AdminQuizPage() {
  let questions: Quiz[] = [];
  try {
    questions = await getQuizzes();
  } catch (error) {
    console.error('Failed to load quizzes for admin:', error);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">Kelola Pertanyaan Kuis Budaya</h1>
        <p className="text-xs text-muted">Sunting butir soal, kunci pilihan ganda, alokasi nilai, dan pembahasan edukatif untuk kuis interaktif.</p>
      </div>
      <AdminQuizManager initialQuizzes={questions} />
    </div>
  );
}
