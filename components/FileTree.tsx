import React from 'react';
import { FileItem } from '../types';
import { FileIcon, FolderIcon, ChevronIcon } from './Icons';

interface FileTreeProps {
  items: FileItem[];
  activeFile: string;
  onFileSelect: (fileName: string) => void;
  onToggleFolder: (folderName: string) => void;
  expandedFolders: Set<string>;
  depth?: number;
}

export const FileTree: React.FC<FileTreeProps> = ({ 
  items, 
  activeFile, 
  onFileSelect, 
  onToggleFolder,
  expandedFolders,
  depth = 0 
}) => {
  return (
    <>
      {items.map((item) => (
        <div key={item.name}>
          <div
            className={`group flex items-center py-1.5 px-3 hover:bg-slate-700/50 cursor-pointer text-sm transition-all duration-150 ${
              item.name === activeFile 
                ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-500' 
                : 'text-slate-300 hover:text-white'
            }`}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
            onClick={() => {
              if (item.type === 'folder') {
                onToggleFolder(item.name);
              } else {
                onFileSelect(item.name);
              }
            }}
          >
            <div className="flex items-center space-x-2 flex-1">
              {item.type === 'folder' && (
                <ChevronIcon isOpen={expandedFolders.has(item.name)} />
              )}
              {item.type === 'folder' ? (
                <FolderIcon isOpen={expandedFolders.has(item.name)} />
              ) : (
                <FileIcon />
              )}
              <span className="truncate">{item.name}</span>
            </div>
          </div>
          
          {item.type === 'folder' && 
           item.children && 
           expandedFolders.has(item.name) && (
            <FileTree
              items={item.children}
              activeFile={activeFile}
              onFileSelect={onFileSelect}
              onToggleFolder={onToggleFolder}
              expandedFolders={expandedFolders}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </>
  );
};
