import React, { useState, useEffect } from 'react';
import { useIndexedDB } from './hooks/useIndexedDB';
import { Timetable } from './components/Timetable';
import { StudyMaterials } from './components/StudyMaterials';
import { AttendanceTracker } from './components/AttendanceTracker';
import { Notifications } from './components/Notifications';
import { FacultyList } from './components/FacultyList';
import { AdminDashboard } from './components/AdminDashboard';
import { Modal } from './components/Modal';
import { Class, Material, AttendanceRecord, AppEvent, Faculty } from './types';
import { CalendarIcon, BookOpenIcon, CheckCircleIcon, BellIcon, UserGroupIcon, ShieldCheckIcon, LockClosedIcon, ChartPieIcon } from './components/Icons';


type Feature = 'dashboard' | 'timetable' | 'materials' | 'attendance' | 'notifications' | 'faculty';

const navItems: { id: Feature; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartPieIcon },
    { id: 'timetable', label: 'Timetable', icon: CalendarIcon },
    { id: 'materials', label: 'Materials', icon: BookOpenIcon },
    { id: 'attendance', label: 'Attendance', icon: CheckCircleIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'faculty', label: 'Faculty', icon: UserGroupIcon },
];

const App: React.FC = () => {
    const [activeFeature, setActiveFeature] = useState<Feature>('timetable');
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Admin Login State
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [loginError, setLoginError] = useState('');

    // Use IndexedDB for all storage to ensure persistence and support for large data (PDFs)
    const [classes, setClasses] = useIndexedDB<Class[]>('classes', []);
    const [materials, setMaterials] = useIndexedDB<Material[]>('materials', []);
    const [attendance, setAttendance] = useIndexedDB<AttendanceRecord[]>('attendance', []);
    const [events, setEvents] = useIndexedDB<AppEvent[]>('events', []);
    const [faculty, setFaculty] = useIndexedDB<Faculty[]>('faculty', []);

    // Redirect from dashboard if admin mode is disabled
    useEffect(() => {
        if (!isAdmin && activeFeature === 'dashboard') {
            setActiveFeature('timetable');
        }
    }, [isAdmin, activeFeature]);

    const handleModeToggle = () => {
        if (isAdmin) {
            setIsAdmin(false);
        } else {
            setIsLoginModalOpen(true);
            setPasswordInput('');
            setLoginError('');
        }
    };

    const handleLogin = () => {
        // Simple hardcoded password for demonstration
        if (passwordInput === 'admin123') {
            setIsAdmin(true);
            setIsLoginModalOpen(false);
            setActiveFeature('dashboard');
        } else {
            setLoginError('Incorrect password. Try "admin123".');
        }
    };

    const renderFeature = () => {
        switch (activeFeature) {
            case 'dashboard':
                return <AdminDashboard classes={classes} materials={materials} events={events} faculty={faculty} setActiveFeature={setActiveFeature} />;
            case 'timetable':
                return <Timetable classes={classes} setClasses={setClasses} />;
            case 'materials':
                return <StudyMaterials materials={materials} setMaterials={setMaterials} />;
            case 'attendance':
                return <AttendanceTracker classes={classes} attendance={attendance} setAttendance={setAttendance} />;
            case 'notifications':
                return <Notifications events={events} setEvents={setEvents} isAdmin={isAdmin} />;
            case 'faculty':
                return <FacultyList faculty={faculty} setFaculty={setFaculty} isAdmin={isAdmin} />;
            default:
                return <Timetable classes={classes} setClasses={setClasses} />;
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <aside className="bg-slate-800 text-slate-200 w-full md:w-64 p-4 md:p-6 flex-shrink-0 flex flex-col">
                <h1 className="text-2xl font-bold text-white mb-8 text-center">College Hub</h1>
                <nav className="flex flex-row md:flex-col justify-around md:justify-start md:space-y-2 md:flex-1 overflow-x-auto md:overflow-visible">
                    {navItems.map(item => {
                        if (item.id === 'dashboard' && !isAdmin) return null;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveFeature(item.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition-colors flex-shrink-0 ${
                                    activeFeature === item.id 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0"/>
                                <span className="hidden md:inline">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                 <div className="mt-4 md:mt-auto border-t border-slate-700 pt-4">
                    <button 
                        onClick={handleModeToggle}
                        className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition-colors ${
                            isAdmin ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                    >
                        {isAdmin ? <ShieldCheckIcon className="w-5 h-5"/> : <LockClosedIcon className="w-5 h-5"/>}
                        <span className="hidden md:inline">{isAdmin ? 'Admin Mode' : 'Student Mode'}</span>
                        <span className="md:hidden">{isAdmin ? 'Admin' : 'Student'}</span>
                    </button>
                 </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 bg-slate-100">
                <div className="max-w-6xl mx-auto">
                    {renderFeature()}
                </div>
            </main>

            {/* Admin Login Modal */}
            <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title="Admin Access">
                <div className="space-y-4">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    This area is restricted to administrators.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter admin password" 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            value={passwordInput}
                            onChange={(e) => {
                                setPasswordInput(e.target.value);
                                setLoginError('');
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                        {loginError && <p className="text-red-500 text-sm mt-1">{loginError}</p>}
                    </div>
                    <button 
                        onClick={handleLogin} 
                        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors font-medium shadow-sm"
                    >
                        Login
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default App;