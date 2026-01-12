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
    <section id="how" className="py-24 px-6 text-center bg-[#020617] relative overflow-hidden">
      <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
        How <span className="text-cyan-400 text-shadow-cyan">It Works</span>
      </h2>
      <p className="text-gray-400 mb-20 text-lg">From signup to victory in minutes. Simple. Fast. Addictive.</p>

      {/* Timeline Container */}
      <div className="max-w-6xl mx-auto relative flex flex-col md:flex-row justify-between items-start gap-8">
        
        {/* Connection Line (Gradient) */}
        <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 z-0 opacity-50"></div>

        {steps.map((step, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center flex-1 group">
            {/* Icon Circle */}
            <div className="w-20 h-20 bg-[#0f172a] border border-white/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 shadow-2xl group-hover:border-cyan-400/50 transition-all">
               {step.icon}
            </div>
            
            {/* Number Badge */}
            <div className="absolute top-0 right-10 md:right-4 w-6 h-6 rounded-full bg-[#1e293b] text-[10px] font-black flex items-center justify-center border border-white/10">
              {i+1}
            </div>

            <h4 className="font-bold text-white text-lg mb-1">{step.label}</h4>
            <p className="text-gray-500 text-sm">{step.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 inline-block bg-[#0f172a] border border-white/5 px-6 py-3 rounded-full text-sm font-bold text-gray-400">
        Average match time: <span className="text-cyan-400 ml-2">4 min 23 sec</span>
      </div>
    </section>
  );
};

export default HowItWorks;