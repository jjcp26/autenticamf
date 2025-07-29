// src/pages/Home/NovedadesSection.js

import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { SectionContainer, SectionTitle, ProductGrid } from './NovedadesSection.styles';

const NovedadesSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/novedades');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNovedades();
  }, []);

  if (loading) return <SectionContainer><SectionTitle>Cargando novedades...</SectionTitle></SectionContainer>;
  if (error) return <SectionContainer><SectionTitle>Error: {error.message}</SectionTitle></SectionContainer>;

  return (
    <SectionContainer id="novedades">
      <SectionTitle>Novedades</SectionTitle>
      <ProductGrid>
        {featuredProducts.length > 0 ? (
          featuredProducts.map(product => (
            <ProductCard key={product.id} product={{
              ...product,
              image: `http://localhost:5000${product.image_url}` // Usa image_url del backend
            }} />
          ))
        ) : (
          <p>No hay novedades disponibles en este momento.</p>
        )}
      </ProductGrid>
    </SectionContainer>
  );
};

export default NovedadesSection;