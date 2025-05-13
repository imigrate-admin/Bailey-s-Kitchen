import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Log the incoming debug information
    console.log('NextAuth Debug Log:', {
      timestamp: new Date().toISOString(),
      ...body
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing NextAuth debug log:', error);
    return NextResponse.json(
      { error: 'Failed to process debug log' },
      { status: 500 }
    );
  }
}

