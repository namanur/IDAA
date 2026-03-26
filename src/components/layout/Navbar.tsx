'use client';

import Link from 'next/link';
import { Search, Flame, User, BookMarked, Home as HomeIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-6">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Link href="/" className="text-2xl font-bold text-[#1A237E] tracking-tight">
          IDAA
        </Link>
      </div>

      {/* Desktop Navigation / Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics, GST, Excel..."
            className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#1A237E] outline-none transition-all"
          />
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAEEDA] rounded-full">
          <Flame className="w-4 h-4 text-[#854F0B]" fill="#FFC107" />
          <span className="text-sm font-semibold text-[#854F0B]">5 Days</span>
        </div>
        
        <Link href="/bookmarks" className="text-slate-600 hover:text-[#1A237E] transition-colors">
          <BookMarked className="w-5 h-5" />
        </Link>
        
        <Link href={user ? "/profile" : "/login"}>
          <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 hover:border-[#1A237E] transition-all">
            <User className="w-5 h-5 text-slate-600" />
          </div>
        </Link>
      </div>

      {/* Mobile Bottom Bar Placeholder (Visible on Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-4">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#1A237E]">
          <HomeIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/weak-list" className="flex flex-col items-center gap-1 text-slate-400">
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Weak List</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-400">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
