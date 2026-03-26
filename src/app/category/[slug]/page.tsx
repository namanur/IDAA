import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { TopicCard } from '@/components/TopicCard';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const titles: Record<string, string> = { 
    'excel': 'Excel', 
    'gst': 'GST', 
    'tds': 'TDS', 
    'accounting': 'Accounting',
    'tally': 'Tally',
    'interview': 'Interview'
  };
  const catTitle = titles[slug.toLowerCase()] || slug;
  
  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .eq('category', catTitle)
    .order('release_date', { ascending: true });
    
  return (
     <div className="space-y-10 px-6 lg:px-12 w-full max-w-7xl pb-20">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-highest hover:bg-primary hover:text-on-primary transition-all text-on-surface mb-2">
           <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-on-surface tracking-tighter leading-tight">{catTitle} <span className="text-primary tracking-tight font-black">Modules</span></h1>
          <p className="text-on-surface-variant mt-2 font-medium max-w-xl leading-relaxed">Continue your structural preparedness mapping across all designated endpoints for the {catTitle} pipeline.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics?.map((topic) => (
           <TopicCard key={topic.id} topic={topic} />
        ))}
        {(!topics || topics.length === 0) && (
           <div className="col-span-full py-20 mt-10 text-center flex flex-col items-center justify-center bg-surface-container rounded-2xl border border-white/5">
             <span className="material-symbols-outlined text-primary text-4xl mb-4">search_off</span>
             <p className="text-on-surface-variant font-bold">No active materials located.</p>
             <p className="text-sm text-on-surface-variant/70 mt-1">Check back later for new module releases.</p>
           </div>
        )}
      </div>
    </div>
  );
}
