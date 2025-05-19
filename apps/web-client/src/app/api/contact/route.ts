import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Basic spam prevention
    if (message.includes('http://') || message.includes('https://')) {
      return NextResponse.json(
        { message: 'Links are not allowed in messages' },
        { status: 400 }
      );
    }

    // Forward the request to the contact service
    try {
      const response = await fetch(`${API_CONFIG.CONTACT_SERVICE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { message: data.message || 'Failed to send message' },
          { status: response.status }
        );
      }

      return NextResponse.json(
        { message: 'Message sent successfully' },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Contact service error:', error);
      return NextResponse.json(
        { message: 'Failed to send message' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Invalid request format' },
      { status: 400 }
    );
  }
}