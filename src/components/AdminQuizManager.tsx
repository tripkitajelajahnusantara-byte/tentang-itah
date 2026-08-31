'use client';

import { useState } from 'react';
import { Quiz } from '@/lib/db';
import { addQuizAction, updateQuizAction, deleteQuizAction } from '@/app/actions';

interface AdminQuizManagerProps {
  initialQuizzes: Quiz[];
}

export default function AdminQuizManager({ initialQuizzes }: AdminQuizManagerProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  
  // Form State
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [score, setScore] = useState(10);
  const [explanation, setExplanation] = useState('');
  const [category, setCategory] = useState('Umum');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      setError('Pertanyaan, seluruh pilihan jawaban, dan kunci jawaban wajib diisi');
      return;
    }

    if (/[<>]/.test(question) || /[<>]/.test(optionA) || /[<>]/.test(optionB) || /[<>]/.test(optionC) || /[<>]/.test(optionD) || /[<>]/.test(explanation) || /[<>]/.test(category)) {
      setError('Karakter < dan > tidak diperbolehkan pada kolom input');
      return;
    }

    const scoreNum = Number(score);
    if (isNaN(scoreNum) || scoreNum < 0 || !Number.isInteger(scoreNum)) {
      setError('Skor kuis harus berupa bilangan bulat positif');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingId) {
        const updated = await updateQuizAction(editingId, {
          question,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_answer: correctAnswer,
          score: scoreNum,
          explanation,
          category
        });
        setQuizzes(quizzes.map(q => q.id === editingId ? updated : q));
        showSuccess('Pertanyaan kuis berhasil diperbarui');
        setEditingId(null);
      } else {
        const newQuiz = await addQuizAction({
          question,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_answer: correctAnswer,
          score,
          explanation,
          category
        });
        setQuizzes([...quizzes, newQuiz]);
        showSuccess('Pertanyaan kuis berhasil ditambahkan');
      }

      // Reset
      setQuestion('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectAnswer('A');
      setScore(10);
      setExplanation('');
      setCategory('Umum');
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan pertanyaan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (q: Quiz) => {
    setEditingId(q.id);
    setQuestion(q.question);
    setOptionA(q.option_a);
    setOptionB(q.option_b);
    setOptionC(q.option_c);
    setOptionD(q.option_d);
    setCorrectAnswer(q.correct_answer);
    setScore(q.score);
    setExplanation(q.explanation || '');
    setCategory(q.category || 'Umum');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pertanyaan kuis ini?')) return;
    try {
      const ok = await deleteQuizAction(id);
      if (ok) {
        setQuizzes(quizzes.filter(q => q.id !== id));
        showSuccess('Pertanyaan kuis berhasil dihapus');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus kuis');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setQuestion('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('A');
    setScore(10);
    setExplanation('');
    setCategory('Umum');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Form Column */}
      <div className="lg:col-span-5 bg-card-bg border border-card-border/60 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-foreground">
          {editingId ? 'Sunting Pertanyaan Kuis' : 'Tambah Pertanyaan Kuis Baru'}
        </h3>

        {success && (
          <div className="bg-secondary/10 border-l-4 border-secondary p-3 rounded-r-lg text-xs text-secondary font-semibold animate-pulse">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-accent/10 border-l-4 border-accent p-3 rounded-r-lg text-xs text-accent font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Pertanyaan *</label>
            <textarea
              required
              rows={3}
              placeholder="Tuliskan butir soal pertanyaan..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-3 p-3 border border-card-border rounded-xl bg-background/50">
            <span className="text-3xs font-bold text-muted uppercase tracking-wider block mb-1">Pilihan Jawaban *</span>
            
            <div className="space-y-2 text-xs">
              <input
                type="text"
                required
                placeholder="Pilihan A"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-background text-foreground"
              />
              <input
                type="text"
                required
                placeholder="Pilihan B"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-background text-foreground"
              />
              <input
                type="text"
                required
                placeholder="Pilihan C"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-background text-foreground"
              />
              <input
                type="text"
                required
                placeholder="Pilihan D"
                value={optionD}
                onChange={(e) => setOptionD(e.target.value)}
                className="w-full px-3 py-1.5 border border-card-border rounded bg-background text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Kategori / Paket Kuis *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-xs text-foreground focus:outline-none"
            >
              <option value="Umum">Umum (Kebudayaan Kalteng)</option>
              <option value="Bahasa Daerah">Bahasa Daerah</option>
              <option value="Seni & Budaya">Seni & Budaya</option>
              <option value="Tradisi Adat">Tradisi Adat</option>
              <option value="Cerita Rakyat">Cerita Rakyat & Sejarah</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Kunci Jawaban *</label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value as any)}
                className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
              >
                <option value="A">Pilihan A</option>
                <option value="B">Pilihan B</option>
                <option value="C">Pilihan C</option>
                <option value="D">Pilihan D</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Bobot Skor Soal *</label>
              <input
                type="number"
                required
                min="5"
                max="50"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-muted uppercase tracking-wider block">Penjelasan Jawaban (Pembahasan)</label>
            <textarea
              rows={3}
              placeholder="Uraikan pembahasan materi soal..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-2 border border-card-border rounded-lg bg-background text-sm text-foreground focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all"
            >
              {isSubmitting ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah Soal')}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-3 py-2 rounded-lg border border-card-border hover:bg-accent/10 hover:text-accent hover:border-accent text-xs text-muted font-semibold transition-all"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Column */}
      <div className="lg:col-span-7 bg-card-bg border border-card-border/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-card-border/40 font-bold text-sm text-foreground">
          Daftar Pertanyaan Kuis
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted">
            <thead className="bg-background text-foreground/80 uppercase text-3xs font-bold border-b border-card-border">
              <tr>
                <th className="px-4 py-3">Pertanyaan</th>
                <th className="px-4 py-3 text-center">Kategori</th>
                <th className="px-4 py-3 text-center">Kunci</th>
                <th className="px-4 py-3 text-center">Skor</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/40">
              {quizzes.map((q) => (
                <tr key={q.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground max-w-[180px] truncate">{q.question}</td>
                  <td className="px-4 py-3 text-center text-3xs font-semibold text-muted">{q.category || 'Umum'}</td>
                  <td className="px-4 py-3 text-center"><span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono font-bold text-xs">{q.correct_answer}</span></td>
                  <td className="px-4 py-3 text-center">{q.score}</td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(q)}
                      className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-semibold text-3xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="px-2.5 py-1 rounded bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all font-semibold text-3xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">Belum ada pertanyaan kuis terdaftar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
