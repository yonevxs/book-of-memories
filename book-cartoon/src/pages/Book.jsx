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
import MediaGallery from '../MediaGallery'; 
// CORREÇÃO 1: Modal com "a"
import DeleteConfirmModal from '../DeleteConfirmModal';

export default function Book({ session }) {
  const navigate = useNavigate();
  const bookRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookMemories, setBookMemories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notify, setNotify] = useState({ message: '', type: '' });
  
  const [galleryData, setGalleryData] = useState(null);
  const [memoryToEdit, setMemoryToEdit] = useState(null);
  const [memoryToDelete, setMemoryToDelete] = useState(null);

  const isMobile = useIsMobile();

  const bookWidth = isMobile ? 290 : 300;
  const bookHeight = isMobile ? 600 : 470;

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

  // --- FUNÇÃO DELETAR ---
  // (Nota: Removemos o window.confirm daqui porque o Modal visual vai fazer esse papel)
  // Essa função apenas executa a deleção QUANDO o modal confirma
  const confirmDelete = async () => {
    if (!memoryToDelete) return;

    try {
      const { error } = await supabase.from('memories').delete().eq('id', memoryToDelete);
      if (error) throw error;

      setBookMemories(prev => prev.filter(mem => mem.id !== memoryToDelete));
      setNotify({ message: 'Página removida com sucesso.', type: 'success' });
    } catch (error) {
      setNotify({ message: 'Erro ao deletar: ' + error.message, type: 'error' });
    } finally {
      setMemoryToDelete(null); // Fecha o modal
    }
  };

  // Função chamada pelo botão da lixeira na página (apenas abre o modal)
  const requestDelete = (id) => {
    setMemoryToDelete(id); 
  };

  const openEditModal = (memory) => {
    setMemoryToEdit(memory);
    setIsModalOpen(true);
  };

  const uploadFiles = async (files) => {
    const uploadedMedia = [];
    if (files && files.length > 0) {
        await Promise.all(files.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random()}.${fileExt}`; 
          const filePath = `${session.user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('memory-images')
            .upload(filePath, file);

          if (!uploadError) {
             const { data: urlData } = supabase.storage
               .from('memory-images')
               .getPublicUrl(filePath);

             uploadedMedia.push({
               url: urlData.publicUrl,
               type: file.type.startsWith('video/') ? 'video' : 'image'
             });
          }
        }));
    }
    return uploadedMedia;
  };

  const handleAddMemory = async (newMemory) => {
    try {
      const mediaList = await uploadFiles(newMemory.mediaFiles);

      const memoryToSave = {
        title: newMemory.title,
        description: newMemory.description,
        date: newMemory.date,
        user_id: session.user.id,
        image_url: mediaList.length > 0 && mediaList[0].type === 'image' ? mediaList[0].url : null,
        video_url: mediaList.length > 0 && mediaList[0].type === 'video' ? mediaList[0].url : null,
        media: mediaList 
      };

      const { data, error: dbError } = await supabase.from('memories').insert([memoryToSave]).select();
      if (dbError) throw dbError;

      if (data && data.length > 0) {
          setBookMemories([...bookMemories, data[0]]);
          setNotify({ message: 'Memória criada com sucesso!', type: 'success' });
      } else {
          fetchMemories();
      }

    } catch (error) {
      console.error(error);
      setNotify({ message: 'Erro ao salvar: ' + error.message, type: 'error' });
    }
  };

  const handleEditMemory = async (id, updatedData) => {
    try {
        const newMedia = await uploadFiles(updatedData.mediaFiles);
        const oldMemory = bookMemories.find(m => m.id === id);
        if (!oldMemory) return;

        const oldMedia = oldMemory.media || [];
        if (oldMedia.length === 0 && (oldMemory.image_url || oldMemory.video_url)) {
            if(oldMemory.video_url) oldMedia.push({type: 'video', url: oldMemory.video_url});
            else if(oldMemory.image_url) oldMedia.push({type: 'image', url: oldMemory.image_url});
        }

        const finalMedia = [...oldMedia, ...newMedia];

        const { data, error } = await supabase
          .from('memories')
          .update({
            title: updatedData.title,
            description: updatedData.description,
            date: updatedData.date,
            media: finalMedia,
            image_url: finalMedia.length > 0 && finalMedia[0].type === 'image' ? finalMedia[0].url : null,
            video_url: finalMedia.length > 0 && finalMedia[0].type === 'video' ? finalMedia[0].url : null,
          })
          .eq('id', id)
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
            setBookMemories(prev => prev.map(m => m.id === id ? data[0] : m));
            setNotify({ message: 'Página atualizada!', type: 'success' });
            setMemoryToEdit(null); 
        } else {
            console.warn("Update feito, mas sem retorno de dados. Recarregando...");
            await fetchMemories(); 
            setMemoryToEdit(null);
            setNotify({ message: 'Página atualizada!', type: 'success' });
        }

    } catch (error) {
        console.error(error);
        setNotify({ message: 'Erro ao editar: ' + error.message, type: 'error' });
    }
  };

  const containerTransformStyle = (pageIndex === 0 && !isMobile) 
    ? { transform: 'translateX(-150px)' } 
    : { transform: 'translateX(0px)' };

  return (
    <div className={`fixed inset-0 h-[100dvh] w-full flex flex-col relative transition-colors duration-500 overflow-x-hidden ${
      isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-dream-bg via-white to-pink-100"
    }`}>

      <MediaGallery 
        isOpen={!!galleryData} 
        onClose={() => setGalleryData(null)} 
        mediaItems={galleryData || []} 
      />

      {/* CORREÇÃO 2: Modal com "a" */}
      <DeleteConfirmModal 
        isOpen={!!memoryToDelete} 
        onClose={() => setMemoryToDelete(null)} 
        onConfirm={confirmDelete} 
        isDarkMode={isDarkMode}
      />

      <Notification message={notify.message} type={notify.type} onClose={() => setNotify({ message: '', type: '' })} />

      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
        onOpenModal={() => { setMemoryToEdit(null); setIsModalOpen(true); }}
        onLogout={handleLogout} 
      />
      
      <AddMemoryModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setMemoryToEdit(null); }} 
        onAdd={handleAddMemory}
        onEdit={handleEditMemory}
        memoryToEdit={memoryToEdit}
        isDarkMode={isDarkMode}
      />

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

              {bookMemories.map((mem, index) => {
                 if (!mem) return null;
                 return (
                    <Page 
                      key={mem.id || index} 
                      data={mem} 
                      pageNumber={index + 1}
                      onOpenGallery={(mediaList) => setGalleryData(mediaList)}
                      onDelete={() => requestDelete(mem.id)}
                      onEdit={() => openEditModal(mem)}
                    />
                 );
              })}

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