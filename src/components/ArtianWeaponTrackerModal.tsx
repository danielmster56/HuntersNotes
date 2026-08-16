import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Sword, 
  Shield, 
  Zap, 
  Plus, 
  Trash2, 
  Star, 
  Flame, 
  RefreshCw, 
  Dices, 
  Layers, 
  Check, 
  Search, 
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Hammer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ArtianRollEntry, WeaponType, ElementType } from '../types';
import { WEAPONS_DATA } from '../data/monsterHunterData';
import { 
  ARTIAN_BASE_WEAPON_STATS, 
  ARTIAN_AWAKENING_PERKS, 
  getStoredArtianRolls, 
  saveArtianRollsToStorage 
} from '../data/artianTrackerData';

interface ArtianWeaponTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEquipToWorkshop?: (artianRoll: ArtianRollEntry) => void;
}

export const ArtianWeaponTrackerModal: React.FC<ArtianWeaponTrackerModalProps> = ({
  isOpen,
  onClose,
  onEquipToWorkshop,
}) => {
  const [rolls, setRolls] = useState<ArtianRollEntry[]>(() => getStoredArtianRolls());
  const [activeTab, setActiveTab] = useState<'tracker_list' | 'register_new'>('tracker_list');

  // Filter & Search State
  const [selectedWeaponFilter, setSelectedWeaponFilter] = useState<WeaponType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'highest_attack' | 'highest_affinity' | 'highest_element' | 'god_roll'>('recent');

  // Form State for Registering a New Maxed Artian Roll
  const [chosenWeaponType, setChosenWeaponType] = useState<WeaponType>('great_sword');
  const [customWeaponName, setCustomWeaponName] = useState(ARTIAN_BASE_WEAPON_STATS['great_sword'].defaultName);
  const [maxUpgradeLevel, setMaxUpgradeLevel] = useState<number>(10);
  
  const baseStats = ARTIAN_BASE_WEAPON_STATS[chosenWeaponType] || { baseRaw: 1200, baseAffinity: 0, defaultElement: 'Dragon' };
  const [bonusAttackRoll, setBonusAttackRoll] = useState<number>(120);
  const [bonusAffinityRoll, setBonusAffinityRoll] = useState<number>(20);
  const [elementType, setElementType] = useState<ElementType>(baseStats.defaultElement);
  const [elementRollValue, setElementRollValue] = useState<number>(380);
  const [sharpnessTier, setSharpnessTier] = useState<'Purple' | 'White' | 'Blue' | 'Green'>('Purple');
  const [sharpnessGaugeRoll, setSharpnessGaugeRoll] = useState<string>('+40 Hits Natural Purple');
  const [decoSlot1, setDecoSlot1] = useState<number>(4);
  const [decoSlot2, setDecoSlot2] = useState<number>(4);
  const [decoSlot3, setDecoSlot3] = useState<number>(2);
  const [defenseBonusRoll, setDefenseBonusRoll] = useState<number>(30);
  const [ancientAwakeningPerk, setAncientAwakeningPerk] = useState<string>(ARTIAN_AWAKENING_PERKS[0]);
  const [qualityGrade, setQualityGrade] = useState<ArtianRollEntry['qualityGrade']>('God Roll ★★★★★');
  const [hunterNotes, setHunterNotes] = useState<string>('');

  // Handle Weapon Type Change in Form
  const handleWeaponTypeChange = (wType: WeaponType) => {
    setChosenWeaponType(wType);
    const defaults = ARTIAN_BASE_WEAPON_STATS[wType];
    if (defaults) {
      setCustomWeaponName(defaults.defaultName);
      setElementType(defaults.defaultElement);
    }
  };

  // Quick Randomizer RNG Simulator (Simulates In-game Artian Max Reinforcement rolls)
  const handleSimulateRandomRoll = () => {
    const rawOptions = [40, 70, 95, 120, 150, 180];
    const affOptions = [5, 10, 15, 20, 25, 30];
    const elemOptions = [240, 300, 360, 420, 480];
    const elements: ElementType[] = ['Dragon', 'Thunder', 'Fire', 'Water', 'Ice', 'Blast', 'Poison', 'Paralysis', 'Sleep'];
    const sharpnessOptions = [
      '+50 Hits Purple Sharpness',
      '+40 Hits Natural Purple',
      '+30 Hits Purple Extension',
      'Max Lv White Sharpness Extended',
    ];
    const decoSlotsPresets = [
      [4, 4, 2],
      [4, 2, 1],
      [4, 4, 1],
      [4, 3, 2],
      [4, 4, 4],
    ];

    const randomRaw = rawOptions[Math.floor(Math.random() * rawOptions.length)];
    const randomAff = affOptions[Math.floor(Math.random() * affOptions.length)];
    const randomElem = elemOptions[Math.floor(Math.random() * elemOptions.length)];
    const randomElemType = elements[Math.floor(Math.random() * elements.length)];
    const randomSharp = sharpnessOptions[Math.floor(Math.random() * sharpnessOptions.length)];
    const randomDeco = decoSlotsPresets[Math.floor(Math.random() * decoSlotsPresets.length)];
    const randomDef = [0, 15, 25, 35, 50][Math.floor(Math.random() * 5)];
    const randomPerk = ARTIAN_AWAKENING_PERKS[Math.floor(Math.random() * ARTIAN_AWAKENING_PERKS.length)];

    setBonusAttackRoll(randomRaw);
    setBonusAffinityRoll(randomAff);
    setElementRollValue(randomElem);
    setElementType(randomElemType);
    setSharpnessGaugeRoll(randomSharp);
    setSharpnessTier(randomSharp.includes('Purple') ? 'Purple' : 'White');
    setDecoSlot1(randomDeco[0]);
    setDecoSlot2(randomDeco[1]);
    setDecoSlot3(randomDeco[2]);
    setDefenseBonusRoll(randomDef);
    setAncientAwakeningPerk(randomPerk);

    if (randomRaw >= 140 && randomAff >= 25) {
      setQualityGrade('God Roll ★★★★★');
    } else if (randomRaw >= 95) {
      setQualityGrade('Meta Tier ★★★★');
    } else if (randomRaw >= 70) {
      setQualityGrade('Great Roll ★★★');
    } else {
      setQualityGrade('Average ★★');
    }

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  // Save new roll
  const handleSaveRoll = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAttack = baseStats.baseRaw + Number(bonusAttackRoll || 0);
    const finalAff = baseStats.baseAffinity + Number(bonusAffinityRoll || 0);

    const newRoll: ArtianRollEntry = {
      id: `artian-roll-${Date.now()}`,
      weaponType: chosenWeaponType,
      weaponCustomName: customWeaponName.trim() || `${WEAPONS_DATA[chosenWeaponType].name} (Artian Max)`,
      maxUpgradeLevel: Number(maxUpgradeLevel) || 10,
      baseAttackRaw: baseStats.baseRaw,
      bonusAttackRoll: Number(bonusAttackRoll) || 0,
      finalAttackRaw: finalAttack,
      baseAffinity: baseStats.baseAffinity,
      bonusAffinityRoll: Number(bonusAffinityRoll) || 0,
      finalAffinity: finalAff,
      elementType,
      elementRollValue: Number(elementRollValue) || 0,
      sharpnessTier,
      sharpnessGaugeRoll: sharpnessGaugeRoll.trim() || '+30 Hits Purple',
      decorationSlotsRoll: [Number(decoSlot1) || 0, Number(decoSlot2) || 0, Number(decoSlot3) || 0].filter(Boolean),
      defenseBonusRoll: Number(defenseBonusRoll) || 0,
      ancientAwakeningPerk: ancientAwakeningPerk.trim() || ARTIAN_AWAKENING_PERKS[0],
      qualityGrade,
      recordedAt: new Date().toISOString().split('T')[0],
      hunterNotes: hunterNotes.trim() || 'Upgraded to max tier at Windward Plains Blacksmith.',
      isFavorite: false,
    };

    const updated = [newRoll, ...rolls];
    setRolls(updated);
    saveArtianRollsToStorage(updated);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
    });

    setActiveTab('tracker_list');
  };

  // Toggle favorite
  const handleToggleFavorite = (rollId: string) => {
    const updated = rolls.map((r) => (r.id === rollId ? { ...r, isFavorite: !r.isFavorite } : r));
    setRolls(updated);
    saveArtianRollsToStorage(updated);
  };

  // Delete roll
  const handleDeleteRoll = (rollId: string) => {
    const updated = rolls.filter((r) => r.id !== rollId);
    setRolls(updated);
    saveArtianRollsToStorage(updated);
  };

  // Filtered & Sorted Rolls
  const filteredRolls = rolls
    .filter((r) => {
      if (selectedWeaponFilter !== 'all' && r.weaponType !== selectedWeaponFilter) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = r.weaponCustomName.toLowerCase().includes(q);
        const matchesType = WEAPONS_DATA[r.weaponType]?.name.toLowerCase().includes(q);
        const matchesPerk = r.ancientAwakeningPerk.toLowerCase().includes(q);
        const matchesElem = r.elementType.toLowerCase().includes(q);
        const matchesNotes = r.hunterNotes.toLowerCase().includes(q);
        if (!matchesName && !matchesType && !matchesPerk && !matchesElem && !matchesNotes) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'highest_attack':
          return b.finalAttackRaw - a.finalAttackRaw;
        case 'highest_affinity':
          return b.finalAffinity - a.finalAffinity;
        case 'highest_element':
          return b.elementRollValue - a.elementRollValue;
        case 'god_roll':
          return b.qualityGrade.localeCompare(a.qualityGrade);
        case 'recent':
        default:
          return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
      }
    });

  if (!isOpen) return null;

  return (
    <div 
      id="artian-weapon-tracker-modal" 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/95 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
              <Dices className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 uppercase">
                  MH Wilds Tool
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Endgame Relic & Ancient Fragment Randomizer
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Artian Weapon Random Tracker</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                  {rolls.length} Recorded Rolls
                </span>
              </h2>
            </div>
          </div>

          <button
            id="btn-close-artian-tracker"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Header Tabs Navigation */}
        <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tracker_list')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'tracker_list'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>All Registered Rolls ({filteredRolls.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('register_new')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'register_new'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Register Max Artian Roll</span>
            </button>
          </div>

          {activeTab === 'register_new' && (
            <button
              type="button"
              onClick={handleSimulateRandomRoll}
              className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Dices className="w-4 h-4 text-purple-400" />
              <span>Simulate In-Game Random Roll (RNG)</span>
            </button>
          )}
        </div>

        {/* Tab 1: List / Collection of Registered Artian Rolls */}
        {activeTab === 'tracker_list' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {/* Top Weapon Icon Filter Bar (Interactive 14 Weapon Icons) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sword className="w-3.5 h-3.5 text-amber-400" />
                  Filter by Weapon Type:
                </label>
                {selectedWeaponFilter !== 'all' && (
                  <button
                    onClick={() => setSelectedWeaponFilter('all')}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Reset to All Weapons
                  </button>
                )}
              </div>

              {/* 14 Weapon Icons Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-15 gap-1.5 p-2 bg-slate-950 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setSelectedWeaponFilter('all')}
                  className={`p-2 rounded-xl text-center text-xs font-bold transition-all flex flex-col items-center justify-center ${
                    selectedWeaponFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">⚔️</span>
                  <span className="text-[10px] mt-0.5">All</span>
                </button>

                {(Object.keys(WEAPONS_DATA) as WeaponType[]).map((wKey) => {
                  const w = WEAPONS_DATA[wKey];
                  const isSelected = selectedWeaponFilter === wKey;
                  return (
                    <button
                      key={wKey}
                      onClick={() => setSelectedWeaponFilter(wKey)}
                      className={`p-2 rounded-xl text-center text-xs transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title={w.name}
                    >
                      <span className="text-base">{w.iconGlyph}</span>
                      <span className="text-[9px] truncate max-w-full font-mono mt-0.5">
                        {w.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search & Sort Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search weapon name, perk, element..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-[11px] text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="recent">Recently Recorded</option>
                  <option value="highest_attack">Highest Attack Raw</option>
                  <option value="highest_affinity">Highest Affinity %</option>
                  <option value="highest_element">Highest Element</option>
                  <option value="god_roll">God Rolls First</option>
                </select>
              </div>
            </div>

            {/* Rolls Cards Grid */}
            {filteredRolls.length === 0 ? (
              <div className="p-12 text-center bg-slate-950/60 rounded-3xl border border-slate-800 space-y-3">
                <Dices className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                <h3 className="text-base font-bold text-white">No Artian weapon rolls found</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Upgrade your Artian weapons to max level at the blacksmith and log your random rolls here to track your best endgame rolls.
                </p>
                <button
                  onClick={() => setActiveTab('register_new')}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg"
                >
                  Register First Max Roll
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRolls.map((roll) => {
                  const weaponInfo = WEAPONS_DATA[roll.weaponType];
                  return (
                    <motion.div
                      key={roll.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl bg-slate-950 border transition-all space-y-4 relative ${
                        roll.isFavorite
                          ? 'border-amber-500/60 bg-amber-950/10 shadow-lg shadow-amber-500/10'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                            {weaponInfo?.iconGlyph || '⚔️'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px] font-bold font-mono">
                                Max Lv.{roll.maxUpgradeLevel}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                roll.qualityGrade.includes('God')
                                  ? 'bg-amber-500 text-slate-950'
                                  : roll.qualityGrade.includes('Meta')
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {roll.qualityGrade}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-white mt-0.5">
                              {roll.weaponCustomName}
                            </h3>
                            <span className="text-[11px] text-slate-400">
                              {weaponInfo?.name} • {weaponInfo?.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleFavorite(roll.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              roll.isFavorite
                                ? 'bg-amber-500 text-slate-950 border-amber-400'
                                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                            }`}
                            title="Favorite Roll"
                          >
                            <Star className={`w-3.5 h-3.5 ${roll.isFavorite ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleDeleteRoll(roll.id)}
                            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-700 hover:text-rose-400 hover:border-rose-500/40 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Key Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Attack Raw</span>
                          <span className="text-sm font-black text-white font-mono">
                            {roll.finalAttackRaw}
                          </span>
                          <span className="text-[9px] text-amber-400 block font-mono">
                            (+{roll.bonusAttackRoll} roll)
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Affinity</span>
                          <span className="text-sm font-black text-amber-300 font-mono">
                            {roll.finalAffinity}%
                          </span>
                          <span className="text-[9px] text-slate-400 block font-mono">
                            (+{roll.bonusAffinityRoll}% roll)
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Element / Status</span>
                          <span className="text-xs font-bold text-sky-300 truncate block">
                            {roll.elementType} {roll.elementRollValue}
                          </span>
                          <span className="text-[9px] text-slate-400 block font-mono">
                            {roll.sharpnessTier} Sharpness
                          </span>
                        </div>
                      </div>

                      {/* Slots, Sharpness & Awakening Perk */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span className="text-slate-400">Decoration Slots:</span>
                          <div className="flex items-center gap-1">
                            {roll.decorationSlotsRoll.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-sky-400 font-mono text-[10px] font-bold"
                              >
                                [{s}]
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span className="text-slate-400">Sharpness Extension:</span>
                          <span className="font-mono text-purple-300 font-medium">
                            {roll.sharpnessGaugeRoll}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                          <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-0.5">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>Awakening Perk:</span>
                          </div>
                          <p className="text-slate-200 text-xs font-medium">
                            {roll.ancientAwakeningPerk}
                          </p>
                        </div>

                        {roll.hunterNotes && (
                          <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-900">
                            "{roll.hunterNotes}"
                          </p>
                        )}
                      </div>

                      {/* Bottom Action: Equip to Workshop */}
                      {onEquipToWorkshop && (
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-mono">
                            Logged: {roll.recordedAt}
                          </span>
                          <button
                            onClick={() => onEquipToWorkshop(roll)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Hammer className="w-3.5 h-3.5" />
                            <span>Equip to Builds Workshop</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Register New Max-Upgrade Artian Roll Form */}
        {activeTab === 'register_new' && (
          <form onSubmit={handleSaveRoll} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {/* Step 1: Weapon Class Selector (14 Icons with Selection) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sword className="w-4 h-4 text-amber-400" />
                  1. Select Artian Weapon Type ({WEAPONS_DATA[chosenWeaponType].name})
                </label>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  Base Raw: {baseStats.baseRaw} • Base Affinity: {baseStats.baseAffinity}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                {(Object.keys(WEAPONS_DATA) as WeaponType[]).map((wKey) => {
                  const w = WEAPONS_DATA[wKey];
                  const isSelected = chosenWeaponType === wKey;
                  return (
                    <button
                      type="button"
                      key={wKey}
                      onClick={() => handleWeaponTypeChange(wKey)}
                      className={`p-2.5 rounded-xl text-xs font-medium border transition-all flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg scale-105'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xl">{w.iconGlyph}</span>
                      <span className="text-[11px] truncate max-w-full font-semibold">{w.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Weapon Identity & Max Level */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 font-semibold mb-1 block">
                  Artian Weapon Custom Name
                </label>
                <input
                  type="text"
                  value={customWeaponName}
                  onChange={(e) => setCustomWeaponName(e.target.value)}
                  placeholder="e.g. Ark-Artian Zenith Cleaver"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">
                  Max Upgrade Level
                </label>
                <select
                  value={maxUpgradeLevel}
                  onChange={(e) => setMaxUpgradeLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value={10}>Max Level 10 (Apex Artian)</option>
                  <option value={8}>Level 8 (Master Tier)</option>
                  <option value={5}>Level 5 (High Rank Ancient)</option>
                </select>
              </div>
            </div>

            {/* Step 3: Rolled Random Stats */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  2. Randomizer Rolled Stats (From Blacksmith Awakening)
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Calculates effective raw & elements
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Attack Bonus Roll (+Raw)
                  </label>
                  <input
                    type="number"
                    value={bonusAttackRoll}
                    onChange={(e) => setBonusAttackRoll(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                    Total: {baseStats.baseRaw + Number(bonusAttackRoll || 0)}
                  </span>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Affinity Bonus Roll (+%)
                  </label>
                  <input
                    type="number"
                    value={bonusAffinityRoll}
                    onChange={(e) => setBonusAffinityRoll(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-400 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                    Total: {baseStats.baseAffinity + Number(bonusAffinityRoll || 0)}%
                  </span>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Element / Ailment
                  </label>
                  <select
                    value={elementType}
                    onChange={(e) => setElementType(e.target.value as ElementType)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {['None', 'Fire', 'Water', 'Thunder', 'Ice', 'Dragon', 'Blast', 'Poison', 'Paralysis', 'Sleep'].map((el) => (
                      <option key={el} value={el}>{el}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Element Roll Value
                  </label>
                  <input
                    type="number"
                    value={elementRollValue}
                    onChange={(e) => setElementRollValue(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-sky-400 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Sharpness & Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-900">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Sharpness Quality</label>
                  <select
                    value={sharpnessTier}
                    onChange={(e) => setSharpnessTier(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-purple-300 font-bold"
                  >
                    <option value="Purple">Purple Sharpness</option>
                    <option value="White">White Sharpness</option>
                    <option value="Blue">Blue Sharpness</option>
                    <option value="Green">Green Sharpness</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Gauge Extension Notes</label>
                  <input
                    type="text"
                    value={sharpnessGaugeRoll}
                    onChange={(e) => setSharpnessGaugeRoll(e.target.value)}
                    placeholder="e.g. +40 Hits Natural Purple"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Decoration Slots Roll</label>
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-center">
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={decoSlot1}
                      onChange={(e) => setDecoSlot1(Number(e.target.value))}
                      className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-sky-300 text-center font-bold"
                    />
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={decoSlot2}
                      onChange={(e) => setDecoSlot2(Number(e.target.value))}
                      className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-sky-300 text-center font-bold"
                    />
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={decoSlot3}
                      onChange={(e) => setDecoSlot3(Number(e.target.value))}
                      className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-sky-300 text-center font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Ancient Awakening Perk & Quality Verdict */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">
                  Ancient Awakening Perk
                </label>
                <select
                  value={ancientAwakeningPerk}
                  onChange={(e) => setAncientAwakeningPerk(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-300 focus:outline-none focus:border-amber-500 font-semibold"
                >
                  {ARTIAN_AWAKENING_PERKS.map((perk) => (
                    <option key={perk} value={perk}>{perk}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">
                  Roll Quality Verdict
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="God Roll ★★★★★">God Roll ★★★★★ (Max Stats)</option>
                  <option value="Meta Tier ★★★★">Meta Tier ★★★★ (High DPS)</option>
                  <option value="Great Roll ★★★">Great Roll ★★★ (Solid Alternative)</option>
                  <option value="Average ★★">Average ★★ (Workable)</option>
                  <option value="Reroll Needed ★">Reroll Needed ★ (Low Stats)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 font-semibold mb-1 block">
                  Hunter Notes & Roll Comments
                </label>
                <textarea
                  value={hunterNotes}
                  onChange={(e) => setHunterNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Crafted using Scarlet Forest Relic Fragments. Rolled supreme raw for True Charged Slash setups."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('tracker_list')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save & Register Max Artian Roll</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
