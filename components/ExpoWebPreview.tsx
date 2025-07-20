import React, { useState, useEffect, useRef } from 'react';

interface ExpoWebPreviewProps {
  code: string;
  deviceType: 'ios' | 'android';
  onError?: (error: string) => void;
  onReady?: () => void;
}

export const ExpoWebPreview: React.FC<ExpoWebPreviewProps> = ({
  code,
  deviceType,
  onError,
  onReady
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updatePreview = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        // Create the HTML document for React Native Web
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>React Native Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/react-native-web@0.19.9/dist/index.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow: hidden;
    }
    
    #root {
      height: 100vh;
      width: 100vw;
    }

    /* iOS-specific styles */
    .ios-device {
      font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', sans-serif;
    }

    /* Android-specific styles */
    .android-device {
      font-family: 'Roboto', sans-serif;
    }

    /* Status bar simulation */
    .status-bar {
      height: 44px;
      background: ${deviceType === 'ios' ? '#f8f8f8' : '#333'};
      color: ${deviceType === 'ios' ? '#000' : '#fff'};
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      font-size: 14px;
      font-weight: 600;
      position: relative;
      z-index: 1000;
    }

    .app-container {
      height: calc(100vh - 44px);
      overflow: hidden;
    }
  </style>
</head>
<body class="${deviceType}-device">
  <div class="status-bar">
    <span>9:41 AM</span>
    <span>${deviceType === 'ios' ? '🔋 100%' : '🔋'}</span>
  </div>
  <div id="root" class="app-container"></div>

  <script>
    // Error handling
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      parent.postMessage({
        type: 'error',
        message: msg,
        line: lineNo,
        column: columnNo
      }, '*');
      return false;
    };

    window.addEventListener('unhandledrejection', function(event) {
      parent.postMessage({
        type: 'error',
        message: event.reason.message || 'Unhandled promise rejection'
      }, '*');
    });

    try {
      // Transform the code - properly escape newlines and quotes
      const escapedCode = code
        .replace(/\\/g, '\\\\')  // Escape backslashes
        .replace(/'/g, "\\'")    // Escape single quotes
        .replace(/"/g, '\\"')    // Escape double quotes
        .replace(/\n/g, '\\n')   // Escape newlines
        .replace(/\r/g, '\\r');  // Escape carriage returns
        
      const transformedCode = Babel.transform(escapedCode, {
        presets: ['react', 'env'],
        plugins: [
          ['transform-react-jsx', { pragma: 'React.createElement' }]
        ]
      }).code;

      // Create a function to run the code
      const runCode = new Function(
        'React',
        'ReactDOM',
        'ReactNative',
        \`
        const { 
          View,
          Text,
          StyleSheet,
          TouchableOpacity,
          Image,
          TextInput,
          ScrollView,
          FlatList,
          SafeAreaView,
          AppRegistry 
        } = ReactNative;
        
        // Mock expo-status-bar
        const StatusBar = ({ style, ...props }) => null;
        
        // Mock Platform
        const Platform = {
          OS: '${deviceType === 'ios' ? 'ios' : 'android'}',
          select: (obj) => obj['${deviceType === 'ios' ? 'ios' : 'android'}'] || obj.default
        };

        // Mock Alert
        const Alert = {
          alert: (title, message, buttons) => {
            if (buttons && buttons.length > 0) {
              const result = confirm(title + '\\n' + (message || ''));
              if (result && buttons[0].onPress) {
                buttons[0].onPress();
              }
            } else {
              alert(title + '\\n' + (message || ''));
            }
          }
        };

        // Mock Dimensions
        const Dimensions = {
          get: () => ({ width: window.innerWidth, height: window.innerHeight - 44 })
        };

        // Execute the transformed code
        \${transformedCode}
        
        // Find and render the default export (App component)
        const AppComponent = typeof App !== 'undefined' ? App : 
                           typeof module !== 'undefined' && module.exports ? module.exports :
                           null;
        
        if (AppComponent) {
          const root = ReactDOM.createRoot ? ReactDOM.createRoot(document.getElementById('root')) : null;
          if (root) {
            root.render(React.createElement(AppComponent));
          } else {
            ReactDOM.render(React.createElement(AppComponent), document.getElementById('root'));
          }
        } else {
          // Fallback: try to find any React component and render it
          const rootElement = document.getElementById('root');
          if (rootElement) {
            rootElement.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No App component found</div>';
          }
        }
        \`
      );

      const {
        View,
        Text,
        StyleSheet,
        TouchableOpacity,
        Image,
        TextInput,
        ScrollView,
        FlatList,
        SafeAreaView,
      } = ReactNative;

      runCode(
        React,
        ReactDOM,
        ReactNative
      );

      // Signal that preview is ready
      parent.postMessage({ type: 'ready' }, '*');

    } catch (error) {
      parent.postMessage({
        type: 'error',
        message: error.message,
        stack: error.stack
      }, '*');
    }
  </script>
</body>
</html>`;

        doc.open();
        doc.write(htmlContent);
        doc.close();

        setError(null);
        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setIsLoading(false);
        onError?.(errorMessage);
      }
    };

    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'error') {
        setError(event.data.message);
        onError?.(event.data.message);
      } else if (event.data.type === 'ready') {
        setIsLoading(false);
        onReady?.();
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Small delay to ensure iframe is ready
    const timer = setTimeout(updatePreview, 100);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, [code, deviceType, onError, onReady]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading preview...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10 p-4">
          <div className="text-center max-w-md">
            <div className="text-red-600 text-lg mb-2">⚠️ Preview Error</div>
            <p className="text-sm text-red-800 bg-red-100 p-3 rounded border">
              {error}
            </p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
        title="React Native Preview"
      />
    </div>
  );
};

// Enhanced Mobile Preview with real React Native Web rendering
export const EnhancedMobilePreview: React.FC<{
  code: string;
  deviceType: 'ios' | 'android';
  onDeviceTypeChange: (type: 'ios' | 'android') => void;
}> = ({ code, deviceType, onDeviceTypeChange }) => {
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isPreviewReady, setIsPreviewReady] = useState(false);

  return (
    <div className="flex flex-col items-center bg-slate-800 p-6 h-full">
      {/* Device Type Selector */}
      <div className="flex items-center space-x-4 mb-4">
        <h3 className="text-sm font-medium text-slate-300">Device Preview</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onDeviceTypeChange('ios')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              deviceType === 'ios' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            📱 iOS
          </button>
          <button
            onClick={() => onDeviceTypeChange('android')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${
              deviceType === 'android' 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            🤖 Android
          </button>
        </div>
      </div>

      {/* Device Frame */}
      <div className={`
        relative bg-black rounded-3xl p-2 shadow-2xl flex-1 w-full max-w-sm
        ${deviceType === 'ios' ? 'rounded-3xl' : 'rounded-2xl'}
      `}>
        {/* iOS Notch */}
        {deviceType === 'ios' && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
        )}
        
        {/* Screen Container */}
        <div className={`
          w-full h-full bg-white overflow-hidden relative
          ${deviceType === 'ios' ? 'rounded-3xl' : 'rounded-2xl'}
        `}>
          <ExpoWebPreview
            code={code}
            deviceType={deviceType}
            onError={setPreviewError}
            onReady={() => setIsPreviewReady(true)}
          />
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 text-xs text-center">
        <div className={`flex items-center justify-center space-x-2 ${
          previewError ? 'text-red-400' : isPreviewReady ? 'text-green-400' : 'text-yellow-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            previewError ? 'bg-red-400' : isPreviewReady ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-pulse'
          }`}></div>
          <span>
            {previewError ? 'Preview Error' : isPreviewReady ? 'Live Preview' : 'Loading...'}
          </span>
        </div>
        <div className="text-slate-400 mt-1">
          Powered by React Native Web
        </div>
      </div>
    </div>
  );
};
