'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, Loader2, KeyRound } from 'lucide-react';
import { adminLogin } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@keystone.com');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [seedMsg, setSeedMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { ok, data } = await adminLogin(email, password);
      if (!ok) {
        throw new Error(data?.error || 'Failed to authenticate as admin');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSeed = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/seed', { method: 'POST' });
      const data = await res.json();
      setSeedMsg(data.message || 'Database seeded with default properties and admin account!');
    } catch (err) {
      setSeedMsg('Seed executed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-sm inline-block mx-auto">
            <h2 className="text-xl font-black text-blue-900 tracking-wider">KEYSTONE REALTY</h2>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Admin Control Portal</h1>
          <p className="text-xs text-slate-500 font-medium">
            Secure authentication for Keystone business administration.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {seedMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold text-center">
            {seedMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-slate-900">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-900 font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-900 font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-btn py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Log In to Admin Panel</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Protected Single Admin Panel</span>
          <button
            type="button"
            onClick={handleTriggerSeed}
            className="text-blue-900 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Reset Demo Pass</span>
          </button>
        </div>

      </div>
    </div>
  );
}
