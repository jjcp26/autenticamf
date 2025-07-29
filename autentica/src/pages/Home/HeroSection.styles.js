// src/pages/Home/HeroSection.styles.js

import styled, { css, keyframes } from 'styled-components';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const HeroContainer = styled.section`
  position: relative;
  width: 100%;
  height: 80vh; /* Altura de la sección Hero */
  overflow: hidden;
`;

export const HeroSlide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props =>
    props.$active &&
    css`
      opacity: 1;
      animation: ${fadeIn} 1s forwards;
    `}
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7); /* Oscurecer un poco la imagen para que el texto resalte */
`;

export const HeroContent = styled.div`
  position: absolute;
  text-align: center;
  color: ${COLORS.white};
  z-index: 1;
  padding: 0 20px;
`;

export const HeroTitle = styled.h1`
  font-family: ${FONTS.heading};
  font-size: 3.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-family: ${FONTS.body};
  font-size: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const HeroButton = styled.a`
  background-color: ${COLORS.primaryPink};
  color: ${COLORS.white};
  padding: 15px 30px;
  border-radius: 5px;
  font-family: ${FONTS.body};
  font-weight: bold;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${COLORS.lightPink};
  }
`;

export const DotsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
`;

export const Dot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid ${COLORS.white};
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  ${props =>
    props.$active &&
    css`
      background-color: ${COLORS.white};
      transform: scale(1.2);
    `}

  &:hover {
    background-color: ${COLORS.white};
  }
`;