'use client';

import React, { useState, useEffect } from 'react';
import ReactNativeWebPreview from './ReactNativeWebPreview';

interface ExpoSnackPreviewProps {
  code: string;
  className?: string;
}

export default function ExpoSnackPreview({ code, className = '' }: ExpoSnackPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (code.trim()) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [code]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Updating preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ReactNativeWebPreview code={code} platform="ios" />
    </div>
  );
}

interface DeviceFrameProps {
  children: React.ReactNode;
  type: 'ios' | 'android';
}

function DeviceFrame({ children, type }: DeviceFrameProps) {
  if (type === 'ios') {
    return (
      <div className="relative mx-auto bg-black rounded-[3rem] p-2 shadow-xl" style={{ width: '375px', height: '812px' }}>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-black rounded-b-xl w-32 h-6 z-10"></div>
        <div className="bg-white rounded-[2.5rem] overflow-hidden h-full">
          {children}
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative mx-auto bg-gray-800 rounded-[2rem] p-1 shadow-xl" style={{ width: '360px', height: '740px' }}>
        <div className="bg-white rounded-[1.8rem] overflow-hidden h-full">
          {children}
        </div>
      </div>
    );
  }
}

interface ExpoMobilePreviewProps {
  code: string;
  deviceType: 'ios' | 'android';
  onDeviceTypeChange: (type: 'ios' | 'android') => void;
}

export function ExpoMobilePreview({ code, deviceType, onDeviceTypeChange }: ExpoMobilePreviewProps) {
  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex justify-center gap-2 p-4 bg-gray-800">
        <h3 className="text-white text-lg font-semibold mr-4">Device Preview</h3>
        <button
          onClick={() => onDeviceTypeChange('ios')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
            deviceType === 'ios' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          📱 iOS
        </button>
        <button
          onClick={() => onDeviceTypeChange('android')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
            deviceType === 'android' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🤖 Android
        </button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <DeviceFrame type={deviceType}>
          <ReactNativeWebPreview code={code} platform={deviceType} />
        </DeviceFrame>
      </div>
      
      <div className="text-center py-2 text-sm text-green-400">
        ● Live Interactive Preview
        <div className="text-gray-400 text-xs mt-1">Powered by React Native Web</div>
      </div>
    </div>
  );
}