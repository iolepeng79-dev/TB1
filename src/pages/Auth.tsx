import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, User as UserIcon, Building2, ShieldCheck } from 'lucide-react';

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'tourist' | 'business'>('tourist');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            email,
            role,
          });

          if (profileError) throw profileError;
        }
        alert('Check your email for confirmation!');
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) throw loginError;
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'signup' ? 'Join the Botswana Tourism Hub' : 'Login to your account'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('tourist')}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    role === 'tourist' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-100 text-gray-400'
                  }`}
                >
                  <UserIcon className="h-6 w-6 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Tourist</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('business')}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    role === 'business' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-100 text-gray-400'
                  }`}
                >
                  <Building2 className="h-6 w-6 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Business</span>
                </button>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate(`/auth?mode=${mode === 'signup' ? 'login' : 'signup'}`)}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              {mode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
