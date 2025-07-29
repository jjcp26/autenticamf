// src/pages/Admin/LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LoginContainer,
  LoginForm,
  LoginTitle,
  FormGroup,
  FormLabel,
  FormInput,
  LoginButton,
  ErrorMessage
} from './LoginPage.styles';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Si el usuario ya está logueado, redirigir al dashboard
  if (user) {
    navigate('/admin/dashboard', { replace: true });
    return null; // No renderizar nada mientras redirige
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores anteriores
    const result = await login(username, password);

    if (result.success) {
      // Login exitoso, AuthContext ya actualizó el estado 'user'
      // El 'if (user)' de arriba se encargará de la redirección
    } else {
      setError(result.message);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Acceso Administrador</LoginTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <FormLabel htmlFor="username">Usuario:</FormLabel>
          <FormInput
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="password">Contraseña:</FormLabel>
          <FormInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <LoginButton type="submit">Iniciar Sesión</LoginButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;