// src/pages/Contact/Contact.js

import React, { useState } from 'react';
import { ContactContainer, ContactTitle, ContactContent, ContactForm, FormInput, FormTextarea, FormButton, ContactInfo, InfoItem, InfoIcon, InfoText } from './Contact.styles';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'loading'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      const response = await fetch('http://localhost:5000/api/enviar-mensaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        alert(result.message); // Usar alert temporalmente, considera un modal personalizado
        setFormData({ name: '', email: '', message: '' }); // Limpiar el formulario
      } else {
        setSubmitStatus('error');
        alert(`Error al enviar mensaje: ${result.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error de red al enviar mensaje:', error);
      setSubmitStatus('error');
      alert('Hubo un problema de conexión al enviar tu mensaje. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <ContactContainer id="contacto">
      <ContactTitle>Contáctanos</ContactTitle>
      <ContactContent>
        <ContactForm onSubmit={handleSubmit}>
          <FormInput
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormTextarea
            name="message"
            placeholder="Mensaje"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            required
          ></FormTextarea>
          <FormButton type="submit" disabled={submitStatus === 'loading'}>
            {submitStatus === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
          </FormButton>
          {submitStatus === 'success' && <p style={{ color: 'green' }}>¡Mensaje enviado con éxito!</p>}
          {submitStatus === 'error' && <p style={{ color: 'red' }}>Error al enviar el mensaje.</p>}
        </ContactForm>
        <ContactInfo>
          <InfoItem>
            <InfoIcon><FaMapMarkerAlt /></InfoIcon>
            <InfoText>Calle Principal #123, Ciudad</InfoText>
          </InfoItem>
          <InfoItem>
            <InfoIcon><FaPhone /></InfoIcon>
            <InfoText>+1 234 567 890</InfoText>
          </InfoItem>
          <InfoItem>
            <InfoIcon><FaEnvelope /></InfoIcon>
            <InfoText>info@autentica.com</InfoText>
          </InfoItem>
        </ContactInfo>
      </ContactContent>
    </ContactContainer>
  );
};

export default Contact;