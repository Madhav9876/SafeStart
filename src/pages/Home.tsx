import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  ClipboardCheck,
  BarChart3,
  FileDown,
  BookOpen,
  ArrowRight,
  Sparkles,
  Users,
  Lock,
  Eye,
  BrainCircuit,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: ClipboardCheck,
    title: 'Adaptive questions',
    description: 'Each AI product type gets its own tailored assessment, not a generic checklist.',
  },
  {
    icon: BarChart3,
    title: 'Dimensional scoring',
    description: 'See exactly where you stand across governance, data, model, evaluation, monitoring, and user safety.',
  },
  {
    icon: Shield,
    title: 'Prioritized actions',
    description: 'Get ranked, practical next steps instead of dense framework documents.',
  },
  {
    icon: FileDown,
    title: 'Exportable reports',
    description: 'Download a polished PDF to share with investors, regulators, or your board.',
  },
  {
    icon: BookOpen,
    title: 'Curated resources',
    description: 'Every recommendation links to current guides, templates, and tools.',
  },
  {
    icon: Zap,
    title: 'Startup-ready',
    description: 'Designed for lean teams who need governance without a compliance department.',
  },
];

const dimensions = [
  { icon: Users, label: 'Governance & Accountability' },
  { icon: Lock, label: 'Data Practices & Privacy' },
  { icon: BrainCircuit, label: 'Model Development & Sourcing' },
  { icon: ClipboardCheck, label: 'Evaluation & Testing' },
  { icon: Eye, label: 'Monitoring & Incident Response' },
  { icon: Shield, label: 'User Safety & Transparency' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] transition-colors overflow-x-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-200/40 to-indigo-200/40 dark:from-violet-900/20 dark:to-indigo-900/20 blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-teal-200/30 to-indigo-200/30 dark:from-teal-900/15 dark:to-indigo-900/15 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-soft)] border border-teal-200 dark:border-teal-900 text-[var(--accent)] text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                Free AI safety self-assessment
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[var(--text)] mb-8 leading-[1.05]">
                Safer AI, <br />
                <span className="italic text-[var(--primary)]">built from day one.</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-muted)] mb-10 leading-relaxed max-w-xl">
                SafeStart helps early-stage AI startups understand their safety and compliance gaps through a tailored, interactive maturity quiz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/quiz"
                  className="group inline-flex items-center justify-center gap-2 bg-[var(--text)] text-[var(--bg)] hover:bg-[var(--primary)] font-semibold px-8 py-4 rounded-full transition-all text-lg"
                >
                  Start the Quiz
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/resources"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] font-semibold px-8 py-4 rounded-full transition-colors text-lg"
                >
                  Browse Resources
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative bg-[var(--surface)] rounded-[2rem] border border-[var(--border)] p-8 shadow-2xl shadow-stone-900/5 dark:shadow-black/30 rotate-1">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-serif font-bold text-2xl text-[var(--text)]">Maturity overview</h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">Mature</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Governance', value: 72 },
                    { label: 'Data practices', value: 58 },
                    { label: 'Model safety', value: 84 },
                    { label: 'Evaluation', value: 65 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[var(--text-muted)]">{item.label}</span>
                        <span className="font-semibold text-[var(--text)]">{item.value}%</span>
                      </div>
                      <div className="h-2.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
                  <p className="text-sm text-[var(--text-muted)]">
                    Overall score
                  </p>
                  <p className="text-4xl font-serif font-bold text-[var(--text)]">70%</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-teal-300 to-indigo-300 dark:from-teal-700 dark:to-indigo-700 rounded-full blur-2xl opacity-60" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-24 bg-[var(--surface)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text)] mb-6">Why governance can't wait</h2>
              <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-6">
                Early-stage AI startups rarely have governance experts on staff. But harmful deployments, data mishandling, or regulatory surprises can derail a company overnight.
              </p>
              <p className="text-[var(--text-muted)] text-lg leading-relaxed">
                SafeStart turns complex frameworks into clear questions, actionable scores, and prioritized next steps — so founders can move fast without breaking trust.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="bg-[var(--bg)] rounded-[2rem] p-8 md:p-10 border border-[var(--border)]">
                <h3 className="text-2xl font-serif font-bold text-[var(--text)] mb-8">How it works</h3>
                <div className="grid gap-6">
                  {[
                    { num: '01', title: 'Pick your product type', desc: 'Chat, code, multimodal, decision, embedded, or provider.' },
                    { num: '02', title: 'Answer tailored questions', desc: '36 product-specific questions across six safety dimensions.' },
                    { num: '03', title: 'See your maturity report', desc: 'Radar chart, dimension scores, and top risk areas.' },
                    { num: '04', title: 'Act on prioritized steps', desc: 'Download a PDF and explore curated resources.' },
                  ].map((step) => (
                    <div key={step.num} className="flex gap-5">
                      <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[var(--text)] text-[var(--bg)] flex items-center justify-center font-serif font-bold text-lg">
                        {step.num}
                      </span>
                      <div>
                        <h4 className="font-serif font-bold text-xl text-[var(--text)] mb-1">{step.title}</h4>
                        <p className="text-[var(--text-muted)] text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="py-24 bg-[var(--bg)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">Dimensions</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text)] mt-2">Six areas that matter</h2>
            </div>
            <p className="text-[var(--text-muted)] max-w-md md:text-right">
              The quiz evaluates the areas investors and regulators ask about most.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dimensions.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] hover:border-[var(--primary)]/40 transition-colors"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <d.icon className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[var(--text)]">{d.label}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[var(--surface)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text)] mt-2 mb-5">Everything you need to move fast, safely</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-[var(--bg)] rounded-2xl p-6 border border-[var(--border)] hover:shadow-xl hover:shadow-stone-900/5 dark:hover:shadow-black/20 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[var(--text)] mb-2">{f.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--text)] to-indigo-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-[var(--bg)] mb-6">
            Ready to assess your maturity?
          </h2>
          <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">
            It takes about 10 minutes. No email required unless you want to save your report.
          </p>
          <Link
            to="/quiz"
            className="group inline-flex items-center gap-2 bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--accent)] hover:text-white font-bold px-8 py-4 rounded-full transition-colors text-lg"
          >
            Start the Quiz
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
