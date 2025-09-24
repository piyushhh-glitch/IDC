
export interface AnalysisResult {
  id: string;
  flag: boolean;
  label: 'Deepfake' | 'Authentic';
  confidence: number;
  explanation: string;
  mediaType: "image" | "video" | "mixed";
  heatmap: {
    type: "raster" | "boxes" | null;
    data: string | null;
    boxes: { x: number; y: number; w: number; h: number; score: number }[] | null;
  } | null;
  processingMs: number;
  facesDetected: number;
  resolution: string;
}

export interface MediaFile {
  file: File;
  preview: string;
}
