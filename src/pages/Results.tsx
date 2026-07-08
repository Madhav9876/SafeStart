import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, RefreshCw, Loader2, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { calculateScores, getOverallScore, getMaturityLabel, getTopRisks, generateRecommendations } from '../lib/scoring';
import MaturityRadarChart from '../components/RadarChart';
import ScoreCard from '../components/ScoreCard';
import ActionItem from '../components/ActionItem';
import type { DimensionScore, RecommendationSource } from '../lib/scoring';
import { fallbackRecommendations, fallbackResources } from '../lib/fallbackData';
import type { ResourceItem } from '../lib/fallbackData';
import { getLocalReport } from '../lib/localReports';
import supabase from '../lib/supabase';

interface Submission {
  id: string;
  product_type: string;
  answers: Record<string, string>;
  user_id?: string | null;
  created_at: string;
}

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const reportRef = useRef<HTMLDivElement>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const localReport = id ? getLocalReport(id) : null;
        if (localReport) {
          setSubmission(localReport);
          setRecommendations(fallbackRecommendations);
          setResources(fallbackResources);
          return;
        }

        const session = supabase ? await supabase.auth.getSession() : null;
        const token = session?.data.session?.access_token;
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        const [subRes, recRes, resRes] = await Promise.all([
          fetch(`/api/submissions?id=${id}`, { headers }),
          fetch('/api/recommendations'),
          fetch('/api/resources'),
        ]);

        if (subRes.status === 401) throw new Error('Sign in to view this report');
        if (!subRes.ok) throw new Error('Failed to load report');

        const subData = await subRes.json();
        const recData = await recRes.json();
        const resData = await resRes.json();

        setSubmission(subData);
        setRecommendations(recData);
        setResources(resData);
      } catch (err: unknown) {
        const localReport = id ? getLocalReport(id) : null;
        if (localReport) {
          setSubmission(localReport);
          setRecommendations(fallbackRecommendations);
          setResources(fallbackResources);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load report');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const scores: DimensionScore[] = submission
    ? calculateScores(submission.product_type, submission.answers)
    : [];
  const overallScore = scores.length ? getOverallScore(scores) : 0;
  const maturityLabel = getMaturityLabel(overallScore);
  const topRisks = getTopRisks(scores);
  const actionItems = submission
    ? generateRecommendations(submission.product_type, scores, recommendations)
    : [];

  const getResourcesForIds = (ids: number[]) => {
    return resources.filter((r) => ids.includes(r.id));
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setPdfLoading(true);

    const container = document.createElement('div');
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const reportClone = reportRef.current.cloneNode(true) as HTMLElement;

      container.style.position = 'fixed';
      container.style.left = '-10000px';
      container.style.top = '0';
      container.style.width = '1100px';
      container.style.background = 'white';
      container.style.pointerEvents = 'none';
      container.appendChild(reportClone);
      document.body.appendChild(container);

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `SafeStart-AI-Report-${id}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const },
      };
      await html2pdf().set(opt).from(reportClone).save();
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Sorry, the PDF could not be generated. Please try again.');
    } finally {
      container.remove();
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
          <p className="text-[var(--text-muted)]">Building your report...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 transition-colors">
        <div className="bg-[var(--surface)] rounded-3xl p-8 border border-[var(--border)] max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-[var(--text)] mb-2">Report not found</h2>
          <p className="text-[var(--text-muted)] mb-6">{error || 'We could not load this report.'}</p>
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 bg-[var(--text)] hover:bg-[var(--primary)] text-[var(--bg)] font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Take the Quiz
          </Link>
        </div>
      </div>
    );
  }

  const productTypeLabels: Record<string, string> = {
    text_chat: 'Text/Chat AI',
    code_ai: 'Code AI',
    multimodal: 'Multimodal AI',
    decision: 'Decision/Scoring AI',
    embedded: 'Embedded AI',
    provider: 'Open-source/API Provider',
  };
  const productTypeLabel = productTypeLabels[submission.product_type] || submission.product_type;

  return (
    <div className="min-h-screen bg-[var(--bg)] py-8 md:py-12 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print">
          <div>
            <Link to="/quiz" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] mb-2">
              <ArrowLeft className="w-4 h-4" />
              Take quiz again
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text)]">Your AI Safety Maturity Report</h1>
            <p className="text-[var(--text-muted)] mt-1">
              Product type: <span className="font-semibold text-[var(--text)]">{productTypeLabel}</span>
            </p>
          </div>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="inline-flex items-center justify-center gap-2 bg-[var(--text)] disabled:bg-[var(--surface-2)] disabled:text-[var(--text-muted)] hover:bg-[var(--primary)] text-[var(--bg)] font-semibold px-6 py-3 rounded-full transition-colors"
          >
            {pdfLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {pdfLoading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>

        <div ref={reportRef} className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-6 md:p-10 space-y-12 transition-colors">
          {/* Overall Score */}
          <section className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--primary)] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Overall Maturity
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-44 h-44 flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] border-4 border-[var(--border)] mb-5">
                <span className="text-6xl font-serif font-extrabold text-[var(--primary)]">{overallScore}%</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-[var(--text)]">{maturityLabel}</h2>
              <p className="text-[var(--text-muted)] max-w-xl mx-auto mt-3">
                Your startup is in the <strong className="text-[var(--text)]">{maturityLabel}</strong> stage of AI safety maturity. Focus on the action items below to close the highest-impact gaps.
              </p>
            </div>
          </section>

          {/* Top Risks */}
          {topRisks.length > 0 && (
            <section>
              <h3 className="text-2xl font-serif font-bold text-[var(--text)] mb-5 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
                Top Risk Areas
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {topRisks.map((risk) => (
                  <div key={risk.key} className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 rounded-2xl p-5">
                    <p className="text-sm text-rose-700 dark:text-rose-300 font-semibold">{risk.label}</p>
                    <p className="text-3xl font-serif font-bold text-rose-600 dark:text-rose-400">{risk.percentage}%</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Radar + Score Cards */}
          <section className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h3 className="text-2xl font-serif font-bold text-[var(--text)] mb-5">Maturity by Dimension</h3>
              <MaturityRadarChart scores={scores} />
            </div>
            <div className="space-y-4">
              {scores.map((score) => (
                <ScoreCard key={score.key} score={score} />
              ))}
            </div>
          </section>

          {/* Action Items */}
          <section>
            <h3 className="text-2xl font-serif font-bold text-[var(--text)] mb-5 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Prioritized Action Plan
            </h3>
            <div className="space-y-4">
              {actionItems.length > 0 ? (
                actionItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ActionItem
                      priority={item.priority}
                      title={item.title}
                      description={item.description}
                      dimensionLabel={scores.find((s) => s.key === item.dimension)?.label || item.dimension}
                      resources={getResourcesForIds(item.resourceIds)}
                    />
                  </motion.div>
                ))
              ) : (
                <p className="text-[var(--text-muted)]">Great work — no major gaps identified. Keep maintaining your practices.</p>
              )}
            </div>
          </section>

          {/* Footer for PDF */}
          <div className="pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--text-muted)]">
            Generated by SafeStart · This report is for self-assessment and educational purposes only.
          </div>
        </div>
      </div>
    </div>
  );
}
