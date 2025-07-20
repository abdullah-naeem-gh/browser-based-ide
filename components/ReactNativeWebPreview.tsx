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
              /* Enable touch scrolling */
              -webkit-overflow-scrolling: touch;
              touch-action: manipulation;
            }
            #root {
              width: 100vw;
              height: 100vh;
              display: flex;
              flex-direction: column;
              /* Enable touch events */
              touch-action: pan-x pan-y;
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
              /* Enable smooth mobile-like scrolling */
              -webkit-overflow-scrolling: touch;
              overscroll-behavior: contain;
              scroll-behavior: smooth;
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
              /* Enable touch scrolling */
              -webkit-overflow-scrolling: touch;
              touch-action: pan-x pan-y;
            }
            /* Mobile-friendly touch targets */
            button, input, [role="button"] {
              touch-action: manipulation;
              -webkit-tap-highlight-color: rgba(0,0,0,0.1);
            }
            /* Smooth scrolling for all scrollable elements */
            * {
              -webkit-overflow-scrolling: touch;
              scroll-behavior: smooth;
            }
            /* Hide scrollbars when requested */
            .hidden-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hidden-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
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
            
            // React Native Web Components with proper style filtering
            const View = ({ style = {}, children, ...props }) => {
              // Filter out invalid web CSS properties and convert React Native props
              const webStyle = {};
              
              // Valid CSS properties mapping
              const validProps = {
                display: style.display || 'flex',
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
                borderWidth: style.borderWidth,
                borderColor: style.borderColor,
                borderStyle: style.borderWidth ? 'solid' : undefined,
                opacity: style.opacity,
                zIndex: style.zIndex,
                overflow: style.overflow,
                color: style.color,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                textAlign: style.textAlign,
                lineHeight: style.lineHeight
              };
              
              // Add valid properties to webStyle
              Object.entries(validProps).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                  webStyle[key] = value;
                }
              });
              
              // Handle paddingHorizontal and paddingVertical
              if (style.paddingHorizontal !== undefined) {
                webStyle.paddingLeft = style.paddingHorizontal;
                webStyle.paddingRight = style.paddingHorizontal;
              }
              if (style.paddingVertical !== undefined) {
                webStyle.paddingTop = style.paddingVertical;
                webStyle.paddingBottom = style.paddingVertical;
              }
              
              // Ensure View takes full container space when flex: 1
              if (style.flex === 1) {
                webStyle.flex = '1 1 0%';
                webStyle.minHeight = '100%';
              }
              
              return React.createElement('div', { 
                style: webStyle,
                ...props 
              }, children);
            };
            
            const Text = ({ style = {}, children, ...props }) => {
              // Filter valid text CSS properties
              const webStyle = {};
              
              const validTextProps = {
                fontSize: style.fontSize || 16,
                color: style.color || '#000',
                fontWeight: style.fontWeight,
                textAlign: style.textAlign,
                marginBottom: style.marginBottom,
                marginTop: style.marginTop,
                margin: style.margin,
                padding: style.padding,
                fontStyle: style.fontStyle,
                lineHeight: style.lineHeight,
                textTransform: style.textTransform,
                textDecoration: style.textDecoration,
                opacity: style.opacity,
                backgroundColor: style.backgroundColor,
                borderRadius: style.borderRadius,
                display: style.display,
                width: style.width,
                height: style.height
              };
              
              Object.entries(validTextProps).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                  webStyle[key] = value;
                }
              });
              
              return React.createElement('span', { 
                style: webStyle,
                ...props 
              }, children);
            };
            
            const TouchableOpacity = ({ style = {}, onPress, children, ...props }) => {
              // Filter valid button CSS properties
              const webStyle = {
                border: 'none',
                backgroundColor: style.backgroundColor || 'transparent',
                cursor: 'pointer',
                padding: style.padding || 0,
                borderRadius: style.borderRadius,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
                fontSize: style.fontSize,
                color: style.color,
                fontWeight: style.fontWeight,
                margin: style.margin,
                width: style.width,
                height: style.height,
                opacity: style.opacity,
                position: style.position,
                zIndex: style.zIndex,
                overflow: style.overflow
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
              
              // Filter out undefined values
              Object.keys(webStyle).forEach(key => {
                if (webStyle[key] === undefined || webStyle[key] === null) {
                  delete webStyle[key];
                }
              });
              
              return React.createElement('button', {
                style: webStyle,
                onClick: (e) => {
                  console.log('TouchableOpacity clicked');
                  if (onPress) {
                    onPress(e);
                  }
                },
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
              
              // Filter valid input CSS properties
              const webStyle = {
                padding: 10,
                border: '1px solid #ccc',
                borderRadius: 4,
                fontSize: 16,
                outline: 'none',
                backgroundColor: style.backgroundColor || '#fff',
                color: style.color || '#000',
                width: style.width,
                height: style.height,
                margin: style.margin,
                fontWeight: style.fontWeight,
                textAlign: style.textAlign,
                opacity: style.opacity,
                borderColor: style.borderColor,
                borderWidth: style.borderWidth
              };
              
              // Add border style if borderWidth is specified
              if (style.borderWidth) {
                webStyle.borderStyle = 'solid';
                webStyle.border = style.borderWidth + 'px solid ' + (style.borderColor || '#ccc');
              }
              
              // Filter out undefined values
              Object.keys(webStyle).forEach(key => {
                if (webStyle[key] === undefined || webStyle[key] === null) {
                  delete webStyle[key];
                }
              });
              
              return React.createElement('input', {
                type: 'text',
                value: inputValue,
                onChange: handleChange,
                placeholder,
                style: webStyle,
                ...props
              });
            };
            
            const ScrollView = ({ style = {}, children, contentContainerStyle, horizontal = false, showsVerticalScrollIndicator = true, showsHorizontalScrollIndicator = true, ...props }) => {
              // Filter valid scroll container CSS properties
              const containerStyle = {
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                scrollBehavior: 'smooth',
                flex: style.flex,
                height: style.height,
                width: style.width,
                backgroundColor: style.backgroundColor,
                margin: style.margin,
                padding: style.padding,
                borderRadius: style.borderRadius,
                position: style.position
              };
              
              // Handle horizontal scrolling
              if (horizontal) {
                containerStyle.overflowX = 'auto';
                containerStyle.overflowY = 'hidden';
                containerStyle.display = 'flex';
                containerStyle.flexDirection = 'row';
              }
              
              // Hide scrollbars if disabled
              if (!showsVerticalScrollIndicator || !showsHorizontalScrollIndicator) {
                containerStyle.scrollbarWidth = 'none';
                containerStyle.msOverflowStyle = 'none';
              }
              
              // Filter out undefined values
              Object.keys(containerStyle).forEach(key => {
                if (containerStyle[key] === undefined || containerStyle[key] === null) {
                  delete containerStyle[key];
                }
              });
              
              const contentStyle = {
                minHeight: horizontal ? 'auto' : '100%',
                display: 'flex',
                flexDirection: horizontal ? 'row' : 'column'
              };
              
              // Add contentContainerStyle if provided
              if (contentContainerStyle) {
                Object.entries(contentContainerStyle).forEach(([key, value]) => {
                  if (value !== undefined && value !== null) {
                    contentStyle[key] = value;
                  }
                });
              }
              
              return React.createElement('div', { 
                style: containerStyle,
                ...props 
              }, React.createElement('div', {
                style: contentStyle
              }, children));
            };
            
            const Alert = {
              alert: (title, message, buttons) => {
                // Create a more mobile-like alert experience
                const alertMessage = title + (message ? '\\n\\n' + message : '');
                
                // Use native browser alert for now - could be enhanced with custom modals
                if (typeof window !== 'undefined') {
                  window.alert(alertMessage);
                }
                
                // Log for debugging
                console.log('Alert triggered:', title, message);
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
      sandbox="allow-scripts allow-modals"
    />
  );
}
