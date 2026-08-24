'use client';

import { useRef, useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '@/lib/types';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';

interface ProjectsCarouselProps {
  projects: Project[];
  title?: string;
  subtitle?: string;
}

export default function ProjectsCarousel({
  projects,
  title = 'Master Real Estate Projects',
  subtitle = 'Swipe or click arrows to explore our master-planned residential townships, luxury villas, and corporate towers.',
}: ProjectsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener('scroll', checkScroll);
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  // Auto Scroll Loop
  useEffect(() => {
    if (isPaused || projects.length === 0) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        // Loop back to start
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll right by card width
        scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, projects.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (projects.length === 0) return null;

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-amber-600 font-extrabold text-xs uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Showcase</span>
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">{title}</h2>
          {subtitle && <p className="text-slate-600 text-xs mt-1 max-w-xl">{subtitle}</p>}
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isPaused ? 'Resume Auto-Scroll' : 'Pause Auto-Scroll'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
            <span className="hidden sm:inline">{isPaused ? 'Play' : 'Pause'}</span>
          </button>

          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all shadow-sm disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all shadow-sm disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 px-1 no-scrollbar select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-[300px] sm:w-[380px] shrink-0 snap-start transition-transform duration-300 hover:-translate-y-1"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {/* Helper Footer Hint */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
        <span className="text-[11px] text-slate-500 font-semibold">
          Showing <strong>{projects.length}</strong> active master projects
        </span>
        <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
          <span>{isPaused ? 'Auto-scroll Paused' : 'Auto-scrolling every 3.5s'}</span>
        </span>
      </div>

    </div>
  );
}
