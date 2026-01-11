import { Code2, Swords, BarChart, Globe, Trophy, ShieldCheck } from 'lucide-react';

const feats = [
  { icon: <Code2 />, title: "Multi-Language Support", desc: "Python, JavaScript, C++, Java, Go, Rust, and more. Code in your preferred language." },
  { icon: <Swords />, title: "Real Competition", desc: "No MCQs. No boring practice. Live 1v1 battles against real opponents." },
  { icon: <BarChart />, title: "ELO Rating System", desc: "Chess-style rating. Fair matchmaking. Track your progress and climb the ranks." },
  { icon: <Globe />, title: "Global Leaderboards", desc: "Compete with coders worldwide. Regional and global rankings updated live." },
  { icon: <Trophy />, title: "Interview-Ready Skills", desc: "Build skills that matter. Our problems mirror real technical interviews." },
  { icon: <ShieldCheck />, title: "Anti-Cheat System", desc: "Fair play guaranteed. Advanced detection ensures a level playing field." },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 md:px-12 bg-black/40">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-black mb-4 uppercase">Why <span className="text-emerald-400">CodeArena?</span></h2>
        <p className="text-gray-400">This isn't your average coding platform. We're built for competition.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
        {feats.map((f, i) => (
          <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-3xl group hover:bg-white/[0.08] transition-all">
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <h4 className="text-xl font-black mb-3">{f.title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <span className="font-bold text-xl">Google</span>
        <span className="font-bold text-xl">Meta</span>
        <span className="font-bold text-xl">Amazon</span>
        <span className="font-bold text-xl">Microsoft</span>
        <span className="font-bold text-xl">Apple</span>
      </div>
    </section>
  );
};

export default Features;