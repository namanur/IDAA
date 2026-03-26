'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { TopicCard } from '@/components/TopicCard';

export default function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = use(searchParams);
  const query = params.q || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      let fetch = supabase.from('topics').select('*').order('title');
      
      if (query) {
        fetch = fetch.ilike('title', `%${query}%`);
      }

      const { data } = await fetch;
      if (data) setResults(data);
      setLoading(false);
    }
    performSearch();
  }, [query]);

  return (
    <div className="px-6 lg:px-12 py-10 w-full max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-black text-on-surface tracking-tighter mb-4">
          {query ? `Search: ${query}` : 'Explore All Modules'}
        </h1>
        <p className="text-on-surface-variant max-w-2xl font-medium leading-relaxed">
          {query ? `Found ${results.length} topics matching your request.` : 'Browse the complete IDAA curriculum catalog.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container border border-white/5 p-6 rounded-2xl h-32 animate-pulse opacity-50"></div>
          ))
        ) : (
          results.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))
        )}
        {results.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-surface-container rounded-3xl border border-white/5 opacity-50">
             <p className="text-on-surface-variant font-bold">No matching topics located.</p>
          </div>
        )}
      </div>
    </div>
  );
}
