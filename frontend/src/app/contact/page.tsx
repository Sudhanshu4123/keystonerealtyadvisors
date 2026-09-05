'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, Loader2 } from 'lucide-react';
import GoogleMapPlaceholder from '@/components/GoogleMapPlaceholder';
import { submitContactMessage, fetchSiteSettings } from '@/lib/api';

export default function ContactPage() {
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    website_url_honeypot: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchSiteSettings().then((res) => setSettings(res));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const data = await submitContactMessage({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
      });

      if (data.error) throw new Error(data.error);

      setSuccessMsg(data.message || 'Thank you for reaching out! Your message has been received.');
      setFormData({ name: '', phone: '', email: '', message: '', website_url_honeypot: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 bg-white">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md inline-block mx-auto mb-1">
          <img
            src="/logo.png"
            alt="Keystone Realty Advisors Logo"
            className="h-16 w-auto object-contain"
          />
        </div>
        <span className="text-amber-600 font-bold text-xs uppercase tracking-widest block">Connect With Us</span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900">{settings?.companyName || 'Shri Shyam Associate'}</h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Whether you are looking to acquire a luxury builder floor, residential apartment, corporate space, or inquire about project walkthroughs in Dwarka, our advisory team is at your service 24/7.
        </p>
      </div>

      {/* Main Grid: Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Contact Information & Channels */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
              Headquarters & Info
            </h2>

            <div className="space-y-5 text-sm text-slate-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Office Address</span>
                  <span className="font-bold text-white">{settings?.address || 'Shop No. 247, 2nd Floor, Vardhaman City Mall, Vaishali, Sector 7, Dwarka, Delhi - 110077'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Business Phone</span>
                  <a href={`tel:${settings?.phone || '+919911956274'}`} className="font-bold text-white hover:text-amber-400 transition-colors">
                    {settings?.phone || '+91 9911956274'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">WhatsApp Line</span>
                  <a href={`https://wa.me/${(settings?.whatsapp || '919911956274').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-emerald-400 transition-colors">
                    {settings?.whatsapp || '+91 9911956274'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Email Address</span>
                  <a href={`mailto:${settings?.email || 'shrishyamproperties001@gmail.com'}`} className="font-bold text-white hover:text-amber-400 transition-colors">
                    {settings?.email || 'shrishyamproperties001@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Working Hours</span>
                  <span className="font-bold text-white">{settings?.workingHours || 'Monday - Sunday: Open 24 Hours (24/7)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Google Map */}
          <GoogleMapPlaceholder
            location="Shop No. 247, 2nd Floor, Vardhaman City Mall"
            address={settings?.address || 'Shop No. 247, 2nd Floor, Vardhaman City Mall, Vaishali, Sector 7, Dwarka, Delhi - 110077'}
            city="Dwarka, Delhi"
            googleMapsUrl={settings?.googleMapsUrl}
          />
        </div>

        {/* Contact Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white">Send Us A Message</h2>
            <p className="text-xs text-slate-400 mt-1">
              Your inquiry will be logged directly into our Admin management portal.
            </p>
          </div>

          {successMsg ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Sent</h3>
              <p className="text-slate-300 text-sm">{successMsg}</p>
              <button
                onClick={() => setSuccessMsg('')}
                className="gold-btn px-6 py-2.5 rounded-xl font-semibold text-xs cursor-pointer mt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website_url_honeypot"
                  value={formData.website_url_honeypot}
                  onChange={(e) => setFormData({ ...formData, website_url_honeypot: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Phone Number <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Message Details <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Please describe your requirements, property interest, or investment timeline..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gold-btn py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
