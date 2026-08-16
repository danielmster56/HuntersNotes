import React from 'react';
import { 
  Sparkles, 
  Plus, 
  Sword, 
  Layers, 
  Shield, 
  Info, 
  Flame,
  BookOpen,
  Hammer
} from 'lucide-react';
import { GameTitle, HunterProfile, AppPageView } from '../types';
import { GAMES_DATA } from '../data/monsterHunterData';
import { UserDropdown } from './UserDropdown';

interface NavbarProps {
  currentUser: HunterProfile | null;
  currentPage: AppPageView;
  onNavigate: (page: AppPageView) => void;
  onSignOut: () => void;
  onOpenRegisterModal: () => void;
  onOpenFashionSpotlight: () => void;
  onOpenGuildGuide: () => void;
  totalBuildsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentPage,
  onNavigate,
  onSignOut,
  onOpenRegisterModal,
  onOpenFashionSpotlight,
  onOpenGuildGuide,
  totalBuildsCount,
}) => {
  return (
    <header id="app-navbar" className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-4">
        {/* Guild Logo & Title (Clicking navigates to Home) */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to Home & Builds Hub"
        >
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400 group-hover:scale-105 transition-transform">
            <Sword className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                Monster Hunter <span className="text-amber-400">Build & Fashion Hub</span>
              </h1>
              <span className="hidden xl:inline-flex px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-semibold">
                Multi-Era Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Register builds, customize hunter armor pieces & explore monsters.
            </p>
          </div>
        </div>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              currentPage === 'home'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Showcase
          </button>
          <button
            onClick={() => onNavigate('builds_workshop')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              currentPage === 'builds_workshop'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>Builds Workshop</span>
          </button>
          <button
            onClick={() => onNavigate('monsters')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              currentPage === 'monsters'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Monsters Info</span>
          </button>
          <button
            onClick={() => onNavigate('gear_info')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              currentPage === 'gear_info'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Gear Info</span>
          </button>
        </nav>

        {/* Action Buttons & Top-Right User Dropdown Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Fashion Spotlight Lookbook */}
          <button
            id="btn-nav-fashion-spotlight"
            onClick={onOpenFashionSpotlight}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-md hover:border-amber-500/60"
            title="Open Character Gear & Fashion Carousel Lookbook"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Lookbook</span>
          </button>

          {/* Register Build Studio Modal Button */}
          <button
            id="btn-nav-register-build"
            onClick={onOpenRegisterModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow-lg shadow-amber-500/25"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Register</span>
          </button>

          {/* Top-Right User Dropdown with Links (Register/Login, Builds Workshop, Monsters Info, Gear Info) */}
          <UserDropdown
            currentUser={currentUser}
            currentPage={currentPage}
            onNavigate={onNavigate}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  );
};
