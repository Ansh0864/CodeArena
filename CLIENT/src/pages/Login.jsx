import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sword,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  /* =========================
     SIMPLE VALIDATIONS
  ========================== */
  const validate = (field, value) => {
    if (!value.trim()) return `${field} is required`;

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Invalid email address';
    }

    if (field === 'password' && value.length < 6) {
      return 'Password must be at least 6 characters';
    }

    return '';
  };

  /* =========================
     SUBMIT HANDLER
  ========================== */
  const handleAuth = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    let newErrors = {};

    if (!isLogin) {
      const userErr = validate('username', formData.username);
      if (userErr) newErrors.username = userErr;
    }

    const emailErr = validate('email', formData.email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validate('password', formData.password);
    if (passErr) newErrors.password = passErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const url = isLogin
        ? `${import.meta.env.VITE_BACKEND_URL}/login`
        : `${import.meta.env.VITE_BACKEND_URL}/signup`;

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : formData;

      const res = await axios.post(url, payload);

      // ✅ Success
      toast.success(
        isLogin ? 'Logged in successfully!' : 'Account created successfully!'
      );

      // Session-based → backend already set cookie
      setUser(res.data.user);

      navigate('/');

    } catch (err) {
      // ❌ Backend error handling
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        'Something went wrong';

      setGeneralError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Sword className="text-cyan-400 w-10 h-10 rotate-45 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Arena'}
          </h2>
        </div>

        {generalError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-bold">
            <AlertCircle size={16} /> {generalError}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  className={`w-full bg-[#1e293b] border ${
                    errors.username ? 'border-red-500' : 'border-white/5'
                  } rounded-lg py-3 pl-10 pr-4 text-white`}
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-xs mt-1 ml-1">
                  {errors.username}
                </p>
              )}
            </div>
          )}

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
              <input
                type="text"
                className={`w-full bg-[#1e293b] border ${
                  errors.email ? 'border-red-500' : 'border-white/5'
                } rounded-lg py-3 pl-10 pr-4 text-white`}
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
              <input
                type="password"
                className={`w-full bg-[#1e293b] border ${
                  errors.password ? 'border-red-500' : 'border-white/5'
                } rounded-lg py-3 pl-10 pr-4 text-white`}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {errors.password}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className={`w-full ${
              loading
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:-translate-y-1'
            } bg-gradient-to-r from-cyan-400 to-emerald-400 text-[#020617] font-black py-3 rounded-lg mt-6 shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm`}
          >
            {loading
              ? 'Processing...'
              : isLogin
              ? 'Enter Arena'
              : 'Initialize User'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? 'New Challenger?' : 'Already Registered?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setGeneralError('');
              }}
              className="ml-2 text-cyan-400 font-bold hover:text-white transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
