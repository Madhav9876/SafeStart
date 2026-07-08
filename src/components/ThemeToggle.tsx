import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)]">
      <button
        onClick={() => setTheme('light')}
        aria-label="Light mode"
        className={`p-1.5 rounded-full transition-all ${
          theme === 'light'
            ? 'bg-[var(--surface)] text-[var(--accent)] shadow-sm'
            : 'text-[var(--text-muted)] hover:text-[var(--text)]'
        }`}
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        aria-label="Dark mode"
        className={`p-1.5 rounded-full transition-all ${
          theme === 'dark'
            ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm'
            : 'text-[var(--text-muted)] hover:text-[var(--text)]'
        }`}
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        aria-label="System preference"
        className={`p-1.5 rounded-full transition-all ${
          theme === 'system'
            ? 'bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-sm'
            : 'text-[var(--text-muted)] hover:text-[var(--text)]'
        }`}
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
