import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Globe, FileText, CheckCircle2 } from 'lucide-react';

export const BusinessOnboarding: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Lodges',
    description: '',
    office_email: '',
    phone: '',
    whatsapp: '',
    website: '',
    location: '',
    district: 'Gaborone',
    price_range_BWP: '',
    tier: 'standard'
  });

  const districts = ['Gaborone', 'Maun', 'Kasane', 'Francistown', 'Ghanzi', 'Serowe', 'Palapye', 'Lobatse'];
  const categories = ['Lodges', 'Hotels', 'Safari Camps', 'Aviation Tours', 'Car Rentals', 'Restaurants', 'Therapists'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('businesses').insert({
        owner_id: profile?.id,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        contacts: {
          office_email: formData.office_email,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          website: formData.website
        },
        location: formData.location,
        district: formData.district,
        price_range_BWP: formData.price_range_BWP,
        tier: formData.tier,
        status: 'pending'
      });

      if (error) throw error;
      setStep(4); // Success step
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (profile?.role !== 'business') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>This page is only for business users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">List Your Business</h1>
          <p className="text-gray-600">Join Botswana's premier tourism network in 3 easy steps.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          {step === 4 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
              <p className="text-gray-600 mb-8">
                Your business application is now pending admin approval. We will notify you via email once your profile is live.
              </p>
              <button
                onClick={() => navigate('/business/dashboard')}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Business Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">Contact & Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Office Email</label>
                      <input
                        required
                        type="email"
                        value={formData.office_email}
                        onChange={(e) => setFormData({ ...formData, office_email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number</label>
                      <input
                        required
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Website (Optional)</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">District</label>
                      <select
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Physical Address</label>
                      <input
                        required
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">Package Selection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tier: 'standard' })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.tier === 'standard' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100'
                      }`}
                    >
                      <h4 className="font-bold text-lg mb-2">Standard</h4>
                      <p className="text-sm text-gray-600 mb-4">Perfect for small businesses starting out.</p>
                      <ul className="text-xs space-y-2 text-gray-500">
                        <li>• Up to 5 images</li>
                        <li>• 1 video (max 2.5MB)</li>
                        <li>• Basic analytics</li>
                      </ul>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tier: 'premium' })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.tier === 'premium' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100'
                      }`}
                    >
                      <h4 className="font-bold text-lg mb-2">Premium</h4>
                      <p className="text-sm text-gray-600 mb-4">Maximum visibility and rich media support.</p>
                      <ul className="text-xs space-y-2 text-gray-500">
                        <li>• Up to 15 images</li>
                        <li>• 3 videos (max 4MB each)</li>
                        <li>• Advanced analytics & charts</li>
                      </ul>
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Price Range (BWP)</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 500 - 2500"
                      value={formData.price_range_BWP}
                      onChange={(e) => setFormData({ ...formData, price_range_BWP: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-8 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : step === 3 ? 'Submit Application' : 'Next Step'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
