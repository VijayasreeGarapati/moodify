# Moodify

A safe, privacy-focused mental health companion app for teenagers to track their emotions and wellbeing.

## Overview

Moodify is designed to provide teenagers with a safe space to understand and track their emotions. The app emphasizes privacy by storing all data locally on the user's device, ensuring that personal information never leaves their control.

## Features

### Core Features
- **Privacy-First Design**: All data stored locally using browser localStorage
- **Age Verification**: Minimum age requirement of 13 years
- **Optional PIN Protection**: Secure your data with a personal PIN
- **Mental Health Assessment**: 8-question questionnaire to evaluate emotional wellbeing
- **Mood Tracking**: Log daily moods with intensity levels and notes
- **Visual Analytics**: Charts and statistics showing mood trends over time
- **AI-Powered Daily Check-ins**: Gemini AI generates personalized reflection questions daily
- **AI Mood Analysis**: Get intelligent insights and recommendations based on your mood patterns
- **Auto Data Cleanup**: Automatically removes data older than 3 months
- **Complete Data Control**: Users can delete all their data at any time

### Screens

1. **Welcome & Consent**: Age verification, privacy policy, and optional PIN setup
2. **Onboarding**: Collect basic user information (age, sex, location, optional school)
3. **Fun Facts**: Educational mental health facts before assessment
4. **Questionnaire**: 8 questions covering mood, stress, sleep, social connections, and coping
5. **Results**: Personalized recommendations and crisis/support resources
6. **Dashboard**: Main hub for tracking moods with charts and history
7. **Settings**: Manage profile, view security settings, send feedback, delete data

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Google Gemini API (gemini-1.5-flash model)
- **Storage**: Browser localStorage (client-side only)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moodify
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Gemini API key:
   - Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Copy `.env.local.example` to `.env.local`
   - Add your API key to `.env.local`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
moodify/
├── app/
│   ├── api/
│   │   ├── daily-checkin/
│   │   │   └── route.ts       # AI daily question generation
│   │   └── analyze-mood/
│   │       └── route.ts       # AI mood analysis
│   ├── page.tsx               # Main app with state management & screen routing
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles with Tailwind
│
├── components/
│   ├── welcome/
│   │   └── WelcomeScreen.tsx  # Age verification, consent, PIN setup
│   ├── onboarding/
│   │   └── OnboardingScreen.tsx # User profile collection
│   ├── shared/
│   │   └── FunFactScreen.tsx  # Mental health facts
│   ├── questionnaire/
│   │   └── QuestionnaireScreen.tsx # 8-question assessment
│   ├── results/
│   │   └── ResultsScreen.tsx  # Results, resources, healthy habits
│   ├── dashboard/
│   │   ├── DashboardScreen.tsx # Main dashboard with mood tracking
│   │   ├── DailyCheckIn.tsx   # AI-powered daily check-in modal
│   │   └── AIAnalysis.tsx     # AI mood insights component
│   └── feedback/
│       └── SettingsScreen.tsx # Profile, feedback, data management
│
├── lib/
│   ├── hooks/
│   │   └── useLocalStorage.ts # Custom hooks for localStorage persistence
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces & types
│   └── utils/
│       └── index.ts           # Helper functions (scoring, formatting, etc.)
│
├── .env.local.example         # Example environment variables
├── .env.local                 # Your Gemini API key (gitignored)
└── public/                    # Static assets
```

## How Local Storage Works

All user data is stored in the browser's localStorage using three keys:

1. **moodify-user-profile**: User profile (age, sex, city, zip, school, consent)
2. **moodify-pin**: Hashed PIN for security (if enabled)
3. **moodify-app-state**: All app data including:
   - `moodHistory[]`: All mood entries with timestamps
   - `assessmentHistory[]`: Questionnaire results
   - `dailyCheckIns[]`: AI check-in questions and answers
   - `lastCheckInDate`: Timestamp of last check-in
   - Onboarding status flags

**Data Lifecycle:**
- Data persists across browser sessions
- Automatically cleaned after 3 months (runs daily)
- User can delete all data instantly from Settings
- No data ever sent to external servers (except AI API calls for analysis)

## Privacy & Security

- **100% Local Storage**: All personal data stays on your device
- **No Server Storage**: No databases, no cloud storage, no data collection
- **No Analytics**: User actions are never tracked or logged
- **AI Privacy**: Only anonymous mood patterns sent to AI (no personal info)
- **Optional PIN**: 4+ digit PIN protection with local hashing
- **Auto Cleanup**: Data older than 3 months automatically removed
- **Full Control**: Delete all data anytime from Settings
- **Open Source**: Code is transparent and auditable

## AI Features (Gemini Integration)

Moodify uses Google's Gemini AI (gemini-1.5-flash model) for personalized mental health support:

### 1. Daily Check-ins (`/api/daily-checkin`)

**What it does:** Generates unique, thoughtful reflection questions each day

**How it works:**
- Appears automatically 2 seconds after opening dashboard (once per day)
- AI creates teen-friendly questions focused on emotional awareness
- User can answer with text or skip
- Responses saved locally in `dailyCheckIns` array
- Falls back to curated questions if AI unavailable

**Privacy:** Only generic user context sent to AI, no personal information

**Example Questions:**
- "What's one thing that made you smile today?"
- "How satisfied are you with your social connections right now?"
- "What's something you're proud of this week?"

### 2. AI Mood Analysis (`/api/analyze-mood`)

**What it does:** Analyzes mood patterns and provides personalized insights

**How it works:**
- Button appears on dashboard: "Generate Analysis"
- Requires minimum 3 mood entries
- Sends last 14 mood entries + latest assessment to AI
- Returns 3-4 sentence analysis with:
  - Pattern identification
  - 2-3 actionable suggestions
  - Positive reinforcement
  - Supportive, non-clinical language

**Privacy:** Only mood types, intensities, and assessment category sent - no notes or personal details

**Refresh:** Click refresh icon to regenerate analysis

### API Configuration

**Required Environment Variable:**
```bash
GEMINI_API_KEY=your_key_here
```

**Get API Key:** https://aistudio.google.com/app/apikey (free tier available)

**Rate Limits:** Default Gemini free tier limits apply

**Fallback Behavior:**
- Daily check-ins: Uses 8 curated fallback questions
- Mood analysis: Shows generic supportive message
- App remains fully functional without API key

## Mental Health Resources

The app provides links to important mental health resources including:
- 988 Suicide & Crisis Lifeline
- Crisis Text Line (text HOME to 741741)
- Teen Line
- Psychology Today therapist directory
- Self-help resources and apps

## Testing the App

### Complete User Flow

#### First Time Users:
1. **Start app:** `npm run dev` → http://localhost:3000
2. **Welcome Screen:**
   - Check age 13+ verification
   - Accept consent
   - Set up PIN (optional) - try 4+ digits
3. **Onboarding:**
   - Enter age, sex, city, zip code
   - Optionally add school
4. **Fun Fact:** Read mental health fact
5. **Questionnaire:** Answer 8 questions (mix of scale, multiple choice, yes/no)
6. **Results:** View personalized insights and resources
7. **Dashboard:**
   - Wait 2 seconds → Daily check-in modal appears (AI-generated question)
   - Add mood entries (7 mood types + intensity + optional note)
   - View mood chart (appears after 1+ entries)
   - Generate AI Analysis (requires 3+ mood entries)
   - Check statistics (total entries, last 7 days, most common mood)
8. **Settings:**
   - View profile info
   - Send feedback
   - Delete all data (test data cleanup)

#### Returning Users:
1. **Start app:** Open http://localhost:3000
2. **PIN Verification (if set):**
   - Enter your PIN to unlock
   - 3 attempts allowed
   - Option to reset all data if forgotten
3. **Dashboard:** Continues from where you left off

### Testing AI Features

**Daily Check-in:**
- Should only appear once per day
- Check localStorage → `lastCheckInDate` should update
- Refresh page same day → modal shouldn't appear
- Change date or clear `lastCheckInDate` → modal appears again

**AI Analysis:**
- Add 3+ mood entries
- Click "Generate Analysis" button
- Wait ~2-5 seconds for response
- Click refresh icon to regenerate
- Test without API key → fallback message should appear

### Browser DevTools Testing

```javascript
// View localStorage data
localStorage.getItem('moodify-app-state')
localStorage.getItem('moodify-user-profile')

// Clear all data
localStorage.clear()

// Manually trigger check-in (set date to yesterday)
const state = JSON.parse(localStorage.getItem('moodify-app-state'));
state.lastCheckInDate = '2024-01-01';
localStorage.setItem('moodify-app-state', JSON.stringify(state));
```

## Development Notes

### Key Hooks

- **useLocalStorage**: Syncs state with localStorage, returns `[value, setValue, removeValue]`
- **useDataRetention**: Runs daily cleanup of data older than 3 months
- **useClearAllData**: Removes all localStorage keys (Settings → Delete All Data)

### Screen Flow

```
Welcome → Onboarding → Fun Fact → Questionnaire → Results → Dashboard
                                                              ↓
                                                          Settings
```

### Data Models (TypeScript)

```typescript
interface UserProfile {
  age: number;
  sex: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  city: string;
  zipCode: string;
  school?: string;
  hasConsented: boolean;
  consentDate: string;
  hasPIN: boolean;
}

interface MoodEntry {
  id: string;
  mood: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad' | 'anxious' | 'stressed';
  intensity: number; // 1-10
  note?: string;
  createdAt: string; // ISO 8601
}

interface Assessment {
  id: string;
  responses: QuestionnaireResponse[];
  completedAt: string;
  score: number;
  category: 'excellent' | 'good' | 'fair' | 'needs-attention';
}

interface DailyCheckIn {
  id: string;
  question: string;  // AI-generated or fallback
  answer: string;
  createdAt: string;
}

interface AppState {
  hasCompletedOnboarding: boolean;
  hasSeenWelcome: boolean;
  lastAssessmentDate?: string;
  lastCheckInDate?: string;
  assessmentHistory: Assessment[];
  moodHistory: MoodEntry[];
  dailyCheckIns: DailyCheckIn[];
}
```

## Troubleshooting

### Daily Check-in Not Appearing
- ✓ Completed onboarding?
- ✓ Already checked in today? (Check `lastCheckInDate` in localStorage)
- ✓ Waited 2 seconds after dashboard loads?

### AI Features Not Working
- ✓ Valid `GEMINI_API_KEY` in `.env.local`?
- ✓ Restarted dev server after adding API key?
- ✓ Check browser console for API errors
- ✓ Fallback messages should appear if API fails

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Data Not Persisting
- ✓ Check browser's localStorage is enabled
- ✓ Not in incognito/private mode?
- ✓ Check browser console for storage quota errors

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
npm run dev -- -p 3001
```

## Contributing

This is a mental health app for teenagers. When contributing:
1. Prioritize user privacy and data security
2. Ensure all UI is teen-friendly and accessible
3. Follow evidence-based mental health practices
4. Test thoroughly on multiple devices
5. Maintain the local-only storage approach

## Important Notes

- This app is NOT a replacement for professional mental health care
- In crisis situations, users should contact emergency services or crisis hotlines
- The app provides educational content and self-tracking tools only
- Consult mental health professionals when developing assessment questions

## License

[Add your license here]

## Support

For support or questions, please [add contact information or issue tracker link].
