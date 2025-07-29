// src/components/CartModal/CartModal.js

import React from 'react';
import { useCart } from '../../context/CartContext';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  CartItemsContainer,
  CartItem,
  CartItemImage,
  CartItemDetails,
  CartItemName,
  CartItemPrice,
  QuantityControls,
  QuantityButton,
  QuantityDisplay,
  RemoveItemButton,
  CartSummary,
  CartTotal,
  SendOrderButton,
  EmptyCartMessage
} from './CartModal.styles';
import { FaTimes, FaPlus, FaMinus, FaTrash } from 'react-icons/fa'; // Iconos para el modal

const CartModal = () => {
  const {
    cartItems,
    isCartModalOpen,
    closeCartModal,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    getCartTotalItems,
    getCartTotalPrice,
    clearCart
  } = useCart();

  // Función para enviar el pedido por WhatsApp
  const sendOrderToWhatsApp = () => {
    if (cartItems.length === 0) {
      alert('Tu carrito está vacío. Añade productos antes de enviar un pedido.');
      return;
    }

    const total = getCartTotalPrice().toFixed(2);
    let message = `¡Hola! Me gustaría hacer un pedido de Autentica:\n\n`;

    cartItems.forEach(item => {
      message += `- ${item.name} (x${item.quantity}) - $/. ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\nTotal: $/. ${total}\n\n`;
    message += `Por favor, confírmame los detalles y el proceso de pago.`;

    // Codifica el mensaje para la URL de WhatsApp
    const encodedMessage = encodeURIComponent(message);
    // Número de teléfono de WhatsApp (ejemplo: +51 987654321 para Perú)
    const whatsappNumber = '51987654321'; // ¡REEMPLAZA CON TU NÚMERO DE WHATSAPP!

    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    clearCart(); // Opcional: Vaciar el carrito después de enviar el pedido
    closeCartModal(); // Cerrar el modal
  };

  if (!isCartModalOpen) return null; // No renderizar si el modal no está abierto

  return (
    <ModalOverlay onClick={closeCartModal}>
      <ModalContent onClick={(e) => e.stopPropagation()}> {/* Evita que el clic en el contenido cierre el modal */}
        <ModalHeader>
          <ModalTitle>Carrito de Compras ({getCartTotalItems()})</ModalTitle>
          <CloseButton onClick={closeCartModal}><FaTimes /></CloseButton>
        </ModalHeader>

        <CartItemsContainer>
          {cartItems.length === 0 ? (
            <EmptyCartMessage>Tu carrito está vacío.</EmptyCartMessage>
          ) : (
            cartItems.map(item => (
              <CartItem key={item.id}>
                <CartItemImage src={item.image} alt={item.name} />
                <CartItemDetails>
                  <CartItemName>{item.name}</CartItemName>
                  <CartItemPrice>$/. {item.price.toFixed(2)}</CartItemPrice>
                  <QuantityControls>
                    <QuantityButton onClick={() => decrementQuantity(item.id)}><FaMinus /></QuantityButton>
                    <QuantityDisplay>{item.quantity}</QuantityDisplay>
                    <QuantityButton onClick={() => incrementQuantity(item.id)}><FaPlus /></QuantityButton>
                  </QuantityControls>
                </CartItemDetails>
                <RemoveItemButton onClick={() => removeFromCart(item.id)}><FaTrash /></RemoveItemButton>
              </CartItem>
            ))
          )}
        </CartItemsContainer>

        <CartSummary>
          <CartTotal>Total: <span>$/. {getCartTotalPrice().toFixed(2)}</span></CartTotal>
          <SendOrderButton onClick={sendOrderToWhatsApp} disabled={cartItems.length === 0}>
            Enviar Pedido por WhatsApp
          </SendOrderButton>
          {cartItems.length > 0 && (
            <button onClick={clearCart} style={{ background: 'none', border: 'none', color: 'gray', marginTop: '10px', cursor: 'pointer' }}>Vaciar Carrito</button>
          )}
        </CartSummary>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CartModal;