// src/pages/Home/AboutSection.styles.js

import styled from 'styled-components';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

const SPACING = {
  medium: '16px',
  large: '24px',
  xlarge: '32px',
  xxlarge: '48px',
};

export const AboutContainer = styled.section`
  display: flex;
  flex-direction: row; /* Por defecto, imagen a la izquierda, texto a la derecha */
  align-items: center;
  padding: ${SPACING.xxlarge} 5%;
  background-color: ${COLORS.white};
  gap: ${SPACING.xlarge}; /* Espacio entre imagen y texto */

  @media (max-width: 992px) {
    flex-direction: column; /* Columna en pantallas más pequeñas */
    text-align: center;
  }
`;

export const AboutImage = styled.img`
  flex: 1; /* Ocupa una parte del espacio */
  max-width: 500px; /* Tamaño máximo para la imagen */
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 992px) {
    margin-bottom: ${SPACING.xlarge};
    max-width: 100%;
  }
`;

export const AboutContent = styled.div`
  flex: 1; /* Ocupa la otra parte del espacio */
`;

export const AboutTitle = styled.h2`
  font-family: ${FONTS.heading};
  font-size: 2.5rem;
  color: ${COLORS.black};
  margin-bottom: ${SPACING.large};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const AboutText = styled.p`
  font-family: ${FONTS.body};
  font-size: 1rem;
  line-height: 1.8;
  color: ${COLORS.textDark};
  margin-bottom: ${SPACING.medium};

  &:last-child {
    margin-bottom: 0;
  }
`;