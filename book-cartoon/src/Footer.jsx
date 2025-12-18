import React from 'react';

export default function Footer({ isDarkMode }) {
  return (
    <footer className={`w-full py-3 text-center text-sm font-hand font-bold tracking-wide z-20 transition-colors duration-500 ${isDarkMode ? 'text-white bg-dream-dark' : 'text-white bg-purple-400'}`}>
      ~ Arraste as pontinhas da página para ler ~
    </footer>
  );
}