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

export default function Book({ session }) {
  const navigate = useNavigate();
  const bookRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookMemories, setBookMemories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notify, setNotify] = useState({ message: '', type: '' });
  
  const isMobile = useIsMobile();

  // --- AJUSTE DE ALTURA (AUMENTADO) ---
  // Mobile: 290 largura x 600 altura (Bem alto, estilo tela cheia)
  const bookWidth = isMobile ? 290 : 300;
  const bookHeight = isMobile ? 600 : 420;

  useEffect(() => {
    fetchMemories();
  }, [session]);

  const fetchMemories = async () => {
    const { data, error } = await supabase
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
    let finalUrl = null;
    try {
      if (newMemory.mediaFile) {
        const fileExt = newMemory.mediaFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`; 
        const filePath = `${session.user.id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('memory-images').upload(filePath, newMemory.mediaFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('memory-images').getPublicUrl(filePath);
        finalUrl = urlData.publicUrl;
      }
      const memoryToSave = {
        title: newMemory.title,
        description: newMemory.description,
        date: newMemory.date,
        user_id: session.user.id,
        image_url: newMemory.mediaType === 'video' ? null : (finalUrl || "https://via.placeholder.com/400x300?text=Sem+Foto"),
        video_url: newMemory.mediaType === 'video' ? finalUrl : null
      };
      const { data, error: dbError } = await supabase.from('memories').insert([memoryToSave]).select();
      if (dbError) throw dbError;
      setBookMemories([...bookMemories, data[0]]);
      setNotify({ message: 'Memória eternizada com sucesso!', type: 'success' });
    } catch (error) {
      console.error(error);
      setNotify({ message: 'Erro ao salvar: ' + error.message, type: 'error' });
    }
  };

  const containerTransformStyle = (pageIndex === 0 && !isMobile) 
    ? { transform: 'translateX(-150px)' } 
    : { transform: 'translateX(0px)' };

  return (
    // MUDANÇAS CRÍTICAS AQUI:
    // 1. h-[100dvh]: Garante que ocupa 100% da tela visível do celular (desconta a barra de navegação).
    // 2. overflow-y-auto: Habilita a rolagem DENTRO desse container, ignorando bloqueios do body.
    // 3. fixed inset-0: Fixa o container na tela para evitar que o navegador tente rolar o fundo errado.
    <div className={`fixed inset-0 h-[100dvh] w-full flex flex-col justify-between transition-colors duration-500 overflow-y-auto overflow-x-hidden ${
      isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-dream-bg via-white to-pink-100"
    }`}>

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

      {/* Adicionei 'pb-24' para garantir que o footer suba bastante e não fique escondido */}
      <main className="flex-grow flex flex-col items-center justify-start md:justify-center relative w-full pt-4 md:pt-0 pb-24">
        
        <h1 className={`mb-12 md:mb-10 font-title text-2xl md:text-4xl font-bold uppercase tracking-wide drop-shadow-sm transition-colors duration-500 text-center px-4 ${
            isDarkMode ? "text-purple-300" : "text-purple-800"
        }`}>
          {isMobile ? "Meus melhores momentos" : "Book of Memories"}
        </h1>

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-2">
          
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
                <Page key={mem.id} data={mem} pageNumber={index + 1} />
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

      {/* Footer Fixo: Se preferir, tire o 'pb-24' do main e deixe o footer fluir, 
          mas assim garantimos que ele aparece no final da rolagem */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}