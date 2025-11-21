
import React, { useState, useRef } from 'react';
import { Material, MaterialType } from '../types';
import { Modal } from './Modal';
import { PlusIcon, TrashIcon } from './Icons';

interface StudyMaterialsProps {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

export const StudyMaterials: React.FC<StudyMaterialsProps> = ({ materials, setMaterials }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Omit<Material, 'id'>>({
    title: '',
    type: 'note',
    content: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMaterial = () => {
    if (!newMaterial.title || (!newMaterial.content && newMaterial.type !== 'pdf')) return;
    
    let materialToAdd = { ...newMaterial, id: crypto.randomUUID() };

    if (newMaterial.type === 'pdf' && fileInputRef.current?.files?.[0]) {
      materialToAdd.fileName = fileInputRef.current.files[0].name;
      // In a real app, you would upload the file and store the URL in 'content'.
      // For this demo, we'll just use the filename.
      materialToAdd.content = fileInputRef.current.files[0].name;
    }
    
    setMaterials([...materials, materialToAdd]);
    setIsModalOpen(false);
    setNewMaterial({ title: '', type: 'note', content: '' });
  };
  
  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  }

  const getTypeStyles = (type: MaterialType) => {
    switch (type) {
      case 'pdf': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
      case 'link': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
      case 'note': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Study Materials</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <PlusIcon /> Add Material
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(material => {
            const styles = getTypeStyles(material.type);
            return (
                <div key={material.id} className={`${styles.bg} ${styles.border} border p-4 rounded-lg shadow-sm relative group`}>
                    <button onClick={() => handleDeleteMaterial(material.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                    <div className={`text-xs font-semibold uppercase px-2 py-1 rounded-full inline-block mb-2 ${styles.text} ${styles.bg === 'bg-yellow-100' ? 'bg-yellow-200' : styles.bg === 'bg-red-100' ? 'bg-red-200' : 'bg-green-200'}`}>{material.type}</div>
                    <h3 className="font-bold text-lg text-gray-800">{material.title}</h3>
                    {material.type === 'link' ? (
                        <a href={material.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{material.content}</a>
                    ) : material.type === 'pdf' ? (
                        <p className="text-gray-600">{material.fileName}</p>
                    ) : (
                        <p className="text-gray-700 mt-1">{material.content}</p>
                    )}
                </div>
            )
        })}
      </div>
       {materials.length === 0 && (
            <div className="text-center py-10 bg-white rounded-lg shadow">
                <p className="text-gray-500">No study materials added yet.</p>
            </div>
        )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Study Material">
        <div className="space-y-4">
          <input type="text" placeholder="Title" value={newMaterial.title} onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })} className="w-full p-2 border rounded" />
          <select value={newMaterial.type} onChange={e => setNewMaterial({ ...newMaterial, type: e.target.value as MaterialType, content: '' })} className="w-full p-2 border rounded">
            <option value="note">Note</option>
            <option value="link">Link</option>
            <option value="pdf">PDF</option>
          </select>
          {newMaterial.type === 'note' && <textarea placeholder="Note content..." value={newMaterial.content} onChange={e => setNewMaterial({ ...newMaterial, content: e.target.value })} className="w-full p-2 border rounded h-32"></textarea>}
          {newMaterial.type === 'link' && <input type="url" placeholder="https://example.com" value={newMaterial.content} onChange={e => setNewMaterial({ ...newMaterial, content: e.target.value })} className="w-full p-2 border rounded" />}
          {newMaterial.type === 'pdf' && <input type="file" ref={fileInputRef} accept=".pdf" className="w-full p-2 border rounded" />}
          <button onClick={handleAddMaterial} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add Material</button>
        </div>
      </Modal>
    </div>
  );
};
