import React from 'react';
import { AnalysisResult } from '../types';
import { DonutChart } from './Icons';

interface DetailsCardProps {
  details: AnalysisResult['analysisDetails'];
  collectiveConfidence: AnalysisResult['collectiveConfidence'];
}

const DetailsCard: React.FC<DetailsCardProps> = ({ details, collectiveConfidence }) => {
  const isDeepfake = collectiveConfidence.consensus === 'Likely Deepfake';
  const color = isDeepfake ? 'text-amber-500' : 'text-teal-400';

  return (
    <div className="bg-[--surface] p-6 rounded-lg border border-[--border] h-full space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">Analysis Details</h3>
        <ul className="space-y-3 text-[--text]/90">
          <li className="flex justify-between items-center">
            <span>Processing Time</span>
            <span className="font-mono bg-[--bg] px-2 py-1 rounded-md text-sm">{(details.processingMs / 1000).toFixed(2)}s</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Faces Detected</span>
            <span className="font-mono bg-[--bg] px-2 py-1 rounded-md text-sm">{details.facesDetected}</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Resolution</span>
            <span className="font-mono bg-[--bg] px-2 py-1 rounded-md text-sm">{details.resolution}</span>
          </li>
        </ul>
      </div>

      <div className="border-t border-[--border]"></div>

      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-bold mb-4">Collective Confidence</h3>
        <DonutChart percentage={collectiveConfidence.confidence} color={color} size={140} strokeWidth={12} />
        <p className="mt-4 text-lg font-semibold text-[--text]">
            Consensus: <span className={`font-bold ${isDeepfake ? 'text-amber-500' : 'text-teal-400'}`}>{collectiveConfidence.consensus}</span>
        </p>
      </div>
    </div>
  );
};

export default DetailsCard;