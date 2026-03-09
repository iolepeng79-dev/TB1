import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { BusinessCard } from '../components/BusinessCard';
import { Search, Filter, MapPin } from 'lucide-react';

export const Explore: React.FC = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [district, setDistrict] = useState('All');

  const categories = ['All', 'Lodges', 'Hotels', 'Safari Camps', 'Aviation Tours', 'Car Rentals', 'Restaurants', 'Therapists'];
  const districts = ['All', 'Gaborone', 'Maun', 'Kasane', 'Francistown', 'Ghanzi', 'Serowe'];

  useEffect(() => {
    fetchBusinesses();
  }, [category, district]);

  const fetchBusinesses = async () => {
    setLoading(true);
    let query = supabase
      .from('businesses')
      .select('*')
      .eq('status', 'approved');

    if (category !== 'All') query = query.eq('category', category);
    if (district !== 'All') query = query.eq('district', district);

    const { data, error } = await query;
    if (error) console.error(error);
    else setBusinesses(data || []);
    setLoading(false);
  };

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Explore Botswana</h1>
          <p className="text-gray-600">Find the best services for your next adventure.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
              >
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredBusinesses.map(business => (
              <BusinessCard key={business.id} business={business} />
            ))}
            {filteredBusinesses.length === 0 && (
              <div className="col-span-full text-center py-24">
                <p className="text-gray-500 text-lg">No businesses found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
