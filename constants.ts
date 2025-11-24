import { Bias, Factuality, Source } from './types';

// Color mappings for Indian Political Context
// Left: Blue/Teal (Standard Global Left)
// Center: Gray
// Right: Saffron/Orange (Standard Indian Right)
export const BIAS_COLORS = {
  [Bias.FarLeft]: 'bg-blue-800',
  [Bias.Left]: 'bg-blue-600',
  [Bias.CenterLeft]: 'bg-blue-400',
  [Bias.Center]: 'bg-gray-400',
  [Bias.CenterRight]: 'bg-orange-400',
  [Bias.Right]: 'bg-orange-600',
  [Bias.FarRight]: 'bg-orange-800',
};

export const TEXT_COLORS = {
  left: 'text-blue-700',
  center: 'text-gray-600',
  right: 'text-orange-700',
};

// Mock Database of Sources with ratings
export const SOURCES_DB: Record<string, Source> = {
  'the-hindu': { id: 'the-hindu', name: 'The Hindu', bias: Bias.CenterLeft, factuality: Factuality.High, region: 'National' },
  'ndtv': { id: 'ndtv', name: 'NDTV', bias: Bias.CenterLeft, factuality: Factuality.High, region: 'National' },
  'the-wire': { id: 'the-wire', name: 'The Wire', bias: Bias.Left, factuality: Factuality.Mixed, region: 'National' },
  'indian-express': { id: 'indian-express', name: 'Indian Express', bias: Bias.Center, factuality: Factuality.High, region: 'National' },
  'times-of-india': { id: 'times-of-india', name: 'Times of India', bias: Bias.CenterRight, factuality: Factuality.Mixed, region: 'National' },
  'republic-world': { id: 'republic-world', name: 'Republic World', bias: Bias.Right, factuality: Factuality.Low, region: 'National' },
  'opindia': { id: 'opindia', name: 'OpIndia', bias: Bias.FarRight, factuality: Factuality.Low, region: 'National' },
  'scroll': { id: 'scroll', name: 'Scroll.in', bias: Bias.Left, factuality: Factuality.High, region: 'National' },
  'zee-news': { id: 'zee-news', name: 'Zee News', bias: Bias.Right, factuality: Factuality.Mixed, region: 'National' },
  'hindustan-times': { id: 'hindustan-times', name: 'Hindustan Times', bias: Bias.Center, factuality: Factuality.High, region: 'National' },
  'news18': { id: 'news18', name: 'News18', bias: Bias.CenterRight, factuality: Factuality.Mixed, region: 'National' },
};
