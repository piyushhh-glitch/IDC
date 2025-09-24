
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[--text]">
        Detect Deepfakes with Confidence
      </h1>
      <p className="mt-6 max-w-2xl text-lg sm:text-xl text-[--text]/80">
        Upload images, videos, or audio files to analyze them for potential deepfake manipulation using state-of-the-art AI models.
      </p>
      <div className="mt-10">
        <button
          onClick={() => navigate('/upload')}
          className="px-8 py-4 bg-[--primary] text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary] focus:ring-offset-[--bg] transition-transform transform hover:scale-105"
        >
          Start Analyzing
        </button>
      </div>
    </div>
  );
};

export default HomePage;
