
import React from 'react';

interface DetailsCardProps {
  processingMs: number;
  facesDetected: number;
  resolution: string;
}

const DetailsCard: React.FC<DetailsCardProps> = ({ processingMs, facesDetected, resolution }) => {
  return (
    <div className="bg-[--surface] p-6 rounded-lg border border-[--border] h-full">
      <h3 className="text-xl font-bold mb-4">Analysis Details</h3>
      <ul className="space-y-3 text-[--text]/90">
        <li className="flex justify-between items-center">
          <span>Processing Time</span>
          <span className="font-mono bg-[--bg] px-2 py-1 rounded-md text-sm">{(processingMs / 1000).toFixed(2)}s</span>
        </li>
        <li className="flex justify-between items-center">
          <span>Faces Detected</span>
          <span className="font-mono bg-[--bg] px-2 py-1 rounded-md text-sm">{facesDetected}</span>
        </li>
        <li className="flex justify-between items-center">
          <span>Resolution</span>
          <span className="font-mono bg-[--bg] px-2 py-1 rounded-md text-sm">{resolution}</span>
        </li>
      </ul>
    </div>
  );
};

export default DetailsCard;
