import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trophy, Zap, LogOut, Camera, Home, Calendar, Clock, Award, Swords } from 'lucide-react';

const Profile = () => {
  const { user, logout, updateProfile, AVATARS, getAvatarUrl } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Mock Data for "Recent Activity" to make it look engaging
  const recentMatches = [
    { id: 1, opponent: "DevSlayer99", result: "WIN", mode: "Rapid Duel", date: "2 hrs ago", lang: "Python", elo: "+24" },
    { id: 2, opponent: "BugHunter_X", result: "LOSS", mode: "Bug Hunt", date: "5 hrs ago", lang: "JS", elo: "-12" },
    { id: 3, opponent: "AlgoQueen", result: "WIN", mode: "Complexity Duel", date: "1 day ago", lang: "C++", elo: "+31" },
  ];

  // Mock Data for "Badges"
  const badges = [
    { name: "First Blood", icon: "⚔️", desc: "Won your first duel" },
    { name: "Speedster", icon: "⚡", desc: "Solved in < 1 min" },
    { name: "Bug Hunter", icon: "🐞", desc: "Fixed 50 bugs" },
    { name: "Sharpshooter", icon: "🎯", desc: "100% Accuracy" },
  ];

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAvatarSelect = (id) => {
    updateProfile({ avatarId: id });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto"> {/* Increased width for better layout */}
        
        {/* --- HEADER SECTION --- */}
        <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl mb-8">
          
          {/* Avatar Circle */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.2)] bg-[#020617]">
              <img 
                src={getAvatarUrl(user.avatarId)} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="absolute bottom-2 right-2 bg-cyan-500 text-[#020617] p-2.5 rounded-full shadow-lg hover:bg-cyan-400 transition-colors z-10"
              title="Change Avatar"
            >
              <Camera size={18} />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl font-black text-white mb-2">{user.username}</h1>
            <p className="text-gray-400 font-mono mb-6">{user.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="bg-[#1e293b] border border-white/5 px-4 py-2 rounded-lg text-emerald-400 font-bold text-sm flex items-center gap-2">
                <Trophy size={16} /> Rank: {user.rating} (Novice)
              </span>
              <span className="bg-[#1e293b] border border-white/5 px-4 py-2 rounded-lg text-cyan-400 font-bold text-sm flex items-center gap-2">
                <Swords size={16} /> Battles: {user.battles}
              </span>
            </div>
          </div>

          {/* Action Buttons (Top Right) */}
          <div className="absolute top-6 right-6 flex gap-3">
             {/* 1. HOME BUTTON (Direct Route) */}
             <button
                onClick={() => navigate('/')}
                className="bg-[#1e293b] hover:bg-white/10 text-gray-300 hover:text-white p-2.5 rounded-xl transition-all border border-white/5 shadow-lg"
                title="Back to Home"
             >
                <Home size={20} />
             </button>
             
             {/* 2. LOGOUT BUTTON */}
             <button 
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2.5 rounded-xl transition-all border border-red-500/20 shadow-lg"
                title="Logout"
             >
                <LogOut size={20} />
             </button>
          </div>
        </div>

        {/* --- AVATAR EDITOR (Conditional) --- */}
        {isEditing && (
          <div className="mb-8 bg-[#1e293b] p-8 rounded-2xl border border-white/10 animate-fade-in">
            <h3 className="text-white font-bold mb-6 text-center">Select Your Identity</h3>
            <div className="flex gap-6 justify-center flex-wrap">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => handleAvatarSelect(av.id)}
                  className={`w-20 h-20 rounded-full overflow-hidden hover:scale-110 transition-transform border-4 bg-[#020617] ${user.avatarId === av.id ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'border-transparent grayscale hover:grayscale-0'}`}
                >
                  <img src={av.url} alt="Avatar Option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- MAIN DASHBOARD CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Stats & Recent Matches */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Key Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#0f172a] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Win Rate</div>
                        <div className="text-2xl font-black text-white">42%</div>
                        <div className="w-full bg-gray-800 h-1 mt-3 rounded-full overflow-hidden">
                            <div className="bg-cyan-500 h-full w-[42%]"></div>
                        </div>
                    </div>
                    <div className="bg-[#0f172a] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Favorite</div>
                        <div className="text-2xl font-black text-white">Rapid Duel</div>
                    </div>
                    <div className="bg-[#0f172a] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Streak</div>
                        <div className="text-2xl font-black text-white flex items-center gap-2">
                            2 <span className="text-orange-500 text-sm">🔥</span>
                        </div>
                    </div>
                </div>

                {/* 2. Recent Battle History */}
                <div>
                     <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                        <Calendar className="text-cyan-400" size={20} /> Recent Battles
                    </h3>
                    <div className="space-y-3">
                        {recentMatches.map((match) => (
                            <div key={match.id} className="bg-[#0f172a] border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-[#1e293b] transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${match.result === 'WIN' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {match.result}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">vs {match.opponent}</h4>
                                        <p className="text-xs text-gray-500 font-mono">{match.mode} • {match.lang}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`font-bold text-sm ${match.result === 'WIN' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {match.elo} ELO
                                    </span>
                                    <p className="text-[10px] text-gray-500 flex items-center justify-end gap-1 mt-1">
                                        <Clock size={10} /> {match.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Badges & Progress */}
            <div className="space-y-6">
                 <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                        <Award className="text-yellow-400" size={20} /> Achievements
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {badges.map((badge, i) => (
                            <div key={i} className="bg-[#0f172a] border border-white/5 p-4 rounded-xl flex flex-col items-center text-center hover:bg-[#1e293b] hover:border-yellow-500/20 transition-all cursor-default">
                                <div className="text-3xl mb-2 filter drop-shadow-md">{badge.icon}</div>
                                <div className="font-bold text-white text-xs mb-1">{badge.name}</div>
                                <div className="text-[10px] text-gray-500 leading-tight">{badge.desc}</div>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* Next Goal Tracker */}
                 <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-cyan-500/20 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <h4 className="text-sm font-bold text-white mb-1">Next Milestone</h4>
                    <p className="text-xs text-gray-400 mb-4">Win 5 more matches to reach <span className="text-cyan-400 font-bold">Apprentice</span></p>
                    
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                        <span>1200 XP</span>
                        <span>1500 XP</span>
                    </div>
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-[65%] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;