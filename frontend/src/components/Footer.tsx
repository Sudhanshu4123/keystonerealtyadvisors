'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, ShieldCheck, Award } from 'lucide-react';
import { PROJECT_TYPES } from '@/lib/types';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group bg-white/95 p-3 rounded-2xl border border-slate-700 shadow-md">
              <img
                src="/logo.png"
                alt="Keystone Realty Advisors Logo"
                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Shri Shyam Associate is a premier Home Builder and Real Estate Development firm in Dwarka, Delhi. We design, construct, and deliver signature luxury builder floors, modern residential apartments, and prime commercial spaces.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-amber-400 font-semibold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>15+ Years Excellence</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Home Builder</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-xs font-extrabold uppercase tracking-widest">Navigation</h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-amber-400 transition-colors">
                  All Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-4">
            <h3 className="text-white text-xs font-extrabold uppercase tracking-widest">Project Categories</h3>
            <ul className="space-y-2 text-sm">
              {PROJECT_TYPES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/projects?type=${encodeURIComponent(cat)}`}
                    className="text-slate-400 hover:text-amber-400 transition-colors text-xs flex items-center justify-between font-medium"
                  >
                    <span>{cat} Projects</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-4">
            <h3 className="text-white text-xs font-extrabold uppercase tracking-widest">Headquarters</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Shop No. 247, 2nd Floor, Vardhaman City Mall, Vaishali, Sector 7, Dwarka, Delhi - 110077</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919911956274" className="hover:text-white transition-colors font-bold">
                  +91 9911956274
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:shrishyamproperties001@gmail.com" className="hover:text-white transition-colors">
                  shrishyamproperties001@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Monday - Sunday: Open 24 Hours (24/7)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} Shri Shyam Associate. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-amber-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/cookie-policy" className="hover:text-amber-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
