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
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-[#1A237E] mb-6">
        {type === 'login' ? 'Welcome Back' : 'Create Account'}
      </h2>
      
      <form onSubmit={handleAuth} className="space-y-4">
        {type === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Naman"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="naman@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A237E] text-white py-2 rounded-md font-semibold hover:bg-[#151c63] transition-colors flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {type === 'login' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        {type === 'login' ? (
          <p>Don't have an account? <a href="/signup" className="text-[#1A237E] font-medium hover:underline">Sign Up</a></p>
        ) : (
          <p>Already have an account? <a href="/login" className="text-[#1A237E] font-medium hover:underline">Sign In</a></p>
        )}
      </div>
    </div>
  );
}
