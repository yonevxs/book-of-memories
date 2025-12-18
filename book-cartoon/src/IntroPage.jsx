import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const IntroPage = React.forwardRef(({ session }, ref) => {
  const [nickname, setNickname] = useState('');

  // Carrega o nome salvo ao abrir a página
  useEffect(() => {
    if (session?.user?.user_metadata?.nickname) {
      setNickname(session.user.user_metadata.nickname);
    }
  }, [session]);

  const handleSave = async () => {
    if (!nickname.trim()) return;
    await supabase.auth.updateUser({
      data: { nickname: nickname }
    });
  };

  // --- A MÁGICA PARA NÃO BUGAR O LIVRO ---
  // Bloqueia todos os tipos de interação para que não cheguem no "Livro"
  const stopEvent = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="w-full h-full bg-dream-paper p-6 flex flex-col items-center justify-center border-r border-gray-200 shadow-inner-page" ref={ref}>
      <div className="w-full h-full border-2 border-double border-purple-200 flex flex-col items-center justify-center p-4 text-center">
        
        <h3 className="font-hand text-2xl text-dream-dark mb-6 font-bold">
          Este diário<br/>pertence a:
        </h3>

        <div className="relative w-full max-w-[180px] mb-8 group">
          <input 
            type="text" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              e.stopPropagation(); // Impede que teclas de atalho virem a página
              if (e.key === 'Enter') handleSave();
            }}
            
            /* --- CORREÇÃO DO MOUSE GRUDANDO --- */
            onPointerDown={stopEvent} // Crucial para navegadores modernos
            onMouseDown={stopEvent}
            onMouseUp={stopEvent}
            onClick={stopEvent}
            onTouchStart={stopEvent}
            /* ---------------------------------- */

            placeholder="Seu nome..."
            className="w-full bg-transparent text-center font-title text-xl text-purple-600 border-b-2 border-purple-300 focus:border-purple-500 outline-none placeholder-purple-200 pb-1 cursor-text z-20 relative"
            autoComplete="off"
          />
          
          {/* LÓGICA VISUAL: Só mostra a dica se o nickname estiver vazio */}
          {!nickname && (
            <p className="text-[10px] text-gray-400 mt-1 font-sans opacity-60 animate-pulse absolute w-full left-0 pointer-events-none">
              (Digite e aperte Enter)
            </p>
          )}
        </div>
        
        <div className="w-10 h-1 bg-purple-200 rounded-full mb-6"></div>
        
        <p className="text-center font-hand text-purple-400 text-lg leading-relaxed italic px-2">
          "Que estas memórias<br/>sejam eternas..."
        </p>

      </div>
    </div>
  );
});

export default IntroPage;