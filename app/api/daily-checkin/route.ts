import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { userContext } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a supportive mental health companion for teenagers. Generate a thoughtful, age-appropriate daily check-in question that helps them reflect on their emotions and wellbeing.

Context about the user (if available): ${userContext || 'New user'}

Requirements:
- Keep it simple and relatable for teens (ages 13-19)
- Focus on emotional awareness, self-care, or positive habits
- Be warm, non-judgmental, and supportive in tone
- Avoid clinical or overly serious language
- Make it thought-provoking but not overwhelming
- Length: 1-2 sentences max

Generate ONE unique daily check-in question:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const question = response.text();

    return NextResponse.json({ question: question.trim() });
  } catch (error: any) {
    console.error('Daily check-in error:', error);

    // Fallback questions if API fails
    const fallbackQuestions = [
      "What's one thing that made you smile today?",
      "How are you feeling right now, in this moment?",
      "What's something you're looking forward to this week?",
      "If your mood had a color today, what would it be and why?",
      "What's one thing you did today to take care of yourself?",
      "On a scale of 1-10, how much energy do you have right now?",
      "What's something you're proud of from this week, big or small?",
      "Who's someone you could reach out to if you needed support?",
    ];

    const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];

    return NextResponse.json({
      question: randomQuestion,
      fallback: true
    });
  }
}
