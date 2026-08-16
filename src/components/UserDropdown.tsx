import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  ChevronDown, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Hammer, 
  BookOpen, 
  Shield, 
  Sword, 
  Sparkles, 
  Flame, 
  Layers, 
  Award,
  Compass
} from 'lucide-react';
import { HunterProfile, AppPageView } from '../types';

interface UserDropdownProps {
  currentUser: HunterProfile | null;
  currentPage: AppPageView;
  onNavigate: (page: AppPageView) => void;
  onSignOut: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  currentUser,
  currentPage,
  onNavigate,
  onSignOut,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPage = (page: AppPageView) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left" id="user-menu-container">
      {/* Top-Right User Button */}
      <button
        id="btn-user-menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl border transition-all ${
          isOpen
            ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
            : 'bg-slate-900/90 hover:bg-slate-850 border-slate-700/80 text-slate-200 hover:border-amber-500/40'
        }`}
        title="Hunter Account & Navigation Menu"
      >
        <div className="relative">
          {currentUser ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.hunterName}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-xl object-cover border border-amber-500/60 shadow-sm"
            />
          ) : (
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center font-bold text-xs shadow-inner">
              <User className="w-4 h-4 text-slate-950" />
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
        </div>

        <div className="text-left hidden md:block">
          <div className="text-xs font-bold text-slate-100 flex items-center gap-1 leading-tight">
            <span>{currentUser ? currentUser.hunterName : 'Guild Guest'}</span>
          </div>
          <div className="text-[10px] font-mono text-amber-400 leading-tight">
            {currentUser ? `HR ${currentUser.hunterRank} • MR ${currentUser.masterRank}` : 'Sign In / Register'}
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-amber-500/30 shadow-2xl shadow-black/80 py-2 z-50 overflow-hidden divide-y divide-slate-800"
          >
            {/* Header: User Guild Card Preview */}
            <div className="px-4 py-3 bg-gradient-to-br from-slate-950 to-slate-900/90">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.hunterName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-amber-500/60 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate">{currentUser.hunterName}</h4>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                        {currentUser.guildCardBadge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.guildTitle}</p>
                    <div className="text-[10px] text-amber-400/90 font-mono mt-0.5">
                      HR {currentUser.hunterRank} / MR {currentUser.masterRank} • {currentUser.huntsCompleted} Hunts
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Guild Hall Traveler</h4>
                    <p className="text-[11px] text-slate-400">Join the guild to save builds & track armor.</p>
                  </div>
                  <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Award className="w-4 h-4" />
                  </span>
                </div>
              )}
            </div>

            {/* Navigation Pages Menu */}
            <div className="p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                Guild Hub Navigation
              </div>

              {/* 1. Register / Login Page */}
              <button
                id="menu-link-auth"
                onClick={() => handleSelectPage('auth')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                  currentPage === 'auth'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-amber-300'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${currentPage === 'auth' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                  {currentUser ? <User className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div>{currentUser ? 'Hunter Profile & Guild Card' : 'Register / Login'}</div>
                  <div className={`text-[10px] font-normal ${currentPage === 'auth' ? 'text-slate-900' : 'text-slate-400'}`}>
                    {currentUser ? 'Manage credentials & hunter title' : 'Create guild account or sign in'}
                  </div>
                </div>
              </button>

              {/* 2. Builds Workshop (Armor change on central model) */}
              <button
                id="menu-link-builds-workshop"
                onClick={() => handleSelectPage('builds_workshop')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                  currentPage === 'builds_workshop'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-amber-300'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${currentPage === 'builds_workshop' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                  <Hammer className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span>Builds Workshop</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-[9px] text-amber-200 uppercase font-mono font-black">
                      Model Studio
                    </span>
                  </div>
                  <div className={`text-[10px] font-normal ${currentPage === 'builds_workshop' ? 'text-slate-900' : 'text-slate-400'}`}>
                    Customize each armor piece on the central hunter model
                  </div>
                </div>
              </button>

              {/* 3. Monsters Info */}
              <button
                id="menu-link-monsters-info"
                onClick={() => handleSelectPage('monsters')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                  currentPage === 'monsters'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-amber-300'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${currentPage === 'monsters' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                  <Flame className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div>Monsters Info</div>
                  <div className={`text-[10px] font-normal ${currentPage === 'monsters' ? 'text-slate-900' : 'text-slate-400'}`}>
                    Bestiary, hitzone weaknesses, breakable parts & materials
                  </div>
                </div>
              </button>

              {/* 4. Gear Info */}
              <button
                id="menu-link-gear-info"
                onClick={() => handleSelectPage('gear_info')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                  currentPage === 'gear_info'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-amber-300'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${currentPage === 'gear_info' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div>Gear Info</div>
                  <div className={`text-[10px] font-normal ${currentPage === 'gear_info' ? 'text-slate-900' : 'text-slate-400'}`}>
                    Weapons armory, armor directory, skills & decorations
                  </div>
                </div>
              </button>

              {/* 5. Home / Showcase Builds Hub */}
              <button
                id="menu-link-home"
                onClick={() => handleSelectPage('home')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                  currentPage === 'home'
                    ? 'bg-slate-800 text-amber-300'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="p-1 rounded-md bg-slate-800 text-slate-400">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <span>Explore Builds & Fashion Showcase</span>
              </button>
            </div>

            {/* Footer / Account Controls */}
            {currentUser && (
              <div className="p-2">
                <button
                  id="btn-sign-out"
                  onClick={() => {
                    onSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Hunter Account</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
