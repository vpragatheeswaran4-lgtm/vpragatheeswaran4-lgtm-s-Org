import React, { useState, useRef, useCallback } from 'react';
import { UploadedFile, UserRole } from '../types';
import FileIcon from './icons/FileIcon';
import TrashIcon from './icons/TrashIcon';
import UploadIcon from './icons/UploadIcon';
import LinkIcon from './icons/LinkIcon';
import PlusIcon from './icons/PlusIcon';

interface FileListProps {
  userRole: UserRole;
  files: UploadedFile[];
  onAddFile: (file: File) => void;
  onDeleteFile: (id: string) => void;
  onAddFileLink: (link: { url: string; name: string }) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileUploader: React.FC<{ onAddFile: (file: File) => void }> = ({ onAddFile }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onAddFile(e.target.files[0]);
        }
    };
    
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onAddFile(e.dataTransfer.files[0]);
        }
    }, [onAddFile]);

    return (
        <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <UploadIcon className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">Any file type up to 10MB</p>
        </div>
    );
};

const LinkUploader: React.FC<{ onAddFileLink: (link: { url: string, name: string }) => void }> = ({ onAddFileLink }) => {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url && name) {
            onAddFileLink({ url, name });
            setUrl('');
            setName('');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Or add from a URL</p>
            <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Link Title" required className="flex-grow px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." required className="flex-grow px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                <button type="submit" className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Link</span>
                </button>
            </div>
        </form>
    );
};


const FileList: React.FC<FileListProps> = ({ userRole, files, onAddFile, onDeleteFile, onAddFileLink }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Documents & Files</h2>
      {userRole === UserRole.Admin && (
        <div className="mb-6">
            <FileUploader onAddFile={onAddFile} />
            <LinkUploader onAddFileLink={onAddFileLink} />
        </div>
      )}
       <div className="space-y-3">
        {files.length > 0 ? files.map(file => (
          <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-3 min-w-0">
                {file.isLink ? <LinkIcon className="w-6 h-6 text-green-500 flex-shrink-0" /> : <FileIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />}
              <div className="min-w-0">
                <a href={file.url} download={!file.isLink ? file.name : undefined} target={file.isLink ? "_blank" : "_self"} rel={file.isLink ? "noopener noreferrer" : ""} className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate hover:underline" title={file.name}>
                  {file.name}
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {file.isLink ? 'Web Link' : formatFileSize(file.size)} - {file.uploadDate.toLocaleDateString()}
                </p>
              </div>
            </div>
            {userRole === UserRole.Admin && (
              <button onClick={() => onDeleteFile(file.id)} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )) : (
            <p className="text-center text-gray-500 py-4">No files have been uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default FileList;