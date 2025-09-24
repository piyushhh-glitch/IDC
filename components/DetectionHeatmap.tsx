
import React from 'react';
import { AnalysisResult } from '../types';

interface DetectionHeatmapProps {
  heatmap: AnalysisResult['heatmap'];
}

const DetectionHeatmap: React.FC<DetectionHeatmapProps> = ({ heatmap }) => {
  return (
    <div className="bg-[--surface] p-6 rounded-lg border border-[--border]">
      <h3 className="text-xl font-bold mb-4">Detection Heatmap</h3>
      <div className="aspect-video bg-[--bg] rounded-md flex items-center justify-center relative overflow-hidden">
        {heatmap?.type === 'raster' && heatmap.data ? (
          <img src={heatmap.data} alt="Detection Heatmap" className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }}/>
        ) : heatmap?.type === 'boxes' && heatmap.boxes ? (
          <div className="w-full h-full bg-gray-500/20 relative">
            <div className="absolute inset-0 flex items-center justify-center text-[--text]/50">Placeholder for Video Frame</div>
            {heatmap.boxes.map((box, i) => (
                <div key={i} className="absolute border-2 border-red-500" style={{
                    left: `${box.x * 100}%`,
                    top: `${box.y * 100}%`,
                    width: `${box.w * 100}%`,
                    height: `${box.h * 100}%`,
                    opacity: box.score
                }}>
                  <span className="absolute -top-5 left-0 text-xs bg-red-500 text-white px-1">{Math.round(box.score * 100)}%</span>
                </div>
            ))}
          </div>
        ) : (
          <p className="text-[--text]/50">No heatmap data available for this media type.</p>
        )}
      </div>
    </div>
  );
};

export default DetectionHeatmap;
