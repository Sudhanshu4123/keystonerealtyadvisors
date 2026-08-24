export const metadata = {
  title: 'Terms & Conditions | Keystone Real Estate',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-300 text-sm leading-relaxed">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-white">Terms & Conditions</h1>
        <p className="text-xs text-amber-400 mt-1">Last Updated: August 2026</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Keystone Real Estate website, you agree to comply with and be bound by these Terms and Conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Property Listings & Accuracy</h2>
          <p>
            All property information, pricing, floor plans, and specifications published on this website are verified by our team. However, listings remain subject to prior sale, lease, or market price adjustments without notice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Public Use & Submissions</h2>
          <p>
            Visitors may browse property listings and submit inquiry forms without registering an account. Any false or spam submissions are strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the State of New York.
          </p>
        </section>
      </div>
    </div>
  );
}
