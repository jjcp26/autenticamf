// src/pages/Admin/NovedadesManagement.js (ACTUALIZADO)

import React, { useState, useEffect } from 'react';
import {
  ManagementContainer,
  ManagementHeader,
  ManagementTitle,
  AddButton,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  ActionButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FormGroup,
  FormLabel,
  FormSelect,
  FormButton,
  Message
} from './ProductManagement.styles';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

const NovedadesManagement = () => {
  const [novedades, setNovedades] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchNovedadesAndProducts();
  }, []);

  const fetchNovedadesAndProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const novedadesResponse = await fetch('http://localhost:5000/api/admin/novedades', {
        credentials: 'include' // <--- AÑADE ESTA LÍNEA
      });
      if (!novedadesResponse.ok) {
        throw new Error(`HTTP error! status: ${novedadesResponse.status}`);
      }
      const novedadesData = await novedadesResponse.json();
      setNovedades(novedadesData);

      const allProductsResponse = await fetch('http://localhost:5000/api/admin/products', {
        credentials: 'include' // <--- AÑADE ESTA LÍNEA
      });
      if (!allProductsResponse.ok) {
        throw new Error(`HTTP error! status: ${allProductsResponse.status}`);
      }
      const allProductsData = await allProductsResponse.json();
      setAllProducts(allProductsData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setSelectedProductId('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId('');
    setMessage(null);
  };

  const handleAddNovedad = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedProductId) {
      setMessage({ type: 'error', text: 'Por favor, selecciona un producto.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/novedades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: parseInt(selectedProductId) }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
        // --- CAMBIO CLAVE AQUÍ ---
        // Encuentra el producto recién añadido de allProducts y añádelo a novedades localmente
        const addedProduct = allProducts.find(p => p.id === parseInt(selectedProductId));
        if (addedProduct) {
          setNovedades(prevNovedades => [...prevNovedades, addedProduct]);
          setAllProducts(prevAllProducts => prevAllProducts.filter(p => p.id !== parseInt(selectedProductId))); // Quitar de disponibles
        }
        closeModal();
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al añadir a novedades.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Error de conexión: ${err.message}` });
    }
  };

  const handleRemoveNovedad = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto de novedades?')) {
      setMessage(null);
      try {
        const response = await fetch(`http://localhost:5000/api/admin/novedades/${productId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setMessage({ type: 'success', text: data.message });
          // --- CAMBIO CLAVE AQUÍ ---
          // Mueve el producto de novedades a allProducts (disponibles) localmente
          const removedProduct = novedades.find(p => p.id === productId);
          if (removedProduct) {
            setAllProducts(prevAllProducts => [...prevAllProducts, removedProduct]);
            setNovedades(prevNovedades => prevNovedades.filter(p => p.id !== productId));
          }
        } else {
          setMessage({ type: 'error', text: data.message || 'Error al eliminar de novedades.' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: `Error de conexión: ${err.message}` });
      }
    }
  };

  const availableProducts = allProducts.filter(
    product => !novedades.some(novedad => novedad.id === product.id)
  );

  if (loading) return <ManagementContainer><Message type="info">Cargando novedades...</Message></ManagementContainer>;
  if (error) return <ManagementContainer><Message type="error">Error: {error}</Message></ManagementContainer>;

  return (
    <ManagementContainer>
      <ManagementHeader>
        <ManagementTitle>Gestión de Novedades</ManagementTitle>
        <AddButton onClick={openAddModal}><FaPlus /> Añadir Novedad</AddButton>
      </ManagementHeader>

      {message && <Message type={message.type}>{message.text}</Message>}

      <Table>
        <thead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Imagen</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Precio</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {novedades.length === 0 ? (
            <TableRow>
              <TableCell colSpan="5">No hay productos marcados como novedades.</TableCell>
            </TableRow>
          ) : (
            novedades.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  <img src={`http://localhost:5000${product.image_url}`} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>$/. {product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <ActionButton onClick={() => handleRemoveNovedad(product.id)}><FaTrash /></ActionButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>

      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Añadir Producto a Novedades</ModalTitle>
              <CloseButton onClick={closeModal}><FaTimes /></CloseButton>
            </ModalHeader>
            <form onSubmit={handleAddNovedad}>
              <FormGroup>
                <FormLabel htmlFor="productSelect">Selecciona un Producto:</FormLabel>
                <FormSelect
                  id="productSelect"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  required
                >
                  <option value="">-- Selecciona --</option>
                  {availableProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (ID: {product.id})
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>
              <FormButton type="submit">Añadir a Novedades</FormButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </ManagementContainer>
  );
};

export default NovedadesManagement;