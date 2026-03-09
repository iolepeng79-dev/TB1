import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-6">Botswana Tourism Hub</h3>
            <p className="text-gray-400 max-w-md mb-8">
              Discover the untamed beauty of Botswana. From the Okavango Delta to the Kalahari Desert, 
              we connect you with the best tourism services in the heart of Africa.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-6 w-6" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/explore" className="hover:text-white transition-colors">Explore Services</Link></li>
              <li><Link to="/onboarding" className="hover:text-white transition-colors">List Your Business</Link></li>
              <li><Link to="/feedback" className="hover:text-white transition-colors">Website Feedback</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-500" />
                <span>info@botswanatourism.co.bw</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-500" />
                <span>+267 391 3111</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Botswana Tourism Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
