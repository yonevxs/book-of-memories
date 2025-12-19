import React from 'react';

const Page = React.forwardRef(({ data, pageNumber, onOpenGallery }, ref) => {
  
  // --- Lógica de Mídia (Mantida) ---
  let mediaList = data.media || [];
  if (mediaList.length === 0) {
    if (data.video_url) mediaList.push({ type: 'video', url: data.video_url });
    else if (data.image_url) mediaList.push({ type: 'image', url: data.image_url });
  }
  if (mediaList.length === 0) {
    mediaList.push({ type: 'image', url: "https://via.placeholder.com/400x300?text=Sem+Foto" });
  }

  const mainItem = mediaList[0];
  const hasMultiple = mediaList.length > 1;

  const handleClick = (e) => {
    e.stopPropagation();
    if (onOpenGallery) onOpenGallery(mediaList);
  };

  return (
    <div className="w-full h-full bg-dream-paper p-6 md:p-8 flex flex-col shadow-inner-page relative overflow-hidden" ref={ref}>
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-end border-b-2 border-purple-200 pb-2 mb-4 shrink-0">
          <h2 className="text-2xl font-hand-title text-dream-dark font-bold truncate max-w-[70%]">{data.title}</h2>
          <span className="font-hand text-purple-400 text-sm font-bold">{data.date}</span>
        </div>

        {/* Polaroid */}
        <div 
          className="relative w-full h-48 mb-6 flex items-center justify-center cursor-pointer group z-10 shrink-0"
          onClick={handleClick}
        >
            <div className="absolute top-0 z-30 w-4 h-4 rounded-full bg-red-400 shadow-md border border-red-600 pointer-events-none">
               <div className="absolute top-1 left-1 w-1 h-1 bg-white/50 rounded-full"></div>
            </div>
            {hasMultiple && mediaList.slice(1, 3).map((_, idx) => (
                <div key={idx} className="absolute w-[85%] h-40 bg-white p-2 shadow-sm border border-gray-200 pointer-events-none" style={{ transform: `rotate(${idx % 2 === 0 ? '-6deg' : '6deg'}) scale(0.95)`, zIndex: 0 }}><div className="w-full h-full bg-gray-100"></div></div>
            ))}
            <div className="relative w-[90%] h-44 bg-white p-2 shadow-lg border border-gray-100 transform group-hover:scale-105 transition-transform duration-300 rotate-1 z-20">
                {mainItem.type === 'video' ? (
                  <div className="w-full h-full bg-black flex items-center justify-center relative rounded-sm overflow-hidden pointer-events-none">
                     <video src={mainItem.url} className="w-full h-full object-cover opacity-80" muted />
                     <span className="absolute text-white text-4xl opacity-80">▶</span>
                  </div>
                ) : (
                  <img src={mainItem.url} className="w-full h-full object-cover rounded-sm filter sepia-[10%] pointer-events-none" />
                )}
                {hasMultiple && (
                   <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md font-bold pointer-events-none">+{mediaList.length - 1}</div>
                )}
            </div>
        </div>

        {/* --- ÁREA DE TEXTO (Descrição) --- */}
        {/* flex-grow vai ocupar todo o espaço novo que ganhamos aumentando a altura do livro */}
        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 pb-6 relative">
          <p className={`
            font-hand text-gray-700 font-semibold 
            
            /* MOBILE: Grande e Justificado */
            text-xl leading-relaxed text-justify
            
            /* DESKTOP: Menor e Alinhado à Esquerda (Resolve o problema dos espaços) */
            md:text-base 
            md:text-left
            md:leading-relaxed
          `}>
            {data.description || <span className="opacity-50 italic text-sm">Sem descrição...</span>}
          </p>
        </div>

        {/* --- RODAPÉ (Paginação) --- */}
        <div className="absolute bottom-3 left-0 w-full text-center pointer-events-none z-20">
           <span className="text-purple-300 font-hand text-lg flex items-center justify-center gap-2">
              <span className="font-sans text-xs opacity-50">✿</span> 
              {pageNumber} 
              <span className="font-sans text-xs opacity-50">✿</span>
           </span>
        </div>
    </div>
  );
});

export default Page;