import { Gamepad2, Users, Code, Send, TrendingUp } from 'lucide-react';

const steps = [
  { icon: <Gamepad2 />, label: "Choose Mode", sub: "Pick your battle type" },
  { icon: <Users />, label: "Get Matched", sub: "ELO-based pairing" },
  { icon: <Code />, label: "Code Live", sub: "Real-time battle" },
  { icon: <Send />, label: "Submit First", sub: "Speed + accuracy wins" },
  { icon: <TrendingUp />, label: "Rank Up", sub: "Climb the ladder" },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-24 px-6 text-center">
      <h2 className="text-5xl font-black mb-4 uppercase">How <span className="text-cyan-400">It Works</span></h2>
      <p className="text-gray-400 mb-20">From signup to victory in minutes. Simple. Fast. Addictive.</p>

      <div className="flex flex-col md:flex-row justify-between items-start max-w-6xl mx-auto relative gap-8">
        {/* Connection Line */}
        <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-20 z-0"></div>

        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center z-10 flex-1">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-[#0f172a] border border-white/10 rounded-2xl flex items-center justify-center text-cyan-400 hover:scale-110 hover:border-cyan-400 transition-all cursor-default">
                {step.icon}
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-[10px] font-black border border-white/10">{i + 1}</div>
            </div>
            <h4 className="font-black mb-1">{step.label}</h4>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{step.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 inline-block bg-[#0f172a] border border-cyan-400/20 px-8 py-3 rounded-full text-sm font-bold">
        Average match time: <span className="text-cyan-400 ml-2 italic">4 min 23 sec</span>
      </div>
    </section>
  );
};

export default HowItWorks;