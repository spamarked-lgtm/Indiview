import React from 'react';
import { ViewState } from '../types';
import { Newspaper, EyeOff, LayoutGrid, Search, User } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  setView: (v: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const NavItem = ({ view, label, icon: Icon }: { view: ViewState, label: string, icon: any }) => (
    <button 
      onClick={() => setView(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        currentView === view 
          ? 'bg-gray-900 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('feed')}>
            <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutGrid size={20} className="text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">Bharat<span className="text-indigo-600">Ground</span></h1>
                <p className="text-[10px] text-gray-500 font-medium tracking-wide">READ THE WHOLE STORY</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-100">
            <NavItem view="feed" label="Home Feed" icon={Newspaper} />
            <NavItem view="blindspots" label="Blindspots" icon={EyeOff} />
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search stories..." 
                    className="pl-9 pr-4 py-1.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 transition-all"
                />
             </div>
             <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                <User size={18} />
                <span className="hidden sm:inline">My Bias</span>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};