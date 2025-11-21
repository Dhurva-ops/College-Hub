
export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export interface Class {
  id: string;
  name: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  location: string;
  instructor: string;
}

export type MaterialType = 'pdf' | 'link' | 'note';

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  content: string; // URL for link, text for note, filename for pdf
  fileName?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export type EventType = 'exam' | 'event' | 'reminder' | 'announcement';

export interface AppEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: EventType;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
}