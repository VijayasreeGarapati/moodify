# Moodify

A privacy-focused mental health companion app for teenagers to track emotions, discover patterns, and build wellbeing habits.

## Overview

Moodify empowers teenagers with tools to understand and manage their mental health. With AI-powered insights, daily reflections, and comprehensive mood tracking, Moodify provides a safe space for emotional wellbeing—all while keeping data 100% private and local.

## Features

### Core Functionality
- **Mood Tracking** - Log daily emotions with intensity levels and optional notes
- **AI-Powered Insights** - Personalized mood analysis and recommendations using Google Gemini AI
- **Daily Check-Ins** - AI-generated reflection questions tailored for teens
- **Mental Health Assessment** - 8-question questionnaire to evaluate emotional wellbeing
- **Visual Analytics** - Interactive charts and statistics showing mood trends over time
- **Crisis Resources** - Always-accessible crisis support hotlines and mental health resources
- **User Feedback** - Send bug reports, feature requests, or general feedback directly from the app

### Privacy & Security
- **Local-First Storage** - All personal data is stored on your device using browser localStorage
- **Cloud Backup** - Anonymized data can be backed up to Supabase for research purposes 
- **PIN Protection** - Secure your data with a personal 4+ digit PIN
- **Auto Data Cleanup** - Automatically removes local data older than 3 months
- **Complete Data Control** - Delete all local data instantly from settings
- **Age Verification** - Minimum age requirement of 13 years with parental consent

### User Experience
- **Fully Responsive** - Optimized for mobile, tablet, and desktop
- **Touch-Friendly UI** - Designed for modern touch interfaces
- **No Login Required** - Start using immediately without creating an account
- **Offline-First** - Works without internet connection (except AI features)

## Tech Stack

- **Framework:** Next.js 16.0.0 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI:** Google Gemini AI (gemini-2.0-flash)
- **Email:** Resend (for user feedback)
- **Database:** Supabase (optional, for analytics)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Storage:** Browser localStorage (primary) + Supabase (optional)

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd moodify
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory:
   ```bash
   # Required for AI features
   GEMINI_API_KEY=your_gemini_api_key_here

   # Required for feedback email functionality
   RESEND_API_KEY=your_resend_api_key_here

   # Optional: For cloud analytics/backup
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Get your API keys:**
   - Gemini AI: [Google AI Studio](https://aistudio.google.com/app/apikey) (free tier available)
   - Resend: [Resend Dashboard](https://resend.com/api-keys) (free tier: 100 emails/day, 3,000/month)
   - Supabase (optional): [Supabase Dashboard](https://supabase.com/dashboard) (free tier available)

   **Note:**
   - The app works fully without Supabase. It's only used for optional analytics and research data.
   - For Resend: Create an account with the email address where you want to receive feedback (e.g., `moodifykonnect@gmail.com`). When using the free test domain `onboarding@resend.dev`, feedback emails can only be sent to the account owner's email address.

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

**Privacy Note:** Only anonymized mood patterns are sent to AI—no personal information, notes, or identifying details.

## Project Structure

```
moodify/
├── app/
│   ├── api/
│   │   ├── analyze-mood/     # AI mood analysis endpoint
│   │   ├── daily-checkin/    # AI daily question generation
│   │   └── feedback/         # User feedback email endpoint
│   ├── page.tsx              # Main app with state management
│   └── globals.css           # Global styles
│
├── components/
│   ├── welcome/              # Age verification & consent
│   ├── onboarding/           # User profile setup
│   ├── questionnaire/        # Mental health assessment
│   ├── dashboard/            # Main tracking interface
│   ├── resources/            # Crisis support & resources
│   └── feedback/             # Settings & data management
│
├── lib/
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript interfaces
│   └── utils/                # Helper functions
│
└── .env.local                # Environment variables (not in git)
```

## Mental Health Resources

Moodify provides always-accessible mental health resources including:

- **988 Suicide & Crisis Lifeline** - 24/7 support
- **Crisis Text Line** - Text HOME to 741741
- **Trevor Project** - LGBTQ+ youth support (1-866-488-7386)
- **RAINN** - Sexual assault support (1-800-656-4673)
- **Teen Line** - Peer support (1-800-852-8336)
- **SAMHSA National Helpline** - Mental health referrals (1-800-662-4357)

Access resources anytime via the persistent floating buttons on every screen.

## Important Disclaimer

**Moodify is NOT a substitute for professional mental health care.** This app provides educational content and self-tracking tools only.

**In a crisis, call 911 or contact:**
- 988 Suicide & Crisis Lifeline
- Crisis Text Line: Text HOME to 741741

If you're experiencing a mental health emergency, contact emergency services or visit your nearest emergency room immediately.

## Contributing

When contributing to this project:
1. Prioritize user privacy and data security
2. Ensure all content is age-appropriate for teenagers
3. Follow evidence-based mental health practices
4. Test thoroughly across devices and screen sizes
5. Maintain the local-only storage approach


## Support

For questions, issues, or feedback, please open an issue in the repository.

---

**Built with care for teen mental health and wellbeing.**
