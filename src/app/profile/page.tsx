'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (data) setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return null;

  return (
    <div className="px-6 lg:px-12 py-10 w-full max-w-3xl mx-auto">
      <div className="bg-surface-container rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-on-surface">{profile?.full_name || 'Scholar'}</h1>
            <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">Academy {profile?.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-surface-container-high p-6 rounded-2xl border border-white/5">
            <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant mb-1">Current Streak</p>
            <p className="text-2xl font-black text-on-surface">{profile?.current_streak || 0} Days</p>
          </div>
          <div className="bg-surface-container-high p-6 rounded-2xl border border-white/5">
            <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant mb-1">Total Hours</p>
            <p className="text-2xl font-black text-on-surface">{profile?.study_hours || 0} Hrs</p>
          </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="w-full py-4 bg-error-container text-on-error-container rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-error hover:text-white transition-all shadow-lg shadow-error/10"
        >
          De-authorize Session
        </button>
      </div>
    </div>
  );
}
