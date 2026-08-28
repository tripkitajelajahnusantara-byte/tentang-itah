'use client';

import { useState } from 'react';
import { Quiz } from '@/lib/db';

interface QuizInterfaceProps {
  questions: Quiz[];
}

export default function QuizInterface({ questions }: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: 'A' | 'B' | 'C' | 'D' }>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(questions.map(q => q.category || 'Umum').filter(Boolean)))];

  const filteredQuestions = selectedCategory === 'Semua' 
    ? questions 
    : questions.filter(q => (q.category || 'Umum') === selectedCategory);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
    setShowExplanation(false);
  };

  if (questions.length === 0) {
    return (
      <div className="bg-card-bg border border-card-border/60 rounded-2xl p-8 text-center text-muted max-w-md mx-auto">
        <svg className="w-12 h-12 mx-auto text-muted/65 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm">Kuis belum siap. Pertanyaan kuis belum diunggah oleh Administrator.</p>
      </div>
    );
  }

  const currentQuestion = filteredQuestions[currentIndex];
  const selectedOption = selectedAnswers[currentIndex];

  const handleOptionSelect = (option: 'A' | 'B' | 'C' | 'D') => {
    if (selectedOption) return; // Can't change answer once selected to keep quiz integrity
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: option
    });
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
    setShowExplanation(false);
  };

  // Score calculations
  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  filteredQuestions.forEach((q, idx) => {
    const ans = selectedAnswers[idx];
    if (ans) {
      if (ans === q.correct_answer) {
        correctCount++;
        totalScore += q.score;
      } else {
        incorrectCount++;
      }
    }
  });

  const maxPossibleScore = filteredQuestions.reduce((sum, q) => sum + q.score, 0);
  const scorePercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  // Custom feedback messages
  const getFeedbackMessage = () => {
    if (scorePercentage === 100) {
      return {
        title: 'Sempurna! 🌟',
        desc: 'Luar biasa! Anda memiliki wawasan kebudayaan Kalimantan Tengah yang sangat mendalam. Anda adalah Pakar Budaya Bumi Tambun Bungai!',
        bgColor: 'bg-primary/10 border-primary',
        textColor: 'text-primary'
      };
    } else if (scorePercentage >= 70) {
      return {
        title: 'Hebat Sekali! 👍',
        desc: 'Pengetahuan Anda mengenai tradisi, seni, dan sejarah Kalimantan Tengah sangat mengesankan. Terus pertahankan!',
        bgColor: 'bg-secondary/10 border-secondary',
        textColor: 'text-secondary'
      };
    } else if (scorePercentage >= 40) {
      return {
        title: 'Bagus! Cukup Baik 📚',
        desc: 'Anda sudah mengetahui dasar-dasar budaya daerah. Mari jelajahi lagi website Tentang Itah untuk memperluas wawasan Anda.',
        bgColor: 'bg-amber-500/10 border-amber-500',
        textColor: 'text-amber-600'
      };
    } else {
      return {
        title: 'Coba Lagi! Semangat 💪',
        desc: 'Jangan berkecil hati. Budaya Kalimantan Tengah sangat luas dan menarik untuk dipelajari. Silakan pelajari materinya kembali dan coba lagi!',
        bgColor: 'bg-accent/10 border-accent',
        textColor: 'text-accent'
      };
    }
  };

  const feedback = getFeedbackMessage();

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto bg-card-bg border border-card-border/80 rounded-2xl shadow-lg p-8 space-y-8 transition-all duration-300">
        <div className="text-center space-y-3">
          <h2 className="font-serif text-3xl font-bold text-foreground">Hasil Kuis Budaya</h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>

        {/* Circular Score Display */}
        <div className="flex flex-col items-center justify-center space-y-2 py-4">
          <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex flex-col items-center justify-center relative overflow-hidden bg-primary/5">
            <span className="text-4xl font-extrabold text-primary">{totalScore}</span>
            <span className="text-3xs text-muted font-bold tracking-wider">SKOR ANDA</span>
          </div>
          <p className="text-xs text-muted font-semibold">Persentase Jawaban Benar: {scorePercentage}%</p>
        </div>

        {/* Performance Feedback Callout */}
        <div className={`p-4 rounded-xl border text-center space-y-2 ${feedback.bgColor}`}>
          <h4 className={`text-base font-bold ${feedback.textColor}`}>{feedback.title}</h4>
          <p className="text-xs text-muted leading-relaxed">{feedback.desc}</p>
        </div>

        {/* Statistics Rows */}
        <div className="border-y border-card-border/40 py-4 divide-y divide-card-border/30 text-sm">
          <div className="flex justify-between py-2.5">
            <span className="text-muted">Total Pertanyaan</span>
            <span className="font-semibold text-foreground">{filteredQuestions.length}</span>
          </div>
          <div className="flex justify-between py-2.5">
            <span className="text-muted">Jawaban Benar</span>
            <span className="font-semibold text-secondary flex items-center gap-1">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {correctCount}
            </span>
          </div>
          <div className="flex justify-between py-2.5">
            <span className="text-muted">Jawaban Salah</span>
            <span className="font-semibold text-accent flex items-center gap-1">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {incorrectCount}
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleRestart}
          className="w-full py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold shadow-md transition-all duration-300 flex justify-center items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
          </svg>
          Coba Kuis Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 justify-center pb-4 border-b border-card-border/40">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4.5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-card-bg text-foreground/80 border-card-border hover:bg-primary/15 hover:text-primary'
            }`}
          >
            {cat === 'Semua' ? 'Semua Paket' : cat}
          </button>
        ))}
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="bg-card-bg border border-card-border/60 rounded-2xl p-8 text-center text-muted max-w-md mx-auto">
          <p className="text-sm">Belum ada pertanyaan terdaftar di kategori ini.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quiz Progress Header */}
          <div className="flex justify-between items-center text-sm font-semibold text-muted">
            <span>Pertanyaan {currentIndex + 1} dari {filteredQuestions.length}</span>
            <span className="text-primary font-bold">Skor: {totalScore}</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-card-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
            />
          </div>

          {/* Active Question Card */}
          <div className="bg-card-bg border border-card-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-snug">
          {currentQuestion.question}
        </h2>

        {/* Options list */}
        <div className="grid grid-cols-1 gap-4">
          {(['A', 'B', 'C', 'D'] as const).map((opt) => {
            const isOptSelected = selectedOption === opt;
            const isCorrectAnswer = currentQuestion.correct_answer === opt;
            const isWrongSelection = isOptSelected && !isCorrectAnswer;

            let buttonClass = 'bg-background hover:bg-primary/5 border-card-border hover:border-primary text-foreground/80';
            let checkIcon = null;

            if (selectedOption) {
              if (isCorrectAnswer) {
                // Correct answer glows green
                buttonClass = 'bg-secondary/10 border-secondary text-secondary font-semibold';
                checkIcon = (
                  <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                );
              } else if (isWrongSelection) {
                // Wrong selection glows red
                buttonClass = 'bg-accent/10 border-accent text-accent font-semibold';
                checkIcon = (
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                );
              } else {
                // Non-selected wrong options get disabled opacity
                buttonClass = 'bg-background opacity-50 border-card-border text-foreground/50 cursor-not-allowed';
              }
            }

            const getOptionText = () => {
              if (opt === 'A') return currentQuestion.option_a;
              if (opt === 'B') return currentQuestion.option_b;
              if (opt === 'C') return currentQuestion.option_c;
              return currentQuestion.option_d;
            };

            return (
              <button
                key={opt}
                disabled={Boolean(selectedOption)}
                onClick={() => handleOptionSelect(opt)}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between gap-3 text-sm sm:text-base transition-all duration-300 ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isOptSelected 
                      ? 'bg-primary text-white' 
                      : 'bg-card-border/40 text-muted'
                  }`}>
                    {opt}
                  </span>
                  <span>{getOptionText()}</span>
                </div>
                {checkIcon}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation Box (appears after answer selected) */}
        {showExplanation && (
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl space-y-2 animate-fade-in">
            <span className="text-3xs font-bold text-primary uppercase tracking-wider block">Pembahasan Budaya:</span>
            <p className="text-xs text-muted leading-relaxed">
              {currentQuestion.explanation || 'Jawaban Anda telah tercatat. Teruslah belajar untuk mengenal budaya Kalimantan Tengah.'}
            </p>
          </div>
        )}

        {/* Action row */}
        {selectedOption && (
          <div className="flex justify-end pt-4 border-t border-card-border/40">
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all duration-300 shadow-sm flex items-center gap-1.5"
            >
              {currentIndex < filteredQuestions.length - 1 ? 'Pertanyaan Berikutnya' : 'Selesaikan Kuis'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
          </div>
        </div>
      )}
    </div>
  );
}
