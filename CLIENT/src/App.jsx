import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import RapidDuel from './pages/RapidDuel';
import BugHuntArena from './pages/BugHuntArena';
import ComplexityDuel from './pages/ComplexityDuel';
import Login from './pages/Login'; 
import Profile from './pages/Profile';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Main Background applied globally in index.css */}
        <div className="min-h-screen text-white font-sans selection:bg-cyan-500/30 flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes - Only accessible if logged in */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/rapid-duel" element={<ProtectedRoute><RapidDuel /></ProtectedRoute>} />
              <Route path="/bug-hunt" element={<ProtectedRoute><BugHuntArena /></ProtectedRoute>} />
              <Route path="/complexity-duel" element={<ProtectedRoute><ComplexityDuel /></ProtectedRoute>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;