import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropzone from '../components/Dropzone';
import FilePreview from '../components/FilePreview';
import Spinner from '../components/Spinner';
import { analyzeMedia } from '../services/mockApi';
import { MediaFile } from '../types';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ACCEPTED_MEDIA_TYPES = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/quicktime': ['.mov'],
};

const HomePage: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [referenceFile, setReferenceFile] = useState<MediaFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleMediaDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
    if (!file) return;
  
    if (file.size > MAX_FILE_SIZE) {
      setError(`File "${file.name}" is too large. Max size is 50MB.`);
      setMediaFiles(prevFiles => {
        prevFiles.forEach(f => URL.revokeObjectURL(f.preview));
        return [];
      });
      return;
    }
  
    const newFile: MediaFile = { file, preview: URL.createObjectURL(file) };
    
    setMediaFiles(prevFiles => {
      // Clean up old object URLs before setting new state
      prevFiles.forEach(f => URL.revokeObjectURL(f.preview));
      return [newFile];
    });
  }, []);

  const handleReferenceDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`Reference image is too large. Max size is 50MB.`);
        return;
      }
      setReferenceFile(prevFile => {
        if(prevFile) {
          URL.revokeObjectURL(prevFile.preview);
        }
        return { file, preview: URL.createObjectURL(file) };
      });
    }
  }, []);

  const removeMediaFile = (fileToRemove: File) => {
    setMediaFiles((prev) => prev.filter(({ file }) => {
      if (file === fileToRemove) {
        URL.revokeObjectURL(prev.find(mf => mf.file === fileToRemove)!.preview);
        return false;
      }
      return true;
    }));
  };

  const removeReferenceFile = () => {
    setReferenceFile(prevFile => {
      if(prevFile) {
        URL.revokeObjectURL(prevFile.preview);
      }
      return null;
    });
  };
  
  const handleAnalyse = async () => {
    if (mediaFiles.length === 0) {
      setError("Please upload at least one media file to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const filesToUpload = mediaFiles.map(mf => mf.file);
      const refFile = referenceFile ? referenceFile.file : undefined;
      const result = await analyzeMedia(filesToUpload, refFile);
      navigate(`/result/${result.id}`);
    } catch (err) {
      setError("An error occurred during analysis. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center pb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[--text]">
          Detect Deepfakes with Confidence
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-[--text]/80">
          Upload images, videos, or audio files to analyze them for potential deepfake manipulation using state-of-the-art AI models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Dropzone
            onDrop={handleMediaDrop}
            accept={ACCEPTED_MEDIA_TYPES}
            title="Upload your media file"
            description="Drop a file here or click to browse • Images & Videos up to 50MB"
            showUrlOption={true}
          />
        </div>
        <div>
          <Dropzone
            onDrop={handleReferenceDrop}
            accept={{ 'image/jpeg': [], 'image/png': [], 'image/webp': [] }}
            title="Reference Image (Optional)"
            description="Drop an image here or click to select for enhanced analysis."
            file={referenceFile}
            onRemove={removeReferenceFile}
            showUrlOption={true}
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-center p-4 bg-red-500/10 rounded-lg">{error}</div>}

      {mediaFiles.length > 0 && (
        <div className="bg-[--surface] border border-[--border] rounded-lg p-6 mt-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-xl text-[--text]">{mediaFiles.length === 1 ? 'Uploaded File' : 'Uploaded Files'}</h3>
                <button
                    onClick={handleAnalyse}
                    disabled={isLoading}
                    className="px-6 py-3 bg-[--primary] text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary] focus:ring-offset-[--bg] transition-transform transform hover:scale-105"
                >
                    {isLoading ? <Spinner /> : `Analyse ${mediaFiles.length === 1 ? 'File' : `${mediaFiles.length} Files`}`}
                </button>
            </div>
            <FilePreview files={mediaFiles} onRemove={removeMediaFile} />
        </div>
      )}
    </div>
  );
};

export default HomePage;