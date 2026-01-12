// Footer.jsx
import { Sword, Twitter, Github, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#010413] pt-20 pb-10 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Sword className="text-cyan-400 w-6 h-6 rotate-45" />
            <span className="text-xl font-black italic tracking-tighter">CODE<span className="text-cyan-400">ARENA</span></span>
          </div>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">Real-time competitive coding. <br /> Battle. Learn. Grow.</p>
          <div className="flex gap-4 text-gray-400">
            <Twitter size={20} className="hover:text-cyan-400 cursor-pointer" />
            <Github size={20} className="hover:text-cyan-400 cursor-pointer" />
            <MessageSquare size={20} className="hover:text-cyan-400 cursor-pointer" />
          </div>
        </div>

        <div>
          <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-300">Product</h5>
          <ul className="text-gray-500 text-sm space-y-4">
            <li className="hover:text-white cursor-pointer transition-colors">Game Modes</li>
            <li className="hover:text-white cursor-pointer transition-colors">Leaderboard</li>
            <li className="hover:text-white cursor-pointer transition-colors">Problems</li>
            <li className="hover:text-white cursor-pointer transition-colors">Languages</li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-300">Company</h5>
          <ul className="text-gray-500 text-sm space-y-4">
            <li className="hover:text-white cursor-pointer transition-colors">About</li>
            <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
            <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
            <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-300">Legal</h5>
          <ul className="text-gray-500 text-sm space-y-4">
            <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
            <li className="hover:text-white cursor-pointer transition-colors">Terms</li>
            <li className="hover:text-white cursor-pointer transition-colors">Fair Play</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center text-xs text-gray-600 font-bold uppercase tracking-widest">
        <p>© 2026 CodeArena. All rights reserved.</p>
        <p className="mt-4 md:mt-0 flex items-center gap-1">Made with <span className="text-pink-500">❤️</span> for competitive coders</p>
      </div>
    </footer>
  );
};

export default Footer;