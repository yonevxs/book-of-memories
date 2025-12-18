import React from 'react';

const Page = React.forwardRef(({ data, pageNumber }, ref) => {
  
  // Verifica se tem vídeo
  const isVideo = !!data.video_url;
  
  // Se for imagem, define qual usar
  const imageSource = data.image_url || data.image || "https://via.placeholder.com/400x300?text=Sem+Foto";

  return (
    <div className="w-full h-full bg-dream-paper p-8 flex flex-col shadow-inner-page relative overflow-hidden" ref={ref}>
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-end border-b-2 border-purple-200 pb-2 mb-4">
        <h2 className="text-2xl font-hand-title text-dream-dark font-bold truncate max-w-[70%]">{data.title}</h2>
        <span className="font-hand text-purple-400 text-sm font-bold">{data.date}</span>
      </div>

      {/* Área da Mídia (Polaroid) */}
      <div className="relative w-full mb-6 group hover:rotate-0 transition-transform duration-500 rotate-1">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-soft-pink opacity-80 rotate-2 shadow-sm z-10"></div>
        
        <div className="bg-white p-2 shadow-md rounded-sm">
          
          {isVideo ? (
            /* PLAYER DE VÍDEO ESTILIZADO */
            <video 
              src={data.video_url} 
              controls 
              className="w-full h-40 object-cover rounded-sm border border-gray-100"
            />
          ) : (
            /* IMAGEM PADRÃO */
            <img 
              src={imageSource} 
              alt={data.title} 
              className="w-full h-40 object-cover rounded-sm filter sepia-[10%]" 
            />
          )}

        </div>
      </div>

      {/* Texto */}
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 pb-14">
        <p className="font-hand text-xl text-gray-700 leading-relaxed font-semibold text-justify">
          {data.description}
        </p>
      </div>

      {/* Rodapé */}
      <div className="absolute bottom-4 left-0 w-full text-center">
         <span className="text-purple-300 font-hand text-lg flex items-center justify-center gap-2">
            <span className="font-sans text-xs opacity-70">✿</span> 
            {pageNumber} 
            <span className="font-sans text-xs opacity-70">✿</span>
         </span>
      </div>
    </div>
  );
});

export default Page;