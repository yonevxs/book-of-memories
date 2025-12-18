import React from 'react';

export default function Footer({ isDarkMode }) {
  return (
    <footer className={`w-full text-center p-4 text-xs font-bold font-title opacity-70 ${isDarkMode ? 'text-white' : 'text-dream-dark'}`}>
      ~ Arraste as pontinhas da página para ler ~
    </footer>
  );
}

