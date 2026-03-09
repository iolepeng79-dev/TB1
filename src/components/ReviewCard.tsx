import React from 'react';
import { Star, User } from 'lucide-react';

interface ReviewCardProps {
  review: {
    user_name?: string;
    rating: number;
    comment: string;
    created_at: string;
  };
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-gray-400" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{review.user_name || 'Anonymous User'}</h4>
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}
              />
            ))}
          </div>
        </div>
        <span className="ml-auto text-xs text-gray-400">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
};
