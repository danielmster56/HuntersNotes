import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Shield, 
  Sword, 
  Palette, 
  Maximize2,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HunterBuild } from '../types';
import { GAMES_DATA, WEAPONS_DATA } from '../data/monsterHunterData';

interface FashionSpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  builds: HunterBuild[];
  initialBuildId?: string;
  onSelectBuild: (build: HunterBuild) => void;
  onLikeBuild: (buildId: string) => void;
}

export const FashionSpotlight: React.FC<FashionSpotlightProps> = ({
  isOpen,
  onClose,
  builds,
  initialBuildId,
  onSelectBuild,
  onLikeBuild,
}) => {
  const initialIndex = initialBuildId 
    ? Math.max(0, builds.findIndex(b => b.id === initialBuildId)) 
    : 0;

  const [currentBuildIndex, setCurrentBuildIndex] = useState(initialIndex);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!isOpen || builds.length === 0) return null;

  const currentBuild = builds[currentBuildIndex] || builds[0];
  const gameInfo = GAMES_DATA[currentBuild.game] || GAMES_DATA.wilds;
  const weaponInfo = WEAPONS_DATA[currentBuild.weaponType] || WEAPONS_DATA.great_sword;
  
  const slides = currentBuild.gearImages && currentBuild.gearImages.length > 0 
    ? currentBuild.gearImages 
    : [{
        id: 'spotlight-fallback',
        title: 'Full Armor Set',
        category: 'full' as const,
        url: currentBuild.showcaseHeroImage || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
        caption: 'High resolution armor lookbook presentation.'
      }];

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handlePrevBuild = () => {
    setCurrentBuildIndex((prev) => (prev === 0 ? builds.length - 1 : prev - 1));
    setCurrentSlideIndex(0);
  };

  const handleNextBuild = () => {
    setCurrentBuildIndex((prev) => (prev === builds.length - 1 ? 0 : prev + 1));
    setCurrentSlideIndex(0);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleLike = () => {
    onLikeBuild(currentBuild.id);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div id="fashion-spotlight-modal" className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between z-10 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
              Monster Hunter Fashion Showcase & Gear Lookbook
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              {currentBuild.fashionTitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold hover:bg-rose-500/30 transition-all"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>{currentBuild.likes}</span>
          </button>

          <button
            onClick={() => {
              onSelectBuild(currentBuild);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md"
          >
            <span>Inspect Full Stats</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="btn-close-fashion-spotlight"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Showcase Stage */}
      <div className="relative flex-1 flex items-center justify-center my-3 max-h-[72vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentBuild.id}-${currentSlideIndex}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full max-w-5xl flex items-center justify-center rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl"
          >
            <img
              src={currentSlide.url}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain"
            />

            {/* Overlaid Badges & Metadata */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${gameInfo.badgeColor}`}>
                  {gameInfo.name}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-amber-300 text-xs font-semibold backdrop-blur-md">
                  Fashion {currentBuild.fashionRating.toFixed(1)} ★
                </span>
              </div>

              {currentBuild.fashionDyes && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 backdrop-blur-md pointer-events-auto">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-slate-300 font-mono">{currentBuild.fashionDyes.pigmentName}</span>
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-inner" style={{ backgroundColor: currentBuild.fashionDyes.primaryHex }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-inner" style={{ backgroundColor: currentBuild.fashionDyes.secondaryHex }} />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-4 left-4 right-4 z-10 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono uppercase">
                    {currentSlide.category} View
                  </span>
                  <h4 className="text-base font-bold text-white">{currentSlide.title}</h4>
                </div>
                {currentSlide.caption && (
                  <p className="text-xs text-slate-300 mt-1">{currentSlide.caption}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  Angle {currentSlideIndex + 1} / {slides.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevSlide}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-700"
                    title="Previous Angle"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-700"
                    title="Next Angle"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Set Carousel Selector */}
      <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between gap-4 z-10">
        <button
          onClick={handlePrevBuild}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Armor Set
        </button>

        {/* Armor Sets Thumbnails Strip */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-xl scrollbar-thin py-1">
          {builds.map((b, idx) => {
            const isCurrent = idx === currentBuildIndex;
            return (
              <button
                key={b.id}
                onClick={() => {
                  setCurrentBuildIndex(idx);
                  setCurrentSlideIndex(0);
                }}
                className={`relative shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <img
                  src={b.showcaseHeroImage || b.gearImages?.[0]?.url}
                  alt={b.fashionTitle}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded object-cover"
                />
                <span className="truncate max-w-[120px]">{b.fashionTitle}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextBuild}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200"
        >
          Next Armor Set <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
