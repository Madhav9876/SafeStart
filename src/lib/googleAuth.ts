import supabase from './supabase';

export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Sign in is not configured for this local copy.');
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      queryParams: {
        prompt: 'select_account',
      },
    },
  });

  if (error) throw error;
}
