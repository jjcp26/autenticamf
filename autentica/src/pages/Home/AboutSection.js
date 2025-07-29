// src/pages/Home/AboutSection.js

import React from 'react';
import { AboutContainer, AboutContent, AboutTitle, AboutText, AboutImage } from './AboutSection.styles';
import aboutImage from '../../assets/images/about-us.png'; // Asegúrate de tener una imagen para esta sección

const AboutSection = () => {
  return (
    <AboutContainer id="acerca">
      <AboutImage src={aboutImage} alt="Acerca de Autentica" />
      <AboutContent>
        <AboutTitle>Acerca de Autentica</AboutTitle>
        <AboutText>
          En Autentica, creemos que la moda es una forma de expresión personal.
          Nuestra misión es ofrecer ropa femenina con estilo y elegancia, diseñada
          para hacer que cada mujer se sienta hermosa y segura con su vestimenta.
          Desde las últimas tendencias hasta clásicos atemporales, seleccionamos
          cuidadosamente cada pieza para garantizar calidad y diseño excepcionales.
        </AboutText>
        <AboutText>
          Nos apasiona ayudarte a encontrar tu estilo único y celebrar tu individualidad.
          Explora nuestra colección y únete a la comunidad de Autentica, donde la moda
          se encuentra con la autenticidad.
        </AboutText>
      </AboutContent>
    </AboutContainer>
  );
};

export default AboutSection;