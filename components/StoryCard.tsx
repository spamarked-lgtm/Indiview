import React from 'react';
import { Story } from '../types';
import { BiasStrip } from './BiasStrip';
import { ChevronRight, AlertTriangle, FileText } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  onClick: (id: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
  return (
    <div 
      onClick={() => onClick(story.id)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"
    >
      {story.blindspot && (
        <div className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
          <AlertTriangle size={12} className="text-yellow-400" />
          {story.blindspot} Blindspot
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">{story.topic}</span>
          <span>•</span>
          <span>{story.lastUpdated}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><FileText size={12}/> {story.totalSources} sources</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-800 transition-colors">
          {story.title}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-2">
          {story.summary}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <BiasStrip distribution={story.biasDistribution} showLabels />
        <div className="mt-3 flex justify-end text-xs font-semibold text-indigo-600 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          View Analysis <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
};