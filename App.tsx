import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BiasStrip } from './components/BiasStrip';
import { StoryDetailView } from './views/StoryDetailView';
import { api, initDatabase } from './services/database';
import { ViewState, Story } from './types';
import { ShieldAlert, Info, ArrowRight, Eye, PlayCircle, Star, Award, Newspaper } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('feed');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  
  // Backend Data State
  const [stories, setStories] = useState<Record<string, Story[]>>({
      hero: [],
      briefing: [],
      top: [],
      blindspot: [],
      all: []
  });
  const [loading, setLoading] = useState(true);
  const [currentStory, setCurrentStory] = useState<Story | undefined>(undefined);

  // Initialize Backend Connection
  useEffect(() => {
    const fetchData = async () => {
        await initDatabase();
        
        const [hero, briefing, top, blindspot, all] = await Promise.all([
            api.getStories('hero'),
            api.getStories('briefing'),
            api.getStories('top'),
            api.getStories('blindspot'),
            api.getStories('all')
        ]);

        setStories({ hero, briefing, top, blindspot, all });
        setLoading(false);
    };

    fetchData();
  }, []);

  // Fetch specific story when detailed view opens
  useEffect(() => {
    const fetchDetail = async () => {
        if (selectedStoryId) {
            const story = await api.getStoryById(selectedStoryId);
            setCurrentStory(story);
        }
    };
    fetchDetail();
  }, [selectedStoryId]);


  const handleStoryClick = (id: string) => {
    setSelectedStoryId(id);
    setCurrentView('story_detail');
    window.scrollTo(0,0);
  };

  const handleBack = () => {
    setSelectedStoryId(null);
    setCurrentStory(undefined);
    setCurrentView('feed');
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
              <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">Connecting to Database...</p>
              </div>
          </div>
      );
  }

  // --- Components Specific to Home Page Layout ---

  const DailyBriefingCard = ({ story }: { story: Story }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStoryClick(story.id)}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Briefing</h3>
        <div className="relative aspect-video w-full rounded-md overflow-hidden mb-3">
             <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover" />
             <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                 7 stories • 10m read
             </div>
        </div>
        <h4 className="font-bold text-lg leading-tight mb-2 hover:text-indigo-600">{story.title}</h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{story.summary}</p>
        <div className="text-xs text-gray-500 space-y-1 border-t border-gray-100 pt-3">
            <p className="hover:underline cursor-pointer flex items-center gap-1">+ Owens Claims Macron Assassination Plot</p>
            <p className="hover:underline cursor-pointer flex items-center gap-1">+ Fake Foreign Accounts Exposed</p>
            <p className="hover:underline cursor-pointer flex items-center gap-1">+ Chimpanzees Revise Beliefs</p>
        </div>
    </div>
  );

  const TopStoryRow = ({ story }: { story: Story }) => {
    const dominantBias = story.biasDistribution.left > 40 ? 'Left' : story.biasDistribution.right > 40 ? 'Right' : 'Center';
    const percent = Math.max(story.biasDistribution.left, story.biasDistribution.center, story.biasDistribution.right);
    
    return (
        <div className="py-4 border-b border-gray-100 last:border-0 cursor-pointer group" onClick={() => handleStoryClick(story.id)}>
            <div className="flex gap-2 text-[10px] text-gray-500 uppercase font-semibold mb-1">
                <span>{story.topic}</span>
                <span>•</span>
                <span>{story.entities[0]}</span>
            </div>
            <h4 className="font-bold text-sm leading-snug text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {story.title}
            </h4>
            <div className="flex items-center gap-2">
                <BiasStrip distribution={story.biasDistribution} variant="thin" className="w-10" />
                <span className="text-[10px] text-gray-500 font-medium">
                    {percent}% {dominantBias} coverage: {story.totalSources} sources
                </span>
            </div>
        </div>
    );
  };

  const HeroCard = ({ story }: { story: Story }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer group mb-6 relative" onClick={() => handleStoryClick(story.id)}>
        <div className="relative aspect-[16/9] w-full">
            <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover brightness-95 group-hover:brightness-100 transition-all duration-500" />
            <div className="absolute top-3 right-3 text-white/80 hover:text-white">
                <Info size={20} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-20">
                <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                    <span>{story.totalSources} stories</span>
                    <span>•</span>
                    <span>{story.articles.length * 12} articles</span>
                    <span>•</span>
                    <span>{story.lastUpdated}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4 text-shadow-sm">
                    {story.title}
                </h2>
                <BiasStrip distribution={story.biasDistribution} variant="thick" />
            </div>
        </div>
    </div>
  );

  const FeedCard = ({ story }: { story: Story }) => {
    const dominant = story.biasDistribution.left > story.biasDistribution.right ? 'Left' : 'Right';
    return (
        <div className="flex gap-4 py-6 border-b border-gray-100 last:border-0 cursor-pointer group" onClick={() => handleStoryClick(story.id)}>
             <div className="flex-1">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-semibold mb-1.5">
                    <span>{story.entities[0]}</span>
                    <span>•</span>
                    <span>{story.topic}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2 group-hover:text-indigo-700 transition-colors">
                    {story.title}
                </h3>
                <div className="flex items-center gap-3 mt-3">
                    <BiasStrip distribution={story.biasDistribution} variant="thin" className="w-24 h-2" />
                    <span className="text-xs text-gray-500 font-medium">{Math.max(story.biasDistribution.left, story.biasDistribution.right)}% {dominant} coverage: {story.totalSources} sources</span>
                </div>
             </div>
             <div className="w-24 h-24 sm:w-32 sm:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <img src={story.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
             </div>
        </div>
    );
  };

  const BlindspotCard = ({ story }: { story: Story }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStoryClick(story.id)}>
        <div className="relative h-32 overflow-hidden">
             <img src={story.imageUrl} alt="" className="w-full h-full object-cover" />
             <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
             <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                {story.blindspot === 'Left' ? 'No coverage from Left' : 'Low coverage from Right'}
             </div>
        </div>
        <div className="p-4">
             <div className="flex justify-between items-center mb-2">
                 <span className={`text-[10px] font-bold uppercase tracking-wider ${story.blindspot === 'Left' ? 'text-orange-600' : 'text-blue-600'}`}>
                    {story.blindspot === 'Left' ? 'Right 100%' : 'Left 100%'}
                 </span>
                 <span className="text-[10px] text-gray-400">{story.lastUpdated}</span>
             </div>
             <h4 className="font-bold text-sm leading-snug mb-3 text-gray-900">{story.title}</h4>
             <div className="flex items-center gap-2 text-[10px] text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                <ShieldAlert size={12} className="text-gray-400" />
                Blindspot Analysis
             </div>
        </div>
    </div>
  );

  const SocialProofBanner = () => (
    <div className="bg-[#f0f2f5] border-y border-gray-200 py-6 mb-8">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-wrap justify-between items-center gap-6 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
                <div className="flex text-orange-400"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                <div className="text-xs font-bold text-gray-900 leading-tight">10,000+<br/><span className="font-normal text-gray-500">5-star reviews</span></div>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-300 pl-6">
                <Award size={32} className="text-black" />
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-900">App of<br/>The Day</div>
            </div>
            <div className="flex items-center gap-8 ml-auto">
                <span className="text-xs text-gray-500 font-medium">As featured on</span>
                <span className="font-serif font-bold text-xl text-gray-800">Forbes</span>
                <span className="font-sans font-bold text-xl text-gray-800 tracking-tight">Mashable</span>
                <span className="font-serif font-bold text-xl text-gray-800">USA TODAY</span>
                <span className="font-serif font-bold text-xl text-gray-800">WSJ</span>
                <span className="font-serif font-bold text-xl text-gray-800">BBC NEWS</span>
            </div>
        </div>
    </div>
  );

  const RenderHome = () => {
    return (
        <>
            {/* Promo Hero */}
            <div className="bg-[#eef1f5] border-b border-gray-200 py-12 md:py-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <div className="max-w-[1000px] mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-none">
                        See every side of every news story.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Read the news from multiple perspectives. See through media bias with reliable news from local and international sources.
                    </p>
                    <button onClick={() => setCurrentView('feed')} className="bg-[#1a1a1a] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Get Started
                    </button>
                </div>
            </div>

            <SocialProofBanner />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    {/* Left Column: Daily Briefing & Top News */}
                    <div className="md:col-span-3 space-y-8">
                        <div>
                            {stories.briefing[0] && <DailyBriefingCard story={stories.briefing[0]} />}
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                                <Newspaper size={18} /> Top News Stories
                            </h3>
                            <div className="flex flex-col">
                                {stories.top.map(story => <TopStoryRow key={story.id} story={story} />)}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                             <h3 className="font-bold text-lg text-gray-900 mb-4">Daily Local News</h3>
                             <div className="aspect-video bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
                                 Map Visualization Placeholder
                             </div>
                        </div>
                    </div>

                    {/* Center Column: Hero & Feed */}
                    <div className="md:col-span-6">
                        {stories.hero[0] && <HeroCard story={stories.hero[0]} />}
                        <div className="bg-white rounded-xl border border-gray-200 p-2 sm:p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-gray-900">Latest Stories</h3>
                            </div>
                            <div className="flex flex-col">
                                {stories.top.map(story => <FeedCard key={story.id + 'feed'} story={story} />)}
                                {stories.blindspot.map(story => <FeedCard key={story.id + 'feed2'} story={story} />)}
                            </div>
                            <button className="w-full mt-6 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                Load More Stories
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Blindspot & Widgets */}
                    <div className="md:col-span-3 space-y-6">
                        <div className="bg-[#f8f9fa] rounded-xl p-5 border border-gray-200">
                             <div className="flex items-center gap-2 mb-2">
                                <Eye size={20} className="text-gray-900" />
                                <h3 className="font-bold text-xl text-gray-900">Blindspot</h3>
                             </div>
                             <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                                Stories disproportionately covered by one side of the political spectrum. <a href="#" className="underline font-bold">Learn more</a>
                             </p>
                             
                             {stories.blindspot.map(story => <BlindspotCard key={story.id} story={story} />)}

                             <button onClick={() => setCurrentView('blindspots')} className="w-full mt-2 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
                                View Blindspot Feed
                             </button>
                        </div>

                        {/* My News Bias Widget */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-bold text-lg text-gray-900 mb-3">My News Bias</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">LB</div>
                                <div>
                                    <div className="text-sm font-bold">Linda B. (Sample)</div>
                                    <div className="text-xs text-gray-500">0 Stories • 0 Articles</div>
                                </div>
                            </div>
                            <div className="flex gap-1 h-8 mb-4">
                                <div className="flex-1 bg-blue-900 rounded-l flex items-center justify-center text-white text-xs">?</div>
                                <div className="flex-1 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">?</div>
                                <div className="flex-1 bg-red-900 rounded-r flex items-center justify-center text-white text-xs">?</div>
                            </div>
                            <button className="w-full py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
                                See the demo
                            </button>
                        </div>

                        {/* Topics List */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-bold text-lg text-gray-900 mb-4">Similar News Topics</h3>
                            <div className="space-y-3">
                                {['Israel-Gaza', 'Trump Administration', 'Business & Markets', 'Basketball', 'NFL', 'Donald Trump', 'Thanksgiving'].map(topic => (
                                    <div key={topic} className="flex justify-between items-center group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-serif font-bold text-gray-500 text-xs">
                                                {topic.substring(0,1)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-black">{topic}</span>
                                        </div>
                                        <span className="text-gray-400 group-hover:text-black">+</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
  };

  const renderContent = () => {
    if (currentView === 'story_detail' && currentStory) {
      return <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8"><StoryDetailView story={currentStory} onBack={handleBack} /></div>;
    }

    if (currentView === 'feed') {
        return <RenderHome />;
    }

    // Blindspot full view fallback
    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold mb-6">Blindspot Feed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.blindspot.map(story => (
                    <div key={story.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer" onClick={() => handleStoryClick(story.id)}>
                        <img src={story.imageUrl} className="w-full h-48 object-cover"/>
                        <div className="p-4">
                             <h3 className="font-bold text-lg mb-2">{story.title}</h3>
                             <BiasStrip distribution={story.biasDistribution} variant="blindspot" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 font-sans">
      <Header currentView={currentView} setView={(v) => { setCurrentView(v); setSelectedStoryId(null); }} />

      <main>
        {renderContent()}
      </main>

      <footer className="bg-[#1a1a1a] text-white mt-auto py-12">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
             <div>
                 <div className="flex items-center gap-1 mb-4">
                    <div className="bg-white text-black px-1 py-0.5 font-extrabold text-sm">GROUND</div>
                    <div className="text-white font-extrabold text-sm">NEWS</div>
                 </div>
                 <ul className="space-y-2 text-sm text-gray-400">
                     <li>Home Page</li>
                     <li>Local News</li>
                     <li>Blindspot Feed</li>
                     <li>International</li>
                 </ul>
             </div>
             <div>
                 <h4 className="font-bold mb-4">Company</h4>
                 <ul className="space-y-2 text-sm text-gray-400">
                     <li>About</li>
                     <li>History</li>
                     <li>Mission</li>
                     <li>Blog</li>
                 </ul>
             </div>
             <div>
                 <h4 className="font-bold mb-4">Help</h4>
                 <ul className="space-y-2 text-sm text-gray-400">
                     <li>Help Center</li>
                     <li>FAQ</li>
                     <li>Contact Us</li>
                 </ul>
             </div>
             <div>
                 <h4 className="font-bold mb-4">Tools</h4>
                 <ul className="space-y-2 text-sm text-gray-400">
                     <li>App</li>
                     <li>Browser Extension</li>
                     <li>Daily Newsletter</li>
                 </ul>
             </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 text-xs text-gray-600 border-t border-gray-800 pt-8 flex justify-between">
            <span>© 2025 Snapwise Inc</span>
            <div className="flex gap-4">
                <span>Privacy Policy</span>
                <span>Terms and Conditions</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;