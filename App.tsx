import React, { useState } from 'react';
import { Header } from './components/Header';
import { StoryCard } from './components/StoryCard';
import { StoryDetailView } from './views/StoryDetailView';
import { getStories, getStoryById } from './services/mockData';
import { ViewState } from './types';
import { Info, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('feed');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const handleStoryClick = (id: string) => {
    setSelectedStoryId(id);
    setCurrentView('story_detail');
    window.scrollTo(0,0);
  };

  const handleBack = () => {
    setSelectedStoryId(null);
    setCurrentView('feed');
  };

  const renderContent = () => {
    if (currentView === 'story_detail' && selectedStoryId) {
      const story = getStoryById(selectedStoryId);
      if (!story) return <div>Story not found</div>;
      return <StoryDetailView story={story} onBack={handleBack} />;
    }

    const stories = getStories(currentView === 'blindspots' ? 'blindspot' : 'all');
    const pageTitle = currentView === 'blindspots' ? 'Blindspot Feed' : 'Today\'s Headlines';
    const pageSub = currentView === 'blindspots' 
      ? 'Stories covered by one side of the spectrum but largely ignored by the other.' 
      : 'Aggregate news from across the Indian political spectrum.';

    return (
      <div className="animate-in fade-in duration-500">
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{pageTitle}</h2>
            <p className="text-gray-500 mt-1">{pageSub}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stories.map(story => (
                <StoryCard key={story.id} story={story} onClick={handleStoryClick} />
            ))}
        </div>

        {stories.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-400">No active blindspots found right now.</p>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans">
      <Header currentView={currentView} setView={(v) => { setCurrentView(v); setSelectedStoryId(null); }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer / Disclaimer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-2 text-indigo-900 font-bold mb-4">
                <ShieldAlert size={20} />
                <span>BharatGround Methodology</span>
            </div>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Ratings are generated using an automated pipeline combining ownership analysis, historical coverage patterns, and Indian media watchdog reports. 
                <br/>
                <strong>Clustering:</strong> Articles are grouped using all-MiniLM-L6-v2 embeddings + NER entities.
                <br/>
                <strong>Bias Spectrum:</strong> Specific to Indian political context (Left-Liberal vs Right-Nationalist).
            </p>
            <p className="text-xs text-gray-400 mt-6">© 2024 BharatGround. Non-partisan news aggregator demo.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;