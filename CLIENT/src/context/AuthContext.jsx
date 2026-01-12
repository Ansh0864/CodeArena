import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// EXPANDED CARTOONISH AVATARS (DiceBear Adventurer Collection)
// Added more variety in hair, accessories, and expressions.
const AVATARS = [
  { id: 1, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Felix' },
  { id: 2, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Aneka' },
  { id: 3, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Zoey' },
  { id: 4, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Christopher' },
  { id: 5, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Sophia' },
  { id: 6, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Brian' },
  { id: 7, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Ryan' },
  { id: 8, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Jordan' },
  { id: 9, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Kelly' },
  { id: 10, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Luis' },
  { id: 11, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Kyle' },
  { id: 12, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Jessica' },
  { id: 13, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Brook' },
  { id: 14, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Eden' },
  { id: 15, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alexander' },
  { id: 16, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Rochester' },
  { id: 17, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Gizmo' },
  { id: 18, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Midnight' },
  { id: 19, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Samurai' },
  { id: 20, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Abby' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('codearena_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const validate = (type, value) => {
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : "Invalid email format.";
      case 'password':
        const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        return passRegex.test(value) ? null : "Password must be 8+ chars, include a number and special char.";
      case 'username':
        return value.length >= 3 ? null : "Username must be at least 3 characters.";
      default:
        return null;
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('codearena_current_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('codearena_current_user');
  };

  const updateProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('codearena_current_user', JSON.stringify(newUser));
    
    // Update main database
    const allUsers = JSON.parse(localStorage.getItem('codearena_users') || '[]');
    const updatedAllUsers = allUsers.map(u => u.email === user.email ? newUser : u);
    localStorage.setItem('codearena_users', JSON.stringify(updatedAllUsers));
  };

  // Helper to get image URL safely
  const getAvatarUrl = (id) => {
    const avatar = AVATARS.find(a => a.id === id);
    return avatar ? avatar.url : AVATARS[0].url;
  };

  return (
    <AuthContext.Provider value={{ 
        user, login, logout, validate, updateProfile, loading, 
        AVATARS, getAvatarUrl 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);