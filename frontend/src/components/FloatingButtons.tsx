'use client';

import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingButtons() {
  const whatsappNumber = '919217668175';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Keystone Real Estate Developments, I would like to inquire about your real estate projects.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
      {/* Phone Call */}
      <a
        href="tel:+919217668175"
        className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 border border-slate-700 flex items-center justify-center shadow-lg hover:bg-slate-800 hover:scale-110 transition-all duration-300 group cursor-pointer"
        title="Call Developers Directly (+91 9217668175)"
      >
        <Phone className="w-5 h-5 group-hover:animate-bounce" />
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-110 transition-all duration-300 cursor-pointer"
        title="WhatsApp Project Inquiries (+91 9217668175)"
      >
        <MessageCircle className="w-7 h-7 fill-white text-emerald-600" />
      </a>
    </div>
  );
}
