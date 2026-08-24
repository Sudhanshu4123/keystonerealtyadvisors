import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  Target,
  Eye,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: 'About Us | Keystone Real Estate',
  description: 'Learn about Keystone Real Estate - premier property advisory, mission, vision, leadership team, and track record.',
};

export default function AboutPage() {
  const team = [
    {
      name: 'Jonathan Sterling',
      role: 'Founder & CEO',
      bio: '22+ years in institutional real estate, managing over $3.2B in residential & commercial acquisitions.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Claire Kensington',
      role: 'Head of Luxury Residential',
      bio: 'Specialist in prime Manhattan penthouses and Coastal California estates.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'David Vance, CFA',
      role: 'Director of Commercial Assets',
      bio: 'Expert in retail, office towers, and industrial logistics park site developments.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md inline-block mx-auto mb-2">
          <img
            src="/logo.png"
            alt="Keystone Realty Advisors Logo"
            className="h-20 w-auto object-contain"
          />
        </div>
        <span className="text-amber-600 font-bold text-xs uppercase tracking-widest block">Our Legacy</span>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight">
          Redefining Luxury Real Estate Excellence
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Founded in 2011, Keystone Real Estate Developments has evolved into a premier master-planned developer trusted by high-net-worth investors, family offices, and corporate enterprises.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            To empower our clients with unparalleled market intelligence, rigorous property verification, and seamless transaction execution — creating enduring value across every real estate asset class.
          </p>
        </div>

        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Our Vision</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            To set the benchmark for luxury residential living and high-performing commercial investments globally through innovation, integrity, and direct client partnerships.
          </p>
        </div>

      </div>

      {/* Company Statistics Counter Banner */}
      <div className="navy-gradient-bg border border-slate-800 rounded-3xl p-10 shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-4xl font-black text-amber-400">$4.8B+</span>
            <p className="text-xs uppercase tracking-widest text-slate-300 font-bold">Properties Transacted</p>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-amber-400">12,500+</span>
            <p className="text-xs uppercase tracking-widest text-slate-300 font-bold">Satisfied Clients</p>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-amber-400">15+</span>
            <p className="text-xs uppercase tracking-widest text-slate-300 font-bold">Years of Leadership</p>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-amber-400">99.4%</span>
            <p className="text-xs uppercase tracking-widest text-slate-300 font-bold">Closing Accuracy</p>
          </div>
        </div>
      </div>

      {/* Professional Leadership Team */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-amber-500 font-bold text-xs uppercase tracking-widest">Leadership</span>
          <h2 className="text-3xl font-extrabold text-white">Meet Our Executive Advisory Team</h2>
          <p className="text-slate-400 text-sm">Decades of combined expertise in real estate brokerage, financial modeling, and asset management.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-5 group"
            >
              <div className="h-64 rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {member.name}
                </h3>
                <span className="text-xs font-semibold text-amber-400 block">{member.role}</span>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-slate-900 border border-slate-800 rounded-3xl p-10 space-y-6">
        <h2 className="text-3xl font-extrabold text-white">Experience The Keystone Difference</h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Contact our team today for a confidential consultation regarding your real estate portfolio.
        </p>
        <Link
          href="/contact"
          className="gold-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl"
        >
          <span>Get In Touch</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
