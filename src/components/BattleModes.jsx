import { Timer, Zap, Brain, Bug, BarChart3, ChevronRight } from 'lucide-react';

const modes = [
  {
    title: "Rapid Duel",
    quote: "Think fast, code clean",
    desc: "5-10 minute time limit. Balanced difficulty. Strategy meets speed.",
    time: "5-10 min",
    difficulty: "Medium",
    color: "text-cyan-400",
    icon: <Timer />
  },
  {
    title: "Blitz Duel",
    quote: "Fastest correct code wins",
    desc: "1-3 minute sprints. Simple problems. Pure speed and instincts.",
    time: "1-3 min",
    difficulty: "Easy",
    color: "text-orange-400",
    icon: <Zap />
  },
  {
    title: "Logic Battle",
    quote: "Pure problem-solving",
    desc: "No full coding. Arrange logic blocks. Drag & drop challenges.",
    time: "3-5 min",
    difficulty: "Variable",
    color: "text-purple-400",
    icon: <Brain />
  },
  {
    title: "Bug Hunt Arena",
    quote: "Find. Fix. Win.",
    desc: "Debug broken snippets. Spot errors faster than your opponent.",
    time: "2-4 min",
    difficulty: "Medium",
    color: "text-pink-500",
    icon: <Bug />
  },
  {
    title: "Complexity Duel",
    quote: "Outthink your opponent",
    desc: "Choose the optimal algorithm. Time & space complexity focused.",
    time: "5-8 min",
    difficulty: "Hard",
    color: "text-emerald-400",
    icon: <BarChart3 />
  }
];

const BattleModes = () => {
  return (
    <section id="modes" className="py-20 px-6 md:px-12 bg-black/20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black mb-4 uppercase">Choose Your <span className="text-cyan-400">Battle Mode</span></h2>
        <p className="text-gray-400">Multiple ways to compete. Each mode tests different skills. Find your arena.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {modes.map((mode, i) => (
          <div key={i} className="bg-[#0f172a] border border-white/5 p-8 rounded-3xl hover:border-cyan-400/50 transition-all group">
            <div className={`mb-6 w-12 h-12 rounded-xl flex items-center justify-center bg-gray-800 ${mode.color}`}>
              {mode.icon}
            </div>
            <h3 className="text-2xl font-black mb-2">{mode.title}</h3>
            <p className={`text-sm font-bold italic mb-4 ${mode.color}`}>"{mode.quote}"</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{mode.desc}</p>
            
            <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-8">
              <span className="flex items-center gap-1"><Timer size={14}/> {mode.time}</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full uppercase tracking-widest">{mode.difficulty}</span>
            </div>

            <button className="flex items-center gap-2 text-white font-bold text-sm group-hover:text-cyan-400 transition-colors">
              Start Matchmaking <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BattleModes;