'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { TopicCard } from '@/components/TopicCard';

export default function Home() {
  const [topics, setTopics] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("Scholar");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      const fetchProfile = session?.user 
        ? supabase.from('user_profiles').select('*').eq('id', session.user.id).single()
        : Promise.resolve({ data: null });
        
      const fetchTopics = supabase.from('topics').select('*').order('release_date', { ascending: true });

      const fetchUserProgress = session?.user
        ? supabase.from('user_progress').select('*').eq('user_id', session.user.id)
        : Promise.resolve({ data: [] });

      const [profileRes, topicsRes, progressRes] = await Promise.all([fetchProfile, fetchTopics, fetchUserProgress]);

      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name?.split(' ')[0] || "Scholar");
        if (profileRes.data) setProfile(profileRes.data);
        if (progressRes.data) setUserProgress(progressRes.data);
      }

      if (topicsRes.data) setTopics(topicsRes.data);
      
      setLoading(false);
    }
    
    loadData();
  }, []);

  const categories = [
    { name: 'Excel', desc: 'Master data analysis, lookup functions, and advanced reporting.', icon: 'table_chart' },
    { name: 'GST', desc: 'Input Tax Credit, RCM, and latest compliance amendments.', icon: 'account_balance' },
    { name: 'TDS', desc: 'Withholding tax sections, rates, and quarterly returns.', icon: 'payments' },
    { name: 'Accounting', desc: 'Finalization of accounts, Ind AS, and audit preparation.', icon: 'verified_user' },
    { name: 'Tally', desc: 'Practical ERP application, inventory management, and shortcuts.', icon: 'terminal' },
    { name: 'Interview', desc: 'Real-world simulations and critical thinking exercises.', icon: 'person_search' }
  ];

  if (loading) return null;

  // Derive Progress Metrics based on real user progress
  const totalTopics = topics.length;
  const completedTopics = userProgress.filter(p => p.status === 'completed').length; 
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="w-full px-6 lg:px-12">
      {/* Hero Header */}
      <header className="mb-14 max-w-5xl">
        <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight text-on-surface mb-3">
          Welcome back, <span className="text-primary drop-shadow-[0_0_15px_rgba(255,193,7,0.2)]">{userName}</span>.
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Your academic progress is on track. You've logged <span className="text-on-surface font-bold">{profile?.study_hours || 0} hours</span> this semester. Continue your mastery of financial fundamentals.
        </p>
      </header>

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16 max-w-7xl">
        {/* Circular Progress Tracker - Glassmorphic Refined */}
        <div className="md:col-span-4 glass-card rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full"></div>
          
          <div className="relative w-52 h-52 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-white/5" cx="104" cy="104" fill="transparent" r="92" stroke="currentColor" strokeWidth="12"></circle>
              <circle 
                className="text-primary drop-shadow-[0_0_12px_rgba(255,193,7,0.5)] transition-all duration-1000 ease-out" 
                cx="104" cy="104" 
                fill="transparent" r="92" 
                stroke="currentColor" 
                strokeDasharray="578.05" 
                strokeDashoffset={578.05 - (578.05 * overallProgress) / 100} 
                strokeLinecap="round" strokeWidth="12">
              </circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-on-surface tracking-tighter">{overallProgress}%</span>
              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-on-surface-variant mt-1">Overall</span>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-bold text-on-surface mb-1">Scholar Performance</h3>
            <p className="text-sm text-on-surface-variant font-medium">{totalTopics - completedTopics} Topics remaining to goal</p>
          </div>
        </div>

        {/* Stats Cards Column */}
        <div className="md:col-span-4 grid grid-rows-2 gap-6">
          {/* Daily Streak */}
          <div className="bg-surface-container rounded-[2rem] p-7 flex items-center justify-between group border border-white/5">
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant mb-2">Daily Streak</p>
              <h4 className="text-4xl font-black text-on-surface leading-none">{profile?.current_streak || 0} <span className="text-primary text-2xl ml-1">Days</span></h4>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-[inset_0_0_12px_rgba(255,193,7,0.1)]">
              <span className="material-symbols-outlined text-primary text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
            </div>
          </div>

          {/* Hours Logged */}
          <div className="bg-surface-container rounded-[2rem] p-7 flex items-center justify-between group border border-white/5">
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant mb-2">Study Hours</p>
              <h4 className="text-4xl font-black text-on-surface leading-none">{profile?.study_hours || 0} <span className="text-primary text-2xl ml-1">Hrs</span></h4>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-3xl">schedule</span>
            </div>
          </div>
        </div>

        {/* Recent Performance Metrics */}
        <div className="md:col-span-4 bg-surface-container-highest rounded-[2rem] p-8 flex flex-col relative overflow-hidden border border-white/10 shadow-2xl">
          <h3 className="text-xl font-bold text-on-surface mb-6">Module Mastery</h3>
          <div className="space-y-6">
            {categories.slice(0, 3).map(cat => {
              const catTopics = topics.filter(t => t.category === cat.name);
              const catTopicIds = catTopics.map(t => t.id);
              const completedCount = userProgress.filter(p => catTopicIds.includes(p.topic_id) && p.status === 'completed').length;
              const percent = catTopics.length > 0 ? Math.round((completedCount / catTopics.length) * 100) : 0;
              
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span className="text-on-surface-variant">{cat.name}</span>
                    <span className="text-primary">{percent}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section Heading */}
      <div className="flex items-end justify-between mb-10 max-w-7xl">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-on-surface">Curriculum Modules</h2>
          <p className="text-on-surface-variant text-sm mt-1 font-medium">Continuing your core curriculum.</p>
        </div>
        <Link href="/category" className="text-primary font-bold hover:text-white transition-all flex items-center space-x-2 group">
          <span className="border-b-2 border-primary/30 group-hover:border-primary pb-0.5">Explore All</span>
          <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">east</span>
        </Link>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mb-20">
        {categories.map((cat, index) => {
          const catTopics = topics.filter(t => t.category === cat.name);
          const catTopicIds = catTopics.map(t => t.id);
          const completedCount = userProgress.filter(p => catTopicIds.includes(p.topic_id) && p.status === 'completed').length;
          
          const progressPercent = catTopics.length > 0 ? Math.round((completedCount / catTopics.length) * 100) : 0;
          const isHighlighted = index === 2; // For visual variety based on the prompt UI

          return (
            <Link key={cat.name} href={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} className={`rounded-[2rem] p-7 group cursor-pointer transition-all duration-300 ${isHighlighted ? 'bg-surface-container border-2 border-primary/30 hover:border-primary relative overflow-hidden shadow-xl shadow-primary/5' : 'bg-surface-container hover:bg-surface-container-high border border-white/5'}`}>
              
              {isHighlighted && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 shadow-sm ${isHighlighted ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(255,193,7,0.3)]' : 'bg-surface-container-highest group-hover:bg-primary group-hover:text-on-primary'}`}>
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
              
              <h4 className={`text-lg mb-2 ${isHighlighted ? 'font-extrabold text-on-surface' : 'font-bold text-on-surface group-hover:text-primary transition-colors'}`}>{cat.name}</h4>
              <p className="text-sm text-on-surface-variant mb-8 line-clamp-2 leading-relaxed">{cat.desc}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-on-surface-variant">Progress ({completedCount}/{catTopics.length})</span>
                  <span className="text-primary">{progressPercent}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-1000" style={{width: `${progressPercent}%`, boxShadow: progressPercent > 0 ? '0 0 8px rgba(255,193,7,0.3)' : 'none'}}></div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Interview Modules Section */}
      <div className="mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-on-surface tracking-tighter">Interview Modules</h2>
            <p className="text-on-surface-variant text-sm font-medium mt-1">Real-world simulations and behavioral prep.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
          {topics.filter(t => t.category === 'Interview').slice(0, 10).map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
