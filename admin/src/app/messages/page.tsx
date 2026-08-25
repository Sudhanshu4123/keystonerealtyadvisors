'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/api';
import { Mail, Phone, MessageCircle, Trash2, Loader2 } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/messages');
      const data = await res.json();
      if (res.ok) {
        setMessages(Array.isArray(data) ? data : data.messages || []);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await adminFetch(`/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch (err) {
      console.error('Update message status error:', err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    try {
      const res = await adminFetch(`/messages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        fetchMessages();
      } else {
        alert(data.error || 'Failed to delete message.');
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
            <Mail className="w-6 h-6 text-amber-600" />
            <span>Contact Us Submissions</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage inquiries submitted via the public Contact Us form.
          </p>
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs font-medium">
            <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto mb-2" />
            <span>Loading contact messages...</span>
          </div>
        ) : messages.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {messages.map((msg: any) => {
              const cleanPhone = (msg.phone || '').replace(/[^0-9+]+/g, '');
              const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `Hello ${msg.name}, thank you for contacting Keystone Real Estate Developments.`
              )}`;

              return (
                <div key={msg.id} className="p-6 space-y-4 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900">{msg.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="font-semibold">{msg.phone}</span>
                        <span>•</span>
                        <span>{msg.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={msg.status}
                        onChange={(e) => handleUpdateStatus(msg.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase focus:outline-none cursor-pointer border ${
                          msg.status === 'NEW'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : msg.status === 'REPLIED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="READ">READ</option>
                        <option value="REPLIED">REPLIED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>

                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                    {msg.message}
                  </p>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-3 text-xs">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-bold hover:bg-slate-200 flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>Call {msg.phone}</span>
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-100 flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`mailto:${msg.email}?subject=Response from Keystone Real Estate`}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-bold hover:bg-blue-100 flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply Email</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="p-8 text-center text-xs text-slate-500 font-medium">No contact messages received.</p>
        )}
      </div>

    </div>
  );
}
