// src/App.js

import React from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home'; // Importa el componente Home

function App() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '80px' }}> {/* Asegura que el contenido no quede debajo del Header fijo */}
        <Home /> {/* Renderiza la página de inicio */}
      </main>
      <Footer />
    </>
  );
}

export default App;