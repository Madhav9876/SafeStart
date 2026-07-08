import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Loader2, Chrome } from 'lucide-react';
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import { signInWithGoogle } from '../lib/googleAuth';

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!supabase) throw new Error('Sign in is not configured for this local copy.');

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email to confirm your account.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-12 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--text)] mb-5">
            <Shield className="w-7 h-7 text-[var(--bg)]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[var(--text)]">
            {isSignUp ? 'Create your account' : 'Sign in to SafeStart'}
          </h1>
          <p className="text-[var(--text-muted)] mt-2">
            Save your reports and track your maturity over time.
          </p>
        </div>

        <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-8">
          {!isSupabaseConfigured && (
            <p className="mb-4 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
              Sign in is disabled until Supabase environment variables are added. You can still take the quiz locally.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
                  placeholder="you@startup.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg">{error}</p>}
            {message && <p className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">{message}</p>}

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="w-full bg-[var(--text)] hover:bg-[var(--primary)] disabled:bg-[var(--surface-2)] disabled:text-[var(--text-muted)] text-[var(--bg)] font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--surface)] text-[var(--text-muted)]">or</span>
            </div>
          </div>

          <button
            onClick={async () => {
              setError(null);
              setLoading(true);
              try {
                await signInWithGoogle();
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Google sign-in failed');
                setLoading(false);
              }
            }}
            disabled={!isSupabaseConfigured}
            className="w-full bg-[var(--bg)] border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Chrome className="w-5 h-5 text-blue-500" />
            Sign in with Google
          </button>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[var(--primary)] hover:text-[var(--primary-dark)] font-semibold"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>

          <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
            <Link to="/quiz" className="text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium">
              Continue without signing in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
