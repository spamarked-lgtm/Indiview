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
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img 
            src={story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000'} 
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {story.blindspot && (
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                <AlertTriangle size={12} className="text-orange-500" />
                Blindspot
            </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">
          <span className="text-indigo-600">{story.topic}</span>
          <span>•</span>
          <span>{story.lastUpdated}</span>
        </div>
        
        <h2 className="text-lg font-bold text-gray-900 leading-tight mb-3 group-hover:text-indigo-700 transition-colors">
          {story.title}
        </h2>
        
        <div className="mt-auto">
             <BiasStrip distribution={story.biasDistribution} variant="thick" />
             <div className="mt-2 text-xs text-gray-500 text-right">
                {story.totalSources} sources analyzed
             </div>
        </div>
      </div>
    </div>
  );
};