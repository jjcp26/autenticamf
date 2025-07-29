// src/pages/Admin/AdminDashboard.js (ACTUALIZADO)

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  DashboardContainer,
  DashboardHeader,
  DashboardTitle,
  DashboardLinks,
  DashboardLink,
  DashboardContent,
  WelcomeMessage,
} from './AdminDashboard.styles';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Panel de Administración</DashboardTitle>
        <DashboardLinks>
          <DashboardLink to="/admin/products">Gestión de Productos</DashboardLink>
          <DashboardLink to="/admin/hero-images">Gestión de Carrusel</DashboardLink> {/* Nuevo enlace */}
          <DashboardLink to="/admin/novedades">Gestión de Novedades</DashboardLink> {/* Nuevo enlace */}
          <DashboardLink onClick={logout} as="button">Cerrar Sesión</DashboardLink>
        </DashboardLinks>
      </DashboardHeader>
      <DashboardContent>
        <WelcomeMessage>
          Hola, {user?.username}. Usa el menú de arriba para administrar la tienda.
        </WelcomeMessage>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default AdminDashboard;