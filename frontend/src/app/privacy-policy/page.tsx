export const metadata = {
  title: 'Privacy Policy | Keystone Real Estate',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 text-sm leading-relaxed bg-white">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-amber-600 mt-1">Last Updated: August 2026</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            Keystone Real Estate Developments ("we", "us", or "our") respects your privacy. We only collect personal information when you explicitly submit an inquiry or contact form.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Full Name</li>
            <li>Phone Number and Email Address</li>
            <li>Property of interest and custom message details</li>
            <li>Preferred visit dates or contact preferences</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. How We Use Your Information</h2>
          <p>
            The information you provide is strictly used to respond to your property inquiries, schedule walkthroughs, and provide project documentation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. Data Protection & Confidentiality</h2>
          <p>
            We do not sell, rent, or distribute your contact information to third-party marketing brokers.
          </p>
        </section>
      </div>
    </div>
  );
}
