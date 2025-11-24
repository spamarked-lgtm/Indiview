import React from 'react';
import { BiasDistribution } from '../types';

interface BiasStripProps {
  distribution: BiasDistribution;
  className?: string;
  variant?: 'thin' | 'thick' | 'blindspot';
  showLabels?: boolean;
}

export const BiasStrip: React.FC<BiasStripProps> = ({ distribution, className = '', variant = 'thick', showLabels = false }) => {
  // Safe destructuring with defaults in case data is malformed
  const { left = 0, center = 0, right = 0 } = distribution || {};

  // Colors based on Ground News screenshot style
  // Left: Blue, Center: Gray/White, Right: Red/Orange
  // Using Indian context colors defined in requirements but styled like Ground News
  const leftColor = 'bg-blue-600';
  const centerColor = 'bg-gray-300';
  const rightColor = 'bg-orange-600'; // Indian Right

  if (variant === 'blindspot') {
      return (
        <div className="w-full">
             <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1 uppercase">
                {left > 20 && <span className="text-blue-700">Left {left}%</span>}
                {center > 20 && <span className="text-gray-600">Center {center}%</span>}
                {right > 20 && <span className="text-orange-700">Right {right}%</span>}
                {(right < 10 || left < 10) && <span className="text-red-600 bg-red-50 px-1 rounded">⚠️ Low Coverage</span>}
            </div>
            <div className="flex h-4 w-full rounded overflow-hidden">
                {left > 0 && <div style={{ width: `${left}%` }} className={`${leftColor} flex items-center justify-center text-[9px] text-white font-bold`}>{left > 15 && `${left}%`}</div>}
                {center > 0 && <div style={{ width: `${center}%` }} className={`${centerColor} flex items-center justify-center text-[9px] text-gray-700 font-bold`}>C {center}%</div>}
                {right > 0 && <div style={{ width: `${right}%` }} className={`${rightColor} flex items-center justify-center text-[9px] text-white font-bold`}>{right > 15 && `${right}%`}</div>}
            </div>
        </div>
      )
  }

  if (variant === 'thin') {
      return (
        <div className={`flex w-full h-1.5 rounded-sm overflow-hidden ${className}`}>
             <div style={{ width: `${left}%` }} className={leftColor} />
             <div style={{ width: `${center}%` }} className={centerColor} />
             <div style={{ width: `${right}%` }} className={rightColor} />
        </div>
      );
  }

  // Default 'thick'
  return (
    <div className={`w-full ${className}`}>
      <div className="flex h-5 w-full rounded-sm overflow-hidden text-[10px] font-bold text-white leading-none">
        <div style={{ width: `${left}%` }} className={`${leftColor} flex items-center pl-1`}>
            {left > 15 && `Left ${left}%`}
        </div>
        <div style={{ width: `${center}%` }} className={`${centerColor} flex items-center justify-center text-gray-600`}>
            {center > 10 && `C ${center}%`}
        </div>
        <div style={{ width: `${right}%` }} className={`${rightColor} flex items-center justify-end pr-1`}>
            {right > 15 && `Right ${right}%`}
        </div>
      </div>
    </div>
  );
};
