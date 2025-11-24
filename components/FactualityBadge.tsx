import React from 'react';
import { Factuality } from '../types';

export const FactualityBadge: React.FC<{ rating: Factuality }> = ({ rating }) => {
  const getColors = (r: Factuality) => {
    switch (r) {
      case Factuality.VeryHigh: return 'bg-green-100 text-green-800 border-green-200';
      case Factuality.High: return 'bg-green-50 text-green-700 border-green-200';
      case Factuality.Mixed: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case Factuality.Low: return 'bg-orange-50 text-orange-700 border-orange-200';
      case Factuality.VeryLow: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold ${getColors(rating)}`}>
      {rating} Factuality
    </span>
  );
};