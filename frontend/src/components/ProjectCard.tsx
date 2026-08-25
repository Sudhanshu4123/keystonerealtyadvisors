'use client';

import Link from 'next/link';
import { MapPin, ArrowRight, Star, Layers, Calendar } from 'lucide-react';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const primaryImage =
    project.images?.find((img) => img.isPrimary)?.imageUrl ||
    project.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
      
      {/* Image Banner */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${
              project.status === 'Completed'
                ? 'bg-emerald-600 text-white'
                : project.status === 'Ongoing'
                ? 'bg-blue-900 text-white'
                : 'bg-amber-500 text-slate-950'
            }`}
          >
            {project.status}
          </span>
          <span className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-xs font-extrabold border border-slate-200">
            {project.type}
          </span>
        </div>

        {project.featured && (
          <div className="absolute top-4 right-4 z-10 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>FEATURED</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{project.area}, {project.city}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">
            {project.name}
          </h3>
          <p className="text-slate-600 text-xs mt-2 line-clamp-2 leading-relaxed font-normal">
            {project.shortDescription || project.description}
          </p>
        </div>

        {/* Overview Pills */}
        <div className="grid grid-cols-2 gap-2 py-3 px-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-700 font-semibold">
          {project.totalArea && (
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{project.totalArea}</span>
            </div>
          )}
          {project.completionDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{project.completionDate}</span>
            </div>
          )}
        </div>

        {/* View Project Action */}
        <div className="pt-1">
          <Link
            href={`/projects/${project.slug}`}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-blue-900 text-white font-extrabold text-xs transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer shadow-sm"
          >
            <span>View Project Details</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
}
