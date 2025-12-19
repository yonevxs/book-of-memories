import React, { useState, useEffect } from 'react';

export default function AddMemoryModal({ isOpen, onClose, onAdd, onEdit, isDarkMode, memoryToEdit }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  
  // Arrays para arquivos e previews
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // EFEITO: Preenche os dados se for Edição
  useEffect(() => {
    if (isOpen) {
      if (memoryToEdit) {
        setTitle(memoryToEdit.title);
        // Converte DD/MM/AAAA para YYYY-MM-DD
        if (memoryToEdit.date) {
            const parts = memoryToEdit.date.split('/');
            if(parts.length === 3) setDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
            else setDate('');
        }
        setDesc(memoryToEdit.description || '');
      } else {
        // Limpa se for Nova Memória
        setTitle('');
        setDate('');
        setDesc('');
        setSelectedFiles([]);
        setPreviews([]);
      }
    }
  }, [isOpen, memoryToEdit]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    if (selectedFiles.length + newFiles.length > 5) {
      alert("Você pode adicionar no máximo 5 arquivos novos por vez.");
      return;
    }

    const newPreviewsData = newFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviewsData]);
    e.target.value = ''; 
  };

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
    
    if (!title) {
      alert("O título é obrigatório.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title,
      date: formatData(date), 
      description: desc,
      mediaFiles: selectedFiles,
    };

    // --- AQUI ESTÁ A CORREÇÃO ---
    // Verifica: Se tem memória para editar, chama onEdit. Senão, chama onAdd.
    if (memoryToEdit) {
      console.log("Editando memória ID:", memoryToEdit.id); // Debug
      await onEdit(memoryToEdit.id, payload);
    } else {
      console.log("Criando nova memória"); // Debug
      await onAdd(payload);
    }
    // ----------------------------

    setIsSubmitting(false);
    onClose();
  };

  const bgClass = isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-dream-dark border-purple-100";
  const inputClass = isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-purple-50 border-purple-100 text-gray-700";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`${bgClass} w-full max-w-md p-6 rounded-2xl shadow-2xl border-2 relative animate-fade-in max-h-[90vh] overflow-y-auto`}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-400 font-bold text-xl">✕</button>

        <h2 className="text-3xl font-title text-center mb-6">
            {memoryToEdit ? 'Editar Página' : 'Nova Memória'}
        </h2>

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
               <label className="text-sm font-bold opacity-80">
                 {memoryToEdit ? 'Adicionar mais fotos/vídeos' : 'Fotos e Vídeos'}
               </label>
            </div>
            
            <div className={`relative w-full p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${isDarkMode ? 'border-gray-600' : 'border-purple-200'}`}>
              
              <label className="cursor-pointer bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-bold mb-4 transition-colors">
                 + Escolher Arquivos
                 <input type="file" multiple accept="image/*, video/*" onChange={handleFileChange} className="hidden" />
              </label>
              
              {previews.length > 0 && (
                <div className="flex gap-3 flex-wrap justify-center w-full">
                  {previews.map((prev, idx) => (
                    <div key={idx} className="w-16 h-16 relative shadow-md group">
                      {prev.type === 'video' ? (
                        <video src={prev.url} className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <img src={prev.url} className="w-full h-full object-cover rounded-md" alt="preview" />
                      )}
                      
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
              )}
            </div>
            {memoryToEdit && <p className="text-xs opacity-60 mt-2 text-center ml-1">* Suas fotos antigas serão mantidas. Aqui você adiciona novas.</p>}
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
            {isSubmitting ? 'Salvando...' : (memoryToEdit ? 'Salvar Alterações' : '✨ Adicionar ao Livro ✨')}
          </button>
        </form>
      </div>
    </div>
  );
}