// src/pages/Admin/HeroImageManagement.js (ACTUALIZADO)

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
  FormCheckboxContainer,
  FormCheckboxLabel,
  FormCheckboxInput,
  FormButton,
  Message
} from './ProductManagement.styles';
import { FaPlus, FaToggleOn, FaToggleOff, FaTrash, FaTimes } from 'react-icons/fa';

const HeroImageManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    image_url: '',
    title: '',
    subtitle: '',
    active: true
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/admin/hero_images', {
        credentials: 'include' // <--- AÑADE ESTA LÍNEA
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({
      image_url: '',
      title: '',
      subtitle: '',
      active: true
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      image_url: '',
      title: '',
      subtitle: '',
      active: true
    });
    setMessage(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/hero_images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include' // <--- AÑADE ESTA LÍNEA
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
        fetchHeroImages();
        closeModal();
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al añadir la imagen del carrusel.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Error de conexión: ${err.message}` });
    }
  };

const handleToggleActive = async (imageId, currentStatus) => {
    setMessage(null);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/hero_images/${imageId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: !currentStatus }),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
        // --- CAMBIO CLAVE AQUÍ ---
        // En lugar de recargar todo, actualizamos el estado localmente
        setImages(prevImages =>
          prevImages.map(img =>
            img.id === imageId ? { ...img, active: data.new_status } : img
          )
        );
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al cambiar el estado.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Error de conexión: ${err.message}` });
    }
  };

  const handleDelete = async (imageId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen del carrusel?')) {
      setMessage(null);
      try {
        const response = await fetch(`http://localhost:5000/api/admin/hero_images/${imageId}`, {
          method: 'DELETE',
          credentials: 'include' // <--- AÑADE ESTA LÍNEA
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setMessage({ type: 'success', text: data.message });
          fetchHeroImages();
        } else {
          setMessage({ type: 'error', text: data.message || 'Error al eliminar la imagen.' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: `Error de conexión: ${err.message}` });
      }
    }
  };

  if (loading) return <ManagementContainer><Message type="info">Cargando imágenes del carrusel...</Message></ManagementContainer>;
  if (error) return <ManagementContainer><Message type="error">Error: {error}</Message></ManagementContainer>;

  return (
    <ManagementContainer>
      <ManagementHeader>
        <ManagementTitle>Gestión de Imágenes del Carrusel</ManagementTitle>
        <AddButton onClick={openAddModal}><FaPlus /> Añadir Imagen</AddButton>
      </ManagementHeader>

      {message && <Message type={message.type}>{message.text}</Message>}

      <Table>
        <thead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Imagen</TableHeader>
            <TableHeader>Título</TableHeader>
            <TableHeader>Subtítulo</TableHeader>
            <TableHeader>Activa</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {images.length === 0 ? (
            <TableRow>
              <TableCell colSpan="6">No hay imágenes del carrusel para mostrar.</TableCell>
            </TableRow>
          ) : (
            images.map(image => (
              <TableRow key={image.id}>
                <TableCell>{image.id}</TableCell>
                <TableCell>
                  <img src={`http://localhost:5000${image.image_url}`} alt={image.title} style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                </TableCell>
                <TableCell>{image.title}</TableCell>
                <TableCell>{image.subtitle}</TableCell>
                <TableCell>
                  {image.active ? <FaToggleOn style={{ color: 'green', fontSize: '1.5rem' }} /> : <FaToggleOff style={{ color: 'red', fontSize: '1.5rem' }} />}
                </TableCell>
                <TableCell>
                  <ActionButton onClick={() => handleToggleActive(image.id, image.active)}>
                    {image.active ? 'Desactivar' : 'Activar'}
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(image.id)}><FaTrash /></ActionButton>
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
              <ModalTitle>Añadir Nueva Imagen del Carrusel</ModalTitle>
              <CloseButton onClick={closeModal}><FaTimes /></CloseButton>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="image_url">URL de Imagen:</FormLabel>
                <FormInput type="text" id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="title">Título:</FormLabel>
                <FormInput type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="subtitle">Subtítulo:</FormLabel>
                <FormInput type="text" id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <FormCheckboxContainer>
                  <FormCheckboxInput
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                  />
                  <FormCheckboxLabel htmlFor="active">Activa</FormCheckboxLabel>
                </FormCheckboxContainer>
              </FormGroup>
              <FormButton type="submit">Añadir Imagen</FormButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </ManagementContainer>
  );
};

export default HeroImageManagement;