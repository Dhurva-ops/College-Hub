
import React from 'react';
import { Class, Material, AppEvent, Faculty } from '../types';
import { CalendarIcon, BookOpenIcon, UserGroupIcon, BellIcon } from './Icons';

interface AdminDashboardProps {
  classes: Class[];
  materials: Material[];
  events: AppEvent[];
  faculty: Faculty[];
  setActiveFeature: (feature: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ classes, materials, events, faculty, setActiveFeature }) => {
  const stats = [
    { label: 'Total Classes', value: classes.length, icon: CalendarIcon, color: 'bg-blue-500', feature: 'timetable' },
    { label: 'Study Materials', value: materials.length, icon: BookOpenIcon, color: 'bg-green-500', feature: 'materials' },
    { label: 'Upcoming Events', value: events.length, icon: BellIcon, color: 'bg-yellow-500', feature: 'notifications' },
    { label: 'Faculty Members', value: faculty.length, icon: UserGroupIcon, color: 'bg-purple-500', feature: 'faculty' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-700">Admin Dashboard</h2>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold border border-purple-200">Admin Mode Active</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setActiveFeature(stat.feature)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1 group-hover:text-blue-600 transition-colors">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white bg-opacity-90 shadow-sm`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400 flex justify-between items-center">
                <span>View Details</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Quick Actions
            </h3>
            <div className="space-y-3">
                <button onClick={() => setActiveFeature('notifications')} className="w-full text-left p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 border border-purple-100 hover:border-purple-200 flex items-center justify-between group transition-all">
                    <span className="font-semibold">Post New Announcement</span>
                    <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button onClick={() => setActiveFeature('faculty')} className="w-full text-left p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-100 hover:border-blue-200 flex items-center justify-between group transition-all">
                    <span className="font-semibold">Manage Faculty Contacts</span>
                    <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                System Status
            </h3>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 mb-3">
                <p className="font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                    All Systems Operational
                </p>
                <p className="text-sm mt-1 opacity-80">Data synchronization is active.</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                <p className="font-semibold text-sm text-gray-500 uppercase mb-2">Storage Usage</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '15%'}}></div>
                </div>
                <p className="text-xs text-right">15% Used</p>
            </div>
        </div>
      </div>
    </div>
  );
};
