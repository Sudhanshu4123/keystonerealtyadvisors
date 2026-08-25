'use client';

import { useState } from 'react';
import { Star, X, CheckCircle2, Loader2, MessageSquarePlus } from 'lucide-react';
import { submitReview } from '@/lib/api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await submitReview({
        name,
        designation: designation || 'Valued Client',
        review: `[${rating} Stars] ${review}`,
      });

      if (res.error) {
        throw new Error(res.error);
      }

      setSuccess(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSuccess(false);
        onClose();
        setName('');
        setDesignation('');
        setReview('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Write a Review</h3>
              <p className="text-xs text-slate-500 font-medium">Share your experience with Keystone Real Estate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-black text-emerald-900">Review Submitted Successfully!</h4>
            <p className="text-xs text-emerald-700 font-medium">
              Thank you for your feedback. Your review will appear live on the website once verified by our team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-slate-900">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Star Rating */}
            <div className="space-y-1 text-center">
              <label className="block text-slate-700 font-bold mb-1">Your Overall Rating</label>
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-300 fill-slate-100'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Designation / Role (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Homeowner at Grand Azure / Property Investor"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Your Review & Feedback *</label>
              <textarea
                rows={4}
                required
                placeholder="Share details of your experience with Keystone Real Estate projects, build quality, or customer advisory service..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-900 leading-relaxed"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="gold-btn px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                <span>Submit Review</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
