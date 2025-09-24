import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { LogoIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-[--surface] border-b border-[--border] shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
             <LogoIcon className="h-8 w-8 text-[--primary]" />
              <span className="text-xl font-bold text-[--text]">PixelGaurd</span>
            </Link>
            <span className="hidden sm:inline-block text-sm font-medium bg-[--surface] text-[--text]/70 border border-[--border] rounded-full px-3 py-1">Advanced Deepfake Detection Platform</span>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;