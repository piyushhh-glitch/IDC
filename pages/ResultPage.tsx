import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResultById } from '../services/mockApi';
import { AnalysisResult, IndividualAnalysis } from '../types';
import Spinner from '../components/Spinner';
import DetailsCard from '../components/DetailsCard';
import { DonutChart } from '../components/Icons';

// Page-specific component to avoid creating new files
interface AnalysisProviderCardProps {
  analysis: IndividualAnalysis;
}

const AnalysisProviderCard: React.FC<AnalysisProviderCardProps> = ({ analysis }) => {
  const isDeepfake = analysis.label === 'Deepfake Detected';
  const chartColor = isDeepfake ? 'text-amber-500' : 'text-teal-400';

  return (
    <div className="bg-[--surface] p-6 rounded-lg border border-[--border]">
      <h3 className="text-xl font-bold mb-4">{analysis.serviceName}</h3>
      <div className="flex items-center space-x-6">
        <div className="flex-shrink-0">
          <DonutChart percentage={analysis.confidence} color={chartColor} size={100} strokeWidth={8} />
        </div>
        <div>
          <p className="text-lg font-semibold text-[--text]">{analysis.label}</p>
          <p className="text-[--text]/80 mt-1">{analysis.explanation}</p>
        </div>
      </div>
    </div>
  );
};


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
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="flex items-center">
            <Spinner /> <span className="ml-4">Loading Analysis Results...</span>
        </div>
        <p className="mt-4 text-sm text-[--text]/70">This can sometimes take a moment. Please wait.</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-[--primary] text-white rounded-md">
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analysis Results</h2>
        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-3 bg-[--primary] text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary] focus:ring-offset-[--bg] transition-transform transform hover:scale-105"
        >
            Start New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {result.individualAnalyses.map((analysis) => (
            <AnalysisProviderCard key={analysis.serviceName} analysis={analysis} />
          ))}
        </div>
        <div className="lg:col-span-1 space-y-8 sticky top-8">
          <DetailsCard 
            details={result.analysisDetails}
            collectiveConfidence={result.collectiveConfidence}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultPage;