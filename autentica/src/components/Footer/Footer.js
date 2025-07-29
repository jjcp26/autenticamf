// src/components/Footer/Footer.js

import React from 'react';
import { FooterWrapper, FooterContent, SocialLinks, SocialLink, FooterBottom } from './Footer.styles';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'; // Asegúrate de tener react-icons

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <div>
          <h3>Autentica</h3>
          <p>La moda que te define.</p>
        </div>
        <div>
          <h3>Síguenos</h3>
          <SocialLinks>
            <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></SocialLink>
            <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></SocialLink>
          </SocialLinks>
        </div>
      </FooterContent>
      <FooterBottom>
        <p>&copy; 2024 Autentica. Todos los derechos reservados.</p>
      </FooterBottom>
    </FooterWrapper>
  );
};

export default Footer;