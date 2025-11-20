import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, target_format } = body;

    if (!image || !target_format) {
      return NextResponse.json(
        { error: 'Missing required fields: image and target_format' },
        { status: 400 }
      );
    }

    const bffUrl = process.env.BFF_URL || 'http://localhost:8001';

    // Call BFF service
    const response = await fetch(`${bffUrl}/detect-faces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_base64: image,
        target_format: target_format,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('BFF service error:', errorText);
      return NextResponse.json(
        { error: `BFF service error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform BFF response to frontend format
    const faces = data['cropped_faces'] || [];

    return NextResponse.json({
      success: true,
      faces: faces,
      fileType: target_format,
    });
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
