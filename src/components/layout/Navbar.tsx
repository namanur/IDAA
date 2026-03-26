'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isReaderView = pathname.startsWith('/reader/');

  // If in Reader View, render the GST Reader Specific Navbar
  if (isReaderView) {
    return (
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-surface-dim backdrop-blur-xl bg-opacity-80 shadow-[0_48px_48px_-12px_rgba(250,189,0,0.06)] font-sans antialiased tracking-tight">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-primary tracking-tighter uppercase whitespace-nowrap">IDAA Scholar</Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search..."
              className="bg-surface-container-high border border-white/5 rounded-full py-1.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary outline-none transition-all w-48 focus:w-64"
            />
          </div>
          <Link href="/bookmarks" className="text-primary font-bold hover:bg-surface-container-high transition-colors duration-300 p-2 rounded-lg active:scale-95">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
          </Link>
        </div>
      </header>
    );
  }

  // Standard Scholar Navbar
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#121212]/90 backdrop-blur-xl border-b border-white/5 font-sans antialiased">
        <div className="flex justify-between items-center px-8 py-4 w-full h-16">
          <Link href="/" className="text-xl font-extrabold tracking-tighter text-primary whitespace-nowrap">IDAA Scholar</Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm group-focus-within:text-primary transition-colors">search</span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search modules, GST, Ind AS..."
                aria-label="Search modules"
                className="bg-surface-container-high border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all w-64 focus:w-80"
              />
            </div>
            <Link href="/" className={`font-bold transition-all duration-300 ${pathname === '/' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Dashboard</Link>
            <Link href="/syllabus" className={`font-semibold transition-all duration-300 ${pathname === '/syllabus' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Syllabus</Link>
            <Link href="/category" className={`font-semibold transition-all duration-300 ${pathname.startsWith('/category') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Modules</Link>
            <Link href="/bookmarks" className={`font-semibold transition-all duration-300 ${pathname === '/bookmarks' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Bookmarks</Link>
            <Link href="/admin" className={`font-semibold transition-all duration-300 ${pathname === '/admin' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>Console</Link>
          </div>

          <div className="flex items-center space-x-6">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">notifications</button>
            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high border border-white/5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-error hover:border-error/30 transition-all"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            ) : (
              <Link href="/login" className="h-8 w-8 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-sm text-on-surface">person</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 z-50">
        <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-xl" style={pathname === '/' ? {fontVariationSettings: "'FILL' 1"} : {}}>home</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">Home</span>
        </Link>
        <Link href="/syllabus" className={`flex flex-col items-center gap-1 ${pathname === '/syllabus' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-xl" style={pathname === '/syllabus' ? {fontVariationSettings: "'FILL' 1"} : {}}>event_note</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">Syllabus</span>
        </Link>
        <Link href="/bookmarks" className={`flex flex-col items-center gap-1 ${pathname === '/bookmarks' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-xl" style={pathname === '/bookmarks' ? {fontVariationSettings: "'FILL' 1"} : {}}>bookmark</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">Saved</span>
        </Link>
        <Link href="/admin" className={`flex flex-col items-center gap-1 ${pathname === '/admin' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-xl" style={pathname === '/admin' ? {fontVariationSettings: "'FILL' 1"} : {}}>settings</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">Admin</span>
        </Link>
        {user && (
          <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="text-[8px] font-bold uppercase tracking-widest">Exit</span>
          </button>
        )}
      </div>
    </>
  );
}
