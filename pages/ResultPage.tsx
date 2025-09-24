
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResultById } from '../services/mockApi';
import { AnalysisResult } from '../types';
import Spinner from '../components/Spinner';
import VerdictCard from '../components/VerdictCard';
import ConfidenceBar from '../components/ConfidenceBar';
import DetailsCard from '../components/DetailsCard';
import DetectionHeatmap from '../components/DetectionHeatmap';

const ResultPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!jobId) {
        setError('No job ID provided.');
        setLoading(false);
        return;
      }
      try {
        const data = await getResultById(jobId);
        if (data) {
          setResult(data);
        } else {
          setError('Analysis result not found. It may have expired or is invalid.');
        }
      } catch (e) {
        setError('Failed to fetch analysis results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [jobId]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Spinner /> <span className="ml-4">Loading Analysis Results...</span></div>;
  }

  if (error) {
    return (
        <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button onClick={() => navigate('/upload')} className="mt-4 px-4 py-2 bg-[--primary] text-white rounded-md">
                Analyze New File
            </button>
        </div>
    );
  }

  if (!result) {
    return <div className="text-center">No result to display.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <h2 className="text-3xl font-bold">Analysis Results</h2>
        <button
          onClick={() => alert('Report download functionality is not implemented.')}
          className="px-4 py-2 bg-[--primary] text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary] focus:ring-offset-[--bg] transition-colors"
        >
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <VerdictCard label={result.label} confidence={result.confidence} />
          <ConfidenceBar confidence={result.confidence} />
          <DetectionHeatmap heatmap={result.heatmap} />
        </div>
        <div className="lg:col-span-1">
          <DetailsCard 
            processingMs={result.processingMs} 
            facesDetected={result.facesDetected} 
            resolution={result.resolution} 
          />
        </div>
      </div>
       <div className="text-center mt-8">
        <button onClick={() => navigate('/upload')} className="text-[--primary] font-semibold hover:underline">
            &larr; Back to Upload
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
