import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Building2,
  CheckCircle2,
  Clock,
  MessageSquare,
  Mail,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const revalidate = 0;

async function getDashboardMetrics() {
  try {
    const [
      totalProjects,
      upcomingProjects,
      ongoingProjects,
      completedProjects,
      totalInquiries,
      newInquiries,
      totalMessages,
      recentInquiries,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'Upcoming' } }),
      prisma.project.count({ where: { status: 'Ongoing' } }),
      prisma.project.count({ where: { status: 'Completed' } }),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'NEW' } }),
      prisma.contactMessage.count(),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { project: { select: { name: true } } },
      }),
    ]);

    return {
      totalProjects,
      upcomingProjects,
      ongoingProjects,
      completedProjects,
      totalInquiries,
      newInquiries,
      totalMessages,
      recentInquiries,
    };
  } catch (err) {
    console.error('Dashboard metrics error:', err);
    return {
      totalProjects: 0,
      upcomingProjects: 0,
      ongoingProjects: 0,
      completedProjects: 0,
      totalInquiries: 0,
      newInquiries: 0,
      totalMessages: 0,
      recentInquiries: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const admin = await getAdminFromSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-8 bg-slate-50">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest font-extrabold text-amber-600">
            Project Overview Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Welcome back, {admin.name}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your real estate master projects, floor plans, PDF brochures, customer inquiries, and platform settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties"
            className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </Link>
        </div>
      </div>

      {/* METRICS GRID (7 CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        
        {/* Total Projects */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Projects</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.totalProjects}</span>
          <span className="text-[10px] text-slate-500 block">Master Listings</span>
        </div>

        {/* Upcoming Projects */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 uppercase block">Upcoming</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600">{metrics.upcomingProjects}</span>
          <span className="text-[10px] text-slate-500 block">Future Launches</span>
        </div>

        {/* Ongoing Projects */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
          <span className="text-[10px] font-bold text-blue-900 uppercase block">Ongoing</span>
          <span className="text-2xl sm:text-3xl font-black text-blue-900">{metrics.ongoingProjects}</span>
          <span className="text-[10px] text-slate-500 block">Under Construction</span>
        </div>

        {/* Completed Projects */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase block">Completed</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600">{metrics.completedProjects}</span>
          <span className="text-[10px] text-slate-500 block">Delivered Keys</span>
        </div>

        {/* Total Inquiries */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Inquiries</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.totalInquiries}</span>
          <span className="text-[10px] text-slate-500 block">Total Forms</span>
        </div>

        {/* New Inquiries */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
          <span className="text-[10px] font-bold text-amber-700 uppercase block">New Inquiries</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-700">{metrics.newInquiries}</span>
          <span className="text-[10px] text-amber-700 font-semibold block">Requires Action</span>
        </div>

        {/* Contact Messages */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Messages</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.totalMessages}</span>
          <span className="text-[10px] text-slate-500 block">Contact Form</span>
        </div>

      </div>

      {/* RECENT INQUIRIES WIDGET */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            <span>Recent Customer Project Inquiries</span>
          </h2>
          <Link
            href="/admin/inquiries"
            className="text-xs text-blue-900 hover:text-blue-700 font-bold flex items-center gap-1"
          >
            <span>View All Inquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {metrics.recentInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Contact Details</th>
                  <th className="p-3">Project Interest</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {metrics.recentInquiries.map((inq: any) => (
                  <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{inq.name}</td>
                    <td className="p-3 space-y-0.5">
                      <div className="text-slate-800 font-semibold">{inq.phone}</div>
                      <div className="text-[10px] text-slate-500">{inq.email}</div>
                    </td>
                    <td className="p-3 max-w-xs truncate text-blue-900 font-bold">
                      {inq.project?.name || 'General Project Inquiry'}
                    </td>
                    <td className="p-3 max-w-xs truncate text-slate-600">{inq.message}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          inq.status === 'NEW'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : inq.status === 'CONTACTED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link
                        href="/admin/inquiries"
                        className="text-xs text-blue-900 hover:underline font-bold"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">No customer inquiries recorded yet.</p>
        )}
      </div>

    </div>
  );
}
