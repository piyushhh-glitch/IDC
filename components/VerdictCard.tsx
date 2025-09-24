
import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from './Icons';

interface VerdictCardProps {
  label: 'Deepfake' | 'Authentic';
  confidence: number;
}

const VerdictCard: React.FC<VerdictCardProps> = ({ label, confidence }) => {
  const isDeepfake = label === 'Deepfake';
  const color = isDeepfake ? 'text-red-500' : 'text-green-500';
  const Icon = isDeepfake ? ExclamationCircleIcon : CheckCircleIcon;

  return (
    <div className="bg-[--surface] p-6 rounded-lg border border-[--border]">
      <div className="flex items-center space-x-4">
        <Icon className={`w-12 h-12 ${color}`} />
        <div>
          <h3 className={`text-2xl font-bold ${color}`}>{isDeepfake ? 'Deepfake Detected' : 'Authentic'}</h3>
          <p className="text-[--text]/80">Confidence: <span className="font-semibold text-[--text]">{confidence.toFixed(1)}%</span></p>
        </div>
      </div>
    </div>
  );
};

export default VerdictCard;
