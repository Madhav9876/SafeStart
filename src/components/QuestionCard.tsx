import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Question } from '../lib/questions';

interface QuestionCardProps {
  question: Question;
  value?: string;
  onChange: (value: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  value,
  onChange,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="bg-[var(--surface)] rounded-2xl md:rounded-3xl border border-[var(--border)] p-5 md:p-8 transition-colors">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
          Question {questionNumber} of {totalQuestions}
        </span>
        {question.explanation && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1 text-xs md:text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{showExplanation ? 'Hide context' : 'Why this matters'}</span>
            {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      <h2 className="text-lg md:text-2xl font-serif font-bold text-[var(--text)] mb-4 md:mb-5 leading-snug">
        {question.text}
      </h2>

      {showExplanation && question.explanation && (
        <div className="mb-4 md:mb-5 p-3 md:p-4 bg-[var(--surface-2)] rounded-xl text-sm text-[var(--text-muted)] border border-[var(--border)]">
          {question.explanation}
        </div>
      )}

      <div className="grid gap-2 md:gap-3">
        {question.options.map((option) => (
          <label
            key={option.value}
            className={`group flex items-start gap-3 p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all ${
              value === option.value
                ? 'border-[var(--primary)] bg-[var(--surface-2)]'
                : 'border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--surface-2)]'
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              value === option.value
                ? 'border-[var(--primary)] bg-[var(--primary)]'
                : 'border-[var(--border)] group-hover:border-[var(--primary)]'
            }`}>
              {value === option.value && <span className="w-2 h-2 rounded-full bg-[var(--bg)]" />}
            </span>
            <span className="text-sm md:text-base text-[var(--text)] font-medium leading-snug">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
