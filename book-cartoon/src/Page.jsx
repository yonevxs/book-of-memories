import React from 'react';

const Page = React.forwardRef(({ data, pageNumber, onOpenGallery, onDelete, onEdit }, ref) => {
  
  // --- Lógica de Mídia (Mantida igual) ---
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
    <div className="w-full h-full bg-dream-paper p-6 md:p-8 flex flex-col shadow-inner-page relative overflow-hidden group" ref={ref}>
        
        {/* Cabeçalho Limpo (Sem botões aqui) */}
        <div className="flex justify-between items-end border-b-2 border-purple-200 pb-2 mb-4 shrink-0">
          <h2 className="text-2xl font-hand-title text-dream-dark font-bold truncate max-w-[70%]">{data.title}</h2>
          <span className="font-hand text-purple-400 text-sm font-bold">{data.date}</span>
        </div>

        {/* Polaroid */}
        <div 
          className="relative w-full h-48 mb-6 flex items-center justify-center cursor-pointer group/polaroid z-10 shrink-0"
          onClick={handleClick}
        >
            <div className="absolute top-0 z-30 w-4 h-4 rounded-full bg-red-400 shadow-md border border-red-600 pointer-events-none">
               <div className="absolute top-1 left-1 w-1 h-1 bg-white/50 rounded-full"></div>
            </div>
            {hasMultiple && mediaList.slice(1, 3).map((_, idx) => (
                <div key={idx} className="absolute w-[85%] h-40 bg-white p-2 shadow-sm border border-gray-200 pointer-events-none" style={{ transform: `rotate(${idx % 2 === 0 ? '-6deg' : '6deg'}) scale(0.95)`, zIndex: 0 }}><div className="w-full h-full bg-gray-100"></div></div>
            ))}
            <div className="relative w-[90%] h-44 bg-white p-2 shadow-lg border border-gray-100 transform group-hover/polaroid:scale-105 transition-transform duration-300 rotate-1 z-20">
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

        {/* Texto */}
        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 pb-6 relative">
          <p className={`
            font-hand text-gray-700 font-semibold 
            text-xl leading-relaxed text-justify
            md:text-base md:text-left md:leading-relaxed
          `}>
            {data.description || <span className="opacity-50 italic text-sm">Sem descrição...</span>}
          </p>
        </div>

        {/* --- RODAPÉ DA PÁGINA --- */}
        {/* Aqui ficam o número da página E os botões agora */}
        <div className="absolute bottom-3 left-0 w-full px-4 flex items-center justify-center pointer-events-none z-20">
           
           {/* Número da Página (Centralizado) */}
           <span className="text-purple-300 font-hand text-lg flex items-center justify-center gap-2">
              <span className="font-sans text-xs opacity-50">✿</span> 
              {pageNumber} 
              <span className="font-sans text-xs opacity-50">✿</span>
           </span>

        </div>

        {/* --- BOTÕES DE AÇÃO (MOVIDOS PARA BAIXO DIREITA) --- */}
        {/* Mudei 'top-4 right-4' para 'bottom-3 right-3' */}
        {/* Usei 'pointer-events-auto' para garantir que sejam clicáveis mesmo se o rodapé tiver pointer-events-none */}
        <div className="absolute bottom-3 right-3 z-50 flex gap-2 transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 pointer-events-auto">
           <button 
             onClick={(e) => { e.stopPropagation(); onEdit(); }}
             className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm border border-purple-100 hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors transform hover:scale-110"
             title="Editar"
           >
             {/* Ícone Lápis Pequeno */}
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
               <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
             </svg>
           </button>

           <button 
             onClick={(e) => { e.stopPropagation(); onDelete(); }}
             className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm border border-purple-100 hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors transform hover:scale-110"
             title="Deletar"
           >
             {/* Ícone Lixeira Pequeno */}
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
               <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
               <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
             </svg>
           </button>
        </div>
    </div>
  );
});

export default Page;