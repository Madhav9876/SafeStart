import { useRef, useEffect, useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import type { DimensionScore } from '../lib/scoring';

type Priority = 'critical' | 'high' | 'medium' | 'low';

interface PrintableActionItem {
  id: number | string;
  dimension: string;
  priority: Priority;
  title: string;
  description: string;
  resourceIds: number[];
}

interface PrintableResource {
  id: number;
  title: string;
}

interface PrintableReportProps {
  productTypeLabel: string;
  overallScore: number;
  maturityLabel: string;
  scores: DimensionScore[];
  topRisks: DimensionScore[];
  actionItems: PrintableActionItem[];
  resources: PrintableResource[];
  date: string;
}

const levelColors: Record<string, string> = {
  Nascent: '#e11d48',
  Developing: '#0d9488',
  Mature: '#059669',
  Leading: '#4f46e5',
};

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#e11d48', bg: '#fff1f2' },
  high: { label: 'High Priority', color: '#7c3aed', bg: '#f5f3ff' },
  medium: { label: 'Medium Priority', color: '#0d9488', bg: '#f0fdfa' },
  low: { label: 'Quick Win', color: '#059669', bg: '#ecfdf5' },
};

export default function PrintableReport({
  productTypeLabel,
  overallScore,
  maturityLabel,
  scores,
  topRisks,
  actionItems,
  resources,
  date,
}: PrintableReportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(260);

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      setChartWidth(Math.max(220, Math.min(360, width * 0.45)));
    }
  }, []);

  const getResourcesForIds = (ids: number[]) => resources.filter((r) => ids.includes(r.id));

  const data = scores.map((s) => ({
    subject: s.label.length > 14 ? s.label.split(' ').slice(0, 2).join(' ') : s.label,
    full: s.label,
    A: s.percentage,
  }));

  return (
    <div
      ref={containerRef}
      className="bg-white text-stone-900"
      style={{
        width: '7.4in',
        padding: '0.3in',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '11pt',
        lineHeight: 1.5,
      }}
    >
      {/* Page 1: Cover */}
      <div
        className="page"
        style={{
          height: '9.9in',
          pageBreakAfter: 'always',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '0.5in' }}>
          <div style={{ fontSize: '14pt', color: '#4f46e5', fontWeight: 700, marginBottom: '0.2in' }}>SafeStart AI</div>
          <h1 style={{ fontSize: '28pt', fontWeight: 700, marginBottom: '0.15in', color: '#1c1917' }}>
            AI Safety Maturity Report
          </h1>
          <p style={{ fontSize: '12pt', color: '#57534e', marginBottom: '0.4in' }}>
            {productTypeLabel} · {date}
          </p>
        </div>

        <div
          style={{
            width: '2.6in',
            height: '2.6in',
            borderRadius: '50%',
            border: '6px solid #e0e7ff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.35in',
          }}
        >
          <div style={{ fontSize: '52pt', fontWeight: 800, color: '#4f46e5', lineHeight: 1 }}>{overallScore}%</div>
          <div style={{ fontSize: '14pt', color: '#57534e', marginTop: '0.05in' }}>Overall</div>
        </div>

        <div style={{ marginBottom: '0.5in' }}>
          <h2 style={{ fontSize: '22pt', fontWeight: 700, color: '#1c1917', marginBottom: '0.1in' }}>{maturityLabel}</h2>
          <p style={{ fontSize: '11pt', color: '#57534e', maxWidth: '5.5in' }}>
            Your startup is in the <strong>{maturityLabel}</strong> stage of AI safety maturity. Focus on the action items in this report to close the highest-impact gaps.
          </p>
        </div>

        {topRisks.length > 0 && (
          <div style={{ width: '100%', maxWidth: '6in' }}>
            <h3 style={{ fontSize: '13pt', fontWeight: 700, color: '#1c1917', marginBottom: '0.2in' }}>Top Risk Areas</h3>
            <div style={{ display: 'flex', gap: '0.2in', justifyContent: 'center' }}>
              {topRisks.map((risk) => (
                <div
                  key={risk.key}
                  style={{
                    flex: 1,
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '0.15in',
                    padding: '0.15in',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: '9pt', color: '#be123c', fontWeight: 600, marginBottom: '0.05in' }}>
                    {risk.label}
                  </div>
                  <div style={{ fontSize: '20pt', fontWeight: 700, color: '#e11d48' }}>{risk.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Page 2: Dimensions */}
      <div
        className="page"
        style={{
          height: '9.9in',
          pageBreakAfter: 'always',
          pageBreakInside: 'avoid',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2 style={{ fontSize: '20pt', fontWeight: 700, color: '#1c1917', marginBottom: '0.25in', textAlign: 'center' }}>
          Maturity by Dimension
        </h2>

        <div style={{ display: 'flex', gap: '0.3in', flex: 1, minHeight: 0 }}>
          {/* Chart */}
          <div
            style={{
              flex: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: chartWidth, height: chartWidth }}>
              <RadarChart cx={chartWidth / 2} cy={chartWidth / 2} outerRadius={chartWidth * 0.75 * 0.5} width={chartWidth} height={chartWidth} data={data}>
                <PolarGrid stroke="#e7e5e4" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#57534e', fontSize: 9, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Maturity"
                  dataKey="A"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fill="#4f46e5"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </div>
          </div>

          {/* Score list */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.12in' }}>
            {scores.map((score) => (
              <div
                key={score.key}
                style={{
                  background: '#fafaf9',
                  border: '1px solid #e7e5e4',
                  borderRadius: '0.12in',
                  padding: '0.12in 0.15in',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.06in' }}>
                  <span style={{ fontSize: '10pt', fontWeight: 600, color: '#1c1917' }}>{score.label}</span>
                  <span style={{ fontSize: '12pt', fontWeight: 700, color: score.color }}>{score.percentage}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.1in' }}>
                  <div style={{ flex: 1, background: '#e7e5e4', borderRadius: '999px', height: '6px' }}>
                    <div
                      style={{ width: `${score.percentage}%`, background: score.color, height: '6px', borderRadius: '999px' }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '8pt',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: levelColors[score.level] + '15',
                      color: levelColors[score.level],
                    }}
                  >
                    {score.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page 3+: Action Plan */}
      <div className="page" style={{ minHeight: '9.9in' }}>
        <h2 style={{ fontSize: '20pt', fontWeight: 700, color: '#1c1917', marginBottom: '0.25in', textAlign: 'center' }}>
          Prioritized Action Plan
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18in' }}>
          {actionItems.length > 0 ? (
            actionItems.map((item) => {
              const config = priorityConfig[item.priority];
              const itemResources = getResourcesForIds(item.resourceIds);
              return (
                <div
                  key={item.id}
                  style={{
                    background: config.bg,
                    border: `1px solid ${config.color}40`,
                    borderRadius: '0.12in',
                    padding: '0.15in 0.2in',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.08in', marginBottom: '0.06in' }}>
                    <span
                      style={{
                        fontSize: '8pt',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: config.color + '20',
                        color: config.color,
                      }}
                    >
                      {config.label}
                    </span>
                    <span style={{ fontSize: '8pt', color: '#78716c' }}>{item.dimension}</span>
                  </div>
                  <h3 style={{ fontSize: '13pt', fontWeight: 700, color: '#1c1917', marginBottom: '0.05in' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '10pt', color: '#57534e', marginBottom: itemResources.length > 0 ? '0.1in' : 0 }}>
                    {item.description}
                  </p>
                  {itemResources.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.08in' }}>
                      {itemResources.map((r) => (
                        <span
                          key={r.id}
                          style={{
                            fontSize: '8pt',
                            color: '#4f46e5',
                            background: 'white',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            border: '1px solid #c7d2fe',
                          }}
                        >
                          {r.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: 'center', color: '#57534e' }}>
              Great work — no major gaps identified. Keep maintaining your practices.
            </p>
          )}
        </div>

        <div style={{ marginTop: '0.4in', paddingTop: '0.2in', borderTop: '1px solid #e7e5e4', textAlign: 'center', fontSize: '9pt', color: '#78716c' }}>
          Generated by SafeStart · For self-assessment and educational purposes only.
        </div>
      </div>
    </div>
  );
}
