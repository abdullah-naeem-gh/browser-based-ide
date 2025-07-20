export interface SnackFile {
  type: 'CODE';
  contents: string;
}

export interface SnackManifest {
  name: string;
  description: string;
  sdkVersion: string;
}

export interface SnackData {
  manifest: SnackManifest;
  dependencies: Record<string, string>;
  code: Record<string, SnackFile>;
}

export interface SnackResponse {
  id: string;
  url: string;
}

export class ExpoSnackService {
  private static readonly LOCAL_API_URL = '/api/snack';
  private static readonly EMBED_BASE_URL = 'https://snack.expo.dev/embed';
  
  static async createSnack(code: string, fileName: string = 'App.js'): Promise<SnackResponse> {
    try {
      const response = await fetch(this.LOCAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, fileName })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Local API Error:', response.status, errorData);
        throw new Error(`Failed to create snack: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Snack created successfully:', result);
      
      return {
        id: result.id,
        url: result.url
      };
    } catch (error) {
      console.error('Error creating Expo Snack:', error);
      throw error;
    }
  }

  static getEmbedUrl(snackId: string, options?: {
    platform?: 'ios' | 'android' | 'web';
    preview?: boolean;
    theme?: 'light' | 'dark';
  }): string {
    const params = new URLSearchParams();
    
    if (options?.platform) {
      params.append('platform', options.platform);
    }
    
    if (options?.preview !== undefined) {
      params.append('preview', options.preview.toString());
    }
    
    if (options?.theme) {
      params.append('theme', options.theme);
    }

    const queryString = params.toString();
    return `${this.EMBED_BASE_URL}/${snackId}${queryString ? `?${queryString}` : ''}`;
  }
}
