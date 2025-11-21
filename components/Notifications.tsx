
import React, { useState } from 'react';
import { AppEvent, EventType } from '../types';
import { Modal } from './Modal';
import { PlusIcon, TrashIcon } from './Icons';

interface EventsProps {
  events: AppEvent[];
  setEvents: React.Dispatch<React.SetStateAction<AppEvent[]>>;
  isAdmin: boolean;
}

export const Notifications: React.FC<EventsProps> = ({ events, setEvents, isAdmin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<AppEvent, 'id'>>({
    title: '',
    date: '',
    time: '',
    type: 'event',
  });

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, { ...newEvent, id: crypto.randomUUID() }]);
      setIsModalOpen(false);
      setNewEvent({ title: '', date: '', time: '', type: 'event' });
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  }

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const getTypeStyles = (type: EventType) => {
    switch(type) {
        case 'exam': return { border: 'border-l-4 border-red-500', bg: 'bg-red-50' };
        case 'event': return { border: 'border-l-4 border-blue-500', bg: 'bg-blue-50' };
        case 'reminder': return { border: 'border-l-4 border-yellow-500', bg: 'bg-yellow-50' };
        case 'announcement': return { border: 'border-l-4 border-purple-600', bg: 'bg-purple-50' };
        default: return { border: 'border-l-4 border-gray-500', bg: 'bg-gray-50' };
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Events & Announcements</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <PlusIcon /> Add Event
        </button>
      </div>
      
      <div className="space-y-4">
        {sortedEvents.map(event => {
            const styles = getTypeStyles(event.type);
            return (
                <div key={event.id} className={`${styles.bg} ${styles.border} p-4 rounded-r-lg flex justify-between items-center group`}>
                    <div>
                        <p className="text-xs uppercase font-semibold text-gray-500">
                            {new Date(event.date).toDateString()}{event.time && ` @ ${event.time}`}
                            {event.type === 'announcement' && <span className="ml-2 text-purple-600 font-bold px-1.5 py-0.5 bg-purple-100 rounded text-[10px]">OFFICIAL</span>}
                        </p>
                        <p className="font-bold text-lg text-gray-800">{event.title}</p>
                        <span className="text-sm capitalize font-medium">{event.type}</span>
                    </div>
                    {/* Allow deletion if user is admin, OR if the event is NOT an official announcement (assuming users own their personal events) */}
                    {(isAdmin || event.type !== 'announcement') && (
                        <button onClick={() => handleDeleteEvent(event.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    )}
                </div>
            )
        })}
      </div>

       {sortedEvents.length === 0 && (
            <div className="text-center py-10 bg-white rounded-lg shadow">
                <p className="text-gray-500">No upcoming events or announcements.</p>
            </div>
        )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Event">
        <div className="space-y-4">
          <input type="text" placeholder="Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full p-2 border rounded" />
          <input type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full p-2 border rounded" />
          <input type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full p-2 border rounded" />
          <select value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value as EventType })} className="w-full p-2 border rounded">
            <option value="event">Event</option>
            <option value="exam">Exam</option>
            <option value="reminder">Reminder</option>
            {isAdmin && <option value="announcement">Official Announcement</option>}
          </select>
          <button onClick={handleAddEvent} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add Event</button>
        </div>
      </Modal>
    </div>
  );
};