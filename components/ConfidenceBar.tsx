import React from 'react';

interface ConfidenceBarProps {
  confidence: number;
  label: 'Deepfake' | 'Authentic';
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidence, label }) => {
    const isDeepfake = label === 'Deepfake';
    // The bar's width should always represent authenticity confidence.
    const authenticityConfidence = isDeepfake ? 100 - confidence : confidence;

    return (
        <div className="bg-[--surface] p-6 rounded-lg border border-[--border]">
            <div className="flex justify-between items-center text-sm font-medium text-[--text]/80 mb-2">
                <span>Deepfake</span>
                <span>Authentic</span>
            </div>
            <div className="w-full bg-[--border] rounded-full h-4 overflow-hidden">
                <div
                    className="h-4 rounded-full"
                    style={{
                        width: `${authenticityConfidence}%`,
                        background: 'linear-gradient(to right, var(--accent), var(--secondary))',
                        transition: 'width 0.5s ease-in-out'
                    }}
                ></div>
            </div>
            <div className="text-center mt-2 text-[--text]">
                {label} Confidence: <span className={`font-bold ${isDeepfake ? 'text-red-500' : 'text-green-500'}`}>{confidence.toFixed(1)}%</span>
            </div>
        </div>
    );
};

export default ConfidenceBar;