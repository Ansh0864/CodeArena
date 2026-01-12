import React from 'react';
import { BarChart3 } from 'lucide-react';

const ComplexityDuel = () => {
  return (
    <div className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center overflow-hidden">
       {/* Background Ambience */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="z-10 text-center max-w-3xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/30 border border-emerald-500/30 rounded-full text-emerald-400 font-bold mb-8">
            <BarChart3 size={18} /> Big O Battle
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-white">
          Optimize or <span className="text-emerald-500">Die</span>
        </h1>
        
        <p className="text-gray-400 text-xl mb-12">
           Brute force won't work here. O(n²) solutions are automatically rejected.
           Can you find the O(n log n) approach?
        </p>

        <div className="w-full bg-[#0f172a] border border-emerald-500/20 rounded-3xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 bg-emerald-500/5 rounded-2xl p-8 flex flex-col items-center justify-center border border-dashed border-emerald-500/30 min-h-[300px]">
                 <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                    <div className="w-full h-full rounded-full bg-emerald-900 flex items-center justify-center font-bold">YOU</div>
                 </div>
                 <h3 className="font-bold text-xl text-white">You</h3>
                 <p className="text-emerald-400 font-mono text-sm">Rating: 1200</p>
            </div>

            <div className="flex items-center justify-center p-4">
                <span className="font-black text-2xl text-gray-600 italic">VS</span>
            </div>

            <div className="flex-1 bg-black/20 rounded-2xl p-8 flex flex-col items-center justify-center border border-dashed border-gray-700 min-h-[300px]">
                 <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 mb-4 animate-pulse">
                    ?
                 </div>
                 <h3 className="font-bold text-xl text-gray-500">Waiting...</h3>
            </div>
        </div>

        <button className="mt-8 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 px-12 rounded-xl text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all transform hover:scale-105 cursor-pointer">
            START MATCHMAKING
        </button>
      </div>
    </div>
  );
};

export default ComplexityDuel;