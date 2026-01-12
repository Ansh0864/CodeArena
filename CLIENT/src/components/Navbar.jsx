import { Sword, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;

const Navbar = ({ user, setUser }) => {
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

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`);
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">

      {/* LEFT: LOGO */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <Sword className="text-cyan-400 w-8 h-8 rotate-45 group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-black text-white">
            CODE<span className="text-cyan-400">ARENA</span>
          </span>
        </Link>
      </div>

      {/* CENTER NAV */}
      <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400 uppercase">
        <button onClick={() => navigate('/')} className="hover:text-cyan-400">
          Home
        </button>
        <button onClick={() => handleScroll('modes')} className="hover:text-cyan-400">
          Game Modes
        </button>
        <button onClick={() => handleScroll('how')} className="hover:text-cyan-400">
          How It Works
        </button>
        <button onClick={() => handleScroll('features')} className="hover:text-cyan-400">
          Features
        </button>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">

        {/* 🔐 AUTHENTICATED */}
        {user ? (
          <div className="flex items-center gap-4">

            {/* Welcome Text */}
            <span className="hidden sm:block text-sm font-bold text-gray-300">
              Welcome <span className="text-cyan-400">{user.username}</span> !!
            </span>

            {/* Profile Icon */}
            <div
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer border border-white/10 hover:border-cyan-400 transition-all"
              title="Go to Profile"
            >
              <UserIcon className="text-cyan-400" size={20} />
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>

          </div>
        ) : (
          /* 🚪 NOT AUTHENTICATED */
          <div className="flex items-center gap-6">
            <Link to="/login">
              <button className="text-sm font-bold text-gray-300 hover:text-white uppercase">
                Sign In
              </button>
            </Link>

            <Link to="/login">
              <button className="bg-cyan-400 hover:bg-cyan-300 text-[#020617] px-8 py-2.5 rounded font-black text-sm uppercase shadow transition-all">
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
