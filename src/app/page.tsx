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
    { name: 'Financial Reporting', desc: 'Ind AS, IFRS, and complex business combinations.', icon: 'account_balance' },
    { name: 'Audit & Assurance', desc: 'Standards on Auditing, CARO 2020, and professional ethics.', icon: 'verified_user' },
    { name: 'Taxation', desc: 'Corporate tax and latest amendments.', icon: 'payments' },
    { name: 'GST', desc: 'Input Tax Credit, RCM, and compliance.', icon: 'account_balance' },
    { name: 'TDS', desc: 'Withholding tax sections, rates, and returns.', icon: 'payments' },
    { name: 'Excel', desc: 'Data analysis, lookup functions, and reporting.', icon: 'table_chart' },
    { name: 'Tally', desc: 'Practical ERP application and shortcuts.', icon: 'terminal' },
    { name: 'Corporate Law', desc: 'Companies Act 2013 and SEBI regulations.', icon: 'gavel' },
    { name: 'FM & Analysis', desc: 'Valuation models and ratio interpretation.', icon: 'trending_up' },
    { name: 'Soft Skills', desc: 'Elevator pitch and behavioral prep.', icon: 'forum' },
    { name: 'Interview', desc: 'Real-world simulations and critical thinking.', icon: 'person_search' }
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>;

  const totalTopics = topics.length;
  const completedTopics = userProgress.filter(p => p.status === 'completed').length; 
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="w-full px-6 lg:px-4">
      <header className="mb-14 max-w-5xl">
        <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight text-on-surface mb-3">
          Welcome back, <span className="text-primary drop-shadow-[0_0_15px_rgba(255,193,7,0.2)]">{userName}</span>.
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Your academic progress is on track. You've logged <span className="text-on-surface font-bold">{profile?.study_hours || 0} hours</span> this semester.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16 max-w-7xl">
        <div className="md:col-span-4 bg-surface-container rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group border border-white/5">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full"></div>
          <div className="relative w-52 h-52 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-white/5" cx="104" cy="104" fill="transparent" r="92" stroke="currentColor" strokeWidth="12"></circle>
              <circle className="text-primary drop-shadow-[0_0_12px_rgba(255,193,7,0.5)] transition-all duration-1000 ease-out" cx="104" cy="104" fill="transparent" r="92" stroke="currentColor" strokeDasharray="578.05" strokeDashoffset={578.05 - (578.05 * overallProgress) / 100} strokeLinecap="round" strokeWidth="12"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-on-surface tracking-tighter">{overallProgress}%</span>
              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-on-surface-variant mt-1">Overall</span>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-on-surface mb-1">Scholar Performance</h3>
            <p className="text-sm text-on-surface-variant font-medium">{totalTopics - completedTopics} Topics remaining</p>
          </div>
        </div>

        <div className="md:col-span-4 grid grid-rows-2 gap-6">
          <div className="bg-surface-container rounded-[2rem] p-7 flex items-center justify-between group border border-white/5">
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant mb-2">Daily Streak</p>
              <h4 className="text-4xl font-black text-on-surface leading-none">{profile?.current_streak || 0} <span className="text-primary text-2xl ml-1">Days</span></h4>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <span className="material-symbols-outlined text-primary text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
            </div>
          </div>
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

        <div className="md:col-span-4 bg-surface-container-highest rounded-[2rem] p-8 flex flex-col relative overflow-hidden border border-white/10 shadow-2xl">
          <h3 className="text-xl font-bold text-on-surface mb-6">Module Mastery</h3>
          <div className="space-y-3.5 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {categories.map(cat => {
              const catTopics = topics.filter(t => t.category === cat.name);
              const catTopicIds = catTopics.map(t => t.id);
              const completedCount = userProgress.filter(p => catTopicIds.includes(p.topic_id) && p.status === 'completed').length;
              const percent = catTopics.length > 0 ? Math.round((completedCount / catTopics.length) * 100) : 0;
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-1">
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

      <div className="mb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-on-surface tracking-tighter">Curriculum Modules</h2>
          <p className="text-on-surface-variant text-sm font-medium mt-1">Direct access to specialized CA interview tracks.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
          {categories.map((cat, index) => {
            const catTopics = topics.filter(t => t.category === cat.name);
            const catTopicIds = catTopics.map(t => t.id);
            const completedCount = userProgress.filter(p => catTopicIds.includes(p.topic_id) && p.status === 'completed').length;
            const progressPercent = catTopics.length > 0 ? Math.round((completedCount / catTopics.length) * 100) : 0;
            return (
              <Link key={cat.name} href={`/category/${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="bg-surface-container hover:bg-surface-container-high border border-white/5 rounded-[2rem] p-7 group cursor-pointer transition-all duration-300 shadow-lg shadow-black/5">
                <div className="w-12 h-12 rounded-xl bg-surface-container-highest group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center mb-5 transition-all duration-500">
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <h4 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">{cat.name}</h4>
                <p className="text-xs text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">{cat.desc}</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-on-surface-variant">Progress ({completedCount}/{catTopics.length})</span>
                    <span className="text-primary">{progressPercent}%</span>
                  </div>
                  <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{width: `${progressPercent}%`}}></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-on-surface tracking-tighter">Ready to Generate</h2>
          <p className="text-on-surface-variant text-sm font-medium mt-1">Pending behavioral and technical topics.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
          {topics.filter(t => t.status === 'queued' || t.status === 'failed').slice(0, 6).map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
