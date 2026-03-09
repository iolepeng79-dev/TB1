import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Auth } from './pages/Auth';
import { BusinessOnboarding } from './pages/BusinessOnboarding';
import { BusinessDashboard } from './pages/BusinessDashboard';
import { TouristDashboard } from './pages/TouristDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { WebsiteReviews } from './pages/WebsiteReviews';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const { profile, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!profile) return <Navigate to="/auth" />;
  if (role && profile.role !== role) return <Navigate to="/" />;

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/feedback" element={<WebsiteReviews />} />
              
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute role="business">
                    <BusinessOnboarding />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/business/dashboard" 
                element={
                  <ProtectedRoute role="business">
                    <BusinessDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/tourist/dashboard" 
                element={
                  <ProtectedRoute role="tourist">
                    <TouristDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
