export const metadata = {
  title: 'Cookie Policy | Keystone Real Estate',
};

export default function CookiePolicyPage() {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-300 text-sm leading-relaxed">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-white">Cookie Policy</h1>
        <p className="text-xs text-amber-400 mt-1">Last Updated: August 2026</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when visiting websites. They help provide a seamless user experience and enable essential functionality.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Cookies We Use</h2>
          <p>
            Our website uses strictly necessary session cookies for administrative authentication (`admin_token`). We do not track public visitors or use invasive cross-site advertising cookies.
          </p>
        </section>
      </div>
    </div>
  );
}
