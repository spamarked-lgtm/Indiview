import React from 'react';
import { BiasDistribution } from '../types';
import { BIAS_COLORS } from '../constants';

interface BiasStripProps {
  distribution: BiasDistribution;
  className?: string;
  showLabels?: boolean;
}

export const BiasStrip: React.FC<BiasStripProps> = ({ distribution, className = '', showLabels = false }) => {
  const { left, center, right } = distribution;

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-500 mb-1 font-medium">
          <span className="text-blue-700">Left {left}%</span>
          <span className="text-gray-600">Center {center}%</span>
          <span className="text-orange-700">Right {right}%</span>
        </div>
      )}
      <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-200">
        <div style={{ width: `${left}%` }} className="bg-blue-600 h-full" title={`Left: ${left}%`} />
        <div style={{ width: `${center}%` }} className="bg-gray-400 h-full" title={`Center: ${center}%`} />
        <div style={{ width: `${right}%` }} className="bg-orange-600 h-full" title={`Right: ${right}%`} />
      </div>
    </div>
  );
};