import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Sword, 
  Sparkles, 
  Search, 
  Filter, 
  Zap, 
  Hammer, 
  Layers, 
  ArrowUpRight,
  BookOpen,
  Award
} from 'lucide-react';
import { WeaponType, GameTitle, ArmorPiece, WeaponDatabaseEntry, SkillDatabaseEntry } from '../types';
import { 
  WEAPONS_DATABASE, 
  ARMOR_HEAD_PIECES, 
  ARMOR_CHEST_PIECES, 
  ARMOR_ARMS_PIECES, 
  ARMOR_WAIST_PIECES, 
  ARMOR_LEGS_PIECES,
  SKILLS_DATABASE 
} from '../data/gearDatabase';
import { WEAPONS_DATA, GAMES_DATA } from '../data/monsterHunterData';

interface GearInfoPageProps {
  initialGame?: GameTitle;
  initialTab?: 'weapons' | 'armor' | 'skills';
  onNavigateToWorkshop?: (gearPieceName?: string) => void;
}

export const GearInfoPage: React.FC<GearInfoPageProps> = ({
  initialGame,
  initialTab = 'weapons',
  onNavigateToWorkshop,
}) => {
  const [activeTab, setActiveTab] = useState<'weapons' | 'armor' | 'skills'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeaponType, setSelectedWeaponType] = useState<WeaponType | 'all'>('all');
  const [selectedArmorSlot, setSelectedArmorSlot] = useState<'all' | 'head' | 'chest' | 'arms' | 'waist' | 'legs'>('all');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Filtered Weapons
  const filteredWeapons = useMemo(() => {
    return WEAPONS_DATABASE.filter((w) => {
      if (selectedWeaponType !== 'all' && w.weaponType !== selectedWeaponType) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = w.name.toLowerCase().includes(q);
        const matchesMonster = w.monsterOrigin.toLowerCase().includes(q);
        const matchesType = WEAPONS_DATA[w.weaponType].name.toLowerCase().includes(q);
        if (!matchesName && !matchesMonster && !matchesType) return false;
      }
      return true;
    });
  }, [selectedWeaponType, searchQuery]);

  // Combined and filtered Armor Pieces
  const allArmorPieces = useMemo(() => {
    const pieces: { piece: ArmorPiece; slot: string }[] = [];
    if (selectedArmorSlot === 'all' || selectedArmorSlot === 'head') {
      ARMOR_HEAD_PIECES.forEach((p) => pieces.push({ piece: p, slot: 'Head' }));
    }
    if (selectedArmorSlot === 'all' || selectedArmorSlot === 'chest') {
      ARMOR_CHEST_PIECES.forEach((p) => pieces.push({ piece: p, slot: 'Chest' }));
    }
    if (selectedArmorSlot === 'all' || selectedArmorSlot === 'arms') {
      ARMOR_ARMS_PIECES.forEach((p) => pieces.push({ piece: p, slot: 'Arms' }));
    }
    if (selectedArmorSlot === 'all' || selectedArmorSlot === 'waist') {
      ARMOR_WAIST_PIECES.forEach((p) => pieces.push({ piece: p, slot: 'Waist' }));
    }
    if (selectedArmorSlot === 'all' || selectedArmorSlot === 'legs') {
      ARMOR_LEGS_PIECES.forEach((p) => pieces.push({ piece: p, slot: 'Legs' }));
    }

    return pieces.filter(({ piece }) => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = piece.name.toLowerCase().includes(q);
        const matchesMonster = piece.monsterOrigin.toLowerCase().includes(q);
        const matchesSkill = piece.skills.some((s) => s.name.toLowerCase().includes(q));
        if (!matchesName && !matchesMonster && !matchesSkill) return false;
      }
      return true;
    });
  }, [selectedArmorSlot, searchQuery]);

  // Filtered Skills
  const filteredSkills = useMemo(() => {
    return SKILLS_DATABASE.filter((sk) => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = sk.name.toLowerCase().includes(q);
        const matchesDesc = sk.description.toLowerCase().includes(q);
        const matchesMonster = sk.foundOnMonsters.some((m) => m.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesMonster) return false;
      }
      return true;
    });
  }, [searchQuery]);

  const weaponKeys = Object.keys(WEAPONS_DATA) as WeaponType[];

  return (
    <div id="gear-info-page" className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
            Guild Armory & Blacksmith Archive
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Gear, Weapons & Skill Encyclopedia
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Browse weapon performance tiers, examine armor slot socket capacities and defense values, and explore level-by-level skill mechanics.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 rounded-2xl p-1.5 gap-2">
        <button
          onClick={() => setActiveTab('weapons')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'weapons'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sword className="w-4 h-4" />
          <span>Weapons Armory ({WEAPONS_DATABASE.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('armor')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'armor'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Armor Pieces Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'skills'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Skills Compendium</span>
        </button>
      </div>

      {/* Search & Sub-Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {activeTab === 'weapons' && (
          <select
            value={selectedWeaponType}
            onChange={(e) => setSelectedWeaponType(e.target.value as any)}
            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full sm:w-auto"
          >
            <option value="all">All 14 Weapon Classes</option>
            {weaponKeys.map((k) => (
              <option key={k} value={k}>
                {WEAPONS_DATA[k].name}
              </option>
            ))}
          </select>
        )}

        {activeTab === 'armor' && (
          <select
            value={selectedArmorSlot}
            onChange={(e) => setSelectedArmorSlot(e.target.value as any)}
            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full sm:w-auto"
          >
            <option value="all">All Armor Slots</option>
            <option value="head">Headgear Only</option>
            <option value="chest">Chestplates Only</option>
            <option value="arms">Vambraces / Arms Only</option>
            <option value="waist">Waist / Coils Only</option>
            <option value="legs">Legs / Greaves Only</option>
          </select>
        )}
      </div>

      {/* Tab 1: Weapons Grid */}
      {activeTab === 'weapons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWeapons.map((wp) => {
            const wInfo = WEAPONS_DATA[wp.weaponType];
            const gInfo = GAMES_DATA[wp.game];
            return (
              <div
                key={wp.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-950 border border-slate-800">
                    <img
                      src={wp.image}
                      alt={wp.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${gInfo.badgeColor}`}>
                        {gInfo.shortName}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-slate-700 font-bold">
                      {wp.sharpness} Sharpness
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      {wInfo.iconGlyph} {wInfo.name} • {wp.monsterOrigin}
                    </span>
                    <h4 className="text-base font-black text-white">{wp.name}</h4>
                  </div>

                  {/* Attributes Matrix */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[9px] text-slate-500 uppercase">Attack Raw</div>
                      <div className="font-bold text-white text-sm">{wp.attackRaw}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[9px] text-slate-500 uppercase">Affinity</div>
                      <div className="font-bold text-amber-400 text-sm">{wp.affinity}%</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[9px] text-slate-500 uppercase">Element</div>
                      <div className="font-bold text-sky-300 text-xs">
                        {wp.element !== 'None' ? `${wp.element} ${wp.elementValue}` : 'Pure Raw'}
                      </div>
                    </div>
                  </div>

                  {wp.specialTrait && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-medium">
                      ★ {wp.specialTrait}
                    </div>
                  )}
                </div>

                {onNavigateToWorkshop && (
                  <button
                    onClick={onNavigateToWorkshop}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Equip in Builds Workshop</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Armor Pieces Directory */}
      {activeTab === 'armor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allArmorPieces.map(({ piece, slot }, idx) => (
            <div
              key={`${piece.id || piece.name}-${idx}`}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={piece.image || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80'}
                    alt={piece.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase">
                        {slot}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Def {piece.defense}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate">{piece.name}</h4>
                    <p className="text-xs text-slate-400 truncate">{piece.monsterOrigin}</p>
                  </div>
                </div>

                {/* Intrinsic Skills */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase text-slate-500">Embedded Skills:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {piece.skills.map((sk) => (
                      <span
                        key={sk.name}
                        className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300"
                      >
                        {sk.name} +{sk.level}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sockets */}
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Decoration Sockets:</span>
                  <div className="flex gap-1">
                    {piece.slots && piece.slots.length > 0 ? (
                      piece.slots.map((s, sIdx) => (
                        <span key={sIdx} className="px-1.5 py-0.2 rounded bg-slate-950 border border-slate-700 text-white font-bold">
                          Lv{s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-600">None</span>
                    )}
                  </div>
                </div>

                {piece.description && (
                  <p className="text-xs text-slate-400 italic line-clamp-2">
                    "{piece.description}"
                  </p>
                )}
              </div>

              {onNavigateToWorkshop && (
                <button
                  onClick={onNavigateToWorkshop}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Equip in Builds Workshop</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Skills Compendium */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((sk) => (
            <div
              key={sk.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="text-base font-bold text-white">{sk.name}</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-amber-400 font-bold uppercase">
                  {sk.category.replace('_', ' ')} • Max Lv {sk.maxLevel}
                </span>
              </div>

              <p className="text-xs text-slate-300">{sk.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-850">
                <div className="text-[10px] font-mono uppercase text-slate-500">Skill Level Scaling:</div>
                <div className="space-y-1">
                  {sk.levelEffects.map((eff, effIdx) => (
                    <div key={effIdx} className="p-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 font-medium">
                      {eff}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Found on Armor: {sk.foundOnMonsters.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
