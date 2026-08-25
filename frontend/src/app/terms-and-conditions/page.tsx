export const metadata = {
  title: 'Terms & Conditions | Keystone Real Estate',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 text-sm leading-relaxed bg-white">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900">Terms & Conditions</h1>
        <p className="text-xs text-amber-600 mt-1">Last Updated: August 2026</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Keystone Real Estate website, you agree to comply with and be bound by these Terms and Conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Property Listings & Accuracy</h2>
          <p>
            All property information, pricing, floor plans, and specifications published on this website are verified by our team.
          </p>
        </section>
      </div>
    </div>
  );
}
