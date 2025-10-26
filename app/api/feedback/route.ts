import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { type, message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Feedback message is required' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const timestamp = new Date().toISOString();
    const { data, error } = await resend.emails.send({
      from: "Moodify Feedback <onboarding@resend.dev>", // Resend's verified test email
      to: ["moodifykonnect@gmail.com"], // Sending to moodify account
      subject: `Moodify Feedback: ${
        type.charAt(0).toUpperCase() + type.slice(1)
      }`,
      text: `
MOODIFY FEEDBACK
================

Type: ${type.toUpperCase()}
Timestamp: ${timestamp}
Date: ${new Date(timestamp).toLocaleString()}

MESSAGE:
--------
${message}

---
Sent from Moodify App
      `,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: 'Feedback sent successfully!', id: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending feedback:', error);
    return NextResponse.json(
      { error: 'Failed to send feedback. Please try again later.' },
      { status: 500 }
    );
  }
}
