'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, CheckCircle2, Loader2, BarChart3 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    companyName: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    workingHours: '',
    siteTitle: '',
    siteDescription: '',
    projectsDelivered: '48+',
    yearsExperience: '15+',
    happyCustomers: '12,500+',
    ongoingProjects: '12',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (res.ok && data.settings) {
        setForm({
          companyName: data.settings.companyName || '',
          phone: data.settings.phone || '',
          whatsapp: data.settings.whatsapp || '',
          email: data.settings.email || '',
          address: data.settings.address || '',
          workingHours: data.settings.workingHours || '',
          siteTitle: data.settings.siteTitle || '',
          siteDescription: data.settings.siteDescription || '',
          projectsDelivered: data.settings.projectsDelivered || '48+',
          yearsExperience: data.settings.yearsExperience || '15+',
          happyCustomers: data.settings.happyCustomers || '12,500+',
          ongoingProjects: data.settings.ongoingProjects || '12',
        });
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      setSuccessMsg('Website settings and company metrics saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs font-medium">
        <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto mb-2" />
        <span>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl bg-slate-50">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-amber-600" />
            <span>Website & Company Settings</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Configure company phone numbers, email, address, company statistics counters, and SEO metadata.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm text-xs font-medium text-slate-900">
        
        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
            Company Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Company Legal Name</label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Official Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Public Phone</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">WhatsApp Number</label>
              <input
                type="text"
                required
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900 font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Headquarters Address</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900 font-semibold"
            />
          </div>
        </div>

        {/* Configurable Statistics Counter */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <span>Configurable Homepage Statistics Counters</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Projects Delivered</label>
              <input
                type="text"
                value={form.projectsDelivered}
                onChange={(e) => setForm({ ...form, projectsDelivered: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Years Experience</label>
              <input
                type="text"
                value={form.yearsExperience}
                onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Happy Customers</label>
              <input
                type="text"
                value={form.happyCustomers}
                onChange={(e) => setForm({ ...form, happyCustomers: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Ongoing Projects</label>
              <input
                type="text"
                value={form.ongoingProjects}
                onChange={(e) => setForm({ ...form, ongoingProjects: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
            SEO Configuration
          </h2>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Default Meta Title</label>
            <input
              type="text"
              required
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Default Meta Description</label>
            <textarea
              rows={3}
              required
              value={form.siteDescription}
              onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="gold-btn px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
