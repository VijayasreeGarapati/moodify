'use client';

import { useState } from 'react';
import { Heart, Lock, Shield, ChevronRight } from 'lucide-react';
import { hashPIN } from '@/lib/utils';

interface WelcomeScreenProps {
  onComplete: (hasConsented: boolean, hasPIN: boolean, pin?: string) => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState<'welcome' | 'consent' | 'pin'>('welcome');
  const [ageVerified, setAgeVerified] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleWelcomeNext = () => {
    if (!ageVerified) {
      setError('Please confirm you are at least 13 years old to continue.');
      return;
    }
    setError('');
    setStep('consent');
  };

  const handleConsentNext = () => {
    if (!consentGiven) {
      setError('Please review and accept the consent to continue.');
      return;
    }
    setError('');
    setStep('pin');
  };

  const handlePINSetup = () => {
    if (!pin || pin.length < 4) {
      setError('PIN must be at least 4 digits.');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match.');
      return;
    }

    setError('');
    const hashedPIN = hashPIN(pin);
    onComplete(true, true, hashedPIN);
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4 pb-40">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img
                src="/moodify-logo.svg"
                alt="Moodify Logo"
                className="w-24 h-24"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Moodify</h1>
            <p className="text-lg text-gray-600">
              Your safe space to track and understand your emotions
            </p>
          </div>

          <div className="space-y-4 py-6">
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-xl">
              <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">Anonymous & Private</h3>
                <p className="text-sm text-gray-600">Your data is stored securely with no personal identifiers</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-pink-50 rounded-xl">
              <Heart className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">For You</h3>
                <p className="text-sm text-gray-600">Personalized insights and support</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-xl">
              <Lock className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">Secure</h3>
                <p className="text-sm text-gray-600">Protected with your personal PIN</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ageVerified}
                onChange={(e) => setAgeVerified(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-700">I am at least 13 years old</span>
            </label>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleWelcomeNext}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'consent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4 pb-40">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Privacy & Consent</h2>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-xl">
            <div className="space-y-3 text-sm text-gray-700">
              <p className="font-semibold text-gray-800">How Moodify Works:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Your data is stored locally on your device for quick access</li>
                <li>Anonymous data is securely stored in our database for research</li>
                <li>No personal identifiers (name, email, etc.) are ever collected</li>
                <li>Your device data can be deleted anytime from Settings</li>
                <li>Local data older than 3 months is automatically removed</li>
              </ul>

              <p className="font-semibold text-gray-800 pt-4">What We Store for Research:</p>
              <p>
                To help improve mental health resources for teens, we store anonymous data including:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Demographics (age, sex, city, school) - for research context</li>
                <li>Mood entries and assessment responses - to identify patterns</li>
                <li>Timestamps - to analyze trends over time</li>
              </ul>
              <p className="text-xs text-gray-600 italic pt-2">
                All stored data is anonymous and cannot be traced back to you. Database entries are kept permanently for research purposes.
              </p>

              <p className="font-semibold text-gray-800 pt-4">Important:</p>
              <p>
                Moodify is not a replacement for professional mental health care. If you're
                experiencing a crisis, please contact a crisis hotline or trusted adult immediately.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-1"
              />
              <span className="text-sm text-gray-700">
                I understand and consent to anonymous data storage for mental health research. I confirm no personal identifiers will be collected.
              </span>
            </label>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleConsentNext}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Continue</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PIN Setup step
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4 pb-40">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Secure Your Data</h2>
          <p className="text-gray-600">Create a PIN to protect your personal information</p>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-xl">
            <p className="text-sm text-gray-700 text-center">
              <span className="font-semibold">PIN is required.</span> Your PIN protects your local device data and will be required every time you open Moodify.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Create PIN (4+ digits)
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-center text-2xl tracking-widest font-bold text-gray-900 placeholder:text-gray-400"
              placeholder="••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-center text-2xl tracking-widest font-bold text-gray-900 placeholder:text-gray-400"
              placeholder="••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handlePINSetup}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  );
}
