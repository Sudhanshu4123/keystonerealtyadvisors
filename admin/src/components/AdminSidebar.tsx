'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Quote,
} from 'lucide-react';
import { adminLogout } from '@/lib/api';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

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

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Master Projects', href: '/properties', icon: Building },
    { name: 'Testimonials', href: '/testimonials', icon: Quote },
    { name: 'Inquiries', href: '/inquiries', icon: MessageSquare },
    { name: 'Contact Messages', href: '/messages', icon: Mail },
    { name: 'Website Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 hidden md:flex min-h-screen shadow-xs">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-2 py-2 border-b border-slate-100 pb-4">
          <Link href="/dashboard" className="block bg-slate-50 p-2.5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
            <div className="text-center font-black text-blue-900 text-sm tracking-wider uppercase">
              Keystone Admin
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <a
          href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-900 hover:bg-slate-50 transition-colors"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Admin Logout</span>
        </button>
      </div>
    </aside>
  );
}
