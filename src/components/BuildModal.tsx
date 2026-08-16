import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Shield, 
  Sword, 
  Zap, 
  Flame, 
  Droplet, 
  Snowflake, 
  Skull,
  Layers,
  Palette,
  ExternalLink,
  BookOpen,
  Dices,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HunterBuild, ElementType, BuildSkill } from '../types';
import { GAMES_DATA, WEAPONS_DATA } from '../data/monsterHunterData';
import { GearCarousel } from './GearCarousel';

interface BuildModalProps {
  build: HunterBuild | null;
  isOpen: boolean;
  onClose: () => void;
  onLikeBuild: (buildId: string) => void;
  onForkBuild?: (build: HunterBuild) => void;
}

export const BuildModal: React.FC<BuildModalProps> = ({
  build,
  isOpen,
  onClose,
  onLikeBuild,
  onForkBuild,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'gear' | 'skills' | 'fashion' | 'guide'>('overview');

  if (!isOpen || !build) return null;

  const gameInfo = GAMES_DATA[build.game] || GAMES_DATA.wilds;
  const weaponInfo = WEAPONS_DATA[build.weaponType] || WEAPONS_DATA.great_sword;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(build, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    onLikeBuild(build.id);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  return (
    <AnimatePresence>
      <div 
        id="build-modal-overlay" 
        className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          id="build-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${gameInfo.badgeColor}`}>
                {gameInfo.name}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium">
                <span>{weaponInfo.iconGlyph}</span>
                <span>{weaponInfo.name}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-medium">
                Style: {build.huntingStyle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-like-modal"
                onClick={handleLike}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>{build.likes}</span>
              </button>

              <button
                id="btn-copy-build"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
                title="Copy build data JSON"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share / Export'}</span>
              </button>

              {onForkBuild && (
                <button
                  id="btn-fork-build"
                  onClick={() => {
                    onForkBuild(build);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
                  title="Load into Builder Studio"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Use as Template</span>
                </button>
              )}

              <button
                id="btn-close-modal"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6 scrollbar-thin">
            {/* Title & Lore Banner */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {build.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span>Hunter: <strong className="text-amber-300 font-semibold">{build.hunterName}</strong></span>
                  <span>·</span>
                  <span>Rank: <strong className="text-slate-200">{build.hunterRank || 'G-Rank Hunter'}</strong></span>
                  <span>·</span>
                  <span>Weapon: <strong className="text-slate-200">{build.weaponName}</strong></span>
                  <span>·</span>
                  <span>Created: {build.createdAt}</span>
                </div>
              </div>

              {/* Fashion Rating Badge */}
              <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-amber-500/30 self-start md:self-auto">
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Fashion Score</div>
                  <div className="text-xl font-bold text-amber-400 flex items-center justify-end gap-1">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {build.fashionRating.toFixed(1)} / 10
                  </div>
                </div>
                {build.fashionDyes && (
                  <div className="pl-3 border-l border-slate-800 flex flex-col items-center gap-1">
                    <div className="text-[10px] text-slate-400">Dyes</div>
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full border border-white/40 shadow-inner" style={{ backgroundColor: build.fashionDyes.primaryHex }} />
                      <span className="w-4 h-4 rounded-full border border-white/40 shadow-inner" style={{ backgroundColor: build.fashionDyes.secondaryHex }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
              {[
                { id: 'overview', label: 'Overview & Showcase', icon: <Layers className="w-4 h-4" /> },
                { id: 'gear', label: 'Armor & Socket Jewels', icon: <Shield className="w-4 h-4" /> },
                { id: 'skills', label: 'Skill Matrix & Set Bonuses', icon: <Zap className="w-4 h-4" /> },
                { id: 'fashion', label: 'Fashion & Dyes Gallery', icon: <Palette className="w-4 h-4" /> },
                { id: 'guide', label: "Hunter's Strategy Guide", icon: <BookOpen className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab 1: Overview & Hero Carousel */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* High-Resolution Gear Carousel Component */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    High-Resolution Character Gear & Fashion Carousel
                  </h3>
                  <GearCarousel
                    images={build.gearImages}
                    fashionTitle={build.fashionTitle}
                    fashionTheme={build.fashionTheme}
                    fashionRating={build.fashionRating}
                    dyes={build.fashionDyes}
                    gearPieces={{
                      head: build.head,
                      chest: build.chest,
                      arms: build.arms,
                      waist: build.waist,
                      legs: build.legs,
                    }}
                    weaponName={build.weaponName}
                  />
                </div>

                {/* Core Stats Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center items-center text-center">
                    <div className="text-xs text-slate-400 uppercase font-mono flex items-center gap-1 mb-1">
                      <Sword className="w-3.5 h-3.5 text-rose-400" /> Attack Power
                    </div>
                    <div className="text-2xl font-black text-white font-mono">{build.attackRaw}</div>
                    <div className="text-[11px] text-slate-500">True Raw Damage</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center items-center text-center">
                    <div className="text-xs text-slate-400 uppercase font-mono flex items-center gap-1 mb-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Affinity
                    </div>
                    <div className="text-2xl font-black text-amber-400 font-mono">{build.affinity}%</div>
                    <div className="text-[11px] text-slate-500">Critical Strike Rate</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center items-center text-center">
                    <div className="text-xs text-slate-400 uppercase font-mono flex items-center gap-1 mb-1">
                      <Shield className="w-3.5 h-3.5 text-sky-400" /> Defense Total
                    </div>
                    <div className="text-2xl font-black text-sky-300 font-mono">{build.defenseTotal}</div>
                    <div className="text-[11px] text-slate-500">Physical Damage Resist</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center items-center text-center">
                    <div className="text-xs text-slate-400 uppercase font-mono mb-1">Element & Sharpness</div>
                    <div className="text-lg font-bold text-white font-mono flex items-center gap-1.5">
                      <span>{build.element}</span>
                      <span className="text-amber-400">({build.elementValue || 0})</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-[10px] text-slate-400">Sharpness:</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        {build.sharpness || 'Purple'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Skills & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" /> Top Activated Skills
                    </h4>
                    <div className="space-y-2">
                      {build.skills.slice(0, 5).map((sk) => (
                        <div key={sk.name} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="font-semibold text-slate-200">{sk.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold font-mono">
                            Lv.{sk.level} / {sk.maxLevel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" /> Build Concept
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {build.description}
                    </p>
                    {build.switchSkillsOrArts && build.switchSkillsOrArts.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                          Signature Arts & Moves:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {build.switchSkillsOrArts.map((art) => (
                            <span key={art} className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 text-xs border border-amber-500/30">
                              {art}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Gear & Jewels */}
            {activeTab === 'gear' && (
              <div className="space-y-4">
                <div className="text-sm text-slate-400">
                  Comprehensive gear breakdown with base defense values, decoration jewel slots, and layered transmog cosmetics.
                </div>

                <div className="space-y-3">
                  {[
                    { slotLabel: 'Head Armor', piece: build.head },
                    { slotLabel: 'Chest Armor', piece: build.chest },
                    { slotLabel: 'Arm Vambraces', piece: build.arms },
                    { slotLabel: 'Waist Coil', piece: build.waist },
                    { slotLabel: 'Leg Greaves', piece: build.legs },
                  ].map(({ slotLabel, piece }) => (
                    <div key={slotLabel} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 shrink-0">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wider font-mono text-slate-400">{slotLabel}</div>
                          <h4 className="text-base font-bold text-slate-100">{piece.name}</h4>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Monster: <strong className="text-slate-300">{piece.monsterOrigin}</strong> · Def: {piece.defense}
                          </div>
                          {piece.layeredName && (
                            <div className="text-xs text-amber-400/90 mt-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Layered Cosmetic: {piece.layeredName}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Decoration Slots & Inherent Skills */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        {/* Jewel Slots */}
                        <div>
                          <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Slots & Jewels:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {piece.decorations && piece.decorations.length > 0 ? (
                              piece.decorations.map((dec, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-sky-300 font-mono border border-sky-500/30">
                                  💎 {dec}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500">No decorations slotted</span>
                            )}
                          </div>
                        </div>

                        {/* Inherent Skills */}
                        <div>
                          <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Inherent Skills:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {piece.skills.map((sk) => (
                              <span key={sk.name} className="px-2 py-0.5 rounded bg-amber-500/10 text-[11px] text-amber-300 font-medium border border-amber-500/20">
                                {sk.name} +{sk.level}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Talisman / Charm */}
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider font-mono text-amber-400">Talisman / Charm</div>
                        <h4 className="text-base font-bold text-amber-200">{build.talisman.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {build.talisman.skills.map((sk) => (
                            <span key={sk.name} className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-100 text-xs font-semibold">
                              {sk.name} +{sk.level}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {build.talisman.decorations && build.talisman.decorations.length > 0 ? (
                        build.talisman.decorations.map((dec, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs text-sky-300 font-mono border border-sky-500/40">
                            💎 {dec}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">Default Slots</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Skills Matrix */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                {/* Set Bonuses */}
                {build.setBonuses && build.setBonuses.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2">
                    <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Active Monster Set Bonuses & Special Mechanics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {build.setBonuses.map((bonus) => (
                        <div key={bonus} className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-500/40 text-xs font-semibold">
                          ✦ {bonus}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skill List with Visual Level Bars */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Full Active Skills Breakdown ({build.skills.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {build.skills.map((skill) => {
                      const isMaxed = skill.level >= skill.maxLevel;
                      return (
                        <div key={skill.name} className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-100 text-sm">{skill.name}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                              isMaxed
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-amber-400 border border-amber-500/30'
                            }`}>
                              Lv.{skill.level} / {skill.maxLevel} {isMaxed && 'MAX'}
                            </span>
                          </div>

                          {/* Skill Level Pip Dots */}
                          <div className="flex items-center gap-1.5">
                            {Array.from({ length: skill.maxLevel }).map((_, pipIdx) => (
                              <div
                                key={pipIdx}
                                className={`h-2 flex-1 rounded-full transition-all ${
                                  pipIdx < skill.level
                                    ? isMaxed ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-amber-500'
                                    : 'bg-slate-800'
                                }`}
                              />
                            ))}
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed">
                            {skill.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Fashion Gallery & Dyes */}
            {activeTab === 'fashion' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase font-mono text-amber-400 font-semibold">Fashion Lookbook Profile</div>
                    <h3 className="text-xl font-bold text-white mt-0.5">{build.fashionTitle}</h3>
                    <p className="text-xs text-slate-400 mt-1">Theme Concept: <span className="text-slate-200">{build.fashionTheme}</span></p>
                  </div>

                  {build.fashionDyes && (
                    <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <div>
                        <div className="text-[10px] text-slate-400 font-mono">Pigment Palette</div>
                        <div className="text-xs text-slate-200 font-medium">{build.fashionDyes.pigmentName || 'Custom Dyes'}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full border-2 border-white/60 shadow-md" style={{ backgroundColor: build.fashionDyes.primaryHex }} />
                          <span className="text-[9px] font-mono text-slate-400 mt-1">{build.fashionDyes.primaryHex}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="w-7 h-7 rounded-full border-2 border-white/60 shadow-md" style={{ backgroundColor: build.fashionDyes.secondaryHex }} />
                          <span className="text-[9px] font-mono text-slate-400 mt-1">{build.fashionDyes.secondaryHex}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* High Res Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {build.gearImages.map((img) => (
                    <div key={img.id} className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
                      <img
                        src={img.url}
                        alt={img.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold uppercase border border-amber-500/30">
                          {img.category} view
                        </span>
                        <h5 className="text-sm font-bold text-white mt-1">{img.title}</h5>
                        {img.caption && <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{img.caption}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Hunter's Strategy Guide */}
            {activeTab === 'guide' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Sword className="w-4 h-4 text-amber-400" /> Combat Positioning & Hunter Tips
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {build.hunterTips || 'Focus on maintaining weak point uptime and syncing switch skill cooldowns for optimal damage cycles.'}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/20 space-y-2">
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Signature Game Style: {gameInfo.name} ({build.huntingStyle})
                    </div>
                    <p className="text-xs text-slate-300">
                      Signature Era Mechanic: <span className="text-slate-100 font-medium">{gameInfo.signatureMechanic}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Build ID: {build.id}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
