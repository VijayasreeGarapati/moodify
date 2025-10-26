'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { User, MapPin, School, ChevronRight } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (profile: Omit<UserProfile, 'hasConsented' | 'consentDate' | 'hasPIN'>) => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | ''>('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Validation
    if (!age || parseInt(age) < 13 || parseInt(age) > 120) {
      setError('Please enter a valid age (13+)');
      return;
    }

    if (!sex) {
      setError('Please select your gender');
      return;
    }

    if (!city.trim()) {
      setError('Please enter your city');
      return;
    }

    if (!zipCode.trim() || zipCode.length < 5) {
      setError('Please enter a valid zip code');
      return;
    }

    setError('');
    onComplete({
      age: parseInt(age),
      sex,
      city: city.trim(),
      zipCode: zipCode.trim(),
      school: school.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 pb-40">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Tell Us About You</h2>
          <p className="text-gray-600">Help us personalize your experience</p>
        </div>

        <div className="space-y-4">
          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="13"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-medium placeholder:text-gray-400"
              placeholder="Enter your age"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSex('male')}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  sex === 'male'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setSex('female')}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  sex === 'female'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                Female
              </button>
              <button
                onClick={() => setSex('non-binary')}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  sex === 'non-binary'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                Non-binary
              </button>
              <button
                onClick={() => setSex('prefer-not-to-say')}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  sex === 'prefer-not-to-say'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                Prefer not to say
              </button>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-medium placeholder:text-gray-400"
              placeholder="Enter your city"
            />
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-medium placeholder:text-gray-400"
              placeholder="12345"
              maxLength={5}
            />
          </div>

          {/* School (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <School className="w-4 h-4 inline mr-1" />
              School <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-medium placeholder:text-gray-400"
              placeholder="Your school name"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Continue</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            This demographic information is stored anonymously for mental health research. No personal identifiers are collected.
          </p>
        </div>
      </div>
    </div>
  );
}
