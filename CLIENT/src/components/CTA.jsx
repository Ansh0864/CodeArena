import { Sword, ChevronRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-32 px-6 text-center bg-[#020617] relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="mb-6 w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center text-[#020617] mx-auto shadow-2xl shadow-emerald-500/20">
        <Sword size={40} className="rotate-45" />
      </div>

      <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
        Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Duel?</span>
      </h2>
      
      <p className="text-gray-400 text-lg mb-2">Prove your coding speed. Climb the ranks. Become legendary.</p>
      <p className="text-white font-bold text-lg mb-12">Your first match is waiting.</p>

      <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
        <a href="#modes">
           <button className="bg-gradient-to-r from-cyan-400 to-emerald-400 text-[#020617] px-12 py-4 rounded-lg font-black text-sm flex items-center gap-2 shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:shadow-[0_0_60px_rgba(34,211,238,0.6)] hover:-translate-y-1 transition-all uppercase tracking-widest">
             ENTER THE ARENA <ChevronRight size={16} />
           </button>
        </a>
        <button className="border border-cyan-500/30 text-cyan-400 px-12 py-4 rounded-lg font-black text-sm hover:bg-cyan-900/10 transition-all uppercase tracking-widest">
          WATCH A MATCH
        </button>
      </div>

      <p className="mt-12 text-gray-500 text-xs font-bold uppercase tracking-widest">
        Free to play. No credit card required. <span className="text-cyan-400 cursor-pointer">Start competing in seconds.</span>
      </p>
    </section>
  );
};

export default CTA;