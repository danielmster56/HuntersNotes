import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  LogIn, 
  UserPlus, 
  Award, 
  Shield, 
  Sword, 
  Sparkles, 
  Check, 
  ArrowRight,
  Flame,
  Bookmark,
  Layers,
  RefreshCw,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HunterProfile, GameTitle, WeaponType } from '../types';
import { GAMES_DATA, WEAPONS_DATA } from '../data/monsterHunterData';

interface AuthPageProps {
  currentUser: HunterProfile | null;
  onLogin: (profile: HunterProfile) => void;
  onSignOut: () => void;
  onNavigateToWorkshop: () => void;
}

const PRESET_HUNTER_ACCOUNTS: HunterProfile[] = [
  {
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
  },
  {
    id: 'hunter-fiorayne',
    hunterName: 'Dame Fiorayne',
    email: 'fiorayne.elgado@kingdom.gov',
    guildTitle: 'Shield of the Kingdom',
    mainGame: 'sunbreak',
    preferredWeapon: 'sword_and_shield',
    hunterRank: 650,
    masterRank: 420,
    bio: 'Royal Knight of the Kingdom Outpost at Elgado. Master of Metsu Shoryugeki and Qurio subjugation.',
    avatarUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80',
    guildCardBadge: 'Knight Errant',
    huntsCompleted: 890,
    registeredBuildsCount: 9,
    joinedDate: '2024-06-30',
    palicoName: 'Gryff',
  },
  {
    id: 'hunter-tadaaki',
    hunterName: 'Hinoa of Kamura',
    email: 'hinoa.kamura@village.jp',
    guildTitle: 'Diva of the Shrine',
    mainGame: 'sunbreak',
    preferredWeapon: 'bow',
    hunterRank: 780,
    masterRank: 550,
    bio: 'Kamura Village Quest Maiden and sharpshooter archer. Always craving bunny dango before every hunt!',
    avatarUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
    guildCardBadge: 'Kamura Guardian',
    huntsCompleted: 1120,
    registeredBuildsCount: 8,
    joinedDate: '2024-03-26',
    palicoName: 'Mochi',
  },
];

export const AuthPage: React.FC<AuthPageProps> = ({
  currentUser,
  onLogin,
  onSignOut,
  onNavigateToWorkshop,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>(currentUser ? 'signin' : 'register');
  
  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTitle, setRegTitle] = useState('Supreme Wyvern Slayer');
  const [regGame, setRegGame] = useState<GameTitle>('wilds');
  const [regWeapon, setRegWeapon] = useState<WeaponType>('great_sword');
  const [regBio, setRegBio] = useState('An eager hunter ready to master the Forbidden Lands and forge legendary armor.');
  const [regHR, setRegHR] = useState(150);
  const [regMR, setRegMR] = useState(80);
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80');

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');

  const AVATAR_OPTIONS = [
    { url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80', label: 'Arkveld Knight' },
    { url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80', label: 'Silver Malzeno' },
    { url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80', label: 'Black Dragon' },
    { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80', label: 'Glacial Valkyrie' },
    { url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80', label: 'Thunder Wolf' },
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const newHunter: HunterProfile = {
      id: `hunter-${Date.now()}`,
      hunterName: regName.trim(),
      email: regEmail || `${regName.toLowerCase().replace(/\s+/g, '.')}@huntersguild.org`,
      guildTitle: regTitle,
      mainGame: regGame,
      preferredWeapon: regWeapon,
      hunterRank: Number(regHR) || 1,
      masterRank: Number(regMR) || 1,
      bio: regBio,
      avatarUrl: regAvatar,
      guildCardBadge: 'Registered Guild Hunter',
      huntsCompleted: 42,
      registeredBuildsCount: 1,
      joinedDate: new Date().toISOString().split('T')[0],
      palicoName: 'Palico Partner',
    };

    onLogin(newHunter);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  const handleQuickLogin = (preset: HunterProfile) => {
    onLogin(preset);
    setLoginSuccessMsg(`Logged in as ${preset.hunterName}`);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setLoginSuccessMsg(''), 3000);
  };

  const gameKeys = Object.keys(GAMES_DATA) as GameTitle[];
  const weaponKeys = Object.keys(WEAPONS_DATA) as WeaponType[];

  return (
    <div id="auth-page-container" className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                Hunter Guild Registration Office
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Hunter Guild Card & Profile Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Register your hunter identity, configure your weapon specialization, track HR/MR credentials, and publish your custom builds to the guild archive.
            </p>
          </div>

          <button
            onClick={onNavigateToWorkshop}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/25 transition-all self-start sm:self-auto shrink-0"
          >
            <span>Go to Builds Workshop</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Hunter Guild Card If Logged In */}
      {currentUser && (
        <section id="active-guild-card" className="rounded-3xl bg-slate-900/90 border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                  Active Guild Card Credentials
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {currentUser.hunterName}
                </h3>
              </div>
            </div>

            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Avatar & Badges */}
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.hunterName}
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 rounded-3xl object-cover border-2 border-amber-500 shadow-xl"
                />
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black font-mono shadow-md">
                  HR {currentUser.hunterRank}
                </span>
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-amber-300 text-xs font-bold border border-slate-700">
                  {currentUser.guildTitle}
                </span>
                <p className="text-xs text-slate-400 mt-1">{currentUser.email}</p>
              </div>
            </div>

            {/* Guild Stats Grid */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Hunter Rank</div>
                  <div className="text-lg font-black text-amber-400 font-mono">HR {currentUser.hunterRank}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Master Rank</div>
                  <div className="text-lg font-black text-amber-300 font-mono">MR {currentUser.masterRank}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Total Hunts</div>
                  <div className="text-lg font-black text-white font-mono">{currentUser.huntsCompleted}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Main Weapon</div>
                  <div className="text-xs font-bold text-slate-200 mt-1 truncate">
                    {WEAPONS_DATA[currentUser.preferredWeapon]?.name || 'Great Sword'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Hunter Biography & Guild Shoutout
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{currentUser.bio}"
                </p>
                <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-900">
                  <span>Guild Member Since: {currentUser.joinedDate}</span>
                  <span>Companion: {currentUser.palicoName || 'Palico'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tabs: Sign In / Register / Switch Hunters */}
      <div className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
        <div className="flex border-b border-slate-800 bg-slate-950">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-4 text-center text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'signin'
                ? 'border-amber-500 text-amber-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Quick Hunter Switch</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 text-center text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'border-amber-500 text-amber-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Hunter Profile</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {loginSuccessMsg && (
            <div className="mb-6 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{loginSuccessMsg}</span>
            </div>
          )}

          {activeTab === 'signin' ? (
            <div className="space-y-6">
              <div className="max-w-lg mx-auto text-center space-y-2">
                <h4 className="text-lg font-bold text-white">Select a Guild Hunter Profile</h4>
                <p className="text-xs text-slate-400">
                  Switch instantly into any legendary hunter profile or enter your custom hunter email below.
                </p>
              </div>

              {/* Preset Quick Switch Accounts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PRESET_HUNTER_ACCOUNTS.map((preset) => {
                  const isCurrent = currentUser?.id === preset.id;
                  return (
                    <div
                      key={preset.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/40'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={preset.avatarUrl}
                          alt={preset.hunterName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-2xl object-cover border border-amber-500/40"
                        />
                        <div className="min-w-0">
                          <h5 className="text-sm font-bold text-white truncate">{preset.hunterName}</h5>
                          <p className="text-[11px] text-amber-400 font-mono">HR {preset.hunterRank} • MR {preset.masterRank}</p>
                          <span className="text-[10px] text-slate-400 truncate block">{preset.guildTitle}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 italic">
                        "{preset.bio}"
                      </p>

                      <button
                        onClick={() => handleQuickLogin(preset)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isCurrent
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200'
                        }`}
                      >
                        {isCurrent ? <Check className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
                        <span>{isCurrent ? 'Active Profile' : 'Sign In as This Hunter'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Or manual email login */}
              <div className="pt-4 border-t border-slate-800 max-w-md mx-auto space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Or Sign In with Hunter Name / Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. your_hunter_name or hunter@guild.org"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => {
                      if (!loginEmail.trim()) return;
                      const customProfile: HunterProfile = {
                        id: `hunter-${Date.now()}`,
                        hunterName: loginEmail.split('@')[0],
                        email: loginEmail.includes('@') ? loginEmail : `${loginEmail}@huntersguild.org`,
                        guildTitle: 'Commission Specialist',
                        mainGame: 'wilds',
                        preferredWeapon: 'great_sword',
                        hunterRank: 120,
                        masterRank: 50,
                        bio: 'Custom registered hunter profile in the Guild database.',
                        avatarUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
                        guildCardBadge: 'Master Hunter',
                        huntsCompleted: 75,
                        registeredBuildsCount: 2,
                        joinedDate: new Date().toISOString().split('T')[0],
                      };
                      handleQuickLogin(customProfile);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                  >
                    Enter
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Register New Hunter Form */
            <form onSubmit={handleRegister} className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Hunter Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Minoto the Valiant"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Guild Title
                    </label>
                    <input
                      type="text"
                      value={regTitle}
                      onChange={(e) => setRegTitle(e.target.value)}
                      placeholder="e.g. Supreme Wyvern Slayer"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Specialized Main Game
                    </label>
                    <select
                      value={regGame}
                      onChange={(e) => setRegGame(e.target.value as GameTitle)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {gameKeys.map((k) => (
                        <option key={k} value={k}>
                          {GAMES_DATA[k].name} ({GAMES_DATA[k].era})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Preferred Weapon Class
                    </label>
                    <select
                      value={regWeapon}
                      onChange={(e) => setRegWeapon(e.target.value as WeaponType)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {weaponKeys.map((w) => (
                        <option key={w} value={w}>
                          {WEAPONS_DATA[w].name} ({WEAPONS_DATA[w].category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Hunter Rank (HR)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={regHR}
                      onChange={(e) => setRegHR(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Master Rank (MR)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={regMR}
                      onChange={(e) => setRegMR(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    Choose Guild Avatar Portrait
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {AVATAR_OPTIONS.map((av) => (
                      <button
                        type="button"
                        key={av.url}
                        onClick={() => setRegAvatar(av.url)}
                        className={`relative rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                          regAvatar === av.url ? 'border-amber-500 ring-2 ring-amber-500/40 scale-105' : 'border-slate-800 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={av.url} alt={av.label} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Hunter Bio / Guild Shoutout
                  </label>
                  <textarea
                    rows={2}
                    value={regBio}
                    onChange={(e) => setRegBio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-extrabold shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 stroke-[3]" />
                <span>Register Hunter Profile & Enter Guild</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
