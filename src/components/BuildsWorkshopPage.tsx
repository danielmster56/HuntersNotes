import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hammer, 
  Shield, 
  Sword, 
  Sparkles, 
  Palette, 
  Flame, 
  Zap, 
  RefreshCw, 
  Save, 
  Copy, 
  Check, 
  ChevronRight, 
  Layers, 
  Eye, 
  Maximize2,
  Info,
  Dna,
  Sliders,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  HunterBuild, 
  ArmorPiece, 
  ArmorDye, 
  GameTitle, 
  WeaponType, 
  ElementType,
  HunterProfile 
} from '../types';
import { 
  ARMOR_HEAD_PIECES, 
  ARMOR_CHEST_PIECES, 
  ARMOR_ARMS_PIECES, 
  ARMOR_WAIST_PIECES, 
  ARMOR_LEGS_PIECES, 
  WEAPONS_DATABASE 
} from '../data/gearDatabase';
import { GAMES_DATA, WEAPONS_DATA, PRESET_ARMOR_SETS } from '../data/monsterHunterData';

interface BuildsWorkshopPageProps {
  currentUser: HunterProfile | null;
  initialGame?: GameTitle;
  initialGearToEquip?: string;
  onSaveBuild: (build: HunterBuild) => void;
  onOpenFashionCarousel: (build: HunterBuild) => void;
}

type GearSlotType = 'head' | 'chest' | 'arms' | 'waist' | 'legs' | 'weapon';

export const BuildsWorkshopPage: React.FC<BuildsWorkshopPageProps> = ({
  currentUser,
  initialGame = 'wilds',
  initialGearToEquip,
  onSaveBuild,
  onOpenFashionCarousel,
}) => {
  // Current equipped gear on the central model
  const [selectedGame, setSelectedGame] = useState<GameTitle>(initialGame);

  // Sync with initialGame if it changes
  React.useEffect(() => {
    if (initialGame) {
      setSelectedGame(initialGame);
    }
  }, [initialGame]);

  const [buildTitle, setBuildTitle] = useState('My Custom Hunter Loadout');
  const [huntingStyle, setHuntingStyle] = useState('Focus Mode & Seikret');

  const [equippedHead, setEquippedHead] = useState<ArmorPiece>(ARMOR_HEAD_PIECES[0]);
  const [equippedChest, setEquippedChest] = useState<ArmorPiece>(ARMOR_CHEST_PIECES[0]);
  const [equippedArms, setEquippedArms] = useState<ArmorPiece>(ARMOR_ARMS_PIECES[0]);
  const [equippedWaist, setEquippedWaist] = useState<ArmorPiece>(ARMOR_WAIST_PIECES[0]);
  const [equippedLegs, setEquippedLegs] = useState<ArmorPiece>(ARMOR_LEGS_PIECES[0]);
  const [equippedWeapon, setEquippedWeapon] = useState(WEAPONS_DATABASE[0]);

  // Model Stance & Visual Options
  const [modelPose, setModelPose] = useState<'front' | 'combat' | 'sheathed'>('front');
  const [activeSlotModal, setActiveSlotModal] = useState<GearSlotType | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);

  // Fashion Dyes
  const [dyes, setDyes] = useState<ArmorDye>({
    primaryHex: '#d97706',
    secondaryHex: '#0284c7',
    pigmentName: 'Imperial Amber & Fulgur Cyan',
  });

  // Calculate live aggregate defense
  const totalDefense = useMemo(() => {
    return (
      (equippedHead.defense || 0) +
      (equippedChest.defense || 0) +
      (equippedArms.defense || 0) +
      (equippedWaist.defense || 0) +
      (equippedLegs.defense || 0) +
      (equippedWeapon.defenseBonus || 0)
    );
  }, [equippedHead, equippedChest, equippedArms, equippedWaist, equippedLegs, equippedWeapon]);

  // Calculate elemental resistances
  const totalResistances = useMemo(() => {
    const pieces = [equippedHead, equippedChest, equippedArms, equippedWaist, equippedLegs];
    return {
      fire: pieces.reduce((acc, p) => acc + (p.elementalResistances?.fire || 0), 0),
      water: pieces.reduce((acc, p) => acc + (p.elementalResistances?.water || 0), 0),
      thunder: pieces.reduce((acc, p) => acc + (p.elementalResistances?.thunder || 0), 0),
      ice: pieces.reduce((acc, p) => acc + (p.elementalResistances?.ice || 0), 0),
      dragon: pieces.reduce((acc, p) => acc + (p.elementalResistances?.dragon || 0), 0),
    };
  }, [equippedHead, equippedChest, equippedArms, equippedWaist, equippedLegs]);

  // Calculate aggregate skills
  const aggregateSkills = useMemo(() => {
    const skillMap = new Map<string, { level: number; maxLevel: number; category: any; description: string }>();

    const allSkills = [
      ...equippedHead.skills,
      ...equippedChest.skills,
      ...equippedArms.skills,
      ...equippedWaist.skills,
      ...equippedLegs.skills,
    ];

    allSkills.forEach((s) => {
      const existing = skillMap.get(s.name);
      if (existing) {
        existing.level = Math.min(existing.level + s.level, existing.maxLevel);
      } else {
        const isOffensive = ['Weakness Exploit', 'Critical Boost', 'Attack Boost', 'Critical Eye', 'Agitator', 'Burst', 'Chain Mastery'].includes(s.name);
        const isSetBonus = ['Blood Awakening', 'Frostcraft', 'Inheritance', 'Master\'s Touch', 'Punishing Draw'].includes(s.name);
        skillMap.set(s.name, {
          level: s.level,
          maxLevel: isSetBonus ? 3 : isOffensive ? (s.name === 'Attack Boost' ? 7 : 3) : 5,
          category: isSetBonus ? 'set_bonus' : isOffensive ? 'offensive' : 'defensive',
          description: `Active Armor skill level ${s.level}. Enhances combat attributes.`,
        });
      }
    });

    return Array.from(skillMap.entries()).map(([name, data]) => ({
      name,
      level: data.level,
      maxLevel: data.maxLevel,
      category: data.category,
      description: data.description,
    }));
  }, [equippedHead, equippedChest, equippedArms, equippedWaist, equippedLegs]);

  // Decoration sockets count
  const socketCounts = useMemo(() => {
    const allSlots = [
      ...(equippedHead.slots || []),
      ...(equippedChest.slots || []),
      ...(equippedArms.slots || []),
      ...(equippedWaist.slots || []),
      ...(equippedLegs.slots || []),
      ...(equippedWeapon.slots || []),
    ];
    return {
      lv4: allSlots.filter((s) => s === 4).length,
      lv3: allSlots.filter((s) => s === 3).length,
      lv2: allSlots.filter((s) => s === 2).length,
      lv1: allSlots.filter((s) => s === 1).length,
      total: allSlots.length,
    };
  }, [equippedHead, equippedChest, equippedArms, equippedWaist, equippedLegs, equippedWeapon]);

  // Handle Preset Set Quick Equip
  const handleEquipPreset = (presetName: string) => {
    if (presetName.includes('Arkveld')) {
      setEquippedHead(ARMOR_HEAD_PIECES[0]);
      setEquippedChest(ARMOR_CHEST_PIECES[0]);
      setEquippedArms(ARMOR_ARMS_PIECES[0]);
      setEquippedWaist(ARMOR_WAIST_PIECES[0]);
      setEquippedLegs(ARMOR_LEGS_PIECES[0]);
      setEquippedWeapon(WEAPONS_DATABASE[0]);
      setDyes({ primaryHex: '#e2e8f0', secondaryHex: '#d97706', pigmentName: 'Arkveld Spectral Glow' });
    } else if (presetName.includes('Fatalis')) {
      setEquippedHead(ARMOR_HEAD_PIECES[2]);
      setEquippedChest(ARMOR_CHEST_PIECES[2]);
      setEquippedArms(ARMOR_ARMS_PIECES[2]);
      setEquippedWaist(ARMOR_WAIST_PIECES[2]);
      setEquippedLegs(ARMOR_LEGS_PIECES[2]);
      setEquippedWeapon(WEAPONS_DATABASE[1]);
      setDyes({ primaryHex: '#0f172a', secondaryHex: '#dc2626', pigmentName: 'Fatalis Dragon Ember' });
    } else if (presetName.includes('Malzeno')) {
      setEquippedHead(ARMOR_HEAD_PIECES[1]);
      setEquippedChest(ARMOR_CHEST_PIECES[1]);
      setEquippedArms(ARMOR_ARMS_PIECES[1]);
      setEquippedWaist(ARMOR_WAIST_PIECES[1]);
      setEquippedLegs(ARMOR_LEGS_PIECES[1]);
      setEquippedWeapon(WEAPONS_DATABASE[2]);
      setDyes({ primaryHex: '#f8fafc', secondaryHex: '#991b1b', pigmentName: 'Primordial Silver Royal' });
    }
  };

  // Randomize Pieces for fun
  const handleRandomize = () => {
    setEquippedHead(ARMOR_HEAD_PIECES[Math.floor(Math.random() * ARMOR_HEAD_PIECES.length)]);
    setEquippedChest(ARMOR_CHEST_PIECES[Math.floor(Math.random() * ARMOR_CHEST_PIECES.length)]);
    setEquippedArms(ARMOR_ARMS_PIECES[Math.floor(Math.random() * ARMOR_ARMS_PIECES.length)]);
    setEquippedWaist(ARMOR_WAIST_PIECES[Math.floor(Math.random() * ARMOR_WAIST_PIECES.length)]);
    setEquippedLegs(ARMOR_LEGS_PIECES[Math.floor(Math.random() * ARMOR_LEGS_PIECES.length)]);
    setEquippedWeapon(WEAPONS_DATABASE[Math.floor(Math.random() * WEAPONS_DATABASE.length)]);
  };

  // Convert current equipped setup to HunterBuild format
  const currentConstructedBuild: HunterBuild = useMemo(() => {
    return {
      id: `workshop-build-${Date.now()}`,
      title: buildTitle,
      hunterName: currentUser?.hunterName || 'Guild Workshop Hunter',
      hunterRank: `HR ${currentUser?.hunterRank || 100}`,
      game: selectedGame,
      weaponType: equippedWeapon.weaponType,
      weaponName: equippedWeapon.name,
      weaponImage: equippedWeapon.image,
      element: equippedWeapon.element,
      elementValue: equippedWeapon.elementValue,
      attackRaw: equippedWeapon.attackRaw,
      affinity: equippedWeapon.affinity,
      defenseTotal: totalDefense,
      sharpness: equippedWeapon.sharpness,
      huntingStyle: huntingStyle as any,
      playstyleCategory: 'Meta Raw',
      head: equippedHead,
      chest: equippedChest,
      arms: equippedArms,
      waist: equippedWaist,
      legs: equippedLegs,
      talisman: {
        name: 'Fatalis Heart Talisman',
        skills: [{ name: 'Attack Boost', level: 2 }],
        slots: [4, 1, 1],
        decorations: ['Attack Jewel+ 4'],
      },
      skills: aggregateSkills,
      setBonuses: [
        equippedHead.monsterOrigin.includes('Arkveld') ? 'Chain Mastery (Spectral Whip Sync)' : '',
        equippedChest.monsterOrigin.includes('Fatalis') ? 'Transcendence (All Skill Caps Unlocked)' : '',
        equippedArms.monsterOrigin.includes('Malzeno') ? 'Blood Awakening (Lifesteal Attack Burst)' : '',
      ].filter(Boolean),
      fashionTitle: `${equippedHead.monsterOrigin.split(' ')[0]} / ${equippedChest.monsterOrigin.split(' ')[0]} Hybrid Set`,
      fashionDyes: dyes,
      fashionTheme: 'Workshop Custom Mix',
      fashionRating: 9.8,
      gearImages: [
        {
          id: 'workshop-shot-1',
          title: 'Full Armor Set Showcase',
          category: 'full',
          url: equippedChest.image || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
          caption: `Custom crafted set combining ${equippedHead.name} with ${equippedChest.name}.`,
        },
      ],
      showcaseHeroImage: equippedChest.image || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
      description: `Workshop tailored loadout featuring ${equippedWeapon.name} with ${totalDefense} total defense and ${aggregateSkills.length} active skills.`,
      hunterTips: 'Optimal for aggressive monster head focus strikes. Keep sharpness maintained.',
      likes: 12,
      createdAt: new Date().toISOString().split('T')[0],
      tags: [selectedGame.toUpperCase(), equippedWeapon.name, 'Workshop Custom', 'High Affinity'],
      isCustom: true,
    };
  }, [
    buildTitle,
    currentUser,
    selectedGame,
    huntingStyle,
    equippedHead,
    equippedChest,
    equippedArms,
    equippedWaist,
    equippedLegs,
    equippedWeapon,
    totalDefense,
    aggregateSkills,
    dyes,
  ]);

  const handleSave = () => {
    onSaveBuild(currentConstructedBuild);
    setSaveSuccessNotification(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setSaveSuccessNotification(false), 3500);
  };

  const handleCopySummary = () => {
    const text = `Monster Hunter Build: ${buildTitle}\nWeapon: ${equippedWeapon.name} (Raw ${equippedWeapon.attackRaw}, Affinity ${equippedWeapon.affinity}%)\nArmor: ${equippedHead.name} / ${equippedChest.name} / ${equippedArms.name} / ${equippedWaist.name} / ${equippedLegs.name}\nTotal Defense: ${totalDefense}\nKey Skills: ${aggregateSkills.map(s => `${s.name} Lv${s.level}`).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div id="builds-workshop-page" className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black">
            <Hammer className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                Interactive Armor Model Studio
              </span>
              <span className="text-xs text-slate-400">Click any gear piece to swap onto the center model</span>
            </div>
            <input
              type="text"
              value={buildTitle}
              onChange={(e) => setBuildTitle(e.target.value)}
              className="text-lg sm:text-xl font-black text-white bg-transparent border-b border-dashed border-slate-700 focus:border-amber-500 focus:outline-none tracking-tight mt-1"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            title="Randomize Armor Pieces"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Randomize</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNotification ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={() => onOpenFashionCarousel(currentConstructedBuild)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all border border-amber-500/40"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Lookbook</span>
          </button>

          <button
            id="btn-workshop-save"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 transition-all"
          >
            <Save className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Save to Hub</span>
          </button>
        </div>
      </div>

      {saveSuccessNotification && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Build saved to your personal & guild collection!</span>
          </div>
        </div>
      )}

      {/* Preset Fast Equips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        <span className="text-[11px] font-mono uppercase text-slate-400 font-bold shrink-0">
          Quick Equip Full Sets:
        </span>
        <button
          onClick={() => handleEquipPreset('Arkveld')}
          className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold shrink-0"
        >
          Arkveld Wraith (Wilds)
        </button>
        <button
          onClick={() => handleEquipPreset('Fatalis')}
          className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold shrink-0"
        >
          Fatalis Dragon (Iceborne)
        </button>
        <button
          onClick={() => handleEquipPreset('Malzeno')}
          className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold shrink-0"
        >
          Primordial Malzeno (Sunbreak)
        </button>
      </div>

      {/* 3-Column Studio Grid: Left Slots | Center Hunter Model | Right Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Slots 1-3: Head, Chest, Arms, Weapon) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5 px-1">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            Upper Armor & Weapon
          </div>

          {/* Weapon Slot Card */}
          <div
            onClick={() => setActiveSlotModal('weapon')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all hover:bg-slate-850 group space-y-1.5"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-amber-400 font-bold uppercase">Weapon Class</span>
              <span className="text-slate-500 group-hover:text-amber-300">Click to Swap →</span>
            </div>
            <div className="flex items-center gap-2.5">
              <img
                src={equippedWeapon.image}
                alt={equippedWeapon.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                  {equippedWeapon.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Raw {equippedWeapon.attackRaw} • {equippedWeapon.affinity}% Aff
                </div>
              </div>
            </div>
          </div>

          {/* Head Slot Card */}
          <div
            onClick={() => setActiveSlotModal('head')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all hover:bg-slate-850 group space-y-1.5"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-amber-400 font-bold uppercase">Head / Helmet</span>
              <span className="text-slate-500 group-hover:text-amber-300">Swap →</span>
            </div>
            <div className="flex items-center gap-2.5">
              <img
                src={equippedHead.image}
                alt={equippedHead.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                  {equippedHead.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Def {equippedHead.defense} • {equippedHead.monsterOrigin}
                </div>
              </div>
            </div>
          </div>

          {/* Chest Slot Card */}
          <div
            onClick={() => setActiveSlotModal('chest')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all hover:bg-slate-850 group space-y-1.5"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-amber-400 font-bold uppercase">Chest / Cuirass</span>
              <span className="text-slate-500 group-hover:text-amber-300">Swap →</span>
            </div>
            <div className="flex items-center gap-2.5">
              <img
                src={equippedChest.image}
                alt={equippedChest.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                  {equippedChest.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Def {equippedChest.defense} • {equippedChest.monsterOrigin}
                </div>
              </div>
            </div>
          </div>

          {/* Arms Slot Card */}
          <div
            onClick={() => setActiveSlotModal('arms')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all hover:bg-slate-850 group space-y-1.5"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-amber-400 font-bold uppercase">Arms / Vambraces</span>
              <span className="text-slate-500 group-hover:text-amber-300">Swap →</span>
            </div>
            <div className="flex items-center gap-2.5">
              <img
                src={equippedArms.image}
                alt={equippedArms.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                  {equippedArms.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Def {equippedArms.defense} • {equippedArms.monsterOrigin}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: The Visual Character Model Stage */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-amber-500/40 p-4 sm:p-6 min-h-[500px] flex flex-col justify-between shadow-2xl">
            {/* Ambient Backlight Reactive to Dyes */}
            <div
              className="absolute inset-0 opacity-20 blur-3xl pointer-events-none transition-colors duration-500"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${dyes.primaryHex} 0%, ${dyes.secondaryHex} 60%, transparent 80%)`,
              }}
            />

            {/* Model Stage Top Bar: Stance Controls & Dye Badge */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs font-mono text-amber-400">
                <Dna className="w-3.5 h-3.5" />
                <span>Equipped Model Preview</span>
              </div>

              {/* Dyes Color Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 backdrop-blur-md">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] text-slate-300 font-mono">{dyes.pigmentName}</span>
                <span className="w-3 h-3 rounded-full border border-white/60 shadow-inner" style={{ backgroundColor: dyes.primaryHex }} />
                <span className="w-3 h-3 rounded-full border border-white/60 shadow-inner" style={{ backgroundColor: dyes.secondaryHex }} />
              </div>
            </div>

            {/* Main Center Character Visual Stage */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center py-4">
              <div className="relative w-72 sm:w-80 h-96 flex items-center justify-center">
                {/* Character Armor Visual */}
                <motion.div
                  key={`${equippedHead.id}-${equippedChest.id}-${equippedArms.id}-${equippedWaist.id}-${equippedLegs.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950/70"
                >
                  <img
                    src={equippedChest.image || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=85'}
                    alt="Hunter Model"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Visual Armor Glow Overlays */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-25"
                    style={{
                      backgroundImage: `linear-gradient(to top, ${dyes.secondaryHex}, ${dyes.primaryHex})`,
                    }}
                  />

                  {/* Interactive Floating Hotspot Tags on the Hunter Body */}
                  <button
                    onClick={() => setActiveSlotModal('head')}
                    className="absolute top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-white text-[10px] font-bold border border-amber-500/60 shadow-lg backdrop-blur-md flex items-center gap-1 transition-all"
                  >
                    <span>{equippedHead.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-amber-400 opacity-80">(Head)</span>
                  </button>

                  <button
                    onClick={() => setActiveSlotModal('chest')}
                    className="absolute top-28 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-white text-[10px] font-bold border border-amber-500/60 shadow-lg backdrop-blur-md flex items-center gap-1 transition-all"
                  >
                    <span>{equippedChest.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-amber-400 opacity-80">(Chest)</span>
                  </button>

                  <button
                    onClick={() => setActiveSlotModal('waist')}
                    className="absolute top-52 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-white text-[10px] font-bold border border-amber-500/60 shadow-lg backdrop-blur-md flex items-center gap-1 transition-all"
                  >
                    <span>{equippedWaist.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-amber-400 opacity-80">(Waist)</span>
                  </button>

                  <button
                    onClick={() => setActiveSlotModal('legs')}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-white text-[10px] font-bold border border-amber-500/60 shadow-lg backdrop-blur-md flex items-center gap-1 transition-all"
                  >
                    <span>{equippedLegs.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-amber-400 opacity-80">(Legs)</span>
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Bottom Dye Color Swatches Palette Bar */}
            <div className="relative z-10 p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Armor Dyes:</span>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { name: 'Imperial Amber & Fulgur Cyan', p: '#d97706', s: '#0284c7' },
                  { name: 'Crimson Dragon & Nightfall', p: '#dc2626', s: '#0f172a' },
                  { name: 'Celestial Starlight Blue & Gold', p: '#3b82f6', s: '#f59e0b' },
                  { name: 'Pure Platinum Silver & Ruby', p: '#e2e8f0', s: '#991b1b' },
                  { name: 'Venom Emerald & Black', p: '#059669', s: '#18181b' },
                ].map((dyePreset) => (
                  <button
                    key={dyePreset.name}
                    onClick={() =>
                      setDyes({
                        primaryHex: dyePreset.p,
                        secondaryHex: dyePreset.s,
                        pigmentName: dyePreset.name,
                      })
                    }
                    className="relative p-1 rounded-xl border border-slate-700 hover:border-amber-400 transition-all flex items-center gap-1"
                    title={dyePreset.name}
                  >
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: dyePreset.p }} />
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: dyePreset.s }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Lower Slots: Waist, Legs & Live Stat Aggregation) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Waist Slot Card */}
          <div
            onClick={() => setActiveSlotModal('waist')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all hover:bg-slate-850 group space-y-1.5"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-amber-400 font-bold uppercase">Waist / Coil</span>
              <span className="text-slate-500 group-hover:text-amber-300">Swap →</span>
            </div>
            <div className="flex items-center gap-2.5">
              <img
                src={equippedWaist.image}
                alt={equippedWaist.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                  {equippedWaist.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Def {equippedWaist.defense} • {equippedWaist.monsterOrigin}
                </div>
              </div>
            </div>
          </div>

          {/* Legs Slot Card */}
          <div
            onClick={() => setActiveSlotModal('legs')}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all hover:bg-slate-850 group space-y-1.5"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-amber-400 font-bold uppercase">Legs / Greaves</span>
              <span className="text-slate-500 group-hover:text-amber-300">Swap →</span>
            </div>
            <div className="flex items-center gap-2.5">
              <img
                src={equippedLegs.image}
                alt={equippedLegs.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                  {equippedLegs.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Def {equippedLegs.defense} • {equippedLegs.monsterOrigin}
                </div>
              </div>
            </div>
          </div>

          {/* Live Stat Matrix */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center justify-between">
              <span>Live Set Attributes</span>
              <span className="text-amber-400 font-bold">Total Def {totalDefense}</span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Raw Attack</div>
                <div className="text-base font-bold text-white font-mono">{equippedWeapon.attackRaw}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Affinity</div>
                <div className="text-base font-bold text-amber-400 font-mono">{equippedWeapon.affinity}%</div>
              </div>
            </div>

            {/* Elemental Resistances */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Elemental Resistances</div>
              <div className="grid grid-cols-5 gap-1 text-center font-mono text-[11px]">
                <div className="p-1 rounded bg-slate-950 border border-slate-800">
                  <div className="text-red-400 text-[10px]">Fire</div>
                  <div className={totalResistances.fire >= 0 ? 'text-slate-200' : 'text-rose-400'}>{totalResistances.fire}</div>
                </div>
                <div className="p-1 rounded bg-slate-950 border border-slate-800">
                  <div className="text-sky-400 text-[10px]">Water</div>
                  <div className={totalResistances.water >= 0 ? 'text-slate-200' : 'text-rose-400'}>{totalResistances.water}</div>
                </div>
                <div className="p-1 rounded bg-slate-950 border border-slate-800">
                  <div className="text-yellow-400 text-[10px]">Thun</div>
                  <div className={totalResistances.thunder >= 0 ? 'text-slate-200' : 'text-rose-400'}>{totalResistances.thunder}</div>
                </div>
                <div className="p-1 rounded bg-slate-950 border border-slate-800">
                  <div className="text-cyan-400 text-[10px]">Ice</div>
                  <div className={totalResistances.ice >= 0 ? 'text-slate-200' : 'text-rose-400'}>{totalResistances.ice}</div>
                </div>
                <div className="p-1 rounded bg-slate-950 border border-slate-800">
                  <div className="text-purple-400 text-[10px]">Drag</div>
                  <div className={totalResistances.dragon >= 0 ? 'text-slate-200' : 'text-rose-400'}>{totalResistances.dragon}</div>
                </div>
              </div>
            </div>

            {/* Socket Breakdown */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Decoration Sockets:</div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-amber-400 font-bold">Lv4: {socketCounts.lv4}</span>
                <span className="text-sky-400 font-bold">Lv3: {socketCounts.lv3}</span>
                <span className="text-emerald-400 font-bold">Lv2: {socketCounts.lv2}</span>
                <span className="text-slate-400 font-bold">Lv1: {socketCounts.lv1}</span>
              </div>
            </div>

            {/* Active Skills List */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase flex items-center justify-between">
                <span>Active Skills ({aggregateSkills.length})</span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin pr-1">
                {aggregateSkills.map((sk) => (
                  <div key={sk.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                    <span className="font-semibold text-slate-200 truncate">{sk.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">
                      Lv {sk.level}/{sk.maxLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Piece Selection Modal / Drawer */}
      <AnimatePresence>
        {activeSlotModal && (
          <div
            id="slot-picker-modal"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveSlotModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Hammer className="w-5 h-5 text-amber-400" />
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                    Select {activeSlotModal.toUpperCase()} Piece for Center Model
                  </h4>
                </div>
                <button
                  onClick={() => setActiveSlotModal(null)}
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold"
                >
                  Close
                </button>
              </div>

              <div className="overflow-y-auto space-y-2.5 flex-1 pr-1 scrollbar-thin">
                {activeSlotModal === 'weapon' &&
                  WEAPONS_DATABASE.map((wp) => (
                    <div
                      key={wp.id}
                      onClick={() => {
                        setEquippedWeapon(wp);
                        setActiveSlotModal(null);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        equippedWeapon.id === wp.id
                          ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={wp.image} alt={wp.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <div className="text-sm font-bold text-white">{wp.name}</div>
                          <div className="text-xs text-slate-400">
                            {WEAPONS_DATA[wp.weaponType].name} • {wp.monsterOrigin}
                          </div>
                          <div className="text-[11px] text-amber-400 font-mono">
                            Raw {wp.attackRaw} • {wp.affinity}% Affinity • {wp.sharpness} Sharpness
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold">
                        Equip
                      </button>
                    </div>
                  ))}

                {activeSlotModal === 'head' &&
                  ARMOR_HEAD_PIECES.map((piece) => (
                    <div
                      key={piece.id}
                      onClick={() => {
                        setEquippedHead(piece);
                        setActiveSlotModal(null);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        equippedHead.id === piece.id
                          ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={piece.image} alt={piece.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <div className="text-sm font-bold text-white">{piece.name}</div>
                          <div className="text-xs text-slate-400">{piece.monsterOrigin} • Defense {piece.defense}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {piece.skills.map((sk) => (
                              <span key={sk.name} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-300 font-mono">
                                {sk.name} +{sk.level}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold">
                        Equip
                      </button>
                    </div>
                  ))}

                {activeSlotModal === 'chest' &&
                  ARMOR_CHEST_PIECES.map((piece) => (
                    <div
                      key={piece.id}
                      onClick={() => {
                        setEquippedChest(piece);
                        setActiveSlotModal(null);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        equippedChest.id === piece.id
                          ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={piece.image} alt={piece.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <div className="text-sm font-bold text-white">{piece.name}</div>
                          <div className="text-xs text-slate-400">{piece.monsterOrigin} • Defense {piece.defense}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {piece.skills.map((sk) => (
                              <span key={sk.name} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-300 font-mono">
                                {sk.name} +{sk.level}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold">
                        Equip
                      </button>
                    </div>
                  ))}

                {activeSlotModal === 'arms' &&
                  ARMOR_ARMS_PIECES.map((piece) => (
                    <div
                      key={piece.id}
                      onClick={() => {
                        setEquippedArms(piece);
                        setActiveSlotModal(null);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        equippedArms.id === piece.id
                          ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={piece.image} alt={piece.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <div className="text-sm font-bold text-white">{piece.name}</div>
                          <div className="text-xs text-slate-400">{piece.monsterOrigin} • Defense {piece.defense}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {piece.skills.map((sk) => (
                              <span key={sk.name} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-300 font-mono">
                                {sk.name} +{sk.level}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold">
                        Equip
                      </button>
                    </div>
                  ))}

                {activeSlotModal === 'waist' &&
                  ARMOR_WAIST_PIECES.map((piece) => (
                    <div
                      key={piece.id}
                      onClick={() => {
                        setEquippedWaist(piece);
                        setActiveSlotModal(null);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        equippedWaist.id === piece.id
                          ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={piece.image} alt={piece.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <div className="text-sm font-bold text-white">{piece.name}</div>
                          <div className="text-xs text-slate-400">{piece.monsterOrigin} • Defense {piece.defense}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {piece.skills.map((sk) => (
                              <span key={sk.name} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-300 font-mono">
                                {sk.name} +{sk.level}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold">
                        Equip
                      </button>
                    </div>
                  ))}

                {activeSlotModal === 'legs' &&
                  ARMOR_LEGS_PIECES.map((piece) => (
                    <div
                      key={piece.id}
                      onClick={() => {
                        setEquippedLegs(piece);
                        setActiveSlotModal(null);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        equippedLegs.id === piece.id
                          ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={piece.image} alt={piece.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <div className="text-sm font-bold text-white">{piece.name}</div>
                          <div className="text-xs text-slate-400">{piece.monsterOrigin} • Defense {piece.defense}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {piece.skills.map((sk) => (
                              <span key={sk.name} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-300 font-mono">
                                {sk.name} +{sk.level}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold">
                        Equip
                      </button>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
