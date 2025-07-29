// src/pages/Admin/AdminDashboard.styles.js

import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

const SPACING = {
  medium: '16px',
  large: '24px',
  xlarge: '32px',
  xxlarge: '48px',
};

export const DashboardContainer = styled.div`
  min-height: calc(100vh - 80px - 100px);
  background-color: ${COLORS.gray};
  padding: ${SPACING.xxlarge} 5%;
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: ${SPACING.xlarge};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${SPACING.medium};
  }
`;

export const DashboardTitle = styled.h2`
  font-family: ${FONTS.heading};
  font-size: 2.5rem;
  color: ${COLORS.black};
`;

export const DashboardLinks = styled.nav`
  display: flex;
  gap: ${SPACING.medium};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const DashboardLink = styled(Link)`
  text-decoration: none;
  font-family: ${FONTS.body};
  font-weight: 500;
  color: ${COLORS.white};
  background-color: ${COLORS.primaryPink};
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: ${COLORS.lightPink};
  }
  
  &[as="button"] {
    border: none;
  }
`;

export const DashboardContent = styled.div`
  background-color: ${COLORS.white};
  padding: ${SPACING.xlarge};
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

export const WelcomeMessage = styled.p`
  font-family: ${FONTS.body};
  font-size: 1.2rem;
  color: ${COLORS.textDark};
  text-align: center;
`;