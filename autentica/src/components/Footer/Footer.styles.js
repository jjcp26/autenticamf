// src/components/Footer/Footer.styles.js

import styled from 'styled-components';
import { COLORS } from '../../constants/colors'; // Importa tus colores
import { FONTS } from '../../constants/fonts';   // Importa tus fuentes

const SPACING = {
  small: '8px',
  medium: '16px',
  large: '24px',
  xlarge: '32px',
};

export const FooterWrapper = styled.footer`
  background-color: ${COLORS.black};
  color: ${COLORS.white};
  padding: ${SPACING.xlarge} 5% ${SPACING.medium};
`;

export const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${SPACING.xlarge};
  margin-bottom: ${SPACING.xlarge};
  text-align: center;

  h3 {
    margin-bottom: ${SPACING.medium};
    color: ${COLORS.white};
    font-family: ${FONTS.heading}; /* Usa la fuente de encabezado */
  }

  p {
    margin-bottom: ${SPACING.small};
    font-family: ${FONTS.body}; /* Usa la fuente de cuerpo */
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: ${SPACING.medium};
  justify-content: center;
  margin-top: ${SPACING.medium};
`;

export const SocialLink = styled.a`
  color: ${COLORS.white};
  font-size: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.primaryPink};
  }
`;

export const FooterBottom = styled.div`
  text-align: center;
  padding-top: ${SPACING.xlarge};
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 0.9rem;
  font-family: ${FONTS.body}; /* Usa la fuente de cuerpo */
`;