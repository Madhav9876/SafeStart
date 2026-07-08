export interface ResourceItem {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  dimension: string;
}

export interface RecommendationItem {
  id: number;
  dimension: string;
  min_score: number;
  max_score: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  resource_ids: number[];
  product_types: string[];
}

export const fallbackResources: ResourceItem[] = [
  {
    id: 1,
    title: 'AI Risk Management Framework',
    description: 'A practical framework for mapping, measuring, managing, and governing AI risks.',
    url: 'https://www.nist.gov/itl/ai-risk-management-framework',
    category: 'framework',
    dimension: 'governance',
  },
  {
    id: 2,
    title: 'Data Protection Impact Assessment',
    description: 'A template-style guide for evaluating privacy risks before processing sensitive user data.',
    url: 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/',
    category: 'template',
    dimension: 'data',
  },
  {
    id: 3,
    title: 'OWASP LLM Top 10',
    description: 'Common security risks for applications that use large language models.',
    url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
    category: 'guide',
    dimension: 'model',
  },
  {
    id: 4,
    title: 'Model Cards',
    description: 'A lightweight documentation pattern for model capabilities, limitations, and intended use.',
    url: 'https://modelcards.withgoogle.com/about',
    category: 'template',
    dimension: 'model',
  },
  {
    id: 5,
    title: 'AI Evaluation Playbook',
    description: 'Plan safety, reliability, fairness, and task-performance checks before launch.',
    url: 'https://www.nist.gov/artificial-intelligence',
    category: 'guide',
    dimension: 'evaluation',
  },
  {
    id: 6,
    title: 'Incident Response Plan',
    description: 'A starting point for defining ownership, severity, escalation, and post-incident review.',
    url: 'https://www.cisa.gov/resources-tools/resources/incident-response-plan-irp-basics',
    category: 'template',
    dimension: 'monitoring',
  },
  {
    id: 7,
    title: 'Plain-Language AI Notices',
    description: 'Guidance for making AI use, limitations, and user choices understandable.',
    url: 'https://www.ftc.gov/business-guidance/blog/2023/06/keep-your-ai-claims-check',
    category: 'guide',
    dimension: 'users',
  },
  {
    id: 8,
    title: 'Responsible AI Toolkit',
    description: 'Tools and practices for issue tracking, assessment, transparency, and review.',
    url: 'https://www.microsoft.com/en-us/ai/responsible-ai-resources',
    category: 'tool',
    dimension: 'governance',
  },
];

const dimensionCopy: Record<string, { title: string; description: string; resources: number[] }> = {
  governance: {
    title: 'Assign clear AI safety ownership',
    description: 'Name a responsible owner, document launch decisions, and set a recurring review cadence for AI safety risks.',
    resources: [1, 8],
  },
  data: {
    title: 'Tighten data rights and privacy controls',
    description: 'Document what data is collected, how long it is kept, who can access it, and whether it can be used for training.',
    resources: [2],
  },
  model: {
    title: 'Document model limits and add guardrails',
    description: 'Track model sources and versions, record known limitations, and add safeguards for misuse, unsafe outputs, and vendor changes.',
    resources: [3, 4],
  },
  evaluation: {
    title: 'Create a launch evaluation checklist',
    description: 'Test the AI feature against realistic tasks, edge cases, adversarial prompts, and high-risk user journeys before release.',
    resources: [5],
  },
  monitoring: {
    title: 'Set up monitoring and incident response',
    description: 'Log important events, monitor for abuse or drift, and define how the team responds when the AI behaves badly.',
    resources: [6],
  },
  users: {
    title: 'Improve user transparency and controls',
    description: 'Tell users where AI is involved, explain important limitations, and provide a way to report problems or opt out when appropriate.',
    resources: [7],
  },
};

export const fallbackRecommendations: RecommendationItem[] = Object.entries(dimensionCopy).flatMap(
  ([dimension, copy], index) => [
    {
      id: index * 3 + 1,
      dimension,
      min_score: 0,
      max_score: 30,
      priority: 'critical',
      title: copy.title,
      description: copy.description,
      resource_ids: copy.resources,
      product_types: [],
    },
    {
      id: index * 3 + 2,
      dimension,
      min_score: 31,
      max_score: 60,
      priority: 'high',
      title: copy.title,
      description: copy.description,
      resource_ids: copy.resources,
      product_types: [],
    },
    {
      id: index * 3 + 3,
      dimension,
      min_score: 61,
      max_score: 100,
      priority: 'medium',
      title: `Strengthen ${copy.title.toLowerCase()}`,
      description: copy.description,
      resource_ids: copy.resources,
      product_types: [],
    },
  ],
);
