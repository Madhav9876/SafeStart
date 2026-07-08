import { useEffect, useState, useMemo } from 'react';
import { BookOpen, ExternalLink, Loader2, Search, Tag } from 'lucide-react';
import { baseDimensions } from '../lib/questions';
import { fallbackResources } from '../lib/fallbackData';

interface Resource {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  dimension: string;
}

const categories = ['All', 'Guide', 'Template', 'Tool', 'Framework'];

const genericDimensions = baseDimensions.map((d) => ({
  key: d.key,
  color: d.color,
  label: {
    governance: 'Governance & Accountability',
    data: 'Data Practices & Privacy',
    model: 'Model Development & Sourcing',
    evaluation: 'Evaluation & Testing',
    monitoring: 'Monitoring & Incident Response',
    users: 'User Safety & Transparency',
  }[d.key] as string,
}));

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDimension, setSelectedDimension] = useState('All');

  useEffect(() => {
    fetch('/api/resources')
      .then((res) => {
        if (!res.ok) throw new Error('Resources API unavailable');
        return res.json();
      })
      .then((data) => {
        setResources(Array.isArray(data) && data.length > 0 ? data : fallbackResources);
        setLoading(false);
      })
      .catch(() => {
        setResources(fallbackResources);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory.toLowerCase();
      const matchesDimension = selectedDimension === 'All' || r.dimension === selectedDimension;
      return matchesSearch && matchesCategory && matchesDimension;
    });
  }, [resources, search, selectedCategory, selectedDimension]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] py-12 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text)] mb-4">Resource Library</h1>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            Curated guides, templates, tools, and frameworks to help you implement each recommendation.
          </p>
        </div>

        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c} Category
                </option>
              ))}
            </select>
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
            >
              <option value="All">All Dimensions</option>
              {genericDimensions.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => {
            const dimension = genericDimensions.find((d) => d.key === r.dimension);
            return (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 hover:shadow-xl hover:shadow-stone-900/5 dark:hover:shadow-black/20 hover:border-[var(--primary)]/30 transition-all"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[var(--surface-2)] flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] text-xs font-semibold capitalize">
                    <Tag className="w-3 h-3 inline mr-1" />
                    {r.category}
                  </span>
                  {dimension && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: `${dimension.color}15`, color: dimension.color }}
                    >
                      {dimension.label}
                    </span>
                  )}
                </div>
                <h3 className="font-serif font-bold text-xl text-[var(--text)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                  {r.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{r.description}</p>
              </a>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--text-muted)]">No resources match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
