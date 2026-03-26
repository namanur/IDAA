'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TopicCard } from '@/components/TopicCard';

export default function WeakListPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeakTopics() {
      // Logic for "Weak" topics - topics where user progress is low or failed
      const { data } = await supabase
        .from('topics')
        .select('*')
        .eq('status', 'ready')
        .limit(4);
      
      if (data) setTopics(data);
      setLoading(false);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}
