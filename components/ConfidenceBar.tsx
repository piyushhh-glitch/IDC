
import React from 'react';

interface ConfidenceBarProps {
  confidence: number;
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidence }) => {
    const isDeepfake = confidence > 60;

    return (
        <div className="bg-[--surface] p-6 rounded-lg border border-[--border]">
            <div className="flex justify-between items-center text-sm font-medium text-[--text]/80 mb-2">
                <span>Authentic</span>
                <span>Deepfake</span>
            </div>
            <div className="w-full bg-[--border] rounded-full h-4">
                <div
                    className="h-4 rounded-full"
                    style={{
                        width: `${confidence}%`,
                        background: 'linear-gradient(to right, var(--secondary), var(--accent))',
                        transition: 'width 0.5s ease-in-out'
                    }}
                ></div>
            </div>
            <div className="text-center mt-2 text-[--text]">
                Confidence Score: <span className={`font-bold ${isDeepfake ? 'text-red-500' : 'text-green-500'}`}>{confidence.toFixed(1)}%</span>
            </div>
        </div>
    );
};

export default ConfidenceBar;
