import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Importando as páginas
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Book from './pages/Book';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Verifica se já existe sessão ativa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Escuta mudanças (login/logout) em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-dream-bg text-purple-500 font-bold">Carregando magia...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública: Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Rota de Login: Se já logado, joga pro livro */}
        <Route path="/login" element={!session ? <AuthPage /> : <Navigate to="/book" />} />
        
        {/* Rota Protegida: O Livro. Só acessa se tiver sessão */}
        <Route 
          path="/book" 
          element={session ? <Book session={session} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}