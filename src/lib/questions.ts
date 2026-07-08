export interface Option {
  value: string;
  label: string;
  score: number;
}

export interface Question {
  id: string;
  dimension: string;
  text: string;
  explanation?: string;
  weight: number;
  options: Option[];
}

export const productTypes = [
  { value: 'text_chat', label: 'Text/Chat AI', description: 'Customer support, content generation, chatbots, writing assistants' },
  { value: 'code_ai', label: 'Code AI', description: 'Coding assistants, dev tools, automated code review' },
  { value: 'multimodal', label: 'Multimodal AI', description: 'Image, video, or audio generation and editing' },
  { value: 'decision', label: 'Decision/Scoring AI', description: 'Credit, hiring, recommendations, ranking, risk scoring' },
  { value: 'embedded', label: 'Embedded AI', description: 'AI features inside an existing product or workflow' },
  { value: 'provider', label: 'Open-source/API Provider', description: 'Providing model weights, APIs, or infrastructure to others' },
];

export const baseDimensions = [
  { key: 'governance', color: '#4f46e5' },
  { key: 'data', color: '#0d9488' },
  { key: 'model', color: '#8b5cf6' },
  { key: 'evaluation', color: '#ec4899' },
  { key: 'monitoring', color: '#64748b' },
  { key: 'users', color: '#10b981' },
];

export const dimensionLabelsByProductType: Record<string, Record<string, string>> = {
  text_chat: {
    governance: 'Chatbot Governance & Accountability',
    data: 'Conversation Data & Privacy',
    model: 'Chatbot Model & Guardrails',
    evaluation: 'Response Evaluation & Testing',
    monitoring: 'Chat Monitoring & Incident Response',
    users: 'User Transparency & Safety',
  },
  code_ai: {
    governance: 'Code AI Governance & Accountability',
    data: 'Code Data & IP Practices',
    model: 'Secure Code Generation',
    evaluation: 'Code Evaluation & Testing',
    monitoring: 'Code AI Monitoring & Response',
    users: 'Developer Transparency & Safety',
  },
  multimodal: {
    governance: 'Media Governance & Accountability',
    data: 'Media Data & Rights',
    model: 'Media Model & Guardrails',
    evaluation: 'Media Evaluation & Testing',
    monitoring: 'Media Monitoring & Incident Response',
    users: 'Audience Transparency & Safety',
  },
  decision: {
    governance: 'Decision Governance & Accountability',
    data: 'Decision Data & Privacy',
    model: 'Decision Model & Explainability',
    evaluation: 'Fairness Evaluation & Testing',
    monitoring: 'Decision Monitoring & Response',
    users: 'Affected-User Transparency',
  },
  embedded: {
    governance: 'Feature Governance & Accountability',
    data: 'Feature Data & Privacy',
    model: 'Embedded Model & Vendor Safety',
    evaluation: 'Feature Evaluation & Testing',
    monitoring: 'Feature Monitoring & Response',
    users: 'User Transparency & Safety',
  },
  provider: {
    governance: 'Release Governance & Accountability',
    data: 'Training Data & Privacy',
    model: 'Model Release & Mitigations',
    evaluation: 'Safety Evaluation & Testing',
    monitoring: 'API Monitoring & Incident Response',
    users: 'Downstream Transparency',
  },
};

export function getDimensions(productType: string) {
  const labels = dimensionLabelsByProductType[productType] || dimensionLabelsByProductType.text_chat;
  return baseDimensions.map((d) => ({
    key: d.key,
    label: labels[d.key],
    color: d.color,
  }));
}

// Kept for backward compatibility with non-product contexts
export const dimensions = getDimensions('text_chat');

export const maturityLevels = [
  { min: 0, max: 25, label: 'Nascent', description: 'Foundational practices are largely absent. Start with quick wins.' },
  { min: 26, max: 50, label: 'Developing', description: 'Some practices exist but are informal or incomplete.' },
  { min: 51, max: 75, label: 'Mature', description: 'Solid governance and risk controls are in place.' },
  { min: 76, max: 100, label: 'Leading', description: 'Robust, repeatable AI safety practices ready for scale.' },
];

const maturityOptions: Option[] = [
  { value: 'yes_documented', label: 'Yes — documented and reviewed', score: 3 },
  { value: 'yes_informal', label: 'Yes — informal', score: 2 },
  { value: 'planning', label: 'Planning to implement', score: 1 },
  { value: 'no', label: 'No', score: 0 },
];

const yesNoOptions: Option[] = [
  { value: 'yes', label: 'Yes', score: 3 },
  { value: 'partial', label: 'Partially / planning', score: 1 },
  { value: 'no', label: 'No', score: 0 },
];

const modelSourceOptions: Option[] = [
  { value: 'api', label: 'Third-party API', score: 2 },
  { value: 'fine_tune', label: 'Fine-tuned open or third-party model', score: 2 },
  { value: 'build', label: 'Build from scratch', score: 2 },
  { value: 'mixed', label: 'Mixed approach', score: 2 },
];

const q = (id: string, dimension: string, text: string, explanation: string, weight: number, options: Option[]): Question => ({
  id,
  dimension,
  text,
  explanation,
  weight,
  options,
});

const questionsByProductType: Record<string, Question[]> = {
  text_chat: [
    // Governance & Accountability (6)
    q('tc_gov_owner', 'governance', 'Is there a specific person accountable for chatbot safety and content policy decisions?', 'Chatbots can generate harmful or off-brand content; clear ownership ensures fast, consistent decisions.', 3, maturityOptions),
    q('tc_gov_policy', 'governance', 'Do you have a published content policy or acceptable use policy for your chatbot?', 'A content policy sets boundaries for users and guides moderation decisions.', 2, maturityOptions),
    q('tc_gov_capabilities', 'governance', 'Do you assess risks before enabling new chatbot capabilities (e.g., web access, file upload, memory)?', 'New capabilities expand the attack surface and can enable misuse.', 3, maturityOptions),
    q('tc_gov_documentation', 'governance', 'Do you document AI safety decisions and review them on a regular cadence?', 'Documented decisions create accountability and help onboard new team members.', 2, maturityOptions),
    q('tc_gov_leadership', 'governance', 'Does your leadership or board understand the chatbot’s risk profile?', 'Leadership awareness ensures safety is resourced and prioritized.', 2, yesNoOptions),
    q('tc_gov_legal', 'governance', 'Do you review legal and regulatory requirements for chatbots in your target jurisdictions?', 'Chatbots are increasingly regulated for transparency, data use, and prohibited content.', 2, maturityOptions),

    // Data Practices & Privacy (6)
    q('tc_data_training', 'data', 'Do you know what text data your chatbot model was trained or fine-tuned on?', 'Training data provenance affects copyright, privacy, and bias risk for text models.', 3, maturityOptions),
    q('tc_data_retention', 'data', 'Do you have a clear retention and deletion policy for user conversations?', 'Conversations may contain sensitive personal or business information.', 2, maturityOptions),
    q('tc_data_consent', 'data', 'Do you obtain consent or have rights to use customer conversations for training or improvement?', 'Using chats to train models without clear rights can violate privacy expectations.', 3, yesNoOptions),
    q('tc_data_access', 'data', 'Do you restrict internal access to conversation logs and embeddings?', 'Limiting access reduces insider risk and supports privacy-by-design.', 2, maturityOptions),
    q('tc_data_quality', 'data', 'Do you assess training and fine-tuning data for quality, bias, or toxic content?', 'Low-quality or biased data directly degrades chatbot behavior.', 2, maturityOptions),
    q('tc_data_privacy', 'data', 'Do you conduct privacy impact assessments for chatbot data processing?', 'Privacy impact assessments identify compliance gaps before launch.', 2, maturityOptions),

    // Model Development & Sourcing (6)
    q('tc_model_source', 'model', 'How do you source your chatbot model?', 'Different sourcing approaches carry different supply-chain and control risks.', 1, modelSourceOptions),
    q('tc_model_guardrails', 'model', 'Do you have guardrails against harmful, biased, or off-brand chatbot outputs?', 'Guardrails (filters, prompt engineering, refusals) are a first line of defense.', 3, maturityOptions),
    q('tc_model_injection', 'model', 'Do you defend against prompt injection and jailbreak attempts?', 'Prompt injection can hijack instructions or leak system prompts.', 3, maturityOptions),
    q('tc_model_versions', 'model', 'Do you track versions of models, prompts, and fine-tunes?', 'Version control enables rollbacks and root-cause analysis.', 2, maturityOptions),
    q('tc_model_limitations', 'model', 'Do you document model limitations and intended use cases?', 'Clear documentation helps teams and users understand what the chatbot should not do.', 2, maturityOptions),
    q('tc_model_vendor', 'model', 'Do you evaluate third-party API safety practices and incident history?', 'Vendor diligence reduces downstream risk.', 2, maturityOptions),

    // Evaluation & Testing (6)
    q('tc_eval_safety', 'evaluation', 'Do you evaluate chatbot outputs for safety before deployment?', 'Safety evaluation catches harmful outputs before users see them.', 3, maturityOptions),
    q('tc_eval_hallucination', 'evaluation', 'Do you test for hallucinations or factual errors in chatbot responses?', 'Hallucinations are a top failure mode for text/chat AI.', 3, maturityOptions),
    q('tc_eval_redteam', 'evaluation', 'Do you conduct red-teaming or adversarial testing on the chatbot?', 'Red-teaming finds failure modes that standard testing misses.', 2, maturityOptions),
    q('tc_eval_benchmarks', 'evaluation', 'Do you benchmark chatbot performance on tasks relevant to your use case?', 'Benchmarks help measure progress and regressions.', 2, maturityOptions),
    q('tc_eval_personas', 'evaluation', 'Do you test chatbot behavior across different user personas, languages, or edge cases?', 'Behavior can vary significantly across demographics and contexts.', 2, maturityOptions),
    q('tc_eval_human', 'evaluation', 'Do you perform human review of high-stakes or failure-mode conversations?', 'Human review catches subtleties that automated metrics miss.', 2, maturityOptions),

    // Monitoring & Incident Response (6)
    q('tc_mon_logs', 'monitoring', 'Do you log chatbot conversations and key decisions in production?', 'Logs are essential for incident response and continuous improvement.', 3, maturityOptions),
    q('tc_mon_abuse', 'monitoring', 'Do you monitor for abuse, policy violations, or anomalous usage?', 'Monitoring detects misuse patterns after deployment.', 3, maturityOptions),
    q('tc_mon_drift', 'monitoring', 'Do you monitor output quality, relevance, or drift over time?', 'Models can degrade as user behavior or content changes.', 2, maturityOptions),
    q('tc_mon_incident', 'monitoring', 'Do you have an incident response plan for harmful chatbot outputs or data leaks?', 'A plan reduces response time when things go wrong.', 2, maturityOptions),
    q('tc_mon_reports', 'monitoring', 'Do you track and review user-reported harmful or inaccurate outputs?', 'User reports are a leading indicator of safety gaps.', 2, maturityOptions),
    q('tc_mon_postmortem', 'monitoring', 'Do you conduct post-incident reviews and update controls?', 'Post-incident reviews turn incidents into improvements.', 2, maturityOptions),

    // User Safety & Transparency (6)
    q('tc_user_disclosure', 'users', 'Do users know they are interacting with an AI chatbot?', 'Transparency builds trust and is increasingly required by regulation.', 3, maturityOptions),
    q('tc_user_feedback', 'users', 'Can users report harmful, inaccurate, or unwanted chatbot outputs?', 'User feedback surfaces failures that internal testing misses.', 2, maturityOptions),
    q('tc_user_limitations', 'users', 'Do you disclose key limitations (e.g., may hallucinate, not legal/medical advice)?', 'Clear limitations reduce misuse and set expectations.', 2, maturityOptions),
    q('tc_user_controls', 'users', 'Do users have controls over chatbot behavior, memory, or data?', 'Controls increase user agency and trust.', 2, maturityOptions),
    q('tc_user_vulnerable', 'users', 'Do you have safeguards for vulnerable users (e.g., minors, at-risk groups)?', 'Vulnerable users may be disproportionately harmed by chatbot failures.', 2, maturityOptions),
    q('tc_user_restrictions', 'users', 'Do you enforce age or content restrictions where appropriate?', 'Restrictions reduce exposure to harmful or age-inappropriate content.', 2, maturityOptions),
  ],

  code_ai: [
    // Governance & Accountability (6)
    q('ca_gov_owner', 'governance', 'Is there a specific person accountable for AI-generated code safety?', 'Generated code can introduce security risks; ownership ensures oversight.', 3, maturityOptions),
    q('ca_gov_policy', 'governance', 'Do you have an acceptable use policy for AI coding assistants in your team?', 'Policies reduce shadow AI and set guardrails for developers.', 2, maturityOptions),
    q('ca_gov_autonomy', 'governance', 'Do you assess risks before enabling autonomous code generation or auto-commit features?', 'Higher autonomy increases the risk of vulnerabilities reaching production.', 3, maturityOptions),
    q('ca_gov_documentation', 'governance', 'Do you document code-AI safety decisions and review them regularly?', 'Documentation supports consistency and auditability.', 2, maturityOptions),
    q('ca_gov_leadership', 'governance', 'Does your leadership understand the security risks of AI-generated code?', 'Leadership awareness drives investment in review and tooling.', 2, yesNoOptions),
    q('ca_gov_legal', 'governance', 'Do you review legal and IP requirements for AI-generated code?', 'Generated code may raise copyright, licensing, and liability questions.', 2, maturityOptions),

    // Data Practices & Privacy (6)
    q('ca_data_training', 'data', 'Do you know what code repositories or datasets your model was trained on?', 'Training data affects licensing, copyright, and vulnerability exposure.', 3, maturityOptions),
    q('ca_data_retention', 'data', 'Do you control retention of code snippets sent to AI coding tools?', 'Proprietary code should not be retained or used to train models without agreement.', 3, maturityOptions),
    q('ca_data_licensing', 'data', 'Have you reviewed licensing and IP risks of AI-generated or AI-assisted code?', 'Generated code can reproduce copyrighted or copyleft-licensed material.', 2, yesNoOptions),
    q('ca_data_access', 'data', 'Do you restrict access to code sent to or generated by AI tools?', 'Access controls protect proprietary code and generated artifacts.', 2, maturityOptions),
    q('ca_data_proprietary', 'data', 'Do your vendor contracts prevent use of your proprietary code for model training?', 'Contracts should prevent vendors from training on your code.', 3, yesNoOptions),
    q('ca_data_quality', 'data', 'Do you assess the quality and security of training code data?', 'Low-quality training code can lead to insecure suggestions.', 2, maturityOptions),

    // Model Development & Sourcing (6)
    q('ca_model_source', 'model', 'How do you source your code AI model?', 'Different sourcing approaches carry different supply-chain and control risks.', 1, modelSourceOptions),
    q('ca_model_patterns', 'model', 'Do you block or warn on generation of code patterns known to be dangerous?', 'Guardrails reduce the chance of insecure code being generated.', 3, maturityOptions),
    q('ca_model_malware', 'model', 'Do you have guardrails against generating malware, exploits, or insecure configurations?', 'Code AI can be misused to create harmful software.', 3, maturityOptions),
    q('ca_model_versions', 'model', 'Do you track versions of models, prompts, and generated code artifacts?', 'Version control enables rollbacks and root-cause analysis.', 2, maturityOptions),
    q('ca_model_limitations', 'model', 'Do you document model limitations for code generation?', 'Clear limitations help developers apply appropriate review.', 2, maturityOptions),
    q('ca_model_vendor', 'model', 'Do you evaluate vendor safety practices and incident history?', 'Vendor diligence reduces downstream risk.', 2, maturityOptions),

    // Evaluation & Testing (6)
    q('ca_eval_security', 'evaluation', 'Do you scan AI-generated code for security vulnerabilities before merge?', 'Generated code can contain exploitable vulnerabilities.', 3, maturityOptions),
    q('ca_eval_correctness', 'evaluation', 'Do you test generated code for correctness and edge cases?', 'Functional correctness prevents bugs in production systems.', 3, maturityOptions),
    q('ca_eval_redteam', 'evaluation', 'Do you test your coding assistant against attempts to generate malware or exploits?', 'Red-teaming reveals safety gaps in code-generation systems.', 2, maturityOptions),
    q('ca_eval_benchmarks', 'evaluation', 'Do you benchmark code quality, performance, or style?', 'Benchmarks help measure improvement and regressions.', 2, maturityOptions),
    q('ca_eval_languages', 'evaluation', 'Do you test generated code across the programming languages you support?', 'Quality can vary significantly by language and framework.', 2, maturityOptions),
    q('ca_eval_review', 'evaluation', 'Do you require human review for high-risk generated code?', 'Human review catches subtle security and design issues.', 2, maturityOptions),

    // Monitoring & Incident Response (6)
    q('ca_mon_logs', 'monitoring', 'Do you log AI-generated code suggestions and accepted/rejected outcomes?', 'Logs help identify patterns of insecure or low-quality suggestions.', 3, maturityOptions),
    q('ca_mon_abuse', 'monitoring', 'Do you monitor for anomalous or malicious use of your code AI tool?', 'Monitoring detects attempts to generate harmful code at scale.', 3, maturityOptions),
    q('ca_mon_trends', 'monitoring', 'Do you monitor code quality and security trends over time?', 'Trends reveal whether AI code is improving or degrading.', 2, maturityOptions),
    q('ca_mon_incident', 'monitoring', 'Do you have an incident response plan for vulnerabilities introduced by AI-generated code?', 'A plan reduces response time when insecure code reaches production.', 2, maturityOptions),
    q('ca_mon_security', 'monitoring', 'Do you track security incidents related to generated code?', 'Incident tracking links AI-generated code to real security outcomes.', 2, maturityOptions),
    q('ca_mon_postmortem', 'monitoring', 'Do you conduct post-incident reviews and update controls?', 'Post-incident reviews turn incidents into improvements.', 2, maturityOptions),

    // User Safety & Transparency (6)
    q('ca_user_disclosure', 'users', 'Do developers know when they are using AI-generated code suggestions?', 'Transparency helps developers apply appropriate review rigor.', 3, maturityOptions),
    q('ca_user_feedback', 'users', 'Can developers report bad, insecure, or incorrect code suggestions?', 'Developer feedback improves model outputs and surfaces risks.', 2, maturityOptions),
    q('ca_user_limitations', 'users', 'Do you communicate that AI-generated code must be reviewed and tested?', 'Clear limitations reduce blind trust in generated code.', 2, maturityOptions),
    q('ca_user_review', 'users', 'Do you enforce review requirements for generated code?', 'Mandatory review prevents insecure code from being merged.', 3, maturityOptions),
    q('ca_user_guidance', 'users', 'Do you provide secure coding guidance alongside AI suggestions?', 'Guidance helps developers avoid common vulnerabilities.', 2, maturityOptions),
    q('ca_user_overreliance', 'users', 'Do you protect junior developers from over-relying on AI-generated code?', 'Over-reliance can erode code quality and security awareness.', 2, maturityOptions),
  ],

  multimodal: [
    // Governance & Accountability (6)
    q('mm_gov_owner', 'governance', 'Is there a specific person accountable for media generation safety and content policy?', 'Generated media can enable deception and harm; clear ownership is critical.', 3, maturityOptions),
    q('mm_gov_policy', 'governance', 'Do you have and publish a content policy for generated images, video, or audio?', 'A content policy sets boundaries and guides enforcement.', 3, maturityOptions),
    q('mm_gov_capabilities', 'governance', 'Do you assess risks before enabling high-risk capabilities (e.g., photorealistic faces, voice cloning)?', 'Higher-fidelity media increases misuse and regulatory risk.', 3, maturityOptions),
    q('mm_gov_documentation', 'governance', 'Do you document media-generation safety decisions and review them regularly?', 'Documentation supports accountability and consistency.', 2, maturityOptions),
    q('mm_gov_leadership', 'governance', 'Does your leadership understand media generation misuse risks?', 'Leadership awareness ensures safety is prioritized and resourced.', 2, yesNoOptions),
    q('mm_gov_regulatory', 'governance', 'Do you review platform and content regulations in your target markets?', 'Media generation faces emerging regulations worldwide.', 2, maturityOptions),

    // Data Practices & Privacy (6)
    q('mm_data_training', 'data', 'Do you know what image, video, or audio data your model was trained on?', 'Media training data raises copyright, consent, and likeness concerns.', 3, maturityOptions),
    q('mm_data_retention', 'data', 'Do you have a retention and deletion policy for uploaded and generated media?', 'Media may include personal, proprietary, or sensitive content.', 2, maturityOptions),
    q('mm_data_rights', 'data', 'Do you have rights or consent for likenesses, art, or media used in training?', 'Using artist or personal likeness without rights creates legal and reputational risk.', 3, yesNoOptions),
    q('mm_data_access', 'data', 'Do you restrict access to sensitive media data?', 'Access controls protect user uploads and training data.', 2, maturityOptions),
    q('mm_data_curation', 'data', 'Do you curate training data to remove harmful, illegal, or non-consensual content?', 'Curated data reduces the chance of generating harmful media.', 3, maturityOptions),
    q('mm_data_privacy', 'data', 'Do you assess privacy risks of user-uploaded media?', 'Uploaded media may reveal identity, location, or sensitive contexts.', 2, maturityOptions),

    // Model Development & Sourcing (6)
    q('mm_model_source', 'model', 'How do you source your multimodal model?', 'Different sourcing approaches carry different supply-chain and control risks.', 1, modelSourceOptions),
    q('mm_model_guardrails', 'model', 'Do you have guardrails to block generation of harmful, sexual, or deceptive media?', 'Guardrails reduce harmful and policy-violating outputs.', 3, maturityOptions),
    q('mm_model_watermark', 'model', 'Do you apply provenance signals or watermarks to AI-generated media?', 'Provenance signals help users and platforms identify AI-generated content.', 3, maturityOptions),
    q('mm_model_versions', 'model', 'Do you track versions of models, prompts, and fine-tunes?', 'Version control enables rollbacks and root-cause analysis.', 2, maturityOptions),
    q('mm_model_limitations', 'model', 'Do you document limitations and intended use cases?', 'Clear documentation helps users understand appropriate use.', 2, maturityOptions),
    q('mm_model_vendor', 'model', 'Do you evaluate vendor safety practices and incident history?', 'Vendor diligence reduces downstream risk.', 2, maturityOptions),

    // Evaluation & Testing (6)
    q('mm_eval_safety', 'evaluation', 'Do you evaluate generated media for safety and policy violations before deployment?', 'Safety evaluation catches harmful media before users see it.', 3, maturityOptions),
    q('mm_eval_bias', 'evaluation', 'Do you test for demographic bias or stereotypes in generated media?', 'Media models can reinforce harmful stereotypes.', 3, maturityOptions),
    q('mm_eval_redteam', 'evaluation', 'Do you red-team your media generator against deepfake, CSAM, or disinformation use cases?', 'Red-teaming reveals severe misuse risks specific to media generation.', 2, maturityOptions),
    q('mm_eval_quality', 'evaluation', 'Do you benchmark visual, audio, or video quality and fidelity?', 'Quality benchmarks help detect regressions.', 2, maturityOptions),
    q('mm_eval_cultures', 'evaluation', 'Do you test generated media across demographics and cultures?', 'Bias and harm can vary across populations.', 2, maturityOptions),
    q('mm_eval_edge', 'evaluation', 'Do you review edge-case failure modes (e.g., text-in-image, partial faces)?', 'Edge cases often reveal the most harmful outputs.', 2, maturityOptions),

    // Monitoring & Incident Response (6)
    q('mm_mon_logs', 'monitoring', 'Do you log prompts and generated media in production?', 'Logs are essential for investigations and abuse detection.', 3, maturityOptions),
    q('mm_mon_abuse', 'monitoring', 'Do you monitor for policy violations, viral harmful content, or coordinated abuse?', 'Monitoring catches misuse that spreads quickly.', 3, maturityOptions),
    q('mm_mon_drift', 'monitoring', 'Do you monitor output quality and policy compliance over time?', 'Models can drift in quality or safety behavior.', 2, maturityOptions),
    q('mm_mon_incident', 'monitoring', 'Do you have an incident response plan for viral harmful or deceptive media?', 'A plan enables fast takedown and communication when harmful media spreads.', 2, maturityOptions),
    q('mm_mon_takedown', 'monitoring', 'Do you track takedown requests and user reports?', 'Reports are a leading indicator of policy gaps.', 2, maturityOptions),
    q('mm_mon_postmortem', 'monitoring', 'Do you conduct post-incident reviews and update controls?', 'Post-incident reviews turn incidents into improvements.', 2, maturityOptions),

    // User Safety & Transparency (6)
    q('mm_user_disclosure', 'users', 'Do users know media is AI-generated and can they verify its origin?', 'Transparency reduces deception and aligns with emerging regulations.', 3, maturityOptions),
    q('mm_user_feedback', 'users', 'Can users report harmful, deceptive, or non-consensual generated media?', 'User reporting is critical for identifying policy violations.', 2, maturityOptions),
    q('mm_user_limitations', 'users', 'Do you disclose limitations (e.g., may depict fake people, not photorealistic truth)?', 'Clear limitations reduce misuse and set expectations.', 2, maturityOptions),
    q('mm_user_controls', 'users', 'Do users control whether outputs are public, private, or watermarked?', 'Controls increase user agency and reduce harm.', 2, maturityOptions),
    q('mm_user_minors', 'users', 'Do you protect minors from generating harmful or age-inappropriate content?', 'Minors may be particularly vulnerable to harmful media.', 2, maturityOptions),
    q('mm_user_restrictions', 'users', 'Do you enforce content and age restrictions?', 'Restrictions reduce exposure to harmful content.', 2, maturityOptions),
  ],

  decision: [
    // Governance & Accountability (6)
    q('d_gov_owner', 'governance', 'Is there a specific person accountable for fairness and accountability of AI decisions?', 'Decision AI can affect rights and opportunities; clear ownership is essential.', 3, maturityOptions),
    q('d_gov_fairness', 'governance', 'Do you have a fairness review process for decisions that affect people?', 'A review process ensures affected groups are considered before deployment.', 3, maturityOptions),
    q('d_gov_impact', 'governance', 'Do you conduct impact assessments before deploying high-stakes scoring or decision systems?', 'Impact assessments are increasingly required for consequential AI systems.', 3, maturityOptions),
    q('d_gov_documentation', 'governance', 'Do you document fairness and risk decisions?', 'Documentation supports accountability and audits.', 2, maturityOptions),
    q('d_gov_leadership', 'governance', 'Does your leadership understand decision-AI risks?', 'Leadership awareness ensures fairness is prioritized.', 2, yesNoOptions),
    q('d_gov_law', 'governance', 'Do you review anti-discrimination and consumer-protection law requirements?', 'Decision systems face heightened legal scrutiny.', 2, maturityOptions),

    // Data Practices & Privacy (6)
    q('d_data_training', 'data', 'Do you know what historical decision data your model was trained on?', 'Historical data may encode past discrimination or bias.', 3, maturityOptions),
    q('d_data_retention', 'data', 'Do you have a retention and access-control policy for decision inputs and outputs?', 'Decision data is often sensitive and subject to regulatory requirements.', 2, maturityOptions),
    q('d_data_lawful', 'data', 'Do you have a lawful basis or consent to use personal data for automated decisions?', 'Automated decision-making often has heightened legal protections.', 3, yesNoOptions),
    q('d_data_access', 'data', 'Do you restrict access to sensitive decision data?', 'Access controls protect applicants, borrowers, and other affected individuals.', 2, maturityOptions),
    q('d_data_representative', 'data', 'Do you assess whether training data is representative and free from historical bias?', 'Unrepresentative data produces unfair decisions.', 3, maturityOptions),
    q('d_data_privacy', 'data', 'Do you conduct privacy impact assessments for decision data?', 'Privacy impact assessments identify compliance gaps.', 2, maturityOptions),

    // Model Development & Sourcing (6)
    q('d_model_source', 'model', 'How do you source your decision model?', 'Different sourcing approaches carry different supply-chain and control risks.', 1, modelSourceOptions),
    q('d_model_explain', 'model', 'Can you explain the key factors behind an individual AI decision?', 'Explainability is critical for appeals, audits, and trust.', 3, maturityOptions),
    q('d_model_guardrails', 'model', 'Do you have guardrails to prevent automated decisions in sensitive or uncertain cases?', 'Escalation paths protect people from erroneous automated decisions.', 3, maturityOptions),
    q('d_model_versions', 'model', 'Do you track versions of models and decision logic?', 'Version control enables rollbacks and root-cause analysis.', 2, maturityOptions),
    q('d_model_confidence', 'model', 'Do you document confidence levels and decision limitations?', 'Clear documentation supports human review and appeals.', 2, maturityOptions),
    q('d_model_vendor', 'model', 'Do you evaluate vendor fairness practices and model documentation?', 'Vendor diligence reduces downstream risk.', 2, maturityOptions),

    // Evaluation & Testing (6)
    q('d_eval_fairness', 'evaluation', 'Do you test for demographic bias and disparate impact in decisions?', 'Fairness testing helps prevent discrimination.', 3, maturityOptions),
    q('d_eval_accuracy', 'evaluation', 'Do you validate accuracy, precision, and error rates across different groups?', 'Performance can vary across populations and must be measured.', 3, maturityOptions),
    q('d_eval_manipulation', 'evaluation', 'Do you adversarially test for manipulation or gaming of decision inputs?', 'Decision systems can be gamed if inputs are observable.', 2, maturityOptions),
    q('d_eval_baseline', 'evaluation', 'Do you benchmark the AI decision process against human or baseline processes?', 'Benchmarking ensures the AI is actually an improvement.', 2, maturityOptions),
    q('d_eval_groups', 'evaluation', 'Do you test performance across protected groups?', 'Disparate performance can lead to discrimination.', 2, maturityOptions),
    q('d_eval_edge', 'evaluation', 'Do you review rejected, borderline, and overturned decisions?', 'Edge decisions often reveal fairness problems.', 2, maturityOptions),

    // Monitoring & Incident Response (6)
    q('d_mon_logs', 'monitoring', 'Do you log decision inputs, model outputs, and overrides in production?', 'Logs are essential for audits, appeals, and incident response.', 3, maturityOptions),
    q('d_mon_drift', 'monitoring', 'Do you monitor for drift in outcomes or fairness metrics over time?', 'Models can degrade or become unfair as populations change.', 3, maturityOptions),
    q('d_mon_overrides', 'monitoring', 'Do you monitor override, reversal, and appeal rates?', 'High override rates may indicate model problems.', 2, maturityOptions),
    q('d_mon_incident', 'monitoring', 'Do you have an incident response plan for discriminatory or harmful decisions?', 'A plan enables fast remediation and communication.', 2, maturityOptions),
    q('d_mon_complaints', 'monitoring', 'Do you track complaints, appeals, and escalations?', 'Complaints are a leading indicator of fairness problems.', 2, maturityOptions),
    q('d_mon_postmortem', 'monitoring', 'Do you conduct post-incident reviews and update controls?', 'Post-incident reviews turn incidents into improvements.', 2, maturityOptions),

    // User Safety & Transparency (6)
    q('d_user_disclosure', 'users', 'Do affected individuals know an AI system is making or influencing the decision?', 'Disclosure is legally required in many jurisdictions.', 3, maturityOptions),
    q('d_user_appeal', 'users', 'Do affected individuals have a way to appeal, correct errors, or request human review?', 'Appeal mechanisms are a key safeguard.', 3, maturityOptions),
    q('d_user_limitations', 'users', 'Do you disclose known limitations and uncertainty of the decision system?', 'Clear limitations help users understand risks.', 2, maturityOptions),
    q('d_user_explain', 'users', 'Do you provide explanations in plain language?', 'Plain-language explanations support meaningful appeals.', 2, maturityOptions),
    q('d_user_vulnerable', 'users', 'Do you protect vulnerable applicants, borrowers, or candidates?', 'Vulnerable individuals may be disproportionately affected.', 2, maturityOptions),
    q('d_user_correction', 'users', 'Do you allow individuals to correct erroneous data used in decisions?', 'Data correction rights are central to fair decision-making.', 2, maturityOptions),
  ],

  embedded: [
    // Governance & Accountability (6)
    q('e_gov_owner', 'governance', 'Is there a specific person accountable for AI features within your product?', 'Embedded AI still needs clear ownership for safety and risk decisions.', 3, maturityOptions),
    q('e_gov_vendor', 'governance', 'Do you have governance processes for selecting and managing AI vendors?', 'Many embedded AI features rely on third-party models and APIs.', 2, maturityOptions),
    q('e_gov_features', 'governance', 'Do you assess risks before adding new AI features to your existing product?', 'New AI features can change user risk exposure.', 3, maturityOptions),
    q('e_gov_documentation', 'governance', 'Do you document AI feature safety decisions?', 'Documentation supports consistency and accountability.', 2, maturityOptions),
    q('e_gov_leadership', 'governance', 'Does your leadership understand embedded AI risks?', 'Leadership awareness ensures AI features are properly resourced.', 2, yesNoOptions),
    q('e_gov_regulatory', 'governance', 'Do you review regulatory requirements for AI features in your markets?', 'Embedded AI may trigger product safety or AI-specific regulations.', 2, maturityOptions),

    // Data Practices & Privacy (6)
    q('e_data_training', 'data', 'Do you know what data third-party or in-house embedded AI models are trained on?', 'Data provenance affects privacy, copyright, and bias risk.', 3, maturityOptions),
    q('e_data_retention', 'data', 'Do you have retention and deletion policies for data processed by AI features?', 'Embedded AI may process user content, inputs, or behavior.', 2, maturityOptions),
    q('e_data_contracts', 'data', 'Do your vendor contracts restrict use of customer data for model training?', 'Contracts should prevent vendors from training on your users’ data.', 3, yesNoOptions),
    q('e_data_access', 'data', 'Do you restrict access to data processed by AI features?', 'Access controls protect user data.', 2, maturityOptions),
    q('e_data_quality', 'data', 'Do you assess data quality for embedded AI features?', 'Poor data quality degrades feature performance and safety.', 2, maturityOptions),
    q('e_data_privacy', 'data', 'Do you conduct privacy impact assessments for AI features?', 'Privacy impact assessments identify compliance gaps.', 2, maturityOptions),

    // Model Development & Sourcing (6)
    q('e_model_source', 'model', 'How do you source AI capabilities for your embedded features?', 'Different sourcing approaches carry different supply-chain and control risks.', 1, modelSourceOptions),
    q('e_model_vendor', 'model', 'Do you evaluate vendor safety practices, model cards, and incident history?', 'Vendor diligence reduces downstream risk.', 3, maturityOptions),
    q('e_model_guardrails', 'model', 'Do you have guardrails to prevent embedded AI features from causing harm?', 'Guardrails protect users even when relying on vendor models.', 3, maturityOptions),
    q('e_model_versions', 'model', 'Do you track vendor model versions and changes?', 'Vendor changes can affect your product and users.', 2, maturityOptions),
    q('e_model_limitations', 'model', 'Do you document limitations of embedded AI features?', 'Clear documentation helps users understand appropriate use.', 2, maturityOptions),
    q('e_model_fallback', 'model', 'Do you have fallback behavior when the AI feature fails or is unavailable?', 'Fallbacks prevent product breakage and user harm.', 2, maturityOptions),

    // Evaluation & Testing (6)
    q('e_eval_integration', 'evaluation', 'Do you test AI features within the full product workflow before release?', 'Integration testing catches issues that isolated model tests miss.', 3, maturityOptions),
    q('e_eval_safety', 'evaluation', 'Do you evaluate safety and edge cases specific to your product context?', 'Safety in context matters more than generic model benchmarks.', 3, maturityOptions),
    q('e_eval_vendor', 'evaluation', 'Do you require or review vendor safety evaluations and model cards?', 'Vendor transparency helps you assess embedded risk.', 2, maturityOptions),
    q('e_eval_ux', 'evaluation', 'Do you benchmark user experience and accuracy of AI features?', 'UX benchmarks ensure features actually help users.', 2, maturityOptions),
    q('e_eval_segments', 'evaluation', 'Do you test AI features across user segments?', 'Feature behavior can vary across user populations.', 2, maturityOptions),
    q('e_eval_failures', 'evaluation', 'Do you review integration failure modes (e.g., timeouts, errors, wrong outputs)?', 'Integration failures can degrade the whole product experience.', 2, maturityOptions),

    // Monitoring & Incident Response (6)
    q('e_mon_logs', 'monitoring', 'Do you log inputs, outputs, and errors from embedded AI features?', 'Logs are essential for debugging and incident response.', 3, maturityOptions),
    q('e_mon_vendor', 'monitoring', 'Do you monitor vendor model changes, downtime, or incident disclosures?', 'Vendor changes can affect your product and users.', 3, maturityOptions),
    q('e_mon_performance', 'monitoring', 'Do you monitor feature performance and user friction?', 'Performance degradation can signal model or integration issues.', 2, maturityOptions),
    q('e_mon_incident', 'monitoring', 'Do you have an incident response plan for AI feature failures?', 'A plan reduces downtime and user harm when embedded AI fails.', 2, maturityOptions),
    q('e_mon_complaints', 'monitoring', 'Do you track user complaints about AI-powered features?', 'Complaints surface issues specific to your product.', 2, maturityOptions),
    q('e_mon_postmortem', 'monitoring', 'Do you conduct post-incident reviews and update controls?', 'Post-incident reviews turn incidents into improvements.', 2, maturityOptions),

    // User Safety & Transparency (6)
    q('e_user_disclosure', 'users', 'Do users know which product features are powered by AI?', 'Transparency builds trust and helps users make informed choices.', 3, maturityOptions),
    q('e_user_feedback', 'users', 'Can users report problems with AI-powered features?', 'Feedback loops surface issues specific to your product.', 2, maturityOptions),
    q('e_user_limitations', 'users', 'Do you disclose limitations of AI features within your product?', 'Clear limitations reduce misuse and set expectations.', 2, maturityOptions),
    q('e_user_override', 'users', 'Can users disable or override AI features?', 'User control increases trust and reduces harm.', 2, maturityOptions),
    q('e_user_vulnerable', 'users', 'Do you protect vulnerable users from AI feature failures?', 'Vulnerable users may be disproportionately affected by failures.', 2, maturityOptions),
    q('e_user_availability', 'users', 'Do you communicate clearly when AI features are unavailable or degraded?', 'Clear communication prevents confusion and misuse.', 2, maturityOptions),
  ],

  provider: [
    // Governance & Accountability (6)
    q('p_gov_owner', 'governance', 'Is there a specific person accountable for model safety and release decisions?', 'Providers face amplified risk because downstream users build on their models.', 3, maturityOptions),
    q('p_gov_policy', 'governance', 'Do you have a published usage policy and enforcement process?', 'Usage policies set boundaries for downstream deployers.', 3, maturityOptions),
    q('p_gov_release', 'governance', 'Do you conduct release-readiness or frontier-risk assessments before publishing models?', 'Release-readiness reviews help prevent harmful capabilities from spreading.', 3, maturityOptions),
    q('p_gov_documentation', 'governance', 'Do you document release decisions and safety reviews?', 'Documentation supports accountability and consistency.', 2, maturityOptions),
    q('p_gov_leadership', 'governance', 'Does your leadership understand downstream misuse risks?', 'Leadership awareness ensures safety is prioritized for providers.', 2, yesNoOptions),
    q('p_gov_legal', 'governance', 'Do you review legal obligations for model providers in your jurisdictions?', 'Providers face emerging liability and regulatory obligations.', 2, maturityOptions),

    // Data Practices & Privacy (6)
    q('p_data_training', 'data', 'Do you publish or document the sources and curation of training data?', 'Downstream users and regulators increasingly expect training-data transparency.', 3, maturityOptions),
    q('p_data_retention', 'data', 'Do you have clear policies for retaining or deleting API inputs and outputs?', 'API users need clarity on whether their data is stored or used for training.', 2, maturityOptions),
    q('p_data_rights', 'data', 'Do you ensure you have rights to use training data and respect opt-outs?', 'Copyright and opt-out compliance reduce legal risk for providers.', 3, yesNoOptions),
    q('p_data_access', 'data', 'Do you restrict access to sensitive training data?', 'Access controls protect proprietary datasets.', 2, maturityOptions),
    q('p_data_harmful', 'data', 'Do you assess training data for harmful, illegal, or non-consensual content?', 'Harmful training data can lead to harmful model outputs.', 3, maturityOptions),
    q('p_data_datasheet', 'data', 'Do you publish data sheets, nutrition labels, or provenance records?', 'Data documentation helps downstream users assess risk.', 2, maturityOptions),

    // Model Development & Sourcing (6)
    q('p_model_card', 'model', 'Do you publish model cards covering capabilities, limitations, and risks?', 'Model cards are the primary transparency tool for downstream users.', 3, maturityOptions),
    q('p_model_versions', 'model', 'Do you version models and communicate changes or deprecations to users?', 'Versioning and changelogs help downstream users manage updates.', 2, maturityOptions),
    q('p_model_mitigations', 'model', 'Do you implement safety mitigations (e.g., refusals, filters, post-training) before release?', 'Providers are responsible for reducing dangerous capabilities at the source.', 3, maturityOptions),
    q('p_model_lineage', 'model', 'Do you track model lineage and training runs?', 'Lineage supports reproducibility and incident analysis.', 2, maturityOptions),
    q('p_model_failures', 'model', 'Do you document known failure modes and out-of-scope uses?', 'Documented limitations help deployers use the model safely.', 2, maturityOptions),
    q('p_model_guardrails', 'model', 'Do you evaluate what downstream guardrails deployers will need?', 'Providers should anticipate deployment-side safety needs.', 2, maturityOptions),

    // Evaluation & Testing (6)
    q('p_eval_safety', 'evaluation', 'Do you publish safety evaluations and benchmarks for your model?', 'Published evaluations let downstream users assess risk.', 3, maturityOptions),
    q('p_eval_redteam', 'evaluation', 'Do you conduct structured red-teaming or external audits before release?', 'Red-teaming surfaces risks that internal evaluations miss.', 3, maturityOptions),
    q('p_eval_dual', 'evaluation', 'Do you evaluate for dual-use or dangerous capabilities (e.g., cyber, bio, manipulation)?', 'Frontier models may enable novel harms that require special testing.', 3, maturityOptions),
    q('p_eval_capabilities', 'evaluation', 'Do you benchmark general capabilities and limitations?', 'Capability benchmarks help deployers understand model scope.', 2, maturityOptions),
    q('p_eval_languages', 'evaluation', 'Do you test across languages, domains, and use cases?', 'Performance and safety vary across contexts.', 2, maturityOptions),
    q('p_eval_changelog', 'evaluation', 'Do you maintain evaluation changelogs across model versions?', 'Changelogs help downstream users track safety changes.', 2, maturityOptions),

    // Monitoring & Incident Response (6)
    q('p_mon_logs', 'monitoring', 'Do you log API usage to detect misuse or policy violations?', 'Usage monitoring helps enforce policies and respond to incidents.', 3, maturityOptions),
    q('p_mon_misuse', 'monitoring', 'Do you have a misuse reporting and response process?', 'Downstream users and the public need a way to report harmful use.', 3, maturityOptions),
    q('p_mon_emergent', 'monitoring', 'Do you monitor for emergent capabilities or failure modes post-release?', 'New risks can appear after deployment at scale.', 2, maturityOptions),
    q('p_mon_incident', 'monitoring', 'Do you have an incident response plan for model misuse or safety failures?', 'A plan enables coordinated response across downstream deployers.', 2, maturityOptions),
    q('p_mon_communication', 'monitoring', 'Do you communicate safety updates and incident findings to downstream users?', 'Timely communication helps deployers protect their users.', 2, maturityOptions),
    q('p_mon_postmortem', 'monitoring', 'Do you conduct post-incident reviews and update controls?', 'Post-incident reviews turn incidents into improvements.', 2, maturityOptions),

    // User Safety & Transparency (6)
    q('p_user_disclosure', 'users', 'Do you clearly communicate to deployers that outputs are AI-generated?', 'Deployers need clear information to meet their own transparency obligations.', 3, maturityOptions),
    q('p_user_guidance', 'users', 'Do you provide deployment guidance (e.g., guardrails, use-case restrictions) to downstream users?', 'Guidance helps deployers use the model safely.', 2, maturityOptions),
    q('p_user_limitations', 'users', 'Do you clearly document known limitations and failure modes?', 'Documented limitations help deployers set user expectations.', 2, maturityOptions),
    q('p_user_terms', 'users', 'Do your terms require or encourage safe deployment practices?', 'Terms of use can reduce downstream misuse.', 2, maturityOptions),
    q('p_user_research', 'users', 'Do you support independent researchers studying model safety?', 'Independent research improves ecosystem safety.', 2, maturityOptions),
    q('p_user_changelog', 'users', 'Do you maintain a transparent changelog and safety notices?', 'Changelogs help deployers stay informed.', 2, maturityOptions),
  ],
};

export function getQuestionsForProductType(productType: string): Question[] {
  return questionsByProductType[productType] || [];
}
