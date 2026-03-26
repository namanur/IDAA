'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  BookOpen, 
  Clock, 
  Lock, 
  AlertTriangle, 
  ChevronRight,
  Calculator,
  Gavel,
  FileText,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchTopics() {
    const { data } = await supabase
      .from('topics')
      .select('*')
      .order('release_date', { ascending: true });
    if (data) setTopics(data);
    setLoading(false);
  }

  const categories = ['Excel', 'GST', 'TDS', 'Accounting', 'Tally'];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <section>
        <h1 className="text-3xl font-bold text-[#1A237E]">Continue Learning</h1>
        <p className="text-slate-500 mt-1">Ready for your CA Interview? Pick a topic below.</p>
      </section>

      {/* Progress Overview (Mock data based on design) */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
        <ProgressItem label="Excel" percent={80} color="bg-indigo-600" />
        <ProgressItem label="GST" percent={45} color="bg-indigo-600" />
        <ProgressItem label="TDS" percent={20} color="bg-[#FFC107]" />
        <ProgressItem label="Accounting" percent={0} color="bg-slate-200" />
      </section>

      {/* Module Sections */}
      {categories.map((cat) => (
        <section key={cat} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">{cat} Modules</h2>
            <button className="text-[#1A237E] text-sm font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics
              .filter((t) => t.category === cat)
              .map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ProgressItem({ label, percent, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function TopicCard({ topic }: { topic: any }) {
  const isPublished = topic.status === 'published' || topic.status === 'ready';
  const isGenerating = topic.status === 'generating' || topic.status === 'generated';
  const isFailed = topic.status === 'failed';
  
  const today = new Date().toISOString().split('T')[0];
  const isComingSoon = topic.release_date > today;

  if (!isPublished && !isComingSoon && !isGenerating && !isFailed) {
    // Basic queued state
    return (
      <div className="bg-white/50 border border-slate-200 p-5 rounded-xl flex items-start gap-4 opacity-60 grayscale">
        <div className="p-3 bg-slate-100 rounded-lg text-slate-400">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-400">{topic.title}</h3>
          <span className="text-[10px] uppercase font-bold text-slate-400">Coming Soon</span>
        </div>
      </div>
    );
  }

  return (
    <Link 
      href={isPublished ? `/reader/${topic.slug}` : '#'}
      className={`group bg-white border p-5 rounded-xl flex items-start gap-4 transition-all ${
        isPublished 
          ? 'border-slate-200 hover:border-[#1A237E] hover:shadow-md cursor-pointer' 
          : 'border-slate-200 opacity-80 cursor-default'
      }`}
    >
      <div className={`p-3 rounded-lg transition-colors ${
        isPublished ? 'bg-indigo-50 text-[#1A237E]' : 'bg-slate-50 text-slate-400'
      }`}>
        <FileText className="w-6 h-6" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold truncate ${isPublished ? 'text-slate-800' : 'text-slate-500'}`}>
          {topic.title}
        </h3>
        
        <div className="flex items-center gap-2 mt-1">
          {isPublished ? (
            <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Ready to read
            </span>
          ) : isGenerating ? (
            <span className="text-xs text-amber-600 font-semibold flex items-center gap-1 animate-pulse">
              <Clock className="w-3 h-3" /> Refining content...
            </span>
          ) : isComingSoon ? (
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold uppercase tracking-tight">
              Expected {topic.release_date}
            </span>
          ) : isFailed ? (
            <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Research delayed
            </span>
          ) : null}
        </div>
      </div>
      
      {isPublished && (
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1A237E] transition-colors" />
      )}
    </Link>
  );
}
