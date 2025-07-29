// src/pages/Home/NovedadesSection.styles.js

import styled from 'styled-components';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

const SPACING = {
  medium: '16px',
  large: '24px',
  xlarge: '32px',
  xxlarge: '48px',
};

export const SectionContainer = styled.section`
  padding: ${SPACING.xxlarge} 5%; /* 48px padding vertical */
  background-color: ${COLORS.gray}; /* Fondo gris claro */
  text-align: center;
`;

export const SectionTitle = styled.h2`
  font-family: ${FONTS.heading};
  font-size: 2.5rem;
  color: ${COLORS.black};
  margin-bottom: ${SPACING.xlarge}; /* 32px margin bottom */

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${SPACING.large}; /* 24px gap between cards */
  max-width: 1200px;
  margin: 0 auto;
`;