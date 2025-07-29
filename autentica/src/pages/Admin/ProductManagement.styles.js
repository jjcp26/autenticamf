// src/pages/Admin/ProductManagement.styles.js

import styled, { keyframes } from 'styled-components';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

const SPACING = {
  small: '8px',
  medium: '16px',
  large: '24px',
  xlarge: '32px',
  xxlarge: '48px',
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const ManagementContainer = styled.div`
  min-height: calc(100vh - 80px - 100px);
  background-color: ${COLORS.gray};
  padding: ${SPACING.xxlarge} 5%;
`;

export const ManagementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${SPACING.xlarge};
  flex-wrap: wrap;
  gap: ${SPACING.medium};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ManagementTitle = styled.h2`
  font-family: ${FONTS.heading};
  font-size: 2.5rem;
  color: ${COLORS.black};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const AddButton = styled.button`
  background-color: ${COLORS.primaryPink};
  color: ${COLORS.white};
  padding: ${SPACING.medium} ${SPACING.large};
  border-radius: 5px;
  font-family: ${FONTS.body};
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${SPACING.small};

  &:hover {
    background-color: ${COLORS.lightPink};
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${COLORS.white};
  border-radius: 8px;
  overflow: hidden; /* Para que los bordes redondeados funcionen con el overflow */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

export const TableHeader = styled.th`
  background-color: ${COLORS.black};
  color: ${COLORS.white};
  font-family: ${FONTS.body};
  font-weight: 600;
  padding: ${SPACING.medium};
  text-align: left;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${COLORS.gray};
  }
  &:hover {
    background-color: ${COLORS.lightPink}20; /* Un rosa muy claro al pasar el ratón */
  }
`;

export const TableCell = styled.td`
  font-family: ${FONTS.body};
  padding: ${SPACING.medium};
  border-bottom: 1px solid ${COLORS.gray};
  color: ${COLORS.textDark};
  vertical-align: middle; /* Alineación vertical */

  img {
    max-width: 80px;
    height: auto;
    border-radius: 4px;
  }
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${COLORS.primaryPink};
  font-size: 1.1rem;
  cursor: pointer;
  margin-right: ${SPACING.small};
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.black};
  }
`;

// Modal Styles
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000; /* Más alto que el carrito */
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ModalContent = styled.div`
  background-color: ${COLORS.white};
  padding: ${SPACING.xxlarge};
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 600px;
  animation: ${slideIn} 0.3s ease-out;
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${SPACING.xlarge};
`;

export const ModalTitle = styled.h3`
  font-family: ${FONTS.heading};
  font-size: 2rem;
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

export const FormGroup = styled.div`
  margin-bottom: ${SPACING.medium};
`;

export const FormLabel = styled.label`
  display: block;
  font-family: ${FONTS.body};
  font-size: 1rem;
  color: ${COLORS.textDark};
  margin-bottom: ${SPACING.small};
  font-weight: 500;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: ${SPACING.medium};
  border: 1px solid ${COLORS.gray};
  border-radius: 4px;
  font-family: ${FONTS.body};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${COLORS.primaryPink};
    box-shadow: 0 0 0 2px ${COLORS.lightPink};
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: ${SPACING.medium};
  border: 1px solid ${COLORS.gray};
  border-radius: 4px;
  font-family: ${FONTS.body};
  font-size: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${COLORS.primaryPink};
    box-shadow: 0 0 0 2px ${COLORS.lightPink};
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: ${SPACING.medium};
  border: 1px solid ${COLORS.gray};
  border-radius: 4px;
  font-family: ${FONTS.body};
  font-size: 1rem;
  background-color: ${COLORS.white};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${COLORS.primaryPink};
    box-shadow: 0 0 0 2px ${COLORS.lightPink};
  }
`;

export const FormButton = styled.button`
  background-color: ${COLORS.primaryPink};
  color: ${COLORS.white};
  padding: ${SPACING.medium} ${SPACING.large};
  border-radius: 5px;
  font-family: ${FONTS.body};
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: ${SPACING.large};

  &:hover {
    background-color: ${COLORS.lightPink};
  }

  &:disabled {
    background-color: ${COLORS.gray};
    cursor: not-allowed;
  }
`;

export const Message = styled.div`
  padding: ${SPACING.medium};
  margin-bottom: ${SPACING.large};
  border-radius: 5px;
  font-family: ${FONTS.body};
  font-weight: 500;
  text-align: center;

  ${props => props.type === 'success' && `
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  `}

  ${props => props.type === 'error' && `
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  `}

  ${props => props.type === 'info' && `
    background-color: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  `}

  
`;

export const FormCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.small};
  margin-top: ${SPACING.medium};
`;

export const FormCheckboxInput = styled.input`
  width: auto; /* Ancho automático para no ocupar todo el espacio como los inputs */
  margin-right: ${SPACING.small};
  cursor: pointer;
`;

export const FormCheckboxLabel = styled.label`
  font-family: ${FONTS.body};
  font-size: 1rem;
  color: ${COLORS.textDark};
  cursor: pointer;
`;
