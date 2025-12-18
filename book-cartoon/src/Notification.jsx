import React, { useEffect } from 'react';

export default function Notification({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;

    // Some automaticamente após 4 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-500 border-red-700' : 'bg-green-500 border-green-700';

  return (
    <div className={`
      fixed top-4 left-1/2 transform -translate-x-1/2 z-[60]
      w-[90%] md:w-auto max-w-sm md:max-w-md
      px-4 py-3 rounded-xl shadow-2xl border-2
      flex items-center justify-between gap-3 
      animate-fade-in-down transition-all duration-300
      ${bgColor} text-white
    `}>
      
      <div className="flex items-center gap-3">
        <span className="text-xl">{type === 'error' ? '⚠️' : '✅'}</span>
        <span className="font-bold font-title tracking-wide text-sm md:text-base leading-tight">
          {message}
        </span>
      </div>

      <button 
        onClick={onClose} 
        className="opacity-70 hover:opacity-100 font-bold text-lg p-1"
      >
        ✕
      </button>

    </div>
  );
}