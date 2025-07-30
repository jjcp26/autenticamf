// src/components/Header/Header.js

import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { NavWrapper, Logo, NavLinks, NavItem, NavLink, MenuToggle, CartIcon, CartCount } from './Header.styles';
import { FaBars, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Importa useAuth
import logo from '../../assets/images/logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { getCartTotalItems, openCartModal } = useCart();
  const { user, logout } = useAuth(); // Obtiene el usuario y la función logout

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false); // Cierra el menú móvil después de cerrar sesión
  };

  return (
    <NavWrapper>
      <Logo>
          <img src={logo} alt="Logo de Autentica" />
      </Logo>
      <MenuToggle onClick={toggleMenu} aria-label="Menu">
        <FaBars />
      </MenuToggle>
      <NavLinks $active={menuOpen}>
        <NavItem><NavLink as={RouterNavLink} to="/">Inicio</NavLink></NavItem>
        <NavItem><NavLink as={RouterNavLink} to="/coleccion">Colección</NavLink></NavItem>
        <NavItem><NavLink as={RouterNavLink} to="/novedades">Novedades</NavLink></NavItem>
        <NavItem><NavLink as={RouterNavLink} to="/acerca">Acerca de</NavLink></NavItem>
        <NavItem><NavLink as={RouterNavLink} to="/contacto">Contacto</NavLink></NavItem>
        {user ? (
          <>
            <NavItem><NavLink as={RouterNavLink} to="/admin/dashboard">Dashboard Admin</NavLink></NavItem>
            <NavItem><NavLink onClick={handleLogout} as="button">Cerrar Sesión</NavLink></NavItem> {/* Usar as="button" para que Styled Components lo renderice como botón */}
          </>
        ) : (
          <NavItem><NavLink as={RouterNavLink} to="/admin/login" className="admin-link">Admin</NavLink></NavItem>
        )}
      </NavLinks>
      <CartIcon onClick={openCartModal}>
        <FaShoppingCart />
        <CartCount>{getCartTotalItems()}</CartCount>
      </CartIcon>
    </NavWrapper>
  );
};

export default Header;