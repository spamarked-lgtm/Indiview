import React from 'react';
import { Story, Bias } from '../types';
import { BiasStrip } from '../components/BiasStrip';
import { ArticleList } from '../components/ArticleList';
import { SOURCES_DB, TEXT_COLORS } from '../constants';
import { ArrowLeft, Sparkles, Share2, Info } from 'lucide-react';

interface StoryDetailViewProps {
  story: Story;
  onBack: () => void;
}

export const StoryDetailView: React.FC<StoryDetailViewProps> = ({ story, onBack }) => {
  // Filter articles into buckets
  const leftArticles = story.articles.filter(a => {
    const bias = SOURCES_DB[a.sourceId]?.bias;
    return bias === Bias.Left || bias === Bias.FarLeft || bias === Bias.CenterLeft;
  });
  
  const centerArticles = story.articles.filter(a => {
    const bias = SOURCES_DB[a.sourceId]?.bias;
    return bias === Bias.Center;
  });

  const rightArticles = story.articles.filter(a => {
    const bias = SOURCES_DB[a.sourceId]?.bias;
    return bias === Bias.Right || bias === Bias.FarRight || bias === Bias.CenterRight;
  });

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-300">
      {/* Navigation Header for Detail */}
      <div className="mb-6 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-lg hover:bg-white transition-colors"
        >
          <ArrowLeft size={18} /> Back to Feed
        </button>
        <div className="flex gap-2">
            <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50">
                <Share2 size={18} />
            </button>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {story.topic}
                    </span>
                    {story.blindspot && (
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-gray-200">
                           ⚠️ {story.blindspot} Blindspot
                        </span>
                    )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                    {story.title}
                </h1>

                {/* Bias Meter */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Media Coverage Bias</span>
                        <Info size={14} className="text-gray-400" />
                    </div>
                    <BiasStrip distribution={story.biasDistribution} showLabels className="h-4" />
                    <p className="text-xs text-gray-500 mt-3 text-center">
                        <span className="font-semibold">{story.totalSources} sources</span> are covering this story. 
                        {story.blindspot 
                            ? ` Heavily ignored by the ${story.blindspot} side.`
                            : ' Coverage is relatively balanced.'}
                    </p>
                </div>
            </div>

            {/* AI Summary */}
            <div className="flex-1 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 p-6">
                <div className="flex items-center gap-2 mb-4 text-indigo-800">
                    <Sparkles size={18} />
                    <h3 className="font-bold text-lg">Ground Summary</h3>
                </div>
                <ul className="space-y-3">
                    {story.aiSummaryPoints.map((point, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                            <span className="text-indigo-400 font-bold">•</span>
                            {point}
                        </li>
                    ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-indigo-100 text-xs text-indigo-400 text-right font-medium">
                    Synthesized from {story.totalSources} articles
                </div>
            </div>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-full">
            <ArticleList 
                title="Left Leaning Sources" 
                articles={leftArticles} 
                headerColor="text-blue-700 bg-blue-50"
            />
        </div>
        <div className="h-full">
             <ArticleList 
                title="Center Sources" 
                articles={centerArticles} 
                headerColor="text-gray-700 bg-gray-50"
            />
        </div>
        <div className="h-full">
             <ArticleList 
                title="Right Leaning Sources" 
                articles={rightArticles} 
                headerColor="text-orange-700 bg-orange-50"
            />
        </div>
      </div>
    </div>
  );
};