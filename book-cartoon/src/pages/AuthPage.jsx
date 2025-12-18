import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

// Importando componentes de layout
import Navbar from '../Navbar';
import Footer from '../Footer';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  
  // Novos campos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState(''); // Estado para o nome
  
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [notification, setNotification] = useState(null); 

  const navigate = useNavigate();

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000); 
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pass) => {
    if (pass.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
    if (!/\d/.test(pass)) return "A senha deve conter pelo menos um número.";
    if (!/[a-zA-Z]/.test(pass)) return "A senha deve conter pelo menos uma letra.";
    return null;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    
    // Validações Básicas
    if (!email || !password) {
      showNotification("Por favor, preencha email e senha.");
      return;
    }

    if (isSignUpMode && !nickname) {
       showNotification("Por favor, diga-nos como quer ser chamado.");
       return;
    }

    if (!isValidEmail(email)) {
      showNotification("O e-mail inserido é inválido.");
      return;
    }

    if (isSignUpMode) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        showNotification(passwordError, 'error');
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUpMode) {
        // --- MODO CADASTRO ---
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              nickname: nickname, // AQUI SALVAMOS O NOME NOS METADADOS!
            }
          }
        });

        if (error) {
          if (error.message.includes("already registered") || error.status === 422) {
            showNotification("Esta conta já existe! Tente fazer login.", "error");
          } else {
            showNotification("Erro ao cadastrar: " + error.message, "error");
          }
        } else {
          showNotification("Conta criada com sucesso! Entrando...", "success");
          setTimeout(() => {
             // Redireciona para o login ou loga direto
             setIsSignUpMode(false); 
          }, 1500);
        }

      } else {
        // --- MODO LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          showNotification("Email ou senha incorretos.", "error");
        } else {
          showNotification("Login realizado! Redirecionando...", "success");
          setTimeout(() => navigate('/book'), 1000);
        }
      }
    } catch (err) {
      showNotification("Ocorreu um erro inesperado.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Layout agora é Flex Column para acomodar Navbar e Footer
  return (
    <div className="min-h-screen w-full bg-dream-bg flex flex-col justify-between relative overflow-hidden">
      
      {/* NAVBAR SIMPLES (Sem botões de ação) */}
      <Navbar simpleMode={true} isDarkMode={false} />

      {/* Notificação */}
      {notification && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-down transition-all duration-300 ${
          notification.type === 'error' 
            ? 'bg-red-500 text-white border-2 border-red-700' 
            : 'bg-green-500 text-white border-2 border-green-700'
        }`}>
          <span className="text-xl">{notification.type === 'error' ? '⚠️' : '✅'}</span>
          <span className="font-bold font-title tracking-wide">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 opacity-70 hover:opacity-100 font-bold text-lg">✕</button>
        </div>
      )}

      {/* CONTEÚDO CENTRAL (Formulário) */}
      <div className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-2 border-purple-100 transition-all duration-300">
          
          <div className="text-center mb-8">
            <span className="text-4xl block mb-2 animate-bounce">
              {isSignUpMode ? '✨' : '💖'}
            </span>
            <h2 className="text-3xl font-title text-dream-dark">
              {isSignUpMode ? 'Criar Nova Conta' : 'Portal de Acesso'}
            </h2>
            <p className="text-purple-400 font-title font-bold mt-2">
              {isSignUpMode ? 'Comece sua jornada mágica' : 'Bem-vindo de volta!'}
            </p>
          </div>
          
          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            
            {/* CAMPO DE NOME (Só aparece no cadastro) */}
            {isSignUpMode && (
              <div className="animate-fade-in">
                <label className="block text-sm font-bold text-gray-500 mb-1 ml-1">Como quer ser chamado?</label>
                <input
                  className="w-full p-3 border-2 border-purple-100 rounded-lg outline-none focus:border-purple-400 bg-purple-50 transition-colors"
                  type="text"
                  placeholder="Seu Nome ou Apelido"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={20}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1 ml-1">Email</label>
              <input
                className="w-full p-3 border-2 border-purple-100 rounded-lg outline-none focus:border-purple-400 bg-purple-50 transition-colors"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1 ml-1">Senha</label>
              <input
                className="w-full p-3 border-2 border-purple-100 rounded-lg outline-none focus:border-purple-400 bg-purple-50 transition-colors"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {isSignUpMode && (
                <p className="text-xs text-gray-400 mt-1 ml-1">
                  Mínimo de 6 caracteres, 1 letra e 1 número.
                </p>
              )}
            </div>
            
            <button 
              type="submit"
              disabled={loading} 
              className={`w-full text-white py-3 rounded-lg font-bold transition-all transform active:scale-95 mt-2 shadow-md flex justify-center items-center gap-2
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-dream-purple hover:bg-purple-600'}
              `}
            >
              {loading && <span className="animate-spin text-xl">⟳</span>}
              {loading ? 'Processando...' : (isSignUpMode ? 'Cadastrar' : 'Entrar')}
            </button>
          </form>

          {/* Alternador de Modo */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-2">
              {isSignUpMode ? 'Já tem uma conta?' : 'Ainda não tem um diário?'}
            </p>
            <button 
              onClick={() => {
                setIsSignUpMode(!isSignUpMode);
                setEmail(''); 
                setPassword('');
                setNotification(null);
              }}
              className="text-dream-purple font-bold hover:underline font-title tracking-wide"
            >
              {isSignUpMode ? 'Fazer Login' : 'Criar Conta Grátis'}
            </button>
          </div>

        </div>
      </div>

      <Footer isDarkMode={false} />
    </div>
  );
}