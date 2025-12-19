import React from 'react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, isDarkMode }) {
  if (!isOpen) return null;

  const bgClass = isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-dream-dark border-purple-100";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className={`${bgClass} w-full max-w-sm p-6 rounded-2xl shadow-2xl border-2 relative flex flex-col items-center text-center transform transition-all scale-100`}>
        
        {/* Ícone de Alerta Animado */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-2xl font-title font-bold mb-2">Rasgar esta página?</h3>
        
        <p className="text-sm opacity-70 mb-6 font-hand font-semibold text-lg leading-snug">
          Essa ação vai apagar essa memória para sempre. <br/>
          Você tem certeza disso?
        </p>

        <div className="flex gap-3 w-full">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 font-bold opacity-70 hover:opacity-100 hover:bg-gray-100 transition-colors text-gray-600"
          >
            Cancelar
          </button>
          
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95"
          >
            Sim, Rasgar
          </button>
        </div>
      </div>
    </div>
  );
}