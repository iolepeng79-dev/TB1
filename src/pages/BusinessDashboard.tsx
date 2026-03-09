import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, Eye, Phone, MessageSquare, Star, Heart, 
  TrendingUp, Package, Edit3, PlusCircle, LayoutDashboard
} from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [business, setBusiness] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) fetchBusinessData();
  }, [profile]);

  const fetchBusinessData = async () => {
    setLoading(true);
    const { data: bData } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', profile?.id)
      .single();

    if (bData) {
      setBusiness(bData);
      const { data: aData } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('business_id', bData.id);
      setAnalytics(aData || []);
    }
    setLoading(false);
  };

  const stats = [
    { label: 'Total Views', value: analytics.filter(e => e.event_type === 'view_profile').length, icon: Eye, color: 'text-blue-600' },
    { label: 'Call Clicks', value: analytics.filter(e => e.event_type === 'click_call').length, icon: Phone, color: 'text-emerald-600' },
    { label: 'WA Clicks', value: analytics.filter(e => e.event_type === 'click_whatsapp').length, icon: MessageSquare, color: 'text-green-600' },
    { label: 'Favorites', value: analytics.filter(e => e.event_type === 'favorite').length, icon: Heart, color: 'text-red-600' },
  ];

  const chartData = [
    { name: 'Mon', views: 40, clicks: 24 },
    { name: 'Tue', views: 30, clicks: 13 },
    { name: 'Wed', views: 20, clicks: 98 },
    { name: 'Thu', views: 27, clicks: 39 },
    { name: 'Fri', views: 18, clicks: 48 },
    { name: 'Sat', views: 23, clicks: 38 },
    { name: 'Sun', views: 34, clicks: 43 },
  ];

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Business Found</h2>
          <p className="text-gray-600 mb-8">You haven't listed your business yet. Start your journey today!</p>
          <button
            onClick={() => window.location.href = '/onboarding'}
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            List My Business
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900">{business.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                business.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {business.status}
              </span>
            </div>
            <p className="text-gray-600">Managing your business presence in Botswana.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              <Edit3 className="h-5 w-5" />
              Edit Profile
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
              <TrendingUp className="h-5 w-5" />
              Upgrade Tier
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Performance Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                  <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Interaction Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="clicks" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity / Reviews */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Recent Reviews</h3>
            <button className="text-emerald-600 font-bold text-sm hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 flex gap-6">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">John Doe</span>
                    <div className="flex text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Amazing experience! The safari camp was beyond my expectations. Highly recommended for anyone visiting Botswana.</p>
                  <span className="text-xs text-gray-400 mt-2 block">2 days ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
