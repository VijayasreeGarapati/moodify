'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Send, X } from 'lucide-react';

interface DailyCheckInProps {
  onClose: () => void;
  onSubmit: (answer: string, question: string) => void;
}

export default function DailyCheckIn({ onClose, onSubmit }: DailyCheckInProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDailyQuestion();
  }, []);

  const fetchDailyQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/daily-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userContext: 'Regular user' }),
      });

      const data = await response.json();
      setQuestion(data.question);
    } catch (err) {
      setError('Failed to load question. Please try again.');
      setQuestion("What's one thing that made you smile today?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!answer.trim()) {
      setError('Please write your answer before submitting.');
      return;
    }
    onSubmit(answer, question);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-500/95 via-pink-500/95 to-orange-400/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Daily Check-In</h2>
              <p className="text-sm text-gray-600">AI-powered reflection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your question...</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
              <p className="text-lg text-gray-800 leading-relaxed">{question}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reflection
              </label>
              <textarea
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-900 font-medium placeholder:text-gray-400"
                rows={5}
                placeholder="Take a moment to reflect..."
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
              >
                Skip for Now
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>Submit</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Your response is stored locally and never shared
            </p>
          </>
        )}
      </div>
    </div>
  );
}
