'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building, Filter } from 'lucide-react';
import { PROJECT_TYPES, PROJECT_STATUSES } from '@/lib/types';

export default function ProjectSearchBox() {
  const router = useRouter();
  const [type, setType] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) params.set('search', search.trim());
    if (type !== 'ALL') params.set('type', type);
    if (status !== 'ALL') params.set('status', status);
    if (location.trim()) params.set('location', location.trim());

    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Project Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4 overflow-x-auto">
        {['ALL', ...PROJECT_TYPES].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setType(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              type === tab
                ? 'gold-btn shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab === 'ALL' ? 'All Projects' : `${tab} Projects`}
          </button>
        ))}
      </div>

      {/* Form Controls */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Keyword Search */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-amber-600" />
            <span>Search Keywords</span>
          </label>
          <input
            type="text"
            placeholder="Project name, features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-900 font-medium"
          />
        </div>

        {/* Location Search */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>City / Area</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Manhattan, Beverly Hills..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-900 font-medium"
          />
        </div>

        {/* Project Status */}
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>Project Status</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-900 font-medium"
          >
            <option value="ALL">All Statuses</option>
            {PROJECT_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st} Projects
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full royal-btn py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search Projects</span>
          </button>
        </div>
      </form>
    </div>
  );
}
