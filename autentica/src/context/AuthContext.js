// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Creamos el contexto de autenticación
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la aplicación, verificamos si hay una sesión activa.
    // Esto se puede hacer llamando a una ruta en el backend que
    // devuelva el estado de la sesión, pero para mantenerlo simple,
    // asumiremos que el estado de la sesión se gestiona con éxito
    // en cada solicitud protegida.
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // AÑADIMOS ESTO: Esto es CRUCIAL para que el navegador acepte
        // y guarde la cookie de sesión que el backend de Flask envía.
        credentials: 'include' 
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setUser({ username: data.user.username });
        toast.success(data.message);
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        toast.error(data.message || 'Error de inicio de sesión.');
        return false;
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error('Ocurrió un error al intentar iniciar sesión.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/logout`, {
        method: 'POST',
        // CRUCIAL: También se necesita 'credentials: "include"' para
        // que la solicitud de cierre de sesión envíe la cookie correcta.
        credentials: 'include' 
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        toast.success('Has cerrado sesión correctamente.');
      } else {
        toast.error('Error al cerrar sesión.');
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error('Ocurrió un error al cerrar sesión.');
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
