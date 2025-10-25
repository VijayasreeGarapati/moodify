'use client';

import { useState, useMemo, useEffect } from 'react';
import { MoodEntry, AppState, DailyCheckIn as DailyCheckInType } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, Calendar, Trash2, Settings, Menu, MessageCircle } from 'lucide-react';
import { getMoodEmoji, getMoodColor, formatDate } from '@/lib/utils';
import AIAnalysis from './AIAnalysis';
import DailyCheckIn from './DailyCheckIn';

interface DashboardScreenProps {
  appState: AppState;
  onAddMood: (mood: MoodEntry) => void;
  onDeleteMood: (id: string) => void;
  onTakeAssessment: () => void;
  onSettings: () => void;
  onDailyCheckIn: (checkIn: DailyCheckInType) => void;
}

export default function DashboardScreen({
  appState,
  onAddMood,
  onDeleteMood,
  onTakeAssessment,
  onSettings,
  onDailyCheckIn,
}: DashboardScreenProps) {
  const [showAddMood, setShowAddMood] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');

  // Check if user should see daily check-in
  useEffect(() => {
    const lastCheckIn = appState.lastCheckInDate;
    const today = new Date().toDateString();
    const lastCheckInDate = lastCheckIn ? new Date(lastCheckIn).toDateString() : null;

    // Show daily check-in if they haven't done one today
    if (lastCheckInDate !== today && appState.hasCompletedOnboarding) {
      // Show after a small delay
      const timer = setTimeout(() => {
        setShowDailyCheckIn(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [appState.lastCheckInDate, appState.hasCompletedOnboarding]);

  const chartData = useMemo(() => {
    const moodValues: Record<MoodEntry['mood'], number> = {
      'very-happy': 10,
      'happy': 8,
      'neutral': 6,
      'sad': 4,
      'very-sad': 2,
      'anxious': 3,
      'stressed': 3,
    };

    return [...appState.moodHistory]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(-30) // Last 30 entries
      .map(entry => ({
        date: new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: moodValues[entry.mood],
        mood: entry.mood,
      }));
  }, [appState.moodHistory]);

  const stats = useMemo(() => {
    const last7Days = appState.moodHistory.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return entryDate >= sevenDaysAgo;
    });

    const moodCounts: Record<string, number> = {};
    last7Days.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as MoodEntry['mood'] | undefined;

    return {
      totalEntries: appState.moodHistory.length,
      last7DaysEntries: last7Days.length,
      mostCommonMood,
    };
  }, [appState.moodHistory]);

  const handleAddMood = () => {
    if (!selectedMood) return;

    const newMood: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      intensity,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onAddMood(newMood);
    setShowAddMood(false);
    setSelectedMood(null);
    setIntensity(5);
    setNote('');
  };

  const handleDailyCheckInSubmit = (answer: string, question: string) => {
    const checkIn: DailyCheckInType = {
      id: Date.now().toString(),
      question,
      answer,
      createdAt: new Date().toISOString(),
    };
    onDailyCheckIn(checkIn);
    setShowDailyCheckIn(false);
  };

  const moods: Array<{ mood: MoodEntry['mood']; label: string }> = [
    { mood: 'very-happy', label: 'Very Happy' },
    { mood: 'happy', label: 'Happy' },
    { mood: 'neutral', label: 'Neutral' },
    { mood: 'sad', label: 'Sad' },
    { mood: 'very-sad', label: 'Very Sad' },
    { mood: 'anxious', label: 'Anxious' },
    { mood: 'stressed', label: 'Stressed' },
  ];

  if (showAddMood) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">How are you feeling?</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {moods.map(({ mood, label }) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedMood === mood
                    ? 'border-purple-500 bg-purple-50 scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-2">{getMoodEmoji(mood)}</div>
                <div className="text-sm font-medium text-gray-700">{label}</div>
              </button>
            ))}
          </div>

          {selectedMood && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intensity (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-2xl font-bold text-purple-600">{intensity}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-900 font-medium placeholder:text-gray-400"
                  rows={3}
                  placeholder="What's on your mind?"
                />
              </div>
            </>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowAddMood(false);
                setSelectedMood(null);
                setIntensity(5);
                setNote('');
              }}
              className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMood}
              disabled={!selectedMood}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4">
      <div className="max-w-6xl mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Moodify</h1>
            <p className="text-gray-600">Track your emotional journey</p>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-3 bg-purple-100 rounded-xl hover:bg-purple-200 transition-colors"
          >
            <Menu className="w-6 h-6 text-purple-600" />
          </button>
        </div>

        {showMenu && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-3">
            <button
              onClick={onTakeAssessment}
              className="w-full p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-800">Take Assessment</div>
                  <div className="text-sm text-gray-600">Check your mental wellbeing</div>
                </div>
              </div>
            </button>
            <button
              onClick={onSettings}
              className="w-full p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-purple-600" />
                <div>
                  <div className="font-semibold text-gray-800">Settings</div>
                  <div className="text-sm text-gray-600">Manage your data and preferences</div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Entries</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalEntries}</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Last 7 Days</p>
                <p className="text-3xl font-bold text-gray-800">{stats.last7DaysEntries}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-pink-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Most Common</p>
                <p className="text-3xl">{stats.mostCommonMood ? getMoodEmoji(stats.mostCommonMood) : '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mood Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI Analysis */}
        <AIAnalysis appState={appState} />

        {/* Daily Check-ins */}
        {appState.dailyCheckIns && appState.dailyCheckIns.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MessageCircle className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Daily Reflections</h2>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[...appState.dailyCheckIns]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
                  >
                    <div className="flex items-start space-x-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-800">{checkIn.question}</p>
                    </div>
                    <p className="text-sm text-gray-700 ml-6 italic">&ldquo;{checkIn.answer}&rdquo;</p>
                    <p className="text-xs text-gray-500 ml-6 mt-1">{formatDate(checkIn.createdAt)}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent Entries */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Entries</h2>
            <button
              onClick={() => setShowAddMood(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Add Mood</span>
            </button>
          </div>

          {appState.moodHistory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No mood entries yet</p>
              <button
                onClick={() => setShowAddMood(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Add Your First Entry
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[...appState.moodHistory]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="text-3xl">{getMoodEmoji(entry.mood)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-800 capitalize">
                            {entry.mood.replace('-', ' ')}
                          </span>
                          <span className="text-sm text-gray-600">• Intensity: {entry.intensity}/10</span>
                        </div>
                        <p className="text-sm text-gray-600">{formatDate(entry.createdAt)}</p>
                        {entry.note && (
                          <p className="text-sm text-gray-700 mt-1 italic">{entry.note}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteMood(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Daily Check-in Modal */}
      {showDailyCheckIn && (
        <DailyCheckIn
          onClose={() => setShowDailyCheckIn(false)}
          onSubmit={handleDailyCheckInSubmit}
        />
      )}
    </div>
  );
}
