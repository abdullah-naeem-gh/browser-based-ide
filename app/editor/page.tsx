'use client';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { FileTree } from '../../components/FileTree';
import { ExpoMobilePreview } from '../../components/ExpoSnackPreview';
import { mockFileTree } from '../../types';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function EditorPage() {
  const [code, setCode] = useState(`import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  const handlePress = () => {
    setCount(count + 1);
    Alert.alert('Button Pressed!', \`You've pressed the button \${count + 1} times\`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Mint! 📱</Text>
        <Text style={styles.subtitle}>Interactive React Native Preview</Text>
        
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Count: {count}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setCount(count + 1)}>
            <Text style={styles.buttonText}>Tap Me!</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.textInput}
          placeholder="Type something..."
          value={text}
          onChangeText={setText}
          placeholderTextColor="#999"
        />
        
        {text ? (
          <Text style={styles.inputDisplay}>You typed: {text}</Text>
        ) : null}
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  counterText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    width: 200,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputDisplay: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
  },
});`);

  const [activeFile, setActiveFile] = useState('App.js');
  const [language] = useState('javascript');
  const [deviceType, setDeviceType] = useState<'ios' | 'android'>('ios');
  const [expandedFolders, setExpandedFolders] = useState(new Set(['components', 'screens']));

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* File Explorer Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="px-4 py-3 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <span className="text-blue-400">📱</span>
            <span>Mint Project</span>
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <FileTree
            items={mockFileTree}
            activeFile={activeFile}
            onFileSelect={setActiveFile}
            onToggleFolder={toggleFolder}
            expandedFolders={expandedFolders}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="bg-slate-800 border-b border-slate-700 px-4 py-2">
            <div className="flex items-center space-x-4">
              <div className="bg-slate-700 px-3 py-1.5 rounded-t text-sm text-slate-200 border-b-2 border-blue-500">
                {activeFile}
              </div>
            </div>
          </div>
          
          {/* Editor */}
          <div className="flex-1 bg-slate-900">
            <MonacoEditor
              height="100%"
              language={language}
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                folding: true,
                lineNumbersMinChars: 3,
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible',
                },
              }}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-96 border-l border-slate-700 bg-slate-800">
          <ExpoMobilePreview
            code={code}
            deviceType={deviceType}
            onDeviceTypeChange={setDeviceType}
          />
        </div>
      </div>
    </div>
  );
}
