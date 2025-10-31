import React from 'react';
import { UserRole, Tab, UploadedFile, Reminder, EventLink, ChatMessage, AiMode } from '../types';
import FileList from './FileList';
import Reminders from './Reminders';
import EventLinks from './EventLinks';
import AICompanion from './AICompanion';
import FileIcon from './icons/FileIcon';
import CalendarIcon from './icons/CalendarIcon';
import LinkIcon from './icons/LinkIcon';
import SparklesIcon from './icons/SparklesIcon';

interface DashboardProps {
  userRole: UserRole;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  files: UploadedFile[];
  currentFolderId: string | null;
  onNavigateToFolder: (folderId: string | null) => void;
  reminders: Reminder[];
  eventLinks: EventLink[];
  onAddFile: (file: File, parentId: string | null) => void;
  onDeleteFile: (id: string) => void;
  onAddFileLink: (link: { url: string; name: string }, parentId: string | null) => void;
  onAddFolder: (folderName: string, parentId: string | null) => void;
  onRenameFile: (id: string, newName: string) => void;
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'attachment' | 'link'>, attachmentFile?: File, linkUrl?: string) => void;
  onDeleteReminder: (id: string) => void;
  onAddEventLink: (eventLink: Omit<EventLink, 'id' | 'attachment'>, attachmentFile?: File) => void;
  onDeleteEventLink: (id: string) => void;
  chatHistory: ChatMessage[];
  isAiLoading: boolean;
  onSendMessageToAI: (prompt: string, imageFile: File | null) => void;
  aiMode: AiMode;
  onAiModeChange: (mode: AiMode) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const {
    userRole,
    activeTab,
    onTabChange,
    files,
    currentFolderId,
    onNavigateToFolder,
    reminders,
    eventLinks,
    onAddFile,
    onDeleteFile,
    onAddFileLink,
    onAddFolder,
    onRenameFile,
    onAddReminder,
    onDeleteReminder,
    onAddEventLink,
    onDeleteEventLink,
    chatHistory,
    isAiLoading,
    onSendMessageToAI,
    aiMode,
    onAiModeChange
  } = props;

  const tabs: { id: Tab; name: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'ai', name: 'AI Assistant', icon: SparklesIcon },
    { id: 'files', name: 'Files', icon: FileIcon },
    { id: 'reminders', name: 'Reminders', icon: CalendarIcon },
    { id: 'events', name: 'Events', icon: LinkIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'ai':
        return <AICompanion 
            chatHistory={chatHistory} 
            isLoading={isAiLoading} 
            onSendMessage={onSendMessageToAI} 
            aiMode={aiMode}
            onAiModeChange={onAiModeChange}
        />;
      case 'files':
        return <FileList 
          userRole={userRole} 
          files={files} 
          currentFolderId={currentFolderId}
          onNavigate={onNavigateToFolder}
          onAddFile={onAddFile} 
          onDeleteFile={onDeleteFile} 
          onAddFileLink={onAddFileLink} 
          onAddFolder={onAddFolder}
          onRename={onRenameFile}
        />;
      case 'reminders':
        return <Reminders userRole={userRole} reminders={reminders} onAddReminder={onAddReminder} onDeleteReminder={onDeleteReminder} />;
      case 'events':
        return <EventLinks userRole={userRole} eventLinks={eventLinks} onAddEventLink={onAddEventLink} onDeleteEventLink={onDeleteEventLink} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <nav className="w-full max-w-xl">
        <div className="flex justify-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-2 rounded-xl shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as Tab)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </nav>
      <div className="w-full max-w-4xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;