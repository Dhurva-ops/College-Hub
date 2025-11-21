
import React, { useMemo } from 'react';
import { Class, AttendanceRecord, AttendanceStatus } from '../types';

interface AttendanceTrackerProps {
  classes: Class[];
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ classes, attendance, setAttendance }) => {
  const today = new Date().toISOString().split('T')[0];

  const handleMarkAttendance = (classId: string, status: AttendanceStatus) => {
    const existingRecordIndex = attendance.findIndex(rec => rec.classId === classId && rec.date === today);
    const newAttendance = [...attendance];

    if (existingRecordIndex > -1) {
      newAttendance[existingRecordIndex] = { classId, date: today, status };
    } else {
      newAttendance.push({ classId, date: today, status });
    }
    setAttendance(newAttendance);
  };

  const attendanceStats = useMemo(() => {
    return classes.map(c => {
      const records = attendance.filter(rec => rec.classId === c.id);
      const present = records.filter(rec => rec.status === 'present').length;
      const total = records.length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 100;
      return { classId: c.id, percentage, total, present };
    });
  }, [classes, attendance]);
  
  const getStatusButtonClass = (currentStatus: AttendanceStatus | undefined, buttonStatus: AttendanceStatus) => {
    if (currentStatus === buttonStatus) {
        return {
            present: 'bg-green-500 text-white',
            absent: 'bg-red-500 text-white',
            late: 'bg-yellow-500 text-white',
        }[buttonStatus];
    }
    return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Attendance Tracker</h2>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {classes.map(c => {
            const stats = attendanceStats.find(s => s.classId === c.id);
            const todayRecord = attendance.find(rec => rec.classId === c.id && rec.date === today);
            
            return (
              <div key={c.id} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-1">
                  <p className="font-semibold text-lg text-gray-800">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.instructor}</p>
                </div>
                <div className="md:col-span-1 flex items-center justify-center gap-4">
                    <div className="text-center">
                        <p className="font-bold text-2xl text-blue-600">{stats?.percentage}%</p>
                        <p className="text-xs text-gray-500">Present ({stats?.present}/{stats?.total})</p>
                    </div>
                </div>
                <div className="md:col-span-1 flex justify-end gap-2">
                    <button onClick={() => handleMarkAttendance(c.id, 'present')} className={`px-3 py-1 text-sm rounded-full transition-colors ${getStatusButtonClass(todayRecord?.status, 'present')}`}>Present</button>
                    <button onClick={() => handleMarkAttendance(c.id, 'late')} className={`px-3 py-1 text-sm rounded-full transition-colors ${getStatusButtonClass(todayRecord?.status, 'late')}`}>Late</button>
                    <button onClick={() => handleMarkAttendance(c.id, 'absent')} className={`px-3 py-1 text-sm rounded-full transition-colors ${getStatusButtonClass(todayRecord?.status, 'absent')}`}>Absent</button>
                </div>
              </div>
            );
          })}
        </div>
         {classes.length === 0 && (
            <div className="text-center py-10">
                <p className="text-gray-500">Add classes in the Timetable to track attendance.</p>
            </div>
        )}
      </div>
    </div>
  );
};
