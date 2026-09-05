'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectCard from '@/components/ProjectCard';
import { PROJECT_TYPES, PROJECT_STATUSES, Project } from '@/lib/types';
import { fetchProjects as apiFetchProjects } from '@/lib/api';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
} from 'lucide-react';

function ProjectsContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || 'ALL');
  const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await apiFetchProjects({
        search: search.trim() || undefined,
        type: type !== 'ALL' ? type : undefined,
        status: status !== 'ALL' ? status : undefined,
        location: location.trim() || undefined,
        featured: featuredOnly || undefined,
        sortBy,
        publishedOnly: true,
      });

      setProjects(data || []);
    } catch (err) {
      console.error('Fetch listing projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [search, type, status, location, featuredOnly, sortBy, page]);

  const handleResetFilters = () => {
    setSearch('');
    setType('ALL');
    setStatus('ALL');
    setLocation('');
    setFeaturedOnly(false);
    setSortBy('newest');
    setPage(1);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-white">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Real Estate Projects Directory
          </h1>
          <p className="text-slate-600 text-sm mt-1 font-normal">
            Explore our master-planned residential townships, luxury villas, and corporate towers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="lg:hidden flex items-center gap-2 bg-slate-100 text-slate-900 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Filters</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-900"
          >
            <option value="newest">Sort By: Newest First</option>
            <option value="name-asc">Sort By: Name (A to Z)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* FILTER SIDEBAR */}
        <aside
          className={`lg:block bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm ${filterDrawerOpen ? 'block' : 'hidden lg:block'
            }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-600" />
              <span>Filter Projects</span>
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-900 hover:text-blue-700 flex items-center gap-1 font-bold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Project Keyword</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name, features..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-900 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Project Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Project Category</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-900 font-medium"
            >
              <option value="ALL">All Categories</option>
              {PROJECT_TYPES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} Projects
                </option>
              ))}
            </select>
          </div>

          {/* Project Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Project Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-900 font-medium"
            >
              <option value="ALL">All Statuses</option>
              {PROJECT_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st} Projects
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">City / Location</label>
            <input
              type="text"
              placeholder="e.g. Manhattan, Beverly Hills..."
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-900 font-medium"
            />
          </div>

          {/* Featured Toggle */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Featured Projects Only</span>
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => {
                setFeaturedOnly(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
            />
          </div>
        </aside>

        {/* RESULTS GRID */}
        <main className="lg:col-span-3 space-y-8">

          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>
              Showing <strong className="text-slate-900">{projects.length}</strong> master projects
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 rounded-3xl h-96 animate-pulse p-4 space-y-4"
                >
                  <div className="bg-slate-200 h-48 rounded-2xl w-full" />
                  <div className="bg-slate-200 h-4 rounded w-3/4" />
                  <div className="bg-slate-200 h-4 rounded w-1/2" />
                  <div className="bg-slate-200 h-10 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-xl font-black text-slate-900">No Projects Found</h3>
              <p className="text-slate-600 text-xs max-w-sm mx-auto">
                Try adjusting your search criteria or resetting filters to view all available master projects.
              </p>
              <button
                onClick={handleResetFilters}
                className="gold-btn px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer mt-2"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-600 text-sm">
          <Loader2 className="w-6 h-6 animate-spin text-amber-600 mr-2" />
          <span>Loading project directory...</span>
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
