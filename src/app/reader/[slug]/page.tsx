'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ChevronLeft, 
  Bookmark, 
  RefreshCcw, 
  ArrowRightCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

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

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>;
  if (!topic) return <div>Topic not found.</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-white rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1A237E]">{topic.title}</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3" /> Last Updated: {new Date(topic.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-[#1A237E] transition-all">
            <RefreshCcw className="w-4 h-4" /> Refresh
          </button>
          <button className="p-2 bg-white border border-slate-200 rounded-lg hover:border-[#FFC107] text-slate-400 hover:text-[#FFC107] transition-all">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
        {/* Sticky Sidebar (TOC) */}
        <aside className="hidden lg:block sticky top-24 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Table of Contents</h3>
            <nav className="space-y-3">
              {['Introduction', 'Key Concepts', 'Worked Example', 'Common Errors', 'Interview Q&A'].map((item) => (
                <button key={item} className="block text-sm font-medium text-slate-600 hover:text-[#1A237E] transition-colors">
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-[#1A237E] text-white rounded-2xl p-6 space-y-4">
            <h4 className="font-bold">Ready to Practice?</h4>
            <p className="text-indigo-200 text-xs leading-relaxed">Apply these concepts in our interactive Excel module.</p>
            <button className="w-full bg-[#FFC107] text-[#854F0B] py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#ffca28] transition-all">
              Start Practice <ArrowRightCircle className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Markdown Content */}
        <article className="prose prose-slate prose-indigo max-w-none bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm min-h-[80vh]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </article>
      </div>

      {/* Mobile Floating Action */}
      <div className="lg:hidden fixed bottom-24 right-6">
        <button className="shadow-2xl bg-[#FFC107] text-[#854F0B] h-14 px-6 rounded-full font-bold flex items-center justify-center gap-2 border-2 border-white">
          Start Practice <ArrowRightCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
