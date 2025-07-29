// src/pages/Contact/Contact.styles.js

import styled from 'styled-components';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

const SPACING = {
  small: '8px',
  medium: '16px',
  large: '24px',
  xlarge: '32px',
  xxlarge: '48px',
};

export const ContactContainer = styled.section`
  padding: ${SPACING.xxlarge} 5%;
  background-color: ${COLORS.gray};
  text-align: center;
`;

export const ContactTitle = styled.h2`
  font-family: ${FONTS.heading};
  font-size: 2.8rem;
  color: ${COLORS.black};
  margin-bottom: ${SPACING.xlarge};

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

export const ContactContent = styled.div`
  display: flex;
  justify-content: center;
  gap: ${SPACING.xxlarge};
  max-width: 1000px;
  margin: 0 auto;
  flex-wrap: wrap; /* Permite que los elementos se envuelvan en pantallas pequeñas */
`;

export const ContactForm = styled.form`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.medium};
  background-color: ${COLORS.white};
  padding: ${SPACING.xlarge};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

export const FormInput = styled.input`
  padding: ${SPACING.small} ${SPACING.medium};
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
  padding: ${SPACING.small} ${SPACING.medium};
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

  &:hover {
    background-color: ${COLORS.lightPink};
  }
`;

export const ContactInfo = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.medium};
  background-color: ${COLORS.white};
  padding: ${SPACING.xlarge};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.small};
  margin-bottom: ${SPACING.small};
`;

export const InfoIcon = styled.div`
  color: ${COLORS.primaryPink};
  font-size: 1.5rem;
  min-width: ${SPACING.xlarge}; /* Para alinear el texto */
`;

export const InfoText = styled.p`
  font-family: ${FONTS.body};
  font-size: 1rem;
  color: ${COLORS.textDark};
`;