import { supabase, isSupabaseConfigured } from './client';
import type { UserProfile, MoodEntry, Assessment, DailyCheckIn } from '@/lib/types';

export const supabaseAPI = {
  // Check if Supabase is available
  isAvailable: isSupabaseConfigured,

  // Create user and return ID
  async createUser(profile: UserProfile): Promise<string | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping database save');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          age: profile.age,
          sex: profile.sex,
          city: profile.city,
          zip_code: profile.zipCode,
          school: profile.school || null,
          has_consented: profile.hasConsented,
          consent_date: profile.consentDate,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Supabase error creating user:', error);
        return null;
      }

      return data?.id || null;
    } catch (err) {
      console.error('Error creating user in Supabase:', err);
      return null;
    }
  },

  // Save mood entry with demographics
  async saveMood(profile: UserProfile, mood: MoodEntry): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping database save');
      return false;
    }

    try {
      const { error } = await supabase
        .from('moods')
        .insert({
          age: profile.age,
          sex: profile.sex,
          city: profile.city,
          zip_code: profile.zipCode,
          school: profile.school || null,
          mood: mood.mood,
          intensity: mood.intensity,
          note: mood.note || null,
          created_at: mood.createdAt,
        });

      if (error) {
        console.error('Supabase error saving mood:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error saving mood to Supabase:', err);
      return false;
    }
  },

  // Save assessment with demographics
  async saveAssessment(profile: UserProfile, assessment: Assessment): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping database save');
      return false;
    }

    try {
      const { error } = await supabase
        .from('assessments')
        .insert({
          age: profile.age,
          sex: profile.sex,
          city: profile.city,
          zip_code: profile.zipCode,
          school: profile.school || null,
          score: assessment.score,
          category: assessment.category,
          responses: assessment.responses,
          completed_at: assessment.completedAt,
        });

      if (error) {
        console.error('Supabase error saving assessment:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error saving assessment to Supabase:', err);
      return false;
    }
  },

  // Save daily check-in with demographics
  async saveCheckIn(profile: UserProfile, checkIn: DailyCheckIn): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping database save');
      return false;
    }

    try {
      const { error } = await supabase
        .from('daily_checkins')
        .insert({
          age: profile.age,
          sex: profile.sex,
          city: profile.city,
          zip_code: profile.zipCode,
          school: profile.school || null,
          question: checkIn.question,
          answer: checkIn.answer,
          created_at: checkIn.createdAt,
        });

      if (error) {
        console.error('Supabase error saving check-in:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error saving check-in to Supabase:', err);
      return false;
    }
  },

  // Note: We don't delete from database for analytics purposes
  // Data is kept permanently for research and analysis
  // Deletion only happens in localStorage (user's device)

  // Analytics: Get mood trends (for future analytics dashboard)
  async getMoodTrends(days = 30) {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('moods')
        .select('mood, created_at')
        .gte('created_at', startDate);

      if (error) {
        console.error('Supabase error fetching mood trends:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching mood trends from Supabase:', err);
      return [];
    }
  },

  // Analytics: Get demographics (anonymized)
  async getDemographics() {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('age, sex, city, zip_code');

      if (error) {
        console.error('Supabase error fetching demographics:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching demographics from Supabase:', err);
      return [];
    }
  },
};
