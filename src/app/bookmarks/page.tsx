'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TopicCard } from '@/components/TopicCard';
import Link from 'next/link';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookmarks() {
      try {
        setLoading(true);
        // In Phase 2, this will fetch from a 'user_bookmarks' table.
        const { data, error: supabaseError } = await supabase
          .from('topics')
          .select('*')
          .eq('status', 'ready')
          .limit(3);
        
        if (supabaseError) throw supabaseError;
        if (data) setBookmarks(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    }
    loadBookmarks();
  }, []);

  return (
    <div className="px-6 lg:px-12 py-10 w-full max-w-7xl">
      <div className="mb-12 text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-black text-on-surface tracking-tighter mb-4">
          Your <span className="text-primary font-black">Bookmarks</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
          Quick access to your saved modules and high-priority revision topics.
        </p>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-6 rounded-3xl border border-error/10 mb-8 flex items-center gap-4">
          <span className="material-symbols-outlined">error</span>
          <p className="font-bold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container/50 border border-white/5 p-6 rounded-2xl h-32 animate-pulse flex items-center justify-center">
              <div className="w-10 h-10 bg-surface-container-highest rounded-full"></div>
            </div>
          ))
        ) : (
          bookmarks.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))
        )}
        
        {bookmarks.length === 0 && !loading && !error && (
          <div className="col-span-full py-20 text-center bg-surface-container rounded-3xl border border-white/5 opacity-50 flex flex-col items-center">
             <span className="material-symbols-outlined text-4xl mb-4">bookmark_border</span>
             <p className="text-on-surface-variant font-bold">No bookmarks saved yet.</p>
             <Link href="/category" className="text-primary text-xs font-black uppercase tracking-widest mt-4 hover:underline">Browse Modules</Link>
          </div>
        )}
      </div>
    </div>
  );
}
