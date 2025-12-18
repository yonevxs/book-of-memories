import React, { useState } from 'react';

export default function AddMemoryModal({ isOpen, onClose, onAdd, isDarkMode }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' ou 'video'
  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      
      // Define se é vídeo ou imagem
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setMediaType(type);

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const formatData = (dataInput) => {
    if (!dataInput) return new Date().toLocaleDateString('pt-BR');
    const [ano, mes, dia] = dataInput.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !desc) return;

    setIsSubmitting(true);

    await onAdd({
      title,
      date: formatData(date), 
      description: desc,
      mediaFile: mediaFile,
      mediaType: mediaType // Passamos o tipo para o pai saber onde salvar
    });

    setIsSubmitting(false);
    
    // Limpar tudo
    setTitle('');
    setDate('');
    setDesc('');
    setMediaFile(null);
    setMediaType(null);
    setPreview('');
    onClose();
  };

  const bgClass = isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-dream-dark border-purple-100";
  const inputClass = isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-purple-50 border-purple-100 text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`${bgClass} w-full max-w-md p-6 rounded-2xl shadow-2xl border-2 relative animate-fade-in`}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-400 font-bold text-xl">✕</button>

        <h2 className="text-3xl font-title text-center mb-6">Nova Memória</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div>
            <label className="text-sm font-bold opacity-80 ml-1">Título</label>
            <input type="text" maxLength={25} value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full p-3 rounded-lg border-2 outline-none ${inputClass}`} placeholder='Primeiro encontro'/>
          </div>

          <div>
            <label className="text-sm font-bold opacity-80 ml-1">Data</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`w-full p-3 rounded-lg border-2 outline-none ${inputClass}`}/>
          </div>

          <div>
            <label className="text-sm font-bold opacity-80 ml-1">Foto ou Vídeo</label>
            <div className={`relative w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden group ${isDarkMode ? 'border-gray-600 hover:border-purple-400' : 'border-purple-200 hover:border-purple-400'}`}>
              
              {/* Aceita Image E Video agora */}
              <input type="file" accept="image/*, video/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              
              {preview ? (
                mediaType === 'video' ? (
                  <video src={preview} className="w-full h-full object-cover" controls={false} muted autoPlay loop />
                ) : (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                )
              ) : (
                <span className="text-sm opacity-60">📂 Clique para enviar Mídia</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold opacity-80 ml-1">História</label>
            <textarea rows="3" maxLength={150} value={desc} onChange={(e) => setDesc(e.target.value)} className={`w-full p-3 rounded-lg border-2 outline-none resize-none ${inputClass}`} placeholder='Essa dia foi o melhor de todos porque...'/>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full bg-gradient-to-r from-dream-purple to-purple-500 hover:from-purple-500 hover:to-dream-purple text-white font-bold py-3 rounded-lg shadow-md transition-all"
          >
            {isSubmitting ? 'Salvando...' : '✨ Adicionar ao Livro ✨'}
          </button>
        </form>
      </div>
    </div>
  );
}