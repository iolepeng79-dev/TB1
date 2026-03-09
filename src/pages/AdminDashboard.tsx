import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, XCircle, Clock, ShieldCheck, 
  BarChart3, PieChart as PieIcon, Users, Building2,
  Globe, MessageSquare
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [pendingBusinesses, setPendingBusinesses] = useState<any[]>([]);
  const [pendingUpgrades, setPendingUpgrades] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') fetchAdminData();
  }, [profile]);

  const fetchAdminData = async () => {
    setLoading(true);
    const { data: bData } = await supabase
      .from('businesses')
      .select('*, profiles(email)')
      .eq('status', 'pending');
    
    const { data: uData } = await supabase
      .from('business_tier_requests')
      .select('*, businesses(name)')
      .eq('status', 'pending');

    setPendingBusinesses(bData || []);
    setPendingUpgrades(uData || []);
    
    // Mock stats for visualization
    setStats({
      totalBusinesses: 124,
      totalTourists: 1450,
      totalInteractions: 8900,
      categoryData: [
        { name: 'Lodges', value: 45 },
        { name: 'Safari', value: 30 },
        { name: 'Tours', value: 20 },
        { name: 'Other', value: 29 },
      ]
    });
    setLoading(false);
  };

  const handleAction = async (table: string, id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from(table)
      .update({ status })
      .eq('id', id);
    
    if (error) alert(error.message);
    else fetchAdminData();
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  if (profile?.role !== 'admin') return <div className="p-8 text-center">Access Denied</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Admin Command Center</h1>
          <p className="text-gray-600">Overseeing Botswana's tourism ecosystem.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Businesses', value: stats?.totalBusinesses, icon: Building2, color: 'text-blue-600' },
            { label: 'Total Tourists', value: stats?.totalTourists, icon: Users, color: 'text-emerald-600' },
            { label: 'Interactions', value: stats?.totalInteractions, icon: BarChart3, color: 'text-amber-600' },
            { label: 'Pending Approvals', value: pendingBusinesses.length + pendingUpgrades.length, icon: Clock, color: 'text-red-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className={`p-3 rounded-xl bg-gray-50 w-fit mb-4 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Pending Approvals */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">New Business Requests</h3>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">{pendingBusinesses.length}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {pendingBusinesses.map((b) => (
                  <div key={b.id} className="p-8 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">{b.name}</h4>
                      <p className="text-sm text-gray-500">{b.category} • {b.district}</p>
                      <p className="text-xs text-gray-400 mt-1">Owner: {b.profiles?.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAction('businesses', b.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={() => handleAction('businesses', b.id, 'approved')}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <CheckCircle2 className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ))}
                {pendingBusinesses.length === 0 && (
                  <div className="p-12 text-center text-gray-400">No pending business requests.</div>
                )}
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Tier Upgrade Requests</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{pendingUpgrades.length}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {pendingUpgrades.map((u) => (
                  <div key={u.id} className="p-8 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">{u.businesses?.name}</h4>
                      <p className="text-sm text-gray-500">Requested: <span className="font-bold uppercase text-blue-600">{u.requested_tier}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAction('business_tier_requests', u.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={() => handleAction('business_tier_requests', u.id, 'approved')}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <CheckCircle2 className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ))}
                {pendingUpgrades.length === 0 && (
                  <div className="p-12 text-center text-gray-400">No pending upgrade requests.</div>
                )}
              </div>
            </section>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Business Categories</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.categoryData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats?.categoryData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-2">
                {stats?.categoryData.map((item: any, idx: number) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-lg shadow-emerald-200">
              <ShieldCheck className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-2">System Audit</h3>
              <p className="text-emerald-100 text-sm mb-6">All actions are logged for security and transparency.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
                View Audit Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
