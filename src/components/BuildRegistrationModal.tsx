import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Shield, 
  Sword, 
  Zap, 
  Flame, 
  Palette, 
  Plus, 
  Trash2, 
  Check, 
  Image as ImageIcon,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Wand2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  HunterBuild, 
  GameTitle, 
  WeaponType, 
  ElementType, 
  HuntingStyle, 
  BuildSkill, 
  ArmorPiece, 
  FashionImage 
} from '../types';
import { 
  GAMES_DATA, 
  WEAPONS_DATA, 
  COMMON_SKILLS_DATABASE, 
  PRESET_ARMOR_SETS 
} from '../data/monsterHunterData';

interface BuildRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBuild: (newBuild: HunterBuild) => void;
  initialBuild?: HunterBuild | null;
}

export const BuildRegistrationModal: React.FC<BuildRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSaveBuild,
  initialBuild,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [title, setTitle] = useState(initialBuild?.title || '');
  const [hunterName, setHunterName] = useState(initialBuild?.hunterName || 'Guild Hunter');
  const [hunterRank, setHunterRank] = useState(initialBuild?.hunterRank || 'MR 100 / Master Hunter');
  const [game, setGame] = useState<GameTitle>(initialBuild?.game || 'wilds');
  const [weaponType, setWeaponType] = useState<WeaponType>(initialBuild?.weaponType || 'great_sword');
  const [weaponName, setWeaponName] = useState(initialBuild?.weaponName || 'Arkveld Doomcleaver');
  const [element, setElement] = useState<ElementType>(initialBuild?.element || 'Dragon');
  const [elementValue, setElementValue] = useState<number>(initialBuild?.elementValue || 420);
  const [attackRaw, setAttackRaw] = useState<number>(initialBuild?.attackRaw || 1550);
  const [affinity, setAffinity] = useState<number>(initialBuild?.affinity || 85);
  const [defenseTotal, setDefenseTotal] = useState<number>(initialBuild?.defenseTotal || 1050);
  const [sharpness, setSharpness] = useState<HunterBuild['sharpness']>(initialBuild?.sharpness || 'Purple');
  
  // Wilds Secondary Weapon State
  const [secondaryWeaponType, setSecondaryWeaponType] = useState<WeaponType>(initialBuild?.secondaryWeapon?.weaponType || 'bow');
  const [secondaryWeaponName, setSecondaryWeaponName] = useState(initialBuild?.secondaryWeapon?.weaponName || 'Rey Dau Fulgurbow');
  const [secondaryElement, setSecondaryElement] = useState<ElementType>(initialBuild?.secondaryWeapon?.element || 'Thunder');
  const [secondaryElementValue, setSecondaryElementValue] = useState<number>(initialBuild?.secondaryWeapon?.elementValue || 380);
  const [secondaryAttackRaw, setSecondaryAttackRaw] = useState<number>(initialBuild?.secondaryWeapon?.attackRaw || 1280);
  const [secondaryAffinity, setSecondaryAffinity] = useState<number>(initialBuild?.secondaryWeapon?.affinity || 30);
  const [secondarySharpness, setSecondarySharpness] = useState<HunterBuild['sharpness']>(initialBuild?.secondaryWeapon?.sharpness || 'Purple');

  const [huntingStyle, setHuntingStyle] = useState<HuntingStyle>(initialBuild?.huntingStyle || 'Focus Mode & Seikret');
  const [playstyleCategory, setPlaystyleCategory] = useState<HunterBuild['playstyleCategory']>(initialBuild?.playstyleCategory || 'Meta Raw');
  const [switchSkillsText, setSwitchSkillsText] = useState<string>(initialBuild?.switchSkillsOrArts?.join(', ') || 'Focus Wound Slash, True Charged Slash III');

  // Armor Pieces
  const [head, setHead] = useState<ArmorPiece>(initialBuild?.head || {
    name: 'Arkveld Helm Alpha',
    monsterOrigin: 'Arkveld',
    defense: 218,
    slots: [4, 2],
    decorations: ['Expert Jewel 4', 'Tenderizer Jewel 2'],
    skills: [{ name: 'Weakness Exploit', level: 1 }, { name: 'Critical Eye', level: 2 }],
    layeredName: 'Silver Wraith Cowl',
  });

  const [chest, setChest] = useState<ArmorPiece>(initialBuild?.chest || {
    name: 'Arkveld Mail Alpha',
    monsterOrigin: 'Arkveld',
    defense: 220,
    slots: [4, 2, 1],
    decorations: ['Critical Jewel 2', 'Attack Jewel 2', 'Steadfast Jewel 1'],
    skills: [{ name: 'Critical Boost', level: 2 }, { name: 'Focus', level: 2 }],
    layeredName: 'Silver Wraith Cuirass',
  });

  const [arms, setArms] = useState<ArmorPiece>(initialBuild?.arms || {
    name: 'Rey Dau Braces Beta',
    monsterOrigin: 'Rey Dau',
    defense: 212,
    slots: [4, 4],
    decorations: ['Attack Jewel+ 4', 'Expert Jewel+ 4'],
    skills: [{ name: 'Attack Boost', level: 2 }],
    layeredName: 'Fulgur Bracers',
  });

  const [waist, setWaist] = useState<ArmorPiece>(initialBuild?.waist || {
    name: 'Arkveld Coil Alpha',
    monsterOrigin: 'Arkveld',
    defense: 215,
    slots: [4, 2],
    decorations: ['Critical Jewel 2', 'Charger Jewel 2'],
    skills: [{ name: 'Focus', level: 1 }, { name: 'Critical Boost', level: 1 }],
    layeredName: 'Wraith Tassets',
  });

  const [legs, setLegs] = useState<ArmorPiece>(initialBuild?.legs || {
    name: 'Balahara Greaves Alpha',
    monsterOrigin: 'Balahara',
    defense: 215,
    slots: [4, 2, 2],
    decorations: ['Handicraft Jewel 4', 'Tenderizer 2'],
    skills: [{ name: 'Handicraft', level: 2 }],
    layeredName: 'Dune Greaves',
  });

  const [talismanName, setTalismanName] = useState(initialBuild?.talisman?.name || 'Focus Talisman V');
  const [talismanSkillsText, setTalismanSkillsText] = useState('Attack Boost 3, Weakness Exploit 1');
  const [talismanDecosText, setTalismanDecosText] = useState('Brace Jewel 1');

  // Skills
  const [skills, setSkills] = useState<BuildSkill[]>(initialBuild?.skills || [
    { name: 'Attack Boost', level: 7, maxLevel: 7, category: 'offensive', description: 'Massive raw scaling.' },
    { name: 'Critical Eye', level: 7, maxLevel: 7, category: 'offensive', description: '+40% baseline critical rate.' },
    { name: 'Weakness Exploit', level: 3, maxLevel: 3, category: 'offensive', description: '+50% affinity on weak points.' },
    { name: 'Critical Boost', level: 3, maxLevel: 3, category: 'offensive', description: '1.40x critical damage.' },
    { name: 'Focus', level: 3, maxLevel: 3, category: 'utility', description: 'Fast charge releases.' },
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [setBonusInput, setSetBonusInput] = useState<string>(initialBuild?.setBonuses?.join(', ') || 'Wraith Cleave (Wound Multiplier +25%)');

  // Fashion & Carousel
  const [fashionTitle, setFashionTitle] = useState(initialBuild?.fashionTitle || 'Pale Eclipse Sovereign');
  const [fashionTheme, setFashionTheme] = useState(initialBuild?.fashionTheme || 'Gothic Platinum Paladin');
  const [primaryHex, setPrimaryHex] = useState(initialBuild?.fashionDyes?.primaryHex || '#e2e8f0');
  const [secondaryHex, setSecondaryHex] = useState(initialBuild?.fashionDyes?.secondaryHex || '#1e293b');
  const [pigmentName, setPigmentName] = useState(initialBuild?.fashionDyes?.pigmentName || 'Silver Lunar & Midnight Obsidian');
  const [fashionRating, setFashionRating] = useState<number>(initialBuild?.fashionRating || 9.8);
  const [heroImageUrl, setHeroImageUrl] = useState(initialBuild?.showcaseHeroImage || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85');
  
  const [gearImages, setGearImages] = useState<FashionImage[]>(initialBuild?.gearImages || [
    {
      id: 'slide-1',
      title: 'Full Armor Set Showcase',
      category: 'full',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      caption: 'Full front angle with layered cosmetic plating.',
    },
    {
      id: 'slide-2',
      title: 'Weapon in Stance',
      category: 'weapon',
      url: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&w=1200&q=85',
      caption: 'Signature weapon unsheathed in combat ready stance.',
    },
    {
      id: 'slide-3',
      title: 'Headpiece & Visor Detail',
      category: 'head',
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85',
      caption: 'Intricate forged helmet crest.',
    },
  ]);

  // Lore
  const [description, setDescription] = useState(initialBuild?.description || 'Built for high burst stagger windows and fluid counter strikes. Optimized for Monster Hunter Wilds combat rhythm.');
  const [hunterTips, setHunterTips] = useState(initialBuild?.hunterTips || 'Enter Focus Mode when wounds turn crimson to guarantee max damage TCS releases.');
  const [tagsText, setTagsText] = useState(initialBuild?.tags?.join(', ') || 'MH Wilds, Great Sword, Meta DPS, Fashion');

  if (!isOpen) return null;

  // Preset Set Loader
  const handleApplyPreset = (presetName: string) => {
    const preset = PRESET_ARMOR_SETS.find(p => p.name === presetName);
    if (!preset) return;
    setGame(preset.game);
    setPrimaryHex(preset.defaultDye.primary);
    setSecondaryHex(preset.defaultDye.secondary);
    setHeroImageUrl(preset.image);
    setFashionTitle(`${preset.monster} Vanguard`);
    setFashionTheme(`Signature ${preset.monster} Fashion Transmog`);
    setHead(prev => ({ ...prev, name: `${preset.name} Helm`, monsterOrigin: preset.monster }));
    setChest(prev => ({ ...prev, name: `${preset.name} Mail`, monsterOrigin: preset.monster }));
    setArms(prev => ({ ...prev, name: `${preset.name} Braces`, monsterOrigin: preset.monster }));
    setWaist(prev => ({ ...prev, name: `${preset.name} Coil`, monsterOrigin: preset.monster }));
    setLegs(prev => ({ ...prev, name: `${preset.name} Greaves`, monsterOrigin: preset.monster }));
    
    // Update first image
    setGearImages(prev => [
      { id: 'preset-1', title: `Full ${preset.name} Showcase`, category: 'full', url: preset.image, caption: `High-res showcase of ${preset.monster} set.` },
      ...prev.slice(1)
    ]);
  };

  const handleAddSkill = () => {
    if (!newSkillName) return;
    const dbSkill = COMMON_SKILLS_DATABASE.find(s => s.name.toLowerCase() === newSkillName.toLowerCase());
    if (dbSkill) {
      if (!skills.some(s => s.name === dbSkill.name)) {
        setSkills([...skills, { ...dbSkill, level: 1 }]);
      }
    } else {
      setSkills([...skills, {
        name: newSkillName,
        level: 1,
        maxLevel: 5,
        category: 'offensive',
        description: 'Custom hunter armor skill.'
      }]);
    }
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter(s => s.name !== skillName));
  };

  const handleSkillLevelChange = (skillName: string, delta: number) => {
    setSkills(skills.map(s => {
      if (s.name === skillName) {
        const nextLevel = Math.max(1, Math.min(s.maxLevel, s.level + delta));
        return { ...s, level: nextLevel };
      }
      return s;
    }));
  };

  const handleAddImageSlide = () => {
    const newSlide: FashionImage = {
      id: `custom-slide-${Date.now()}`,
      title: 'Armor Piece Detail',
      category: 'full',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      caption: 'Detailed high-resolution inspect view.',
    };
    setGearImages([...gearImages, newSlide]);
  };

  const handleRemoveImageSlide = (id: string) => {
    if (gearImages.length <= 1) return;
    setGearImages(gearImages.filter(img => img.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a title for your Monster Hunter build.');
      return;
    }

    const newBuild: HunterBuild = {
      id: initialBuild?.id || `mh-build-${Date.now()}`,
      title: title.trim(),
      hunterName: hunterName.trim() || 'Guild Hunter',
      hunterRank: hunterRank.trim(),
      game,
      weaponType,
      weaponName: weaponName.trim() || 'Master Weapon',
      weaponImage: heroImageUrl,
      element,
      elementValue: Number(elementValue) || 0,
      attackRaw: Number(attackRaw) || 1200,
      affinity: Number(affinity) || 50,
      defenseTotal: Number(defenseTotal) || 900,
      sharpness: sharpness || 'Purple',
      secondaryWeapon: game === 'wilds' ? {
        weaponType: secondaryWeaponType,
        weaponName: secondaryWeaponName.trim() || 'Secondary Weapon',
        weaponImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
        element: secondaryElement,
        elementValue: Number(secondaryElementValue) || 0,
        attackRaw: Number(secondaryAttackRaw) || 1100,
        affinity: Number(secondaryAffinity) || 20,
        sharpness: secondarySharpness || 'Purple',
        defenseBonus: 0,
      } : undefined,
      huntingStyle,
      switchSkillsOrArts: switchSkillsText.split(',').map(s => s.trim()).filter(Boolean),
      playstyleCategory,
      head,
      chest,
      arms,
      waist,
      legs,
      talisman: {
        name: talismanName.trim() || 'Guild Talisman',
        skills: talismanSkillsText.split(',').map(s => {
          const parts = s.trim().split(' ');
          const lvl = parseInt(parts.pop() || '1') || 1;
          return { name: parts.join(' ') || 'Skill', level: lvl };
        }),
        slots: [3, 2, 1],
        decorations: talismanDecosText.split(',').map(s => s.trim()).filter(Boolean),
      },
      skills,
      setBonuses: setBonusInput.split(',').map(s => s.trim()).filter(Boolean),
      fashionTitle: fashionTitle.trim() || 'Guild Showcase Armor',
      fashionDyes: {
        primaryHex,
        secondaryHex,
        pigmentName,
      },
      fashionTheme: fashionTheme.trim() || 'Hunting Armor Set',
      fashionRating: Number(fashionRating) || 9.5,
      gearImages,
      showcaseHeroImage: heroImageUrl || gearImages[0]?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      description: description.trim(),
      hunterTips: hunterTips.trim(),
      likes: initialBuild?.likes || 1,
      createdAt: initialBuild?.createdAt || new Date().toISOString().split('T')[0],
      tags: tagsText.split(',').map(t => t.trim()).filter(Boolean),
      isCustom: true,
    };

    onSaveBuild(newBuild);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
    });
    onClose();
  };

  const gameInfo = GAMES_DATA[game];
  const weaponInfo = WEAPONS_DATA[weaponType];

  return (
    <div id="build-registration-modal" className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Sword className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialBuild ? 'Edit Hunter Build' : 'Register New Monster Hunter Build'}
              </h3>
              <p className="text-xs text-slate-400">
                Segmented by game title, skills, weapon class, and fashion carousel showcase.
              </p>
            </div>
          </div>

          <button
            id="btn-close-registration-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Navigation Pills */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between overflow-x-auto gap-2">
          {[
            { step: 1, label: '1. Game & Weapon' },
            { step: 2, label: '2. Armor & Gear' },
            { step: 3, label: '3. Skills & Bonuses' },
            { step: 4, label: '4. Fashion Carousel' },
            { step: 5, label: '5. Lore & Publish' },
          ].map(({ step, label }) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentStep === step
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="overflow-y-auto flex-1 p-6 space-y-6 scrollbar-thin">
          {/* STEP 1: Game, Weapon & Combat Style */}
          {currentStep === 1 && (
            <div className="space-y-5">
              {/* Quick Preset Sets Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs text-slate-200">
                    <strong>Quick Start:</strong> Auto-populate with an iconic Monster Hunter armor template:
                  </span>
                </div>
                <select
                  onChange={(e) => handleApplyPreset(e.target.value)}
                  defaultValue=""
                  className="bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-1.5 text-xs text-amber-300 focus:outline-none"
                >
                  <option value="" disabled>Choose Preset Armor Set...</option>
                  {PRESET_ARMOR_SETS.map((p) => (
                    <option key={p.name} value={p.name}>{p.name} ({p.monster})</option>
                  ))}
                </select>
              </div>

              {/* Game Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Target Monster Hunter Game Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(Object.keys(GAMES_DATA) as GameTitle[]).map((gKey) => {
                    const g = GAMES_DATA[gKey];
                    const isSelected = game === gKey;
                    return (
                      <button
                        type="button"
                        key={gKey}
                        onClick={() => {
                          setGame(gKey);
                          setHuntingStyle(g.availableStyles[0] as HuntingStyle);
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? `${g.badgeColor} ring-2 ring-amber-400 font-bold shadow-lg`
                            : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-bold">{g.shortName}</span>
                        <span className="text-[10px] opacity-75 font-normal">{g.era}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weapon Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Weapon Category ({weaponInfo.name})
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-950 rounded-xl border border-slate-800 scrollbar-thin">
                  {(Object.keys(WEAPONS_DATA) as WeaponType[]).map((wKey) => {
                    const w = WEAPONS_DATA[wKey];
                    const isSelected = weaponType === wKey;
                    return (
                      <button
                        type="button"
                        key={wKey}
                        onClick={() => setWeaponType(wKey)}
                        className={`p-2 rounded-xl text-xs font-medium border transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-amber-500/30 text-amber-300 border-amber-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-base">{w.iconGlyph}</span>
                        <span className="text-[10px] truncate max-w-full">{w.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weapon Details & Combat Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Weapon Name</label>
                  <input
                    type="text"
                    value={weaponName}
                    onChange={(e) => setWeaponName(e.target.value)}
                    placeholder="e.g. Arkveld Doomcleaver"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Hunting Style / Mechanic</label>
                  <select
                    value={huntingStyle}
                    onChange={(e) => setHuntingStyle(e.target.value as HuntingStyle)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {gameInfo.availableStyles.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                    <option value="Standard">Standard</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Playstyle Archetype</label>
                  <select
                    value={playstyleCategory}
                    onChange={(e) => setPlaystyleCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Meta Raw">Meta Raw DPS</option>
                    <option value="Elemental">Elemental Surge</option>
                    <option value="Comfort / Tank">Comfort / Tank (Guard / Divine)</option>
                    <option value="Support">Hunting Horn / Wide-Range Support</option>
                    <option value="Speedrun">Speedrun TA Rules</option>
                    <option value="Fashion First">Fashion First Transmog</option>
                  </select>
                </div>
              </div>

              {/* Combat Stats Numerics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <label className="text-[11px] text-slate-400 font-mono mb-1 block">Attack Raw</label>
                  <input
                    type="number"
                    value={attackRaw}
                    onChange={(e) => setAttackRaw(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-mono mb-1 block">Affinity %</label>
                  <input
                    type="number"
                    value={affinity}
                    onChange={(e) => setAffinity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-mono mb-1 block">Element</label>
                  <select
                    value={element}
                    onChange={(e) => setElement(e.target.value as ElementType)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {['None', 'Fire', 'Water', 'Thunder', 'Ice', 'Dragon', 'Blast', 'Poison', 'Paralysis', 'Sleep'].map(el => (
                      <option key={el} value={el}>{el}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-mono mb-1 block">Sharpness</label>
                  <select
                    value={sharpness}
                    onChange={(e) => setSharpness(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-purple-300 font-bold"
                  >
                    <option value="Purple">Purple</option>
                    <option value="White">White</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                  </select>
                </div>
              </div>

              {/* Wilds Secondary Weapon Configuration */}
              {game === 'wilds' && (
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-sky-500 text-slate-950 text-[10px] font-black uppercase font-mono">
                        Seikret Holster
                      </span>
                      <h4 className="text-xs font-bold text-amber-300">
                        Monster Hunter Wilds Secondary Weapon
                      </h4>
                    </div>
                    <span className="text-[11px] text-amber-400/80 font-mono">Slot 2</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 font-medium mb-1 block">Secondary Weapon Name</label>
                      <input
                        type="text"
                        value={secondaryWeaponName}
                        onChange={(e) => setSecondaryWeaponName(e.target.value)}
                        placeholder="e.g. Rey Dau Fulgurbow"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-medium mb-1 block">Secondary Weapon Type</label>
                      <select
                        value={secondaryWeaponType}
                        onChange={(e) => setSecondaryWeaponType(e.target.value as WeaponType)}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        {(Object.keys(WEAPONS_DATA) as WeaponType[]).map((wKey) => (
                          <option key={wKey} value={wKey}>
                            {WEAPONS_DATA[wKey].name} ({WEAPONS_DATA[wKey].category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Secondary Raw</label>
                      <input
                        type="number"
                        value={secondaryAttackRaw}
                        onChange={(e) => setSecondaryAttackRaw(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Affinity %</label>
                      <input
                        type="number"
                        value={secondaryAffinity}
                        onChange={(e) => setSecondaryAffinity(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-amber-400 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Element</label>
                      <select
                        value={secondaryElement}
                        onChange={(e) => setSecondaryElement(e.target.value as ElementType)}
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs"
                      >
                        {['None', 'Fire', 'Water', 'Thunder', 'Ice', 'Dragon', 'Blast', 'Poison', 'Paralysis', 'Sleep'].map(el => (
                          <option key={el} value={el}>{el}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Sharpness</label>
                      <select
                        value={secondarySharpness}
                        onChange={(e) => setSecondarySharpness(e.target.value as any)}
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-purple-300 text-xs font-bold"
                      >
                        <option value="Purple">Purple</option>
                        <option value="White">White</option>
                        <option value="Blue">Blue</option>
                        <option value="Green">Green</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Armor Pieces & Socket Jewels */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Configure your 5 armor pieces, defense ratings, monster origins, slotted decoration jewels, and layered transmogs.
              </div>

              {[
                { label: 'Headgear', state: head, setState: setHead },
                { label: 'Chest Armor', state: chest, setState: setChest },
                { label: 'Arm Vambraces', state: arms, setState: setArms },
                { label: 'Waist Coil', state: waist, setState: setWaist },
                { label: 'Leg Greaves', state: legs, setState: setLegs },
              ].map(({ label, state, setState }) => (
                <div key={label} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Defense:</span>
                      <input
                        type="number"
                        value={state.defense}
                        onChange={(e) => setState({ ...state, defense: Number(e.target.value) })}
                        className="w-16 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs text-sky-300 text-center font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Armor Piece Name</label>
                      <input
                        type="text"
                        value={state.name}
                        onChange={(e) => setState({ ...state, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Monster Origin</label>
                      <input
                        type="text"
                        value={state.monsterOrigin}
                        onChange={(e) => setState({ ...state, monsterOrigin: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Layered Cosmetic Name</label>
                      <input
                        type="text"
                        value={state.layeredName || ''}
                        onChange={(e) => setState({ ...state, layeredName: e.target.value })}
                        placeholder="e.g. Silver Knight Cowl"
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-amber-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Slotted Decorations (comma separated)</label>
                    <input
                      type="text"
                      value={state.decorations?.join(', ') || ''}
                      onChange={(e) => setState({ ...state, decorations: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="e.g. Expert Jewel 4, Tenderizer Jewel 2"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-sky-300 font-mono"
                    />
                  </div>
                </div>
              ))}

              {/* Talisman */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Talisman / Charm</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={talismanName}
                    onChange={(e) => setTalismanName(e.target.value)}
                    placeholder="Talisman Name"
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-amber-200"
                  />
                  <input
                    type="text"
                    value={talismanSkillsText}
                    onChange={(e) => setTalismanSkillsText(e.target.value)}
                    placeholder="Skills (e.g. Attack Boost 3)"
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                  />
                  <input
                    type="text"
                    value={talismanDecosText}
                    onChange={(e) => setTalismanDecosText(e.target.value)}
                    placeholder="Decos (e.g. Brace Jewel 1)"
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-sky-300 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Skills & Set Bonuses */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {/* Set Bonuses */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Monster Set Bonuses (comma separated)
                </label>
                <input
                  type="text"
                  value={setBonusInput}
                  onChange={(e) => setSetBonusInput(e.target.value)}
                  placeholder="e.g. Fatalis Transcendence, Blood Awakening Lv3, Heaven-Sent"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-200"
                />
              </div>

              {/* Add Skill Input */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Add Armor Skill
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Search or enter skill name (e.g. Weakness Exploit, Agitator)..."
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                {/* Popular Skill Quick Add Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 self-center">Popular:</span>
                  {['Weakness Exploit', 'Critical Boost', 'Attack Boost', 'Critical Eye', 'Agitator', "Master's Touch", 'Blood Awakening', 'Frostcraft', 'Guard Up'].map(pop => (
                    <button
                      type="button"
                      key={pop}
                      onClick={() => {
                        setNewSkillName(pop);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-400 hover:text-amber-300 border border-slate-800"
                    >
                      + {pop}
                    </button>
                  ))}
                </div>
              </div>

              {/* Configured Skills List */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Build Skills ({skills.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {skills.map((skill) => (
                    <div key={skill.name} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-200">{skill.name}</div>
                        <div className="text-[10px] text-slate-400">Max Lv.{skill.maxLevel}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                          <button
                            type="button"
                            onClick={() => handleSkillLevelChange(skill.name, -1)}
                            className="text-xs text-slate-400 hover:text-white px-1"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-amber-400 font-mono">Lv.{skill.level}</span>
                          <button
                            type="button"
                            onClick={() => handleSkillLevelChange(skill.name, 1)}
                            className="text-xs text-slate-400 hover:text-white px-1"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.name)}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Fashion & High-Resolution Carousel */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Palette className="w-4 h-4" /> Fashion Profile & Dye Swatches
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Fashion Set Title</label>
                    <input
                      type="text"
                      value={fashionTitle}
                      onChange={(e) => setFashionTitle(e.target.value)}
                      placeholder="e.g. Pale Eclipse Knight"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Theme Concept</label>
                    <input
                      type="text"
                      value={fashionTheme}
                      onChange={(e) => setFashionTheme(e.target.value)}
                      placeholder="e.g. Platinum Paladin"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Fashion Rating (1 - 10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={fashionRating}
                      onChange={(e) => setFashionRating(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-400 font-mono"
                    />
                  </div>
                </div>

                {/* Pigments */}
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-slate-400">Primary Dye:</label>
                    <input
                      type="color"
                      value={primaryHex}
                      onChange={(e) => setPrimaryHex(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                    />
                    <span className="text-xs font-mono text-slate-300">{primaryHex}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-slate-400">Secondary Dye:</label>
                    <input
                      type="color"
                      value={secondaryHex}
                      onChange={(e) => setSecondaryHex(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                    />
                    <span className="text-xs font-mono text-slate-300">{secondaryHex}</span>
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={pigmentName}
                      onChange={(e) => setPigmentName(e.target.value)}
                      placeholder="Pigment Name (e.g. Silver Lunar & Obsidian)"
                      className="w-full px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Gear Carousel Slide Manager */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Gear Carousel Slides ({gearImages.length})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Add piece-by-piece angles (Full set, Helmet, Chestplate, Weapon stance)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageSlide}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Slide
                  </button>
                </div>

                <div className="space-y-2">
                  {gearImages.map((img, idx) => (
                    <div key={img.id || idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <img
                        src={img.url}
                        alt={img.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-12 rounded-lg object-cover border border-slate-700"
                      />

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                        <input
                          type="text"
                          value={img.title}
                          onChange={(e) => {
                            const updated = [...gearImages];
                            updated[idx].title = e.target.value;
                            setGearImages(updated);
                          }}
                          placeholder="Slide Title (e.g. Headgear View)"
                          className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />

                        <select
                          value={img.category}
                          onChange={(e) => {
                            const updated = [...gearImages];
                            updated[idx].category = e.target.value as any;
                            setGearImages(updated);
                          }}
                          className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300"
                        >
                          <option value="full">Full Armor Set</option>
                          <option value="head">Head Armor</option>
                          <option value="chest">Chest Armor</option>
                          <option value="arms">Arms Armor</option>
                          <option value="waist">Waist Armor</option>
                          <option value="legs">Legs Armor</option>
                          <option value="weapon">Weapon View</option>
                          <option value="action">Action Stance</option>
                        </select>

                        <input
                          type="text"
                          value={img.url}
                          onChange={(e) => {
                            const updated = [...gearImages];
                            updated[idx].url = e.target.value;
                            setGearImages(updated);
                          }}
                          placeholder="Image URL"
                          className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-400 truncate"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveImageSlide(img.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 self-end sm:self-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Lore, Notes & Publish */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Build Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Arkveld Wraith: True Focus Cleaver"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Hunter Author Name</label>
                  <input
                    type="text"
                    value={hunterName}
                    onChange={(e) => setHunterName(e.target.value)}
                    placeholder="e.g. Hunter Ignis"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Hunter Rank / Era Title</label>
                  <input
                    type="text"
                    value={hunterRank}
                    onChange={(e) => setHunterRank(e.target.value)}
                    placeholder="e.g. MR 999 / Crown Guild Champion"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Build Concept & Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain why this armor set synergies together..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Hunter's Combat Tips & Strategy</label>
                <textarea
                  rows={2}
                  value={hunterTips}
                  onChange={(e) => setHunterTips(e.target.value)}
                  placeholder="Positioning advice, switch skill rotations, opening combos..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="e.g. MH Wilds, Great Sword, Focus Mode, Meta DPS, Fashion"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300"
                />
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  id="btn-submit-build"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Sparkles className="w-4 h-4" /> Publish Build to Guild
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
