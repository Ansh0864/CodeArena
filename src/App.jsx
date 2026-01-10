import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BattleModes from './components/BattleModes';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <Navbar />
      <main>
        <Hero />
        <BattleModes />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;