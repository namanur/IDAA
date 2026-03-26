'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { triggerResearch } from '@/lib/actions/research';

export default function AdminDashboard() {
  const [topics, setTopics] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, ready: 0, pending: 0, failed: 0 });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  async function handleTrigger(id: string) {
    setProcessingId(id);
    const result = await triggerResearch(id);
    if (!result.success) alert(result.error);
    await fetchTopics();
    setProcessingId(null);
  }

  async function handleGenerateAll() {
    const queued = topics.filter(t => ['queued', 'failed'].includes(t.status));
    if (!queued.length) return alert('No topics in queue to generate.');
    if (!confirm(`This will trigger generation for ${queued.length} topics. Continue?`)) return;

    for (const topic of queued) {
      setProcessingId(topic.id);
      await triggerResearch(topic.id);
      // Small delay to avoid hammering Gemini rate limits
      await new Promise(r => setTimeout(r, 3000));
    }
    await fetchTopics();
    setProcessingId(null);
  }

  async function handlePublish(id: string) {
    const { error } = await supabase.from('topics').update({ status: 'ready' }).eq('id', id);
    if (error) alert(error.message);
    await fetchTopics();
  }

  async function fetchTopics() {
    const { data } = await supabase.from('topics').select('*').order('release_date', { ascending: true });
    if (data) {
      setTopics(data);
      const ready = data.filter(t => t.status === 'ready' || t.status === 'published').length;
      const failed = data.filter(t => t.status === 'failed').length;
      setStats({ total: data.length, ready, failed, pending: data.length - ready - failed });
    }
    setLoading(false);
  }

  const getStatusBadge = (status: string) => {
    const styles: any = {
      queued: 'bg-surface-container-highest text-on-surface',
      generating: 'bg-primary-container/20 border border-primary text-primary animate-pulse',
      generated: 'bg-tertiary-container text-on-tertiary-container',
      reviewing: 'bg-secondary-container text-on-secondary-container',
      ready: 'bg-emerald-500/20 text-emerald-400',
      published: 'bg-secondary-container text-on-secondary-container',
      failed: 'bg-error-container text-on-error-container'
    };
    return (
      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${styles[status] || styles.queued}`}>
        {status}
      </span>
    );
  };

  if (loading) return null;

  return (
    <div className="w-full px-6 lg:px-12 pb-12">
      {/* Bento Grid Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container p-6 rounded-xl hover:bg-surface-container-high transition-colors">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-2">Total Ingested</p>
          <h3 className="text-4xl font-extrabold text-[#FFC107]">{stats.total}</h3>
          <div className="mt-4 flex items-center gap-2 text-primary text-xs">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>Target 60 Topics</span>
          </div>
        </div>
        <div className="bg-surface-container p-6 rounded-xl hover:bg-surface-container-high transition-colors">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-2">Processing Nodes</p>
          <h3 className="text-4xl font-extrabold text-[#E5E2E1]">{stats.pending}</h3>
          <div className="mt-4 flex items-center gap-2 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-sm text-primary" style={{fontVariationSettings: "'FILL' 1"}}>circle</span>
            <span>Tasks queued</span>
          </div>
        </div>
        <div className="bg-surface-container p-6 rounded-xl hover:bg-surface-container-high transition-colors">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-2">Knowledge Graph</p>
          <h3 className="text-4xl font-extrabold text-[#E5E2E1]">{stats.ready}</h3>
          <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs">
            <span>Production ready</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-xl flex flex-col justify-between">
          <p className="text-primary text-xs font-bold uppercase tracking-widest">Global Status</p>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase tracking-tighter">Ready</span>
              <button className="bg-primary-container text-on-primary text-xs px-4 py-2 rounded font-bold active:scale-95 transition-transform" onClick={() => fetchTopics()}>Sync Core</button>
            </div>
            <button 
              onClick={handleGenerateAll}
              disabled={processingId !== null}
              className="w-full bg-[#1A237E] text-white py-2 rounded font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#151c63] active:scale-95 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">bolt</span>
              Generate All Queued
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Table Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 bg-surface-container-low flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-[#E5E2E1]">Topic Pipeline</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-surface-container-high rounded text-[10px] text-on-surface-variant">Active Engine: Gemini Flash</span>
              </div>
            </div>
            <div className="overflow-x-auto h-[600px]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-surface-container z-10">
                  <tr className="text-on-surface-variant text-xs uppercase tracking-widest border-b border-outline-variant/10">
                    <th className="px-6 py-4 font-semibold">Identifier</th>
                    <th className="px-6 py-4 font-semibold">Subject Context</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-outline-variant/5">
                  {topics.map((topic) => (
                    <tr key={topic.id} className="hover:bg-surface-container-high transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">#{topic.slug.substring(0,8)}</td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-bold text-[#E5E2E1] truncate">{topic.title}</div>
                        <div className="text-[10px] text-on-surface-variant">{topic.category} • Module</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(topic.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* Action buttons mapped from specific logic needs */}
                        {['queued', 'failed'].includes(topic.status) && (
                          <button onClick={() => handleTrigger(topic.id)} disabled={processingId === topic.id} className="bg-primary text-on-primary text-xs px-4 py-2 rounded font-bold disabled:opacity-50 transition-all">
                            {processingId === topic.id ? 'Starting...' : 'Trigger'}
                          </button>
                        )}
                        {topic.status === 'generating' && (
                          <span className="text-[10px] text-primary animate-pulse font-bold">GENERATING...</span>
                        )}
                        {topic.status === 'generated' && (
                           <button onClick={() => handlePublish(topic.id)} disabled={processingId === topic.id} className="bg-secondary-container text-on-secondary-container text-xs px-4 py-2 rounded font-bold transition-all">
                             Review
                           </button>
                        )}
                        {['reviewing', 'ready', 'published'].includes(topic.status) && (
                          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Observability Metrics & Sidebar */}
        <div className="space-y-8">
          <div className="bg-surface-container p-6 rounded-xl space-y-6 shadow-xl">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">monitoring</span>
              Observability Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-on-surface-variant uppercase tracking-widest">Inference Latency</span>
                  <span className="text-primary font-bold">~ 14.2s (Gen AI)</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container w-[14%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-on-surface-variant uppercase tracking-widest">Error Rate</span>
                  <span className="text-error font-bold">{stats.failed > 0 ? ((stats.failed/stats.total)*100).toFixed(1) : '0.0'}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                  <div className="h-full bg-error rounded-full" style={{width: `${stats.failed > 0 ? ((stats.failed/stats.total)*100) : 0}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-container p-6 rounded-xl text-on-primary shadow-[0_20px_40px_rgba(255,193,7,0.15)] relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-2 leading-tight">System Notice</h4>
              <p className="text-sm font-medium opacity-80 mb-6">Database connected and ready for Gemini Generation Tasks.</p>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">auto_awesome</span>
          </div>
        </div>
      </div>
    </div>
  );
}
