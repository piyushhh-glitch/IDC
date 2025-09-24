import React from 'react';
import { MediaFile } from '../types';
import { formatBytes } from '../utils/fileUtils';
import { CloseIcon } from './Icons';

interface FilePreviewProps {
  files: MediaFile[];
  onRemove: (file: File) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ files, onRemove }) => {
  return (
    <div className="space-y-4">
      {files.map(({ file, preview }, index) => (
        <div
          key={`${file.name}-${index}`}
          className="flex items-center justify-between p-4 bg-[--bg] rounded-lg"
        >
          <div className="flex items-center space-x-4 min-w-0">
            {file.type.startsWith('image/') ? (
              <img src={preview} alt={file.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 bg-[--border] rounded-md flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[--text]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a2 2 0 01.45 2.85l-6.9 9.35a2 2 0 01-3.2 0L4.5 12.85a2 2 0 01.45-2.85L9.5 5" />
                </svg>
              </div>
            )}
            <div className="text-sm min-w-0">
              <p className="font-medium text-[--text] truncate">{file.name}</p>
              <p className="text-[--text]/70">{formatBytes(file.size)}</p>
            </div>
          </div>
          <button
            onClick={() => onRemove(file)}
            className="p-1.5 rounded-full text-[--text]/60 hover:bg-[--border] hover:text-[--text] transition-colors flex-shrink-0 ml-4"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilePreview;