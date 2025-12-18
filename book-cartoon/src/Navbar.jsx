import React from 'react';

// Ícones (sem alterações)
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-300"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
);

export default function Navbar({ isDarkMode, toggleTheme, onOpenModal, onLogout, simpleMode = false }) {
  return (
    <nav className={`w-full px-4 py-3 flex justify-between items-center z-20 backdrop-blur-sm border-b border-white/10 transition-colors duration-500 ${isDarkMode ? 'bg-gray-900/80 text-white' : 'bg-white/40 text-dream-dark'}`}>
      
      {/* LADO ESQUERDO: Título visível no Mobile agora */}
      <a href = "/" className="flex items-center gap-2 md:gap-3">
        <span className="text-xl md:text-lg filter drop-shadow-sm">📖</span>
        {/* REMOVIDO 'hidden sm:block'. Agora é 'block' sempre */}
        <span className="font-title text-base md:text-xl tracking-wider font-bold block whitespace-nowrap">
          Book of Memories
        </span>
      </a>

      {/* LADO DIREITO */}
      <div className="flex items-center gap-2 md:gap-3">
        {!simpleMode && (
          <button 
            onClick={onOpenModal}
            // No mobile, mostramos só o "+" para economizar espaço
            className="flex items-center gap-2 bg-dream-purple hover:bg-purple-600 text-white w-8 h-8 md:w-auto md:h-auto md:px-4 md:py-2 justify-center rounded-full font-bold shadow-md transition-all text-sm transform hover:scale-105 active:scale-95"
          >
            <span>+</span> <span className="hidden md:inline">Nova Memória</span>
          </button>
        )}

        {toggleTheme && (
            <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all focus:outline-none ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/50'}`}
            >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
        )}

        {!simpleMode && onLogout && (
          <button 
            onClick={onLogout}
            className={`ml-1 px-3 py-1 text-xs font-bold border rounded-lg transition-colors ${
              isDarkMode 
                ? 'border-red-900 text-red-400 hover:bg-red-900/20' 
                : 'border-red-200 text-red-400 hover:bg-red-50'
            }`}
          >
            Sair
          </button>
        )}
      </div>
    </nav>
  );
}