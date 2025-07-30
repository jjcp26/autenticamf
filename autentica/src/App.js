// src/App.js (ACTUALIZADO CON RUTAS DE ADMIN)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Collection from './pages/Collection/Collection';
import Contact from './pages/Contact/Contact';
import NovedadesSection from './pages/Home/NovedadesSection';
import AboutSection from './pages/Home/AboutSection';
import CartModal from './components/CartModal/CartModal';
import LoginPage from './pages/Admin/LoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductManagement from './pages/Admin/ProductManagement';
import HeroImageManagement from './pages/Admin/HeroImageManagement'; // <-- ASEGÚRATE DE ESTE IMPORT
import NovedadesManagement from './pages/Admin/NovedadesManagement'; // <-- ASEGÚRATE DE ESTE IMPORT

import { CartProvider } from './context/CartContext';
import { AuthProvider, PrivateRoute } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Header />
          <main style={{ paddingTop: '80px' }}>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/coleccion" element={<Collection />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/novedades" element={<NovedadesSection />}/>
              <Route path="/acerca" element={<AboutSection />}/>
              <Route path="/admin/login" element={<LoginPage />} />

              {/* Rutas protegidas para el administrador */}
              <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/products" element={<PrivateRoute><ProductManagement /></PrivateRoute>} />
              <Route path="/admin/hero-images" element={<PrivateRoute><HeroImageManagement /></PrivateRoute>} /> {/* <-- NUEVA RUTA */}
              <Route path="/admin/novedades" element={<PrivateRoute><NovedadesManagement /></PrivateRoute>} /> {/* <-- NUEVA RUTA */}
            </Routes>
          </main>
          <Footer />
          <CartModal />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;