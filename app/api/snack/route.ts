import { NextRequest, NextResponse } from 'next/server';

interface SnackData {
  manifest: {
    name: string;
    description: string;
    sdkVersion: string;
  };
  dependencies: Record<string, string>;
  code: Record<string, {
    type: 'CODE';
    contents: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { code, fileName = 'App.js' } = await request.json();

    const snackData: SnackData = {
      manifest: {
        name: 'Mint IDE Preview',
        description: 'Created with Mint - React Native Browser IDE',
        sdkVersion: '50.0.0'
      },
      dependencies: {
        'expo': '~50.0.0',
        'expo-status-bar': '~1.11.1',
        'react': '18.2.0',
        'react-native': '0.73.4'
      },
      code: {
        [fileName]: {
          type: 'CODE',
          contents: code
        }
      }
    };

    const response = await fetch('https://exp.host/--/api/v2/snack/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Snack-Api-Version': '3.0.0',
        'User-Agent': 'Mint-IDE/1.0'
      },
      body: JSON.stringify(snackData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Snack API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `Failed to create snack: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('Snack API Response:', JSON.stringify(result, null, 2));
    
    // Use hashId which is the short identifier for public access
    const snackId = result.hashId || result.id;
    console.log('Using hashId for embed:', snackId);
    
    // Try the standard embed format with query parameters
    const embedUrl = `https://snack.expo.dev/embed/${snackId}?platform=ios&preview=true&theme=dark`;
    console.log('Generated embed URL:', embedUrl);
    
    return NextResponse.json({
      id: snackId,
      url: embedUrl,
      debug: {
        rawResponse: result,
        usedId: snackId
      }
    });

  } catch (error) {
    console.error('Error creating Expo Snack:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
