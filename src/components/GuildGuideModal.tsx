import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Sparkles, Sword, Shield, Flame, Zap, Award } from 'lucide-react';
import { GAMES_DATA, WEAPONS_DATA } from '../data/monsterHunterData';
import { GameTitle } from '../types';

interface GuildGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuildGuideModal: React.FC<GuildGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const gameKeys = Object.keys(GAMES_DATA) as GameTitle[];

  return (
    <div id="guild-guide-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Hunter's Guild: Game Styles & Era Mechanics
              </h3>
              <p className="text-xs text-slate-400">
                A definitive overview of combat architectures across Monster Hunter titles.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <div className="grid grid-cols-1 gap-4">
            {gameKeys.map((gKey) => {
              const g = GAMES_DATA[gKey];
              return (
                <div key={gKey} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${g.badgeColor}`}>
                        {g.name}
                      </span>
                      <span className="text-xs text-slate-400">({g.era})</span>
                    </div>
                    <span className="text-xs font-mono text-amber-400">
                      Cover Monster: {g.coverMonster}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Signature Combat Mechanic
                    </div>
                    <p className="text-sm text-slate-200 font-medium">
                      {g.signatureMechanic}
                    </p>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      Supported Hunting Styles & Sub-Modes:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {g.availableStyles.map((st) => (
                        <span key={st} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
          >
            Got It, Return to Guild
          </button>
        </div>
      </motion.div>
    </div>
  );
};
