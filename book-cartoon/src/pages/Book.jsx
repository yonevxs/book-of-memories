import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../useScreenSize'; 

import Page from '../Page';
import CoverPage from '../CoverPage';
import IntroPage from '../IntroPage'; 
import Navbar from '../Navbar';
import Footer from '../Footer';
import AddMemoryModal from '../AddMemoryModal';
import Notification from '../Notification';

// 1. IMPORTANTE: A Galeria é importada aqui no PAI agora
import MediaGallery from '../MediaGallery'; 

export default function Book({ session }) {
  const navigate = useNavigate();
  const bookRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookMemories, setBookMemories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notify, setNotify] = useState({ message: '', type: '' });
  
  // 2. NOVO ESTADO: Controla qual memória está aberta na galeria
  // null = fechado, array = aberto com fotos
  const [galleryData, setGalleryData] = useState(null);

  const isMobile = useIsMobile();

  // Mantendo a altura grande que você pediu
  const bookWidth = isMobile ? 290 : 300;
  const bookHeight = isMobile ? 600 : 420;

  useEffect(() => {
    fetchMemories();
  }, [session]);

  const fetchMemories = async () => {
    const { data } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', session.user.id)
      .order('id', { ascending: true });
    
    if (data) setBookMemories(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleAddMemory = async (newMemory) => {
    const mediaList = [];

    try {
      if (newMemory.mediaFiles && newMemory.mediaFiles.length > 0) {
        
        await Promise.all(newMemory.mediaFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random()}.${fileExt}`; 
          const filePath = `${session.user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('memory-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('memory-images')
            .getPublicUrl(filePath);

          mediaList.push({
            url: urlData.publicUrl,
            type: file.type.startsWith('video/') ? 'video' : 'image'
          });
        }));
      }

      const memoryToSave = {
        title: newMemory.title,
        description: newMemory.description,
        date: newMemory.date,
        user_id: session.user.id,
        // Compatibilidade com campos antigos
        image_url: mediaList.length > 0 && mediaList[0].type === 'image' ? mediaList[0].url : null,
        video_url: mediaList.length > 0 && mediaList[0].type === 'video' ? mediaList[0].url : null,
        // Lista completa
        media: mediaList 
      };

      const { data, error: dbError } = await supabase
        .from('memories')
        .insert([memoryToSave])
        .select();

      if (dbError) throw dbError;

      setBookMemories([...bookMemories, data[0]]);
      setNotify({ message: 'Memórias eternizadas com sucesso!', type: 'success' });

    } catch (error) {
      console.error(error);
      setNotify({ message: 'Erro ao salvar: ' + error.message, type: 'error' });
    }
  };

  const containerTransformStyle = (pageIndex === 0 && !isMobile) 
    ? { transform: 'translateX(-150px)' } 
    : { transform: 'translateX(0px)' };

  return (
    // LAYOUT FIX: 'fixed inset-0 h-[100dvh]' garante a altura correta no mobile e permite scroll interno
    <div className={`fixed inset-0 h-[100dvh] w-full flex flex-col relative transition-colors duration-500 overflow-x-hidden ${
      isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-dream-bg via-white to-pink-100"
    }`}>

      {/* 3. COMPONENTE DA GALERIA (Topo da hierarquia visual) */}
      <MediaGallery 
        isOpen={!!galleryData} 
        onClose={() => setGalleryData(null)} 
        mediaItems={galleryData || []} 
      />

      <Notification message={notify.message} type={notify.type} onClose={() => setNotify({ message: '', type: '' })} />

      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
        onOpenModal={() => setIsModalOpen(true)}
        onLogout={handleLogout} 
      />
      
      <AddMemoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddMemory}
        isDarkMode={isDarkMode}
      />

      {/* Scroll acontece aqui dentro (overflow-y-auto) */}
      <main className="flex-grow flex flex-col items-center justify-start w-full py-8 md:justify-center md:py-0 overflow-y-auto">
        
        <h1 className={`mb-8 md:mb-10 font-title text-2xl md:text-4xl font-bold uppercase tracking-wide drop-shadow-sm transition-colors duration-500 text-center px-4 ${
            isDarkMode ? "text-purple-300" : "text-purple-800"
        }`}>
          {isMobile ? "Meus melhores momentos" : "Book of Memories"}
        </h1>

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-2 pb-24">
          
          {/* Tutorial Mobile */}
          {bookMemories.length === 0 && isMobile && (
             <div className="mb-4 animate-bounce-slow relative z-30">
                  <div className="px-4 py-2 bg-white/90 rounded-full shadow-lg border border-purple-100 text-center">
                      <p className="text-xs text-purple-600 font-bold">👆 Toque em "+" para criar sua primeira página!</p>
                  </div>
             </div>
          )}
          
          {/* Tutorial Desktop */}
          {bookMemories.length === 0 && !isMobile && (
               <div className="absolute z-30" style={{ left: '50%', marginLeft: '-480px', top: '50px' }}> 
                  <div className="w-64 p-6 bg-white/90 rounded-xl shadow-xl backdrop-blur-sm border-2 border-purple-100 text-center animate-bounce-slow relative">
                      <span className="text-4xl mb-2 block">✨</span>
                      <p className="font-hand font-bold text-dream-dark text-lg">Seu livro está vazio...</p>
                      <p className="text-sm text-purple-500 mt-2">Clique em <span className="font-bold">"+ Nova Memória"</span> lá em cima!</p>
                      <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white border-t-2 border-r-2 border-purple-100 transform rotate-45 mt-[-12px]"></div>
                  </div>
               </div>
          )}

          <div 
             className="transition-transform duration-700 ease-in-out flex justify-center"
             style={containerTransformStyle}
          >
            <HTMLFlipBook
              key={bookMemories.length + (isMobile ? '-mobile' : '-desktop')} 
              ref={bookRef}
              width={bookWidth}
              height={bookHeight}
              size="fixed"
              maxShadowOpacity={0.5}
              showCover={true}
              usePortrait={isMobile} 
              className="shadow-soft"
              onFlip={(e) => setPageIndex(e.data)}
            >
              <CoverPage className="bg-dream-purple border-[2px] md:border-[4px] border-white rounded-r-lg shadow-inner">
                <div className="border-2 border-white/50 p-2 md:p-4 w-full h-full flex flex-col items-center justify-center rounded-lg dashed-border">
                  <h2 className="text-white font-title text-4xl md:text-4xl text-center mb-2 font-bold drop-shadow-md leading-tight">Registros<br/>da Alma</h2>
                  <span className="text-white/90 font-hand text-lg md:text-xl text-center">Um passeio pelas memórias</span>
                </div>
              </CoverPage>

              <IntroPage session={session} />

              {bookMemories.map((mem, index) => (
                <Page 
                  key={mem.id} 
                  data={mem} 
                  pageNumber={index + 1}
                  // 4. AQUI ESTÁ O SEGREDINHO: Passamos a função pro filho
                  onOpenGallery={(mediaList) => setGalleryData(mediaList)}
                />
              ))}

              <CoverPage className="bg-dream-purple border-[2px] md:border-[4px] border-white rounded-l-lg shadow-inner flex items-center justify-center">
                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-white/30 rounded-lg dashed-border p-4 md:p-6">
                   <span className="text-4xl md:text-5xl mb-2 md:mb-4 opacity-90 animate-pulse">✨</span>
                   <h2 className="text-white font-title text-4xl md:text-5xl font-bold uppercase drop-shadow-lg tracking-widest mb-2">
                     FIM
                   </h2>
                   <div className="w-10 md:w-16 h-1 bg-white/50 rounded-full mb-2 md:mb-4"></div>
                   <p className="text-white/90 font-hand text-md md:text-lg text-center max-w-[150px] md:max-w-[200px]">
                     Até a próxima aventura...
                   </p>
                </div>
              </CoverPage>
            </HTMLFlipBook>
          </div>
        </div>
      </main>

      <div className="w-full shrink-0 py-4">
         <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}