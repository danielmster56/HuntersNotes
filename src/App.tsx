/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Plus, 
  Sword, 
  Shield, 
  Flame, 
  Zap, 
  Filter, 
  Layers, 
  Palette, 
  Heart, 
  BookOpen,
  ArrowRight,
  RefreshCw,
  Search,
  Hammer,
  Compass,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HunterBuild, FilterState, AppPageView, HunterProfile, GameTitle } from './types';
import { 
  getStoredBuilds, 
  saveBuildToStorage, 
  toggleBuildLikeInStorage, 
  GAMES_DATA, 
  WEAPONS_DATA 
} from './data/monsterHunterData';
import { Navbar } from './components/Navbar';
import { BuildFilters } from './components/BuildFilters';
import { BuildCard } from './components/BuildCard';
import { BuildModal } from './components/BuildModal';
import { BuildRegistrationModal } from './components/BuildRegistrationModal';
import { FashionSpotlight } from './components/FashionSpotlight';
import { GuildGuideModal } from './components/GuildGuideModal';
import { GearCarousel } from './components/GearCarousel';
import { AuthPage } from './components/AuthPage';
import { BuildsWorkshopPage } from './components/BuildsWorkshopPage';
import { MonstersPage } from './components/MonstersPage';
import { GearInfoPage } from './components/GearInfoPage';
import { GameSelectorCarousel } from './components/GameSelectorCarousel';
import { GameHubSearch } from './components/GameHubSearch';

const CURRENT_USER_STORAGE_KEY = 'mh_current_user_profile_v1';

export default function App() {
  const [builds, setBuilds] = useState<HunterBuild[]>(() => getStoredBuilds());
  const [currentPage, setCurrentPage] = useState<AppPageView>('home');
  const [selectedGame, setSelectedGame] = useState<GameTitle>('wilds');
  const [focusedMonster, setFocusedMonster] = useState<string | undefined>(undefined);
  const [focusedGear, setFocusedGear] = useState<string | undefined>(undefined);
  const [focusedGearTab, setFocusedGearTab] = useState<'weapons' | 'armor' | 'skills'>('weapons');
  
  // Current Logged-in Hunter Profile
  const [currentUser, setCurrentUser] = useState<HunterProfile | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      id: 'hunter-aiden',
      hunterName: 'Ace Commander Aiden',
      email: 'aiden.ace@huntersguild.org',
      guildTitle: 'Pride of Dundorma',
      mainGame: 'wilds',
      preferredWeapon: 'great_sword',
      hunterRank: 999,
      masterRank: 999,
      bio: 'Veteran Ace Hunter dedicated to uncovering the ancient secrets of the Forbidden Lands. True Charged Slash specialist.',
      avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
      guildCardBadge: 'Master Rank ★★★',
      huntsCompleted: 1420,
      registeredBuildsCount: 14,
      joinedDate: '2025-01-10',
      palicoName: 'Sir Felyne',
    };
  });

  const handleLogin = (profile: HunterProfile) => {
    setCurrentUser(profile);
    try {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    game: 'all',
    weaponType: 'all',
    huntingStyle: 'all',
    playstyle: 'all',
    selectedSkills: [],
    minFashionRating: 0,
    sortBy: 'popular',
  });

  // Modal States
  const [selectedBuild, setSelectedBuild] = useState<HunterBuild | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isFashionSpotlightOpen, setIsFashionSpotlightOpen] = useState(false);
  const [isGuildGuideOpen, setIsGuildGuideOpen] = useState(false);
  const [initialFashionBuildId, setInitialFashionBuildId] = useState<string | undefined>(undefined);
  const [builderTemplate, setBuilderTemplate] = useState<HunterBuild | null>(null);

  // Filtered & Sorted Builds
  const filteredBuilds = useMemo(() => {
    return builds.filter((build) => {
      // Game Filter
      if (filters.game !== 'all' && build.game !== filters.game) {
        return false;
      }

      // Weapon Filter
      if (filters.weaponType !== 'all' && build.weaponType !== filters.weaponType) {
        return false;
      }

      // Hunting Style
      if (filters.huntingStyle !== 'all' && build.huntingStyle !== filters.huntingStyle) {
        return false;
      }

      // Playstyle
      if (filters.playstyle !== 'all' && build.playstyleCategory !== filters.playstyle) {
        return false;
      }

      // Skills Filter (must contain all selected skills)
      if (filters.selectedSkills.length > 0) {
        const buildSkillNames = build.skills.map((s) => s.name.toLowerCase());
        const hasAllSkills = filters.selectedSkills.every((reqSkill) =>
          buildSkillNames.includes(reqSkill.toLowerCase())
        );
        if (!hasAllSkills) return false;
      }

      // Fashion Rating threshold
      if (filters.minFashionRating > 0 && build.fashionRating < filters.minFashionRating) {
        return false;
      }

      // Search Query (title, hunter, weapon name, monster, tags, description)
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = build.title.toLowerCase().includes(query);
        const matchesHunter = build.hunterName.toLowerCase().includes(query);
        const matchesWeapon = build.weaponName.toLowerCase().includes(query);
        const matchesMonster = [
          build.head.monsterOrigin,
          build.chest.monsterOrigin,
          build.arms.monsterOrigin,
          build.waist.monsterOrigin,
          build.legs.monsterOrigin,
        ].some((m) => m.toLowerCase().includes(query));
        const matchesTags = build.tags.some((t) => t.toLowerCase().includes(query));
        const matchesDesc = build.description.toLowerCase().includes(query);
        const matchesFashion = build.fashionTitle.toLowerCase().includes(query);

        if (!matchesTitle && !matchesHunter && !matchesWeapon && !matchesMonster && !matchesTags && !matchesDesc && !matchesFashion) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'fashion_rating':
          return b.fashionRating - a.fashionRating;
        case 'highest_affinity':
          return b.affinity - a.affinity;
        case 'highest_defense':
          return b.defenseTotal - a.defenseTotal;
        case 'popular':
        default:
          return (b.likes || 0) - (a.likes || 0);
      }
    });
  }, [builds, filters]);

  // Builds specific to chosen game for clean showcase
  const gameSpecificBuilds = useMemo(() => {
    return builds.filter((b) => b.game === selectedGame);
  }, [builds, selectedGame]);

  // Handlers
  const handleSaveBuild = (newBuild: HunterBuild) => {
    const updated = saveBuildToStorage(newBuild);
    setBuilds(updated);
    setSelectedBuild(newBuild);
  };

  const handleLikeBuild = (buildId: string) => {
    const { builds: updated } = toggleBuildLikeInStorage(buildId);
    setBuilds(updated);
    if (selectedBuild && selectedBuild.id === buildId) {
      setSelectedBuild((prev) => (prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null));
    }
  };

  const handleOpenFashionCarousel = (build: HunterBuild) => {
    setInitialFashionBuildId(build.id);
    setIsFashionSpotlightOpen(true);
  };

  const handleForkBuild = (build: HunterBuild) => {
    setBuilderTemplate({
      ...build,
      id: `mh-fork-${Date.now()}`,
      title: `${build.title} (Customized)`,
      hunterName: currentUser?.hunterName || 'Your Hunter Name',
      likes: 1,
    });
    setIsRegisterModalOpen(true);
  };

  // Navigations with game context
  const handleLaunchWorkshop = (game: GameTitle, gearPiece?: string) => {
    setSelectedGame(game);
    setFocusedGear(gearPiece);
    setCurrentPage('builds_workshop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchMonsters = (game: GameTitle, monsterName?: string) => {
    setSelectedGame(game);
    setFocusedMonster(monsterName);
    setCurrentPage('monsters');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchGearInfo = (game: GameTitle, tab: 'weapons' | 'armor' | 'skills' = 'weapons') => {
    setSelectedGame(game);
    setFocusedGearTab(tab);
    setCurrentPage('gear_info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="monster-hunter-app" className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      {/* Top Guild Navigation with Dropdown Menu */}
      <Navbar
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={(page: AppPageView) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSignOut={handleSignOut}
        onOpenRegisterModal={() => {
          setBuilderTemplate(null);
          setIsRegisterModalOpen(true);
        }}
        onOpenFashionSpotlight={() => {
          setInitialFashionBuildId(undefined);
          setIsFashionSpotlightOpen(true);
        }}
        onOpenGuildGuide={() => setIsGuildGuideOpen(true)}
        totalBuildsCount={builds.length}
      />

      {/* Main Dynamic Multi-Page Router */}
      <main className="flex-1 w-full">
        {/* Page 1: Auth / Register / Login Profile */}
        {currentPage === 'auth' && (
          <AuthPage
            currentUser={currentUser}
            onLogin={handleLogin}
            onSignOut={handleSignOut}
            onNavigateToWorkshop={() => setCurrentPage('builds_workshop')}
          />
        )}

        {/* Page 2: Builds Workshop (Armor Swap on Central Model) */}
        {currentPage === 'builds_workshop' && (
          <BuildsWorkshopPage
            currentUser={currentUser}
            initialGame={selectedGame}
            initialGearToEquip={focusedGear}
            onSaveBuild={handleSaveBuild}
            onOpenFashionCarousel={handleOpenFashionCarousel}
          />
        )}

        {/* Page 3: Monsters Info Bestiary */}
        {currentPage === 'monsters' && (
          <MonstersPage
            initialGame={selectedGame}
            initialMonsterName={focusedMonster}
            onNavigateToWorkshopWithMonster={(monsterName: string) => {
              handleLaunchWorkshop(selectedGame, monsterName);
            }}
          />
        )}

        {/* Page 4: Gear Info Directory */}
        {currentPage === 'gear_info' && (
          <GearInfoPage
            initialGame={selectedGame}
            initialTab={focusedGearTab}
            onNavigateToWorkshop={(gearName: string) => {
              handleLaunchWorkshop(selectedGame, gearName);
            }}
          />
        )}

        {/* Page 5: Clean Front Page with Game Selection Carousel & Game Search Hub */}
        {currentPage === 'home' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
            {/* 1. Game Selection Carousel */}
            <GameSelectorCarousel
              selectedGame={selectedGame}
              onSelectGame={(game: GameTitle) => {
                setSelectedGame(game);
                setFilters((prev: FilterState) => ({ ...prev, game: 'all' }));
              }}
              onLaunchWorkshop={(game: GameTitle) => handleLaunchWorkshop(game)}
              onLaunchMonsters={(game: GameTitle) => handleLaunchMonsters(game)}
              onLaunchGearInfo={(game: GameTitle) => handleLaunchGearInfo(game)}
            />

            {/* 2. Game-Specific Search & Exploration Hub */}
            <GameHubSearch
              selectedGame={selectedGame}
              onNavigateToWorkshop={(gear: string) => handleLaunchWorkshop(selectedGame, gear)}
              onNavigateToMonsters={(monster: string) => handleLaunchMonsters(selectedGame, monster)}
              onNavigateToGearInfo={(tab: 'weapons' | 'armor' | 'skills') => handleLaunchGearInfo(selectedGame, tab)}
              onSelectBuild={(build: HunterBuild) => setSelectedBuild(build)}
              allBuilds={builds}
            />

            {/* 3. Clean Curated Community Builds Showcase */}
            <section id="builds-showcase-section" className="space-y-6 pt-4 border-t border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
                      <Sword className="w-3.5 h-3.5 text-amber-400" />
                      Guild Showcase
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${GAMES_DATA[selectedGame].badgeColor}`}>
                      {GAMES_DATA[selectedGame].shortName}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                    Featured Hunter Loadouts & Fashion Showcases
                  </h3>
                </div>

                {/* Filter and Register buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setBuilderTemplate(null);
                      setIsRegisterModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register New Build</span>
                  </button>
                </div>
              </div>

              {/* Multi-Game Filter Bar */}
              <BuildFilters
                filters={filters}
                onFilterChange={setFilters}
                totalBuildsCount={builds.length}
                filteredCount={filteredBuilds.length}
              />

              {/* Grid of Builds */}
              {filteredBuilds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredBuilds.map((build) => (
                    <BuildCard
                      key={build.id}
                      build={build}
                      onSelectBuild={(b) => setSelectedBuild(b)}
                      onOpenFashionCarousel={handleOpenFashionCarousel}
                      onLikeBuild={handleLikeBuild}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h4 className="text-lg font-bold text-white">No Builds Match Your Filter Criteria</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Try clearing some skill or weapon filters, or be the first hunter to register a new build for {GAMES_DATA[selectedGame].name}!
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() =>
                        setFilters({
                          searchQuery: '',
                          game: 'all',
                          weaponType: 'all',
                          huntingStyle: 'all',
                          playstyle: 'all',
                          selectedSkills: [],
                          minFashionRating: 0,
                          sortBy: 'popular',
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                    >
                      Reset All Filters
                    </button>
                    <button
                      onClick={() => {
                        setBuilderTemplate(null);
                        setIsRegisterModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                    >
                      Register New Build
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Guild Hall Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Sword className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-300">Monster Hunter Build & Fashion Hub</span>
          </div>
          <div>
            Built for Hunters across Monster Hunter Wilds, Sunbreak, Iceborne, MHGU, and MH4U.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentPage('monsters')} className="hover:text-amber-400">
              Monsters Info
            </button>
            <button onClick={() => setCurrentPage('gear_info')} className="hover:text-amber-400">
              Gear Info
            </button>
            <button onClick={() => setCurrentPage('builds_workshop')} className="hover:text-amber-400">
              Builds Workshop
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BuildModal
        build={selectedBuild}
        isOpen={Boolean(selectedBuild)}
        onClose={() => setSelectedBuild(null)}
        onLikeBuild={handleLikeBuild}
        onForkBuild={handleForkBuild}
      />

      <BuildRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setBuilderTemplate(null);
        }}
        onSaveBuild={handleSaveBuild}
        initialBuild={builderTemplate}
      />

      <FashionSpotlight
        isOpen={isFashionSpotlightOpen}
        onClose={() => setIsFashionSpotlightOpen(false)}
        builds={builds}
        initialBuildId={initialFashionBuildId}
        onSelectBuild={(b) => setSelectedBuild(b)}
        onLikeBuild={handleLikeBuild}
      />

      <GuildGuideModal
        isOpen={isGuildGuideOpen}
        onClose={() => setIsGuildGuideOpen(false)}
      />
    </div>
  );
}
