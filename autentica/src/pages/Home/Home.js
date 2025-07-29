// src/pages/Home/Home.js

import React from 'react';
import HeroSection from './HeroSection';
import NovedadesSection from './NovedadesSection'; // Importa Novedades
import AboutSection from './AboutSection';       // Importa About

const Home = () => {
  return (
    <div>
      <HeroSection />
      <NovedadesSection />
      <AboutSection />
    </div>
  );
};

export default Home;