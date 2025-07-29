// src/assets/styles/theme.js

const theme = {
  colors: {
    primary: '#ff69b4', // Tu primary-pink
    secondary: '#ffb6c1', // Tu light-pink
    black: '#000000',
    white: '#ffffff',
    gray: '#f5f5f5', // Tu gray, que usaremos para el background secundario
    text: '#333333', // Un gris oscuro para texto general si no es negro puro
    // Puedes añadir más colores si los identificas como necesarios de tu logo o diseño
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Poppins', sans-serif",
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px',
    xxlarge: '48px',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
  },
};

export default theme;