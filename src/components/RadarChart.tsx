import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { DimensionScore } from '../lib/scoring';

interface RadarChartProps {
  scores: DimensionScore[];
}

export default function MaturityRadarChart({ scores }: RadarChartProps) {
  const data = scores.map((s) => ({
    subject: s.label.length > 18 ? s.label.split(' ').slice(0, 2).join(' ') : s.label,
    full: s.label,
    A: s.percentage,
    fill: s.color,
  }));

  return (
    <div className="w-full h-80 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="currentColor" className="text-[var(--border)]" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 600 }}
            className="text-[var(--text-muted)]"
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Maturity"
            dataKey="A"
            stroke="#6366f1"
            strokeWidth={3}
            fill="#6366f1"
            fillOpacity={0.25}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-[var(--surface)] p-3 rounded-xl shadow-xl border border-[var(--border)] text-sm">
                    <p className="font-serif font-semibold text-[var(--text)]">{item.full}</p>
                    <p className="text-[var(--primary)] font-bold">{item.A}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
