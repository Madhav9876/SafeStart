import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Calendar,
  ChevronRight,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { calculateScores, getOverallScore, getMaturityLabel } from '../lib/scoring';
import type { DimensionScore } from '../lib/scoring';
import { getLocalReports } from '../lib/localReports';

interface Submission {
  id: string;
  product_type: string;
  answers: Record<string, string>;
  created_at: string;
}

interface EnrichedSubmission extends Submission {
  scores: DimensionScore[];
  overallScore: number;
  maturityLabel: string;
}

const productTypeLabels: Record<string, string> = {
  text_chat: 'Text/Chat AI',
  code_ai: 'Code AI',
  multimodal: 'Multimodal AI',
  decision: 'Decision/Scoring AI',
  embedded: 'Embedded AI',
  provider: 'Open-source/API Provider',
};

function enrichSubmission(sub: Submission): EnrichedSubmission {
  const scores = calculateScores(sub.product_type, sub.answers);
  const overallScore = getOverallScore(scores);
  return {
    ...sub,
    scores,
    overallScore,
    maturityLabel: getMaturityLabel(overallScore),
  };
}

function mergeSubmissions(serverReports: Submission[], localReports: Submission[]): EnrichedSubmission[] {
  const reportsById = new Map<string, Submission>();

  [...serverReports, ...localReports].forEach((report) => {
    reportsById.set(report.id, report);
  });

  return [...reportsById.values()]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(enrichSubmission);
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<EnrichedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [printingId, setPrintingId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const localReports = getLocalReports();

      if (!supabase) {
        setSubmissions(mergeSubmissions([], localReports));
        return;
      }

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const res = await fetch('/api/submissions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load history');

      const data: Submission[] = await res.json();
      setSubmissions(mergeSubmissions(data, localReports));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSubmissions();
  }, [user, authLoading, navigate, fetchSubmissions]);

  const handleDownload = async (sub: EnrichedSubmission) => {
    setPrintingId(sub.id);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const container = document.createElement('div');
      container.innerHTML = buildReportHtml(sub);
      document.body.appendChild(container);
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `SafeStart-AI-Report-${sub.id}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const },
      };
      await html2pdf().set(opt).from(container).save();
      document.body.removeChild(container);
    } catch (err) {
      console.warn('html2pdf failed, falling back to browser print:', err);
      printRef.current!.innerHTML = buildReportHtml(sub);
      window.print();
    } finally {
      setPrintingId(null);
    }
  };

  const buildReportHtml = (sub: EnrichedSubmission) => {
    const date = new Date(sub.created_at).toLocaleDateString();
    const productLabel = productTypeLabels[sub.product_type] || sub.product_type;
    const topRisks = [...sub.scores].sort((a, b) => a.percentage - b.percentage).slice(0, 3);
    return `
      <div style="font-family: 'Playfair Display', Georgia, serif; color: #1c1917; padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 28px; margin-bottom: 8px;">SafeStart AI Maturity Report</h1>
          <p style="color: #78716c;">${productLabel} · ${date}</p>
        </div>
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 48px; font-weight: 800; color: #4f46e5;">${sub.overallScore}%</div>
          <div style="font-size: 20px; font-weight: 600;">${sub.maturityLabel}</div>
        </div>
        <h2 style="font-size: 18px; margin-bottom: 16px;">Dimension Scores</h2>
        ${sub.scores
          .map(
            (s) => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
              <span>${s.label}</span>
              <span style="font-weight: 600;">${s.percentage}% — ${s.level}</span>
            </div>
            <div style="background: #e7e5e4; border-radius: 999px; height: 8px;">
              <div style="background: ${s.color}; width: ${s.percentage}%; height: 8px; border-radius: 999px;"></div>
            </div>
          </div>
        `
          )
          .join('')}
        <h2 style="font-size: 18px; margin-top: 32px; margin-bottom: 16px;">Top Risk Areas</h2>
        <ul style="padding-left: 20px; color: #57534e;">
          ${topRisks.map((r) => `<li>${r.label}: ${r.percentage}%</li>`).join('')}
        </ul>
        <p style="margin-top: 40px; font-size: 12px; color: #78716c; text-align: center;">
          Generated by SafeStart · For self-assessment and educational purposes only.
        </p>
      </div>
    `;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
          <p className="text-[var(--text-muted)]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 transition-colors">
        <div className="bg-[var(--surface)] rounded-3xl p-8 border border-[var(--border)] max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-[var(--text)] mb-2">Could not load history</h2>
          <p className="text-[var(--text-muted)] mb-6">{error}</p>
          <button
            onClick={fetchSubmissions}
            className="inline-flex items-center gap-2 bg-[var(--text)] hover:bg-[var(--primary)] text-[var(--bg)] font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] py-12 px-4 transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text)]">Your Dashboard</h1>
            <p className="text-[var(--text-muted)] mt-1">Review your past assessments and download reports.</p>
          </div>
          <Link
            to="/quiz"
            className="inline-flex items-center justify-center gap-2 bg-[var(--text)] hover:bg-[var(--primary)] text-[var(--bg)] font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Take New Quiz
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-12 text-center">
            <div className="w-16 h-16 bg-[var(--surface-2)] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[var(--text)] mb-2">No reports yet</h2>
            <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
              Once you take the quiz while signed in, your reports will appear here for easy access.
            </p>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-dark)] font-semibold"
            >
              Take your first quiz
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 hover:shadow-xl hover:shadow-stone-900/5 dark:hover:shadow-black/20 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full bg-[var(--surface-2)] text-[var(--primary)] text-xs font-semibold">
                        {productTypeLabels[sub.product_type] || sub.product_type}
                      </span>
                      <span className="text-sm text-[var(--text-muted)] flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(sub.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-3xl font-serif font-extrabold text-[var(--primary)]">{sub.overallScore}%</div>
                      <div>
                        <p className="font-serif font-semibold text-[var(--text)]">{sub.maturityLabel}</p>
                        <p className="text-sm text-[var(--text-muted)]">Overall maturity</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {sub.scores.slice(0, 3).map((s) => (
                        <div key={s.key} className="text-sm">
                          <span className="text-[var(--text-muted)]">{s.label.split(' ')[0]}:</span>{' '}
                          <span className="font-semibold" style={{ color: s.color }}>
                            {s.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to={`/results/${sub.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)] font-medium text-sm transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      View Report
                    </Link>
                    <button
                      onClick={() => handleDownload(sub)}
                      disabled={printingId === sub.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--text)] disabled:bg-[var(--surface-2)] disabled:text-[var(--text-muted)] hover:bg-[var(--primary)] text-[var(--bg)] font-medium text-sm transition-colors"
                    >
                      {printingId === sub.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {printingId === sub.id ? 'Generating...' : 'Download PDF'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div ref={printRef} className="hidden print-only-report" />
      </div>
    </div>
  );
}
