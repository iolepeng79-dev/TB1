import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, MessageSquare, Heart } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

interface BusinessCardProps {
  business: any;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, isFavorite, onToggleFavorite }) => {
  const { trackEvent } = useAnalytics();

  const handleInteraction = (type: string) => {
    trackEvent(type, business.id);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={business.attachments?.images?.[0] || `https://picsum.photos/seed/${business.id}/800/600`}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full">
            {business.category}
          </span>
        </div>
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{business.name}</h3>
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-bold">4.8</span>
          </div>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{business.district}, Botswana</span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-6">
          {business.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex space-x-2">
            <a
              href={`tel:${business.contacts?.phone}`}
              onClick={() => handleInteraction('click_call')}
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a
              href={`https://wa.me/${business.contacts?.whatsapp}`}
              onClick={() => handleInteraction('click_whatsapp')}
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
            </a>
          </div>
          <Link
            to={`/business/${business.id}`}
            className="text-emerald-600 font-semibold text-sm hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
