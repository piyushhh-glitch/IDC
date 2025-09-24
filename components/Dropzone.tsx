import React, { useCallback, useState, useRef } from 'react';
import { UploadIcon, CloseIcon, LinkIcon } from './Icons';
import { MediaFile } from '../types';

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept: Record<string, string[]>;
  title: string;
  description: string;
  multiple?: boolean;
  file?: MediaFile | null;
  onRemove?: () => void;
  showUrlOption?: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({ onDrop, accept, title, description, multiple = false, file, onRemove, showUrlOption = false }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const acceptedFiles = Array.from(e.dataTransfer.files).filter((f: File) =>
        Object.keys(accept).includes(f.type)
      );
      onDrop(acceptedFiles);
    }
  }, [accept, onDrop]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onDrop(Array.from(e.target.files));
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleUrlSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!url.trim()) {
        alert('Please enter a URL.');
        return;
    }
    alert(`URL submission feature is a placeholder. Your URL was: ${url}`);
    setUrl('');
    setIsUrlMode(false);
  };

  const mainDivOnClick = isUrlMode || (file && file.preview) ? undefined : onButtonClick;
  const borderColor = isDragActive ? 'border-[--primary]' : 'border-[--border]';

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={mainDivOnClick}
      className={`relative flex flex-col items-center justify-center p-6 h-full text-center bg-[--surface] rounded-lg border-2 border-dashed ${borderColor} cursor-pointer transition-colors duration-200 ease-in-out hover:border-[--primary]/70`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={Object.keys(accept).join(',')}
        multiple={multiple}
        onChange={handleChange}
      />
      
      {file && file.preview ? (
        <>
            <img src={file.preview} alt="Preview" className="max-h-32 rounded-md object-contain" />
            <button
                onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
                className="absolute top-2 right-2 p-1 bg-[--surface]/80 text-[--text] rounded-full hover:bg-[--border] transition-colors"
            >
                <CloseIcon className="w-5 h-5" />
            </button>
        </>
      ) : isUrlMode ? (
        <div className="flex flex-col items-center justify-center w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[--text]">Analyze from URL</h3>
            <p className="mt-1 text-sm text-[--text]/80">Enter a direct link to an image or video.</p>
            <div className="flex w-full max-w-sm mt-4 space-x-2">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/media.jpg"
                    className="flex-grow px-3 py-2 bg-[--bg] border border-[--border] rounded-md focus:outline-none focus:ring-2 focus:ring-[--primary] text-[--text]"
                />
                <button
                    onClick={handleUrlSubmit}
                    className="px-4 py-2 bg-[--primary] text-white font-semibold rounded-md hover:bg-blue-600"
                >
                    Add
                </button>
            </div>
            <button onClick={() => setIsUrlMode(false)} className="mt-4 text-sm text-[--primary] hover:underline">
                Or upload a file
            </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
            <UploadIcon className="w-12 h-12 text-[--text]/60" />
            <h3 className="mt-4 text-xl font-semibold text-[--text]">{title}</h3>
            <div className="mt-2 text-sm text-[--text]/70 max-w-xs">
              {description.split('•').map((line, index) => (
                <span key={index} className="block">{line.trim()}</span>
              ))}
            </div>
            <div className="mt-6 flex items-center space-x-4">
                <button
                    onClick={(e) => { e.stopPropagation(); onButtonClick(); }}
                    className="px-6 py-2 bg-[--primary] text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 transition-colors"
                >
                    Choose File
                </button>
                {showUrlOption && (
                    <>
                        <span className="text-sm text-[--text]/60">or</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsUrlMode(true); }}
                            className="px-6 py-2 bg-transparent border border-[--border] text-[--text] font-semibold rounded-md hover:bg-[--border] transition-colors flex items-center space-x-2"
                        >
                            <LinkIcon className="w-4 h-4" />
                            <span>Use URL</span>
                        </button>
                    </>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Dropzone;