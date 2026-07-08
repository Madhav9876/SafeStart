import type { DimensionScore } from '../lib/scoring';

interface ScoreCardProps {
  score: DimensionScore;
}

const levelColors: Record<string, string> = {
  Nascent: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
  Developing: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900',
  Mature: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
  Leading: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900',
};

export default function ScoreCard({ score }: ScoreCardProps) {
  return (
    <div className="bg-[var(--bg)] rounded-2xl border border-[var(--border)] p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-serif font-semibold text-[var(--text)]">{score.label}</h3>
          <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${levelColors[score.level]}`}>
            {score.level}
          </span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-serif font-bold" style={{ color: score.color }}>
            {score.percentage}%
          </span>
        </div>
      </div>
      <div className="w-full bg-[var(--surface-2)] rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-1000"
          style={{ width: `${score.percentage}%`, backgroundColor: score.color }}
        ></div>
      </div>
    </div>
  );
}
