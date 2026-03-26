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
              placeholder="Naman"
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
            placeholder="naman@idaa.com"
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

      <div className="mt-10 pt-8 border-t border-slate-100 text-center">
        {type === 'login' ? (
          <p className="text-sm text-slate-500 font-medium">New to the platform? <a href="/signup" className="text-primary font-black hover:underline underline-offset-4">Create Account</a></p>
        ) : (
          <p className="text-sm text-slate-500 font-medium">Already a scholar? <a href="/login" className="text-primary font-black hover:underline underline-offset-4">Sign In</a></p>
        )}
      </div>
    </div>
  );
}
