'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(26,35,126,0.1)] border border-slate-100 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
      
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 shadow-inner">
           <span className="material-symbols-outlined text-3xl font-bold">school</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
          {type === 'login' ? 'Scholar Login' : 'Join the Academy'}
        </h2>
        <p className="text-slate-500 text-sm mt-2 font-medium">Advanced CA Interview Preparation</p>
      </div>
      
      <form onSubmit={handleAuth} className="space-y-6">
        {type === 'signup' && (
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
            />
          </div>
        )}
        
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="scholar@example.com"
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
             <span className="material-symbols-outlined text-red-600 text-lg">error</span>
             <p className="text-red-600 text-xs font-bold leading-tight">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#151c63] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{type === 'login' ? 'Authorize' : 'Register'}</span>}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-100"></div>
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">OR</span>
        <div className="flex-1 h-px bg-slate-100"></div>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleAuth}
        className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-70"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        <span>Continue with Google</span>
      </button>

      <div className="mt-8 pt-8 border-t border-slate-100 text-center">
        {type === 'login' ? (
          <p className="text-sm text-slate-500 font-medium">New to the platform? <a href="/signup" className="text-primary font-black hover:underline underline-offset-4">Create Account</a></p>
        ) : (
          <p className="text-sm text-slate-500 font-medium">Already a scholar? <a href="/login" className="text-primary font-black hover:underline underline-offset-4">Sign In</a></p>
        )}
      </div>
    </div>
  );
}
