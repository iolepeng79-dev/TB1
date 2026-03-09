import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { BusinessCard } from '../components/BusinessCard';
import { Heart, Star, Settings, User as UserIcon, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TouristDashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchTouristData();
  }, [user]);

  const fetchTouristData = async () => {
    setLoading(true);
    const { data: favData } = await supabase
      .from('favorites')
      .select('*, businesses(*)')
      .eq('user_id', user?.id);
    
    const { data: revData } = await supabase
      .from('reviews')
      .select('*, businesses(name)')
      .eq('user_id', user?.id);

    setFavorites(favData || []);
    setReviews(revData || []);
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-12 w-12" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{profile?.email.split('@')[0]}</h2>
              <p className="text-sm text-gray-500 mb-6">Tourist Member</p>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                <Settings className="h-4 w-4" />
                Edit Profile
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">My Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Favorites</span>
                  <span className="font-bold text-emerald-600">{favorites.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Reviews</span>
                  <span className="font-bold text-emerald-600">{reviews.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Favorites */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Heart className="h-6 w-6 text-red-500 fill-current" />
                <h2 className="text-2xl font-bold text-gray-900">My Favorites</h2>
              </div>
              
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favorites.map((fav) => (
                    <BusinessCard key={fav.id} business={fav.businesses} isFavorite={true} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                  <p className="text-gray-500">You haven't favorited any businesses yet.</p>
                  <Link to="/explore" className="text-emerald-600 font-bold mt-4 inline-block hover:underline">Start Exploring</Link>
                </div>
              )}
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-6 w-6 text-amber-500 fill-current" />
                <h2 className="text-2xl font-bold text-gray-900">My Reviews</h2>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900">{review.businesses.name}</h4>
                        <div className="flex text-amber-500 mt-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                    <p className="text-gray-500">You haven't written any reviews yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
