import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { moodHistory, assessmentHistory, timeframe } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"
      
     });

    // Prepare mood data summary
    const moodSummary = moodHistory
      .slice(-14) // Last 14 entries
      .map((entry: any) => `${entry.mood} (intensity: ${entry.intensity}/10)`)
      .join(', ');

    const latestAssessment = assessmentHistory[assessmentHistory.length - 1];

    const prompt = `You are a supportive mental health companion for teenagers. Analyze the following mood data and provide personalized, actionable insights.

Recent Mood Entries (last 14): ${moodSummary || 'No mood data yet'}
Latest Assessment Score: ${latestAssessment ? latestAssessment.category : 'Not completed'}
Timeframe: ${timeframe || 'past week'}

Provide a brief analysis (3-4 sentences) that:
1. Identifies any patterns or trends in their moods
2. Offers 2-3 specific, actionable suggestions for improving their wellbeing
3. Celebrates any positive patterns you notice
4. Uses warm, supportive, teen-friendly language
5. Avoids being overly clinical or alarming

Keep your response concise, supportive, and focused on practical next steps.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({ analysis: analysis.trim() });
  } catch (error: any) {
    console.error('Mood analysis error:', error);

    // Fallback analysis if API fails
    const fallbackAnalysis = `I notice you've been tracking your moods regularly - that's a great step toward self-awareness! Based on your recent entries, keep focusing on the activities and people that lift your spirits. Try to maintain consistent sleep and movement habits, as these can have a big impact on how you feel. Remember, it's normal for moods to fluctuate - you're doing great by staying mindful of your emotional wellbeing.`;

    return NextResponse.json({
      analysis: fallbackAnalysis,
      fallback: true
    });
  }
}
