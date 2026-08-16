import React, { useState, useMemo, useEffect } from 'react';
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
  Award,
  ArrowLeftRight,
  Crosshair,
  Compass,
  Search,
  Plus,
  Edit2,
  X,
  Target,
  Droplet,
  Snowflake,
  Skull
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  HunterBuild, 
  ArmorPiece, 
  ArmorDye, 
  GameTitle, 
  WeaponType, 
  ElementType,
  HunterProfile,
  WeaponDatabaseEntry 
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

type GearSlotType = 'head' | 'chest' | 'arms' | 'waist' | 'legs' | 'weapon' | 'weapon2';

export const BuildsWorkshopPage: React.FC<BuildsWorkshopPageProps> = ({
  currentUser,
  initialGame = 'wilds',
  initialGearToEquip,
  onSaveBuild,
  onOpenFashionCarousel,
}) => {
  // Current game selection
  const [selectedGame, setSelectedGame] = useState<GameTitle>(initialGame);

  // Sync with initialGame if changed from parent
  useEffect(() => {
    if (initialGame) {
      setSelectedGame(initialGame);
    }
  }, [initialGame]);

  const isWilds = selectedGame === 'wilds';

  const [buildTitle, setBuildTitle] = useState('Wilds Focus & Seikret Loadout');
  const [huntingStyle, setHuntingStyle] = useState('Focus Mode & Seikret');

  // 5 Armor Parts
  const [equippedHead, setEquippedHead] = useState<ArmorPiece>(ARMOR_HEAD_PIECES[0]);
  const [equippedChest, setEquippedChest] = useState<ArmorPiece>(ARMOR_CHEST_PIECES[0]);
  const [equippedArms, setEquippedArms] = useState<ArmorPiece>(ARMOR_ARMS_PIECES[0]);
  const [equippedWaist, setEquippedWaist] = useState<ArmorPiece>(ARMOR_WAIST_PIECES[0]);
  const [equippedLegs, setEquippedLegs] = useState<ArmorPiece>(ARMOR_LEGS_PIECES[0]);

  // Weapons: Primary Weapon & Secondary Holster Weapon (for Wilds)
  const [equippedWeapon, setEquippedWeapon] = useState<WeaponDatabaseEntry>(WEAPONS_DATABASE[0]); // Primary (e.g. Great Sword)
  const [equippedWeapon2, setEquippedWeapon2] = useState<WeaponDatabaseEntry>(
    WEAPONS_DATABASE.find(w => w.weaponType === 'bow' || w.id === 'w-reydau-bow') || WEAPONS_DATABASE[1]
  ); // Secondary Holster (e.g. Bow)

  // Active drawn weapon on the visual model (Primary vs Secondary in Wilds)
  const [activeDrawnWeapon, setActiveDrawnWeapon] = useState<'primary' | 'secondary'>('primary');

  // Modal Picker State
  const [activeSlotModal, setActiveSlotModal] = useState<GearSlotType | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerFilter, setPickerFilter] = useState<'all' | 'blademaster' | 'gunner' | 'game'>('all');

  // Custom Fine-Tune Editing Modal State
  const [editingPieceSlot, setEditingPieceSlot] = useState<GearSlotType | null>(null);
  const [customPieceName, setCustomPieceName] = useState('');
  const [customPieceDefense, setCustomPieceDefense] = useState<number>(200);
  const [customPieceMonster, setCustomPieceMonster] = useState('');
  const [customPieceDecos, setCustomPieceDecos] = useState('');
  const [customPieceLayered, setCustomPieceLayered] = useState('');

  // Talisman
  const [talisman, setTalisman] = useState({
    name: 'Focus Talisman V',
    skills: [{ name: 'Attack Boost', level: 2 }, { name: 'Weakness Exploit', level: 1 }],
    slots: [4, 2, 1],
    decorations: ['Attack Jewel+ 4', 'Tenderizer Jewel 2'],
  });

  const [copiedNotification, setCopiedNotification] = useState(false);
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);

  // Fashion Dyes
  const [dyes, setDyes] = useState<ArmorDye>({
    primaryHex: '#d97706',
    secondaryHex: '#0284c7',
    pigmentName: 'Imperial Amber & Fulgur Cyan',
  });

  // Auto-equip initialGearToEquip if provided
  useEffect(() => {
    if (!initialGearToEquip) return;
    const lower = initialGearToEquip.toLowerCase();
    
    // Check weapons
    const matchingWeapon = WEAPONS_DATABASE.find(w => w.name.toLowerCase().includes(lower) || w.id.toLowerCase().includes(lower));
    if (matchingWeapon) {
      setEquippedWeapon(matchingWeapon);
      return;
    }
    // Check Head
    const matchingHead = ARMOR_HEAD_PIECES.find(p => p.name.toLowerCase().includes(lower) || p.monsterOrigin.toLowerCase().includes(lower));
    if (matchingHead) {
      setEquippedHead(matchingHead);
      return;
    }
    // Check Chest
    const matchingChest = ARMOR_CHEST_PIECES.find(p => p.name.toLowerCase().includes(lower) || p.monsterOrigin.toLowerCase().includes(lower));
    if (matchingChest) {
      setEquippedChest(matchingChest);
      return;
    }
    // Check Arms
    const matchingArms = ARMOR_ARMS_PIECES.find(p => p.name.toLowerCase().includes(lower) || p.monsterOrigin.toLowerCase().includes(lower));
    if (matchingArms) {
      setEquippedArms(matchingArms);
      return;
    }
    // Check Waist
    const matchingWaist = ARMOR_WAIST_PIECES.find(p => p.name.toLowerCase().includes(lower) || p.monsterOrigin.toLowerCase().includes(lower));
    if (matchingWaist) {
      setEquippedWaist(matchingWaist);
      return;
    }
    // Check Legs
    const matchingLegs = ARMOR_LEGS_PIECES.find(p => p.name.toLowerCase().includes(lower) || p.monsterOrigin.toLowerCase().includes(lower));
    if (matchingLegs) {
      setEquippedLegs(matchingLegs);
      return;
    }
  }, [initialGearToEquip]);

  // Swap Primary and Secondary Weapons (Wilds feature)
  const handleSwapWeapons = () => {
    const temp = equippedWeapon;
    setEquippedWeapon(equippedWeapon2);
    setEquippedWeapon2(temp);
    confetti({ particleCount: 25, spread: 35, origin: { y: 0.7 } });
  };

  // Calculate live aggregate defense from 5 armor pieces + primary weapon bonus
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

  // Calculate elemental resistances across the 5 armor pieces
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

  // Calculate aggregate skills from 5 armor parts + talisman
  const aggregateSkills = useMemo(() => {
    const skillMap = new Map<string, { level: number; maxLevel: number; category: any; description: string }>();

    const allSkills = [
      ...equippedHead.skills,
      ...equippedChest.skills,
      ...equippedArms.skills,
      ...equippedWaist.skills,
      ...equippedLegs.skills,
      ...(talisman.skills || []),
    ];

    allSkills.forEach((s) => {
      const existing = skillMap.get(s.name);
      if (existing) {
        existing.level = Math.min(existing.level + s.level, existing.maxLevel);
      } else {
        const isOffensive = ['Weakness Exploit', 'Critical Boost', 'Attack Boost', 'Critical Eye', 'Agitator', 'Burst', 'Chain Mastery', 'Spread/Power Shots', 'Critical Element'].includes(s.name);
        const isSetBonus = ['Blood Awakening', 'Frostcraft', 'Transcendence', "Master's Touch", 'Punishing Draw', 'Chain Mastery'].includes(s.name);
        skillMap.set(s.name, {
          level: s.level,
          maxLevel: isSetBonus ? 3 : s.name === 'Attack Boost' || s.name === 'Critical Eye' || s.name === 'Agitator' ? 7 : 3,
          category: isSetBonus ? 'set_bonus' : isOffensive ? 'offensive' : 'defensive',
          description: `Active armor & jewel skill Lv.${s.level}. Augments hunt effectiveness.`,
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
  }, [equippedHead, equippedChest, equippedArms, equippedWaist, equippedLegs, talisman]);

  // Decoration sockets count
  const socketCounts = useMemo(() => {
    const allSlots = [
      ...(equippedHead.slots || []),
      ...(equippedChest.slots || []),
      ...(equippedArms.slots || []),
      ...(equippedWaist.slots || []),
      ...(equippedLegs.slots || []),
      ...(equippedWeapon.slots || []),
      ...(isWilds && equippedWeapon2 ? equippedWeapon2.slots || [] : []),
    ];
    return {
      lv4: allSlots.filter((s) => s === 4).length,
      lv3: allSlots.filter((s) => s === 3).length,
      lv2: allSlots.filter((s) => s === 2).length,
      lv1: allSlots.filter((s) => s === 1).length,
      total: allSlots.length,
    };
  }, [equippedHead, equippedChest, equippedArms, equippedWaist, equippedLegs, equippedWeapon, equippedWeapon2, isWilds]);

  // Handle Preset Set Quick Equip
  const handleEquipPreset = (presetName: string) => {
    if (presetName.includes('Arkveld')) {
      setEquippedHead(ARMOR_HEAD_PIECES[0]);
      setEquippedChest(ARMOR_CHEST_PIECES[0]);
      setEquippedArms(ARMOR_ARMS_PIECES[0]);
      setEquippedWaist(ARMOR_WAIST_PIECES[0]);
      setEquippedLegs(ARMOR_LEGS_PIECES[0]);
      setEquippedWeapon(WEAPONS_DATABASE[0]);
      if (isWilds) {
        setEquippedWeapon2(WEAPONS_DATABASE.find(w => w.weaponType === 'bow') || WEAPONS_DATABASE[3]);
      }
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
    if (isWilds) {
      setEquippedWeapon2(WEAPONS_DATABASE[Math.floor(Math.random() * WEAPONS_DATABASE.length)]);
    }
  };

  // Convert current equipped setup to HunterBuild format
  const currentConstructedBuild: HunterBuild = useMemo(() => {
    const build: HunterBuild = {
      id: `workshop-build-${Date.now()}`,
      title: buildTitle,
      hunterName: currentUser?.hunterName || 'Guild Workshop Hunter',
      hunterRank: `MR ${currentUser?.hunterRank || 120} / Master Crafter`,
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
      
      // Wilds Seikret Secondary Weapon
      secondaryWeapon: isWilds && equippedWeapon2 ? {
        weaponType: equippedWeapon2.weaponType,
        weaponName: equippedWeapon2.name,
        weaponImage: equippedWeapon2.image,
        element: equippedWeapon2.element,
        elementValue: equippedWeapon2.elementValue,
        attackRaw: equippedWeapon2.attackRaw,
        affinity: equippedWeapon2.affinity,
        sharpness: equippedWeapon2.sharpness,
        defenseBonus: equippedWeapon2.defenseBonus,
        slots: equippedWeapon2.slots,
        specialTrait: equippedWeapon2.specialTrait,
      } : undefined,

      huntingStyle: huntingStyle as any,
      playstyleCategory: 'Meta Raw',
      head: equippedHead,
      chest: equippedChest,
      arms: equippedArms,
      waist: equippedWaist,
      legs: equippedLegs,
      talisman,
      skills: aggregateSkills,
      setBonuses: [
        equippedHead.monsterOrigin.includes('Arkveld') ? 'Chain Mastery (Spectral Whip Sync)' : '',
        equippedChest.monsterOrigin.includes('Fatalis') ? 'Transcendence (All Skill Caps Unlocked)' : '',
        equippedArms.monsterOrigin.includes('Malzeno') ? 'Blood Awakening (Lifesteal Attack Burst)' : '',
      ].filter(Boolean),
      fashionTitle: `${equippedHead.monsterOrigin.split(' ')[0]} / ${equippedChest.monsterOrigin.split(' ')[0]} Custom Set`,
      fashionDyes: dyes,
      fashionTheme: 'Workshop Custom Loadout',
      fashionRating: 9.8,
      gearImages: [
        {
          id: 'workshop-shot-1',
          title: 'Full Armor Set Showcase',
          category: 'full',
          url: equippedChest.image || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
          caption: `Custom 5-piece armor set: ${equippedHead.name}, ${equippedChest.name}, ${equippedArms.name}, ${equippedWaist.name}, ${equippedLegs.name}.`,
        },
        {
          id: 'workshop-shot-2',
          title: 'Primary Weapon: ' + equippedWeapon.name,
          category: 'weapon',
          url: equippedWeapon.image || 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&w=1000&q=80',
          caption: `Primary weapon: ${equippedWeapon.name} (Raw ${equippedWeapon.attackRaw}).`,
        },
        ...(isWilds && equippedWeapon2 ? [{
          id: 'workshop-shot-3',
          title: 'Secondary Seikret Weapon: ' + equippedWeapon2.name,
          category: 'weapon' as const,
          url: equippedWeapon2.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
          caption: `Secondary Seikret Holster Weapon: ${equippedWeapon2.name} (Raw ${equippedWeapon2.attackRaw}).`,
        }] : []),
      ],
      showcaseHeroImage: equippedChest.image || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
      description: `Workshop loadout for ${GAMES_DATA[selectedGame].name}. 5-piece custom armor set with ${totalDefense} total defense. ${
        isWilds
          ? `Equipped with Dual Weapons (Primary: ${equippedWeapon.name} | Holster: ${equippedWeapon2.name}).`
          : `Equipped with ${equippedWeapon.name}.`
      }`,
      hunterTips: 'Enter combat stance to unleash full affinity potential. Switch weapons on Seikret mount for elemental adaptation.',
      likes: 18,
      createdAt: new Date().toISOString().split('T')[0],
      tags: [
        GAMES_DATA[selectedGame].shortName, 
        equippedWeapon.name, 
        isWilds ? 'Dual Weapon Wilds' : 'Standard Weapon', 
        '5-Piece Custom'
      ],
      isCustom: true,
    };
    return build;
  }, [
    buildTitle,
    currentUser,
    selectedGame,
    isWilds,
    huntingStyle,
    equippedHead,
    equippedChest,
    equippedArms,
    equippedWaist,
    equippedLegs,
    equippedWeapon,
    equippedWeapon2,
    totalDefense,
    talisman,
    aggregateSkills,
    dyes,
  ]);

  const handleSave = () => {
    onSaveBuild(currentConstructedBuild);
    setSaveSuccessNotification(true);
    confetti({ particleCount: 60, spread: 65, origin: { y: 0.6 } });
    setTimeout(() => setSaveSuccessNotification(false), 3500);
  };

  const handleCopySummary = () => {
    let text = `Monster Hunter Build: ${buildTitle} (${GAMES_DATA[selectedGame].name})\n`;
    text += `Primary Weapon: ${equippedWeapon.name} (${WEAPONS_DATA[equippedWeapon.weaponType].name}, Raw ${equippedWeapon.attackRaw}, Affinity ${equippedWeapon.affinity}%)\n`;
    if (isWilds && equippedWeapon2) {
      text += `Secondary Seikret Weapon: ${equippedWeapon2.name} (${WEAPONS_DATA[equippedWeapon2.weaponType].name}, Raw ${equippedWeapon2.attackRaw}, Affinity ${equippedWeapon2.affinity}%)\n`;
    }
    text += `5 Armor Pieces:\n`;
    text += ` - Head: ${equippedHead.name} (Def ${equippedHead.defense})\n`;
    text += ` - Chest: ${equippedChest.name} (Def ${equippedChest.defense})\n`;
    text += ` - Arms: ${equippedArms.name} (Def ${equippedArms.defense})\n`;
    text += ` - Waist: ${equippedWaist.name} (Def ${equippedWaist.defense})\n`;
    text += ` - Legs: ${equippedLegs.name} (Def ${equippedLegs.defense})\n`;
    text += `Total Defense: ${totalDefense}\n`;
    text += `Key Skills: ${aggregateSkills.map(s => `${s.name} Lv${s.level}`).join(', ')}`;
    
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Open Fine-Tune / Edit Piece Modal
  const handleOpenEditPiece = (slot: GearSlotType) => {
    setEditingPieceSlot(slot);
    if (slot === 'head') {
      setCustomPieceName(equippedHead.name);
      setCustomPieceDefense(equippedHead.defense);
      setCustomPieceMonster(equippedHead.monsterOrigin);
      setCustomPieceDecos(equippedHead.decorations?.join(', ') || '');
      setCustomPieceLayered(equippedHead.layeredName || '');
    } else if (slot === 'chest') {
      setCustomPieceName(equippedChest.name);
      setCustomPieceDefense(equippedChest.defense);
      setCustomPieceMonster(equippedChest.monsterOrigin);
      setCustomPieceDecos(equippedChest.decorations?.join(', ') || '');
      setCustomPieceLayered(equippedChest.layeredName || '');
    } else if (slot === 'arms') {
      setCustomPieceName(equippedArms.name);
      setCustomPieceDefense(equippedArms.defense);
      setCustomPieceMonster(equippedArms.monsterOrigin);
      setCustomPieceDecos(equippedArms.decorations?.join(', ') || '');
      setCustomPieceLayered(equippedArms.layeredName || '');
    } else if (slot === 'waist') {
      setCustomPieceName(equippedWaist.name);
      setCustomPieceDefense(equippedWaist.defense);
      setCustomPieceMonster(equippedWaist.monsterOrigin);
      setCustomPieceDecos(equippedWaist.decorations?.join(', ') || '');
      setCustomPieceLayered(equippedWaist.layeredName || '');
    } else if (slot === 'legs') {
      setCustomPieceName(equippedLegs.name);
      setCustomPieceDefense(equippedLegs.defense);
      setCustomPieceMonster(equippedLegs.monsterOrigin);
      setCustomPieceDecos(equippedLegs.decorations?.join(', ') || '');
      setCustomPieceLayered(equippedLegs.layeredName || '');
    }
  };

  const handleSaveEditedPiece = () => {
    const decos = customPieceDecos.split(',').map(s => s.trim()).filter(Boolean);
    if (editingPieceSlot === 'head') {
      setEquippedHead({
        ...equippedHead,
        name: customPieceName || equippedHead.name,
        defense: Number(customPieceDefense) || equippedHead.defense,
        monsterOrigin: customPieceMonster || equippedHead.monsterOrigin,
        decorations: decos.length > 0 ? decos : equippedHead.decorations,
        layeredName: customPieceLayered || equippedHead.layeredName,
      });
    } else if (editingPieceSlot === 'chest') {
      setEquippedChest({
        ...equippedChest,
        name: customPieceName || equippedChest.name,
        defense: Number(customPieceDefense) || equippedChest.defense,
        monsterOrigin: customPieceMonster || equippedChest.monsterOrigin,
        decorations: decos.length > 0 ? decos : equippedChest.decorations,
        layeredName: customPieceLayered || equippedChest.layeredName,
      });
    } else if (editingPieceSlot === 'arms') {
      setEquippedArms({
        ...equippedArms,
        name: customPieceName || equippedArms.name,
        defense: Number(customPieceDefense) || equippedArms.defense,
        monsterOrigin: customPieceMonster || equippedArms.monsterOrigin,
        decorations: decos.length > 0 ? decos : equippedArms.decorations,
        layeredName: customPieceLayered || equippedArms.layeredName,
      });
    } else if (editingPieceSlot === 'waist') {
      setEquippedWaist({
        ...equippedWaist,
        name: customPieceName || equippedWaist.name,
        defense: Number(customPieceDefense) || equippedWaist.defense,
        monsterOrigin: customPieceMonster || equippedWaist.monsterOrigin,
        decorations: decos.length > 0 ? decos : equippedWaist.decorations,
        layeredName: customPieceLayered || equippedWaist.layeredName,
      });
    } else if (editingPieceSlot === 'legs') {
      setEquippedLegs({
        ...equippedLegs,
        name: customPieceName || equippedLegs.name,
        defense: Number(customPieceDefense) || equippedLegs.defense,
        monsterOrigin: customPieceMonster || equippedLegs.monsterOrigin,
        decorations: decos.length > 0 ? decos : equippedLegs.decorations,
        layeredName: customPieceLayered || equippedLegs.layeredName,
      });
    }
    setEditingPieceSlot(null);
  };

  // Filtered items in gear picker modal
  const filteredGearOptions = useMemo(() => {
    if (!activeSlotModal) return [];
    const term = pickerSearch.toLowerCase();

    if (activeSlotModal === 'weapon' || activeSlotModal === 'weapon2') {
      return WEAPONS_DATABASE.filter(w => {
        const matchesSearch = w.name.toLowerCase().includes(term) ||
          w.monsterOrigin.toLowerCase().includes(term) ||
          WEAPONS_DATA[w.weaponType].name.toLowerCase().includes(term) ||
          w.element.toLowerCase().includes(term);
        
        if (!matchesSearch) return false;
        if (pickerFilter === 'blademaster') return WEAPONS_DATA[w.weaponType].category === 'Blademaster';
        if (pickerFilter === 'gunner') return WEAPONS_DATA[w.weaponType].category === 'Gunner';
        if (pickerFilter === 'game') return w.game === selectedGame;
        return true;
      });
    }

    let sourceList: ArmorPiece[] = [];
    if (activeSlotModal === 'head') sourceList = ARMOR_HEAD_PIECES;
    if (activeSlotModal === 'chest') sourceList = ARMOR_CHEST_PIECES;
    if (activeSlotModal === 'arms') sourceList = ARMOR_ARMS_PIECES;
    if (activeSlotModal === 'waist') sourceList = ARMOR_WAIST_PIECES;
    if (activeSlotModal === 'legs') sourceList = ARMOR_LEGS_PIECES;

    return sourceList.filter(p => {
      return (
        p.name.toLowerCase().includes(term) ||
        p.monsterOrigin.toLowerCase().includes(term) ||
        p.skills.some(s => s.name.toLowerCase().includes(term))
      );
    });
  }, [activeSlotModal, pickerSearch, pickerFilter, selectedGame]);

  const activeDrawnWeaponObj = activeDrawnWeapon === 'primary' || !isWilds ? equippedWeapon : equippedWeapon2;

  return (
    <div id="builds-workshop-page" className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Game Selector Bar & Title Header */}
      <div className="flex flex-col gap-4 p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl">
        {/* Top Row: Game selector chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold text-slate-400">Target Game Title:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(Object.keys(GAMES_DATA) as GameTitle[]).map((gKey) => {
                const g = GAMES_DATA[gKey];
                const active = selectedGame === gKey;
                return (
                  <button
                    key={gKey}
                    onClick={() => {
                      setSelectedGame(gKey);
                      if (gKey === 'wilds') {
                        setHuntingStyle('Focus Mode & Seikret');
                      } else if (gKey === 'sunbreak') {
                        setHuntingStyle('Switch Skill / Silkbind');
                      } else if (gKey === 'iceborne') {
                        setHuntingStyle('Clutch Claw & Slinger');
                      } else if (gKey === 'mhgu') {
                        setHuntingStyle('Valor');
                      } else {
                        setHuntingStyle('Guild');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      active
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                  >
                    <span>{g.shortName}</span>
                    {gKey === 'wilds' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-950 text-amber-300 font-mono">
                        Dual Weapon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
              title="Randomize Armor Pieces"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Randomize</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNotification ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={() => onOpenFashionCarousel(currentConstructedBuild)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all border border-amber-500/40"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Lookbook</span>
            </button>

            <button
              id="btn-workshop-save"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 transition-all"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Save Build</span>
            </button>
          </div>
        </div>

        {/* Second Row: Title and Wilds Dual-Weapon Notice */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black">
              <Hammer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                  Interactive Armor & Weapon Studio
                </span>
                <span className="text-xs text-slate-400">
                  Customizing 5 Armor Parts (Head, Chest, Arms, Waist, Legs) {isWilds ? '+ 2 Weapons (Wilds)' : '+ Weapon'}
                </span>
              </div>
              <input
                type="text"
                value={buildTitle}
                onChange={(e) => setBuildTitle(e.target.value)}
                className="text-lg sm:text-xl font-black text-white bg-transparent border-b border-dashed border-slate-700 focus:border-amber-500 focus:outline-none tracking-tight mt-1 w-full max-w-lg"
              />
            </div>
          </div>

          {/* Wilds Dual Weapon Callout Banner */}
          {isWilds ? (
            <div className="flex items-center gap-3 p-2.5 px-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs">
              <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold shrink-0">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-amber-200">Seikret Mount Dual-Weapon System Active</div>
                <div className="text-[11px] text-amber-300/80">
                  Monster Hunter Wilds exclusive: Customize 2 weapons and swap between them seamlessly on hunts!
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950/60 p-2 px-3 rounded-xl border border-slate-800">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Standard 1-Weapon Loadout for {GAMES_DATA[selectedGame].shortName} (Dual-weapon holster is Wilds exclusive)</span>
            </div>
          )}
        </div>
      </div>

      {saveSuccessNotification && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Build successfully saved to your hunting records and community hub!</span>
          </div>
        </div>
      )}

      {/* Preset Full Sets Quick Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        <span className="text-[11px] font-mono uppercase text-slate-400 font-bold shrink-0">
          Quick Preset 5-Piece Sets:
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

      {/* 3-Column Studio Grid: Left Armor & Weapons | Center Interactive Model | Right Attributes & Live Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Weapon Slots & Upper Armor (Head, Chest, Arms) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* WEAPONS SECTION (1 for other games, 2 for Monster Hunter Wilds) */}
          <div className="p-4 rounded-3xl bg-slate-900/95 border border-amber-500/30 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                <Sword className="w-4 h-4 text-amber-400" />
                <span>{isWilds ? 'Wilds Weapons (2 Slots)' : 'Weapon Slot'}</span>
              </div>
              {isWilds && (
                <button
                  onClick={handleSwapWeapons}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[11px] font-bold border border-amber-500/40 transition-all shadow-sm"
                  title="Swap Primary and Secondary Weapons"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Swap 1 ⇄ 2</span>
                </button>
              )}
            </div>

            {/* Weapon 1: Primary Weapon */}
            <div
              onClick={() => setActiveSlotModal('weapon')}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/70 cursor-pointer transition-all hover:bg-slate-900 group space-y-2"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                    {isWilds ? 'Slot 1: Primary' : 'Equipped Weapon'}
                  </span>
                  <span className="text-slate-400">{WEAPONS_DATA[equippedWeapon.weaponType].name}</span>
                </div>
                <span className="text-slate-500 group-hover:text-amber-300">Change Weapon →</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={equippedWeapon.image}
                  alt={equippedWeapon.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                    {equippedWeapon.name}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono mt-0.5">
                    <span>Raw <strong className="text-slate-200">{equippedWeapon.attackRaw}</strong></span>
                    <span>•</span>
                    <span>Aff <strong className={equippedWeapon.affinity >= 20 ? 'text-amber-400' : 'text-slate-200'}>{equippedWeapon.affinity}%</strong></span>
                    {equippedWeapon.element !== 'None' && (
                      <>
                        <span>•</span>
                        <span className="text-amber-300">{equippedWeapon.element} ({equippedWeapon.elementValue})</span>
                      </>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    Origin: {equippedWeapon.monsterOrigin} {equippedWeapon.specialTrait ? `• ${equippedWeapon.specialTrait}` : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Weapon 2: Secondary Seikret Holster Weapon (ONLY for Monster Hunter Wilds!) */}
            {isWilds && (
              <div
                onClick={() => setActiveSlotModal('weapon2')}
                className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all hover:bg-amber-950/30 group space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-sky-500 text-slate-950 font-black">
                      Slot 2: Seikret Holster
                    </span>
                    <span className="text-amber-300">{WEAPONS_DATA[equippedWeapon2.weaponType].name}</span>
                  </div>
                  <span className="text-amber-400 group-hover:underline">Change Weapon 2 →</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={equippedWeapon2.image}
                    alt={equippedWeapon2.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-amber-200 truncate group-hover:text-amber-300">
                      {equippedWeapon2.name}
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center gap-2 font-mono mt-0.5">
                      <span>Raw <strong className="text-slate-100">{equippedWeapon2.attackRaw}</strong></span>
                      <span>•</span>
                      <span>Aff <strong className="text-amber-300">{equippedWeapon2.affinity}%</strong></span>
                      {equippedWeapon2.element !== 'None' && (
                        <>
                          <span>•</span>
                          <span className="text-sky-300">{equippedWeapon2.element} ({equippedWeapon2.elementValue})</span>
                        </>
                      )}
                    </div>
                    <div className="text-[10px] text-amber-400/80 truncate mt-0.5">
                      Mounted Holster: {equippedWeapon2.monsterOrigin} {equippedWeapon2.specialTrait ? `• ${equippedWeapon2.specialTrait}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5 ARMOR PARTS: Part 1 - Head, Part 2 - Chest, Part 3 - Arms */}
          <div className="p-4 rounded-3xl bg-slate-900/95 border border-slate-800 space-y-3 shadow-lg">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400" />
                Upper Armor (1. Head, 2. Chest, 3. Arms)
              </span>
            </div>

            {/* 1. Head Slot Card */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all group space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-amber-400 font-bold uppercase">1. Head Armor (Visor/Helm)</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenEditPiece('head'); }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                    title="Fine-tune stats or decorations"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => setActiveSlotModal('head')}
                    className="text-amber-400 hover:underline"
                  >
                    Swap →
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveSlotModal('head')}>
                <img
                  src={equippedHead.image}
                  alt={equippedHead.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                    {equippedHead.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Def {equippedHead.defense} • {equippedHead.monsterOrigin}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {equippedHead.skills.map((sk) => (
                      <span key={sk.name} className="px-1.5 py-0.2 rounded bg-slate-900 text-[9px] text-amber-300 font-mono border border-slate-800">
                        {sk.name} +{sk.level}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Chest Slot Card */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all group space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-amber-400 font-bold uppercase">2. Chest Armor (Mail/Cuirass)</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenEditPiece('chest'); }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                    title="Fine-tune stats or decorations"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => setActiveSlotModal('chest')}
                    className="text-amber-400 hover:underline"
                  >
                    Swap →
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveSlotModal('chest')}>
                <img
                  src={equippedChest.image}
                  alt={equippedChest.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                    {equippedChest.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Def {equippedChest.defense} • {equippedChest.monsterOrigin}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {equippedChest.skills.map((sk) => (
                      <span key={sk.name} className="px-1.5 py-0.2 rounded bg-slate-900 text-[9px] text-amber-300 font-mono border border-slate-800">
                        {sk.name} +{sk.level}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Arms Slot Card */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all group space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-amber-400 font-bold uppercase">3. Arms Armor (Vambraces/Braces)</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenEditPiece('arms'); }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                    title="Fine-tune stats or decorations"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => setActiveSlotModal('arms')}
                    className="text-amber-400 hover:underline"
                  >
                    Swap →
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveSlotModal('arms')}>
                <img
                  src={equippedArms.image}
                  alt={equippedArms.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                    {equippedArms.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Def {equippedArms.defense} • {equippedArms.monsterOrigin}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {equippedArms.skills.map((sk) => (
                      <span key={sk.name} className="px-1.5 py-0.2 rounded bg-slate-900 text-[9px] text-amber-300 font-mono border border-slate-800">
                        {sk.name} +{sk.level}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Center Column: The Visual Character Model Stage with Hotspots */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-amber-500/40 p-4 sm:p-5 min-h-[540px] flex flex-col justify-between shadow-2xl">
            {/* Ambient Backlight Reactive to Dyes */}
            <div
              className="absolute inset-0 opacity-20 blur-3xl pointer-events-none transition-colors duration-500"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${dyes.primaryHex} 0%, ${dyes.secondaryHex} 60%, transparent 80%)`,
              }}
            />

            {/* Model Stage Top Bar: Stance Controls & Weapon Stance Toggle */}
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-xs font-mono text-amber-400">
                  <Dna className="w-3.5 h-3.5" />
                  <span>Hunter Model View</span>
                </div>

                {/* Dyes Color Swatch */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/90 border border-slate-800 backdrop-blur-md">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] text-slate-300 font-mono">{dyes.pigmentName.split('&')[0]}</span>
                  <span className="w-3 h-3 rounded-full border border-white/60 shadow-inner" style={{ backgroundColor: dyes.primaryHex }} />
                  <span className="w-3 h-3 rounded-full border border-white/60 shadow-inner" style={{ backgroundColor: dyes.secondaryHex }} />
                </div>
              </div>

              {/* Wilds Active Weapon Display Switcher */}
              {isWilds && (
                <div className="flex items-center justify-center gap-1.5 p-1 rounded-xl bg-slate-950/90 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 mr-1">Drawn Weapon:</span>
                  <button
                    onClick={() => setActiveDrawnWeapon('primary')}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
                      activeDrawnWeapon === 'primary'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1. {equippedWeapon.name.split(' ')[0]} (Primary)
                  </button>
                  <button
                    onClick={() => setActiveDrawnWeapon('secondary')}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
                      activeDrawnWeapon === 'secondary'
                        ? 'bg-sky-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2. {equippedWeapon2.name.split(' ')[0]} (Holster)
                  </button>
                </div>
              )}
            </div>

            {/* Main Center Character Visual Stage */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2">
              <div className="relative w-full max-w-[280px] sm:max-w-[310px] h-[380px] flex items-center justify-center">
                {/* Character Armor Visual */}
                <motion.div
                  key={`${equippedHead.id}-${equippedChest.id}-${equippedArms.id}-${equippedWaist.id}-${equippedLegs.id}-${activeDrawnWeapon}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950/80"
                >
                  <img
                    src={equippedChest.image || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=85'}
                    alt="Hunter Model Preview"
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

                  {/* Interactive Hotspots for all 5 Armor Parts + Weapons */}
                  {/* 1. Head */}
                  <button
                    onClick={() => setActiveSlotModal('head')}
                    className="absolute top-4 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-white text-[10px] font-bold border border-amber-500/60 shadow-lg backdrop-blur-md flex items-center gap-1 transition-all"
                  >
                    <span>{equippedHead.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-amber-400 opacity-80">(Head)</span>
                  </button>

                  {/* 2. Chest */}
                  <button
                    onClick={() => setActiveSlotModal('chest')}
                    className="absolute top-24 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-white text-[10px] font-bold border border-amber-500/60 shadow-lg backdrop-blur-md flex items-center gap-1 transition-all"
                  >
                    <span>{equippedChest.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-amber-400 opacity-80">(Chest)</span>
                  </button>

                  {/* 3. Arms (Left side) */}
                  <button
                    onClick={() => setActiveSlotModal('arms')}
                    className="absolute top-36 left-3 px-2 py-0.5 rounded-full bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-white text-[10px] font-bold border border-amber-500/60 shadow-lg backdrop-blur-md flex items-center gap-1 transition-all"
                  >
                    <span>{equippedArms.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-amber-400 opacity-80">(Arms)</span>
                  </button>

                  {/* 4. Waist */}
                  <button
                    onClick={() => setActiveSlotModal('waist')}
                    className="absolute top-48 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-white text-[10px] font-bold border border-amber-500/60 shadow-lg backdrop-blur-md flex items-center gap-1 transition-all"
                  >
                    <span>{equippedWaist.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-amber-400 opacity-80">(Waist)</span>
                  </button>

                  {/* 5. Legs */}
                  <button
                    onClick={() => setActiveSlotModal('legs')}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-white text-[10px] font-bold border border-amber-500/60 shadow-lg backdrop-blur-md flex items-center gap-1 transition-all"
                  >
                    <span>{equippedLegs.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-amber-400 opacity-80">(Legs)</span>
                  </button>

                  {/* Weapon 1 Hotspot (Right side) */}
                  <button
                    onClick={() => setActiveSlotModal('weapon')}
                    className="absolute top-32 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black border border-white/40 shadow-lg backdrop-blur-md flex items-center gap-1 transition-all"
                  >
                    <span>🗡️ W1: {equippedWeapon.name.split(' ')[0]}</span>
                  </button>

                  {/* Weapon 2 Hotspot (Wilds exclusive mount holster) */}
                  {isWilds && (
                    <button
                      onClick={() => setActiveSlotModal('weapon2')}
                      className="absolute bottom-16 right-3 px-2 py-0.5 rounded-full bg-sky-500 text-slate-950 text-[10px] font-black border border-white/40 shadow-lg backdrop-blur-md flex items-center gap-1 transition-all"
                    >
                      <span>🦅 W2: {equippedWeapon2.name.split(' ')[0]}</span>
                    </button>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Bottom Dye Color Swatches Palette Bar */}
            <div className="relative z-10 p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Armor Pigments:</span>
              </div>

              <div className="flex items-center gap-1.5">
                {[
                  { name: 'Imperial Amber & Cyan', p: '#d97706', s: '#0284c7' },
                  { name: 'Crimson Dragon & Nightfall', p: '#dc2626', s: '#0f172a' },
                  { name: 'Celestial Starlight Blue & Gold', p: '#3b82f6', s: '#f59e0b' },
                  { name: 'Platinum Silver & Ruby', p: '#e2e8f0', s: '#991b1b' },
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
                    className="p-1 rounded-xl border border-slate-700 hover:border-amber-400 transition-all flex items-center gap-0.5"
                    title={dyePreset.name}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dyePreset.p }} />
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dyePreset.s }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lower Armor (Waist, Legs), Talisman & Live Stat Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Lower 5 Armor Parts: Part 4 - Waist, Part 5 - Legs, plus Talisman */}
          <div className="p-4 rounded-3xl bg-slate-900/95 border border-slate-800 space-y-3 shadow-lg">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400" />
                Lower Armor (4. Waist, 5. Legs & Charm)
              </span>
            </div>

            {/* 4. Waist Slot Card */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all group space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-amber-400 font-bold uppercase">4. Waist Armor (Coil/Faulds)</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenEditPiece('waist'); }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                    title="Fine-tune stats or decorations"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => setActiveSlotModal('waist')}
                    className="text-amber-400 hover:underline"
                  >
                    Swap →
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveSlotModal('waist')}>
                <img
                  src={equippedWaist.image}
                  alt={equippedWaist.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                    {equippedWaist.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Def {equippedWaist.defense} • {equippedWaist.monsterOrigin}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {equippedWaist.skills.map((sk) => (
                      <span key={sk.name} className="px-1.5 py-0.2 rounded bg-slate-900 text-[9px] text-amber-300 font-mono border border-slate-800">
                        {sk.name} +{sk.level}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Legs Slot Card */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all group space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-amber-400 font-bold uppercase">5. Legs Armor (Greaves/Boots)</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenEditPiece('legs'); }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                    title="Fine-tune stats or decorations"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => setActiveSlotModal('legs')}
                    className="text-amber-400 hover:underline"
                  >
                    Swap →
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveSlotModal('legs')}>
                <img
                  src={equippedLegs.image}
                  alt={equippedLegs.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                    {equippedLegs.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Def {equippedLegs.defense} • {equippedLegs.monsterOrigin}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {equippedLegs.skills.map((sk) => (
                      <span key={sk.name} className="px-1.5 py-0.2 rounded bg-slate-900 text-[9px] text-amber-300 font-mono border border-slate-800">
                        {sk.name} +{sk.level}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Talisman Card */}
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
                <span className="font-bold">Talisman / Charm</span>
                <span>Lv4 Jewel Ready</span>
              </div>
              <div className="text-xs font-bold text-amber-200">{talisman.name}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {talisman.skills.map((sk) => (
                  <span key={sk.name} className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[10px] font-mono font-bold">
                    {sk.name} +{sk.level}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Live Stat Matrix */}
          <div className="p-4 rounded-3xl bg-slate-900/95 border border-slate-800 space-y-3.5 shadow-lg">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center justify-between">
              <span>Live Build Attributes</span>
              <span className="text-amber-400 font-bold">Total Def: {totalDefense}</span>
            </div>

            {/* Quick Metrics for Active Weapons */}
            <div className={`grid ${isWilds ? 'grid-cols-2' : 'grid-cols-2'} gap-2`}>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-mono">
                  {isWilds ? 'Primary Raw' : 'Weapon Raw'}
                </div>
                <div className="text-base font-bold text-white font-mono">{equippedWeapon.attackRaw}</div>
                <div className="text-[10px] text-amber-400 font-mono">{equippedWeapon.affinity}% Aff</div>
              </div>

              {isWilds ? (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-sky-500/40 text-center">
                  <div className="text-[10px] text-sky-400 uppercase font-mono">Holster Raw</div>
                  <div className="text-base font-bold text-white font-mono">{equippedWeapon2.attackRaw}</div>
                  <div className="text-[10px] text-sky-300 font-mono">{equippedWeapon2.affinity}% Aff</div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Sharpness</div>
                  <div className="text-base font-bold text-purple-400 font-mono">{equippedWeapon.sharpness}</div>
                  <div className="text-[10px] text-slate-400 font-mono">5 Armor Sum Def</div>
                </div>
              )}
            </div>

            {/* Elemental Resistances */}
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">5-Piece Elemental Resistances</div>
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
              <div className="flex items-center justify-between text-xs font-mono">
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
              <div className="space-y-1 max-h-44 overflow-y-auto scrollbar-thin pr-1">
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

      {/* MODAL 1: Slot Gear Picker Drawer / Modal */}
      <AnimatePresence>
        {activeSlotModal && (
          <div
            id="slot-picker-modal"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
            onClick={() => setActiveSlotModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[88vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Hammer className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                      {activeSlotModal === 'weapon' && 'Select Primary Weapon'}
                      {activeSlotModal === 'weapon2' && 'Select Secondary Weapon (Seikret Holster)'}
                      {activeSlotModal === 'head' && 'Select Head Armor Piece (1/5)'}
                      {activeSlotModal === 'chest' && 'Select Chest Armor Piece (2/5)'}
                      {activeSlotModal === 'arms' && 'Select Arms Armor Piece (3/5)'}
                      {activeSlotModal === 'waist' && 'Select Waist Armor Piece (4/5)'}
                      {activeSlotModal === 'legs' && 'Select Legs Armor Piece (5/5)'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Click to equip directly onto your hunter loadout
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSlotModal(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Filter Bar inside Modal */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder="Search by name, monster origin, element, or skill..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                {(activeSlotModal === 'weapon' || activeSlotModal === 'weapon2') && (
                  <div className="flex items-center gap-1 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
                    <button
                      onClick={() => setPickerFilter('all')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                        pickerFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setPickerFilter('blademaster')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                        pickerFilter === 'blademaster' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Blademaster
                    </button>
                    <button
                      onClick={() => setPickerFilter('gunner')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                        pickerFilter === 'gunner' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Gunner
                    </button>
                    <button
                      onClick={() => setPickerFilter('game')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                        pickerFilter === 'game' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {GAMES_DATA[selectedGame].shortName}
                    </button>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="overflow-y-auto space-y-2.5 flex-1 pr-1 scrollbar-thin">
                {/* Weapons (Slot 1 or Slot 2) */}
                {(activeSlotModal === 'weapon' || activeSlotModal === 'weapon2') &&
                  (filteredGearOptions as WeaponDatabaseEntry[]).map((wp) => {
                    const isCurrentlyEquipped = activeSlotModal === 'weapon'
                      ? equippedWeapon.id === wp.id
                      : equippedWeapon2?.id === wp.id;

                    return (
                      <div
                        key={wp.id}
                        onClick={() => {
                          if (activeSlotModal === 'weapon') {
                            setEquippedWeapon(wp);
                          } else {
                            setEquippedWeapon2(wp);
                          }
                          setActiveSlotModal(null);
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                          isCurrentlyEquipped
                            ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={wp.image} alt={wp.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{wp.name}</span>
                              <span className="px-2 py-0.2 rounded-full bg-slate-800 text-[10px] text-amber-300 font-mono">
                                {GAMES_DATA[wp.game]?.shortName}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400">
                              {WEAPONS_DATA[wp.weaponType].name} • Monster: {wp.monsterOrigin}
                            </div>
                            <div className="text-[11px] text-amber-400 font-mono flex items-center gap-2 mt-0.5">
                              <span>Raw <strong>{wp.attackRaw}</strong></span>
                              <span>•</span>
                              <span>{wp.affinity}% Affinity</span>
                              <span>•</span>
                              <span>{wp.sharpness} Sharpness</span>
                              {wp.element !== 'None' && <span>• {wp.element} ({wp.elementValue})</span>}
                            </div>
                            {wp.specialTrait && (
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                Trait: {wp.specialTrait}
                              </div>
                            )}
                          </div>
                        </div>
                        <button className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0">
                          {isCurrentlyEquipped ? 'Equipped' : 'Equip'}
                        </button>
                      </div>
                    );
                  })}

                {/* Armor Pieces (Head, Chest, Arms, Waist, Legs) */}
                {activeSlotModal !== 'weapon' && activeSlotModal !== 'weapon2' &&
                  (filteredGearOptions as ArmorPiece[]).map((piece) => {
                    let isEquipped = false;
                    if (activeSlotModal === 'head') isEquipped = equippedHead.id === piece.id;
                    if (activeSlotModal === 'chest') isEquipped = equippedChest.id === piece.id;
                    if (activeSlotModal === 'arms') isEquipped = equippedArms.id === piece.id;
                    if (activeSlotModal === 'waist') isEquipped = equippedWaist.id === piece.id;
                    if (activeSlotModal === 'legs') isEquipped = equippedLegs.id === piece.id;

                    return (
                      <div
                        key={piece.id}
                        onClick={() => {
                          if (activeSlotModal === 'head') setEquippedHead(piece);
                          if (activeSlotModal === 'chest') setEquippedChest(piece);
                          if (activeSlotModal === 'arms') setEquippedArms(piece);
                          if (activeSlotModal === 'waist') setEquippedWaist(piece);
                          if (activeSlotModal === 'legs') setEquippedLegs(piece);
                          setActiveSlotModal(null);
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                          isEquipped
                            ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={piece.image} alt={piece.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          <div>
                            <div className="text-sm font-bold text-white">{piece.name}</div>
                            <div className="text-xs text-slate-400">
                              Monster: <strong className="text-slate-300">{piece.monsterOrigin}</strong> • Base Defense: <strong className="text-slate-200">{piece.defense}</strong>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {piece.skills.map((sk) => (
                                <span key={sk.name} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-300 font-mono font-medium">
                                  {sk.name} +{sk.level}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0">
                          {isEquipped ? 'Equipped' : 'Equip Piece'}
                        </button>
                      </div>
                    );
                  })}

                {filteredGearOptions.length === 0 && (
                  <div className="text-center py-10 text-slate-500 text-sm">
                    No matching equipment found for query "{pickerSearch}".
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Fine-Tune / Custom Edit Piece Modal */}
      <AnimatePresence>
        {editingPieceSlot && (
          <div
            id="fine-tune-modal"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setEditingPieceSlot(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  <h4 className="text-base font-bold text-white uppercase tracking-wider">
                    Fine-Tune Armor Slot ({editingPieceSlot.toUpperCase()})
                  </h4>
                </div>
                <button
                  onClick={() => setEditingPieceSlot(null)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Piece Name</label>
                  <input
                    type="text"
                    value={customPieceName}
                    onChange={(e) => setCustomPieceName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Base Defense</label>
                    <input
                      type="number"
                      value={customPieceDefense}
                      onChange={(e) => setCustomPieceDefense(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Monster Origin</label>
                    <input
                      type="text"
                      value={customPieceMonster}
                      onChange={(e) => setCustomPieceMonster(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Decorations (comma-separated)</label>
                  <input
                    type="text"
                    value={customPieceDecos}
                    onChange={(e) => setCustomPieceDecos(e.target.value)}
                    placeholder="e.g. Critical Jewel 2, Expert Jewel+ 4"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Layered Cosmetic Skin Name</label>
                  <input
                    type="text"
                    value={customPieceLayered}
                    onChange={(e) => setCustomPieceLayered(e.target.value)}
                    placeholder="e.g. Spectral Wraith Plating"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setEditingPieceSlot(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditedPiece}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Apply Modifications
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
