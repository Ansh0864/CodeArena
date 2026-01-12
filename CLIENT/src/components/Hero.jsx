import React, { useState, useEffect } from 'react';
import { Users, Zap, Code2, ChevronRight, Terminal, Sword } from 'lucide-react';

const Hero = () => {
  // --- STATE FOR ANIMATIONS ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [typedCodeLeft, setTypedCodeLeft] = useState('');
  const [typedCodeRight, setTypedCodeRight] = useState('');
  
  // Matchmaking State
  const [opponent, setOpponent] = useState({ name: "Searching...", rating: "---", color: "from-gray-700 to-gray-800" });
  const [matchFound, setMatchFound] = useState(false);

  // --- DATA ---

  // Code snippets to type out
  const codeLeftFull = `function solve(n) {\n  if (n <= 1) return n;\n  return solve(n-1);\n}`;
  const codeRightFull = `def binary_search(arr, x):\n   low = 0, len(arr)\n   while low < high:\n      mid = (low + high) // 2`;

  // Floating Languages Data
  const languages = [
    { label: "JS", color: "text-yellow-400", left: "10%", delay: "0s", duration: "15s" },
    { label: "PY", color: "text-blue-400", left: "25%", delay: "5s", duration: "18s" },
    { label: "C++", color: "text-blue-600", left: "40%", delay: "2s", duration: "20s" },
    { label: "GO", color: "text-cyan-400", left: "60%", delay: "8s", duration: "17s" },
    { label: "TS", color: "text-blue-500", left: "75%", delay: "12s", duration: "22s" },
    { label: "RS", color: "text-orange-500", left: "85%", delay: "4s", duration: "19s" },
    { label: "JV", color: "text-red-500", left: "95%", delay: "10s", duration: "25s" },
  ];

  // Dummy Opponents for Slot Machine Effect
  const possibleOpponents = [
    { name: "ByteWarrior", rating: 1740, color: "from-red-500 to-red-700" },
    { name: "NullPtr", rating: 1650, color: "from-blue-500 to-blue-700" },
    { name: "AlgoQueen", rating: 1890, color: "from-pink-500 to-pink-700" },
    { name: "RustAce", rating: 1910, color: "from-orange-500 to-orange-700" },
    { name: "VimUser", rating: 1580, color: "from-green-500 to-green-700" },
  ];

  // --- EFFECTS ---

  // 1. Mouse Parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2. Typewriter Effect
  useEffect(() => {
    let i = 0;
    let j = 0;
    const typeSpeed = 50; 

    const typeLeft = setInterval(() => {
      setTypedCodeLeft(codeLeftFull.slice(0, i));
      i++;
      if (i > codeLeftFull.length) i = 0; 
    }, typeSpeed);

    const typeRight = setInterval(() => {
      setTypedCodeRight(codeRightFull.slice(0, j));
      j++;
      if (j > codeRightFull.length) j = 0; 
    }, typeSpeed);

    return () => { clearInterval(typeLeft); clearInterval(typeRight); };
  }, []);

  // 3. Matchmaking Simulation (Slot Machine)
  useEffect(() => {
    const cycleSpeed = 80; // Fast cycling
    const duration = 2500; // Search time

    const interval = setInterval(() => {
      const randomOp = possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)];
      setOpponent(randomOp);
    }, cycleSpeed);

    const stopSearch = setTimeout(() => {
      clearInterval(interval);
      setOpponent({ name: "Player 2", rating: 1823, color: "from-purple-500 to-purple-700" });
      setMatchFound(true);
    }, duration);

    return () => { clearInterval(interval); clearTimeout(stopSearch); };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-32 pb-12 bg-[#020617]">
      
      {/* --- INJECT STYLES --- */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-20vh) scale(1); opacity: 0; }
        }
      `}</style>

      {/* --- BACKGROUND LAYERS --- */}
      
      {/* 1. Intense Central Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen animate-pulse"
        style={{ transform: `translate(${-mousePos.x * 2}px, ${-mousePos.y * 2}px) translateX(-50%)` }}
      ></div>
      
      {/* 2. Secondary Cyan Highlight */}
      <div 
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none z-0"
        style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px) translateX(-50%)` }}
      ></div>

      {/* 3. Tech Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)', 
             backgroundSize: '50px 50px',
             transform: `scale(1.05)` 
           }}>
      </div>

      {/* 4. Floating Language Icons (Bubbles) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {languages.map((lang, index) => (
          <div
            key={index}
            className={`absolute bottom-0 font-black text-2xl md:text-4xl opacity-0 ${lang.color} blur-[2px]`}
            style={{
              left: lang.left,
              animation: `floatUp ${lang.duration} linear infinite`,
              animationDelay: lang.delay
            }}
          >
             {lang.label}
          </div>
        ))}
      </div>

      {/* --- MOVING SWORDS --- */}
      
      <div 
        className="absolute top-20 left-10 lg:left-32 opacity-10 pointer-events-none z-0 transition-transform duration-100 ease-out"
        style={{ 
           transform: `translate(${mousePos.x * 4}px, ${mousePos.y * 4}px)`,
           animation: 'logo-spin 20s linear infinite' 
        }}
      >
        <Sword size={300} className="text-cyan-500" />
      </div>

      <div 
        className="absolute bottom-20 right-10 lg:right-32 opacity-10 pointer-events-none z-0 transition-transform duration-100 ease-out"
        style={{ 
           transform: `translate(${-mousePos.x * 4}px, ${-mousePos.y * 4}px)`,
           animation: 'logo-spin 25s linear infinite reverse' 
        }}
      >
        <Sword size={300} className="text-emerald-500" />
      </div>

      {/* --- TYPING CODE --- */}

      <div className="absolute top-1/3 left-10 md:left-20 text-left opacity-60 hidden lg:block pointer-events-none select-none z-0">
        <div className="bg-[#0f172a]/80 backdrop-blur border border-cyan-500/20 p-4 rounded-xl shadow-2xl shadow-cyan-500/10 transform -rotate-6">
            <div className="flex gap-1.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
            </div>
            <pre className="font-mono text-cyan-400 font-bold text-xs leading-relaxed min-w-[200px] min-h-[60px]">
                {typedCodeLeft}<span className="animate-pulse">|</span>
            </pre>
        </div>
      </div>

      <div className="absolute bottom-1/3 right-10 md:right-20 text-right opacity-60 hidden lg:block pointer-events-none select-none z-0">
         <div className="bg-[#0f172a]/80 backdrop-blur border border-emerald-500/20 p-4 rounded-xl shadow-2xl shadow-emerald-500/10 transform rotate-6">
            <div className="flex gap-1.5 mb-3 justify-end">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            </div>
            <pre className="font-mono text-emerald-400 font-bold text-xs leading-relaxed text-left min-w-[200px] min-h-[60px]">
                {typedCodeRight}<span className="animate-pulse">|</span>
            </pre>
         </div>
      </div>

      {/* --- HERO CONTENT --- */}

      {/* Live Status Pill */}
      <div className="z-10 bg-[#020617]/60 backdrop-blur-md border border-emerald-500/40 px-6 py-2 rounded-full text-xs font-bold text-emerald-400 flex items-center gap-3 mb-10 uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:border-emerald-400 transition-colors cursor-default hover:scale-105 transform duration-300">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="drop-shadow-md">2,847 coders battling right now</span>
      </div>

      {/* Main Title (GLITCH REMOVED) */}
      <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-12 z-10 relative drop-shadow-2xl">
        <span className="block text-white" style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}>CODE.</span>
        
        {/* Reverted to standard vibrant gradient */}
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 animate-pulse">
          COMPETE.
        </span>

        <span className="block text-white" style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }}>CONQUER.</span>
      </h1>

      {/* Battle Widget (LIVE MATCHMAKING) */}
      <div className="flex items-center gap-6 mb-16 z-10 relative group perspective-1000">
        
        {/* Player 1 (Static User) */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 w-52 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-2">
           <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-2.5 shadow-lg shadow-emerald-500/20">
              <Code2 className="text-white w-6 h-6" />
           </div>
           <div className="text-left">
              <p className="text-sm font-black text-white">Player 1</p>
              <p className="text-xs text-emerald-400 font-mono font-bold">Rating: 1847</p>
           </div>
        </div>

        {/* VS Badge */}
        <div className="relative group-hover:scale-110 transition-transform duration-300">
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center font-black text-2xl italic text-white shadow-[0_0_40px_rgba(249,115,22,0.6)] border-4 border-[#020617] z-20 relative animate-bounce">
                VS
            </div>
            <div className="absolute inset-0 bg-orange-500 blur-xl opacity-50 animate-pulse"></div>
        </div>

        {/* Player 2 (Live Cycling Animation) */}
        <div className={`bg-[#0f172a]/80 backdrop-blur-xl border ${matchFound ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]' : 'border-white/10'} px-6 py-4 rounded-2xl flex items-center gap-4 w-52 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-300`}>
           <div className={`bg-gradient-to-br ${opponent.color} rounded-xl p-2.5 shadow-lg transition-colors duration-100`}>
              <Terminal className="text-white w-6 h-6" />
           </div>
           <div className="text-left w-full">
              <p className="text-sm font-black text-white whitespace-nowrap overflow-hidden text-ellipsis">{opponent.name}</p>
              <p className={`text-xs font-mono font-bold ${matchFound ? 'text-purple-400' : 'text-gray-500'}`}>
                Rating: {opponent.rating}
              </p>
           </div>
        </div>
      </div>

      {/* Subtext */}
      <p className="text-gray-300 max-w-xl mb-12 text-lg font-medium leading-relaxed z-10 drop-shadow-md">
        Real-time 1v1 coding battles. ELO-rated matchmaking. <br/>
        <span className="text-cyan-400 font-bold">Multiple languages.</span> Fastest correct solution wins.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-5 z-10">
        <a href="#modes">
          <button className="relative bg-gradient-to-r from-cyan-500 to-emerald-500 text-[#020617] px-10 py-4 rounded-xl font-black text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_60px_rgba(34,211,238,0.7)] hover:-translate-y-1 transition-all uppercase tracking-widest overflow-hidden group">
            <span className="relative z-10 flex items-center gap-2">Start a Duel <Sword size={18} strokeWidth={3} className="group-hover:rotate-12 transition-transform"/></span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </a>
        <a href="#modes">
          <button className="px-10 py-4 rounded-xl font-black text-sm text-cyan-400 border border-cyan-500/30 hover:bg-cyan-950/30 hover:border-cyan-400 transition-all uppercase tracking-widest shadow-lg shadow-cyan-900/20">
            View Game Modes
          </button>
        </a>
      </div>

      {/* Footer Stats */}
      <div className="mt-24 flex flex-wrap justify-center gap-8 md:gap-16 text-gray-400 font-bold uppercase text-xs tracking-widest z-10 border-t border-white/5 pt-8 px-12 rounded-full bg-[#020617]/40 backdrop-blur-sm">
        <div className="flex items-center gap-3 group cursor-pointer hover:text-orange-400 transition-colors">
            <Zap size={16} className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] group-hover:scale-125 transition-transform"/> 50K+ Duels
        </div>
        <div className="flex items-center gap-3 group cursor-pointer hover:text-cyan-400 transition-colors">
            <Users size={16} className="text-cyan-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] group-hover:scale-125 transition-transform"/> 12K+ Players
        </div>
        <div className="flex items-center gap-3 group cursor-pointer hover:text-emerald-400 transition-colors">
            <Code2 size={16} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] group-hover:scale-125 transition-transform"/> 8 Languages
        </div>
      </div>
    </section>
  );
};

export default Hero;