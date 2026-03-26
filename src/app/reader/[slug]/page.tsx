'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ReaderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [topic, setTopic] = useState<any>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [slug]);

  async function fetchContent() {
    const { data: topicData } = await supabase
      .from('topics')
      .select('*, topic_versions!fk_current_version(*)')
      .eq('slug', slug)
      .single();

    if (topicData) {
      setTopic(topicData);
      setContent(topicData.topic_versions?.content || 'No content found for this version.');
    }
    setLoading(false);
  }

  if (loading) return <div className="flex flex-col items-center justify-center min-h-screen"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>;
  if (!topic) return <div className="p-12 text-center text-on-surface-variant">Topic not found.</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      
      {/* SideNavBar - Reader Specific */}
      <nav className="hidden lg:flex flex-col h-full w-80 py-8 bg-surface border-r border-white/5 pt-20">
        <div className="px-8 mb-10">
          <Link href={`/category/${topic.category.toLowerCase()}`} className="text-on-surface-variant hover:text-primary mb-6 flex items-center gap-2 group transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to {topic.category}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-primary">menu_book</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-on-surface leading-tight tracking-tight max-w-[180px] truncate" title={topic.title}>{topic.title}</h2>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">Vol. 2024 Edition</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1">
          <button className="w-full flex items-center gap-4 px-8 py-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all hover:translate-x-1 duration-200">
            <span className="material-symbols-outlined">article</span>
            <span className="font-bold text-sm">Study Material</span>
          </button>
          
          <button className="w-full flex items-center gap-4 px-8 py-4 text-primary bg-surface-container-high rounded-r-lg border-l-4 border-primary transition-all hover:translate-x-1 duration-200">
            <span className="material-symbols-outlined">menu_book</span>
            <span className="font-bold text-sm">Deep Reading</span>
          </button>

          <button className="w-full flex items-center gap-4 px-8 py-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all hover:translate-x-1 duration-200">
            <span className="material-symbols-outlined">payments</span>
            <span className="font-bold text-sm">MCQs & Cases</span>
          </button>
        </div>
        
        <div className="px-8 pt-6 mt-6 border-t border-white/5 space-y-4">
          <button className="w-full py-3 px-4 bg-secondary-container rounded-lg text-on-secondary-container text-xs font-bold uppercase tracking-tighter hover:bg-[#6D5100] transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            View Citations
          </button>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 overflow-y-auto bg-surface-dim pt-20 lg:pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          
          {/* Hero Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">
                {topic.category} Framework
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-on-surface mb-8 leading-[1.1]">
              {topic.title}
            </h1>
            <div className="flex items-center gap-8 text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                <span className="text-sm font-bold tracking-wide">Updated for FY 2024-25</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Narrative */}
            <div className="lg:col-span-8 space-y-10">
              <article className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-on-surface prose-strong:font-black prose-p:text-on-surface-variant prose-p:leading-relaxed prose-li:text-on-surface-variant marker:text-primary prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-surface-container prose-pre:border prose-pre:border-white/5">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </article>

              {/* Bento Style Highlight Box injected manually at bottom of content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-12 border-t border-white/5">
                <div className="p-6 rounded-xl bg-surface-container-low border-l-4 border-primary">
                  <h4 className="text-primary font-black uppercase text-[10px] tracking-widest mb-2">Exam Pro-Tip</h4>
                  <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                    Always cross-reference this topic with the latest ICAI technical guidelines before writing your final answer.
                  </p>
                </div>
              </div>
            </div>

            {/* Side Metadata/Actions */}
            <div className="lg:col-span-4 space-y-8 hidden lg:block">
              {/* Action Card */}
              <div className="p-8 rounded-2xl bg-surface-container-lowest border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700"></div>
                <h4 className="text-lg font-black text-on-surface mb-2">Mastery Module</h4>
                <p className="text-sm text-on-surface-variant mb-8 leading-relaxed font-medium">
                   Ready to test your knowledge? Our practice module includes real-world tribunal cases.
                </p>
                <button className="w-full py-4 bg-primary text-on-primary font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_8px_24px_-8px_rgba(255,193,7,0.4)] hover:scale-[1.02] active:scale-95 transition-all">
                   Open Practice
                </button>
              </div>

              {/* Sticky Note Visualization */}
              <div className="p-6 bg-surface-container rounded-2xl -rotate-2 shadow-xl border border-white/5 hover:rotate-0 transition-transform cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-lg">edit_note</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">My Notes</span>
                </div>
                <p className="text-xs text-on-surface-variant italic font-medium leading-relaxed">
                   "Remember to revise the critical dates specific to {topic.title} prior to the final attempt."
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      {/* Mobile Actions Overlay */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
         <button className="w-full py-5 bg-primary text-on-primary font-black uppercase tracking-widest text-sm rounded-2xl shadow-[0_8px_32px_-8px_rgba(255,193,7,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2">
            <span>Test Knowledge</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
         </button>
      </div>
    </div>
  );
}
