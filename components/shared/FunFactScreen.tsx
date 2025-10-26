'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { getRandomFunFact } from '@/lib/utils';

interface FunFactScreenProps {
  onContinue: () => void;
}

export default function FunFactScreen({ onContinue }: FunFactScreenProps) {
  const [funFact, setFunFact] = useState('');

  useEffect(() => {
    setFunFact(getRandomFunFact());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 flex items-center justify-center p-4 pb-40">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-8 animate-fadeIn">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-10 h-10 text-white" fill="white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Did You Know?</h2>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
          <p className="text-lg text-gray-700 leading-relaxed">
            {funFact}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-4 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>Let's Get Started</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-gray-500 text-center">
            You'll answer a few quick questions about how you're feeling
          </p>
        </div>
      </div>
    </div>
  );
}
