import { Sword } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <Sword className="text-cyan-400 w-8 h-8 rotate-45" />
        <span className="text-2xl font-black tracking-tighter italic text-white">CODE<span className="text-cyan-400">ARENA</span></span>
      </Link>
      
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
        {/* Use absolute paths with hashes to allow navigation from subpages */}
        <a href="/#modes" className="hover:text-white transition-colors">Game Modes</a>
        <a href="/#how" className="hover:text-white transition-colors">How It Works</a>
        <a href="/#features" className="hover:text-white transition-colors">Features</a>
        <a href="/#leaderboard" className="hover:text-white transition-colors">Leaderboard</a>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-sm font-bold hover:text-cyan-400 transition-colors">SIGN IN</button>
        <a href="/#modes">
          <button className="bg-cyan-400 text-black px-6 py-2 rounded-lg font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 transition-transform">
            PLAY NOW
          </button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;