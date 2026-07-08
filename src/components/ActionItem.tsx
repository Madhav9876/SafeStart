import { AlertTriangle, ArrowRight, Flame, ArrowUpCircle, CheckCircle2, Info } from 'lucide-react';

interface ActionItemProps {
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  dimensionLabel: string;
  resources?: { id: number; title: string; url: string; category: string }[];
}

const config = {
  critical: {
    icon: Flame,
    label: 'Critical',
    className: 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100',
    badge: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
  },
  high: {
    icon: AlertTriangle,
    label: 'High Priority',
    className: 'bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-900 text-violet-900 dark:text-violet-100',
    badge: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900',
  },
  medium: {
    icon: ArrowUpCircle,
    label: 'Medium Priority',
    className: 'bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900 text-teal-900 dark:text-teal-100',
    badge: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900',
  },
  low: {
    icon: CheckCircle2,
    label: 'Quick Win',
    className: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
  },
};

export default function ActionItem({ priority, title, description, dimensionLabel, resources = [] }: ActionItemProps) {
  const { icon: Icon, label, className, badge } = config[priority];

  return (
    <div className={`rounded-2xl border p-5 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge}`}>
              {label}
            </span>
            <span className="text-xs opacity-75 flex items-center gap-1">
              <Info className="w-3 h-3" />
              {dimensionLabel}
            </span>
          </div>
          <h4 className="font-serif font-bold text-xl mb-2">{title}</h4>
          <p className="text-sm opacity-90 mb-4 leading-relaxed">{description}</p>

          {resources.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-75">Helpful resources</p>
              <div className="flex flex-wrap gap-2">
                {resources.map((r) => (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/70 dark:bg-stone-900/50 hover:bg-white dark:hover:bg-stone-900 border border-current/20 text-xs font-medium transition-colors"
                  >
                    {r.title}
                    <ArrowRight className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
