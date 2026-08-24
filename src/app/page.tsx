import Link from 'next/link';
import ProjectSearchBox from '@/components/ProjectSearchBox';
import ProjectCard from '@/components/ProjectCard';
import ProjectsCarousel from '@/components/ProjectsCarousel';
import { prisma } from '@/lib/prisma';
import { PROJECT_TYPES } from '@/lib/types';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  Search,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  MapPin,
  TrendingUp,
  KeyRound,
  FileCheck,
  Star,
  Quote,
  MessageCircle,
  Layers,
  Check,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export const revalidate = 0; // Fresh server load

async function getHomeData() {
  try {
    const [featured, latest, testimonials, settings] = await Promise.all([
      prisma.project.findMany({
        where: { published: true, featured: true },
        include: { images: true, amenities: true },
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.findMany({
        where: { published: true },
        include: { images: true, amenities: true },
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.testimonial.findMany({
        where: { published: true },
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.settings.findUnique({
        where: { id: 'site_settings' },
      }),
    ]);

    return { featured, latest, testimonials, settings };
  } catch (err) {
    console.error('Home page data error:', err);
    return { featured: [], latest: [], testimonials: [], settings: null };
  }
}

export default async function HomePage() {
  const { featured, latest, testimonials, settings } = await getHomeData();

  return (
    <div className="space-y-24 pb-16 bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950 text-white">
        {/* Background Image with Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=90"
            alt="Luxury Real Estate Project Hero"
            className="w-full h-full object-cover filter brightness-[0.35] contrast-110 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-amber-400 text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Master-Planned Real Estate Developer</span>
          </div>

          {/* Headline & Subheading */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Discover Exceptional <span className="gold-gradient-text">Real Estate Projects</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Explore thoughtfully designed residential and commercial projects built for modern living and lasting value.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/projects"
              className="gold-btn px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-xl flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore Projects</span>
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all"
            >
              Enquire Now
            </Link>
          </div>

          {/* Project Search Box */}
          <div className="max-w-5xl mx-auto text-left pt-4">
            <ProjectSearchBox />
          </div>

        </div>
      </section>

      {/* 2. AUTO-SCROLLING MASTER PROJECTS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectsCarousel
          projects={latest as any}
          title="Master Real Estate Projects Showcase"
          subtitle="Explore all our ongoing, upcoming, and completed master-planned residential townships, luxury villas, and corporate towers."
        />
      </section>

      {/* 3. EXPLORE OUR PROJECTS (PROJECT CATEGORIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-amber-600 font-extrabold text-xs uppercase tracking-widest">Master Classifications</span>
          <h2 className="text-3xl font-black text-slate-900">Explore Project Categories</h2>
          <p className="text-slate-600 text-sm">Discover our master-planned portfolios engineered for modern living and commercial growth.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {PROJECT_TYPES.map((type) => (
            <Link
              key={type}
              href={`/projects?type=${encodeURIComponent(type)}`}
              className="group p-6 bg-slate-50 hover:bg-blue-900 border border-slate-200 hover:border-blue-900 rounded-3xl text-center space-y-3 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-white text-blue-900 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center mx-auto transition-colors shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-white transition-colors">
                {type} Projects
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-600 font-extrabold text-xs uppercase tracking-widest">Why Partner With Us</span>
            <h2 className="text-3xl font-black text-slate-900">The Keystone Advantage</h2>
            <p className="text-slate-600 text-sm">Built on a foundation of structural excellence, transparent delivery, and master craftsmanship.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Trusted Developer</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                Over 15+ years of delivering iconic residential townships and commercial landmarks ahead of schedule.
              </p>
            </div>

            <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Premium Locations</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                Every project is situated in high-yield metropolitan corridors with superior highway and transit connectivity.
              </p>
            </div>

            <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Quality Construction</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                Engineered with seismic-resistant structural frames, Italian marble, and sustainable green building standards.
              </p>
            </div>

            <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Modern Design</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                Contemporary glass curtain walls, double-height grand lobbies, and resort-style infinity amenities.
              </p>
            </div>

            <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Transparent Process</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                Clear milestone updates, verified legal title deeds, and comprehensive floor plan blueprints.
              </p>
            </div>

            <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Direct Customer Support</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-normal">
                Dedicated project advisory team available via direct phone, WhatsApp, or private walkthrough booking.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. COMPANY STATISTICS COUNTER */}
      <section className="bg-slate-900 text-white py-16 border-y border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <span className="text-4xl sm:text-5xl font-black text-amber-400">
                {settings?.projectsDelivered || '48+'}
              </span>
              <p className="text-xs uppercase tracking-widest text-slate-300 font-extrabold mt-1">Projects Delivered</p>
            </div>

            <div className="space-y-1">
              <span className="text-4xl sm:text-5xl font-black text-amber-400">
                {settings?.yearsExperience || '15+'}
              </span>
              <p className="text-xs uppercase tracking-widest text-slate-300 font-extrabold mt-1">Years Experience</p>
            </div>

            <div className="space-y-1">
              <span className="text-4xl sm:text-5xl font-black text-amber-400">
                {settings?.happyCustomers || '12,500+'}
              </span>
              <p className="text-xs uppercase tracking-widest text-slate-300 font-extrabold mt-1">Happy Customers</p>
            </div>

            <div className="space-y-1">
              <span className="text-4xl sm:text-5xl font-black text-amber-400">
                {settings?.ongoingProjects || '12'}
              </span>
              <p className="text-xs uppercase tracking-widest text-slate-300 font-extrabold mt-1">Ongoing Projects</p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CUSTOMER TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-600 font-extrabold text-xs uppercase tracking-widest">Endorsements</span>
            <h2 className="text-3xl font-black text-slate-900">What Our Clients Say</h2>
            <p className="text-slate-600 text-sm">Authentic feedback from corporate partners and luxury homeowners.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <Quote className="w-8 h-8 text-amber-500/40" />
                  <p className="text-slate-700 text-sm leading-relaxed italic font-normal">
                    "{t.review}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  {t.image && (
                    <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{t.name}</h4>
                    <span className="text-xs text-amber-600 font-semibold">{t.designation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center space-y-6 bg-slate-900 text-white border border-slate-800 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto leading-tight">
            Find Your Next Great Real Estate Investment
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Connect with our project developers for site plans, pricing schedules, and private walkthroughs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="gold-btn px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-xl flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquire Now</span>
            </Link>
            <a
              href="tel:+919217668175"
              className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Call +91 9217668175</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
