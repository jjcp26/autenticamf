// src/pages/Collection/Collection.styles.js

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
  padding: ${SPACING.xxlarge} 5%;
  background-color: ${COLORS.gray};
  text-align: center;
`;

export const SectionTitle = styled.h2`
  font-family: ${FONTS.heading};
  font-size: 2.8rem; /* Un poco más grande para la página de colección */
  color: ${COLORS.black};
  margin-bottom: ${SPACING.xlarge};

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Tarjetas un poco más grandes */
  gap: ${SPACING.large};
  max-width: 1400px; /* Más ancho para la colección */
  margin: 0 auto;
`;