import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Eye, 
  Shield, 
  Sword, 
  Zap, 
  Flame, 
  Droplet, 
  Snowflake, 
  Skull,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HunterBuild, ElementType } from '../types';
import { GAMES_DATA, WEAPONS_DATA } from '../data/monsterHunterData';

interface BuildCardProps {
  build: HunterBuild;
  onSelectBuild: (build: HunterBuild) => void;
  onOpenFashionCarousel: (build: HunterBuild) => void;
  onLikeBuild: (buildId: string) => void;
}

const getElementIcon = (element: ElementType) => {
  switch (element) {
    case 'Fire': return <Flame className="w-3.5 h-3.5 text-rose-400" />;
    case 'Water': return <Droplet className="w-3.5 h-3.5 text-sky-400" />;
    case 'Thunder': return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    case 'Ice': return <Snowflake className="w-3.5 h-3.5 text-cyan-300" />;
    case 'Dragon': return <Skull className="w-3.5 h-3.5 text-fuchsia-400" />;
    case 'Blast': return <Flame className="w-3.5 h-3.5 text-orange-400" />;
    default: return null;
  }
};

const getSharpnessColor = (sharpness?: string) => {
  switch (sharpness) {
    case 'Purple': return 'bg-purple-400 text-purple-950';
    case 'White': return 'bg-slate-100 text-slate-900';
    case 'Blue': return 'bg-blue-400 text-blue-950';
    case 'Green': return 'bg-emerald-400 text-emerald-950';
    default: return 'bg-amber-400 text-amber-950';
  }
};

export const BuildCard: React.FC<BuildCardProps> = ({
  build,
  onSelectBuild,
  onOpenFashionCarousel,
  onLikeBuild,
}) => {
  const gameInfo = GAMES_DATA[build.game] || GAMES_DATA.wilds;
  const weaponInfo = WEAPONS_DATA[build.weaponType] || WEAPONS_DATA.great_sword;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeBuild(build.id);
    // Trigger festive particle confetti
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.75 },
      colors: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981'],
    });
  };

  // Top 3 primary skills
  const featuredSkills = build.skills.slice(0, 4);

  return (
    <motion.div
      id={`build-card-${build.id}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelectBuild(build)}
      className="group relative flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/50 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden cursor-pointer transition-all"
    >
      {/* Top Image & Fashion Header */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
        <img
          src={build.showcaseHeroImage || build.gearImages?.[0]?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'}
          alt={build.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-md ${gameInfo.badgeColor}`}>
            {gameInfo.shortName}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {build.fashionRating.toFixed(1)} ★
            </span>
            {build.fashionDyes && (
              <div className="flex items-center p-1 rounded-full bg-slate-950/80 border border-slate-700 backdrop-blur-md">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/30"
                  style={{ backgroundColor: build.fashionDyes.primaryHex }}
                  title="Primary Armor Dye"
                />
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/30 -ml-1"
                  style={{ backgroundColor: build.fashionDyes.secondaryHex }}
                  title="Secondary Armor Dye"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Overlaid Gear / Weapon Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-slate-700 text-slate-200 text-xs font-medium backdrop-blur-md">
              <span>{weaponInfo.iconGlyph}</span>
              <span className="font-semibold">{weaponInfo.name}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium backdrop-blur-md">
              {build.huntingStyle}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenFashionCarousel(build);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all"
            title="Open Character Gear Carousel"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fashion</span>
          </button>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Title and Hunter Author */}
        <div>
          <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
            {build.title}
          </h3>
          <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
            <span className="truncate">Hunter: <strong className="text-slate-300 font-medium">{build.hunterName}</strong></span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {build.weaponName}
            </span>
          </div>
        </div>

        {/* Core Stats Bar */}
        <div className="grid grid-cols-4 gap-1.5 py-2 px-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Attack</div>
            <div className="font-bold text-slate-200 font-mono">{build.attackRaw}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Affinity</div>
            <div className={`font-bold font-mono ${build.affinity >= 80 ? 'text-amber-400' : 'text-slate-200'}`}>
              {build.affinity}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Element</div>
            <div className="font-bold font-mono text-slate-200 flex items-center justify-center gap-0.5">
              {getElementIcon(build.element)}
              <span>{build.elementValue || '—'}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Sharp</div>
            <div className="flex justify-center items-center mt-0.5">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getSharpnessColor(build.sharpness)}`}>
                {build.sharpness || 'Purple'}
              </span>
            </div>
          </div>
        </div>

        {/* Featured Skills Pills */}
        <div className="flex flex-wrap gap-1.5">
          {featuredSkills.map((sk) => (
            <span
              key={sk.name}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300"
            >
              <span className="text-amber-400 font-bold">Lv{sk.level}</span>
              <span>{sk.name}</span>
            </span>
          ))}
          {build.skills.length > 4 && (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-800/50 text-[10px] text-slate-400">
              +{build.skills.length - 4} more
            </span>
          )}
        </div>

        {/* Card Footer with Likes & Details link */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/50 hover:border-rose-500/40 transition-all"
            title="Like this build"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span className="font-mono font-semibold">{build.likes}</span>
          </button>

          <span className="flex items-center gap-1 text-amber-400 group-hover:translate-x-0.5 transition-transform font-medium">
            Inspect Build <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};
