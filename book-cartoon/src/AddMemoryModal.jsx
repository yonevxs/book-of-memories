import React, { useState } from 'react';

export default function AddMemoryModal({ isOpen, onClose, onAdd, isDarkMode }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  
  // Arrays para arquivos e previews
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    // Verifica se vai passar do limite de 5
    if (selectedFiles.length + newFiles.length > 5) {
      alert("Você pode adicionar no máximo 5 arquivos por memória.");
      return;
    }

    // Cria previews para os NOVOS arquivos
    const newPreviewsData = newFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));

    // Adiciona aos existentes (ACUMULA)
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviewsData]);

    // Limpa o input para permitir selecionar mais arquivos depois
    e.target.value = ''; 
  };

  // Função para remover um arquivo específico da lista
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setPreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const formatData = (dataInput) => {
    if (!dataInput) return new Date().toLocaleDateString('pt-BR');
    const [ano, mes, dia] = dataInput.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação: Apenas Título é obrigatório agora
    if (!title) {
      alert("Por favor, dê um título para sua memória.");
      return;
    }

    setIsSubmitting(true);

    await onAdd({
      title,
      date: formatData(date), 
      description: desc, // Pode ir vazio
      mediaFiles: selectedFiles,
    });

    setIsSubmitting(false);
    
    // Limpar tudo
    setTitle('');
    setDate('');
    setDesc('');
    setSelectedFiles([]);
    setPreviews([]);
    onClose();
  };

  const bgClass = isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-dream-dark border-purple-100";
  const inputClass = isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-purple-50 border-purple-100 text-gray-700";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`${bgClass} w-full max-w-md p-6 rounded-2xl shadow-2xl border-2 relative animate-fade-in max-h-[90vh] overflow-y-auto`}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-400 font-bold text-xl">✕</button>

        <h2 className="text-3xl font-title text-center mb-6">Nova Memória</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-bold opacity-80 ml-1">Título *</label>
            <input type="text" maxLength={25} value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full p-3 rounded-lg border-2 outline-none ${inputClass}`} placeholder="Ex: Viagem à praia" />
          </div>

          <div>
            <label className="text-sm font-bold opacity-80 ml-1">Data</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`w-full p-3 rounded-lg border-2 outline-none ${inputClass}`} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 ml-1">
               <label className="text-sm font-bold opacity-80">Fotos e Vídeos</label>
               <span className="text-xs opacity-60">{selectedFiles.length}/5</span>
            </div>
            
            <div className={`relative w-full p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${isDarkMode ? 'border-gray-600' : 'border-purple-200'}`}>
              
              {/* Botão de Adicionar Mais */}
              <label className="cursor-pointer bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-bold mb-4 transition-colors">
                 + Adicionar Mídia
                 <input type="file" multiple accept="image/*, video/*" onChange={handleFileChange} className="hidden" />
              </label>
              
              {/* Lista de Previews com botão de Remover */}
              {previews.length > 0 ? (
                <div className="flex gap-3 flex-wrap justify-center w-full">
                  {previews.map((prev, idx) => (
                    <div key={idx} className="w-16 h-16 relative shadow-md group">
                      {prev.type === 'video' ? (
                        <video src={prev.url} className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <img src={prev.url} className="w-full h-full object-cover rounded-md" alt="preview" />
                      )}
                      
                      {/* Botão de Remover (X) */}
                      <button 
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm opacity-60">Nenhum arquivo selecionado</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold opacity-80 ml-1">História (Opcional)</label>
            <textarea rows="3" maxLength={150} value={desc} onChange={(e) => setDesc(e.target.value)} className={`w-full p-3 rounded-lg border-2 outline-none resize-none ${inputClass}`} placeholder="Escreva algo se quiser..." />
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