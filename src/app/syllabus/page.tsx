'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, CheckCircle, Clock } from 'lucide-react';

export default function SyllabusPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSyllabus() {
      const { data } = await supabase
        .from('topics')
        .select('*')
        .order('release_date', { ascending: true });
      
      if (data) setTopics(data);
      setLoading(false);
    }
    loadSyllabus();
  }, []);

  const categories = ['Excel', 'GST', 'TDS', 'Accounting', 'Tally', 'Interview'];
  const today = new Date().toISOString().split('T')[0];

  if (loading) return null;

  return (
    <div className="px-6 lg:px-12 py-10 w-full max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-black text-on-surface tracking-tighter mb-4">
          Full <span className="text-primary">Syllabus</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl font-medium leading-relaxed">
          60 topics unlocking over 60 days. Your complete CA interview prep roadmap.
        </p>
      </div>

      <div className="space-y-10">
        {categories.map(cat => (
          <section key={cat}>
            <h2 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              {cat}
            </h2>
            <div className="bg-surface-container border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              {topics.filter(t => t.category === cat).map((topic, i) => {
                const isUnlocked = topic.release_date <= today && (topic.status === 'ready' || topic.status === 'published');
                const isToday = topic.release_date === today;
                return (
                  <div key={topic.id} className={`flex items-center justify-between px-6 py-4 ${i !== 0 ? 'border-t border-white/5' : ''} ${isToday ? 'bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-on-surface-variant w-6 opacity-50">{(i + 1).toString().padStart(2, '0')}</span>
                      <div>
                        <span className={`font-bold text-sm ${isUnlocked ? 'text-on-surface' : 'text-on-surface-variant opacity-50'}`}>{topic.title}</span>
                        {isToday && <span className="ml-3 text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Today</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-50 font-mono">{topic.release_date}</span>
                      {isUnlocked ? <CheckCircle className="w-4 h-4 text-emerald-400" /> :
                       topic.release_date <= today ? <Clock className="w-4 h-4 text-amber-400" /> :
                       <Lock className="w-4 h-4 text-on-surface-variant opacity-20" />}
                    </div>
                  </div>
                );
              })}
              {topics.filter(t => t.category === cat).length === 0 && (
                <div className="px-6 py-8 text-center text-on-surface-variant italic text-sm opacity-50">
                  No modules currently assigned to this track.
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
