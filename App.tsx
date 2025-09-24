
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';
import { ThemeProvider } from './hooks/useTheme';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[--bg] text-[--text] selection:bg-[--primary]/30">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/result/:jobId" element={<ResultPage />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
