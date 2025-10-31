export enum UserRole {
  Admin = 'ADMIN',
  Student = 'STUDENT',
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url: string; 
  isLink?: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  attachment?: UploadedFile;
  link?: string;
}

export interface EventLink {
  id: string;
  title: string;
  description: string;
  url: string;
  dateTime: Date;
  attachment?: UploadedFile;
}

export type Tab = 'ai' | 'files' | 'reminders' | 'events';
export type AiMode = 'balanced' | 'fast' | 'advanced' | 'web';

export interface Source {
  uri: string;
  title: string;
}

export interface ChatAttachment {
  name: string;
  type: string;
  previewUrl?: string; // For image previews
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  attachment?: ChatAttachment;
  sources?: Source[];
}
