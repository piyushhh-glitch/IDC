export interface IndividualAnalysis {
  serviceName: string;
  label: 'Deepfake Detected' | 'Authentic';
  confidence: number;
  explanation: string;
}

// FIX: Add Heatmap-related types and the optional `heatmap` property to `AnalysisResult` to resolve a type error in DetectionHeatmap.tsx.
export interface HeatmapBox {
  x: number;
  y: number;
  w: number;
  h: number;
  score: number;
}

export type Heatmap =
  | {
      type: 'raster';
      data: string;
    }
  | {
      type: 'boxes';
      boxes: HeatmapBox[];
    };

export interface AnalysisResult {
  id: string;
  analysisDetails: {
    processingMs: number;
    facesDetected: number;
    resolution: string;
  };
  collectiveConfidence: {
    confidence: number;
    consensus: 'Likely Deepfake' | 'Likely Authentic' | 'Inconclusive';
  };
  individualAnalyses: IndividualAnalysis[];
  heatmap?: Heatmap;
}

export interface MediaFile {
  file: File;
  preview: string;
}
