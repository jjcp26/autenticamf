// src/pages/Admin/ProductManagement.js (ACTUALIZADO)

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
  FormInput,
  FormTextarea,
  FormSelect,
  FormButton,
  Message
} from './ProductManagement.styles';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    image_url: ''
  });
  const [message, setMessage] = useState(null);

  const categories = ['Vestidos', 'Blusas', 'Pantalones', 'Faldas', 'Accesorios', 'Calzado'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/admin/products', {
        credentials: 'include' // <--- AÑADE ESTA LÍNEA
      });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Respuesta de la API no OK:", response.status, errorBody);
        throw new Error(`HTTP error! status: ${response.status} - ${errorBody.substring(0, 100)}...`);
      }
      const data = await response.json();
      console.log("Datos recibidos de la API de productos:", data);

      if (!Array.isArray(data)) {
        throw new Error("La API no devolvió un array de productos.");
      }

      setProducts(data);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setCurrentProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      image_url: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      image_url: ''
    });
    setMessage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const method = currentProduct ? 'PUT' : 'POST';
    const url = currentProduct
      ? `http://localhost:5000/api/admin/products/${currentProduct.id}`
      : 'http://localhost:5000/api/admin/products';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
        // --- CAMBIO CLAVE AQUÍ ---
        if (currentProduct) { // Si estamos editando
          setProducts(prevProducts =>
            prevProducts.map(p => (p.id === currentProduct.id ? { ...p, ...formData } : p))
          );
        } else { // Si estamos añadiendo
          // Para añadir, necesitamos el ID del nuevo producto del backend
          setProducts(prevProducts => [
            ...prevProducts,
            { ...formData, id: data.id } // Asume que el backend devuelve el ID
          ]);
        }
        closeModal();
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al guardar el producto.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Error de conexión: ${err.message}` });
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setMessage(null);
      try {
        const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setMessage({ type: 'success', text: data.message });
          // --- CAMBIO CLAVE AQUÍ ---
          setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        } else {
          setMessage({ type: 'error', text: data.message || 'Error al eliminar el producto.' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: `Error de conexión: ${err.message}` });
      }
    }
  };

  if (loading) return <ManagementContainer><Message type="info">Cargando productos...</Message></ManagementContainer>;
  if (error) return <ManagementContainer><Message type="error">Error: {error}</Message></ManagementContainer>;

  return (
    <ManagementContainer>
      <ManagementHeader>
        <ManagementTitle>Gestión de Productos</ManagementTitle>
        <AddButton onClick={openAddModal}><FaPlus /> Añadir Producto</AddButton>
      </ManagementHeader>

      {message && <Message type={message.type}>{message.text}</Message>}

      <Table>
        <thead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Imagen</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Categoría</TableHeader>
            <TableHeader>Precio</TableHeader>
            <TableHeader>Stock</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan="7">No hay productos para mostrar.</TableCell>
            </TableRow>
          ) : (
            products.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  <img src={`http://localhost:5000${product.image_url}`} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>$/. {product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <ActionButton onClick={() => openEditModal(product)}><FaEdit /></ActionButton>
                  <ActionButton onClick={() => handleDelete(product.id)}><FaTrash /></ActionButton>
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
              <ModalTitle>{currentProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}</ModalTitle>
              <CloseButton onClick={closeModal}><FaTimes /></CloseButton>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="name">Nombre:</FormLabel>
                <FormInput type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="description">Descripción:</FormLabel>
                <FormTextarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3"></FormTextarea>
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="category">Categoría:</FormLabel>
                <FormSelect id="category" name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="price">Precio:</FormLabel>
                <FormInput type="number" id="price" name="price" value={formData.price} onChange={handleChange} step="0.01" required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="stock">Stock:</FormLabel>
                <FormInput type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="image_url">URL de Imagen:</FormLabel>
                <FormInput type="text" id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} required />
              </FormGroup>
              <FormButton type="submit">{currentProduct ? 'Guardar Cambios' : 'Añadir Producto'}</FormButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </ManagementContainer>
  );
};

export default ProductManagement;