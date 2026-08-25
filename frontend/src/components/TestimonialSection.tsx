'use client';

import { useState } from 'react';
import { Testimonial } from '@/lib/types';
import { Quote, MessageSquarePlus, Star } from 'lucide-react';
import ReviewModal from './ReviewModal';

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialSection({ testimonials: initialTestimonials }: TestimonialSectionProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1 text-left">
          <span className="text-amber-600 font-extrabold text-xs uppercase tracking-widest">Endorsements & Ratings</span>
          <h2 className="text-3xl font-black text-slate-900">What Our Clients Say</h2>
          <p className="text-slate-600 text-sm">Authentic feedback from corporate partners and luxury homeowners.</p>
        </div>

        <button
          onClick={() => setIsReviewModalOpen(true)}
          className="gold-btn px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4 text-amber-300" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Testimonial Cards */}
      {initialTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {initialTestimonials.map((t) => (
            <div
              key={t.id}
              className="p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Quote className="w-8 h-8 text-amber-500/40" />
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic font-normal">
                  "{t.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                {t.image ? (
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-900 text-amber-400 font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{t.name}</h4>
                  <span className="text-xs text-amber-600 font-semibold">{t.designation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <p className="text-slate-500 text-sm font-medium">No reviews published yet. Be the first to share your experience!</p>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="gold-btn px-6 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Submit First Review</span>
          </button>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

    </section>
  );
}
