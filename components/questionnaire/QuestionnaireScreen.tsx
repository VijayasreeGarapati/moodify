'use client';

import { useState } from 'react';
import { Question, QuestionnaireResponse } from '@/lib/types';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface QuestionnaireScreenProps {
  onComplete: (responses: QuestionnaireResponse[]) => void;
}

const questions: Question[] = [
  {
    id: 'q1',
    question: 'Over the past two weeks, how often have you felt happy or content?',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
  },
  {
    id: 'q2',
    question: 'How would you rate your stress level lately?',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
  },
  {
    id: 'q3',
    question: 'How well have you been sleeping?',
    type: 'multiple-choice',
    options: ['Very well', 'Pretty well', 'Not great', 'Poorly', 'Very poorly'],
  },
  {
    id: 'q4',
    question: 'Do you feel like you have someone to talk to when you need support?',
    type: 'yes-no',
  },
  {
    id: 'q5',
    question: 'How often do you feel overwhelmed by school, work, or daily responsibilities?',
    type: 'multiple-choice',
    options: ['Rarely or never', 'Sometimes', 'Often', 'Most of the time', 'Always'],
  },
  {
    id: 'q6',
    question: 'How satisfied are you with your social connections and friendships?',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
  },
  {
    id: 'q7',
    question: 'Have you been able to enjoy your hobbies or activities lately?',
    type: 'yes-no',
  },
  {
    id: 'q8',
    question: 'How confident do you feel about handling challenges in your life?',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 10,
  },
];

export default function QuestionnaireScreen({ onComplete }: QuestionnaireScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [error, setError] = useState('');

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: string | number) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
    setError('');
  };

  const handleNext = () => {
    if (responses[currentQuestion.id] === undefined) {
      setError('Please select an answer to continue');
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setError('');
    } else {
      // Convert to QuestionnaireResponse format
      const formattedResponses: QuestionnaireResponse[] = Object.entries(responses).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
          answeredAt: new Date().toISOString(),
        })
      );
      onComplete(formattedResponses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setError('');
    }
  };

  const renderQuestionInput = () => {
    const currentAnswer = responses[currentQuestion.id];

    if (currentQuestion.type === 'scale') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between text-sm text-gray-600 px-2">
            <span>Low (1)</span>
            <span>High (10)</span>
          </div>
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className={`aspect-square rounded-xl font-semibold text-lg transition-all ${
                  currentAnswer === value
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentQuestion.type === 'multiple-choice' && currentQuestion.options) {
      return (
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option}
              onClick={() => handleAnswer(index + 1)}
              className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                currentAnswer === index + 1
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      );
    }

    if (currentQuestion.type === 'yes-no') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer('yes')}
            className={`py-6 rounded-xl font-semibold text-lg transition-all ${
              currentAnswer === 'yes'
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => handleAnswer('no')}
            className={`py-6 rounded-xl font-semibold text-lg transition-all ${
              currentAnswer === 'no'
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            No
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 pb-40">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="py-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {currentQuestion.question}
          </h2>
          {renderQuestionInput()}
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          {currentQuestionIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all flex items-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>{currentQuestionIndex < questions.length - 1 ? 'Next' : 'See Results'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
