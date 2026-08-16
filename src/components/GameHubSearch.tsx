import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Sword, 
  Shield, 
  Flame, 
  Zap, 
  Hammer, 
  ArrowRight, 
  ExternalLink,
  Layers, 
  Eye, 
  Filter, 
  X,
  Target,
  ChevronRight,
  BookOpen,
  Dices
} from 'lucide-react';
import { 
  GameTitle, 
  HunterBuild, 
  MonsterEntry, 
  WeaponDatabaseEntry, 
  ArmorPiece, 
  SkillDatabaseEntry 
} from '../types';
import { GAMES_DATA, WEAPONS_DATA } from '../data/monsterHunterData';
import { MONSTERS_DATA } from '../data/monstersData';
import { 
  WEAPONS_DATABASE, 
  ARMOR_HEAD_PIECES, 
  ARMOR_CHEST_PIECES, 
  ARMOR_ARMS_PIECES, 
  ARMOR_WAIST_PIECES, 
  ARMOR_LEGS_PIECES, 
  SKILLS_DATABASE 
} from '../data/gearDatabase';

interface GameHubSearchProps {
  selectedGame: GameTitle;
  onNavigateToWorkshop: (gearPieceName?: string) => void;
  onNavigateToMonsters: (monsterName?: string) => void;
  onNavigateToGearInfo: (tab?: 'weapons' | 'armor' | 'skills') => void;
  onSelectBuild: (build: HunterBuild) => void;
  allBuilds: HunterBuild[];
  onOpenArtianTracker?: () => void;
}

export const GameHubSearch: React.FC<GameHubSearchProps> = ({
  selectedGame,
  onNavigateToWorkshop,
  onNavigateToMonsters,
  onNavigateToGearInfo,
  onSelectBuild,
  allBuilds,
  onOpenArtianTracker,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'monsters' | 'weapons' | 'armor' | 'skills' | 'builds'>('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const currentGame = GAMES_DATA[selectedGame];

  // Combine all armor pieces for global search
  const allArmorPieces = useMemo(() => {
    return [
      ...ARMOR_HEAD_PIECES,
      ...ARMOR_CHEST_PIECES,
      ...ARMOR_ARMS_PIECES,
      ...ARMOR_WAIST_PIECES,
      ...ARMOR_LEGS_PIECES,
    ];
  }, []);

  // Filter game-specific monsters
  const gameMonsters = useMemo(() => {
    return MONSTERS_DATA.filter((m) => m.game === selectedGame);
  }, [selectedGame]);

  // Filter game-specific builds
  const gameBuilds = useMemo(() => {
    return allBuilds.filter((b) => b.game === selectedGame);
  }, [allBuilds, selectedGame]);

  // Search Results Multi-Segment Computation
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return {
        monsters: gameMonsters.slice(0, 3),
        weapons: WEAPONS_DATABASE.slice(0, 3),
        armor: allArmorPieces.slice(0, 3),
        skills: SKILLS_DATABASE.slice(0, 3),
        builds: gameBuilds.slice(0, 3),
        totalMatches: 0,
      };
    }

    const matchedMonsters = MONSTERS_DATA.filter((m) => {
      return (
        m.name.toLowerCase().includes(query) ||
        m.species.toLowerCase().includes(query) ||
        m.title.toLowerCase().includes(query) ||
        m.keyMaterials.some((mat) => mat.name.toLowerCase().includes(query))
      );
    });

    const matchedWeapons = WEAPONS_DATABASE.filter((w) => {
      const weaponTypeName = WEAPONS_DATA[w.weaponType]?.name || '';
      return (
        w.name.toLowerCase().includes(query) ||
        w.monsterOrigin.toLowerCase().includes(query) ||
        weaponTypeName.toLowerCase().includes(query) ||
        w.element.toLowerCase().includes(query)
      );
    });

    const matchedArmor = allArmorPieces.filter((a) => {
      return (
        a.name.toLowerCase().includes(query) ||
        a.monsterOrigin.toLowerCase().includes(query) ||
        a.skills.some((s) => s.name.toLowerCase().includes(query))
      );
    });

    const matchedSkills = SKILLS_DATABASE.filter((s) => {
      return (
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.foundOnMonsters.some((m) => m.toLowerCase().includes(query))
      );
    });

    const matchedBuilds = allBuilds.filter((b) => {
      return (
        b.title.toLowerCase().includes(query) ||
        b.weaponName.toLowerCase().includes(query) ||
        b.hunterName.toLowerCase().includes(query) ||
        b.skills.some((s) => s.name.toLowerCase().includes(query))
      );
    });

    const totalMatches =
      matchedMonsters.length +
      matchedWeapons.length +
      matchedArmor.length +
      matchedSkills.length +
      matchedBuilds.length;

    return {
      monsters: matchedMonsters,
      weapons: matchedWeapons,
      armor: matchedArmor,
      skills: matchedSkills,
      builds: matchedBuilds,
      totalMatches,
    };
  }, [searchQuery, gameMonsters, gameBuilds, allArmorPieces, allBuilds]);

  const hasSearchText = searchQuery.trim().length > 0;

  return (
    <section id="game-hub-search-section" className="space-y-6">
      {/* Game Context Ribbon */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentGame.badgeColor}`}>
                  {currentGame.shortName} Database
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {gameMonsters.length} Monsters • {gameBuilds.length} Guild Builds
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Search Items, Weapons, Armor & Bestiary
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Quickly locate weapon trees, armor skills, monster weaknesses, carve rates, or community loadouts for {currentGame.name}.
              </p>
            </div>

            {selectedGame === 'wilds' && (
              <button
                id="btn-search-header-artian-tracker"
                onClick={() => onOpenArtianTracker?.()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/50 text-amber-300 text-xs font-bold transition-all shadow-md shrink-0"
              >
                <Dices className="w-4 h-4 text-amber-400" />
                <span>Artian Weapon random tracker</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
          </div>

          {/* Omni-Search Input Box */}
          <div className="relative">
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-amber-400" />
              </div>
              <input
                id="omni-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={`Search weapons, armor, monsters, or skills in ${currentGame.shortName} (e.g., Arkveld, Fatalis, Attack Boost)...`}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-950/90 border border-slate-700/80 focus:border-amber-500 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner transition-all"
              />
              {hasSearchText && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills below search */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mr-1">
                Filter:
              </span>
              {[
                { id: 'all', label: 'All Results' },
                { id: 'monsters', label: `Monsters (${searchResults.monsters.length})` },
                { id: 'weapons', label: `Weapons (${searchResults.weapons.length})` },
                { id: 'armor', label: `Armor Pieces (${searchResults.armor.length})` },
                { id: 'skills', label: `Skills (${searchResults.skills.length})` },
                { id: 'builds', label: `Builds (${searchResults.builds.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSearchCategory(tab.id as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    searchCategory === tab.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Search Result Dropdown / Panel */}
          {hasSearchText && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-4 rounded-2xl bg-slate-950 border border-amber-500/30 shadow-2xl space-y-4 max-h-[460px] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Search Results for "{searchQuery}" ({searchResults.totalMatches} matches)
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Clear Search
                </button>
              </div>

              {searchResults.totalMatches === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No matching monsters, weapons, armor pieces, skills, or builds found for "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Category: Monsters */}
                  {(searchCategory === 'all' || searchCategory === 'monsters') &&
                    searchResults.monsters.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-rose-400" />
                          Monsters & Threat Level ({searchResults.monsters.length})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.monsters.slice(0, 4).map((monster) => (
                            <div
                              key={monster.id}
                              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 flex items-center justify-between gap-3 transition-all"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={monster.image}
                                  alt={monster.name}
                                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-700"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-white truncate">
                                    {monster.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    {monster.species} • Threat ★{monster.threatLevel}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => onNavigateToMonsters(monster.name)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1"
                              >
                                <span>Hitzones</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Category: Weapons */}
                  {(searchCategory === 'all' || searchCategory === 'weapons') &&
                    searchResults.weapons.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Sword className="w-3.5 h-3.5 text-sky-400" />
                          Weapons & Armory ({searchResults.weapons.length})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.weapons.slice(0, 4).map((weapon) => (
                            <div
                              key={weapon.id}
                              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 flex items-center justify-between gap-3 transition-all"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate">
                                  {weapon.name}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {WEAPONS_DATA[weapon.weaponType]?.iconGlyph} {WEAPONS_DATA[weapon.weaponType]?.name} • Raw {weapon.attackRaw} • {weapon.element}
                                </div>
                              </div>
                              <button
                                onClick={() => onNavigateToWorkshop(weapon.name)}
                                className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-[11px] font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1"
                              >
                                <Hammer className="w-3 h-3" />
                                <span>Workshop</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Category: Armor Pieces */}
                  {(searchCategory === 'all' || searchCategory === 'armor') &&
                    searchResults.armor.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-amber-400" />
                          Armor Pieces ({searchResults.armor.length})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.armor.slice(0, 4).map((armor, idx) => (
                            <div
                              key={`${armor.name}-${idx}`}
                              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 flex items-center justify-between gap-3 transition-all"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate">
                                  {armor.name}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  Def {armor.defense} • {armor.skills.map((s) => `${s.name} Lv${s.level}`).join(', ')}
                                </div>
                              </div>
                              <button
                                onClick={() => onNavigateToWorkshop(armor.name)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1"
                              >
                                <Hammer className="w-3 h-3" />
                                <span>Equip</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Category: Skills */}
                  {(searchCategory === 'all' || searchCategory === 'skills') &&
                    searchResults.skills.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          Armor Skills & Decorations ({searchResults.skills.length})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.skills.slice(0, 4).map((skill) => (
                            <div
                              key={skill.id}
                              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 flex items-center justify-between gap-3 transition-all"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate">
                                  {skill.name} (Max Lv{skill.maxLevel})
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {skill.description}
                                </div>
                              </div>
                              <button
                                onClick={() => onNavigateToGearInfo('skills')}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1"
                              >
                                <span>Details</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Category: Builds */}
                  {(searchCategory === 'all' || searchCategory === 'builds') &&
                    searchResults.builds.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                          Community Builds ({searchResults.builds.length})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.builds.slice(0, 4).map((build) => (
                            <div
                              key={build.id}
                              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between gap-3 transition-all"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate">
                                  {build.title}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  By {build.hunterName} • Raw {build.attackRaw} • {build.affinity}% Affinity
                                </div>
                              </div>
                              <button
                                onClick={() => onSelectBuild(build)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Inspect</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </motion.div>
          )}

          {/* 4 Clean Gateway Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {/* Gateway 1: Builds Workshop */}
            <div
              onClick={() => onNavigateToWorkshop()}
              className="group p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all shadow-md hover:scale-[1.01]"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-2.5 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                <Hammer className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Builds Workshop
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Equip armor pieces on the central model, calculate skills, and fine-tune dye pigments.
              </p>
              <div className="mt-2 text-[11px] font-bold text-amber-400 flex items-center gap-1">
                <span>Open Workshop</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Gateway 2: Monster Bestiary */}
            <div
              onClick={() => onNavigateToMonsters()}
              className="group p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-rose-500/40 cursor-pointer transition-all shadow-md hover:scale-[1.01]"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-2.5 group-hover:bg-rose-500 group-hover:text-white transition-all">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                Monsters Bestiary
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Check elemental hitzone star ratings, carve drop tables, and severable monster parts.
              </p>
              <div className="mt-2 text-[11px] font-bold text-rose-400 flex items-center gap-1">
                <span>View Bestiary</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Gateway 3: Gear & Armory */}
            <div
              onClick={() => onNavigateToGearInfo('weapons')}
              className="group p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition-all shadow-md hover:scale-[1.01]"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-2.5 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                Gear & Armory Info
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Browse weapons for all 14 weapon types, armor pieces by defense slot, and skill levels.
              </p>
              <div className="mt-2 text-[11px] font-bold text-sky-400 flex items-center gap-1">
                <span>Inspect Armory</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Gateway 4: Skills Compendium */}
            <div
              onClick={() => onNavigateToGearInfo('skills')}
              className="group p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all shadow-md hover:scale-[1.01]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Skills & Decorations
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Explore offensive, defensive, and signature set bonus mechanics and level thresholds.
              </p>
              <div className="mt-2 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <span>View Skills</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
