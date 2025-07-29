// src/components/ProductCard/ProductCard.styles.js

import styled from 'styled-components';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const Card = styled.div`
  background-color: ${COLORS.white};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 200px; /* Altura fija para las imágenes de producto */
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export const ProductName = styled.h3`
  font-family: ${FONTS.heading};
  font-size: 1.2rem;
  color: ${COLORS.black};
  margin-bottom: 0.5rem;
`;

export const ProductPrice = styled.p`
  font-family: ${FONTS.body};
  font-size: 1.1rem;
  color: ${COLORS.primaryPink};
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const AddToCartButton = styled.button`
  background-color: ${COLORS.primaryPink};
  color: ${COLORS.white};
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-family: ${FONTS.body};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${COLORS.lightPink};
  }
`;