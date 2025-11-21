
import React, { useState } from 'react';
import { Class, DayOfWeek } from '../types';
import { Modal } from './Modal';
import { PlusIcon, TrashIcon } from './Icons';

interface TimetableProps {
  classes: Class[];
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
}

const daysOrder = Object.values(DayOfWeek);

export const Timetable: React.FC<TimetableProps> = ({ classes, setClasses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClass, setNewClass] = useState<Omit<Class, 'id'>>({
    name: '',
    day: DayOfWeek.Monday,
    startTime: '',
    endTime: '',
    location: '',
    instructor: '',
  });

  const handleAddClass = () => {
    if (newClass.name && newClass.startTime && newClass.endTime) {
      setClasses([...classes, { ...newClass, id: crypto.randomUUID() }]);
      setIsModalOpen(false);
      setNewClass({ name: '', day: DayOfWeek.Monday, startTime: '', endTime: '', location: '', instructor: '' });
    }
  };
  
  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };
  
  const sortedClasses = [...classes].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Class Timetable</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <PlusIcon /> Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {daysOrder.map(day => (
          <div key={day} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg text-center text-blue-800 border-b pb-2 mb-4">{day}</h3>
            <div className="space-y-3">
              {sortedClasses.filter(c => c.day === day).map(c => (
                <div key={c.id} className="bg-blue-50 border border-blue-200 p-3 rounded-md relative group">
                    <button onClick={() => handleDeleteClass(c.id)} className="absolute top-1 right-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                    <p className="font-semibold text-gray-800">{c.name}</p>
                    <p className="text-sm text-gray-600">{c.startTime} - {c.endTime}</p>
                    <p className="text-sm text-gray-500">{c.location}</p>
                    <p className="text-sm text-gray-500 italic">{c.instructor}</p>
                </div>
              ))}
              {sortedClasses.filter(c => c.day === day).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No classes scheduled.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Class">
        <div className="space-y-4">
          <input type="text" placeholder="Class Name" value={newClass.name} onChange={e => setNewClass({ ...newClass, name: e.target.value })} className="w-full p-2 border rounded" />
          <select value={newClass.day} onChange={e => setNewClass({ ...newClass, day: e.target.value as DayOfWeek })} className="w-full p-2 border rounded">
            {daysOrder.map(day => <option key={day} value={day}>{day}</option>)}
          </select>
          <div className="flex gap-4">
            <input type="time" placeholder="Start Time" value={newClass.startTime} onChange={e => setNewClass({ ...newClass, startTime: e.target.value })} className="w-full p-2 border rounded" />
            <input type="time" placeholder="End Time" value={newClass.endTime} onChange={e => setNewClass({ ...newClass, endTime: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <input type="text" placeholder="Location" value={newClass.location} onChange={e => setNewClass({ ...newClass, location: e.target.value })} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Instructor" value={newClass.instructor} onChange={e => setNewClass({ ...newClass, instructor: e.target.value })} className="w-full p-2 border rounded" />
          <button onClick={handleAddClass} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add Class</button>
        </div>
      </Modal>
    </div>
  );
};
