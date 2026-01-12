import React from 'react';
import { Timer, Search } from 'lucide-react';

const RapidDuel = () => {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen flex flex-col items-center">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="z-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-900/30 border border-cyan-500/30 rounded-full text-cyan-400 font-bold mb-8">
            <Timer size={18} /> Rapid Duel Arena
        </div>
        
        <h1 className="text-6xl font-black mb-6 uppercase tracking-tighter">
          Speed is <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Everything</span>
        </h1>
        
        <p className="text-gray-400 text-xl mb-12">
          You have 5-10 minutes. The problem is medium difficulty. 
          First to pass all test cases wins.
        </p>

        <div className="bg-[#1e293b]/50 border border-white/10 p-10 rounded-3xl backdrop-blur-md max-w-lg mx-auto shadow-2xl shadow-cyan-500/10">
            <div className="animate-pulse mb-6 flex justify-center">
                <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center relative">
                    <Search className="text-cyan-400 w-8 h-8" />
                    <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping opacity-20"></div>
                </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Looking for Opponent...</h3>
            <p className="text-gray-500 text-sm mb-8">Estimated wait: 12s</p>
            
            <button className="w-full bg-red-500/10 border border-red-500/50 text-red-500 font-bold py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                CANCEL SEARCH
            </button>
        </div>
      </div>
    </div>
  );
};

export default RapidDuel;