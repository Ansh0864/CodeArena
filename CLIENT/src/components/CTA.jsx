import { Sword, Play, Tv } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-32 px-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="mb-8 w-16 h-16 bg-emerald-400/20 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
        <Sword size={32} />
      </div>

      <h2 className="text-6xl font-black uppercase mb-6 tracking-tighter">Ready to <span className="text-cyan-400">Duel?</span></h2>
      <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">Prove your coding speed. Climb the ranks. Become legendary. Your first match is waiting.</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/#modes">
            <button className="bg-emerald-400 text-black px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 shadow-[0_0_50px_rgba(52,211,153,0.3)] hover:scale-105 transition-all">
            ENTER THE ARENA <Play fill="black" size={20}/>
            </button>
        </a>
        <button className="border border-white/20 bg-white/5 backdrop-blur-sm text-white px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 hover:bg-white/10 transition-all">
          WATCH A MATCH <Tv size={20}/>
        </button>
      </div>

      <p className="mt-12 text-gray-500 font-bold uppercase text-xs tracking-widest">Free to play. No credit card required. <span className="text-cyan-400 cursor-pointer">Start competing in seconds.</span></p>
    </section>
  );
};

export default CTA;