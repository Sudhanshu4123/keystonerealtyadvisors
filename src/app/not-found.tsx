import Link from 'next/link';
import { Building2, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
      <div className="max-w-md w-full text-center bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-amber-400">404</span>
          <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The property listing or page you are looking for may have been removed, sold, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/"
            className="gold-btn py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return To Home</span>
          </Link>
          <Link
            href="/properties"
            className="py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Browse All Properties</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
