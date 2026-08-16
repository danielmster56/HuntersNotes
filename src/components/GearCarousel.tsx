import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Maximize2, 
  X, 
  Palette, 
  Shield, 
  Sword, 
  Eye
} from 'lucide-react';
import { FashionImage, ArmorDye, ArmorPiece } from '../types';

interface GearCarouselProps {
  images: FashionImage[];
  fashionTitle: string;
  fashionTheme: string;
  fashionRating: number;
  dyes?: ArmorDye;
  gearPieces?: {
    head: ArmorPiece;
    chest: ArmorPiece;
    arms: ArmorPiece;
    waist: ArmorPiece;
    legs: ArmorPiece;
  };
  weaponName?: string;
  className?: string;
}

export const GearCarousel: React.FC<GearCarouselProps> = ({
  images,
  fashionTitle,
  fashionTheme,
  fashionRating,
  dyes,
  gearPieces,
  weaponName,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Fallback if no images provided
  const slideList = images && images.length > 0 ? images : [
    {
      id: 'default-1',
      title: 'Full Armor Set Showcase',
      category: 'full' as const,
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      caption: 'Complete hunter battle set with layered armor plating.',
    }
  ];

  const currentSlide = slideList[currentIndex] || slideList[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? slideList.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === slideList.length - 1 ? 0 : prev + 1));
  };

  // Associate current category with piece info
  const getPieceDetails = () => {
    if (!gearPieces) return null;
    switch (currentSlide.category) {
      case 'head':
        return { label: 'Head Armor', piece: gearPieces.head };
      case 'chest':
        return { label: 'Chest Armor', piece: gearPieces.chest };
      case 'arms':
        return { label: 'Arm Vambraces', piece: gearPieces.arms };
      case 'waist':
        return { label: 'Waist Coil', piece: gearPieces.waist };
      case 'legs':
        return { label: 'Leg Greaves', piece: gearPieces.legs };
      default:
        return null;
    }
  };

  const activePiece = getPieceDetails();

  return (
    <div id="gear-carousel-root" className={`relative flex flex-col rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/30 shadow-2xl ${className}`}>
      {/* Main Image Stage */}
      <div className="relative w-full aspect-16/10 sm:aspect-16/9 bg-slate-950 overflow-hidden group cursor-pointer" onClick={() => setIsFullscreen(true)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id || currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              id={`carousel-image-${currentIndex}`}
              src={currentSlide.url}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Top Badges (Fashion Rating & Category) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Fashion {fashionRating.toFixed(1)} ★
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-medium uppercase tracking-wider backdrop-blur-md">
              {currentSlide.category} view
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {dyes && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-slate-300 font-medium">Pigment</span>
                <div className="flex items-center gap-1">
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-inner" 
                    style={{ backgroundColor: dyes.primaryHex }} 
                    title={`Primary: ${dyes.primaryHex}`} 
                  />
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-inner" 
                    style={{ backgroundColor: dyes.secondaryHex }} 
                    title={`Secondary: ${dyes.secondaryHex}`} 
                  />
                </div>
              </div>
            )}
            <button
              id="carousel-btn-fullscreen"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(true);
              }}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-md backdrop-blur-md"
              title="Inspect in Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        {slideList.length > 1 && (
          <>
            <button
              id="carousel-nav-prev"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-amber-500 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-slate-950 transition-all opacity-80 group-hover:opacity-100 backdrop-blur-md shadow-xl z-10"
              aria-label="Previous Gear Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="carousel-nav-next"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-amber-500 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-slate-950 transition-all opacity-80 group-hover:opacity-100 backdrop-blur-md shadow-xl z-10"
              aria-label="Next Gear Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Slide Info Over Dark Gradient */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2 pointer-events-none">
          <div className="max-w-xl">
            <h4 className="text-lg font-bold text-slate-100 drop-shadow-md flex items-center gap-2">
              {currentSlide.title}
            </h4>
            {currentSlide.caption && (
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 drop-shadow">
                {currentSlide.caption}
              </p>
            )}
            {activePiece && (
              <div className="mt-1 flex items-center gap-2 text-xs text-amber-300 font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>{activePiece.piece.name} ({activePiece.piece.monsterOrigin})</span>
                {activePiece.piece.layeredName && (
                  <span className="text-slate-400">· Layered: {activePiece.piece.layeredName}</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-950/70 px-2.5 py-1 rounded-full border border-slate-800 backdrop-blur-md pointer-events-auto">
            <span className="text-xs text-slate-400">
              {currentIndex + 1} / {slideList.length}
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnail & Piece Selector Navigation Bar */}
      {slideList.length > 1 && (
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          {slideList.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id || idx}
                id={`carousel-thumb-${idx}`}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <img
                  src={slide.url}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-md object-cover"
                />
                <span className="capitalize">{slide.category}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen High-Resolution Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Header */}
            <div className="flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  Fashion Showcase & Armor Gallery
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {fashionTitle} <span className="text-sm font-normal text-slate-400">({fashionTheme})</span>
                </h3>
              </div>
              <button
                id="btn-close-fullscreen-carousel"
                onClick={() => setIsFullscreen(false)}
                className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-all shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Central Stage */}
            <div className="relative flex-1 flex items-center justify-center my-4 max-h-[78vh]" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={currentSlide.id || currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={currentSlide.url}
                alt={currentSlide.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl border border-slate-800"
              />

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/90 hover:bg-amber-500 border border-slate-700 hover:border-amber-400 text-white hover:text-slate-950 transition-all shadow-2xl"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/90 hover:bg-amber-500 border border-slate-700 hover:border-amber-400 text-white hover:text-slate-950 transition-all shadow-2xl"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-3 z-10" onClick={(e) => e.stopPropagation()}>
              <div className="text-sm text-slate-300">
                <span className="font-semibold text-amber-300 capitalize">{currentSlide.category} View: </span>
                {currentSlide.caption || currentSlide.title}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Slide {currentIndex + 1} of {slideList.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
