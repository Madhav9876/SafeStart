import type { AnswerMap } from './scoring';

export interface StoredReport {
  id: string;
  product_type: string;
  answers: AnswerMap;
  user_id: string | null;
  created_at: string;
}

const STORAGE_KEY = 'safestart:reports';

function readReports(): StoredReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeReports(reports: StoredReport[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function saveLocalReport(productType: string, answers: AnswerMap, userId: string | null = null): StoredReport {
  const report: StoredReport = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    product_type: productType,
    answers,
    user_id: userId,
    created_at: new Date().toISOString(),
  };

  writeReports([report, ...readReports()]);
  return report;
}

export function getLocalReport(id: string): StoredReport | null {
  return readReports().find((report) => report.id === id) || null;
}

export function getLocalReports(): StoredReport[] {
  return readReports();
}
