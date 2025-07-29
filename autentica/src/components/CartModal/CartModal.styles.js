// src/components/CartModal/CartModal.styles.js

import styled, { keyframes } from 'styled-components';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end; /* Alinea el modal a la derecha */
  align-items: flex-start; /* Alinea el modal en la parte superior */
  z-index: 2000; /* Asegura que esté por encima de todo */
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ModalContent = styled.div`
  background-color: ${COLORS.white};
  width: 400px; /* Ancho del modal */
  max-width: 90%; /* Máximo 90% del ancho de la pantalla */
  height: 100vh; /* Ocupa toda la altura de la ventana */
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.3s ease-out;

  @media (max-width: 768px) {
    width: 100%; /* En móviles, ocupa todo el ancho */
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${COLORS.gray};
`;

export const ModalTitle = styled.h3`
  font-family: ${FONTS.heading};
  font-size: 1.8rem;
  color: ${COLORS.black};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.8rem;
  color: ${COLORS.black};
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.primaryPink};
  }
`;

export const CartItemsContainer = styled.div`
  flex-grow: 1; /* Permite que ocupe el espacio restante */
  padding: 1.5rem;
  overflow-y: auto; /* Habilita el scroll si hay muchos items */
`;

export const CartItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed ${COLORS.gray};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const CartItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

export const CartItemDetails = styled.div`
  flex-grow: 1;
`;

export const CartItemName = styled.h4`
  font-family: ${FONTS.body};
  font-size: 1.1rem;
  color: ${COLORS.black};
  margin-bottom: 0.2rem;
`;

export const CartItemPrice = styled.p`
  font-family: ${FONTS.body};
  font-size: 0.9rem;
  color: ${COLORS.textDark};
  margin-bottom: 0.5rem;
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const QuantityButton = styled.button`
  background-color: ${COLORS.gray};
  color: ${COLORS.black};
  border: 1px solid ${COLORS.gray};
  border-radius: 4px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${COLORS.lightPink};
    color: ${COLORS.white};
  }
`;

export const QuantityDisplay = styled.span`
  font-family: ${FONTS.body};
  font-weight: bold;
  padding: 0 8px;
`;

export const RemoveItemButton = styled.button`
  background: none;
  border: none;
  color: ${COLORS.primaryPink};
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.black};
  }
`;

export const CartSummary = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${COLORS.gray};
  text-align: right;
`;

export const CartTotal = styled.p`
  font-family: ${FONTS.heading};
  font-size: 1.5rem;
  color: ${COLORS.black};
  margin-bottom: 1rem;

  span {
    color: ${COLORS.primaryPink};
    font-weight: bold;
  }
`;

export const SendOrderButton = styled.button`
  background-color: ${COLORS.primaryPink};
  color: ${COLORS.white};
  padding: 1rem 1.5rem;
  border-radius: 5px;
  font-family: ${FONTS.body};
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${COLORS.lightPink};
  }

  &:disabled {
    background-color: ${COLORS.gray};
    cursor: not-allowed;
  }
`;

export const EmptyCartMessage = styled.p`
  font-family: ${FONTS.body};
  text-align: center;
  color: ${COLORS.textDark};
  padding: 2rem 0;
`;