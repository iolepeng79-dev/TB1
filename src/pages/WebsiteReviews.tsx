import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const WebsiteReviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('website_reviews').insert({
        user_name: formData.name,
        user_email: formData.email,
        rating: formData.rating,
        comment: formData.comment
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Website Feedback</h1>
          <p className="text-gray-600">Help us improve the Botswana Tourism Hub experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-16 w-16 text-emerald-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
                <p className="text-gray-600">Your feedback has been submitted successfully.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-emerald-600 font-bold hover:underline"
                >
                  Submit another review
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`p-2 rounded-lg transition-colors ${
                          formData.rating >= star ? 'text-amber-500' : 'text-gray-200'
                        }`}
                      >
                        <Star className={`h-8 w-8 ${formData.rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Feedback</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Tell us what you think..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                  {loading ? 'Sending...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-lg shadow-emerald-200">
              <MessageSquare className="h-10 w-10 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Why your feedback matters</h3>
              <p className="text-emerald-100">
                We are committed to building the best platform for Botswana's tourism industry. 
                Your insights help us prioritize features and improve the experience for everyone.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Community Feedback</h3>
              <div className="space-y-6">
                {[
                  { name: 'Thabo M.', comment: 'Great platform! Very easy to find lodges in Maun.', rating: 5 },
                  { name: 'Sarah K.', comment: 'The map integration is super helpful for navigation.', rating: 4 }
                ].map((r, i) => (
                  <div key={i} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">{r.name}</span>
                      <div className="flex text-amber-500">
                        {[...Array(r.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
