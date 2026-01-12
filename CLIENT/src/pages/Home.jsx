// CLIENT/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import BattleModes from '../components/BattleModes';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import CTA from '../components/CTA';

const Home = () => {
  return (
    <main>
      <Hero />
      <BattleModes />
      <HowItWorks />
      <Features />
      <CTA />
    </main>
  );
};

export default Home;