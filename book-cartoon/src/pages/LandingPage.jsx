import React from 'react';
import { useNavigate } from 'react-router-dom';
import heartBookImg from '../assets/heartbook3d.png';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center relative overflow-hidden px-6 md:px-16">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-10 left-10 w-48 h-48 md:w-72 md:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
         <div className="absolute bottom-10 right-10 w-64 h-64 md:w-96 md:h-96 bg-soft-pink rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      </div>
      
      {/* Grid de 2 Colunas */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center z-10">
        
        {/* Coluna da Esquerda: Textos (Agora sempre Centralizados) */}
        {/* Removi o 'md:items-start' e 'md:text-left' para manter tudo no centro */}
        <div className="flex flex-col items-center justify-center text-center animate-fade-in-up order-2 md:order-1">
          
          {/* Livro Pulando */}
          <span className="text-6xl mb-2 animate-bounce">📖</span>

          <h1 className="font-title text-5xl md:text-7xl text-purple-800 font-bold tracking-tight mb-6">
            Book of Memories
          </h1>

          <p className="font-title text-lg md:text-2xl text-purple-500 font-bold leading-relaxed max-w-lg mb-8">
            "Guarde seus momentos mais preciosos em um diário mágico que dura para sempre"
          </p>

          <button 
            onClick={() => navigate('/login')}
            className="bg-[#C084FC] hover:bg-purple-500 text-white font-bold py-4 px-12 rounded-full shadow-lg transform hover:scale-105 transition-all text-xl font-title tracking-wide"
          >
            Começar Agora
          </button>
        </div>

        {/* Coluna da Direita: Imagem */}
        <div className="flex justify-center items-center order-1 md:order-2 mb-10 md:mb-0">
           {/* Efeito de brilho atrás */}
           <div className="absolute w-80 h-80 bg-pink-100 rounded-full filter blur-3xl opacity-60 -z-10"></div>
           
           <img 
             src={heartBookImg} 
             alt="Heart Book Character" 
             className="w-full max-w-lg md:max-w-2xl object-contain animate-float drop-shadow-xl" 
           />
        </div>

      </div>

      <footer className="absolute bottom-4 text-purple-400 font-title text-xs md:text-sm font-bold opacity-70">
        Feito com magia e código por Lucas Neves
      </footer>
    </div>
  );
}