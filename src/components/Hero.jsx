import { Users, Zap, Code2, ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
      {/* Background Grids & Glows */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="z-10 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2 mb-8">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        2,847 coders battling right now
      </div>

      <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-8 z-10">
        CODE. <br />
        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">COMPETE.</span> <br />
        CONQUER.
      </h1>

      {/* VS Visualizer */}
      <div className="flex items-center gap-4 md:gap-12 mb-12 z-10">
        <div className="bg-[#111827] border border-white/10 p-4 rounded-xl flex items-center gap-4 w-40 md:w-56">
          <div className="bg-emerald-500/20 p-2 rounded-lg"><Code2 className="text-emerald-400" /></div>
          <div className="text-left">
            <p className="text-xs text-gray-400 uppercase font-bold">Player 1</p>
            <p className="font-mono">Rating: 1847</p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center font-black text-xl italic shadow-lg shadow-orange-500/20">VS</div>
        <div className="bg-[#111827] border border-white/10 p-4 rounded-xl flex items-center gap-4 w-40 md:w-56 text-right justify-end">
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold">Player 2</p>
            <p className="font-mono">Rating: 1823</p>
          </div>
          <div className="bg-purple-500/20 p-2 rounded-lg"><Code2 className="text-purple-400" /></div>
        </div>
      </div>

      <p className="text-gray-400 max-w-xl mb-12 text-lg">
        Real-time 1v1 coding battles. ELO-rated matchmaking. **Multiple languages.** Fastest correct solution wins.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 z-10">
        <button className="bg-emerald-400 text-black px-10 py-4 rounded-xl font-black text-lg flex items-center gap-2 shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:scale-105 transition-all">
          START A DUEL <ChevronRight />
        </button>
        <button className="border border-cyan-400 text-cyan-400 px-10 py-4 rounded-xl font-black text-lg hover:bg-cyan-400/10 transition-all">
          VIEW GAME MODES
        </button>
      </div>

      {/* Stats Bar */}
      <div className="mt-20 flex gap-12 text-gray-400 font-bold uppercase text-sm">
        <div className="flex items-center gap-2 text-orange-400"><Zap size={18}/> 50K+ Duels</div>
        <div className="flex items-center gap-2 text-cyan-400"><Users size={18}/> 12K+ Players</div>
        <div className="flex items-center gap-2 text-emerald-400"><Code2 size={18}/> 8 Languages</div>
      </div>
    </section>
  );
};

export default Hero;