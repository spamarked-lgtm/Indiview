import React from 'react';
import { ViewState } from '../types';
import { Search, Menu, Moon, MapPin, Globe } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  setView: (v: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const topics = [
    'Israel-Gaza', 'Business & Markets', 'G20 Summit', 'Trump Administration', 
    'Health & Medicine', 'Extreme Weather', 'Environment', 'Nature & Animals'
  ];

  return (
    <div className="flex flex-col w-full font-sans">
      {/* Top Utility Bar */}
      <div className="bg-[#1a1a1a] text-white text-[10px] sm:text-xs py-1.5 px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="opacity-70 hidden sm:inline">Browser Extension</span>
          <span className="opacity-70">Theme: <span className="text-yellow-500">Light</span> Dark Auto</span>
        </div>
        <div className="flex items-center gap-4 opacity-70">
            <span>Monday, November 24, 2025</span>
            <span className="flex items-center gap-1 hover:text-white cursor-pointer"><MapPin size={10} /> Set Location</span>
            <span className="flex items-center gap-1 hover:text-white cursor-pointer"><Globe size={10} /> US Edition</span>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600">
                <Menu size={20} />
            </button>
            {/* Logo */}
            <div 
                className="flex items-center gap-1 cursor-pointer" 
                onClick={() => setView('feed')}
            >
               <div className="bg-black text-white px-2 py-1 font-extrabold tracking-tighter text-xl">GROUND</div>
               <div className="text-black font-extrabold tracking-tighter text-xl">NEWS</div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 ml-6 text-sm font-medium text-gray-600">
                <button onClick={() => setView('feed')} className={`hover:text-black transition-colors ${currentView === 'feed' ? 'text-black font-bold' : ''}`}>Home</button>
                <button className="hover:text-black transition-colors">For You <span className="text-[10px] align-top text-orange-500">●</span></button>
                <button className="hover:text-black transition-colors">Local</button>
                <button onClick={() => setView('blindspots')} className={`hover:text-black transition-colors ${currentView === 'blindspots' ? 'text-black font-bold' : ''}`}>Blindspot</button>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
             <div className="hidden lg:flex relative group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600" />
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 w-64 transition-all"
                />
             </div>
             <button className="bg-black text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">Subscribe</button>
             <button className="text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-300">Login</button>
          </div>
        </div>
      </header>

      {/* Sub-nav Topics */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto no-scrollbar">
         <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-6 h-10 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
            {topics.map(topic => (
                <button key={topic} className="hover:text-black transition-colors flex items-center gap-1">
                    {topic === 'Israel-Gaza' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                    {topic}
                </button>
            ))}
            <button className="hover:text-black transition-colors">More +</button>
         </div>
      </div>
    </div>
  );
};