import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import RapidDuel from './pages/RapidDuel';
import BugHuntArena from './pages/BugHuntArena';
import ComplexityDuel from './pages/ComplexityDuel';

function App() {
  return (
    <Router>
      <div className="bg-[#020617] min-h-screen text-white font-sans selection:bg-cyan-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rapid-duel" element={<RapidDuel />} />
          <Route path="/bug-hunt" element={<BugHuntArena />} />
          <Route path="/complexity-duel" element={<ComplexityDuel />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;