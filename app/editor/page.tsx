'use client';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  expanded?: boolean;
}

// Modern icons
const FileIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const FolderIcon = ({ isOpen }: { isOpen?: boolean }) => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    {isOpen ? (
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    ) : (
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    )}
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg 
    className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

export default function EditorPage() {
  const [code, setCode] = useState(`// Welcome to your modern browser-based IDE
// Start building something amazing!

function createProject() {
  const ide = {
    name: "Modern IDE",
    features: ["syntax highlighting", "file explorer", "modern UI"],
    theme: "dark"
  };
  
  console.log("🚀 IDE loaded successfully!", ide);
  return ide;
}

createProject();`);
  const [activeFile, setActiveFile] = useState('main.js');
  const [language, setLanguage] = useState('javascript');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'public']));

  const fileTree: FileItem[] = [
    {
      name: 'src',
      type: 'folder',
      expanded: true,
      children: [
        { name: 'main.js', type: 'file' },
        { name: 'components.tsx', type: 'file' },
        { name: 'utils.ts', type: 'file' },
        { name: 'styles.css', type: 'file' },
      ]
    },
    {
      name: 'public',
      type: 'folder',
      expanded: true,
      children: [
        { name: 'index.html', type: 'file' },
        { name: 'favicon.ico', type: 'file' },
      ]
    },
    { name: 'README.md', type: 'file' },
    { name: 'package.json', type: 'file' },
    { name: 'tsconfig.json', type: 'file' },
  ];

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map((item, index) => (
      <div key={`${item.name}-${index}`}>
        <div 
          className={`group flex items-center py-1.5 px-3 hover:bg-slate-700/50 cursor-pointer text-sm transition-all duration-150 ${
            item.name === activeFile ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-500' : 'text-slate-300 hover:text-white'
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.name);
            } else {
              setActiveFile(item.name);
              // Enhanced language detection
              const ext = item.name.split('.').pop()?.toLowerCase();
              switch (ext) {
                case 'js':
                  setLanguage('javascript');
                  break;
                case 'jsx':
                  setLanguage('javascript');
                  break;
                case 'ts':
                  setLanguage('typescript');
                  break;
                case 'tsx':
                  setLanguage('typescript');
                  break;
                case 'css':
                  setLanguage('css');
                  break;
                case 'html':
                  setLanguage('html');
                  break;
                case 'md':
                  setLanguage('markdown');
                  break;
                case 'json':
                  setLanguage('json');
                  break;
                default:
                  setLanguage('javascript');
              }
            }
          }}
        >
          {item.type === 'folder' && (
            <ChevronIcon isOpen={expandedFolders.has(item.name)} />
          )}
          <span className={`${item.type === 'folder' ? 'ml-1' : 'ml-4'} mr-2 text-slate-400`}>
            {item.type === 'folder' ? (
              <FolderIcon isOpen={expandedFolders.has(item.name)} />
            ) : (
              <FileIcon />
            )}
          </span>
          <span className="group-hover:text-white">{item.name}</span>
        </div>
        {item.children && expandedFolders.has(item.name) && renderFileTree(item.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-0' : 'w-72'} transition-all duration-300 bg-slate-800 border-r border-slate-700/50 flex flex-col`}>
        {!sidebarCollapsed && (
          <>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="text-sm font-medium text-slate-300 tracking-wide">PROJECT EXPLORER</h2>
              </div>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-all duration-150"
                title="Collapse sidebar"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* File Tree */}
            <div className="flex-1 overflow-auto py-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
              {renderFileTree(fileTree)}
            </div>
            
            {/* Sidebar Footer */}
            <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>8 files</span>
                <span className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Ready</span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-slate-800/70 border-b border-slate-700/50 flex items-center px-4 backdrop-blur-sm">
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-150 mr-4"
              title="Expand sidebar"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          {/* Active File Tab */}
          <div className="flex items-center space-x-2 flex-1">
            <div className="bg-slate-700/50 px-4 py-2 rounded-lg text-sm flex items-center space-x-2 border border-slate-600/30 backdrop-blur-sm">
              <FileIcon />
              <span className="text-white font-medium">{activeFile}</span>
              <button className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded p-0.5 transition-all duration-150">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-3">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-700/70 text-white px-3 py-1.5 rounded-lg text-sm border border-slate-600/30 focus:border-blue-500 focus:outline-none transition-all duration-150"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="markdown">Markdown</option>
            </select>
            
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-150" title="Settings">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 relative bg-slate-900">
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
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
              fontFamily: 'Fira Code, Monaco, monospace',
              fontLigatures: true,
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>

        {/* Status Bar */}
        <footer className="h-7 bg-blue-600/90 text-white text-xs flex items-center px-4 space-x-6 backdrop-blur-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Connected</span>
          </div>
          <span>Ln 1, Col 1</span>
          <span>UTF-8</span>
          <span>Spaces: 2</span>
          <div className="flex-1"></div>
          <span className="bg-blue-700/50 px-2 py-0.5 rounded text-xs font-medium">
            {language.toUpperCase()}
          </span>
        </footer>
      </div>
    </div>
  );
}
