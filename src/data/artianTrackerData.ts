import { ArtianRollEntry, WeaponType, ElementType } from '../types';

export const ARTIAN_BASE_WEAPON_STATS: Record<WeaponType, { baseRaw: number; baseAffinity: number; defaultName: string; defaultElement: ElementType }> = {
  great_sword: { baseRaw: 1440, baseAffinity: 0, defaultName: 'Artian Relic Cleaver', defaultElement: 'Dragon' },
  long_sword: { baseRaw: 1020, baseAffinity: 5, defaultName: 'Artian Saber Edge', defaultElement: 'Thunder' },
  sword_and_shield: { baseRaw: 420, baseAffinity: 10, defaultName: 'Artian Relic Buckler', defaultElement: 'Fire' },
  dual_blades: { baseRaw: 390, baseAffinity: 15, defaultName: 'Artian Ancient Twinblades', defaultElement: 'Ice' },
  hammer: { baseRaw: 1380, baseAffinity: 0, defaultName: 'Artian Core Smasher', defaultElement: 'Blast' },
  hunting_horn: { baseRaw: 1100, baseAffinity: 0, defaultName: 'Artian Resonator Horn', defaultElement: 'Dragon' },
  lance: { baseRaw: 680, baseAffinity: 5, defaultName: 'Artian Fortress Pike', defaultElement: 'Water' },
  gunlance: { baseRaw: 720, baseAffinity: 0, defaultName: 'Artian Wyverncannon', defaultElement: 'Fire' },
  switch_axe: { baseRaw: 1150, baseAffinity: 0, defaultName: 'Artian Morphing Scythe', defaultElement: 'Poison' },
  charge_blade: { baseRaw: 1180, baseAffinity: 0, defaultName: 'Artian Aegis Arm', defaultElement: 'Thunder' },
  insect_glaive: { baseRaw: 880, baseAffinity: 10, defaultName: 'Artian Aerial Staff', defaultElement: 'Dragon' },
  light_bowgun: { baseRaw: 360, baseAffinity: 10, defaultName: 'Artian Pulse Rifle', defaultElement: 'Thunder' },
  heavy_bowgun: { baseRaw: 480, baseAffinity: 0, defaultName: 'Artian Ancient Siege Cannon', defaultElement: 'None' },
  bow: { baseRaw: 380, baseAffinity: 10, defaultName: 'Artian Starshooter Bow', defaultElement: 'Water' },
};

export const ARTIAN_AWAKENING_PERKS = [
  'Artian Resonance (Element Boost +20%)',
  'Ancient Affinity Surge (+15% Critical Chance)',
  'Focus Strike Sunderer (Extra Wound DPS)',
  'Sharpness Safeguard (Razor Sharp VI)',
  'Master\'s Touch Ancient Aura',
  'Attack Surge VI (+45 True Raw)',
  'Status Overdrive (+180 Ailment Potency)',
  'Free Meal & Wide-Range Blessing',
  'Rapid Reload & Recoil Mastery',
  'Guard Up & Stamina Surge III',
];

export const INITIAL_ARTIAN_ROLLS: ArtianRollEntry[] = [
  {
    id: 'artian-roll-1',
    weaponType: 'great_sword',
    weaponCustomName: 'Ark-Artian Zenith Cleaver',
    maxUpgradeLevel: 10,
    baseAttackRaw: 1440,
    bonusAttackRoll: 140,
    finalAttackRaw: 1580,
    baseAffinity: 0,
    bonusAffinityRoll: 25,
    finalAffinity: 25,
    elementType: 'Dragon',
    elementRollValue: 420,
    sharpnessTier: 'Purple',
    sharpnessGaugeRoll: '+40 Hits Natural Purple',
    decorationSlotsRoll: [4, 4, 2],
    defenseBonusRoll: 35,
    ancientAwakeningPerk: 'Focus Strike Sunderer (Extra Wound DPS)',
    qualityGrade: 'God Roll ★★★★★',
    recordedAt: '2026-08-16',
    hunterNotes: 'Maxed at Lv10 with Ancient Red Fragments. Rolled supreme Purple sharpness and quadruple deco slots.',
    isFavorite: true,
  },
  {
    id: 'artian-roll-2',
    weaponType: 'long_sword',
    weaponCustomName: 'Artian Hyperion Tachi',
    maxUpgradeLevel: 10,
    baseAttackRaw: 1020,
    bonusAttackRoll: 110,
    finalAttackRaw: 1130,
    baseAffinity: 5,
    bonusAffinityRoll: 30,
    finalAffinity: 35,
    elementType: 'Thunder',
    elementRollValue: 380,
    sharpnessTier: 'Purple',
    sharpnessGaugeRoll: '+30 Hits Purple',
    decorationSlotsRoll: [4, 2, 1],
    defenseBonusRoll: 20,
    ancientAwakeningPerk: 'Ancient Affinity Surge (+15% Critical Chance)',
    qualityGrade: 'Meta Tier ★★★★',
    recordedAt: '2026-08-15',
    hunterNotes: 'Insane thunder elemental surge for hunting Rey Dau and Leviathan species in the Windward Plains.',
    isFavorite: true,
  },
  {
    id: 'artian-roll-3',
    weaponType: 'bow',
    weaponCustomName: 'Artian Celestial Starbow',
    maxUpgradeLevel: 10,
    baseAttackRaw: 380,
    bonusAttackRoll: 40,
    finalAttackRaw: 420,
    baseAffinity: 10,
    bonusAffinityRoll: 20,
    finalAffinity: 30,
    elementType: 'Water',
    elementRollValue: 340,
    sharpnessTier: 'White',
    sharpnessGaugeRoll: 'Close Range & Power Coating+ Lv3',
    decorationSlotsRoll: [4, 4, 1],
    defenseBonusRoll: 15,
    ancientAwakeningPerk: 'Artian Resonance (Element Boost +20%)',
    qualityGrade: 'God Roll ★★★★★',
    recordedAt: '2026-08-14',
    hunterNotes: 'Ideal rapid water bow roll for Scarlet Forest apex apex hunts.',
    isFavorite: false,
  },
  {
    id: 'artian-roll-4',
    weaponType: 'dual_blades',
    weaponCustomName: 'Artian Glacial Fangblades',
    maxUpgradeLevel: 10,
    baseAttackRaw: 390,
    bonusAttackRoll: 35,
    finalAttackRaw: 425,
    baseAffinity: 15,
    bonusAffinityRoll: 20,
    finalAffinity: 35,
    elementType: 'Ice',
    elementRollValue: 410,
    sharpnessTier: 'Purple',
    sharpnessGaugeRoll: '+50 Hits Purple Sharpness',
    decorationSlotsRoll: [4, 3, 1],
    defenseBonusRoll: 25,
    ancientAwakeningPerk: 'Sharpness Safeguard (Razor Sharp VI)',
    qualityGrade: 'God Roll ★★★★★',
    recordedAt: '2026-08-13',
    hunterNotes: 'Extreme element roll with Razor Sharp VI to preserve purple sharpness during Archdemon demon dances.',
    isFavorite: true,
  },
];

const STORAGE_KEY = 'mh_artian_tracker_rolls_v1';

export function getStoredArtianRolls(): ArtianRollEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load Artian rolls from localStorage', err);
  }
  return INITIAL_ARTIAN_ROLLS;
}

export function saveArtianRollsToStorage(rolls: ArtianRollEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rolls));
  } catch (err) {
    console.error('Failed to save Artian rolls to localStorage', err);
  }
}
