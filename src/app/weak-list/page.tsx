'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TopicCard } from '@/components/TopicCard';

export default function WeakListPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWeakTopics() {
      try {
        setLoading(true);
        // Note: Currently fetching generic ready topics as a baseline.
        // TODO: Update query to filter by actual user progress/mastery level in Phase 2.
        const { data, error: supabaseError } = await supabase
          .from('topics')
          .select('*')
          .eq('status', 'ready')
          .limit(4);
        
        if (supabaseError) throw supabaseError;
        if (data) setTopics(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load priority topics');
      } finally {
        setLoading(false);
      }
    }
    loadWeakTopics();
  }, []);

  return (
    <div className="px-6 lg:px-12 py-10 w-full max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-black text-on-surface tracking-tighter mb-4">
          Priority <span className="text-error font-black">Revision</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl font-medium leading-relaxed">
          These are the modules where your mastery levels need attention. Focus on these to improve your overall CA interview readiness.
        </p>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-6 rounded-3xl border border-error/10 mb-8 flex items-center gap-4">
          <span className="material-symbols-outlined">report_problem</span>
          <p className="font-bold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container border border-white/5 p-6 rounded-2xl h-32 animate-pulse opacity-50"></div>
          ))
        ) : (
          topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))
        )}

        {!loading && topics.length === 0 && !error && (
          <div className="col-span-full py-20 text-center bg-surface-container rounded-3xl border border-white/5 opacity-50">
             <p className="text-on-surface-variant font-bold">No priority revision topics found. Great job!</p>
          </div>
        )}
      </div>
    </div>
  );
}
