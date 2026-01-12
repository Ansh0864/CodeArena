import React from 'react';
import { Bug, ShieldAlert, Code2 } from 'lucide-react';

const BugHuntArena = () => {
  return (
    <div className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center overflow-hidden">
       {/* Background Ambience */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="z-10 text-center max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-900/30 border border-pink-500/30 rounded-full text-pink-400 font-bold mb-8">
            <Bug size={18} /> Bug Hunt Mode
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-white">
          Spot the <span className="text-pink-500">Error</span>
        </h1>
        
        <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
          We give you broken code. You fix it. No writing from scratch—just 
          pure debugging skills.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-[#1e293b] p-8 rounded-2xl border border-pink-500/20 hover:border-pink-500 transition-all cursor-pointer group">
                <div className="bg-pink-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-pink-400 group-hover:scale-110 transition-transform">
                    <Code2 />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Javascript Async/Await</h3>
                <p className="text-gray-500 text-sm">Fix the race condition in this API fetcher.</p>
                <div className="mt-6 flex justify-between items-center">
                    <span className="text-xs font-bold bg-black/40 px-2 py-1 rounded text-gray-300">HARD</span>
                    <button className="text-pink-400 font-bold text-sm group-hover:underline">START &rarr;</button>
                </div>
            </div>

             <div className="bg-[#1e293b] p-8 rounded-2xl border border-pink-500/20 hover:border-pink-500 transition-all cursor-pointer group">
                <div className="bg-pink-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-pink-400 group-hover:scale-110 transition-transform">
                    <ShieldAlert />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Python Memory Leak</h3>
                <p className="text-gray-500 text-sm">Identify why this list never clears.</p>
                <div className="mt-6 flex justify-between items-center">
                    <span className="text-xs font-bold bg-black/40 px-2 py-1 rounded text-gray-300">MEDIUM</span>
                    <button className="text-pink-400 font-bold text-sm group-hover:underline">START &rarr;</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BugHuntArena;