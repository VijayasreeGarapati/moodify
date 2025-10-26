'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { Trash2, Lock, User, MessageSquare, ChevronRight, AlertTriangle, X, CheckCircle, Heart } from 'lucide-react';

interface SettingsScreenProps {
  userProfile: UserProfile;
  onClose: () => void;
  onDeleteAllData: () => void;
}

export default function SettingsScreen({ userProfile, onClose, onDeleteAllData }: SettingsScreenProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('general');

  const handleDeleteData = () => {
    onDeleteAllData();
    setShowDeleteConfirm(false);
  };

  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleSubmitFeedback = async () => {
    setIsSubmittingFeedback(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          message: feedback,
        }),
      });

      if (response.ok) {
        setShowFeedback(false);
        setShowThankYou(true);
        setFeedback('');
        setFeedbackType('general');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to send feedback. Please check your internet connection and try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-14 h-14 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Thank You!</h2>
            <p className="text-lg text-gray-600">
              We've received your feedback and truly appreciate you taking the time to help us improve Moodify.
            </p>
            <div className="flex justify-center">
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
          </div>

          <button
            onClick={() => setShowThankYou(false)}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Back to Settings
          </button>
        </div>
      </div>
    );
  }

  if (showFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">Feedback</h2>
            </div>
            <button
              onClick={() => setShowFeedback(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFeedbackType('bug')}
                className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                  feedbackType === 'bug'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bug
              </button>
              <button
                onClick={() => setFeedbackType('feature')}
                className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                  feedbackType === 'feature'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Feature
              </button>
              <button
                onClick={() => setFeedbackType('general')}
                className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                  feedbackType === 'general'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                General
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-900 font-medium placeholder:text-gray-400"
              rows={6}
              placeholder="Tell us what you think..."
            />
          </div>

          <button
            onClick={handleSubmitFeedback}
            disabled={!feedback.trim() || isSubmittingFeedback}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmittingFeedback ? 'Sending...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    );
  }

  if (showDeleteConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Delete Local Data?</h2>
            <p className="text-gray-600">
              This will permanently delete all mood entries, assessments, and profile data from your device.
              Your PIN will also be removed and you'll need to set up Moodify again.
            </p>
            <p className="text-sm text-gray-500 italic">
              Note: Anonymous research data already stored in our database cannot be deleted, as it contains no personal identifiers.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDeleteData}
              className="w-full py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
            >
              Yes, Delete Local Data
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="w-full py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4">
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/moodify-logo.svg"
              alt="Moodify Logo"
              className="w-10 h-10"
            />
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Profile</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-600">Age</p>
              <p className="text-lg font-semibold text-gray-800">{userProfile.age}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-600">Sex</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">
                {userProfile.sex.replace('-', ' ')}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-600">City</p>
              <p className="text-lg font-semibold text-gray-800">{userProfile.city}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-600">Zip Code</p>
              <p className="text-lg font-semibold text-gray-800">{userProfile.zipCode}</p>
            </div>
          </div>
          {userProfile.school && (
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-600">School</p>
              <p className="text-lg font-semibold text-gray-800">{userProfile.school}</p>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Security</h2>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">PIN Protection</p>
                <p className="text-sm text-gray-600">
                  {userProfile.hasPIN ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                userProfile.hasPIN ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Lock className={`w-6 h-6 ${userProfile.hasPIN ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-3">
          <button
            onClick={() => setShowFeedback(true)}
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6" />
              <div className="text-left">
                <p className="font-semibold">Send Feedback</p>
                <p className="text-sm opacity-90">Help us improve Moodify</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl hover:bg-red-100 transition-all flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Trash2 className="w-6 h-6" />
              <div className="text-left">
                <p className="font-semibold">Delete Local Data</p>
                <p className="text-sm">Remove all data from this device</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Info */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <p className="text-sm text-gray-600 text-center">
            Your data is stored locally on your device and anonymously in our secure database for mental health research.
            No personal identifiers (name, email, etc.) are collected. You can delete your local device data at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
