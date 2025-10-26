'use client';

import { useState, useMemo, useEffect } from 'react';
import { MoodEntry, AppState, DailyCheckIn as DailyCheckInType, Assessment } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, Calendar, Trash2, Settings, Menu, MessageCircle, ClipboardList, Brain, RefreshCw, Info, Heart } from 'lucide-react';
import { getMoodEmoji, getMoodColor, formatDate } from '@/lib/utils';
import DailyCheckIn from './DailyCheckIn';

// Questions from the questionnaire
const QUESTIONNAIRE_QUESTIONS = [
  { id: 'q1', question: 'Over the past two weeks, how often have you felt happy or content?' },
  { id: 'q2', question: 'How would you rate your stress level lately?' },
  { id: 'q3', question: 'How well have you been sleeping?', options: ['Very well', 'Pretty well', 'Not great', 'Poorly', 'Very poorly'] },
  { id: 'q4', question: 'Do you feel like you have someone to talk to when you need support?' },
  { id: 'q5', question: 'How often do you feel overwhelmed by school, work, or daily responsibilities?', options: ['Rarely or never', 'Sometimes', 'Often', 'Most of the time', 'Always'] },
  { id: 'q6', question: 'How satisfied are you with your social connections and friendships?' },
  { id: 'q7', question: 'Have you been able to enjoy your hobbies or activities lately?' },
  { id: 'q8', question: 'How confident do you feel about handling challenges in your life?' },
];

interface DashboardScreenProps {
  appState: AppState;
  onAddMood: (mood: MoodEntry) => void;
  onDeleteMood: (id: string) => void;
  onTakeAssessment: () => void;
  onSettings: () => void;
  onDailyCheckIn: (checkIn: DailyCheckInType) => void;
  onResources: () => void;
}

export default function DashboardScreen({
  appState,
  onAddMood,
  onDeleteMood,
  onTakeAssessment,
  onSettings,
  onDailyCheckIn,
  onResources,
}: DashboardScreenProps) {
  const [showAddMood, setShowAddMood] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowMenu(false);
    }
  };

  // Generate AI Analysis
  const generateAnalysis = async () => {
    try {
      setIsLoadingAnalysis(true);
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

      // Scroll to analysis section
      setTimeout(() => {
        scrollToSection('ai-analysis');
      }, 100);
    } catch (err) {
      setAnalysis('Unable to generate analysis right now. Please try again later.');
      setHasAnalysis(true);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-3 sm:p-4 pb-24 xl:pb-8">
      <div className="max-w-6xl mx-auto py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/moodify-logo.svg"
                alt="Moodify Logo"
                className="w-12 h-12 sm:w-14 sm:h-14"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Moodify</h1>
                <p className="text-sm sm:text-base text-gray-600">Track your emotional journey</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button
                onClick={() => setShowAddMood(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-md touch-manipulation"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-xs sm:text-sm">Add Mood</span>
              </button>

              <button
                onClick={onTakeAssessment}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white font-medium rounded-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-md touch-manipulation"
              >
                <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-xs sm:text-sm">Assessment</span>
              </button>

              <div className="relative group">
                <button
                  onClick={generateAnalysis}
                  disabled={appState.moodHistory.length < 3 || isLoadingAnalysis}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 touch-manipulation"
                >
                  {isLoadingAnalysis ? (
                    <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                  ) : (
                    <Brain className="w-4 h-4" strokeWidth={2.5} />
                  )}
                  <span className="text-xs sm:text-sm">{isLoadingAnalysis ? 'Analyzing...' : 'AI Insights'}</span>
                  {appState.moodHistory.length < 3 && (
                    <Info className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
                  )}
                </button>
                {appState.moodHistory.length < 3 && (
                  <div className="absolute top-full mt-2 right-0 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-xl">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p>Add at least 3 mood entries to unlock AI-powered insights and personalized recommendations.</p>
                    </div>
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 sm:p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg hover:from-purple-200 hover:to-pink-200 active:scale-95 transition-all duration-200 hover:shadow-md touch-manipulation"
              >
                <Menu className="w-5 h-5 text-purple-700" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {showMenu && (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 space-y-2 sm:space-y-3">
            {/* View Section Buttons */}
            {hasAnalysis && (
              <button
                onClick={() => scrollToSection('ai-analysis')}
                className="w-full p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-6 h-6 text-orange-600" />
                    <div>
                      <div className="font-semibold text-gray-800">View AI Insights</div>
                      <div className="text-sm text-gray-600">Personalized mood analysis</div>
                    </div>
                  </div>
                </div>
              </button>
            )}

            {appState.assessmentHistory.length > 0 && (
              <button
                onClick={() => scrollToSection('assessment-history')}
                className="w-full p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ClipboardList className="w-6 h-6 text-indigo-600" />
                    <div>
                      <div className="font-semibold text-gray-800">View Assessment History</div>
                      <div className="text-sm text-gray-600">{appState.assessmentHistory.length} assessment{appState.assessmentHistory.length > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </div>
              </button>
            )}

            {appState.dailyCheckIns && appState.dailyCheckIns.length > 0 && (
              <button
                onClick={() => scrollToSection('daily-reflections')}
                className="w-full p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-6 h-6 text-pink-600" />
                    <div>
                      <div className="font-semibold text-gray-800">View Daily Reflections</div>
                      <div className="text-sm text-gray-600">{appState.dailyCheckIns.length} reflection{appState.dailyCheckIns.length > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </div>
              </button>
            )}

            {appState.moodHistory.length > 0 && (
              <button
                onClick={() => scrollToSection('mood-entries')}
                className="w-full p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-orange-600" />
                    <div>
                      <div className="font-semibold text-gray-800">View Mood Entries</div>
                      <div className="text-sm text-gray-600">{appState.moodHistory.length} entr{appState.moodHistory.length > 1 ? 'ies' : 'y'}</div>
                    </div>
                  </div>
                </div>
              </button>
            )}

            <button
              onClick={onResources}
              className="w-full p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-pink-600" />
                <div>
                  <div className="font-semibold text-gray-800">Support Resources</div>
                  <div className="text-sm text-gray-600">Hotlines, helplines, and mental health resources</div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Entries</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalEntries}</p>
              </div>
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Last 7 Days</p>
                <p className="text-3xl font-bold text-gray-800">{stats.last7DaysEntries}</p>
              </div>
              <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-pink-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
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
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Mood Trend</h2>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
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
        {hasAnalysis && (
          <div id="ai-analysis" className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">AI Insights</h3>
                  <p className="text-sm text-gray-600">Personalized for you</p>
                </div>
              </div>
              <button
                onClick={generateAnalysis}
                disabled={isLoadingAnalysis}
                className="p-2 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh analysis"
              >
                <RefreshCw className={`w-5 h-5 text-orange-600 ${isLoadingAnalysis ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl p-6 border-2 border-orange-200">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{analysis}</p>
            </div>

            <p className="text-xs text-gray-500 text-center">
              AI analysis is based on your recent mood entries and assessment results
            </p>
          </div>
        )}

        {/* Assessment History */}
        {appState.assessmentHistory && appState.assessmentHistory.length > 0 && (
          <div id="assessment-history" className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ClipboardList className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Assessment History</h2>
            </div>
            <div className="space-y-4">
              {[...appState.assessmentHistory]
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .map((assessment) => (
                  <div
                    key={assessment.id}
                    className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          assessment.category === 'excellent' ? 'bg-green-100 text-green-700' :
                          assessment.category === 'good' ? 'bg-blue-100 text-blue-700' :
                          assessment.category === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {assessment.category.charAt(0).toUpperCase() + assessment.category.slice(1)}
                        </div>
                        <span className="text-sm text-gray-600">Score: {assessment.score}</span>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(assessment.completedAt)}</span>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {assessment.responses.map((response) => {
                        const question = QUESTIONNAIRE_QUESTIONS.find(q => q.id === response.questionId);
                        let answerText = response.answer.toString();

                        // Format answer based on question type
                        if (question?.options && typeof response.answer === 'number') {
                          answerText = question.options[response.answer - 1] || response.answer.toString();
                        } else if (typeof response.answer === 'string' && (response.answer === 'yes' || response.answer === 'no')) {
                          answerText = response.answer.charAt(0).toUpperCase() + response.answer.slice(1);
                        } else if (typeof response.answer === 'number' && !question?.options) {
                          answerText = `${response.answer}/10`;
                        }

                        return (
                          <div key={response.questionId} className="bg-white p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-800 mb-1">{question?.question}</p>
                            <p className="text-sm text-purple-700 font-semibold">{answerText}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Daily Check-ins */}
        {appState.dailyCheckIns && appState.dailyCheckIns.length > 0 && (
          <div id="daily-reflections" className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">
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
        <div id="mood-entries" className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Mood Entries</h2>
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

      {/* Add Mood Modal */}
      {showAddMood && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-500/95 via-pink-500/95 to-orange-400/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto">
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
      )}
    </div>
  );
}
