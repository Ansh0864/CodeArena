import { Sword, Twitter, Github, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#020617] pt-24 pb-12 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <Sword className="text-cyan-400 w-6 h-6 rotate-45" />
            <span className="text-xl font-black italic tracking-tighter text-white">CODE<span className="text-cyan-400">ARENA</span></span>
          </Link>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed font-medium">Real-time competitive coding. <br /> Battle. Learn. Grow.</p>
          <div className="flex gap-4 text-gray-400">
            <Twitter size={20} className="hover:text-cyan-400 cursor-pointer transition-colors" />
            <Github size={20} className="hover:text-white cursor-pointer transition-colors" />
            <MessageSquare size={20} className="hover:text-emerald-400 cursor-pointer transition-colors" />
          </div>
        </div>

        <div>
          <h5 className="font-black mb-8 text-xs uppercase tracking-widest text-white">Product</h5>
          <ul className="text-gray-500 text-sm space-y-4 font-medium">
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Game Modes</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Leaderboard</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Problems</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Languages</li>
          </ul>
        </div>

        <div>
          <h5 className="font-black mb-8 text-xs uppercase tracking-widest text-white">Company</h5>
          <ul className="text-gray-500 text-sm space-y-4 font-medium">
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">About</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Blog</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Careers</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Contact</li>
          </ul>
        </div>

        <div>
          <h5 className="font-black mb-8 text-xs uppercase tracking-widest text-white">Legal</h5>
          <ul className="text-gray-500 text-sm space-y-4 font-medium">
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Privacy</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Terms</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Fair Play</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-bold uppercase tracking-widest border-t border-white/5 pt-12">
        <p>© 2026 CodeArena. All rights reserved.</p>
        <p className="mt-4 md:mt-0 flex items-center gap-1">Made with <span className="text-pink-500">❤️</span> for competitive coders</p>
      </div>
    </footer>
  );
};

export default Footer;