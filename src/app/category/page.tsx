'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CategoriesPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'financial-reporting', name: 'Financial Reporting', desc: 'Mastering Ind AS, IFRS, and complex business combinations.', icon: 'account_balance' },
    { id: 'audit-assurance', name: 'Audit & Assurance', desc: 'Standards on Auditing, CARO 2020, and professional ethics.', icon: 'verified_user' },
    { id: 'taxation', name: 'Taxation', desc: 'Corporate tax, GST, Transfer Pricing, and latest amendments.', icon: 'payments' },
    { id: 'corporate-law', name: 'Corporate Law', desc: 'Companies Act 2013 and SEBI Listing Regulations.', icon: 'gavel' },
    { id: 'fm-analysis', name: 'FM & Analysis', desc: 'Valuation models, cash flow analysis, and ratio interpretation.', icon: 'trending_up' },
    { id: 'soft-skills', name: 'Soft Skills', desc: 'Elevator pitch, STAR method, and interview behavioral prep.', icon: 'forum' }
  ];

  useEffect(() => {
    async function loadTopics() {
      const { data } = await supabase.from('topics').select('category, status');
      if (data) setTopics(data);
      setLoading(false);
    }
    loadTopics();
  }, []);

  return (
    <div className="px-6 lg:px-12 py-10 w-full max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-black text-on-surface tracking-tighter mb-4">
          All <span className="text-primary">Curriculum Modules</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl font-medium leading-relaxed">
          Select a specialized module to begin your deep-dive preparation for CA interviews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => {
          const catTopics = topics.filter(t => t.category === cat.name);
          const activeTopics = catTopics.filter(t => t.status === 'published' || t.status === 'ready');
          const progressPercent = catTopics.length > 0 ? Math.round((activeTopics.length / catTopics.length) * 100) : 0;

          return (
            <Link 
              key={cat.id} 
              href={`/category/${cat.id}`}
              className="group bg-surface-container hover:bg-surface-container-high p-8 rounded-[2.5rem] border border-white/5 transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-16 h-16 rounded-2xl bg-surface-container-highest group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center mb-6 transition-all duration-500 shadow-sm">
                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
              </div>
              
              <h3 className="text-2xl font-black text-on-surface mb-3 group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed font-medium line-clamp-3">{cat.desc}</p>
              
              <div className="mt-auto space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                  <span>Knowledge Tracked</span>
                  <span className="text-primary">{progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
