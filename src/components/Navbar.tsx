import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, MapPin } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold tracking-tight text-gray-900">Botswana Tourism Hub</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-emerald-600 transition-colors">Home</Link>
            <Link to="/explore" className="text-gray-600 hover:text-emerald-600 transition-colors">Explore</Link>
            
            {profile ? (
              <>
                {profile.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-emerald-600 transition-colors">Admin</Link>
                )}
                {profile.role === 'business' && (
                  <Link to="/business/dashboard" className="text-gray-600 hover:text-emerald-600 transition-colors">Dashboard</Link>
                )}
                {profile.role === 'tourist' && (
                  <Link to="/tourist/dashboard" className="text-gray-600 hover:text-emerald-600 transition-colors">My Profile</Link>
                )}
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{profile.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth?mode=login"
                  className="text-gray-600 hover:text-emerald-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Home</Link>
            <Link to="/explore" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Explore</Link>
            {profile && (
              <>
                {profile.role === 'admin' && <Link to="/admin" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Admin</Link>}
                {profile.role === 'business' && <Link to="/business/dashboard" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Dashboard</Link>}
                {profile.role === 'tourist' && <Link to="/tourist/dashboard" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">My Profile</Link>}
                <button onClick={handleSignOut} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md">Logout</button>
              </>
            )}
            {!profile && (
              <>
                <Link to="/auth?mode=login" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Login</Link>
                <Link to="/auth?mode=signup" className="block px-3 py-2 text-emerald-600 font-medium hover:bg-emerald-50 rounded-md">Join Now</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
