
import { AnalysisResult } from '../types';

const resultsStore: Map<string, AnalysisResult> = new Map();

// Simple hash function for pseudo-random results
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const generateHeatmapData = (hash: number): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const intensity = ((hash * (i+1) * (j+1)) % 255);
            ctx.fillStyle = `rgba(220, 38, 38, ${intensity / 255})`;
            ctx.fillRect(j, i, 1, 1);
        }
    }
    return canvas.toDataURL();
}

export const analyzeMedia = async (mediaFiles: File[], referenceImage?: File): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const firstFile = mediaFiles[0];
      const hash = simpleHash(firstFile.name + firstFile.size);

      const confidence = hash % 101;
      const isDeepfake = confidence > 60;
      
      const result: AnalysisResult = {
        id: `job_${Date.now()}_${hash}`,
        flag: isDeepfake,
        label: isDeepfake ? 'Deepfake' : 'Authentic',
        confidence: confidence,
        explanation: isDeepfake ? 'Motion artifacts and unusual lighting detected.' : 'Consistent lighting and natural movement patterns observed.',
        mediaType: firstFile.type.startsWith('video') ? 'video' : 'image',
        heatmap: firstFile.type.startsWith('image') ? {
          type: 'raster',
          data: generateHeatmapData(hash),
          boxes: null,
        } : {
          type: 'boxes',
          data: null,
          boxes: Array.from({ length: hash % 4 }).map((_, i) => ({
              x: (hash * (i+1) * 0.1) % 1,
              y: (hash * (i+1) * 0.2) % 1,
              w: 0.1 + ((hash * (i+1) * 0.05) % 0.1),
              h: 0.1 + ((hash * (i+1) * 0.07) % 0.1),
              score: 0.6 + ((hash * (i+1) * 0.01) % 0.4)
          })),
        },
        processingMs: 3130 + (hash % 2000),
        facesDetected: (hash % 5) + (referenceImage ? 1 : 0),
        resolution: '1920x1080',
      };
      
      resultsStore.set(result.id, result);
      resolve(result);
    }, 2000);
  });
};

export const getResultById = async (jobId: string): Promise<AnalysisResult | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = resultsStore.get(jobId);
      resolve(result || null);
    }, 500);
  });
};
