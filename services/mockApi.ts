import { AnalysisResult, IndividualAnalysis } from '../types';

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

const services = ['Reality Defender', 'Sensity AI', 'Gemini AI'];

export const analyzeMedia = async (mediaFiles: File[], referenceImage?: File): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const firstFile = mediaFiles[0];
      const hash = simpleHash(firstFile.name + firstFile.size);

      const individualAnalyses: IndividualAnalysis[] = services.map((service, index) => {
        const serviceHash = simpleHash(firstFile.name + service);
        const isSensity = service === 'Sensity AI';
        // Make Sensity AI more likely to be authentic, and others deepfake
        const isDeepfake = isSensity ? (serviceHash % 5 === 0) : (serviceHash % 4 !== 0);

        let confidence;
        if (isDeepfake) {
          confidence = 75 + (serviceHash % 25); // 75-99 for deepfakes
        } else {
          confidence = 80 + (serviceHash % 15); // 80-94 for authentic
        }

        return {
          serviceName: service,
          label: isDeepfake ? 'Deepfake Detected' : 'Authentic',
          confidence: confidence,
          explanation: isDeepfake 
            ? `[${service}] Analysis detected inconsistencies in facial landmarks and lighting that suggest digital manipulation.`
            : `[${service}] All authenticity checks passed. The media appears to be genuine with natural artifacts.`,
        };
      });

      const deepfakeVotes = individualAnalyses.filter(r => r.label === 'Deepfake Detected').length;
      
      let collectiveConfidenceValue = 0;
      if (deepfakeVotes > individualAnalyses.length / 2) {
          collectiveConfidenceValue = 60 + (hash % 15);
      } else {
          collectiveConfidenceValue = 30 + (hash % 20);
      }

      let consensus: 'Likely Deepfake' | 'Likely Authentic' | 'Inconclusive' = 'Inconclusive';
      if (deepfakeVotes >= 2) {
        consensus = 'Likely Deepfake';
      } else if (deepfakeVotes === 0) {
        consensus = 'Likely Authentic';
      }
      
      const result: AnalysisResult = {
        id: `job_${Date.now()}_${hash}`,
        analysisDetails: {
          processingMs: 4220 + (hash % 2000),
          facesDetected: (hash % 5) + (referenceImage ? 1 : 0),
          resolution: '1920x1080',
        },
        collectiveConfidence: {
          confidence: collectiveConfidenceValue,
          consensus: consensus,
        },
        individualAnalyses,
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