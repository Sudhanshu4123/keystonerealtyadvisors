export const metadata = {
  title: 'Cookie Policy | Keystone Real Estate',
};

export default function CookiePolicyPage() {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 text-sm leading-relaxed bg-white">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900">Cookie Policy</h1>
        <p className="text-xs text-amber-600 mt-1">Last Updated: August 2026</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when visiting websites. They help provide a seamless user experience and enable essential functionality.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Cookies We Use</h2>
          <p>
            Our website uses strictly necessary session cookies. We do not track public visitors or use invasive cross-site advertising cookies.
          </p>
        </section>
      </div>
    </div>
  );
}
