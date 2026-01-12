import { Timer, Zap, Brain, Bug, BarChart3, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const modes = [
  {
    title: "Rapid Duel",
    link: "/rapid-duel", // Direct link
    quote: "Think fast, code clean",
    desc: "5-10 minute time limit. Balanced difficulty. Strategy meets speed.",
    time: "5-10 min",
    difficulty: "Medium",
    color: "text-cyan-400",
    bg: "bg-cyan-500",
    icon: <Timer />
  },
  {
    title: "Blitz Duel",
    link: "/rapid-duel", // Placeholder: Redirects to Rapid Duel for now
    quote: "Fastest correct code wins",
    desc: "1-3 minute sprints. Simple problems. Pure speed and instincts.",
    time: "1-3 min",
    difficulty: "Easy",
    color: "text-orange-400",
    bg: "bg-orange-500",
    icon: <Zap />
  },
  {
    title: "Logic Battle",
    link: "/rapid-duel", // Placeholder: Redirects to Rapid Duel for now
    quote: "Pure problem-solving",
    desc: "No full coding. Arrange logic blocks. Drag & drop challenges.",
    time: "3-5 min",
    difficulty: "Variable",
    color: "text-purple-400",
    bg: "bg-purple-500",
    icon: <Brain />
  },
  {
    title: "Bug Hunt Arena",
    link: "/bug-hunt", // Direct link
    quote: "Find. Fix. Win.",
    desc: "Debug broken snippets. Spot errors faster than your opponent.",
    time: "2-4 min",
    difficulty: "Medium",
    color: "text-pink-500",
    bg: "bg-pink-500",
    icon: <Bug />
  },
  {
    title: "Complexity Duel",
    link: "/complexity-duel", // Direct link
    quote: "Outthink your opponent",
    desc: "Choose the optimal algorithm. Time & space complexity focused.",
    time: "5-8 min",
    difficulty: "Hard",
    color: "text-emerald-400",
    bg: "bg-emerald-500",
    icon: <BarChart3 />
  }
];

const BattleModes = () => {
  return (
    <section id="modes" className="py-24 px-6 md:px-12 bg-[#020617]">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Battle Mode</span>
        </h2>
        <p className="text-gray-400 text-lg">Multiple ways to compete. Each mode tests different skills. Find your arena.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {modes.map((mode, i) => (
          <div key={i} className="bg-[#0b1221] border border-white/5 p-8 rounded-2xl hover:border-white/20 transition-all group">
            <div className={`w-12 h-12 rounded-lg ${mode.bg} flex items-center justify-center text-white mb-6`}>
              {mode.icon}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{mode.title}</h3>
            <p className={`text-sm font-bold ${mode.color} mb-4`}>"{mode.quote}"</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 h-10">{mode.desc}</p>
            
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                 <Timer size={12} /> {mode.time}
              </span>
              <span className="text-[10px] font-bold bg-white/5 text-gray-400 px-2 py-1 rounded">
                {mode.difficulty}
              </span>
            </div>

            {/* Fixed: Uses mode.link instead of hardcoded path */}
            <Link to={mode.link} className="flex items-center gap-1 text-white text-sm font-bold group-hover:gap-2 transition-all">
              Start Matchmaking <ChevronRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BattleModes;