import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Hammer, 
  Shield, 
  Sword, 
  Check, 
  ArrowRight,
  Compass,
  MapPin,
  Flame,
  Zap
} from 'lucide-react';
import { GameTitle } from '../types';
import { GAMES_DATA, GameInfo } from '../data/monsterHunterData';

interface GameSelectorCarouselProps {
  selectedGame: GameTitle;
  onSelectGame: (game: GameTitle) => void;
  onLaunchWorkshop: (game: GameTitle) => void;
  onLaunchMonsters: (game: GameTitle) => void;
  onLaunchGearInfo: (game: GameTitle) => void;
}

const GAME_KEYS: GameTitle[] = ['wilds', 'sunbreak', 'iceborne', 'mhgu', 'mh4u'];

export const GameSelectorCarousel: React.FC<GameSelectorCarouselProps> = ({
  selectedGame,
  onSelectGame,
  onLaunchWorkshop,
  onLaunchMonsters,
  onLaunchGearInfo,
}) => {
  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = GAME_KEYS.indexOf(selectedGame);
    return idx >= 0 ? idx : 0;
  });

  const activeGameKey = GAME_KEYS[activeIndex];
  const currentGame: GameInfo = GAMES_DATA[activeGameKey];
  const isSelected = selectedGame === activeGameKey;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? GAME_KEYS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === GAME_KEYS.length - 1 ? 0 : prev + 1));
  };

  const handleSelectCurrentGame = () => {
    onSelectGame(activeGameKey);
  };

  return (
    <section id="game-selection-carousel" className="space-y-4">
      {/* Header with Title & Quick Title Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Hunting Hub Selector
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Choose your Monster Hunter generation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Select Game for Builds, Armory & Bestiary
          </h2>
        </div>

        {/* Carousel Quick Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {GAME_KEYS.map((key, index) => {
            const g = GAMES_DATA[key];
            const isCurrent = activeIndex === index;
            const isChosen = selectedGame === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveIndex(index);
                  onSelectGame(key);
                }}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : isChosen
                    ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{g.shortName}</span>
                {isChosen && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Cinematic Carousel Card */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGameKey}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative min-h-[360px] sm:min-h-[420px] flex flex-col justify-between p-6 sm:p-8 lg:p-10"
          >
            {/* Background Image with High-Impact Gradient Masks */}
            <div className="absolute inset-0 z-0">
              <img
                src={currentGame.heroImage}
                alt={currentGame.name}
                className="w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
              <div className={`absolute inset-0 bg-gradient-to-r ${currentGame.accentGradient} opacity-60 mix-blend-overlay`} />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
            </div>

            {/* Top Row Badges & Game Stats */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-lg ${currentGame.badgeColor}`}>
                  {currentGame.era}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-200 text-xs font-medium backdrop-blur-md">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {currentGame.hubLocation}
                </span>
              </div>

              {/* Selection Status Badge */}
              <div>
                {isSelected ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold shadow-lg">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Active Selected Game
                  </span>
                ) : (
                  <button
                    onClick={handleSelectCurrentGame}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold shadow-lg transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Set as Active Game
                  </button>
                )}
              </div>
            </div>

            {/* Center Content: Game Title, Lore & Signature Mechanics */}
            <div className="relative z-10 my-6 max-w-3xl space-y-3">
              <div className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <span>Featured Monster: {currentGame.coverMonster}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
                {currentGame.name}
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed drop-shadow max-w-2xl">
                {currentGame.tagline}
              </p>

              {/* Signature Mechanics Pill Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs text-amber-200 font-semibold flex items-center gap-2 shadow-lg backdrop-blur-md">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{currentGame.signatureMechanic}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row & Quick Launch Portals */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
              {/* Primary Action Button */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  id={`btn-launch-hub-${activeGameKey}`}
                  onClick={() => {
                    onSelectGame(activeGameKey);
                    onLaunchWorkshop(activeGameKey);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Hammer className="w-4 h-4" />
                  <span>Enter {currentGame.shortName} Builds Workshop</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  id={`btn-launch-monsters-${activeGameKey}`}
                  onClick={() => {
                    onSelectGame(activeGameKey);
                    onLaunchMonsters(activeGameKey);
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs sm:text-sm backdrop-blur-md transition-all"
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Monsters Almanac</span>
                </button>

                <button
                  id={`btn-launch-gear-${activeGameKey}`}
                  onClick={() => {
                    onSelectGame(activeGameKey);
                    onLaunchGearInfo(activeGameKey);
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs sm:text-sm backdrop-blur-md transition-all"
                >
                  <Shield className="w-4 h-4 text-sky-400" />
                  <span>Gear & Armory</span>
                </button>
              </div>

              {/* Carousel Indicators & Next/Prev Controls */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-carousel-prev"
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
                  aria-label="Previous Game"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900/80 border border-slate-800">
                  {GAME_KEYS.map((key, idx) => (
                    <button
                      key={key}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        activeIndex === idx
                          ? 'w-6 bg-amber-400'
                          : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  id="btn-carousel-next"
                  onClick={handleNext}
                  className="w-10 h-10 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
                  aria-label="Next Game"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
