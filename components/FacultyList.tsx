
import React, { useState } from 'react';
import { Faculty } from '../types';
import { Modal } from './Modal';
import { PlusIcon, TrashIcon } from './Icons';

interface FacultyListProps {
  faculty: Faculty[];
  setFaculty: React.Dispatch<React.SetStateAction<Faculty[]>>;
  isAdmin: boolean;
}

export const FacultyList: React.FC<FacultyListProps> = ({ faculty, setFaculty, isAdmin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFaculty, setNewFaculty] = useState<Omit<Faculty, 'id'>>({
    name: '',
    email: '',
    phone: '',
    department: '',
  });

  const handleAddFaculty = () => {
    if (newFaculty.name) {
      setFaculty([...faculty, { ...newFaculty, id: crypto.randomUUID() }]);
      setIsModalOpen(false);
      setNewFaculty({ name: '', email: '', phone: '', department: '' });
    }
  };

  const handleDeleteFaculty = (id: string) => {
    setFaculty(faculty.filter(f => f.id !== id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Faculty Contacts</h2>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <PlusIcon /> Add Contact
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map(f => (
          <div key={f.id} className="bg-white p-4 rounded-lg shadow relative group">
            {isAdmin && (
              <button onClick={() => handleDeleteFaculty(f.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrashIcon className="w-5 h-5"/>
              </button>
            )}
            <h3 className="font-bold text-lg text-gray-800">{f.name}</h3>
            <p className="text-sm font-semibold text-blue-600">{f.department}</p>
            <div className="mt-2 text-sm space-y-1">
                <p className="text-gray-600"><strong>Email:</strong> {f.email}</p>
                <p className="text-gray-600"><strong>Phone:</strong> {f.phone}</p>
            </div>
          </div>
        ))}
      </div>
      
       {faculty.length === 0 && (
            <div className="text-center py-10 bg-white rounded-lg shadow">
                <p className="text-gray-500">No faculty contacts available.</p>
            </div>
        )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Faculty Contact">
        <div className="space-y-4">
          <input type="text" placeholder="Name" value={newFaculty.name} onChange={e => setNewFaculty({ ...newFaculty, name: e.target.value })} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Department" value={newFaculty.department} onChange={e => setNewFaculty({ ...newFaculty, department: e.target.value })} className="w-full p-2 border rounded" />
          <input type="email" placeholder="Email" value={newFaculty.email} onChange={e => setNewFaculty({ ...newFaculty, email: e.target.value })} className="w-full p-2 border rounded" />
          <input type="tel" placeholder="Phone" value={newFaculty.phone} onChange={e => setNewFaculty({ ...newFaculty, phone: e.target.value })} className="w-full p-2 border rounded" />
          <button onClick={handleAddFaculty} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add Contact</button>
        </div>
      </Modal>
    </div>
  );
};