'use client';

import React, { useEffect, useState } from 'react';

interface ReactNativeWebPreviewProps {
  code: string;
  platform: 'ios' | 'android';
}

export default function ReactNativeWebPreview({ code, platform }: ReactNativeWebPreviewProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Transform React Native code to React Web code
      const transformedCode = transformReactNativeToWeb(code);
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React Native Preview</title>
          <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: ${platform === 'ios' ? '#000' : '#fff'};
              overflow: hidden;
              -webkit-font-smoothing: antialiased;
            }
            #root {
              width: 100vw;
              height: 100vh;
              display: flex;
              flex-direction: column;
            }
            .status-bar {
              height: 44px;
              background: ${platform === 'ios' ? '#000' : '#2196F3'};
              color: white;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 20px;
              font-size: 14px;
              font-weight: 600;
              flex-shrink: 0;
            }
            .app-container {
              flex: 1;
              background: ${platform === 'ios' ? '#fff' : '#f5f5f5'};
              overflow: auto;
              display: flex;
              flex-direction: column;
              min-height: 0; /* Important for flex containers */
            }
            .error-container {
              padding: 20px;
              background: #ffebee;
              border: 1px solid #f44336;
              border-radius: 4px;
              margin: 20px;
              color: #c62828;
              font-family: monospace;
              white-space: pre-wrap;
            }
            /* Fix React Native layout issues */
            button {
              font-family: inherit;
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
            }
            input {
              font-family: inherit;
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
            }
            input::placeholder {
              color: #999;
              opacity: 1;
            }
            /* Ensure full height containers */
            #app {
              flex: 1;
              display: flex;
              flex-direction: column;
              min-height: 0;
            }
          </style>
        </head>
        <body>
          <div id="root">
            <div class="status-bar">
              <span>${platform === 'ios' ? '9:41' : '12:30'}</span>
              <span>${platform === 'ios' ? '📶 📶 📶' : '🔋 WiFi 4G'}</span>
            </div>
            <div class="app-container" id="app"></div>
          </div>
          
          <script type="text/babel" data-type="module">
            const { useState, useEffect, useCallback } = React;
            
            // React Native Web Components with proper mobile layout
            const View = ({ style = {}, children, ...props }) => {
              const webStyle = {
                display: 'flex',
                flexDirection: style.flexDirection || 'column',
                alignItems: style.alignItems,
                justifyContent: style.justifyContent,
                flex: style.flex,
                padding: style.padding,
                margin: style.margin,
                backgroundColor: style.backgroundColor,
                borderRadius: style.borderRadius,
                width: style.width,
                height: style.height,
                position: style.position,
                minHeight: style.minHeight,
                // Ensure View takes full container space when flex: 1
                ...(style.flex === 1 && { 
                  flex: '1 1 0%',
                  minHeight: '100%'
                }),
                ...style
              };
              
              // Handle paddingHorizontal and paddingVertical
              if (style.paddingHorizontal !== undefined) {
                webStyle.paddingLeft = style.paddingHorizontal;
                webStyle.paddingRight = style.paddingHorizontal;
                delete webStyle.paddingHorizontal;
              }
              if (style.paddingVertical !== undefined) {
                webStyle.paddingTop = style.paddingVertical;
                webStyle.paddingBottom = style.paddingVertical;
                delete webStyle.paddingVertical;
              }
              
              return React.createElement('div', { 
                style: webStyle,
                ...props 
              }, children);
            };
            
            const Text = ({ style = {}, children, ...props }) => {
              const webStyle = {
                fontSize: style.fontSize || 16,
                color: style.color || '#000',
                fontWeight: style.fontWeight,
                textAlign: style.textAlign,
                marginBottom: style.marginBottom,
                marginTop: style.marginTop,
                margin: style.margin,
                padding: style.padding,
                fontStyle: style.fontStyle,
                ...style
              };
              
              return React.createElement('span', { 
                style: webStyle,
                ...props 
              }, children);
            };
            
            const TouchableOpacity = ({ style = {}, onPress, children, ...props }) => {
              const webStyle = {
                border: 'none',
                backgroundColor: style.backgroundColor || 'transparent',
                cursor: 'pointer',
                padding: style.padding || 0,
                paddingHorizontal: style.paddingHorizontal,
                paddingVertical: style.paddingVertical,
                borderRadius: style.borderRadius,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
                ...style
              };
              
              // Handle paddingHorizontal and paddingVertical
              if (style.paddingHorizontal !== undefined) {
                webStyle.paddingLeft = style.paddingHorizontal;
                webStyle.paddingRight = style.paddingHorizontal;
              }
              if (style.paddingVertical !== undefined) {
                webStyle.paddingTop = style.paddingVertical;
                webStyle.paddingBottom = style.paddingVertical;
              }
              
              return React.createElement('button', {
                style: webStyle,
                onClick: onPress,
                ...props
              }, children);
            };
            
            const TextInput = ({ style = {}, value, onChangeText, placeholder, placeholderTextColor, ...props }) => {
              const [inputValue, setInputValue] = React.useState(value || '');
              
              const handleChange = (e) => {
                const newValue = e.target.value;
                setInputValue(newValue);
                if (onChangeText) onChangeText(newValue);
              };
              
              return React.createElement('input', {
                type: 'text',
                value: inputValue,
                onChange: handleChange,
                placeholder,
                style: {
                  padding: 10,
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  fontSize: 16,
                  outline: 'none',
                  ...(placeholderTextColor && {
                    '::placeholder': { color: placeholderTextColor }
                  }),
                  ...style
                },
                ...props
              });
            };
            
            const ScrollView = ({ style = {}, children, contentContainerStyle, ...props }) => {
              const containerStyle = {
                overflow: 'auto',
                flex: style.flex,
                height: style.height,
                width: style.width,
                backgroundColor: style.backgroundColor,
                ...style
              };
              
              const contentStyle = {
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                ...contentContainerStyle
              };
              
              return React.createElement('div', { 
                style: containerStyle,
                ...props 
              }, React.createElement('div', {
                style: contentStyle
              }, children));
            };
            
            const Alert = {
              alert: (title, message, buttons) => {
                alert(title + (message ? '\\n' + message : ''));
              }
            };
            
            const StyleSheet = {
              create: (styles) => styles
            };
            
            // Platform detection
            const Platform = {
              OS: '${platform}',
              select: (options) => options[Platform.OS] || options.default
            };
            
            // StatusBar (no-op for web)
            const StatusBar = ({ style, backgroundColor, ...props }) => null;
            
            try {
              // User's transformed code
              ${transformedCode}
              
              // Render the app using the function name from the code
              const container = document.getElementById('app');
              const root = ReactDOM.createRoot(container);
              const AppComponent = window.App || App;
              root.render(React.createElement(AppComponent));
              
            } catch (error) {
              console.error('App Error:', error);
              const container = document.getElementById('app');
              container.innerHTML = \`
                <div class="error-container">
                  <strong>Error:</strong><br>
                  \${error.message}
                  <br><br>
                  <strong>Stack:</strong><br>
                  \${error.stack}
                </div>
              \`;
            }
          </script>
        </body>
        </html>
      `;
      
      setHtmlContent(html);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [code, platform]);

  const transformReactNativeToWeb = (code: string): string => {
    let transformed = code;
    
    // Remove all import statements - we provide components globally
    transformed = transformed.replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*\n?/g, '');
    
    // Remove export default and just keep the function
    transformed = transformed.replace(/export\s+default\s+function\s+(\w+)/g, 'function $1');
    
    // Ensure the function is available globally
    const functionMatch = transformed.match(/function\s+(\w+)/);
    const functionName = functionMatch ? functionMatch[1] : 'App';
    
    // Make sure the function is assigned to window for global access
    if (!transformed.includes(`window.${functionName}`)) {
      transformed += `\nwindow.${functionName} = ${functionName};`;
    }
    
    return transformed;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50">
        <div className="text-red-600 text-center p-4">
          <h3 className="font-bold mb-2">Preview Error</h3>
          <p className="text-sm font-mono">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={htmlContent}
      className="w-full h-full border-0"
      title="React Native Web Preview"
      sandbox="allow-scripts"
    />
  );
}
