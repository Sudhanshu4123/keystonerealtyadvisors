export const metadata = {
  title: 'Privacy Policy | Keystone Real Estate',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-300 text-sm leading-relaxed">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
        <p className="text-xs text-amber-400 mt-1">Last Updated: August 2026</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            Keystone Real Estate Solutions ("we", "us", or "our") respects your privacy. Because our public platform does not require user registration or public account creation, we only collect personal information when you explicitly submit an inquiry or contact form.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Full Name</li>
            <li>Phone Number and Email Address</li>
            <li>Property of interest and custom message details</li>
            <li>Preferred visit dates or contact preferences</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. How We Use Your Information</h2>
          <p>
            The information you provide is strictly used to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Respond to your property inquiries and consultation requests</li>
            <li>Schedule private property walkthroughs</li>
            <li>Provide transaction guidance and portfolio advisory</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Data Protection & Confidentiality</h2>
          <p>
            We do not sell, rent, or distribute your contact information to third-party marketing brokers. Inquiries are stored securely in our encrypted database accessible only by authorized Keystone administrative personnel.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact us at:
            <br />
            <strong>Email:</strong> contact@keystonerealestate.com
            <br />
            <strong>Phone:</strong> +1 (800) 555-7325
          </p>
        </section>
      </div>
    </div>
  );
}
