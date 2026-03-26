'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Play, 
  Edit3, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  BarChart3, 
  Activity,
  Zap,
  Loader2,
  RefreshCcw
} from 'lucide-react';

import { triggerResearch, syncResearchStatus } from '@/lib/actions/research';

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
    if (!result.success) {
      alert(result.error);
    }
    await fetchTopics();
    setProcessingId(null);
  }

  async function handleSync(id: string) {
    setProcessingId(id);
    const result = await syncResearchStatus(id);
    if (!result.success && result.status !== 'in_progress') {
      alert(result.error);
    } else if (result.status === 'completed') {
      alert('Research Completed!');
    } else {
      alert('Still in progress...');
    }
    await fetchTopics();
    setProcessingId(null);
  }

  async function handlePublish(id: string) {
    const { error } = await supabase
      .from('topics')
      .update({ status: 'ready' }) // Admin marks as ready, published logic handles release_date
      .eq('id', id);
    
    if (error) alert(error.message);
    await fetchTopics();
  }

  async function fetchTopics() {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('release_date', { ascending: true });

    if (data) {
      setTopics(data);
      const ready = data.filter(t => t.status === 'ready' || t.status === 'published').length;
      const failed = data.filter(t => t.status === 'failed').length;
      setStats({
        total: data.length,
        ready,
        failed,
        pending: data.length - ready - failed
      });
    }
    setLoading(false);
  }

  const getStatusBadge = (status: string) => {
    const styles: any = {
      queued: 'bg-slate-100 text-slate-600',
      generating: 'bg-amber-100 text-amber-700 animate-pulse',
      generated: 'bg-blue-100 text-blue-700',
      reviewing: 'bg-purple-100 text-purple-700',
      ready: 'bg-emerald-100 text-emerald-700',
      published: 'bg-indigo-100 text-indigo-700',
      failed: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.queued}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A237E]">Admin Console</h1>
          <p className="text-slate-500">Manage your 60-day content pipeline</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Clock className="w-4 h-4" />} label="Total" value={stats.total} color="text-slate-600" />
          <StatCard icon={<CheckCircle className="w-4 h-4" />} label="Ready" value={stats.ready} color="text-emerald-600" />
          <StatCard icon={<Activity className="w-4 h-4" />} label="Pending" value={stats.pending} color="text-amber-600" />
          <StatCard icon={<AlertCircle className="w-4 h-4" />} label="Failed" value={stats.failed} color="text-red-600" />
        </div>
      </div>

      {/* Observability Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-4">
          <div className="p-2 bg-indigo-50 rounded-lg"><Zap className="w-5 h-5 text-indigo-600" /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">API Health</p>
            <p className="text-sm font-semibold">Gemini Flash 2.0 - Active</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-4">
          <div className="p-2 bg-emerald-50 rounded-lg"><BarChart3 className="w-5 h-5 text-emerald-600" /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Token Usage</p>
            <p className="text-sm font-semibold">12% of Free Tier</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-4">
          <div className="p-2 bg-amber-50 rounded-lg"><Play className="w-5 h-5 text-amber-600" /></div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Active Tasks</p>
            <p className="text-sm font-semibold">None</p>
          </div>
        </div>
      </div>

      {/* Pipeline Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Topic</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Module</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Release</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topics.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                  No topics found. Run the seed script to populate.
                </td>
              </tr>
            ) : (
              topics.map((topic) => (
                <tr key={topic.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{topic.title}</p>
                    <p className="text-xs text-slate-400">{topic.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{topic.category}</td>
                  <td className="px-6 py-4">{getStatusBadge(topic.status)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{topic.release_date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {['queued', 'failed', 'delayed'].includes(topic.status) && (
                        <button 
                          onClick={() => handleTrigger(topic.id)}
                          disabled={processingId === topic.id}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all disabled:opacity-50"
                          title="Trigger Generation"
                        >
                          {processingId === topic.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        </button>
                      )}
                      {topic.status === 'generating' && (
                        <button 
                          onClick={() => handleSync(topic.id)}
                          disabled={processingId === topic.id}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all disabled:opacity-50"
                          title="Sync Status"
                        >
                          {processingId === topic.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                        </button>
                      )}
                      {topic.status === 'generated' && (
                        <button 
                          className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-all"
                          title="Review & Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {topic.status === 'reviewing' && (
                        <button 
                          onClick={() => handlePublish(topic.id)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all"
                          title="Mark as Ready"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-3 px-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
      <div className={`${color}`}>{icon}</div>
      <div>
        <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">{label}</p>
        <p className={`text-lg font-bold leading-none ${color}`}>{value}</p>
      </div>
    </div>
  );
}
