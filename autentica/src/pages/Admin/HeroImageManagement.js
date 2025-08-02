// src/pages/admin/HeroImageManagement.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import Button from '../../components/Button/Button';
import { toast } from 'react-toastify';

const HeroImageManagement = () => {
  const { getToken } = useAuth(); // Usamos la función getToken del contexto
  const [heroImages, setHeroImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchHeroImages = async () => {
    try {
      const token = getToken(); // Obtenemos el token
      if (!token) {
        toast.error('No hay token de autenticación. Inicie sesión de nuevo.');
        return;
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/hero_images`, {
        headers: {
          'Authorization': `Bearer ${token}` // Añadimos el encabezado de autorización
        }
      });

      if (!response.ok) {
        throw new Error('Error de HTTP! estado: ' + response.status);
      }
      
      const data = await response.json();
      setHeroImages(data);
    } catch (error) {
      console.error("Error al obtener imágenes del héroe:", error);
      toast.error('Error al obtener imágenes: ' + error.message);
    }
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newImage) {
      toast.error("Por favor, seleccione un archivo para subir.");
      return;
    }

    const token = getToken(); // Obtenemos el token para el upload
    if (!token) {
      toast.error('No hay token de autenticación. Inicie sesión de nuevo.');
      return;
    }

    const formData = new FormData();
    formData.append("hero_image", newImage);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/hero_images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // Añadimos el encabezado de autorización
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error de HTTP! estado: ' + response.status);
      }
      
      await response.json();
      toast.success("Imagen subida con éxito!");
      setNewImage(null);
      setImagePreview(null);
      fetchHeroImages(); // Actualizar la lista
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast.error('Error al subir la imagen: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta imagen?")) {
      return;
    }

    const token = getToken(); // Obtenemos el token para el delete
    if (!token) {
      toast.error('No hay token de autenticación. Inicie sesión de nuevo.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/hero_images/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Añadimos el encabezado de autorización
        }
      });

      if (!response.ok) {
        throw new Error('Error de HTTP! estado: ' + response.status);
      }
      
      await response.json();
      toast.success("Imagen eliminada con éxito!");
      fetchHeroImages(); // Actualizar la lista
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      toast.error('Error al eliminar la imagen: ' + error.message);
    }
  };

  return (
    <ManagementContainer>
      <AdminHeader>
        <StyledNavLink to="/admin">{'< Volver al Panel'}</StyledNavLink>
        <h2>Gestión de Imágenes del Carrusel</h2>
      </AdminHeader>
      <UploadSection>
        <h3>Subir Nueva Imagen</h3>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        {imagePreview && (
          <ImagePreviewContainer>
            <img src={imagePreview} alt="Vista previa de la imagen" />
          </ImagePreviewContainer>
        )}
        <Button
          onClick={handleUpload}
          disabled={!newImage}
          icon={<FiUpload />}
          text="Subir Imagen"
        />
      </UploadSection>
      <ImagesList>
        <h3>Imágenes Actuales</h3>
        {heroImages.length > 0 ? (
          heroImages.map((image) => (
            <ImageItem key={image.id}>
              <img src={`${process.env.REACT_APP_API_URL}${image.url}`} alt={image.filename} />
              <Button
                onClick={() => handleDelete(image.id)}
                icon={<FiTrash2 />}
                text="Eliminar"
              />
            </ImageItem>
          ))
        ) : (
          <p>No hay imágenes del héroe disponibles.</p>
        )}
      </ImagesList>
    </ManagementContainer>
  );
};

// Estilos
const ManagementContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
`;

const StyledNavLink = styled(NavLink)`
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

const UploadSection = styled.div`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
  input[type="file"] {
    display: block;
    margin: 1rem auto;
  }
`;

const ImagePreviewContainer = styled.div`
  margin-top: 1rem;
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

const ImagesList = styled.div`
  h3 {
    margin-bottom: 1.5rem;
  }
`;

const ImageItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  img {
    max-width: 200px;
    height: auto;
    border-radius: 4px;
    margin-right: 1rem;
  }
`;

export default HeroImageManagement;