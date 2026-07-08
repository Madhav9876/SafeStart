import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { productTypes, getQuestionsForProductType } from '../lib/questions';
import type { AnswerMap } from '../lib/scoring';
import QuestionCard from '../components/QuestionCard';
import { useAuth } from '../contexts/AuthContext';
import { saveLocalReport } from '../lib/localReports';
import supabase from '../lib/supabase';

export default function Quiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [productType, setProductType] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = productType ? getQuestionsForProductType(productType) : [];
  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + (started ? 1 : 0)) / (questions.length + 1)) * 100 : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex, started, productType]);

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!productType) {
      setStarted(true);
      return;
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      finishQuiz();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      setStarted(false);
      setProductType(null);
    }
  };

  const finishQuiz = async () => {
    if (!productType) return;
    setSaving(true);
    setError(null);

    try {
      const session = supabase && user ? await supabase.auth.getSession() : null;
      const token = session?.data.session?.access_token;

      if (!token) {
        const localReport = saveLocalReport(productType, answers, user?.id || null);
        navigate(`/results/${localReport.id}`);
        return;
      }

      const payload = {
        product_type: productType,
        answers,
      };

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save submission');

      const data = await res.json();
      navigate(`/results/${data.id}`);
    } catch {
      const localReport = saveLocalReport(productType, answers, user?.id || null);
      navigate(`/results/${localReport.id}`);
    }
  };

  const canProceed = productType ? !!answers[currentQuestion?.id] : !!productType;

  const selectedProduct = productTypes.find((t) => t.value === productType);

  if (!started) {
    return (
      <div className="min-h-screen bg-[var(--bg)] py-16 px-4 transition-colors">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text)] mb-5">What are you building?</h1>
            <p className="text-[var(--text-muted)] text-lg">
              We tailor the assessment to your product type and risk profile.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {productTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setProductType(type.value)}
                className={`text-left p-6 rounded-2xl border-2 transition-all ${
                  productType === type.value
                    ? 'border-[var(--primary)] bg-[var(--surface)] shadow-lg shadow-indigo-500/10'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50 hover:bg-[var(--surface-2)]'
                }`}
              >
                <h3 className="font-serif font-bold text-xl text-[var(--text)] mb-2">{type.label}</h3>
                <p className="text-sm text-[var(--text-muted)]">{type.description}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStarted(true)}
              disabled={!productType}
              className="inline-flex items-center gap-2 bg-[var(--text)] disabled:bg-[var(--surface-2)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed hover:bg-[var(--primary)] text-[var(--bg)] font-semibold px-8 py-4 rounded-full transition-colors"
            >
              Start Quiz
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[var(--bg)] transition-colors overflow-hidden">
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-4 md:py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 md:mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] text-xs md:text-sm">
            Assessment for
            <span className="font-bold text-[var(--primary)]">{selectedProduct?.label}</span>
          </div>
          <button
            onClick={() => {
              setStarted(false);
              setProductType(null);
              setAnswers({});
              setCurrentIndex(0);
            }}
            className="text-xs md:text-sm text-[var(--text-muted)] hover:text-[var(--primary)] underline underline-offset-4"
          >
            Change product type
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4 md:mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs md:text-sm font-medium text-[var(--text-muted)]">Progress</span>
            <span className="text-xs md:text-sm font-bold text-[var(--primary)]">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-[var(--surface-2)] rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[var(--primary)] to-violet-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 -mr-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="pb-4"
            >
              <QuestionCard
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={handleAnswer}
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
              />
            </motion.div>
          </AnimatePresence>
          {error && (
            <div className="mt-3 p-3 md:p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Navigation */}
      <div className="flex-shrink-0 bg-[var(--surface)]/90 backdrop-blur-md border-t border-[var(--border)] px-4 py-3 md:py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] font-medium px-4 py-2 rounded-full hover:bg-[var(--surface-2)] transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed || saving}
            className="inline-flex items-center gap-2 bg-[var(--text)] disabled:bg-[var(--surface-2)] disabled:text-[var(--text-muted)] dark:disabled:bg-stone-800 disabled:cursor-not-allowed hover:bg-[var(--primary)] text-[var(--bg)] font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-full transition-colors text-sm md:text-base"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                Saving...
              </>
            ) : currentIndex === questions.length - 1 ? (
              <>
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                Get Report
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
