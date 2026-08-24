import { ReactNode } from 'react';
import { getAdminFromSession } from '@/lib/auth';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

export const metadata = {
  title: 'Admin Control Center | Keystone Real Estate',
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await getAdminFromSession();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {admin && <AdminSidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        {admin && <AdminHeader admin={admin} />}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
