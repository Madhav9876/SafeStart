import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

export default function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/quiz', label: 'Take Quiz' },
    { path: '/resources', label: 'Resources' },
    ...(user ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size={40} className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-[var(--text)] text-xl leading-none">SafeStart</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-medium">AI Safety</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-[var(--surface-2)] rounded-full px-2 py-1 border border-[var(--border)]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-[var(--text)] text-[var(--bg)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2 pl-3 border-l border-[var(--border)]">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] font-medium transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="p-2 rounded-full text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="group relative inline-flex items-center gap-2 overflow-hidden bg-[var(--text)] text-[var(--bg)] hover:bg-[var(--primary)] px-5 py-2 rounded-full text-sm font-semibold transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 text-[var(--text-muted)]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] transition-colors">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-[var(--text)] text-[var(--bg)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[var(--border)]">
              <ThemeToggle />
            </div>
            {user ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signOut();
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-2)] rounded-lg"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[var(--bg)] bg-[var(--text)] rounded-lg"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
