'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, ExternalLink, Menu } from 'lucide-react';
import { useState } from 'react';
import { adminLogout } from '@/lib/api';

interface AdminHeaderProps {
  admin?: { name?: string; email?: string };
}

export default function AdminHeader({ admin = { name: 'Admin', email: 'admin@keystone.com' } }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (pathname === '/login' || pathname === '/admin/login') return null;

  const handleLogout = async () => {
    try {
      await adminLogout();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="md:hidden text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Keystone Admin Management</span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
              Secure Session
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-black flex items-center justify-center text-xs shadow-xs">
            {(admin?.name || 'A').charAt(0)}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-slate-900 text-xs leading-none">{admin?.name || 'Admin'}</span>
            <span className="text-[10px] text-slate-500 leading-none mt-0.5">{admin?.email || 'admin@keystone.com'}</span>
          </div>
        </div>

        <a
          href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
