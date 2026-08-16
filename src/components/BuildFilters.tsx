import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Shield, 
  Sword, 
  Sparkles, 
  ChevronDown, 
  RotateCcw,
  Check,
  Flame,
  Zap,
  Tag
} from 'lucide-react';
import { FilterState, GameTitle, WeaponType } from '../types';
import { GAMES_DATA, WEAPONS_DATA, COMMON_SKILLS_DATABASE } from '../data/monsterHunterData';

interface BuildFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalBuildsCount: number;
  filteredCount: number;
}

export const BuildFilters: React.FC<BuildFiltersProps> = ({
  filters,
  onFilterChange,
  totalBuildsCount,
  filteredCount,
}) => {
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const gameKeys = Object.keys(GAMES_DATA) as GameTitle[];
  const weaponKeys = Object.keys(WEAPONS_DATA) as WeaponType[];

  // Filter available skills by query
  const filteredSkillOptions = COMMON_SKILLS_DATABASE.filter(skill =>
    skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase())
  );

  const toggleSkill = (skillName: string) => {
    const exists = filters.selectedSkills.includes(skillName);
    const updated = exists
      ? filters.selectedSkills.filter(s => s !== skillName)
      : [...filters.selectedSkills, skillName];
    onFilterChange({ ...filters, selectedSkills: updated });
  };

  const handleResetFilters = () => {
    onFilterChange({
      searchQuery: '',
      game: 'all',
      weaponType: 'all',
      huntingStyle: 'all',
      playstyle: 'all',
      selectedSkills: [],
      minFashionRating: 0,
      sortBy: 'popular',
    });
  };

  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.game !== 'all' ||
    filters.weaponType !== 'all' ||
    filters.huntingStyle !== 'all' ||
    filters.playstyle !== 'all' ||
    filters.selectedSkills.length > 0 ||
    filters.minFashionRating > 0;

  return (
    <div id="build-filters-container" className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Top Search and Quick Actions Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="input-build-search"
            type="text"
            placeholder="Search builds, weapons, armor sets, monsters, or tags..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Sort By:</span>
          <select
            id="select-sort-order"
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="popular">🔥 Most Popular (Likes)</option>
            <option value="recent">⏱️ Newest Published</option>
            <option value="fashion_rating">✨ Highest Fashion Rating</option>
            <option value="highest_affinity">🎯 Max Affinity %</option>
            <option value="highest_defense">🛡️ Highest Defense</option>
          </select>

          {/* Reset button if filtered */}
          {hasActiveFilters && (
            <button
              id="btn-reset-filters"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Segment 1: Game Style Selector Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Game Title & Era
          </label>
          <span className="text-xs text-slate-500">
            Showing <strong className="text-amber-400 font-semibold">{filteredCount}</strong> of {totalBuildsCount} builds
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            id="filter-game-all"
            onClick={() => onFilterChange({ ...filters, game: 'all' })}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-center ${
              filters.game === 'all'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
                : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            All Games
          </button>
          {gameKeys.map((gKey) => {
            const g = GAMES_DATA[gKey];
            const isSelected = filters.game === gKey;
            return (
              <button
                key={gKey}
                id={`filter-game-${gKey}`}
                onClick={() => onFilterChange({ ...filters, game: gKey })}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-center flex flex-col items-center justify-center ${
                  isSelected
                    ? `${g.badgeColor} shadow-md ring-1 ring-amber-500/50 bg-slate-900`
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <span>{g.shortName}</span>
                <span className="text-[10px] opacity-70 font-normal truncate max-w-full">
                  {gKey === 'wilds' ? '6th Gen' : gKey === 'sunbreak' ? 'Rise' : gKey === 'iceborne' ? 'World' : gKey === 'mhgu' ? 'Styles' : '4U'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Segment 2: Weapon Class Selector */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
          <Sword className="w-3.5 h-3.5 text-amber-400" />
          Weapon Class ({weaponKeys.length} Types)
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            id="filter-weapon-all"
            onClick={() => onFilterChange({ ...filters, weaponType: 'all' })}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              filters.weaponType === 'all'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            All Weapons
          </button>
          {weaponKeys.map((wKey) => {
            const w = WEAPONS_DATA[wKey];
            const isSelected = filters.weaponType === wKey;
            return (
              <button
                key={wKey}
                id={`filter-weapon-${wKey}`}
                onClick={() => onFilterChange({ ...filters, weaponType: wKey })}
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title={w.name}
              >
                <span>{w.iconGlyph}</span>
                <span className="whitespace-nowrap">{w.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Segment 3: Detailed Armor Skills Filter & Active Skill Tags */}
      <div className="space-y-2 border-t border-slate-800/80 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Specific Armor Skills Filter ({filters.selectedSkills.length} active)
          </label>
          <div className="flex items-center gap-2">
            {/* Quick Popular Skills Chips */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-[11px] text-slate-500">Quick add:</span>
              {['Weakness Exploit', 'Critical Boost', 'Attack Boost', 'Blood Awakening', "Master's Touch"].map((popSkill) => {
                const isSelected = filters.selectedSkills.includes(popSkill);
                return (
                  <button
                    key={popSkill}
                    onClick={() => toggleSkill(popSkill)}
                    className={`px-2 py-0.5 rounded-md text-[11px] transition-all border ${
                      isSelected
                        ? 'bg-amber-500/30 text-amber-300 border-amber-500/60'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {popSkill}
                  </button>
                );
              })}
            </div>
            
            {/* Dropdown toggle for full skill picker */}
            <button
              id="btn-toggle-skills-picker"
              onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white"
            >
              <span>Select Skills</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSkillDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Selected Skill Badges */}
        {filters.selectedSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {filters.selectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-medium"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                {skill}
                <button
                  onClick={() => toggleSkill(skill)}
                  className="hover:text-white ml-0.5"
                  title={`Remove ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={() => onFilterChange({ ...filters, selectedSkills: [] })}
              className="text-[11px] text-slate-400 hover:text-amber-400 underline ml-1"
            >
              Clear Skills
            </button>
          </div>
        )}

        {/* Expanded Skill Picker Search Box */}
        {isSkillDropdownOpen && (
          <div className="p-3 bg-slate-950 border border-amber-500/30 rounded-xl space-y-2 mt-2 shadow-2xl">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search armor skills (e.g. Weakness Exploit, Agitator, Guard Up)..."
                value={skillSearchQuery}
                onChange={(e) => setSkillSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 pr-1 scrollbar-thin">
              {filteredSkillOptions.map((sk) => {
                const isChecked = filters.selectedSkills.includes(sk.name);
                return (
                  <button
                    key={sk.name}
                    onClick={() => toggleSkill(sk.name)}
                    className={`flex items-start justify-between p-2 rounded-lg text-left text-xs transition-all border ${
                      isChecked
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{sk.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{sk.description}</div>
                    </div>
                    {isChecked && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
