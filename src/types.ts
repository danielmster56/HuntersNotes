export type GameTitle = 
  | 'wilds'
  | 'sunbreak'
  | 'iceborne'
  | 'mhgu'
  | 'mh4u';

export type WeaponType = 
  | 'great_sword'
  | 'long_sword'
  | 'sword_and_shield'
  | 'dual_blades'
  | 'hammer'
  | 'hunting_horn'
  | 'lance'
  | 'gunlance'
  | 'switch_axe'
  | 'charge_blade'
  | 'insect_glaive'
  | 'light_bowgun'
  | 'heavy_bowgun'
  | 'bow';

export type HuntingStyle = 
  | 'Guild'
  | 'Striker'
  | 'Aerial'
  | 'Adept'
  | 'Valor'
  | 'Alchemy'
  | 'Switch Skill / Silkbind'
  | 'Clutch Claw & Slinger'
  | 'Focus Mode & Seikret'
  | 'Standard';

export type ElementType = 'None' | 'Fire' | 'Water' | 'Thunder' | 'Ice' | 'Dragon' | 'Blast' | 'Poison' | 'Paralysis' | 'Sleep';

export type AppPageView = 'home' | 'auth' | 'builds_workshop' | 'monsters' | 'gear_info';

export interface HunterProfile {
  id: string;
  hunterName: string;
  email: string;
  guildTitle: string; // e.g. "Supreme Wyvern Slayer", "Diva of Elgado"
  mainGame: GameTitle;
  preferredWeapon: WeaponType;
  hunterRank: number;
  masterRank: number;
  bio: string;
  avatarUrl: string;
  guildCardBadge: string;
  huntsCompleted: number;
  registeredBuildsCount: number;
  joinedDate: string;
  palicoName?: string;
}

export interface ArmorPiece {
  id?: string;
  name: string;
  monsterOrigin: string;
  defense: number;
  elementalResistances?: {
    fire: number;
    water: number;
    thunder: number;
    ice: number;
    dragon: number;
  };
  slots: number[]; // e.g. [4, 2, 1] for decoration slot levels
  decorations: string[];
  skills: { name: string; level: number }[];
  layeredName?: string;
  image?: string;
  description?: string;
}

export interface ArmorDye {
  primaryHex: string;
  secondaryHex: string;
  pigmentName?: string;
}

export interface FashionImage {
  id: string;
  title: string;
  category: 'full' | 'head' | 'chest' | 'arms' | 'waist' | 'legs' | 'weapon' | 'action';
  url: string;
  caption?: string;
}

export interface BuildSkill {
  name: string;
  level: number;
  maxLevel: number;
  category: 'offensive' | 'defensive' | 'utility' | 'set_bonus';
  description: string;
}

export interface HunterBuild {
  id: string;
  title: string;
  hunterName: string;
  hunterRank?: string;
  game: GameTitle;
  weaponType: WeaponType;
  weaponName: string;
  weaponImage?: string;
  element: ElementType;
  elementValue?: number;
  attackRaw: number;
  affinity: number; // e.g. 50%
  defenseTotal: number;
  sharpness?: 'Red' | 'Orange' | 'Yellow' | 'Green' | 'Blue' | 'White' | 'Purple';
  
  // Monster Hunter Wilds Exclusive: Seikret Mount Secondary Weapon Holster
  secondaryWeapon?: {
    weaponType: WeaponType;
    weaponName: string;
    weaponImage?: string;
    element: ElementType;
    elementValue?: number;
    attackRaw: number;
    affinity: number;
    sharpness?: 'Red' | 'Orange' | 'Yellow' | 'Green' | 'Blue' | 'White' | 'Purple';
    defenseBonus?: number;
    slots?: number[];
    decorations?: string[];
    specialTrait?: string;
  };
  
  huntingStyle: HuntingStyle;
  switchSkillsOrArts?: string[];
  playstyleCategory: 'Meta Raw' | 'Elemental' | 'Comfort / Tank' | 'Support' | 'Speedrun' | 'Fashion First' | 'Niche Meme';
  
  // Gear breakdown
  head: ArmorPiece;
  chest: ArmorPiece;
  arms: ArmorPiece;
  waist: ArmorPiece;
  legs: ArmorPiece;
  talisman: {
    name: string;
    skills: { name: string; level: number }[];
    slots: number[];
    decorations: string[];
  };

  // Aggregated Skills
  skills: BuildSkill[];
  setBonuses: string[];

  // Fashion & Visual Showcase Carousel
  fashionTitle: string;
  fashionDyes: ArmorDye;
  fashionTheme: string;
  fashionRating: number;
  gearImages: FashionImage[];
  showcaseHeroImage: string;

  // Lore & Notes
  description: string;
  hunterTips: string;
  likes: number;
  createdAt: string;
  tags: string[];
  isCustom?: boolean;
}

export interface FilterState {
  searchQuery: string;
  game: GameTitle | 'all';
  weaponType: WeaponType | 'all';
  huntingStyle: string | 'all';
  playstyle: string | 'all';
  selectedSkills: string[];
  minFashionRating: number;
  sortBy: 'popular' | 'recent' | 'highest_affinity' | 'highest_defense' | 'fashion_rating';
}

export interface MonsterEntry {
  id: string;
  name: string;
  japaneseName?: string;
  title: string; // e.g. "The White Wraith", "Silver Wing of Evil"
  game: GameTitle;
  species: 'Elder Dragon' | 'Flying Wyvern' | 'Fanged Wyvern' | 'Brute Wyvern' | 'Leviathan' | 'Temnoceran' | 'Neopteron' | 'Amphibian' | 'Piscine Wyvern' | 'Fanged Beast';
  threatLevel: number; // 1 to 10
  elements: ElementType[];
  weaknesses: { element: ElementType; rating: number; notes?: string }[]; // rating 1 to 3 stars
  ailmentWeaknesses: { ailment: string; rating: number }[];
  breakableParts: string[];
  keyMaterials: { name: string; rarity: number; source: string; dropRate: string }[];
  lore: string;
  huntTips: string[];
  image: string;
  iconBgColor: string;
  craftableSets: {
    setName: string;
    description: string;
    keySkills: string[];
  }[];
}

export interface WeaponDatabaseEntry {
  id: string;
  name: string;
  weaponType: WeaponType;
  game: GameTitle;
  monsterOrigin: string;
  attackRaw: number;
  affinity: number;
  element: ElementType;
  elementValue: number;
  defenseBonus: number;
  slots: number[];
  sharpness: 'Red' | 'Orange' | 'Yellow' | 'Green' | 'Blue' | 'White' | 'Purple';
  specialTrait?: string; // e.g. Impact Phial, Normal Shelling Lv8, Power Coating
  image: string;
}

export interface SkillDatabaseEntry {
  id: string;
  name: string;
  category: 'offensive' | 'defensive' | 'utility' | 'set_bonus';
  maxLevel: number;
  description: string;
  levelEffects: string[];
  foundOnMonsters: string[];
}

export interface ArtianRollEntry {
  id: string;
  weaponType: WeaponType;
  weaponCustomName: string;
  maxUpgradeLevel: number;
  baseAttackRaw: number;
  bonusAttackRoll: number;
  finalAttackRaw: number;
  baseAffinity: number;
  bonusAffinityRoll: number;
  finalAffinity: number;
  elementType: ElementType;
  elementRollValue: number;
  sharpnessTier: 'Green' | 'Blue' | 'White' | 'Purple';
  sharpnessGaugeRoll: string;
  decorationSlotsRoll: number[];
  defenseBonusRoll: number;
  ancientAwakeningPerk: string;
  qualityGrade: 'God Roll ★★★★★' | 'Meta Tier ★★★★' | 'Great Roll ★★★' | 'Average ★★' | 'Reroll Needed ★';
  recordedAt: string;
  hunterNotes: string;
  isFavorite?: boolean;
}

