'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNavbar() {
  const pathname = usePathname();

  if (pathname.startsWith('/reader/')) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container/95 backdrop-blur-xl border-t border-white/5 px-8 py-4 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Link href="/" className={`flex flex-col items-center ${pathname === '/' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-2xl" style={pathname === '/' ? {fontVariationSettings: "'FILL' 1"} : {}}>dashboard</span>
          <span className={`text-[10px] mt-1 uppercase tracking-widest ${pathname === '/' ? 'font-black' : 'font-bold'}`}>Home</span>
        </Link>
        <Link href="/category/excel" className={`flex flex-col items-center ${pathname.includes('excel') ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-2xl">menu_book</span>
          <span className="text-[10px] mt-1 font-bold uppercase tracking-widest">Modules</span>
        </Link>
        <Link href="/admin" className={`flex flex-col items-center ${pathname === '/admin' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-2xl">settings</span>
          <span className="text-[10px] mt-1 font-bold uppercase tracking-widest">Admin</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center ${pathname === '/profile' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-2xl">person</span>
          <span className="text-[10px] mt-1 font-bold uppercase tracking-widest">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
