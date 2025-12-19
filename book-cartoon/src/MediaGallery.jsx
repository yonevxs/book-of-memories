import React, { useState } from 'react';

export default function MediaGallery({ isOpen, onClose, mediaItems }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !mediaItems || mediaItems.length === 0) return null;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const currentItem = mediaItems[currentIndex];

  return (
    // Z-INDEX 80 para ficar acima do livro
    <div className="fixed inset-0 z-[80] bg-black/95 flex flex-col items-center justify-center animate-fade-in" onClick={onClose}>
      
      <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white text-4xl font-bold z-50 p-4">✕</button>

      <div className="absolute top-5 left-5 text-white font-title bg-white/10 px-3 py-1 rounded-full pointer-events-none">
        {currentIndex + 1} / {mediaItems.length}
      </div>

      <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        {currentItem.type === 'video' ? (
          <video src={currentItem.url} controls autoPlay className="max-h-[80vh] max-w-full rounded-lg shadow-2xl" />
        ) : (
          <img src={currentItem.url} alt="Gallery" className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl" />
        )}
      </div>

      {mediaItems.length > 1 && (
        <>
          <button onClick={handlePrev} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 p-4 rounded-full text-2xl transition-all">❮</button>
          <button onClick={handleNext} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 p-4 rounded-full text-2xl transition-all">❯</button>
        </>
      )}

      {/* Miniaturas clicáveis */}
      <div className="absolute bottom-6 flex gap-2 overflow-x-auto px-4 w-full justify-center" onClick={(e) => e.stopPropagation()}>
        {mediaItems.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => setCurrentIndex(idx)}
            className={`w-12 h-12 md:w-16 md:h-16 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-dream-purple scale-110' : 'border-transparent opacity-50'}`}
          >
            {item.type === 'video' ? (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-xs">▶</div>
            ) : (
              <img src={item.url} className="w-full h-full object-cover" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}