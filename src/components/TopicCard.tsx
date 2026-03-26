import Link from 'next/link';
import { BookOpen, Clock, Lock, AlertTriangle, ChevronRight, FileText } from 'lucide-react';

export function TopicCard({ topic }: { topic: any }) {
  const isPublished = topic.status === 'published' || topic.status === 'ready';
  const isGenerating = topic.status === 'generating' || topic.status === 'generated';
  const isFailed = topic.status === 'failed';
  
  const today = new Date().toISOString().split('T')[0];
  const isComingSoon = topic.release_date > today;

  if (!isPublished && !isComingSoon && !isGenerating && !isFailed) {
    return (
      <div className="bg-surface-container border border-white/5 p-6 rounded-2xl flex items-start gap-4 opacity-70 grayscale">
        <div className="p-3 bg-surface-container-highest rounded-xl text-on-surface-variant">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-on-surface-variant truncate">{topic.title}</h3>
          <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mt-1 block">Coming Soon</span>
        </div>
      </div>
    );
  }

  return (
    <Link 
      href={isPublished ? `/reader/${topic.slug}` : '#'}
      className={`group bg-surface-container p-6 rounded-2xl flex items-start gap-5 transition-all duration-300 ${
        isPublished 
          ? 'border border-white/5 hover:border-primary/30 hover:bg-surface-container-high cursor-pointer shadow-lg shadow-black/20' 
          : 'border border-white/5 opacity-80 cursor-default'
      }`}
    >
      <div className={`p-3 rounded-xl transition-all duration-300 shadow-inner ${
        isPublished ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'
      }`}>
        <span className="material-symbols-outlined">{isPublished ? 'description' : 'hourglass_empty'}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className={`text-lg font-bold truncate transition-colors ${isPublished ? 'text-on-surface group-hover:text-primary' : 'text-on-surface-variant'}`}>
          {topic.title}
        </h3>
        
        <div className="flex items-center gap-2 mt-2">
          {isPublished ? (
            <span className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-1">
              Ready to Read
            </span>
          ) : isGenerating ? (
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
          ) : null}
        </div>
      </div>
      
      {isPublished && (
        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-transform group-hover:translate-x-1 mt-2">east</span>
      )}
    </Link>
  );
}
