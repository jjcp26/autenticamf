// src/context/AuthContext.js (ACTUALIZADO)

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('autentica_admin_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error al cargar el usuario de localStorage:", error);
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('autentica_admin_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('autentica_admin_user');
      }
    } catch (error) {
      console.error("Error al guardar el usuario en localStorage:", error);
    }
  }, [user]);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
        credentials: 'include' // <--- AÑADE ESTA LÍNEA
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser({ username: data.user.username });
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Error desconocido en el inicio de sesión." };
      }
    } catch (error) {
      console.error("Error de red durante el login:", error);
      return { success: false, message: "Error de conexión. Inténtalo de nuevo." };
    }
  };

  const logout = async () => {
    try {
        await fetch('http://localhost:5000/admin/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // <--- AÑADE ESTA LÍNEA
        });
    } catch (error) {
        console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
        setUser(null);
        navigate('/admin/login', { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/admin/login" replace />;
};