// src/pages/Home/HeroSection.js

import React, { useState, useEffect } from 'react';
import { HeroContainer, HeroSlide, HeroImage, HeroContent, HeroTitle, HeroSubtitle, HeroButton, DotsContainer, Dot } from './HeroSection.styles';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState([]); // Estado para almacenar las imágenes del hero

  useEffect(() => {
    // Función para cargar las imágenes del hero desde el backend
    const fetchHeroImages = async () => {
      try {
        // Asegúrate de que la URL coincida con la dirección de tu servidor Flask
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/hero_images`); // ... <HeroImage src={`${process.env.REACT_APP_API_URL}${slide.image_url}`} alt={slide.title} />
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Las URLs de las imágenes vienen del backend, así que las usamos directamente
        // Asegúrate de que las URLs en tu DB de Flask sean accesibles desde el frontend
        setHeroSlides(data);
      } catch (error) {
        console.error("Error al cargar las imágenes del hero:", error);
        // Opcional: Cargar imágenes de fallback si la API falla
        setHeroSlides([
          { image_url: '/static/images/hero/hero1.png', title: 'Nueva Colección', subtitle: 'Descubre las últimas tendencias en moda femenina' },
          { image_url: '/static/images/hero/hero2.png', title: 'Elegancia y Estilo', subtitle: 'Para cada ocasión especial' },
        ]);
      }
    };

    fetchHeroImages();

    // Configurar el intervalo para cambiar de slide solo si hay slides cargados
    const interval = setInterval(() => {
      if (heroSlides.length > 0) {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
      }
    }, 5000); // Cambia de slide cada 5 segundos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, [heroSlides.length]); // Dependencia para que el efecto se re-ejecute si cambian los slides

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (heroSlides.length === 0) {
    return <div>Cargando imágenes del hero...</div>; // O un spinner de carga
  }

  return (
    <HeroContainer>
      {heroSlides.map((slide, index) => (
        <HeroSlide key={index} $active={index === currentSlide}>
          {/* Usamos slide.image_url que viene del backend */}
          <HeroImage src={`${process.env.REACT_APP_API_URL}${slide.image_url}`} alt={slide.title} />
          <HeroContent>
            <HeroTitle>{slide.title}</HeroTitle>
            <HeroSubtitle>{slide.subtitle}</HeroSubtitle>
            <HeroButton href="#coleccion">Ver Colección</HeroButton>
          </HeroContent>
        </HeroSlide>
      ))}
      <DotsContainer>
        {heroSlides.map((_, index) => (
          <Dot key={index} $active={index === currentSlide} onClick={() => goToSlide(index)} />
        ))}
      </DotsContainer>
    </HeroContainer>
  );
};

export default HeroSection;