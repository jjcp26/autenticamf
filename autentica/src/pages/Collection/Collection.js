// src/pages/Collection/Collection.js

import React, { useState, useEffect } from 'react';
import { SectionContainer, SectionTitle, ProductGrid } from './Collection.styles';
import ProductCard from '../../components/ProductCard/ProductCard';

const Collection = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
         const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllProducts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) return <SectionContainer><SectionTitle>Cargando colección...</SectionTitle></SectionContainer>;
  if (error) return <SectionContainer><SectionTitle>Error: {error.message}</SectionTitle></SectionContainer>;

  return (
    <SectionContainer>
      <SectionTitle>Nuestra Colección</SectionTitle>
      <ProductGrid>
        {allProducts.length > 0 ? (
          allProducts.map(product => (
            <ProductCard key={product.id} product={{
              ...product,
              image: `${process.env.REACT_APP_API_URL}${product.image_url}` // Usa image_url del backend
            }} />
          ))
        ) : (
          <p>No hay productos en la colección en este momento.</p>
        )}
      </ProductGrid>
    </SectionContainer>
  );
};

export default Collection;