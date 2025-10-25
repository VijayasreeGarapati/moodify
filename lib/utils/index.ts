import { Assessment } from '../types';

// Calculate assessment score based on responses
export function calculateAssessmentScore(responses: any[]): { score: number; category: 'excellent' | 'good' | 'fair' | 'needs-attention' } {
  // Simple scoring logic - can be customized
  const totalScore = responses.reduce((acc, response) => {
    if (typeof response.answer === 'number') {
      return acc + response.answer;
    }
    return acc;
  }, 0);

  const averageScore = totalScore / responses.length;

  let category: 'excellent' | 'good' | 'fair' | 'needs-attention';
  if (averageScore >= 8) {
    category = 'excellent';
  } else if (averageScore >= 6) {
    category = 'good';
  } else if (averageScore >= 4) {
    category = 'fair';
  } else {
    category = 'needs-attention';
  }

  return { score: averageScore, category };
}

// Hash PIN for storage (simple hashing - in production, use proper crypto)
export function hashPIN(pin: string): string {
  // Simple hash for demo - use crypto.subtle.digest in production
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Verify PIN
export function verifyPIN(pin: string, hashedPIN: string): boolean {
  return hashPIN(pin) === hashedPIN;
}

// Format date for display
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Get mood emoji
export function getMoodEmoji(mood: string): string {
  const emojiMap: Record<string, string> = {
    'very-happy': '😄',
    'happy': '🙂',
    'neutral': '😐',
    'sad': '😔',
    'very-sad': '😢',
    'anxious': '😰',
    'stressed': '😫',
  };
  return emojiMap[mood] || '🙂';
}

// Get mood color for charts
export function getMoodColor(mood: string): string {
  const colorMap: Record<string, string> = {
    'very-happy': '#10b981',
    'happy': '#34d399',
    'neutral': '#fbbf24',
    'sad': '#f59e0b',
    'very-sad': '#ef4444',
    'anxious': '#8b5cf6',
    'stressed': '#ec4899',
  };
  return colorMap[mood] || '#6b7280';
}

// Fun facts for teenagers
export const funFacts = [
  "Your brain doesn't finish developing until you're about 25 years old. The teenage years are crucial for building healthy habits!",
  "Laughing for 10-15 minutes can burn up to 40 calories and boost your mood instantly.",
  "Listening to music you love releases dopamine, the same 'feel-good' chemical released when you eat your favorite food.",
  "Spending time in nature for just 20 minutes can significantly reduce stress hormones.",
  "Writing down three things you're grateful for each day can improve your overall happiness by 25%.",
  "Getting 8-10 hours of sleep improves memory, mood, and even athletic performance.",
  "Exercise doesn't just help your body - it's one of the most effective treatments for anxiety and depression.",
  "Talking to someone you trust about your feelings can literally reduce the physical stress response in your body.",
];

// Get random fun fact
export function getRandomFunFact(): string {
  return funFacts[Math.floor(Math.random() * funFacts.length)];
}
