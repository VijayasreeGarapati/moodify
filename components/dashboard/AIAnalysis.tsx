'use client';

import { useState } from 'react';
import { Brain, RefreshCw, TrendingUp } from 'lucide-react';
import { AppState } from '@/lib/types';

interface AIAnalysisProps {
  appState: AppState;
}

export default function AIAnalysis({ appState }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  const generateAnalysis = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/analyze-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodHistory: appState.moodHistory,
          assessmentHistory: appState.assessmentHistory,
          timeframe: 'past week',
        }),
      });

      const data = await response.json();
      setAnalysis(data.analysis);
      setHasAnalysis(true);
    } catch (err) {
      setAnalysis('Unable to generate analysis right now. Please try again later.');
      setHasAnalysis(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasAnalysis && !isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800">AI-Powered Insights</h3>
          <p className="text-gray-600">
            Get personalized analysis of your mood patterns and recommendations for wellbeing
          </p>
          <button
            onClick={generateAnalysis}
            disabled={appState.moodHistory.length < 3}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Generate Analysis</span>
          </button>
          {appState.moodHistory.length < 3 && (
            <p className="text-sm text-gray-500">
              Add at least 3 mood entries to get AI insights
            </p>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 font-medium">Analyzing your mood patterns...</p>
          <p className="text-sm text-gray-500">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">AI Insights</h3>
            <p className="text-sm text-gray-600">Personalized for you</p>
          </div>
        </div>
        <button
          onClick={generateAnalysis}
          className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
          title="Refresh analysis"
        >
          <RefreshCw className="w-5 h-5 text-purple-600" />
        </button>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{analysis}</p>
      </div>

      <p className="text-xs text-gray-500 text-center">
        AI analysis is based on your recent mood entries and assessment results
      </p>
    </div>
  );
}
