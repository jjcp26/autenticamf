// src/components/ProductCard/ProductCard.js

import React from 'react';
import { Card, ProductImage, ProductName, ProductPrice, AddToCartButton } from './ProductCard.styles';
import { useCart } from '../../context/CartContext'; // Importa el hook useCart

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // Usa el hook para acceder a la función addToCart

  const handleAddToCart = () => {
    addToCart(product); // Llama a addToCart con el producto actual
  };

  return (
    <Card>
      <ProductImage src={product.image} alt={product.name} />
      <ProductName>{product.name}</ProductName>
      <ProductPrice>$/. {product.price.toFixed(2)}</ProductPrice> {/* Formato de moneda */}
      <AddToCartButton onClick={handleAddToCart}>Añadir al Carrito</AddToCartButton>
    </Card>
  );
};

export default ProductCard;