'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Hide standard sidebar on the Topic page since it has its own Table of Contents
  if (pathname.startsWith('/reader/')) return null;

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-surface-container-lowest border-r border-white/5 transition-colors duration-500 font-sans text-sm font-medium z-40 pt-16">
      <div className="p-8 pb-4">
        <div className="text-lg font-black uppercase tracking-widest text-primary">The Curator</div>
        <div className="text-[10px] text-on-surface-variant tracking-[0.2em] mt-1 uppercase">
          {mounted ? 'IDAA Scholar' : 'Academic Tier'}
        </div>
      </div>
      
      <div className="flex flex-col space-y-1 p-6 h-full mt-6">
        <Link href="/" className={`px-4 py-3.5 flex items-center space-x-3 transition-all duration-200 rounded-xl ${pathname === '/' ? 'bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
          <span className="material-symbols-outlined" style={pathname === '/' ? {fontVariationSettings: "'FILL' 1"} : {}}>dashboard</span>
          <span className={pathname === '/' ? "font-bold" : ""}>Dashboard</span>
        </Link>
        
        <Link href="/category/financial-reporting" className={`px-4 py-3.5 flex items-center space-x-3 transition-all duration-200 rounded-xl ${pathname.includes('financial-reporting') ? 'bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
          <span className="material-symbols-outlined" style={pathname.includes('financial-reporting') ? {fontVariationSettings: "'FILL' 1"} : {}}>menu_book</span>
          <span className={pathname.includes('financial-reporting') ? "font-bold" : ""}>Modules</span>
        </Link>
        
        <Link href="/bookmarks" className={`px-4 py-3.5 flex items-center space-x-3 transition-all duration-200 rounded-xl ${pathname === '/bookmarks' ? 'bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
          <span className="material-symbols-outlined" style={pathname === '/bookmarks' ? {fontVariationSettings: "'FILL' 1"} : {}}>bookmark</span>
          <span className={pathname === '/bookmarks' ? "font-bold" : ""}>Bookmarks</span>
        </Link>
        
        <Link href="/admin" className={`px-4 py-3.5 flex items-center space-x-3 transition-all duration-200 rounded-xl ${pathname === '/admin' ? 'bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}>
          <span className="material-symbols-outlined" style={pathname === '/admin' ? {fontVariationSettings: "'FILL' 1"} : {}}>settings</span>
          <span className={pathname === '/admin' ? "font-bold" : ""}>Console</span>
        </Link>
      </div>
      
      <div className="mt-auto p-6">
        <div className="bg-surface-container-low rounded-2xl p-4 border border-white/5">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-on-surface font-black uppercase tracking-widest">Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
