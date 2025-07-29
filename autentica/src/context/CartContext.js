// src/context/CartContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

// Crea el contexto del carrito
const CartContext = createContext();

// Crea un proveedor para el contexto del carrito
export const CartProvider = ({ children }) => {
  // Estado del carrito, inicializado desde localStorage si existe
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('autentica_cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error al cargar el carrito de localStorage:", error);
      return [];
    }
  });
  const [isCartModalOpen, setIsCartModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

  // Efecto para guardar el carrito en localStorage cada vez que cambia
  useEffect(() => {
    try {
      localStorage.setItem('autentica_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [cartItems]);

  // Función para añadir un producto al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // Si el producto ya existe, incrementa la cantidad
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Si el producto no existe, añádelo con cantidad 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    setIsCartModalOpen(true); // Abrir el modal automáticamente al añadir un producto
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Función para incrementar la cantidad de un producto
  const incrementQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Función para decrementar la cantidad de un producto
  const decrementQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      ).filter(item => item.quantity > 0) // Eliminar si la cantidad llega a 0
    );
  };

  // Función para obtener el total de items en el carrito
  const getCartTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Función para obtener el total del precio del carrito
  const getCartTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Funciones para abrir y cerrar el modal del carrito
  const openCartModal = () => setIsCartModalOpen(true);
  const closeCartModal = () => setIsCartModalOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        getCartTotalItems,
        getCartTotalPrice,
        clearCart,
        isCartModalOpen,
        openCartModal,
        closeCartModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};