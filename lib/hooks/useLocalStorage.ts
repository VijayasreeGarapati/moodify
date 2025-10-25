'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Merge with initial value to ensure all new fields exist
        return typeof initialValue === 'object' && initialValue !== null
          ? { ...initialValue, ...parsed }
          : parsed;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}

// Hook to manage data retention (3 months max)
export function useDataRetention() {
  const cleanOldData = () => {
    if (typeof window === 'undefined') return;

    try {
      const appStateStr = window.localStorage.getItem('moodify-app-state');
      if (!appStateStr) return;

      const appState = JSON.parse(appStateStr);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      // Clean old mood entries
      if (appState.moodHistory) {
        appState.moodHistory = appState.moodHistory.filter((entry: any) => {
          const entryDate = new Date(entry.createdAt);
          return entryDate >= threeMonthsAgo;
        });
      }

      // Clean old assessments
      if (appState.assessmentHistory) {
        appState.assessmentHistory = appState.assessmentHistory.filter((assessment: any) => {
          const assessmentDate = new Date(assessment.completedAt);
          return assessmentDate >= threeMonthsAgo;
        });
      }

      window.localStorage.setItem('moodify-app-state', JSON.stringify(appState));
    } catch (error) {
      console.error('Error cleaning old data:', error);
    }
  };

  useEffect(() => {
    cleanOldData();
    // Run cleanup daily
    const interval = setInterval(cleanOldData, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
}

// Hook to completely clear all app data
export function useClearAllData() {
  return () => {
    if (typeof window === 'undefined') return;

    const keysToRemove = [
      'moodify-user-profile',
      'moodify-pin',
      'moodify-app-state',
    ];

    keysToRemove.forEach(key => {
      window.localStorage.removeItem(key);
    });
  };
}
