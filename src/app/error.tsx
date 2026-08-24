'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Runtime app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
      <div className="max-w-md w-full text-center bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">System Exception</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            An unexpected error occurred while loading this page. Our team has been notified.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="gold-btn py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Return To Safety</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
