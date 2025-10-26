'use client';

import { useEffect, useState } from 'react';
import { useLocalStorage, useDataRetention, useClearAllData } from '@/lib/hooks/useLocalStorage';
import { UserProfile, AppState, MoodEntry, QuestionnaireResponse, Assessment, PINData, DailyCheckIn } from '@/lib/types';
import { calculateAssessmentScore } from '@/lib/utils';
import { supabaseAPI } from '@/lib/supabase/api';
import WelcomeScreen from '@/components/welcome/WelcomeScreen';
import PINVerification from '@/components/welcome/PINVerification';
import OnboardingScreen from '@/components/onboarding/OnboardingScreen';
import FunFactScreen from '@/components/shared/FunFactScreen';
import QuestionnaireScreen from '@/components/questionnaire/QuestionnaireScreen';
import ResultsScreen from '@/components/results/ResultsScreen';
import DashboardScreen from '@/components/dashboard/DashboardScreen';
import SettingsScreen from '@/components/feedback/SettingsScreen';
import ResourcesScreen from '@/components/resources/ResourcesScreen';
import ResourcesModal from '@/components/resources/ResourcesModal';
import FloatingResourcesButton from '@/components/resources/FloatingResourcesButton';
import CrisisButton from '@/components/resources/CrisisButton';

type AppScreen =
  | 'pin-verification'
  | 'welcome'
  | 'onboarding'
  | 'fun-fact'
  | 'questionnaire'
  | 'results'
  | 'dashboard'
  | 'settings'
  | 'resources';

export default function Home() {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('moodify-user-profile', null);
  const [pinData, setPinData] = useLocalStorage<PINData | null>('moodify-pin', null);
  const [appState, setAppState] = useLocalStorage<AppState>('moodify-app-state', {
    hasCompletedOnboarding: false,
    hasSeenWelcome: false,
    assessmentHistory: [],
    moodHistory: [],
    dailyCheckIns: [],
  });

  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [currentQuestionnaireResponses, setCurrentQuestionnaireResponses] = useState<QuestionnaireResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPINVerified, setIsPINVerified] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  const clearAllData = useClearAllData();
  useDataRetention();

  // Determine initial screen based on stored data (ONLY on mount)
  useEffect(() => {
    if (!userProfile || !appState.hasCompletedOnboarding) {
      // New user - show welcome
      setCurrentScreen('welcome');
    } else if (pinData && !isPINVerified) {
      // Returning user with PIN - verify first
      setCurrentScreen('pin-verification');
    } else {
      // Returning user without PIN OR PIN already verified
      setCurrentScreen('dashboard');
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleWelcomeComplete = (hasConsented: boolean, hasPIN: boolean, pin?: string) => {
    if (pin) {
      setPinData({
        pin,
        createdAt: new Date().toISOString(),
      });
    }

    setAppState(prev => ({
      ...prev,
      hasSeenWelcome: true,
    }));

    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = async (profile: Omit<UserProfile, 'hasConsented' | 'consentDate' | 'hasPIN'>) => {
    const fullProfile: UserProfile = {
      ...profile,
      hasConsented: true,
      consentDate: new Date().toISOString(),
      hasPIN: !!pinData,
    };

    // Save to localStorage
    setUserProfile(fullProfile);

    // Optionally save user profile to database for record keeping
    try {
      await supabaseAPI.createUser(fullProfile);
      console.log('User profile saved to database');
    } catch (error) {
      console.error('Failed to save user profile to database:', error);
      // Continue with localStorage only - app still works offline
    }

    setCurrentScreen('fun-fact');
  };

  const handleFunFactContinue = () => {
    setCurrentScreen('questionnaire');
  };

  const handleQuestionnaireComplete = async (responses: QuestionnaireResponse[]) => {
    setCurrentQuestionnaireResponses(responses);

    const { score, category } = calculateAssessmentScore(responses);

    const assessment: Assessment = {
      id: Date.now().toString(),
      responses,
      completedAt: new Date().toISOString(),
      score,
      category,
    };

    // Save to localStorage
    setAppState(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      lastAssessmentDate: new Date().toISOString(),
      assessmentHistory: [...prev.assessmentHistory, assessment],
    }));

    // Save to Supabase database with demographics
    if (userProfile) {
      try {
        await supabaseAPI.saveAssessment(userProfile, assessment);
        console.log('Assessment saved to database');
      } catch (error) {
        console.error('Failed to save assessment to database:', error);
      }
    }

    setCurrentScreen('results');
  };

  const handleResultsContinue = () => {
    setCurrentScreen('dashboard');
  };

  const handleAddMood = async (mood: MoodEntry) => {
    // Save to localStorage
    setAppState(prev => ({
      ...prev,
      moodHistory: [...prev.moodHistory, mood],
    }));

    // Save to Supabase database with demographics
    if (userProfile) {
      try {
        await supabaseAPI.saveMood(userProfile, mood);
        console.log('Mood saved to database');
      } catch (error) {
        console.error('Failed to save mood to database:', error);
      }
    }
  };

  const handleDeleteMood = async (id: string) => {
    // Delete from localStorage only
    // Database keeps all data for analytics purposes
    setAppState(prev => ({
      ...prev,
      moodHistory: prev.moodHistory.filter(entry => entry.id !== id),
    }));
  };

  const handleDailyCheckIn = async (checkIn: DailyCheckIn) => {
    // Save to localStorage
    setAppState(prev => ({
      ...prev,
      dailyCheckIns: [...(prev.dailyCheckIns || []), checkIn],
      lastCheckInDate: new Date().toISOString(),
    }));

    // Save to Supabase database with demographics
    if (userProfile) {
      try {
        await supabaseAPI.saveCheckIn(userProfile, checkIn);
        console.log('Daily check-in saved to database');
      } catch (error) {
        console.error('Failed to save check-in to database:', error);
      }
    }
  };

  const handleTakeAssessment = () => {
    setCurrentScreen('fun-fact');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleCloseSettings = () => {
    setCurrentScreen('dashboard');
  };

  const handleDeleteAllData = () => {
    clearAllData();
    setUserProfile(null);
    setPinData(null);
    setIsPINVerified(false);
    setAppState({
      hasCompletedOnboarding: false,
      hasSeenWelcome: false,
      assessmentHistory: [],
      moodHistory: [],
      dailyCheckIns: [],
    });
    setCurrentScreen('welcome');
  };

  const handlePINVerified = () => {
    setIsPINVerified(true);
    setCurrentScreen('dashboard');
  };

  const handleOpenResources = () => {
    setCurrentScreen('resources');
  };

  const handleCloseResources = () => {
    setCurrentScreen('dashboard');
  };

  const handleOpenResourcesModal = () => {
    setIsResourcesModalOpen(true);
  };

  const handleCloseResourcesModal = () => {
    setIsResourcesModalOpen(false);
  };

  const handleOpenCrisisModal = () => {
    setIsCrisisModalOpen(true);
  };

  const handleCloseCrisisModal = () => {
    setIsCrisisModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  // Show floating button on all screens
  const showFloatingButton = true;

  return (
    <>
      {currentScreen === 'pin-verification' && pinData && (
        <PINVerification
          storedPIN={pinData.pin}
          onSuccess={handlePINVerified}
          onForgotPIN={handleDeleteAllData}
        />
      )}

      {currentScreen === 'welcome' && (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      )}

      {currentScreen === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {currentScreen === 'fun-fact' && (
        <FunFactScreen onContinue={handleFunFactContinue} />
      )}

      {currentScreen === 'questionnaire' && (
        <QuestionnaireScreen onComplete={handleQuestionnaireComplete} />
      )}

      {currentScreen === 'results' && (
        <ResultsScreen
          responses={currentQuestionnaireResponses}
          onContinue={handleResultsContinue}
        />
      )}

      {currentScreen === 'dashboard' && userProfile && (
        <DashboardScreen
          appState={appState}
          onAddMood={handleAddMood}
          onDeleteMood={handleDeleteMood}
          onTakeAssessment={handleTakeAssessment}
          onSettings={handleOpenSettings}
          onDailyCheckIn={handleDailyCheckIn}
          onResources={handleOpenResources}
        />
      )}

      {currentScreen === 'settings' && userProfile && (
        <SettingsScreen
          userProfile={userProfile}
          onClose={handleCloseSettings}
          onDeleteAllData={handleDeleteAllData}
        />
      )}

      {currentScreen === 'resources' && (
        <ResourcesScreen onClose={handleCloseResources} />
      )}

      {/* Fixed Bottom Action Bar with Resources and Crisis Buttons */}
      {showFloatingButton && (
        <FloatingResourcesButton
          onResourcesClick={handleOpenResourcesModal}
          onCrisisClick={handleOpenCrisisModal}
        />
      )}

      {/* Resources Modal */}
      <ResourcesModal
        isOpen={isResourcesModalOpen}
        onClose={handleCloseResourcesModal}
      />

      {/* Crisis Modal */}
      <CrisisButton
        isOpen={isCrisisModalOpen}
        onClose={handleCloseCrisisModal}
      />
    </>
  );
}
