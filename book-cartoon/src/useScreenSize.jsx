// src/useScreenSize.js
import { useState, useEffect } from 'react';

// Hook simples para saber se a tela é menor que o breakpoint 'md' do Tailwind (768px)
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    // Limpa o evento quando o componente desmonta
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}