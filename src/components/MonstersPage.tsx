import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Search, 
  Shield, 
  Sword, 
  Sparkles, 
  Zap, 
  ChevronRight, 
  Info, 
  ArrowUpRight, 
  Layers, 
  X,
  Target,
  Award
} from 'lucide-react';
import { MonsterEntry, GameTitle, ElementType } from '../types';
import { MONSTERS_DATA } from '../data/monstersData';
import { GAMES_DATA } from '../data/monsterHunterData';

interface MonstersPageProps {
  initialGame?: GameTitle;
  initialMonsterName?: string;
  onNavigateToWorkshopWithMonster?: (monsterName: string) => void;
}

export const MonstersPage: React.FC<MonstersPageProps> = ({
  initialGame,
  initialMonsterName,
  onNavigateToWorkshopWithMonster,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialMonsterName || '');
  const [selectedGame, setSelectedGame] = useState<GameTitle | 'all'>(initialGame || 'all');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedWeakness, setSelectedWeakness] = useState<ElementType | 'all'>('all');
  
  const [activeMonster, setActiveMonster] = useState<MonsterEntry | null>(() => {
    if (initialMonsterName) {
      const found = MONSTERS_DATA.find((m) =>
        m.name.toLowerCase().includes(initialMonsterName.toLowerCase())
      );
      if (found) return found;
    }
    if (initialGame) {
      const gameMon = MONSTERS_DATA.find((m) => m.game === initialGame);
      if (gameMon) return gameMon;
    }
    return MONSTERS_DATA[0];
  });

  React.useEffect(() => {
    if (initialGame) {
      setSelectedGame(initialGame);
    }
  }, [initialGame]);

  React.useEffect(() => {
    if (initialMonsterName) {
      setSearchQuery(initialMonsterName);
      const found = MONSTERS_DATA.find((m) =>
        m.name.toLowerCase().includes(initialMonsterName.toLowerCase())
      );
      if (found) setActiveMonster(found);
    }
  }, [initialMonsterName]);

  // Unique species
  const allSpecies = useMemo(() => {
    return Array.from(new Set(MONSTERS_DATA.map((m) => m.species)));
  }, []);

  // Filtered Monsters
  const filteredMonsters = useMemo(() => {
    return MONSTERS_DATA.filter((m) => {
      if (selectedGame !== 'all' && m.game !== selectedGame) return false;
      if (selectedSpecies !== 'all' && m.species !== selectedSpecies) return false;
      if (selectedWeakness !== 'all') {
        const hasWeakness = m.weaknesses.some(
          (w) => w.element === selectedWeakness && w.rating > 0
        );
        if (!hasWeakness) return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesTitle = m.title.toLowerCase().includes(query);
        const matchesLore = m.lore.toLowerCase().includes(query);
        const matchesSpecies = m.species.toLowerCase().includes(query);
        const matchesMaterials = m.keyMaterials.some((mat) => mat.name.toLowerCase().includes(query));
        if (!matchesName && !matchesTitle && !matchesLore && !matchesSpecies && !matchesMaterials) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedGame, selectedSpecies, selectedWeakness]);

  const gameKeys = Object.keys(GAMES_DATA) as GameTitle[];

  return (
    <div id="monsters-page-container" className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
            Guild Ecological Compendium & Bestiary
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Monsters Database & Weakness Almanac
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Consult elemental hitzone damage thresholds, severable tail/horn break points, drop material rarities, and tactical hunting strategies across all Monster Hunter generations.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search monster by name, title, drop material..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Game Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Game Titles</option>
              {gameKeys.map((g) => (
                <option key={g} value={g}>
                  {GAMES_DATA[g].name}
                </option>
              ))}
            </select>
          </div>

          {/* Species Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Species</option>
              {allSpecies.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>

          {/* Element Weakness Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedWeakness}
              onChange={(e) => setSelectedWeakness(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Weakness (All)</option>
              <option value="Fire">Weak to Fire 🔥</option>
              <option value="Water">Weak to Water 💧</option>
              <option value="Thunder">Weak to Thunder ⚡</option>
              <option value="Ice">Weak to Ice ❄️</option>
              <option value="Dragon">Weak to Dragon 🐉</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Split View: Monster Grid (Left) + Detail Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Monster Cards Grid (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-slate-400 font-bold px-1">
            <span>Discovered Monsters ({filteredMonsters.length})</span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredMonsters.map((monster) => {
              const isSelected = activeMonster?.id === monster.id;
              const gInfo = GAMES_DATA[monster.game];
              return (
                <div
                  key={monster.id}
                  onClick={() => setActiveMonster(monster)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 shadow-lg ring-1 ring-amber-500/40'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={monster.image}
                      alt={monster.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white truncate">{monster.name}</h4>
                        <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold border ${gInfo.badgeColor}`}>
                          {gInfo.shortName}
                        </span>
                      </div>
                      <p className="text-xs text-amber-400 font-medium truncate">{monster.title}</p>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Threat: {'★'.repeat(Math.min(monster.threatLevel, 5))} ({monster.species})
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-amber-400 translate-x-1' : 'text-slate-600'}`} />
                </div>
              );
            })}

            {filteredMonsters.length === 0 && (
              <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400">
                No monsters match the search criteria.
              </div>
            )}
          </div>
        </div>

        {/* Selected Monster Detail Sheet (Right 7 Cols) */}
        {activeMonster ? (
          <div className="lg:col-span-7 rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 shadow-2xl space-y-6">
            {/* Header / Hero */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeMonster.image}
                  alt={activeMonster.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white">{activeMonster.name}</h3>
                    {activeMonster.japaneseName && (
                      <span className="text-xs font-mono text-slate-400">({activeMonster.japaneseName})</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-amber-400">{activeMonster.title}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{activeMonster.species}</span>
                    <span>•</span>
                    <span>Threat Lv {activeMonster.threatLevel}/10</span>
                    <span>•</span>
                    <span className={`px-2 py-0.2 rounded-full font-bold border text-[9px] ${GAMES_DATA[activeMonster.game].badgeColor}`}>
                      {GAMES_DATA[activeMonster.game].name}
                    </span>
                  </div>
                </div>
              </div>

              {onNavigateToWorkshopWithMonster && (
                <button
                  onClick={() => onNavigateToWorkshopWithMonster(activeMonster.name)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md self-start sm:self-auto shrink-0"
                >
                  <span>Equip Armor in Workshop</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Lore */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "{activeMonster.lore}"
            </div>

            {/* Elemental & Ailment Weaknesses Section */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Elemental Weaknesses & Hitzone Efficiency
              </div>

              <div className="grid grid-cols-5 gap-2 text-center">
                {['Fire', 'Water', 'Thunder', 'Ice', 'Dragon'].map((elName) => {
                  const weakInfo = activeMonster.weaknesses.find((w) => w.element === elName);
                  const stars = weakInfo?.rating || 0;
                  return (
                    <div
                      key={elName}
                      className={`p-2.5 rounded-xl border font-mono ${
                        stars >= 3
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : stars === 2
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          : stars === 1
                          ? 'bg-slate-950 border-slate-800 text-slate-300'
                          : 'bg-slate-950/60 border-slate-850 text-slate-600'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold">{elName}</div>
                      <div className="text-sm font-black mt-1">
                        {stars > 0 ? '★'.repeat(stars) : 'Immune'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Breakable Parts & Hunt Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  Breakable / Severable Parts
                </div>
                <div className="space-y-1">
                  {activeMonster.breakableParts.map((part) => (
                    <div key={part} className="flex items-center gap-1.5 text-xs text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{part}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Key Tactical Hunter Advice
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {activeMonster.huntTips.map((tip, idx) => (
                    <p key={idx} className="leading-snug">
                      • {tip}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Materials & Drop Rates */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Key Monster Drops & Carve Rates
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Material Name</th>
                      <th className="p-2.5">Rarity</th>
                      <th className="p-2.5">Obtained From</th>
                      <th className="p-2.5 text-right">Drop Chance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 bg-slate-900/60 font-medium">
                    {activeMonster.keyMaterials.map((mat) => (
                      <tr key={mat.name} className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold text-white">{mat.name}</td>
                        <td className="p-2.5 font-mono text-amber-400">Rarity {mat.rarity}</td>
                        <td className="p-2.5 text-slate-300">{mat.source}</td>
                        <td className="p-2.5 text-right font-mono text-amber-300 font-bold">{mat.dropRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
