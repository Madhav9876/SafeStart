import { Heart } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] text-[var(--text-muted)] py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Logo size={28} />
              <span className="font-serif font-bold text-[var(--text)] text-lg">SafeStart</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Free AI safety maturity assessment for early-stage startups. Build safer AI products and prepare for investor and regulator due diligence.
            </p>
          </div>
          <div>
            <h4 className="font-serif font-semibold text-[var(--text)] mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-[var(--primary)] transition-colors">Home</a></li>
              <li><a href="/quiz" className="hover:text-[var(--primary)] transition-colors">Take the Quiz</a></li>
              <li><a href="/resources" className="hover:text-[var(--primary)] transition-colors">Resource Library</a></li>
              <li><a href="/dashboard" className="hover:text-[var(--primary)] transition-colors">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-semibold text-[var(--text)] mb-4">Note</h4>
            <p className="text-sm leading-relaxed">
              This quiz is for educational and self-assessment purposes. It does not constitute legal advice or a formal audit.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} SafeStart. Crafted for the startup community.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="w-4 h-4 text-rose-500" /> for safer AI
          </p>
        </div>
      </div>
    </footer>
  );
}
