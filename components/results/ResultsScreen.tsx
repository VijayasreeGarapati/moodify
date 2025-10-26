'use client';

import { useMemo } from 'react';
import { QuestionnaireResponse, Resource } from '@/lib/types';
import { Heart, Phone, Globe, Book, ChevronRight, Sparkles, CheckCircle } from 'lucide-react';

interface ResultsScreenProps {
  responses: QuestionnaireResponse[];
  onContinue: () => void;
}

const resources: Resource[] = [
  {
    id: 'crisis-1',
    title: '988 Suicide & Crisis Lifeline',
    description: '24/7 free and confidential support for people in distress',
    type: 'hotline',
    phone: '988',
    category: 'crisis',
  },
  {
    id: 'crisis-2',
    title: 'Crisis Text Line',
    description: 'Text HOME to 741741 - Free 24/7 support',
    type: 'hotline',
    phone: '741741',
    category: 'crisis',
  },
  {
    id: 'general-1',
    title: 'Teen Line',
    description: 'Teens helping teens. Call or text for peer support',
    type: 'hotline',
    phone: '1-800-852-8336',
    category: 'general',
  },
  {
    id: 'website-1',
    title: 'Psychology Today - Find a Therapist',
    description: 'Search for therapists in your area',
    type: 'website',
    url: 'https://www.psychologytoday.com/us/therapists/adolescents',
    category: 'therapy',
  },
  {
    id: 'website-2',
    title: 'HelpGuide.org',
    description: 'Free mental health and wellness resources',
    type: 'website',
    url: 'https://www.helpguide.org',
    category: 'self-help',
  },
  {
    id: 'website-3',
    title: 'SAMHSA National Helpline',
    description: 'Free, confidential mental health and substance abuse referrals - Call 1-800-662-4357',
    type: 'hotline',
    phone: '1-800-662-4357',
    category: 'general',
  },
];

const healthyHabits = [
  {
    icon: '🌞',
    title: 'Morning Routine',
    description: 'Start your day with 5 minutes of stretching or meditation',
  },
  {
    icon: '💧',
    title: 'Stay Hydrated',
    description: 'Drink water throughout the day - aim for 8 glasses',
  },
  {
    icon: '🚶',
    title: 'Move Your Body',
    description: 'Take a 15-minute walk or do any physical activity you enjoy',
  },
  {
    icon: '📱',
    title: 'Digital Detox',
    description: 'Take breaks from screens, especially before bed',
  },
  {
    icon: '📝',
    title: 'Journal',
    description: 'Write down your thoughts and feelings for 5 minutes',
  },
  {
    icon: '😴',
    title: 'Sleep Schedule',
    description: 'Try to go to bed and wake up at the same time each day',
  },
  {
    icon: '🤝',
    title: 'Connect',
    description: 'Reach out to a friend or family member regularly',
  },
  {
    icon: '🎵',
    title: 'Music Therapy',
    description: 'Listen to music that makes you feel good',
  },
];

export default function ResultsScreen({ responses, onContinue }: ResultsScreenProps) {
  const analysis = useMemo(() => {
    // Calculate average score from numeric responses
    const numericResponses = responses.filter(r => typeof r.answer === 'number');
    const avgScore = numericResponses.length > 0
      ? numericResponses.reduce((acc, r) => acc + Number(r.answer), 0) / numericResponses.length
      : 5;

    let category: 'excellent' | 'good' | 'fair' | 'needs-attention';
    let message: string;
    let color: string;

    if (avgScore >= 7.5) {
      category = 'excellent';
      message = "You're doing great! Keep up the positive momentum.";
      color = 'from-green-500 to-teal-500';
    } else if (avgScore >= 5.5) {
      category = 'good';
      message = "You're doing well overall, with room for improvement.";
      color = 'from-blue-500 to-cyan-500';
    } else if (avgScore >= 4) {
      category = 'fair';
      message = "You might benefit from some extra support and self-care.";
      color = 'from-yellow-500 to-orange-500';
    } else {
      category = 'needs-attention';
      message = "It seems like you're going through a tough time. Please consider reaching out for support.";
      color = 'from-orange-500 to-red-500';
    }

    return { category, message, color, score: avgScore };
  }, [responses]);

  const showCrisisResources = analysis.category === 'needs-attention' || analysis.category === 'fair';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 pb-40 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* Results Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img
                src="/moodify-logo.svg"
                alt="Moodify Logo"
                className="w-24 h-24"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Your Results</h1>
            <p className="text-xl text-gray-600">{analysis.message}</p>
          </div>

          {showCrisisResources && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
              <p className="text-red-800 font-medium text-center">
                If you're in crisis or thinking about self-harm, please reach out for help immediately.
                You're not alone, and there are people who care.
              </p>
            </div>
          )}
        </div>

        {/* Continue to Dashboard Button */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Continue to Dashboard</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Healthy Habits */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Healthy Habits to Try</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthyHabits.map((habit, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{habit.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{habit.title}</h3>
                  <p className="text-sm text-gray-600">{habit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crisis Resources (if needed) */}
        {showCrisisResources && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <Phone className="w-8 h-8 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">Crisis Resources</h2>
            </div>
            <div className="space-y-3">
              {resources.filter(r => r.category === 'crisis').map((resource) => (
                <div
                  key={resource.id}
                  className="p-4 bg-red-50 border-2 border-red-200 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-red-600" />
                        <span>{resource.title}</span>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                      {resource.phone && (
                        <a
                          href={`tel:${resource.phone}`}
                          className="inline-block mt-2 text-red-600 font-semibold hover:text-red-700"
                        >
                          {resource.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General Resources */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Support Resources</h2>
          </div>
          <div className="space-y-3">
            {resources.filter(r => r.category !== 'crisis').map((resource) => (
              <div
                key={resource.id}
                className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                      {resource.type === 'website' && <Globe className="w-5 h-5 text-blue-600" />}
                      {resource.type === 'hotline' && <Phone className="w-5 h-5 text-blue-600" />}
                      {resource.type === 'app' && <Book className="w-5 h-5 text-blue-600" />}
                      <span>{resource.title}</span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-blue-600 font-semibold hover:text-blue-700"
                      >
                        Visit Website →
                      </a>
                    )}
                    {resource.phone && (
                      <a
                        href={`tel:${resource.phone}`}
                        className="inline-block mt-2 text-blue-600 font-semibold hover:text-blue-700"
                      >
                        {resource.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
