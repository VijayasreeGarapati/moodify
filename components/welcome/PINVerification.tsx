'use client';

import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { verifyPIN } from '@/lib/utils';

interface PINVerificationProps {
  storedPIN: string;
  onSuccess: () => void;
  onForgotPIN: () => void;
}

export default function PINVerification({ storedPIN, onSuccess, onForgotPIN }: PINVerificationProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pin || pin.length < 4) {
      setError('Please enter your PIN');
      return;
    }

    if (verifyPIN(pin, storedPIN)) {
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setError('Too many failed attempts. You can reset your data below.');
      } else {
        setError(`Incorrect PIN. ${3 - newAttempts} attempts remaining.`);
      }
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4 pb-40">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-600">Enter your PIN to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-center text-2xl tracking-widest font-bold text-gray-900"
              placeholder="••••"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Unlock
          </button>

          {attempts >= 3 && (
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">Forgot your PIN?</p>
              <button
                type="button"
                onClick={onForgotPIN}
                className="text-red-600 font-semibold hover:text-red-700 underline text-sm"
              >
                Reset Local Data & Start Over
              </button>
              <p className="text-xs text-gray-500 italic">
                Note: This only resets data on your device. Anonymous research data remains in database.
              </p>
            </div>
          )}
        </form>

        <p className="text-xs text-gray-500 text-center">
          Your PIN protects local device data. Anonymous entries are securely stored for research.
        </p>
      </div>
    </div>
  );
}
