import Link from 'next/link';
import { BookOpen, Clock, Lock, AlertTriangle, ChevronRight, FileText } from 'lucide-react';

export function TopicCard({ topic }: { topic: any }) {
  const today = new Date().toISOString().split('T')[0];
  const isPublished = topic.status === 'published' || (topic.status === 'ready' && topic.release_date <= today);
  const isComingSoon = topic.status === 'ready' && topic.release_date > today;
  const isGenerating = topic.status === 'generating' || topic.status === 'generated';
  const isFailed = topic.status === 'failed';

  if (!isPublished) {
    return (
      <div 
        className={`bg-surface-container p-6 rounded-2xl flex items-start gap-5 transition-all duration-300 border border-white/5 opacity-80 cursor-default`}
      >
        <div className="p-3 rounded-xl bg-surface-container-highest text-on-surface-variant shadow-inner">
          <span className="material-symbols-outlined">{isGenerating ? 'hourglass_empty' : 'lock'}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold truncate text-on-surface-variant">
            {topic.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-2">
            {isGenerating ? (
              <span className="text-[10px] text-tertiary font-black uppercase tracking-widest flex items-center gap-1 animate-pulse">
                Refining context...
              </span>
            ) : isComingSoon ? (
              <span className="text-[10px] bg-surface-container-lowest px-2 py-0.5 rounded text-on-surface-variant font-black uppercase tracking-widest border border-white/5">
                Exp: {topic.release_date}
              </span>
            ) : isFailed ? (
              <span className="text-[10px] text-error font-black uppercase tracking-widest flex items-center gap-1">
                Generation Error
              </span>
            ) : (
              <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">
                Locked
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link 
      href={`/reader/${topic.slug}`}
      className="group bg-surface-container p-6 rounded-2xl flex items-start gap-5 transition-all duration-300 border border-white/5 hover:border-primary/30 hover:bg-surface-container-high cursor-pointer shadow-lg shadow-black/20"
    >
      <div className="p-3 rounded-xl transition-all duration-300 shadow-inner bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary">
        <span className="material-symbols-outlined">description</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold truncate transition-colors text-on-surface group-hover:text-primary">
          {topic.title}
        </h3>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-1">
            Ready to Read
          </span>
        </div>
      </div>
      
      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-transform group-hover:translate-x-1 mt-2">east</span>
    </Link>
  );
}
