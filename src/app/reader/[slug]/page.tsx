'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { ChevronLeft, RefreshCcw, HelpCircle, ChevronDown, ChevronUp, Clock, BookOpen } from 'lucide-react';

function ExerciseCard({ exercise, index }: { exercise: any, index: number }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 transition-all hover:bg-surface-container-high">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black text-xs">
          {index}
        </div>
        <div className="flex-1">
          <p className="text-on-surface font-bold leading-relaxed mb-4">{exercise.question}</p>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface-variant text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
            >
              <HelpCircle className="w-3 h-3" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <button 
              onClick={() => setShowAnswer(!showAnswer)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all"
            >
              {showAnswer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
          </div>

          {showHint && (
            <div className="mt-4 p-4 rounded-xl bg-surface-container-highest/50 border-l-4 border-primary/30 text-sm text-on-surface-variant italic font-medium">
              <span className="font-black uppercase text-[9px] tracking-widest block mb-1 text-primary">Hint</span>
              {exercise.hint}
            </div>
          )}

          {showAnswer && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="font-black uppercase text-[9px] tracking-widest block mb-2 text-emerald-400">Expected Solution</span>
                <code className="text-sm font-mono text-emerald-300 bg-black/20 px-2 py-1 rounded">{exercise.expected_formula}</code>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-highest border border-white/5">
                <span className="font-black uppercase text-[9px] tracking-widest block mb-2 text-primary">Explanation</span>
                <p className="text-sm text-on-surface-variant leading-relaxed font-medium">{exercise.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReaderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [topic, setTopic] = useState<any>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<{ id: string, text: string, level: number }[]>([]);
  const [dataset, setDataset] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    fetchContent();
  }, [slug]);

  useEffect(() => {
    if (content) {
      const headings = Array.from(content.matchAll(/^#{1,3}\s+(.+)/gm)).map(match => ({
        id: match[1].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        text: match[1],
        level: (match[0].match(/#/g) || []).length
      }));
      setToc(headings);
    }
  }, [content]);

  async function fetchContent() {
    setLoading(true);
    const { data: topicData } = await supabase
      .from('topics')
      .select('*, topic_versions!current_version_id(*)')
      .eq('slug', slug)
      .single();

    if (topicData) {
      setTopic(topicData);
      setContent(topicData.topic_versions?.[0]?.content || topicData.topic_versions?.content || 'No content found for this version.');

      // Fetch practice dataset and exercises
      const { data: ds } = await supabase
        .from('practice_datasets')
        .select('*')
        .eq('topic_id', topicData.id)
        .maybeSingle();

      const { data: ex } = await supabase
        .from('topic_exercises')
        .select('*')
        .eq('topic_id', topicData.id)
        .order('difficulty', { ascending: true });

      if (ds) setDataset(ds);
      if (ex) setExercises(ex);
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
          <Link href={`/category/${topic.category.toLowerCase().replace(/\s+/g, '-')}`} className="text-on-surface-variant hover:text-primary mb-6 flex items-center gap-2 group transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to {topic.category}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-primary">menu_book</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-on-surface leading-tight tracking-tight max-w-[180px] truncate" title={topic.title}>{topic.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Vol. 2024 Edition</p>
                <button
                  onClick={() => fetchContent()}
                  className="flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-on-surface-variant bg-surface-container border border-white/5 rounded-lg hover:text-primary hover:border-primary/30 transition-all active:scale-95"
                >
                  <RefreshCcw className="w-3 h-3" /> Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1">
          <div className="px-8 mb-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">Contents</div>
          {toc.length > 0 ? toc.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => {
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-4 px-8 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all hover:translate-x-1 duration-200 text-left`}
            >
              <span className={`font-bold text-xs \${item.level === 1 ? 'ml-0' : item.level === 2 ? 'ml-4' : 'ml-8'}`}>
                {item.text}
              </span>
            </button>
          )) : (
            <div className="px-8 text-xs italic text-on-surface-variant opacity-50">No headings found.</div>
          )}
        </div>
      </nav>

      {/* Main Reader Area */}
      <main className="flex-1 h-full overflow-y-auto pt-20">
        <div className="max-w-5xl mx-auto px-8 py-12">
          
          {/* Header Metadata */}
          <div className="mb-16">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
              <span>{topic.category}</span>
              <span className="w-1 h-1 rounded-full bg-on-surface-variant opacity-30"></span>
              <span className="text-on-surface-variant">Released {topic.release_date}</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-on-surface tracking-tighter leading-[0.9] mb-8">{topic.title}</h1>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-white/5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                <Clock className="w-3 h-3" /> 15 Min Read
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                <BookOpen className="w-3 h-3" /> Expert Series
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Narrative */}
            <div className="lg:col-span-8 space-y-10">
              <div className="prose prose-invert prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-on-surface prose-p:text-on-surface-variant prose-p:leading-relaxed prose-strong:text-primary prose-table:border prose-table:border-white/5 prose-th:bg-surface-container-highest prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>

              {dataset?.preview_json?.rows && (
                <div className="mt-12 bg-surface-container rounded-3xl border border-white/5 p-8 shadow-2xl">
                  <h2 className="text-2xl font-black text-on-surface mb-2">{dataset.title}</h2>
                  <p className="text-on-surface-variant text-sm mb-6 font-medium">{dataset.description}</p>
                  <div className="overflow-x-auto rounded-xl border border-white/5">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-surface-container-highest">
                          {dataset.preview_json.columns.map((col: string) => (
                            <th key={col} className="text-left px-4 py-3 text-on-surface font-bold uppercase tracking-widest text-[10px] border-b border-white/5">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dataset.preview_json.rows.map((row: string[], i: number) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-transparent' : 'bg-white/5'}>
                            {row.map((cell: string, j: number) => (
                              <td key={j} className="px-4 py-3 text-on-surface-variant border-b border-white/5 font-medium">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        const csv = [dataset.preview_json.columns, ...dataset.preview_json.rows]
                          .map((r: string[]) => r.join(',')).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = `${dataset.title}.csv`;
                        a.click();
                      }}
                      className="px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                    >
                      Download CSV Dataset
                    </button>
                  </div>
                </div>
              )}

              {exercises.length > 0 && (
                <div className="mt-12 bg-surface-container rounded-3xl border border-white/5 p-8 shadow-2xl">
                  <h2 className="text-2xl font-black text-on-surface mb-6">Practice Exercises</h2>
                  <div className="space-y-6">
                    {exercises.map((ex, i) => (
                      <ExerciseCard key={ex.id} exercise={ex} index={i + 1} />
                    ))}
                  </div>
                </div>
              )}

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
