// src/pages/Admin/LoginPage.styles.js

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

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px - 100px); /* Altura de la vista menos header y footer */
  background-color: ${COLORS.gray};
  padding: ${SPACING.xxlarge};
`;

export const LoginForm = styled.form`
  background-color: ${COLORS.white};
  padding: ${SPACING.xxlarge};
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.large};
`;

export const LoginTitle = styled.h2`
  font-family: ${FONTS.heading};
  font-size: 2rem;
  color: ${COLORS.black};
  text-align: center;
  margin-bottom: ${SPACING.medium};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.small};
`;

export const FormLabel = styled.label`
  font-family: ${FONTS.body};
  font-size: 1rem;
  color: ${COLORS.textDark};
  font-weight: 500;
`;

export const FormInput = styled.input`
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

export const LoginButton = styled.button`
  background-color: ${COLORS.primaryPink};
  color: ${COLORS.white};
  padding: ${SPACING.medium} ${SPACING.large};
  border-radius: 5px;
  font-family: ${FONTS.body};
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: ${SPACING.medium};

  &:hover {
    background-color: ${COLORS.lightPink};
  }

  &:disabled {
    background-color: ${COLORS.gray};
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-family: ${FONTS.body};
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: ${SPACING.small};
`;