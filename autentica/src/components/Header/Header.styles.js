// src/components/Header/Header.styles.js

import styled, { css } from 'styled-components';
import { COLORS } from '../../constants/colors'; // Importa tus colores
//import { FONTS } from '../../constants/fonts'; // Importa tus fuentes

// Definir espaciados y breakpoints aquí o como constantes si se usan mucho
const SPACING = {
  small: '8px',
  medium: '16px',
  large: '24px',
  xlarge: '32px',
};

const BREAKPOINTS = {
  mobile: '768px',
};

export const NavWrapper = styled.nav`
  background-color: ${COLORS.white};
  /*background-color: ${({ $scrolled }) => 
  $scrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent'};*/
  padding: ${SPACING.medium} 5%;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  display: flex;
  //justify-content: space-between;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  padding-left: 150px;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    flex-wrap: wrap;
    padding-left: ${SPACING.medium};
  }
`;

export const Logo = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, #ffffff 0%, #e0e0e0 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    position: static; // permite que el logo se alinee naturalmente
    margin-bottom: ${SPACING.medium}; // espacio debajo del logo
    display:none;
  }
`;



export const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: ${COLORS.primaryPink};
  

  &:hover {
    color: ${COLORS.black};
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: block;
    order: 2;
  }
`;

export const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  gap: ${SPACING.xlarge};

  @media (max-width: ${BREAKPOINTS.mobile}) {
    ${props =>
      props.$active
        ? css`
            display: flex;
          `
        : css`
            display: none;
          `}
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    width: 100%;
    background-color: ${COLORS.white};
    flex-direction: column;
    align-items: center;
    padding: ${SPACING.medium};
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    z-index: 999;
  }
`;

export const NavItem = styled.li`
  @media (max-width: ${BREAKPOINTS.mobile}) {
    width: 100%;
    text-align: center;
    padding: ${SPACING.small} 0;
  }
`;

export const NavLink = styled.a`
  text-decoration: none;
  color: ${COLORS.black};
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.primaryPink};
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: block;
    padding: ${SPACING.small} ${SPACING.medium};
  }
`;

export const CartIcon = styled.div`
  color: ${COLORS.black};
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  //margin-left: ${SPACING.xlarge}; // o prueba con xlarge si quieres más separación
  margin-left:auto;


  @media (max-width: ${BREAKPOINTS.mobile}) {
    order: 3;
    margin-left: auto;
  }
`;

export const CartCount = styled.span`
  background-color: ${COLORS.primaryPink};
  color: ${COLORS.white};
  border-radius: 50%;
  padding: 2px 7px;
  font-size: 0.8rem;
  font-weight: bold;
`;
