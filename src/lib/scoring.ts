import { getDimensions, maturityLevels, getQuestionsForProductType } from './questions';

export interface AnswerMap {
  [questionId: string]: string;
}

export interface DimensionScore {
  key: string;
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: string;
  color: string;
}

export interface RecommendationResult {
  id: number;
  dimension: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  resourceIds: number[];
}

export interface RecommendationSource {
  id: number;
  dimension: string;
  min_score: number;
  max_score: number;
  priority: RecommendationResult['priority'];
  title: string;
  description: string;
  resource_ids?: number[];
  product_types?: string[];
}

export function calculateScores(productType: string, answers: AnswerMap): DimensionScore[] {
  const relevantQuestions = getQuestionsForProductType(productType);
  const dimensions = getDimensions(productType);
  const dimensionMap = new Map<string, { score: number; max: number }>();

  dimensions.forEach((d) => dimensionMap.set(d.key, { score: 0, max: 0 }));

  relevantQuestions.forEach((q) => {
    const answer = answers[q.id];
    if (!answer) return;
    const option = q.options.find((o) => o.value === answer);
    if (!option) return;

    const current = dimensionMap.get(q.dimension)!;
    current.score += option.score * q.weight;
    current.max += 3 * q.weight;
  });

  return dimensions.map((d) => {
    const { score, max } = dimensionMap.get(d.key)!;
    const percentage = max > 0 ? Math.round((score / max) * 100) : 0;
    const level = maturityLevels.find((l) => percentage >= l.min && percentage <= l.max)?.label || 'Nascent';
    return {
      key: d.key,
      label: d.label,
      score,
      maxScore: max,
      percentage,
      level,
      color: d.color,
    };
  });
}

export function getOverallScore(scores: DimensionScore[]): number {
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length);
}

export function getMaturityLabel(percentage: number): string {
  return maturityLevels.find((l) => percentage >= l.min && percentage <= l.max)?.label || 'Nascent';
}

export function getPriorityLevel(percentage: number): 'critical' | 'high' | 'medium' | 'low' {
  if (percentage < 30) return 'critical';
  if (percentage < 50) return 'high';
  if (percentage < 75) return 'medium';
  return 'low';
}

export function generateRecommendations(
  productType: string,
  scores: DimensionScore[],
  recommendations: RecommendationSource[]
): RecommendationResult[] {
  const applicable = recommendations.filter((r) => {
    if (r.product_types && r.product_types.length > 0 && !r.product_types.includes(productType)) {
      return false;
    }
    const score = scores.find((s) => s.key === r.dimension);
    if (!score) return false;
    return score.percentage >= r.min_score && score.percentage <= r.max_score;
  });

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return applicable
    .sort((a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder])
    .slice(0, 10)
    .map((r) => ({
      id: r.id,
      dimension: r.dimension,
      priority: r.priority,
      title: r.title,
      description: r.description,
      resourceIds: r.resource_ids || [],
    }));
}

export function getTopRisks(scores: DimensionScore[], count = 3): DimensionScore[] {
  return [...scores].sort((a, b) => a.percentage - b.percentage).slice(0, count);
}
