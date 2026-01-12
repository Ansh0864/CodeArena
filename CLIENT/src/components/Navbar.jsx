import { Sword, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, getAvatarUrl } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (id) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      
      {/* LEFT SECTION: Logo & Navigation Swords */}
      <div className="flex items-center gap-8">
        
        {/* 1. LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
              <Sword className="text-cyan-400 w-8 h-8 rotate-45 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            CODE<span className="text-cyan-400">ARENA</span>
          </span>
        </Link>

        {/* 2. SWORD NAVIGATION (Back / Forward) */}
        <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30 group"
            title="Go Back"
          >
            {/* Rotated Sword to point LEFT (-135deg) */}
            <Sword size={18} className="transform -rotate-[135deg] group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => navigate(1)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/30 group"
            title="Go Forward"
          >
             {/* Default Sword points diagonal right, slightly adjusted for Forward look (45deg) */}
             <Sword size={18} className="transform rotate-45 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
      
      {/* CENTER NAVIGATION */}
      <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400 uppercase tracking-wide">
        <button onClick={() => navigate('/')} className="hover:text-cyan-400 transition-colors uppercase">
          Home
        </button>
        <button onClick={() => handleScroll('modes')} className="hover:text-cyan-400 transition-colors uppercase">
          Game Modes
        </button>
        <button onClick={() => handleScroll('how')} className="hover:text-cyan-400 transition-colors uppercase">
          How It Works
        </button>
        <button onClick={() => handleScroll('features')} className="hover:text-cyan-400 transition-colors uppercase">
          Features
        </button>
      </div>

      {/* RIGHT SECTION: AUTH & ACTIONS */}
      <div className="flex items-center gap-6">
        
        {user ? (
          <div className="flex items-center gap-4 animate-fade-in">
            {/* PROFILE PILL */}
            <Link to="/profile" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 pl-1.5 pr-4 py-1.5 rounded-full transition-all border border-white/5 group">
               <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500/30">
                 <img 
                   src={getAvatarUrl(user.avatarId)} 
                   alt="User" 
                   className="w-full h-full object-cover bg-[#020617]"
                 />
               </div>
               <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                 {user.username}
               </span>
            </Link>

            {/* LOGOUT BUTTON */}
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition-colors p-2"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>

            {/* DUEL BUTTON */}
            <Link to="/rapid-duel">
              <button className="hidden sm:block bg-cyan-400 hover:bg-cyan-300 text-[#020617] px-6 py-2 rounded font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all transform hover:scale-105">
                Duel Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/login">
              <button className="text-sm font-bold text-gray-300 hover:text-white transition-colors uppercase tracking-widest">
                Sign In
              </button>
            </Link>
            
            <Link to="/login">
              <button className="bg-cyan-400 hover:bg-cyan-300 text-[#020617] px-8 py-2.5 rounded font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all transform hover:scale-105">
                Play Now
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;