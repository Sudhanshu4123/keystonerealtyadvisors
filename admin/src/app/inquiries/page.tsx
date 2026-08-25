'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/api';
import {
  MessageSquare,
  Phone,
  Mail,
  MessageCircle,
  Search,
  Filter,
  Trash2,
  Loader2,
  Calendar,
} from 'lucide-react';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await adminFetch(`/inquiries?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setInquiries(Array.isArray(data) ? data : data.inquiries || []);
      }
    } catch (err) {
      console.error('Fetch inquiries error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, search]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await adminFetch(`/inquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchInquiries();
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry record?')) return;
    try {
      const res = await adminFetch(`/inquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        fetchInquiries();
      } else {
        alert(data.error || 'Failed to delete inquiry.');
      }
    } catch (err: any) {
      alert('Delete error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 bg-slate-50">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-600" />
            <span>Customer Inquiries Center</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage public lead inquiries, update call status, and launch direct call/WhatsApp communications.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-900 font-medium shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-amber-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-900 shadow-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New Leads</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs font-medium">
            <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto mb-2" />
            <span>Loading inquiries...</span>
          </div>
        ) : inquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-extrabold border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Customer Info</th>
                  <th className="p-3.5">Project Interest</th>
                  <th className="p-3.5">Message / Requirements</th>
                  <th className="p-3.5">Preferred Contact</th>
                  <th className="p-3.5">Lead Status</th>
                  <th className="p-3.5 text-right">Quick Contact Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {inquiries.map((inq: any) => {
                  const cleanPhone = (inq.phone || '').replace(/[^0-9+]+/g, '');
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${inq.name}, thank you for reaching out to Keystone Real Estate Developments regarding your project inquiry.`
                  )}`;

                  return (
                    <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 space-y-1">
                        <div className="font-bold text-slate-900 text-sm">{inq.name}</div>
                        <div className="text-slate-600 font-semibold">{inq.phone}</div>
                        <div className="text-[11px] text-slate-400">{inq.email}</div>
                      </td>

                      <td className="p-3.5 text-blue-900 font-bold max-w-xs truncate">
                        {inq.project ? `${inq.project.name} (${inq.project.city || ''})` : 'General Project Inquiry'}
                      </td>

                      <td className="p-3.5 max-w-sm">
                        <p className="text-slate-700 line-clamp-3 leading-relaxed">{inq.message}</p>
                        {inq.visitDate && (
                          <div className="text-[10px] text-amber-700 font-bold flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3 text-amber-600" />
                            <span>Requested Site Visit: {inq.visitDate}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold">
                          {inq.preferredContact || 'PHONE'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase focus:outline-none cursor-pointer border ${
                            inq.status === 'NEW'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : inq.status === 'CONTACTED'
                              ? 'bg-blue-100 text-blue-900 border-blue-300'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                            title="Call Phone"
                          >
                            <Phone className="w-3.5 h-3.5 text-amber-600" />
                          </a>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="WhatsApp Client"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href={`mailto:${inq.email}?subject=Keystone Real Estate Project Inquiry Response`}
                            className="p-2 rounded-xl bg-blue-50 text-blue-900 hover:bg-blue-100 transition-colors"
                            title="Email Client"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleDelete(inq.id)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-8 text-center text-xs text-slate-500 font-medium">No customer inquiries recorded.</p>
        )}
      </div>

    </div>
  );
}
